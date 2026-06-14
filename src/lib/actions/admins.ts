"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { requireSuperadmin } from "@/lib/auth";
import { mapUser } from "@/lib/mappers";
import type { User } from "@/lib/types";

export interface AdminResult {
  ok: boolean;
  error?: string;
  tempPassword?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function listAdmins(): Promise<User[]> {
  await requireSuperadmin();
  const rows = await prisma.user.findMany({
    where: { role: "admin" },
    orderBy: { createdAt: "asc" },
  });
  return rows.map(mapUser);
}

export async function getSuperadmin(): Promise<User | null> {
  await requireSuperadmin();
  const row = await prisma.user.findFirst({ where: { role: "superadmin" } });
  return row ? mapUser(row) : null;
}

export async function createAdmin(
  nama: string,
  email: string,
  password: string,
): Promise<AdminResult> {
  try {
    await requireSuperadmin();
    const n = nama.trim();
    const e = email.trim().toLowerCase();
    if (!n || !e) return { ok: false, error: "Nama dan email wajib diisi." };
    if (!EMAIL_RE.test(e)) return { ok: false, error: "Format email tidak valid." };
    if (password.length < 6)
      return { ok: false, error: "Password minimal 6 karakter." };

    const existing = await prisma.user.findUnique({ where: { email: e } });
    if (existing) return { ok: false, error: "Email sudah terdaftar." };

    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: { nama: n, email: e, passwordHash, role: "admin", isActive: true },
    });
    return { ok: true };
  } catch (err) {
    return { ok: false, error: errMsg(err) };
  }
}

export async function toggleAdminActive(id: string): Promise<AdminResult> {
  try {
    await requireSuperadmin();
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user || user.role !== "admin")
      return { ok: false, error: "Admin tidak ditemukan." };

    const nextActive = !user.isActive;
    await prisma.user.update({
      where: { id },
      data: { isActive: nextActive },
    });
    // Disable → invalidasi semua session aktif (AC-3.7.2)
    if (!nextActive) {
      await prisma.session.deleteMany({ where: { userId: id } });
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: errMsg(err) };
  }
}

export async function resetAdminPassword(id: string): Promise<AdminResult> {
  try {
    await requireSuperadmin();
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user || user.role !== "admin")
      return { ok: false, error: "Admin tidak ditemukan." };

    // Generate password sementara
    const tempPassword = "Prime" + Math.floor(100000 + Math.random() * 900000);
    const passwordHash = await bcrypt.hash(tempPassword, 10);
    await prisma.user.update({ where: { id }, data: { passwordHash } });
    // Invalidasi session lama agar harus login ulang
    await prisma.session.deleteMany({ where: { userId: id } });
    // TODO(resend): kirim password baru via email
    return { ok: true, tempPassword };
  } catch (err) {
    return { ok: false, error: errMsg(err) };
  }
}

function errMsg(e: unknown): string {
  if (e instanceof Error && e.name === "ForbiddenError") return e.message;
  return "Terjadi kesalahan. Silakan coba lagi.";
}
