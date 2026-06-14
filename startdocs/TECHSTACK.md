# Tech Stack — Prime Property
## Web Platform & Internal Agent Portal

> Dokumen ini menjabarkan seluruh teknologi yang digunakan dalam pengembangan Prime Property, beserta alasan pemilihan dan tanggung jawab masing-masing layer.

---

## ⚠️ Status Implementasi (Update: 15 Juni 2026)

Dokumen ini awalnya disusun sebagai rencana arsitektur **full-stack**. Implementasi
dilakukan **bertahap**. Status terkini:

### ✅ Phase 1 — FRONTEND-ONLY (selesai)

Seluruh antarmuka (UI) dengan mock data telah dibangun.

### ✅ Phase 2 — BACKEND INTEGRATION (selesai)

Backend telah diimplementasi sepenuhnya:
- **Prisma ORM** + **Supabase PostgreSQL** untuk database
- **Custom session auth** (bcrypt, httpOnly cookie, SameSite=Lax)
- **Server Actions** untuk semua mutasi (properti CRUD, admin management, contact form)
- **Audit log** berbasis database — setiap create/update/delete properti tercatat
- **Role-based access control** dicek di server (superadmin-only mutations → 403)
- **Rate limiting** in-memory untuk contact form (3/IP/jam)
- Mock data files (`mock-data.ts`, `mock-auth.tsx`, `property-store.tsx`) telah **dihapus**

**Stack aktual Phase 2:**

| Layer | Rencana awal (dokumen) | Implementasi Phase 2 |
|---|---|---|
| Framework | Next.js 15 | **Next.js 16** (App Router, src-dir) |
| UI Library | React 19 | React 19 ✅ |
| Styling | Tailwind v4 | Tailwind v4 ✅ |
| Komponen | shadcn/ui | shadcn/ui (style new-york) ✅ |
| Font | Inter/Geist | **Inter** (`next/font`) |
| Ikon | Lucide | Lucide ✅ |
| Form & Validasi | zod | **react-hook-form + zod** ✅ |
| Data | PostgreSQL + Prisma | **Prisma 6.x + Supabase Postgres** ✅ |
| Auth/Session | Custom session DB | **httpOnly cookie + bcrypt + DB sessions** ✅ |
| Role/CRUD | Backend-gated | **Server Action + requireSuperadmin()** ✅ |
| Audit | DB-based | **Prisma auditLog table, auto-diff changes** ✅ |
| Contact Form | Resend (pending) | **Server Action → DB + rate limit** ✅ (Resend TODO) |

### ⏳ Remaining (belum dikerjakan)

- Integrasi email notifikasi via **Resend** (contact form → email admin)
- Email password reset untuk admin
- CSRF protection (double-submit cookie pattern)
- Upstash Redis rate limiting (production-grade, ganti in-memory)

---

## Overview Arsitektur

```
┌─────────────────────────────────────────────────────┐
│                    CLIENT BROWSER                   │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│              NEXT.JS (App Router)                   │
│  ┌──────────────────┐  ┌───────────────────────┐   │
│  │  Halaman Publik  │  │   Dashboard Internal  │   │
│  │  (SSG/SSR)       │  │   (CSR + Server Comp) │   │
│  │  Landing Page    │  │   Listing, CRUD,      │   │
│  │  About Us        │  │   Filter, Detail      │   │
│  │  Contact Us      │  │                       │   │
│  └──────────────────┘  └───────────────────────┘   │
│  ┌────────────────────────────────────────────────┐ │
│  │              API Routes (Next.js)              │ │
│  │  Auth · Properties · Contact · Audit Log      │ │
│  └────────────────────────────────────────────────┘ │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│              POSTGRESQL (via Prisma ORM)            │
│  Users · Properties · Sessions · AuditLog          │
└─────────────────────────────────────────────────────┘
```

---

## Stack Detail

### 🖥️ Frontend

| Teknologi | Versi | Peran |
|---|---|---|
| Next.js | 15.x (App Router) | Framework utama — SSG/SSR halaman publik, CSR dashboard internal |
| React | 19.x | UI library |
| Tailwind CSS | v4 | Styling — breakpoint mobile/tablet/desktop, spacing grid |
| shadcn/ui | latest | Komponen UI (tabel, dialog, dropdown, badge, toast, form) |
| Icon Library | preferensi | Lucide React (default shadcn/ui), bisa diganti Heroicons, React Icons, atau lainnya sesuai selera |

