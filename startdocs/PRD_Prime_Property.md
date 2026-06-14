# Product Requirements Document (PRD)
## Prime Property — Web Platform & Internal Agent Portal

| | |
|---|---|
| **Versi** | 1.0 |
| **Status** | Draft |
| **Tanggal** | Juni 2026 |
| **Bahasa** | Indonesia |

---

## 1. Overview

### 1.1 Latar Belakang

Prime Property adalah platform properti yang membutuhkan dua lapisan sistem: halaman publik untuk presentasi brand kepada calon pembeli, dan portal internal untuk manajemen listing properti oleh agen.

Selama ini pengelolaan data properti dilakukan secara manual (spreadsheet), sehingga rentan terhadap kesalahan, duplikasi data, dan tidak ada audit trail. Platform ini hadir untuk mendigitalisasi proses tersebut secara end-to-end.

### 1.2 Tujuan Produk

- Menyediakan halaman publik yang profesional sebagai representasi digital brand Prime Property.
- Memberikan portal internal berbasis role untuk manajemen data properti secara efisien.
- Memastikan integritas data dengan validasi ketat dan audit log setiap perubahan.
- Menjaga keamanan akses dengan sistem autentikasi dan otorisasi berlapis.

### 1.3 Ruang Lingkup

**In-scope:**
- Landing Page, About Us, Contact Us (halaman publik)
- Autentikasi internal agent (login, session, lockout)
- Dashboard listing properti dengan filter & pencarian
- CRUD properti (khusus Superadmin)
- Manajemen akun admin (khusus Superadmin)
- Audit log perubahan data

**Out-of-scope (Phase 2):**
- Upload gambar properti
- Fitur arsip & restore properti terhapus
- Notifikasi real-time
- Integrasi payment / booking

---

## 2. Target Pengguna

### 2.1 Pengguna Publik (Tidak Login)
Calon pembeli atau peminat properti yang mengakses halaman publik untuk melihat informasi brand, properti unggulan, dan menghubungi Prime Property.

### 2.2 Admin (Internal)
Agen properti yang membutuhkan akses baca ke seluruh data listing untuk keperluan operasional harian (presentasi ke klien, pengecekan stok, filter kawasan).

**Permission:**
- ✅ View listing properti
- ✅ Filter & search properti
- ✅ Lihat detail properti
- ❌ Create / Update / Delete properti

### 2.3 Superadmin (Internal)
Pengelola utama platform yang bertanggung jawab atas data properti dan akun admin.

**Permission:**
- ✅ Semua akses Admin
- ✅ Full CRUD properti
- ✅ Manajemen akun admin (create, disable/enable, reset password)
- ✅ Lihat audit log perubahan

---

## 3. Fitur & Requirements

### 3.1 Branding & Design System

**Color Palette:**

| Nama | Hex | Penggunaan |
|---|---|---|
| Primary Black | `#1A1A1A` | Header, teks utama |
| Accent Gold | `#C9A961` | CTA, highlight, badge |
| Accent Red | `#B33A3A` | Status urgent, hover, error |
| Neutral White | `#FFFFFF` | Background utama |
| Soft Gray | `#F5F5F5` | Card, background sekunder |

**Typography:** Inter atau Geist (sans-serif modern). Bold untuk heading, regular untuk body.

**Layout:**
- Mobile-responsive dengan breakpoint: mobile ≤640px, tablet ≤1024px, desktop ≥1024px.
- Spacing grid: 4 / 8 / 16 / 24 / 32 px.
- Logo Prime Property wajib tampil di header seluruh halaman publik dan dashboard internal.
- Tidak ada fitur upload gambar untuk listing properti.

---

### 3.2 Halaman Publik

#### 3.2.1 Landing Page

**Hero Section:**
- Tagline Prime Property + 1 CTA primer ("Lihat Properti" atau "Hubungi Kami").
- Background `#1A1A1A`, aksen emas, logo menonjol.
- Tombol CTA: background `#C9A961`, teks hitam.

**Section Konten:**
- Properti Unggulan: maksimum 6 properti (read-only, tanpa filter).
- Mengapa Prime Property: 3–4 value proposition dengan ikon dan deskripsi singkat.
- Footer: logo, kontak singkat (telp/WA/email), link About Us & Contact Us.

**Navigasi Header (sticky):**
- Urutan: Logo | Beranda | Tentang Kami | Kontak | tombol "Login Agent" (outline emas, kanan).

#### 3.2.2 About Us

- Profil Prime Property, visi & misi, nilai perusahaan — Bahasa Indonesia.
- Layout 2 kolom di desktop (teks + visual/quote), single column di mobile.
- Tidak ada elemen interaktif kompleks selain navigasi standar.

#### 3.2.3 Contact Us

**Informasi Kontak:**
- Alamat kantor, nomor telepon, email, link WhatsApp (`wa.me/...`).
- Embed Google Maps (opsional, jika koordinat tersedia).

