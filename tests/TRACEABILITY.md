# Traceability Matrix — Acceptance Criteria → Test

Peta setiap AC ke fungsi test. ✅ = tercakup otomatis · 🟡 = sebagian/indikatif · 📄 = manual/eksternal.

| AC | Deskripsi | Status | Test |
|---|---|:---:|---|
| **AC-1.1** | Palette warna brand | ✅ | `test_08::test_hero_background_is_prime_black`, `test_gold_accent_present` |
| **AC-1.1** | Logo di header publik & dashboard | ✅ | `test_08::test_logo_in_public_header`, `test_logo_in_dashboard_header` |
| **AC-1.2** | Layout responsif, breakpoint | 🟡 | (visual; sebagian via window-size 1366) |
| **AC-2.1** | Hero + CTA primer, bg hitam | ✅ | `test_01::test_landing_loads_and_has_hero_cta`, `test_08::test_hero_background_is_prime_black` |
| **AC-2.2** | Properti Unggulan ≤ 6 | ✅ | `test_01::test_landing_featured_max_6` |
| **AC-2.2** | Value proposition | ✅ | `test_01::test_landing_value_props_present` |
| **AC-2.2** | Footer: kontak + link About/Contact | ✅ | `test_01::test_landing_footer_contact_links` |
| **AC-2.3** | Header sticky + urutan menu + Login Agent | ✅ | `test_01::test_header_nav_order_and_login_button`, `test_header_sticky` |
| **AC-3.1** | About: profil, visi & misi, nilai | ✅ | `test_01::test_about_page_content` |
| **AC-4.1** | Kontak: alamat/telp/email/WA | ✅ | `test_01::test_contact_info_present` |
| **AC-4.1** | Embed Google Maps | ✅ | `test_01::test_contact_maps_embed` |
| **AC-4.2** | Form: field Nama/Email/HP/Pesan | ✅ | `test_05::test_contact_form_has_fields` |
| **AC-4.2** | Validasi (email, HP ≥10 digit) | ✅ | `test_05::test_contact_invalid_email_blocked` |
| **AC-4.2** | Submit sukses + toast | ✅ | `test_05::test_contact_valid_submit_toast` |
| **AC-4.2** | Rate limit 3/IP/jam | 🟡 | (di-handle sbg skip di `test_05`; limiter in-memory) |
| **AC-5.1** | Login route terpisah, tanpa nav publik | ✅ | `test_02::test_login_page_no_public_nav` |
| **AC-5.1** | Login valid → dashboard | ✅ | `test_02::test_login_superadmin_success`, `test_login_admin_success` |
| **AC-5.1** | Kredensial salah ditolak | ✅ | `test_02::test_login_wrong_password_rejected` |
| **AC-5.1** | Route /agent terproteksi tanpa session | ✅ | `test_02::test_protected_route_...`, `test_06::test_protected_route_no_session_redirects` |
| **AC-5.1** | Lockout 5x gagal / 30 mnt | 📄 | manual (butuh 5 percobaan + jeda; hindari kunci akun di CI) |
| **AC-5.2** | Akun nonaktif ditolak | ✅ | `test_02::test_disabled_account_rejected` |
| **AC-5.2** | Admin tak lihat tombol Tambah | ✅ | `test_04::test_admin_no_add_button` |
| **AC-5.2** | Admin tak lihat menu Admin/Audit | ✅ | `test_04::test_admin_no_admin_menu` |
| **AC-5.2** | Admin tak bisa mutasi (server gating) | 🟡 | `test_04::test_admin_create_route_blocked_server_side` (smoke) |
| **AC-5.3** | Logout hapus session + redirect | ✅ | `test_02::test_logout_clears_session` |
| **AC-6.1** | Schema field properti | ✅ | terverifikasi via detail `test_04::test_detail_shows_all_fields` |
| **AC-7.1** | Tabel kolom inti | ✅ | `test_03::test_listing_table_columns` |
| **AC-7.1** | Default 50 baris | ✅ | `test_03::test_default_page_size_50` |
| **AC-7.1** | Badge status warna | 🟡 | warna via `test_08`; label via listing |
| **AC-7.1** | Klik baris → detail | ✅ | `test_03::test_row_click_opens_detail` |
| **AC-7.1** | Sort harga | ✅ | `test_03::test_sort_by_price_updates_url` |
| **AC-7.2** | Search nama/group/kawasan | ✅ | `test_03::test_search_filters_rows` |
| **AC-7.2** | Filter status/tipe | ✅ | `test_03::test_filter_status_radio_updates_url` |
| **AC-7.2** | Chip filter removable | ✅ | `test_03::test_filter_chip_appears_and_removable` |
| **AC-7.2** | URL query shareable | ✅ | `test_03::test_url_filter_shareable` |
| **AC-7.2** | Reset filter | ✅ | `test_03::test_reset_filter` |
| **AC-7.3** | Detail semua field + 2 kolom | ✅ | `test_04::test_detail_shows_all_fields` |
| **AC-7.3** | Edit/Hapus hanya superadmin | ✅ | `test_04::test_admin_detail_no_edit_delete`, `test_superadmin_detail_has_edit_delete` |
| **AC-8.1** | Tombol Tambah hanya superadmin | ✅ | `test_04::test_superadmin_sees_add_button`, `test_admin_no_add_button` |
| **AC-8.1** | Create sukses → highlight entry | ✅ | `test_04::test_create_then_highlight` |
| **AC-8.4** | Validasi form inline | ✅ | `test_04::test_create_validation_errors` |
| **AC-9.1** | FCP < 1.5s | 🟡 | `test_07::test_landing_fcp_reported` (skip bila dev > budget) |
| **AC-9.1** | Respons filter < 500ms | 🟡 | `test_07::test_filter_response_time` (indikatif) |
| **AC-9.1** | Lighthouse ≥ 85 | 📄 | Lighthouse CLI (lihat README) |
| **AC-9.2** | Route internal terproteksi | ✅ | `test_06::test_protected_route_no_session_redirects`, `test_admins_page_...` |
| **AC-9.2** | Rate limit global 100/mnt/IP → 429 | ✅ | `test_06::test_global_rate_limit_429` |
| **AC-9.2** | bcrypt, httpOnly cookie | 📄 | terverifikasi di kode (`session.ts`, `auth.ts`) |
| **AC-9.3** | UI Bahasa Indonesia | ✅ | `test_08::test_public_pages_indonesian`, `test_login_indonesian` |
| **AC-9.3** | Format Rp titik separator | ✅ | `test_08::test_rupiah_format_in_listing`, `test_no_comma_decimal_currency` |
| **AC-9.4** | Browser support 2 tahun terakhir | 🟡 | jalankan `BROWSER=firefox` + Chrome |
| **AC-10.1** | Dataset ≥ 50 properti | ✅ | `test_03::test_listing_has_rows` + seed melaporkan 56 |

## Ringkasan cakupan

- **Otomatis penuh (✅):** ~33 kriteria
- **Indikatif/sebagian (🟡):** ~7 (performa dev, responsif visual, gating server smoke)
- **Manual/eksternal (📄):** ~4 (lockout, Lighthouse, hashing internal, cross-browser penuh)

> Yang tak bisa diklaim murni dari Selenium (Lighthouse, lockout berisiko kunci akun, hashing internal) sengaja ditandai 📄 — bukan diabaikan, tapi diverifikasi lewat jalur lain yang lebih tepat.
