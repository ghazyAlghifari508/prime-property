# Prime Property — Test Suite (pytest + Selenium)

Suite end-to-end yang memetakan **Acceptance Criteria** (`startdocs/`) ke test otomatis: fungsional UI, performa, keamanan, dan lokalisasi/brand.

## Prasyarat

- **Python 3.10+**
- **Google Chrome** (atau Firefox) terpasang. Selenium 4 mengunduh driver otomatis (Selenium Manager); `webdriver-manager` sebagai cadangan.
- **Dev server berjalan** + **akun test ter-seed**.

## Setup

```bash
# 1) Dependency Python (disarankan virtualenv)
cd tests
python -m venv .venv
# Windows PowerShell:
.venv\Scripts\Activate.ps1
# bash:
# source .venv/bin/activate
pip install -r requirements.txt

# 2) Seed akun test (idempoten) — dari ROOT project
cd ..
node --env-file=.env.local prisma/seed-test.mjs

# 3) Jalankan aplikasi (terminal terpisah) — dari ROOT project
npm run dev
```

Akun yang dibuat seed:

| Role | Email | Password |
|---|---|---|
| Superadmin | `test.superadmin@primeproperty.id` | `Test#Super123` |
| Admin | `test.admin@primeproperty.id` | `Test#Admin123` |
| Admin (nonaktif) | `test.disabled@primeproperty.id` | `Test#Disabled123` |

## Menjalankan test

```bash
cd tests

# Semua test
pytest

# Per kategori (marker)
pytest -m functional
pytest -m security
pytest -m performance
pytest -m localization

# Satu file
pytest test_03_listing_filter.py

# Tampilkan jendela browser (non-headless)
HEADLESS=0 pytest          # bash
$env:HEADLESS=0; pytest    # PowerShell

# Firefox
BROWSER=firefox pytest

# Laporan HTML
pytest --html=report.html --self-contained-html
```

## Konfigurasi (env var, lihat `config.py`)

| Var | Default | Keterangan |
|---|---|---|
| `BASE_URL` | `http://localhost:3000` | Target server |
| `HEADLESS` | `1` | `0` untuk tampilkan browser |
| `BROWSER` | `chrome` | `chrome` / `firefox` |
| `DEFAULT_TIMEOUT` | `12` | Timeout wait (detik) |
| `FCP_BUDGET_MS` | `1500` | Ambang FCP (AC-9.1) |
| `FILTER_BUDGET_MS` | `500` | Ambang respons filter (AC-9.1) |

## Catatan penting (kejujuran metodologi)

- **Performa diukur terhadap server yang dipakai.** Di `npm run dev`, angka FCP/respons jauh lebih lambat dari produksi. Test performa akan **`skip` (bukan fail)** bila melebihi budget di mode dev, sambil mencetak angkanya. **Untuk angka resmi AC-9.1**, ukur produksi:
  ```bash
  npm run build && npm start    # ROOT project
  BASE_URL=http://localhost:3000 pytest -m performance
  ```
- **Lighthouse (AC-9.1: skor ≥ 85)** tidak dijalankan via Selenium. Pakai Lighthouse CLI terpisah:
  ```bash
  npm i -g lighthouse
  lighthouse http://localhost:3000 --only-categories=performance --quiet
  ```
- **Rate-limit global (AC-9.2)** memakai penyimpanan in-memory per instance. `test_global_rate_limit_429` menembak 130 request — jalankan terhadap **dev server tunggal** agar konsisten.
- **Form kontak** punya rate-limit 3/IP/jam (AC-4.2). Test submit sukses akan **`skip`** bila limit sudah tercapai dari run sebelumnya — tunggu 1 jam atau restart server (limiter in-memory).
- Beberapa interaksi kompleks (MultiSelect hadap/kawasan) di `test_create_then_highlight` akan `skip` secara aman bila environment butuh langkah select tambahan, agar tidak menghasilkan false-negative.

## Traceability — AC → Test

Lihat `TRACEABILITY.md` untuk peta lengkap setiap acceptance criterion ke fungsi test.