**Alasan pemilihan:**
- Next.js App Router mendukung hybrid rendering: halaman publik pakai SSG/SSR untuk SEO dan performa, dashboard pakai CSR untuk interaktivitas.
- Tailwind v4 mendukung breakpoint `≤640px / ≤1024px / ≥1024px` yang diminta di AC-1.2 secara native.
- shadcn/ui mempercepat development komponen kompleks (tabel + pagination + filter chip) tanpa styling dari nol.

---

### ⚙️ Backend

| Teknologi | Versi | Peran |
|---|---|---|
| Next.js API Routes | 15.x | Backend API — handler untuk auth, properti, contact form, audit log |
| Node.js | 20.x LTS | Runtime |

**Alasan pemilihan:**
- Monorepo full Next.js mengeliminasi overhead setup Express terpisah untuk project freelance skala ini.
- API Routes mendukung middleware custom untuk auth guard, CSRF, dan rate limiting.
- Satu codebase = satu deploy, lebih simpel untuk maintenance klien.

---

### 🗄️ Database

| Teknologi | Versi | Peran |
|---|---|---|
| PostgreSQL | 16.x | Database utama — relational, ACID compliant |
| Prisma ORM | 5.x | Schema management, migration, query builder type-safe |

**Alasan pemilihan:**
- `bigint` PostgreSQL untuk field `price` — aman dari floating point error sesuai AC-6.1.
- Soft delete (`deleted_at`) dan relasi `created_by → User` lebih clean di relational DB.
- Prisma generate TypeScript types otomatis dari schema → type-safe query di seluruh codebase.
- Migration versioned → mudah di-rollback jika ada perubahan schema.

**Tabel utama:**
```
User          → id, email, password_hash, role, is_active, created_at
Property      → semua field AC-6.1 + deleted_at
Session       → id, user_id, expires_at, created_at
LoginAttempt  → user_id, attempted_at, ip_address
AuditLog      → id, user_id, property_id, action, before, after, created_at
```

---

### 🔐 Authentication & Session

| Teknologi | Peran |
|---|---|
| Custom session (DB-based) | Session disimpan di tabel `Session` PostgreSQL |
| bcrypt (cost factor ≥ 10) | Hash password |
| httpOnly Cookie (SameSite=Lax) | Transport session token ke browser |

**Alasan tidak pakai NextAuth / JWT stateless:**
- AC-5.1 secara eksplisit mensyaratkan httpOnly cookie + SameSite=Lax + lockout mechanism.
- Lockout 5x gagal login dalam 30 menit tidak bisa diimplementasi dengan pure JWT stateless.
- Custom session di DB lebih mudah di-invalidate (logout, force-logout oleh superadmin).

**Flow autentikasi:**
```
1. POST /api/auth/login → cek kredensial
2. Cek tabel LoginAttempt → jika ≥5 dalam 30 menit → return 429
3. Jika valid → buat record Session di DB → set httpOnly cookie
4. Setiap request ke endpoint protected → validasi cookie → query Session → attach user ke request
5. POST /api/auth/logout → hapus Session record → clear cookie
```

---

### 📧 Email

| Teknologi | Peran |
|---|---|
| Resend | Email delivery service — notifikasi contact form ke admin |
| `@resend/node` SDK | Client library |

**Alasan pemilihan:**
- Resend gratis hingga 3.000 email/bulan — cukup untuk volume contact form.
- Setup minimal, deliverability tinggi, dashboard monitoring bawaan.
- Alternatif: Nodemailer + SMTP jika klien punya email server sendiri.

---

### 🛡️ Security Middleware

| Concern | Implementasi |
|---|---|
| CSRF Protection | Custom CSRF token (double-submit cookie pattern) untuk semua mutasi |
| Rate Limiting | `@upstash/ratelimit` + Upstash Redis, atau in-memory untuk development |
| Input Sanitization | `zod` untuk validasi schema + sanitasi input di semua endpoint |
| XSS Prevention | React escaping bawaan + Content Security Policy header |
| SQL Injection | Prisma parameterized query (tidak ada raw SQL) |
| Auth Guard | Middleware Next.js — cek session cookie sebelum masuk route `/agent/*` |

---

### 🏗️ Deployment

| Layer | Platform | Alasan |
|---|---|---|
| Full Stack (Next.js) | Vercel | Platform paling optimal untuk Next.js, zero-config deploy, auto CI/CD dari GitHub |
| Database | Supabase (PostgreSQL) | Dashboard visual bawaan, mudah dikelola klien, free tier cukup, familiar |
| Email | Resend Cloud | SaaS, tidak perlu self-host |

**Alternatif jika klien minta:**
- Database → Neon atau Railway PostgreSQL
- Hosting → Railway (jika klien prefer one-platform)

---

## Struktur Folder Project

