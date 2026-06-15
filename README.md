# Prime Property

Prime Property adalah platform properti dua-lapis untuk publik dan internal agent portal. Aplikasi ini menampilkan halaman publik bergaya luxury editorial sekaligus menyediakan dashboard internal untuk pengelolaan listing properti berbasis role **Admin** dan **Superadmin**.

## Ringkasan Fitur

### Halaman Publik
- Landing page dengan brand Prime Property, hero section, properti unggulan, value proposition, dan CTA.
- Halaman About Us berisi profil perusahaan, visi, misi, dan nilai perusahaan.
- Halaman Contact Us berisi alamat, telepon, email, WhatsApp, embed Maps, dan form kontak.
- UI responsif untuk mobile, tablet, dan desktop.

### Portal Internal Agent
- Login agent di `/agent/login` dengan session cookie httpOnly.
- Dashboard listing properti dengan tabel kompak, pagination, sorting, filter, search, dan query params shareable.
- Detail properti dalam layout ringkas dua kolom.
- Role-based access control:
  - **Admin**: view listing, filter/search, lihat detail.
  - **Superadmin**: full CRUD properti, manajemen admin, dan audit log.
- Soft delete untuk properti.
- Audit log untuk perubahan data properti.

## Tech Stack

- **Framework**: Next.js 16 App Router
- **UI**: React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui
- **Database**: Supabase Postgres
- **ORM**: Prisma
- **Auth**: Custom session cookie + bcrypt
- **Validation**: Zod + React Hook Form
- **Notification**: Sonner toast

## Brand System

Prime Property menggunakan brand palette berikut:

| Token | Warna | Kegunaan |
|---|---:|---|
| Primary Black | `#1A1A1A` | Header, teks utama |
| Accent Gold | `#C9A961` | CTA, highlight, badge |
| Accent Red | `#B33A3A` | Error, status urgent |
| Neutral White | `#FFFFFF` | Background utama |
| Soft Gray | `#F5F5F5` | Card, background sekunder |

Typography menggunakan Inter untuk body dan font display editorial untuk heading publik.

## Struktur Project

```txt
src/
├── app/
│   ├── (public)/             # Landing, About, Contact
│   ├── agent/login/          # Login internal agent
│   └── agent/dashboard/      # Dashboard internal
├── components/
│   ├── common/               # Badge, filter chips, shared components
│   ├── layout/               # PublicHeader, DashboardHeader, Footer
│   ├── property/             # Property table, filters, form, dialog
│   ├── public/               # Public page sections
│   └── ui/                   # shadcn/ui primitives
└── lib/
    ├── actions/              # Server actions
    ├── auth.ts               # Authorization helpers
    ├── session.ts            # Session cookie handling
    ├── property-schema.ts    # Zod validation
    └── format.ts             # Rupiah/date formatting
```

## Environment Variables

Buat file `.env` untuk development lokal:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# Optional: email notification untuk contact form
RESEND_API_KEY=""
ADMIN_EMAIL=""
EMAIL_FROM="Prime Property <onboarding@resend.dev>"
```

Untuk deployment Vercel, pastikan `DATABASE_URL` diset di **Project Settings → Environment Variables**.

## Menjalankan Local Development

```bash
npm install
npx prisma generate
npm run dev
```

Aplikasi akan berjalan di:

```txt
http://localhost:3000
```

## Database

Schema Prisma berada di:

```txt
prisma/schema.prisma
```

Generate Prisma Client:

```bash
npx prisma generate
```

Seed akun test:

```bash
node prisma/seed-test.mjs
```

Seeder test membuat akun reproducible untuk kebutuhan pengujian. Jangan gunakan kredensial test untuk production.

## Scripts

```bash
npm run dev      # Jalankan development server
npm run build    # Build production
npm run start    # Jalankan production server lokal
npm run lint     # Jalankan ESLint
```

## Security Notes

- Session disimpan dalam cookie `httpOnly`, `SameSite=Lax`, dan `secure` aktif di production.
- Password di-hash menggunakan bcrypt cost factor 10.
- Mutasi properti dan manajemen admin divalidasi di backend menggunakan `requireSuperadmin()`.
- CSRF protection dan rate limiting dijalankan melalui Next.js Proxy (`src/proxy.ts`).
- Input divalidasi menggunakan Zod dan output UI dirender aman oleh React.

## Deployment

Production deployment saat ini:

```txt
https://prime-property-nova.vercel.app
```

Deploy manual dengan Vercel CLI:

```bash
npx vercel deploy --prod --yes
```

## Dokumentasi Internal

Panduan superadmin tersedia di:

```txt
docs/superadmin-guide.md
```

## License

Copyright © 2026 Prime Property. All rights reserved.
