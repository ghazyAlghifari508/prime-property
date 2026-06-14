import "server-only";
import { redirect } from "next/navigation";
import { getSession } from "./session";
import { mapUser } from "./mappers";
import type { User } from "./types";

/** User saat ini (dari session cookie) atau null. Aman dipanggil di Server Component/Action. */
export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession();
  return session ? mapUser(session.user) : null;
}

/** Wajib login. Jika tidak → redirect ke login. */
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect("/agent/login");
  return user;
}

/** Error otorisasi (admin akses mutasi → 403, AC-5.2). */
export class ForbiddenError extends Error {
  constructor(message = "Akses ditolak. Hanya superadmin yang diizinkan.") {
    super(message);
    this.name = "ForbiddenError";
  }
}

/** Wajib superadmin. Jika bukan → ForbiddenError (untuk Server Action). */
export async function requireSuperadmin(): Promise<User> {
  const user = await requireAuth();
  if (user.role !== "superadmin") {
    throw new ForbiddenError();
  }
  return user;
}
