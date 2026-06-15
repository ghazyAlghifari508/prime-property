"use server";

import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireSuperadmin } from "@/lib/auth";
import { mapProperty } from "@/lib/mappers";
import { propertyFormSchema } from "@/lib/property-schema";
import type { PropertyFilterState } from "@/lib/property-filter";
import { formatRupiah } from "@/lib/format";
import { SIAP_LABEL, STATUS_LABEL } from "@/lib/constants";
import { isValidUuid } from "@/lib/utils";
import type { Property } from "@/lib/types";

export interface ListResult {
  items: Property[];
  total: number;
}

/** Bangun where Prisma dari filter (AC-7.2). */
function buildWhere(f: Partial<PropertyFilterState>): Prisma.PropertyWhereInput {
  const where: Prisma.PropertyWhereInput = { deletedAt: null };
  const and: Prisma.PropertyWhereInput[] = [];

  if (f.kawasan && f.kawasan.length) where.kawasan = { hasSome: f.kawasan };
  if (f.hadap && f.hadap.length) where.hadap = { hasSome: f.hadap };
  if (f.siap && f.siap.length) where.siap = { in: f.siap };
  if (f.lebarMin) where.lebar = { gte: Number(f.lebarMin) };
  if (f.hargaMax) where.price = { lte: BigInt(Math.floor(Number(f.hargaMax))) };
  if (f.tipe && f.tipe !== "all") where.tipe = f.tipe;
  if (f.status && f.status !== "all") where.status = f.status;
  if (f.carport === "yes") where.carport = true;
  if (f.carport === "no") where.carport = false;

  if (and.length) where.AND = and;
  return where;
}

function buildOrderBy(
  f: Partial<PropertyFilterState>,
): Prisma.PropertyOrderByWithRelationInput {
  const dir = f.dir === "asc" ? "asc" : "desc";
  switch (f.sort) {
    case "nama":
      return { namaProperty: dir };
    case "harga":
      return { price: dir };
    case "status":
      return { status: dir };
    case "tanggal":
    default:
      return { createdAt: dir };
  }
}

/** Ambil SEMUA properti aktif (tanpa filter/sort/pagination) — untuk client-side filtering real-time (AC-7.2). */
export async function listAllProperties(): Promise<Property[]> {
  const rows = await prisma.property.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(mapProperty);
}

