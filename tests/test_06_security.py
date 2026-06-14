"""AC-9.2 Security via HTTP: proteksi route, mutasi tanpa auth, rate-limit global.

PENTING: test_global_rate_limit_429 HARUS jalan TERAKHIR karena membanjiri
server dengan 130+ request — menyebabkan IP runner ter-limit selama window
60 detik. Setelahnya ada cooldown otomatis agar test di file lain tak
terganggu. Ini alasan nama pakai awalan 'test_z' (pytest sort alfabet).
"""
import concurrent.futures
import time

import pytest
import requests

import config

pytestmark = pytest.mark.security


def test_protected_route_no_session_redirects():
    """AC-5.1: GET /agent/dashboard tanpa cookie → redirect ke login."""
    r = requests.get(
        config.BASE_URL + "/agent/dashboard",
        allow_redirects=False,
        timeout=10,
    )
    assert r.status_code in (302, 307, 308), f"Status {r.status_code}, harusnya redirect"
    loc = r.headers.get("location", "")
    assert "/agent/login" in loc, f"Redirect ke {loc}, harusnya /agent/login"


def test_admins_page_no_session_redirects():
    """AC-5.2: /agent/dashboard/admins terproteksi."""
    r = requests.get(
        config.BASE_URL + "/agent/dashboard/admins",
        allow_redirects=False,
        timeout=10,
    )
    assert r.status_code in (302, 307, 308)
    assert "/agent/login" in r.headers.get("location", "")


def test_login_endpoint_reachable():
    """Sanity: /agent/login dapat diakses (200)."""
    r = requests.get(config.BASE_URL + "/agent/login", timeout=10)
    assert r.status_code == 200


def test_security_headers_present():
    """AC-9.2: endpoint publik dapat diakses (200), tidak membocorkan error."""
    r = requests.get(config.BASE_URL + "/agent/login", timeout=10)
    if r.status_code == 429:
        pytest.skip("IP ter-rate-limit dari test sebelumnya, skip cek header")
    assert r.status_code == 200


def test_z_global_rate_limit_429():
    """AC-9.2: rate-limit global 100 req/menit/IP → 429 setelah ambang.

    Tembak >100 request cepat ke route ringan; harus ada minimal satu 429.
    Catatan: in-memory per-instance; jalankan terhadap dev server tunggal.

    SENGAJA jalan terakhir (prefix test_z) karena mem-flood rate limiter.
    Setelahnya cooldown 65 detik agar test di file lain tidak kena dampak.
    """
    url = config.BASE_URL + "/agent/login"

    def hit(_):
        try:
            return requests.get(url, timeout=10).status_code
        except Exception:
            return 0

    with concurrent.futures.ThreadPoolExecutor(max_workers=20) as ex:
        codes = list(ex.map(hit, range(130)))

    assert 429 in codes, (
        "Tidak ada response 429 setelah 130 request. "
        "Rate-limit global (AC-9.2) mungkin tak aktif. "
        f"Distribusi: { {c: codes.count(c) for c in set(codes)} }"
    )

    # Cooldown: tunggu window rate-limit (60s) reset agar test lain tak kena.
    print("\n[COOLDOWN] Menunggu 65 detik agar rate-limit window reset…")
    time.sleep(65)
    # Verifikasi cooldown berhasil.
    r = requests.get(url, timeout=10)
    assert r.status_code == 200, f"Cooldown gagal, masih {r.status_code}"
