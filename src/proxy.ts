import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Next 16: "Proxy" (dahulu Middleware). Optimistic check — proteksi penuh
// (validasi session di DB) tetap di Server Component/Action (auth.ts).
// AC-5.1: cegah akses /agent/* tanpa cookie session.

const SESSION_COOKIE = "pp_session";

// ===== Rate limit global (AC-9.2): 100 req/menit/IP =====
// In-memory sliding window — cukup untuk dev/single-instance.
// TODO(prod): pindah ke Redis/Upstash agar konsisten lintas instance serverless.
const RATE_MAX = 100;
const RATE_WINDOW_MS = 60 * 1000;
const ipHits = new Map<string, number[]>();

function clientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (ipHits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  hits.push(now);
  ipHits.set(ip, hits);
  return hits.length > RATE_MAX;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rate limit global untuk semua request yang melewati proxy.
  const ip = clientIp(request);
  if (isRateLimited(ip)) {
    return new NextResponse("Terlalu banyak permintaan. Coba lagi nanti.", {
      status: 429,
      headers: { "Retry-After": "60" },
    });
  }

  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value);

  // Login page: jika sudah ada cookie, arahkan ke dashboard
  if (pathname === "/agent/login") {
    if (hasSession) {
      return NextResponse.redirect(new URL("/agent/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Area terproteksi
  if (pathname.startsWith("/agent")) {
    if (!hasSession) {
      const url = new URL("/agent/login", request.url);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Rate limit global berlaku di semua route kecuali aset statis & internal Next.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp)$).*)"],
};