export async function listProperties(
  f: Partial<PropertyFilterState>,
): Promise<ListResult> {
  const where = buildWhere(f);
  const pageSize = f.pageSize && [25, 50, 100].includes(f.pageSize)
    ? f.pageSize
    : 50;
  const page = Math.max(1, f.page ?? 1);

  // Kawasan partial text search via raw SQL (Prisma `has` hanya exact match).
  let kawasanIds: string[] = [];
  if (f.q && f.q.trim()) {
    const q = f.q.trim();
    const raw = await prisma.$queryRawUnsafe<{ id: string }[]>(
      `SELECT id FROM properties WHERE deleted_at IS NULL AND EXISTS (
        SELECT 1 FROM unnest(kawasan) k WHERE k ILIKE '%' || $1 || '%'
      )`,
      q,
    );
    kawasanIds = raw.map((r) => r.id);
  }

  // Gabungkan hasil kawasan partial ke dalam OR filter
  const finalWhere: typeof where = { ...where };
  if (f.q && f.q.trim()) {
    const q = f.q.trim();
    // Ganti rule q sebelumnya yang ditaruh di and
    finalWhere.AND = (where.AND as Prisma.PropertyWhereInput[]).filter(
      (cond) => !("OR" in cond)
    );
    const orConds: Prisma.PropertyWhereInput[] = [
      { namaProperty: { contains: q, mode: "insensitive" } },
      { group: { contains: q, mode: "insensitive" } },
    ];
    if (kawasanIds.length > 0) {
      orConds.push({ id: { in: kawasanIds } });
    }
    const finalAnd = finalWhere.AND as Prisma.PropertyWhereInput[];
    finalAnd.push({ OR: orConds });
  }

  const [rows, total] = await Promise.all([
    prisma.property.findMany({
      where: finalWhere,
      orderBy: buildOrderBy(f),
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.property.count({ where: finalWhere }),
  ]);

  return { items: rows.map(mapProperty), total };
}

/** Statistik ringkasan (seluruh properti aktif). */
export async function getPropertyStats() {
  const [total, inStock, soldOut, all] = await Promise.all([
    prisma.property.count({ where: { deletedAt: null } }),
    prisma.property.count({ where: { deletedAt: null, status: "in_stock" } }),
    prisma.property.count({ where: { deletedAt: null, status: "sold_out" } }),
    prisma.property.findMany({
      where: { deletedAt: null },
      select: { kawasan: true },
    }),
  ]);
  const kawasan = new Set(all.flatMap((p) => p.kawasan)).size;
  return { total, inStock, soldOut, kawasan };
}

export async function getProperty(id: string): Promise<Property | null> {
  if (!isValidUuid(id)) return null;
  const row = await prisma.property.findFirst({
    where: { id, deletedAt: null },
  });
  return row ? mapProperty(row) : null;
}

/** Properti unggulan untuk landing publik. */
export async function getFeaturedProperties(limit = 6): Promise<Property[]> {
  const rows = await prisma.property.findMany({
    where: { deletedAt: null, status: "in_stock" },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return rows.map(mapProperty);
}

// ===== Mutasi (superadmin only) =====

export interface MutationResult {
  ok: boolean;
  id?: string;
  error?: string;
}

type FormInput = Record<string, unknown>;

function normalize(input: FormInput) {
  const parsed = propertyFormSchema.parse(input);
  return {
    namaProperty: parsed.nama_property.trim(),
    group: parsed.group?.trim() ? parsed.group.trim() : null,
    lebar: parsed.lebar,
    panjang: parsed.panjang,
    hadap: parsed.hadap,
    tipe: parsed.tipe,
    tingkat: parsed.tingkat,
    price: BigInt(parsed.price),
    carport: parsed.carport,
    status: parsed.status,
    siap: parsed.siap,
    mapsLink: parsed.maps_link?.trim() ? parsed.maps_link.trim() : null,
    kawasan: parsed.kawasan,
    unit: parsed.unit?.trim() ? parsed.unit.trim() : null,
  };
}

export async function createProperty(input: FormInput): Promise<MutationResult> {
  try {
    const user = await requireSuperadmin();
    const data = normalize(input);
    const created = await prisma.property.create({
      data: { ...data, createdBy: user.id },
    });
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userNama: user.nama,
        propertyId: created.id,
        propertyNama: created.namaProperty,
        action: "create",
        changes: [],
      },
    });
    return { ok: true, id: created.id };
  } catch (e) {
    return { ok: false, error: errMsg(e) };
  }
}

export async function updateProperty(
  id: string,
  input: FormInput,
): Promise<MutationResult> {
  try {
    const user = await requireSuperadmin();
    if (!isValidUuid(id))
      return { ok: false, error: "Properti tidak ditemukan." };
    const data = normalize(input);
    const before = await prisma.property.findFirst({
      where: { id, deletedAt: null },
    });
    if (!before) return { ok: false, error: "Properti tidak ditemukan." };

    const updated = await prisma.property.update({ where: { id }, data });

    // Catat diff (AC-8.2)
    const changes = diffProperty(before, updated);
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userNama: user.nama,
        propertyId: updated.id,
        propertyNama: updated.namaProperty,
        action: "update",
        changes,
      },
    });
    return { ok: true, id: updated.id };
  } catch (e) {
    return { ok: false, error: errMsg(e) };
  }
}

export async function deleteProperty(id: string): Promise<MutationResult> {
  try {
    const user = await requireSuperadmin();
    if (!isValidUuid(id))
      return { ok: false, error: "Properti tidak ditemukan." };
    const before = await prisma.property.findFirst({
      where: { id, deletedAt: null },
    });
    if (!before) return { ok: false, error: "Properti tidak ditemukan." };

    await prisma.property.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userNama: user.nama,
        propertyId: before.id,
        propertyNama: before.namaProperty,
        action: "delete",
        changes: [],
      },
    });
    return { ok: true, id };
  } catch (e) {
    return { ok: false, error: errMsg(e) };
  }
}

// ===== helpers =====

type Change = { field: string; before: string; after: string };

function diffProperty(
  before: import("@prisma/client").Property,
  after: import("@prisma/client").Property,
): Change[] {
  const changes: Change[] = [];
  const push = (field: string, b: string, a: string) => {
    if (b !== a) changes.push({ field, before: b, after: a });
  };
  push("Nama", before.namaProperty, after.namaProperty);
  push("Group", before.group ?? "—", after.group ?? "—");
  push("Lebar", String(before.lebar), String(after.lebar));
  push("Panjang", String(before.panjang), String(after.panjang));
  push("Hadap", before.hadap.join(", "), after.hadap.join(", "));
  push("Tipe", before.tipe, after.tipe);
  push("Tingkat", String(before.tingkat), String(after.tingkat));
  push("Harga", formatRupiah(Number(before.price)), formatRupiah(Number(after.price)));
  push("Carport", before.carport ? "Ya" : "Tidak", after.carport ? "Ya" : "Tidak");
  push("Status", STATUS_LABEL[before.status], STATUS_LABEL[after.status]);
  push("Kesiapan", SIAP_LABEL[before.siap], SIAP_LABEL[after.siap]);
  push("Kawasan", before.kawasan.join(", "), after.kawasan.join(", "));
  push("Unit", before.unit ?? "—", after.unit ?? "—");
  return changes;
}

function errMsg(e: unknown): string {
  if (e instanceof Error) {
    if (e.name === "ForbiddenError") return e.message;
    if (e.name === "ZodError") return "Data tidak valid. Periksa kembali formulir.";
  }
  return "Terjadi kesalahan. Silakan coba lagi.";
}