**Form Kontak:**
- Field: Nama, Email, Nomor HP, Pesan.
- Submit → kirim email notifikasi ke admin Prime Property.
- Validasi: semua field wajib, email format valid, nomor HP minimum 10 digit.
- Setelah submit sukses: toast "Pesan terkirim, tim kami akan menghubungi Anda."
- Anti-spam: rate limit 3 submit per IP per jam.

---

### 3.3 Autentikasi Internal

**Halaman Login (`/agent/login`):**
- Tidak ada link dari navigasi publik.
- Field: Email + Password (atau Email + OTP 6 digit).
- Tidak ada self-registration — akun dibuat manual oleh superadmin.
- Session: httpOnly cookie, SameSite=Lax, masa berlaku 30 hari.
- Lockout: 5x gagal login dalam 30 menit → lockout 15 menit.

**Logout:**
- Tersedia di header dashboard (dropdown profil).
- Logout → hapus session cookie → redirect ke `/agent/login`.

**Authorization:**
- Dicek di backend untuk setiap endpoint, bukan hanya di frontend.
- Admin yang akses endpoint mutasi → response `403 Forbidden`.

---

### 3.4 Schema Data Properti

| Field | Tipe | Wajib | Keterangan |
|---|---|:---:|---|
| `nama_property` | string | ✅ | Min 3, maks 100 karakter |
| `group` | string (nullable) | ❌ | Nama grup/cluster properti |
| `lebar` | decimal (meter) | ✅ | > 0, maks 2 desimal |
| `panjang` | decimal (meter) | ✅ | > 0, maks 2 desimal |
| `hadap` | enum (multi) | ✅ | Utara / Selatan / Timur / Barat |
| `tipe` | enum | ✅ | Ruko / Villa |
| `tingkat` | decimal | ✅ | 1–10, maks 1 desimal |
| `price` | bigint (rupiah) | ✅ | Integer penuh, tampil "Rp 1.350.000.000" |
| `carport` | boolean | ✅ | true / false |
| `status` | enum | ✅ | in_stock / sold_out |
| `siap` | enum | ✅ | siap_huni / siap_kosong / siap_huni_renovasi |
| `maps_link` | string (URL) | ❌ | Harus domain `google.com/maps` |
| `kawasan` | string (multitag) | ✅ | Krakatau, Pancing, Cemara Asri/Kuala, dll. |
| `unit` | string (nullable) | ❌ | Keterangan unit tambahan |
| `created_at` | timestamp | ✅ | Auto-generate |
| `updated_at` | timestamp | ✅ | Auto-update |
| `created_by` | FK → User | ✅ | Superadmin pembuat entry |

> Field `price` disimpan sebagai `bigint` (integer rupiah penuh, bukan float) untuk menghindari error pembulatan. Format display: separator titik (.) sesuai locale Indonesia.

---

### 3.5 Dashboard Internal

#### 3.5.1 Tampilan Tabel Listing

- Kolom: Nama, Group, Lebar × Panjang, Hadap, Tipe, Tingkat, Harga, Carport, Status, Siap, Kawasan.
- Pagination: 25 / 50 / 100 baris per halaman (default 50).
- Sort: nama, harga (asc/desc), tanggal dibuat, status.
- Badge status:
  - In Stock → hijau muda
  - Sold Out → merah (`#B33A3A`)
  - Siap Huni → kuning/emas
  - Siap Kosong → ungu muda
- Klik baris → drawer detail atau halaman detail terpisah.

#### 3.5.2 Filter & Pencarian

| Filter | Tipe |
|---|---|
| Kawasan | Dropdown multi-select |
| Lebar min (m) | Input numeric |
| Hadap | Multi-select |
| Harga Max | Input numeric / slider (opsional) |
| Tipe | Radio (Semua / Ruko / Villa) |
| Status | Radio (Semua / In Stock / Sold Out) |
| Siap | Multi-select |
| Carport | Toggle (Ya / Tidak / Semua) |
| Search bar | Free-text → `nama_property`, `group`, `kawasan` |

- Filter real-time dengan debounce 300ms.
- Active filter tampil sebagai chip, bisa di-remove individual.
- Tombol "Reset Filter" → kembali ke state default.
- State filter tersimpan di URL query params (shareable link).

#### 3.5.3 Halaman Detail Properti

- Semua field tampil dalam layout 2 kolom yang ringkas.
- Tombol "Buka di Google Maps" jika `maps_link` tersedia (open new tab).
- Superadmin: tombol "Edit" dan "Hapus" di pojok kanan atas.
- Admin: tombol Edit/Hapus tidak tampil.

---

### 3.6 CRUD Properti (Superadmin Only)

#### 3.6.1 Create

- Tombol "+ Tambah Properti" hanya tampil untuk superadmin.
- Form layout grid 2 kolom, semua field AC-6.1.
- Validasi client-side (instant feedback) + server-side (security).
- Sukses → toast + redirect ke listing dengan entry baru di-highlight.
- Opsional: tombol "Simpan & Tambah Lagi".

