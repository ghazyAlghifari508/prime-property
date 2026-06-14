"""Konfigurasi terpusat untuk suite test Prime Property.

Override lewat environment variable bila perlu, mis:
    BASE_URL=http://localhost:3000 pytest
"""
import os

BASE_URL = os.environ.get("BASE_URL", "http://localhost:3000").rstrip("/")

# Akun hasil `node --env-file=.env.local prisma/seed-test.mjs`
SUPERADMIN = {
    "email": os.environ.get("TEST_SUPERADMIN_EMAIL", "test.superadmin@primeproperty.id"),
    "password": os.environ.get("TEST_SUPERADMIN_PASSWORD", "Test#Super123"),
}
ADMIN = {
    "email": os.environ.get("TEST_ADMIN_EMAIL", "test.admin@primeproperty.id"),
    "password": os.environ.get("TEST_ADMIN_PASSWORD", "Test#Admin123"),
}
DISABLED_ADMIN = {
    "email": os.environ.get("TEST_DISABLED_EMAIL", "test.disabled@primeproperty.id"),
    "password": os.environ.get("TEST_DISABLED_PASSWORD", "Test#Disabled123"),
}

# Toggle
HEADLESS = os.environ.get("HEADLESS", "1") != "0"
BROWSER = os.environ.get("BROWSER", "chrome").lower()  # chrome | firefox

# Timeout (detik)
DEFAULT_TIMEOUT = int(os.environ.get("DEFAULT_TIMEOUT", "12"))

# Ambang performa (AC-9.1)
FCP_BUDGET_MS = int(os.environ.get("FCP_BUDGET_MS", "1500"))
FILTER_BUDGET_MS = int(os.environ.get("FILTER_BUDGET_MS", "500"))

# Brand tokens (AC-1.1) — RGB untuk pencocokan computed style
BRAND = {
    "prime_black": (26, 26, 26),     # #1A1A1A
    "prime_gold": (201, 169, 97),    # #C9A961
    "prime_red": (179, 58, 58),      # #B33A3A
    "soft_gray": (245, 245, 245),    # #F5F5F5
}
