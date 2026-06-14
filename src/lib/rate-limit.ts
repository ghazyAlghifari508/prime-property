import "server-only";
import { prisma } from "./db";

// Lockout login (AC-5.1): 5x gagal dalam 30 menit → lockout 15 menit.
const MAX_FAILED = 5;
const WINDOW_MIN = 30;
const LOCKOUT_MIN = 15;

export interface LockoutStatus {
  locked: boolean;
  remainingMinutes: number;
}

/** Cek apakah email sedang ter-lockout. */
export async function checkLockout(email: string): Promise<LockoutStatus> {
  const windowStart = new Date(Date.now() - WINDOW_MIN * 60 * 1000);

  const recentFailed = await prisma.loginAttempt.findMany({
    where: {
      email: email.toLowerCase(),
      success: false,
      attemptedAt: { gte: windowStart },
    },
    orderBy: { attemptedAt: "desc" },
    take: MAX_FAILED,
  });

  if (recentFailed.length >= MAX_FAILED) {
    const lastAttempt = recentFailed[0].attemptedAt.getTime();
    const unlockAt = lastAttempt + LOCKOUT_MIN * 60 * 1000;
    const remaining = unlockAt - Date.now();
    if (remaining > 0) {
      return { locked: true, remainingMinutes: Math.ceil(remaining / 60000) };
    }
  }
  return { locked: false, remainingMinutes: 0 };
}

export async function recordLoginAttempt(
  email: string,
  success: boolean,
  ipAddress: string | null,
): Promise<void> {
  await prisma.loginAttempt.create({
    data: { email: email.toLowerCase(), success, ipAddress },
  });
}

/** Bersihkan attempt gagal setelah login sukses. */
export async function clearFailedAttempts(email: string): Promise<void> {
  await prisma.loginAttempt.deleteMany({
    where: { email: email.toLowerCase(), success: false },
  });
}

// ===== Rate limit contact form (AC-4.2): 3 submit / IP / jam =====
// In-memory (cukup untuk dev/single-instance). TODO(prod): pindah ke Redis/Upstash.
const contactHits = new Map<string, number[]>();
const CONTACT_MAX = 3;
const CONTACT_WINDOW_MS = 60 * 60 * 1000;

export function checkContactRateLimit(ip: string): boolean {
  const now = Date.now();
  const hits = (contactHits.get(ip) ?? []).filter(
    (t) => now - t < CONTACT_WINDOW_MS,
  );
  if (hits.length >= CONTACT_MAX) {
    contactHits.set(ip, hits);
    return false; // ditolak
  }
  hits.push(now);
  contactHits.set(ip, hits);
  return true; // diizinkan
}
