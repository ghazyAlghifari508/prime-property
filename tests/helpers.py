"""Helper umum: login, wait, util warna/teks."""
import re
import time

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

import config


def wait(driver, timeout=None):
    return WebDriverWait(driver, timeout or config.DEFAULT_TIMEOUT)


def goto(driver, path):
    """Buka path relatif terhadap BASE_URL."""
    url = config.BASE_URL + (path if path.startswith("/") else "/" + path)
    driver.get(url)
    return url


def login(driver, account):
    """Login via /agent/login. Mengembalikan True jika sampai dashboard."""
    goto(driver, "/agent/login")
    wait(driver).until(EC.presence_of_element_located((By.ID, "email")))

    email = driver.find_element(By.ID, "email")
    pwd = driver.find_element(By.ID, "password")
    email.clear()
    email.send_keys(account["email"])
    pwd.clear()
    pwd.send_keys(account["password"])

    driver.find_element(By.CSS_SELECTOR, "button[type=submit]").click()
    try:
        wait(driver).until(EC.url_contains("/agent/dashboard"))
        return True
    except Exception:
        return False


def logout(driver):
    """Buka dropdown profil lalu klik Keluar."""
    goto(driver, "/agent/dashboard")
    trigger = wait(driver).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "header button"))
    )
    trigger.click()
    time.sleep(0.4)
    for el in driver.find_elements(By.XPATH, "//*[contains(text(),'Keluar')]"):
        try:
            el.click()
            break
        except Exception:
            continue
    wait(driver).until(EC.url_contains("/agent/login"))


def css_color_to_rgb(value):
    """'rgb(26, 26, 26)' / 'rgba(...)' -> (26,26,26)."""
    nums = re.findall(r"[\d.]+", value)
    if len(nums) < 3:
        return None
    return tuple(int(float(n)) for n in nums[:3])


def close_to(rgb_a, rgb_b, tol=8):
    if not rgb_a or not rgb_b:
        return False
    return all(abs(a - b) <= tol for a, b in zip(rgb_a, rgb_b))


def page_text(driver):
    return driver.find_element(By.TAG_NAME, "body").text


def recover_from_dev_error(driver, attempts=3):
    """Next.js dev (Turbopack) kadang melempar error overlay transient saat
    route pertama kali di-compile ('Jest worker encountered...'). Ini BUKAN
    bug kode — reload menyelesaikannya. Helper ini reload hingga `attempts`
    kali bila overlay terdeteksi. Mengembalikan True jika halaman bersih.
    """
    for _ in range(attempts):
        src = driver.page_source
        is_error = (
            "Runtime Error" in src
            or "Jest worker encountered" in src
            or "Unhandled Runtime Error" in src
            or "__next_error__" in src
        )
        if not is_error:
            return True
        time.sleep(1.5)
        driver.refresh()
        time.sleep(1.5)
    return "Runtime Error" not in driver.page_source


def has_indonesian_markers(text):
    """Heuristik: teks UI Bahasa Indonesia (AC-9.3)."""
    markers = [
        "Beranda", "Tentang", "Kontak", "Masuk", "Properti",
        "Cari", "Filter", "Hubungi", "Kembali",
    ]
    return sum(1 for m in markers if m in text)
