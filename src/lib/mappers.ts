// Map row Prisma → tipe domain UI (src/lib/types.ts).
// Konversi Decimal/BigInt/Date agar aman dikirim ke Client Component.

import type {
  AuditLog as PrismaAuditLog,
  Property as PrismaProperty,
  User as PrismaUser,
} from "@prisma/client";
import type {
  AuditLog,
  Hadap,
  Property,
  Siap,
  User,
} from "./types";

export function mapProperty(p: PrismaProperty): Property {
  return {
    id: p.id,
    nama_property: p.namaProperty,
    group: p.group,
    lebar: Number(p.lebar),
    panjang: Number(p.panjang),
    hadap: p.hadap as Hadap[],
    tipe: p.tipe,
    tingkat: Number(p.tingkat),
    price: Number(p.price), // bigint → number (nilai rupiah dalam range aman JS)
    carport: p.carport,
    status: p.status,
    siap: p.siap as Siap,
    maps_link: p.mapsLink,
    kawasan: p.kawasan,
    unit: p.unit,
    image_url: p.imageUrl,
    created_at: p.createdAt.toISOString(),
    updated_at: p.updatedAt.toISOString(),
    created_by: p.createdBy ?? "",
    deleted_at: p.deletedAt ? p.deletedAt.toISOString() : null,
  };
}

export function mapUser(u: PrismaUser): User {
  return {
    id: u.id,
    nama: u.nama,
    email: u.email,
    role: u.role,
    is_active: u.isActive,
    created_at: u.createdAt.toISOString(),
  };
}

type AuditChange = { field: string; before: string; after: string };

export function mapAuditLog(a: PrismaAuditLog): AuditLog {
  return {
    id: a.id,
    user_id: a.userId ?? "",
    user_nama: a.userNama,
    property_id: a.propertyId,
    property_nama: a.propertyNama,
    action: a.action,
    changes: Array.isArray(a.changes) ? (a.changes as AuditChange[]) : [],
    created_at: a.createdAt.toISOString(),
  };
}
