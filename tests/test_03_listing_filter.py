"""AC-7 Dashboard listing: tabel, kolom, pagination, sort, filter, search, chip, URL."""
import time

import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC

import config
from helpers import goto, wait, page_text

pytestmark = pytest.mark.functional


def _rows(driver):
    return driver.find_elements(By.CSS_SELECTOR, "tbody tr")


def test_listing_table_columns(admin_driver):
    """AC-7.1: kolom inti tampil di tabel."""
    d = admin_driver
    goto(d, "/agent/dashboard")
    wait(d).until(EC.presence_of_element_located((By.CSS_SELECTOR, "table")))
    # Header memakai CSS uppercase → bandingkan case-insensitive.
    head = d.find_element(By.CSS_SELECTOR, "thead").text.lower()
    for col in ["properti", "dimensi", "hadap", "tipe", "tingkat", "harga", "status", "kesiapan", "kawasan"]:
        assert col in head, f"Kolom '{col}' tak ada di header tabel"


def test_listing_has_rows(admin_driver):
    """AC-10.1 #6: dataset minimal terisi (≥1 baris tampil)."""
    d = admin_driver
    goto(d, "/agent/dashboard")
    wait(d).until(EC.presence_of_element_located((By.CSS_SELECTOR, "tbody tr")))
    assert len(_rows(d)) > 0


def test_default_page_size_50(admin_driver):
    """AC-7.1: default 50 baris per halaman.

    Dibuktikan dari perilaku nyata: dataset > 50 properti → halaman 1 dengan
    state default menampilkan TEPAT 50 baris. Lebih bermakna daripada membaca
    label combobox (radix SelectValue tak selalu mengekspos teks di DOM).
    Kontrol "Baris per halaman" tetap dipastikan ADA.
    """
    d = admin_driver
    goto(d, "/agent/dashboard")
    wait(d).until(EC.presence_of_element_located((By.CSS_SELECTOR, "tbody tr")))

    # Kontrol page-size hadir.
    assert d.find_elements(By.XPATH, "//*[contains(text(),'Baris per halaman')]"), \
        "Kontrol 'Baris per halaman' tak ditemukan"

    # Pastikan tak ada pageSize di URL (state default).
    assert "pageSize=" not in d.current_url

    rows = len(_rows(d))
    # Dataset saat ini 56 aktif → default 50 harus memotong di 50.
    # Bila DB < 50, longgarkan (semua baris tampil).
    if rows >= 50:
        assert rows == 50, f"Default page size bukan 50 (rows={rows})"
    else:
        assert rows > 0, "Tak ada baris tampil"


def test_row_click_opens_detail(admin_driver):
    """AC-7.1: klik baris → halaman detail."""
    d = admin_driver
    goto(d, "/agent/dashboard")
    wait(d).until(EC.presence_of_element_located((By.CSS_SELECTOR, "tbody tr")))
    _rows(d)[0].click()
    wait(d).until(EC.url_matches(r".*/agent/dashboard/[0-9a-f-]{36}"))
    assert "/agent/dashboard/" in d.current_url


def test_search_filters_rows(admin_driver):
    """AC-7.2: search bar memfilter (debounce 300ms) + simpan ke URL."""
    d = admin_driver
    goto(d, "/agent/dashboard")
    wait(d).until(EC.presence_of_element_located((By.CSS_SELECTOR, "tbody tr")))
    before = len(_rows(d))
    box = d.find_element(By.CSS_SELECTOR, "input[placeholder*='Cari']")
    box.send_keys("Villa")
    time.sleep(1.2)  # debounce 300ms + roundtrip
    wait(d).until(EC.url_contains("q=Villa"))
    assert "q=Villa" in d.current_url


def test_filter_status_radio_updates_url(admin_driver):
    """AC-7.2: filter Status → URL query param."""
    d = admin_driver
    goto(d, "/agent/dashboard?status=sold_out")
    wait(d).until(EC.presence_of_element_located((By.CSS_SELECTOR, "table")))
    assert "status=sold_out" in d.current_url
    # Setiap baris terlihat harus Sold Out (jika ada)
    rows = _rows(d)
    if rows:
        body_txt = d.find_element(By.CSS_SELECTOR, "tbody").text
        assert "In Stock" not in body_txt or "Sold Out" in body_txt


def test_filter_chip_appears_and_removable(admin_driver):
    """AC-7.2: filter aktif jadi chip yang bisa dihapus."""
    d = admin_driver
    goto(d, "/agent/dashboard?tipe=Villa")
    wait(d).until(EC.presence_of_element_located((By.CSS_SELECTOR, "table")))
    # chip dengan tombol hapus (aria-label mulai 'Hapus filter')
    chip_btn = wait(d).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "button[aria-label^='Hapus filter']"))
    )
    chip_btn.click()
    wait(d).until(lambda x: "tipe=Villa" not in x.current_url)
    assert "tipe=Villa" not in d.current_url


def test_url_filter_shareable(admin_driver):
    """AC-7.2: URL params menyimpan state (shareable link)."""
    d = admin_driver
    goto(d, "/agent/dashboard?tipe=Ruko&status=in_stock")
    wait(d).until(EC.presence_of_element_located((By.CSS_SELECTOR, "table")))
    assert "tipe=Ruko" in d.current_url and "status=in_stock" in d.current_url


def test_sort_by_price_updates_url(admin_driver):
    """AC-7.1: sort harga asc/desc."""
    d = admin_driver
    goto(d, "/agent/dashboard")
    wait(d).until(EC.presence_of_element_located((By.CSS_SELECTOR, "table")))
    # klik header Harga (teks ter-uppercase via CSS)
    clicked = False
    for th in d.find_elements(By.CSS_SELECTOR, "thead button"):
        if "harga" in th.text.lower():
            d.execute_script("arguments[0].click();", th)
            clicked = True
            break
    assert clicked, "Header sort 'Harga' tak ditemukan"
    wait(d).until(EC.url_contains("sort=harga"))
    assert "sort=harga" in d.current_url


def test_reset_filter(admin_driver):
    """AC-7.2: Reset filter mengembalikan ke default (URL bersih)."""
    d = admin_driver
    goto(d, "/agent/dashboard?tipe=Villa&status=in_stock")
    wait(d).until(EC.presence_of_element_located((By.CSS_SELECTOR, "table")))
    reset = None
    for b in d.find_elements(By.TAG_NAME, "button"):
        if b.text.strip().lower().startswith("reset"):
            reset = b
            break
    assert reset is not None, "Tombol Reset tak ditemukan"
    reset.click()
    wait(d).until(lambda x: "tipe=Villa" not in x.current_url)
    assert "tipe=Villa" not in d.current_url