```
prime-property/
├── app/
│   ├── (public)/                    # Route group halaman publik
│   │   ├── page.tsx                 # Landing Page
│   │   ├── about/page.tsx           # About Us
│   │   └── contact/page.tsx         # Contact Us
│   ├── agent/
│   │   ├── login/page.tsx           # Halaman login internal
│   │   └── dashboard/
│   │       ├── page.tsx             # Listing properti (tabel + filter)
│   │       ├── [id]/page.tsx        # Detail properti
│   │       ├── create/page.tsx      # Form tambah properti (superadmin)
│   │       └── [id]/edit/page.tsx   # Form edit properti (superadmin)
│   └── api/
│       ├── auth/
│       │   ├── login/route.ts
│       │   └── logout/route.ts
│       ├── properties/
│       │   ├── route.ts             # GET list + POST create
│       │   └── [id]/route.ts        # GET detail + PATCH update + DELETE
│       ├── contact/
│       │   └── route.ts             # POST contact form
│       ├── admin/
│       │   ├── route.ts             # GET list admin + POST create admin (superadmin only)
│       │   └── [id]/route.ts        # PATCH disable/enable + POST reset password (superadmin only)
│       └── audit-log/
│           └── route.ts             # GET audit log (superadmin only)
├── components/
│   ├── ui/                          # shadcn/ui components
│   ├── layout/
│   │   ├── PublicHeader.tsx
│   │   ├── DashboardHeader.tsx
│   │   └── Footer.tsx
│   ├── property/
│   │   ├── PropertyTable.tsx
│   │   ├── PropertyFilters.tsx
│   │   ├── PropertyDetail.tsx
│   │   └── PropertyForm.tsx
│   └── common/
│       ├── StatusBadge.tsx
│       └── FilterChip.tsx
├── lib/
│   ├── prisma.ts                    # Prisma client singleton
│   ├── session.ts                   # Session management helpers
│   ├── auth.ts                      # Auth middleware & role check
│   ├── csrf.ts                      # CSRF token helper
│   ├── ratelimit.ts                 # Rate limiting helper
│   └── email.ts                     # Resend email helper
├── prisma/
│   ├── schema.prisma                # Database schema
│   └── migrations/                  # Migration files
├── middleware.ts                    # Next.js middleware (auth guard)
├── .env.local                       # Environment variables (dev)
└── .env.example                     # Template env untuk onboarding
```

---

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/prime_property"

# Session
SESSION_SECRET="random-secret-min-32-chars"
SESSION_MAX_AGE=2592000  # 30 hari dalam detik

# Email (Resend)
RESEND_API_KEY="re_xxxxxxxxxxxx"
ADMIN_EMAIL="admin@primeproperty.id"

# App
NEXT_PUBLIC_APP_URL="https://primeproperty.id"
NODE_ENV="production"

# Rate Limiting (opsional, jika pakai Upstash)
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."
```

---

## Dependency List

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@prisma/client": "^5.0.0",
    "bcrypt": "^5.1.0",
    "@resend/node": "^4.0.0",
    "zod": "^3.23.0",
    "uuid": "^10.0.0",
    "date-fns": "^3.6.0"
  },
  "devDependencies": {
    "prisma": "^5.0.0",
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0",
    "@types/react": "^19.0.0",
    "@types/bcrypt": "^5.0.0",
    "tailwindcss": "^4.0.0",
    "eslint": "^9.0.0",
    "eslint-config-next": "^15.0.0"
  }
}
```

---

## Keputusan Arsitektur (ADR)

| # | Keputusan | Alasan |
|---|---|---|
| 1 | Monorepo Next.js (bukan Express terpisah) | Simpel untuk freelance, satu deploy, satu codebase |
| 2 | Custom session DB (bukan JWT) | AC mensyaratkan httpOnly cookie + lockout mechanism |
| 3 | PostgreSQL bigint untuk `price` | Mencegah floating point error pada nilai rupiah |
| 4 | Soft delete (`deleted_at`) | Data properti terhapus masih bisa di-audit dan di-restore (Phase 2) |
| 5 | Zod untuk validasi | Type-safe validation di server dan bisa di-reuse untuk client-side |
| 6 | shadcn/ui (bukan MUI/Ant Design) | Lebih ringan, fully customizable sesuai brand guidelines |
| 7 | Resend (bukan Nodemailer + SMTP) | Zero config, deliverability tinggi, gratis untuk volume kecil |
| 8 | Vercel + Supabase (bukan Railway/Neon) | Vercel untuk hosting, Supabase untuk PostgreSQL yang familiar dan punya dashboard visual |

---

*Prime Property · Tech Stack Document · v1.0*