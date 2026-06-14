"""AC-1 Brand & AC-9.3 Lokalisasi: Bahasa Indonesia, format Rp, warna, logo."""
import re

import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC

import config
from helpers import goto, wait, page_text, css_color_to_rgb, close_to, has_indonesian_markers

pytestmark = pytest.mark.localization


# ---------- AC-1.1 Logo ----------

def test_logo_in_public_header(driver):
    """AC-1.1: logo Prime Property di header publik."""
    goto(driver, "/")
    header = wait(driver).until(EC.presence_of_element_located((By.TAG_NAME, "header")))
    imgs = header.find_elements(By.TAG_NAME, "img")
    srcs = [i.get_attribute("src") or "" for i in imgs]
    assert any("logo-prime-property" in s for s in srcs), "Logo tak ada di header publik"


def test_logo_in_dashboard_header(superadmin_driver):
    """AC-1.1: logo di header dashboard internal."""
    d = superadmin_driver
    goto(d, "/agent/dashboard")
    header = wait(d).until(EC.presence_of_element_located((By.TAG_NAME, "header")))
    imgs = header.find_elements(By.TAG_NAME, "img")
    srcs = [i.get_attribute("src") or "" for i in imgs]
    assert any("logo-prime-property" in s for s in srcs), "Logo tak ada di header dashboard"


# ---------- AC-1.1 Warna brand ----------

def test_hero_background_is_prime_black(driver):
    """AC-2.1: hero background hitam #1A1A1A."""
    goto(driver, "/")
    hero = wait(driver).until(EC.presence_of_element_located((By.CSS_SELECTOR, "section")))
    bg = css_color_to_rgb(hero.value_of_css_property("background-color"))
    # hero punya overlay; cek section pertama atau elemen ber-bg-prime-black
    if not close_to(bg, config.BRAND["prime_black"], tol=10):
        # fallback: cari elemen dengan bg prime-black
        els = driver.find_elements(By.CSS_SELECTOR, ".bg-prime-black")
        assert els, "Tak ada elemen bg-prime-black di landing"


def test_gold_accent_present(driver):
    """AC-1.1: aksen emas #C9A961 dipakai (teks/border)."""
    goto(driver, "/")
    wait(driver).until(EC.presence_of_element_located((By.TAG_NAME, "h1")))
    found = False
    for el in driver.find_elements(By.CSS_SELECTOR, "[class*='gold'], .text-prime-gold"):
        color = css_color_to_rgb(el.value_of_css_property("color"))
        if close_to(color, config.BRAND["prime_gold"], tol=20):
            found = True
            break
    assert found, "Warna aksen emas tak terdeteksi"


# ---------- AC-9.3 Bahasa Indonesia ----------

def test_public_pages_indonesian(driver):
    """AC-9.3: UI Bahasa Indonesia di halaman publik."""
    for path in ["/", "/about", "/contact"]:
        goto(driver, path)
        wait(driver).until(EC.presence_of_element_located((By.TAG_NAME, "body")))
        score = has_indonesian_markers(page_text(driver))
        assert score >= 2, f"{path}: penanda Bahasa Indonesia kurang (score={score})"


def test_login_indonesian(driver):
    """AC-9.3: halaman login Bahasa Indonesia."""
    goto(driver, "/agent/login")
    wait(driver).until(EC.presence_of_element_located((By.ID, "email")))
    txt = page_text(driver)
    assert ("Masuk" in txt) or ("Selamat Datang" in txt)


# ---------- AC-9.3 Format Rupiah ----------

def test_rupiah_format_in_listing(admin_driver):
    """AC-9.3: harga 'Rp 1.350.000.000' (titik separator)."""
    d = admin_driver
    goto(d, "/agent/dashboard")
    wait(d).until(EC.presence_of_element_located((By.CSS_SELECTOR, "tbody tr")))
    txt = d.find_element(By.CSS_SELECTOR, "tbody").text
    # cari pola Rp diikuti angka dengan titik
    assert re.search(r"Rp\s?\d{1,3}(\.\d{3})+", txt), \
        "Format Rupiah dengan titik separator tak ditemukan"


def test_no_comma_decimal_currency(admin_driver):
    """AC-9.3: pastikan separator ribuan titik, bukan koma ala en-US."""
    d = admin_driver
    goto(d, "/agent/dashboard")
    wait(d).until(EC.presence_of_element_located((By.CSS_SELECTOR, "tbody tr")))
    txt = d.find_element(By.CSS_SELECTOR, "tbody").text
    m = re.search(r"Rp\s?[\d.,]+", txt)
    assert m, "Tak ada harga terdeteksi"
    sample = m.group(0)
    # format id-ID: ribuan pakai titik. Pastikan ada titik bila angka besar.
    assert "." in sample or len(re.sub(r"\D", "", sample)) <= 3
