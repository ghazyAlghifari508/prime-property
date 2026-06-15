# Panduan Superadmin — Prime Property

## Akses & Login

1. Buka halaman login agent: `/agent/login`
2. Masukkan email dan password yang sudah didaftarkan oleh superadmin lain.
3. Setelah login, Anda akan diarahkan ke Dashboard.

> **Catatan:** Tidak ada registrasi mandiri. Akun baru hanya bisa dibuat oleh superadmin.

---

## Dashboard Properti

Setelah login, halaman utama dashboard menampilkan:

- **Statistik Ringkasan:** Total properti, tersedia, terjual, dan jumlah kawasan.
- **Tabel Listing:** Semua properti aktif ditampilkan dalam tabel kompak.
- **Tombol "+ Tambah Properti":** (hanya superadmin) untuk menambahkan properti baru.

### Filter & Pencarian

Panel filter di sebelah kiri (atau melalui tombol "Filter" di mobile) menyediakan:

| Filter | Deskripsi |
|---|---|
| Kawasan | Multi-select kawasan properti |
| Hadap | Multi-select arah hadap |
| Kesiapan | Multi-select status kesiapan |
| Lebar min (m) | Input numeric lebar minimum |
| Harga max | Input numeric harga maksimum (format Rp) |
| Tipe | Radio: Semua / Ruko / Villa |
| Status | Radio: Semua / In Stock / Sold Out |
| Carport | Radio: Semua / Ya / Tidak |

- Pencarian bebas (search bar) mencari ke nama properti, group, dan kawasan.
- Filter aktif ditampilkan sebagai chip di atas tabel; klik X untuk menghapus.
- Klik "Reset" untuk mengembalikan semua filter ke default.
- State filter tersimpan di URL (dapat di-bookmark/dibagikan).

### Sortir & Pagination

- Klik header kolom untuk sortir ascending/descending.
- Atur jumlah baris per halaman: 25 / 50 / 100 (default 50).
- Navigasi halaman dengan tombol Sebelumnya/Berikutnya.

---

## CRUD Properti

### Menambah Properti Baru

1. Klik tombol "+ Tambah Properti" di halaman dashboard.
2. Isi semua field yang wajib (bertanda `*`):
   - **Nama Properti** (min. 3 karakter, maks. 100)
   - **Lebar (m)** dan **Panjang (m)** (> 0, maks. 2 desimal)
   - **Hadap** (pilih minimal 1 arah)
   - **Tipe** (Ruko / Villa)
   - **Tingkat** (1–10, maks. 1 desimal)
   - **Harga (Rp)** (bilangan bulat positif, rupiah penuh)
   - **Status** (In Stock / Sold Out)
   - **Kesiapan** (Siap Huni / Siap Kosong / Siap Huni Renovasi)
   - **Kawasan** (pilih minimal 1 kawasan)
3. Field opsional: Group, Unit, Tautan Google Maps, Carport.
4. Klik "Simpan Properti" atau gunakan "Simpan & Tambah Lagi" untuk input berurutan.
5. Setelah sukses, Anda akan diarahkan ke listing dengan entry baru di-highlight.

### Melihat Detail Properti

- Klik baris properti di tabel → halaman detail menampilkan semua informasi.
- Superadmin melihat tombol "Edit" dan "Hapus" di pojok kanan atas.
- Link Google Maps (jika ada) → tombol "Buka di Google Maps".

### Mengedit Properti

1. Buka halaman detail properti → klik "Edit".
2. Form terisi data sebelumnya (prefilled).
3. Field yang diubah akan ditandai dengan titik emas (dirty indicator).
4. Klik "Simpan Perubahan" untuk menyimpan.
5. Setiap perubahan dicatat di Audit Log.

### Menghapus Properti

1. Buka halaman detail properti → klik "Hapus".
2. Konfirmasi di dialog: "Yakin hapus properti [nama]?"
3. Properti di-soft delete (tidak hilang dari database, disembunyikan).
4. Riwayat properti tetap tercatat di Audit Log.

---

## Manajemen Admin

Hanya superadmin yang dapat mengelola akun admin.

1. Buka menu **Admin** di navigasi dashboard.
2. Halaman menampilkan daftar admin beserta status aktif/nonaktif.

### Menambah Admin Baru

1. Klik tombol "+ Tambah Admin".
2. Masukkan Nama, Email, dan Password (min. 6 karakter).
3. Password di-hash dengan bcrypt sebelum disimpan.

### Menonaktifkan / Mengaktifkan Admin

1. Klik tombol Nonaktifkan/Aktifkan di baris admin.
2. Admin yang dinonaktifkan tidak bisa login (session juga dihapus).

### Reset Password Admin

1. Klik tombol "Reset Password".
2. Password sementara (angka) akan ditampilkan — segera informasikan ke admin terkait.

---

## Audit Log

Seluruh perubahan data properti tercatat di Audit Log:

- **Waktu:** Tanggal dan jam perubahan (WIB).
- **Pengguna:** Nama superadmin yang melakukan perubahan.
- **Aksi:** Tambah / Ubah / Hapus.
- **Properti:** Nama properti yang diubah.
- **Perubahan:** Detail field yang berubah (sebelum → sesudah).

Akses melalui menu **Audit Log** di navigasi dashboard (superadmin only).

---

## Keamanan

- Session disimpan di httpOnly cookie (30 hari).
- Setelah 5 kali gagal login dalam 30 menit, akun di-lockout 15 menit.
- Semua action mutasi hanya bisa dilakukan superadmin.
- CSRF protection aktif untuk semua request mutasi.
- Password di-hash dengan bcrypt (cost factor 10).

---

## Troubleshooting

| Masalah | Solusi |
|---|---|
| Lupa password | Minta superadmin lain untuk reset password |
| Akun nonaktif | Hubungi superadmin untuk mengaktifkan kembali |
| Session expired | Login ulang di `/agent/login` |
| Data tidak muncul | Periksa filter/pencarian, klik "Reset" |
| Error "403" / "Akses ditolak" | Anda login sebagai admin, bukan superadmin |

---

*Dokumen ini untuk superadmin Prime Property. Versi 1.0 — Juni 2026.*
