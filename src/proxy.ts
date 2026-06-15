import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Next 16: "Proxy" (dahulu Middleware). Optimistic check — proteksi penuh
// (validasi session di DB) tetap di Server Component/Action (auth.ts).
// AC-5.1: cegah akses /agent/* tanpa cookie session.
// AC-9.2: Global rate limit 100 req/menit/IP, auth rate limit 10 req/menit/IP, CSRF protection.

const SESSION_COOKIE = "pp_session";

// ===== Rate limit global (AC-9.2): 100 req/menit/IP =====
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

function isRateLimited(ip: string, max = RATE_MAX, windowMs = RATE_WINDOW_MS): boolean {
  const now = Date.now();
  const hits = (ipHits.get(ip) ?? []).filter((t) => now - t < windowMs);
  hits.push(now);
  ipHits.set(ip, hits);
  return hits.length > max;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // AC-9.2: Global rate limit untuk semua request
  const ip = clientIp(request);
  if (isRateLimited(ip)) {
    return new NextResponse("Terlalu banyak permintaan. Coba lagi nanti.", {
      status: 429,
      headers: { "Retry-After": "60" },
    });
  }

  // AC-9.2: Auth rate limit 10 req/menit/IP
  if (pathname.startsWith("/agent/login")) {
    if (isRateLimited(`a:${ip}`, 10, 60_000)) {
      return new NextResponse(
        "Terlalu banyak percobaan login. Silakan coba lagi nanti.",
        { status: 429, headers: { "Retry-After": "60" } },
      );
    }
  }

  // AC-9.2: CSRF protection untuk semua mutasi (POST/PUT/PATCH/DELETE)
  if (["POST", "PUT", "PATCH", "DELETE"].includes(request.method)) {
    const origin = request.headers.get("origin");
    const referer = request.headers.get("referer");
    const host = request.headers.get("host");

    let valid = false;
    if (origin && host) {
      try {
        valid = new URL(origin).host === host;
      } catch {
        valid = false;
      }
    } else if (referer && host) {
      try {
        valid = new URL(referer).host === host;
      } catch {
        valid = false;
      }
    }

    if (!valid) {
      return new NextResponse(
        JSON.stringify({ error: "CSRF validation failed." }),
        { status: 403, headers: { "Content-Type": "application/json" } },
      );
    }
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
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp)$).*)"],
};
