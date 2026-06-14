"""AC-5 Autentikasi Agent — login, proteksi route, logout, akun nonaktif."""
import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC

import config
from helpers import goto, wait, login, logout

pytestmark = pytest.mark.functional


def test_login_page_no_public_nav(driver):
    """AC-5.1: /agent/login standalone (tanpa header publik)."""
    goto(driver, "/agent/login")
    wait(driver).until(EC.presence_of_element_located((By.ID, "email")))
    # Tidak boleh ada nav publik Beranda/Tentang/Kontak sebagai menu
    headers = driver.find_elements(By.TAG_NAME, "header")
    for h in headers:
        assert "Tentang Kami" not in h.text, "Login page bocor header publik"


def test_login_superadmin_success(driver):
    """AC-5.1: login valid → dashboard."""
    assert login(driver, config.SUPERADMIN)
    assert "/agent/dashboard" in driver.current_url


def test_login_admin_success(driver):
    assert login(driver, config.ADMIN)
    assert "/agent/dashboard" in driver.current_url


def test_login_wrong_password_rejected(driver):
    """AC-5.1: kredensial salah ditolak (tetap di login)."""
    ok = login(driver, {"email": config.ADMIN["email"], "password": "salah-banget-123"})
    assert not ok, "Login dengan password salah seharusnya gagal"
    assert "/agent/login" in driver.current_url


def test_disabled_account_rejected(driver):
    """AC-5.2: akun dinonaktifkan tak bisa login."""
    ok = login(driver, config.DISABLED_ADMIN)
    assert not ok, "Akun nonaktif seharusnya ditolak"


def test_protected_route_redirects_without_session(driver):
    """AC-5.1 / AC-9.2: /agent/dashboard tanpa session → redirect login."""
    driver.delete_all_cookies()
    goto(driver, "/agent/dashboard")
    wait(driver).until(EC.url_contains("/agent/login"))
    assert "/agent/login" in driver.current_url


def test_logout_clears_session(superadmin_driver):
    """AC-5.3: logout → redirect login, lalu route terproteksi tak bisa diakses."""
    d = superadmin_driver
    logout(d)
    assert "/agent/login" in d.current_url
    goto(d, "/agent/dashboard")
    wait(d).until(EC.url_contains("/agent/login"))
    assert "/agent/login" in d.current_url
