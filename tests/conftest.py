"""Fixtures pytest: driver Selenium + sesi login, plus pengecekan server."""
import sys

import pytest
import requests

import config


def _make_chrome():
    from selenium import webdriver
    from selenium.webdriver.chrome.options import Options
    from selenium.webdriver.chrome.service import Service

    opts = Options()
    if config.HEADLESS:
        opts.add_argument("--headless=new")
    opts.add_argument("--window-size=1366,900")
    opts.add_argument("--no-sandbox")
    opts.add_argument("--disable-dev-shm-usage")
    opts.add_argument("--disable-gpu")
    opts.add_argument("--lang=id-ID")
    try:
        return webdriver.Chrome(options=opts)
    except Exception:
        from webdriver_manager.chrome import ChromeDriverManager
        return webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=opts)


def _make_firefox():
    from selenium import webdriver
    from selenium.webdriver.firefox.options import Options
    from selenium.webdriver.firefox.service import Service

    opts = Options()
    if config.HEADLESS:
        opts.add_argument("--headless")
    opts.set_preference("intl.accept_languages", "id-ID")
    try:
        return webdriver.Firefox(options=opts)
    except Exception:
        from webdriver_manager.firefox import GeckoDriverManager
        return webdriver.Firefox(service=Service(GeckoDriverManager().install()), options=opts)


def _new_driver():
    drv = _make_firefox() if config.BROWSER == "firefox" else _make_chrome()
    drv.set_window_size(1366, 900)
    return drv


@pytest.fixture(scope="session", autouse=True)
def _server_up():
    """Gagal cepat dengan pesan jelas bila dev server belum hidup."""
    try:
        requests.get(config.BASE_URL, timeout=5)
    except Exception:
        sys.exit(
            f"\n[SETUP] Server tidak terjangkau di {config.BASE_URL}.\n"
            f"        Jalankan dulu: npm run dev\n"
            f"        dan seed akun: node --env-file=.env.local prisma/seed-test.mjs\n"
        )


@pytest.fixture
def driver():
    d = _new_driver()
    yield d
    d.quit()


@pytest.fixture
def superadmin_driver():
    from helpers import login
    d = _new_driver()
    assert login(d, config.SUPERADMIN), "Login superadmin gagal — cek seed akun test."
    yield d
    d.quit()


@pytest.fixture
def admin_driver():
    from helpers import login
    d = _new_driver()
    assert login(d, config.ADMIN), "Login admin gagal — cek seed akun test."
    yield d
    d.quit()
