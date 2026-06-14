import "server-only";
import { cookies } from "next/headers";
import { prisma } from "./db";

// Session DB-based + httpOnly cookie (AC-5.1): SameSite=Lax, 30 hari.

export const SESSION_COOKIE = "pp_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 hari

export async function createSession(userId: string): Promise<void> {
  const expiresAt = new Date(Date.now() + MAX_AGE_SECONDS * 1000);
  const session = await prisma.session.create({
    data: { userId, expiresAt },
  });

  const store = await cookies();
  store.set(SESSION_COOKIE, session.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

/** Ambil session valid (belum expired) beserta user, atau null. */
export async function getSession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { id: token },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    return null;
  }
  // Akun dinonaktifkan → session tidak berlaku (AC-3.7.2)
  if (!session.user.isActive) {
    return null;
  }
  return session;
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    await prisma.session.deleteMany({ where: { id: token } });
    store.delete(SESSION_COOKIE);
  }
}