#### 3.6.2 Update

- Form prefill dengan data existing, layout sama dengan Create.
- Field yang berubah ditandai (dirty state indicator).
- Tombol "Batal" → kembali ke detail tanpa menyimpan.
- Setiap perubahan dicatat di audit log (who, when, what changed).

#### 3.6.3 Delete

- Modal konfirmasi: "Yakin hapus properti [nama]? Tindakan ini tidak dapat dibatalkan."
- Implementasi: soft delete (`deleted_at` timestamp), bukan hard delete.
- Properti terhapus tidak muncul di listing publik maupun internal default view.
- Restore via menu "Arsip" (Phase 2).

#### 3.6.4 Validasi Form

| Field | Rule |
|---|---|
| `nama_property` | Min 3 karakter, maks 100 karakter |
| `lebar` & `panjang` | > 0, maks 2 desimal |
| `price` | > 0, integer rupiah |
| `tingkat` | 1–10, maks 1 desimal |
| `maps_link` | URL valid, domain `google.com/maps` |

Error ditampilkan inline di bawah field, warna `#B33A3A`.

---

### 3.7 Manajemen Akun Admin (Superadmin Only)

Superadmin memiliki kendali penuh atas akun admin internal. Fitur ini hanya dapat diakses oleh superadmin dan tidak tersedia untuk role admin.

#### 3.7.1 Create Akun Admin Baru

- Tombol "+ Tambah Admin" hanya tampil untuk superadmin di halaman manajemen admin.
- Field form: Nama, Email, Password awal (atau auto-generate + kirim via email).
- Akun yang baru dibuat langsung aktif (is_active = true).
- Tidak ada self-registration — semua akun dibuat manual oleh superadmin.

#### 3.7.2 Disable / Enable Akun Admin

- Superadmin dapat menonaktifkan akun admin (is_active = false) tanpa menghapus data.
- Admin yang di-disable tidak dapat login; session aktif langsung di-invalidate.
- Superadmin dapat mengaktifkan kembali akun yang sudah di-disable (is_active = true).
- Toggle disable/enable tersedia di halaman daftar admin atau detail akun admin.

#### 3.7.3 Reset Password Admin

- Superadmin dapat men-trigger reset password untuk akun admin tertentu.
- Implementasi: generate password baru (atau kirim link reset via email).
- Password baru di-hash menggunakan bcrypt (cost factor ≥ 10) sebelum disimpan.
- Admin yang password-nya di-reset harus ganti password saat login berikutnya (opsional: force change password flag).

---

## 4. Non-Functional Requirements

### 4.1 Performance
- Time to First Contentful Paint (FCP) < 1.5s di koneksi 4G.
- Filter & search response < 500ms untuk dataset hingga 1.000 properti.
- Lighthouse Performance Score ≥ 85 untuk landing page.

### 4.2 Security
- Semua endpoint internal dilindungi authentication middleware.
- CSRF protection untuk semua mutasi (POST/PUT/PATCH/DELETE).
- Rate limiting: 100 req/menit/IP global, 10 req/menit/IP untuk endpoint auth.
- Password di-hash menggunakan bcrypt (cost factor ≥ 10).
- HTTPS-only di production, secure cookie flag aktif.
- Input sanitization untuk mencegah XSS & SQL injection.

### 4.3 Bahasa & Lokalisasi
- Seluruh UI dalam Bahasa Indonesia.
- Format mata uang: `Rp 1.350.000.000` (titik sebagai separator ribuan).
- Format tanggal: `24 Mei 2026` atau `24/05/2026`.
- Timezone: Asia/Jakarta (WIB) untuk semua timestamp display.

### 4.4 Browser Support
- Chrome / Edge / Firefox / Safari (2 tahun terakhir).
- Mobile Safari iOS 14+, Chrome Android.

---

## 5. Definition of Done

Fitur dinyatakan **DONE** jika memenuhi seluruh kriteria berikut:

1. Semua acceptance criteria terpenuhi dan teruji.
2. Tidak ada bug priority High/Critical yang terbuka.
3. UI sesuai brand guidelines (palette, typography, logo placement).
4. Responsive di mobile, tablet, dan desktop.
5. Backend authorization terverifikasi (admin tidak bisa CRUD).
6. Filter dan search berjalan dengan dataset minimal 50 properti dummy.
7. Dokumentasi singkat untuk superadmin tentang cara manage properti.

---

## 6. Milestone & Roadmap

| Phase | Scope | Target |
|---|---|---|
| Phase 1 | Halaman publik (Landing, About, Contact) + Auth + Dashboard view + CRUD properti | MVP |
| Phase 2 | Arsip & restore, notifikasi real-time, export data | Post-launch |
| Phase 3 | Upload gambar, integrasi maps lebih dalam, analytics traffic | Future |

---

*Prime Property · PRD v1.0 · Dokumen ini menjadi acuan pengembangan dan QA selama fase implementasi.*
