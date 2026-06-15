<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version (Next.js 16) has breaking changes — APIs, conventions, and file structure may differ from training data. Notably: `params` and `searchParams` are **async (Promise)** in pages/layouts — `await` them. Read the relevant guide in `node_modules/next/dist/docs/` before writing routing/data code.
<!-- END:nextjs-agent-rules -->

# CLAUDE.md — Prime Property

Panduan kerja membangun **Prime Property**: platform properti dua-lapis (halaman publik + portal internal agent). Dokumen acuan produk ada di `startdocs/` (PRD, TECHSTACK, Acceptance Criteria, logo).

## Status Fase Saat Ini

**Phase 2 — BACKEND INTEGRATION.** Platform ini telah mengimplementasikan backend penuh menggunakan Supabase Postgres + Prisma ORM dan Next.js Server Actions.

> Phase 1 (mock data) telah selesai. Semua file simulasi mock (mock-auth, mock-data) telah dihapus dari codebase.

## Stack

- **Next.js 16 (App Router)** + **React 19** + **TypeScript** (`src/`, alias `@/*`)
- **Tailwind CSS v4** — token brand di `src/app/globals.css` via `@theme`
- **shadcn/ui** = fondasi komponen sistem (`src/components/ui/`)
- **Database:** Supabase Postgres + Prisma (`src/lib/db.ts`)
- **Auth:** Custom session cookie (httpOnly, bcrypt, role-based) (`src/lib/session.ts`, `src/lib/auth.ts`)
- UI 100% **Bahasa Indonesia**

## Brand & Design System (AC-1)

| Token | Hex | Utility Tailwind | Penggunaan |
|---|---|---|---|
| Primary Black | `#1A1A1A` | `prime-black` | Header, teks utama |
| Accent Gold | `#C9A961` | `prime-gold` | CTA, highlight, badge |
| Accent Red | `#B33A3A` | `prime-red` | Status urgent, error |
| Neutral White | `#FFFFFF` | `prime-white` | Background utama |
| Soft Gray | `#F5F5F5` | `soft-gray` | Card, background sekunder |

- Logo (`/logo-prime-property.png`) WAJIB di header semua halaman publik & dashboard.
- Breakpoint: mobile ≤640px, tablet ≤1024px, desktop ≥1024px. Spacing grid 4/8/16/24/32.
- Typography: Inter — bold heading, regular body.
- **Tidak ada upload gambar** untuk listing — fokus data tabular.

## Lokalisasi (AC-9.3)

- Semua teks UI Bahasa Indonesia.
- Mata uang `Rp 1.350.000.000` (titik separator) → `formatRupiah()` di `src/lib/format.ts`.
- Tanggal `24 Mei 2026` → `formatTanggal()`. Timezone display **Asia/Jakarta (WIB)**.
- `price` selalu integer rupiah penuh (number), tidak pernah float.

## Konvensi Folder

```
src/app/(public)/         # Landing, About, Contact — header+footer publik
src/app/agent/login/      # login mock (standalone, tanpa header publik)
src/app/agent/dashboard/  # portal internal (listing, [id], create, [id]/edit, admins, audit-log)
src/components/ui/         # shadcn
src/components/layout/     # PublicHeader, DashboardHeader, Footer
src/components/property/   # PropertyTable, PropertyFilters, PropertyDetail, PropertyForm, PropertyCard
src/components/common/     # StatusBadge, FilterChip, RoleSwitcher
src/lib/                   # types, mock-data, mock-auth, format, constants
```

## Role & Authorization (AC-5.2)

- Dua role: **admin** (read-only listing) & **superadmin** (full CRUD + manajemen admin + audit log).
- Gating dijalankan penuh di sisi server via middleware atau fungsi `requireAuth()`, `requireSuperadmin()`, `getCurrentUser()` di server action.
- Action mutasi tidak sah otomatis menolak akses dan me-lempar 403 / ForbiddenError.

## Aturan Teknis

- Komponen Server by default; `'use client'` hanya di leaf interaktif (form, filter, dropdown, toast).
- `params`/`searchParams` async — `await` di Server Component, atau `useSearchParams()` di client.
- Pakai `next/image` untuk gambar konten, `next/link` untuk navigasi.

## File Penting

- `src/middleware.ts` — AC-9.2: global rate limit (100/m/IP), auth rate limit (10/m/IP), CSRF protection (origin/referer)
- `docs/superadmin-guide.md` — panduan manajemen properti untuk superadmin
- `prisma/schema.prisma` — skema database: User, Property, Session, LoginAttempt, AuditLog, ContactMessage

## Perintah

- `npm run dev` — dev server
- `npm run build` — produksi (harus NOL error sebelum dianggap selesai)
- `npm run lint`
- `npx shadcn@latest add <component>` — tambah komponen shadcn
