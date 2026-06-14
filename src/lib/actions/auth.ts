"use server";

import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { createSession, destroySession, getSession } from "@/lib/session";
import {
  checkLockout,
  clearFailedAttempts,
  recordLoginAttempt,
} from "@/lib/rate-limit";

export interface LoginResult {
  ok: boolean;
  error?: string;
}

async function clientIp(): Promise<string | null> {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    h.get("x-real-ip") ??
    null
  );
}

export async function loginAction(
  email: string,
  password: string,
): Promise<LoginResult> {
  const normEmail = email.trim().toLowerCase();
  if (!normEmail || !password) {
    return { ok: false, error: "Email dan password wajib diisi." };
  }

  // Lockout (AC-5.1)
  const lockout = await checkLockout(normEmail);
  if (lockout.locked) {
    return {
      ok: false,
      error: `Terlalu banyak percobaan gagal. Coba lagi dalam ${lockout.remainingMinutes} menit.`,
    };
  }

  const ip = await clientIp();
  const user = await prisma.user.findUnique({ where: { email: normEmail } });

  // Verifikasi kredensial (bcrypt)
  const valid = user ? await bcrypt.compare(password, user.passwordHash) : false;

  if (!user || !valid) {
    await recordLoginAttempt(normEmail, false, ip);
    return { ok: false, error: "Email atau password salah." };
  }

  if (!user.isActive) {
    await recordLoginAttempt(normEmail, false, ip);
    return { ok: false, error: "Akun Anda dinonaktifkan. Hubungi superadmin." };
  }

  // Sukses
  await recordLoginAttempt(normEmail, true, ip);
  await clearFailedAttempts(normEmail);
  await createSession(user.id);
  return { ok: true };
}

export async function logoutAction(): Promise<void> {
  await destroySession();
}

/** Dipakai client untuk menampilkan info user (header). */
export async function getMe() {
  const session = await getSession();
  if (!session) return null;
  return {
    nama: session.user.nama,
    email: session.user.email,
    role: session.user.role,
  };
}
