// Seed akun test (idempoten) untuk suite Selenium/pytest.
// Jalankan: node prisma/seed-test.mjs
//
// Membuat 1 superadmin + 1 admin dengan password TETAP agar test reproducible.
// Aman dijalankan berulang (upsert by email). JANGAN pakai akun ini di produksi.

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const ACCOUNTS = [
  {
    nama: "Test Superadmin",
    email: "test.superadmin@primeproperty.id",
    password: "Test#Super123",
    role: "superadmin",
  },
  {
    nama: "Test Admin",
    email: "test.admin@primeproperty.id",
    password: "Test#Admin123",
    role: "admin",
  },
  {
    nama: "Test Admin Nonaktif",
    email: "test.disabled@primeproperty.id",
    password: "Test#Disabled123",
    role: "admin",
    isActive: false,
  },
];

async function main() {
  for (const a of ACCOUNTS) {
    const passwordHash = await bcrypt.hash(a.password, 10);
    const user = await prisma.user.upsert({
      where: { email: a.email },
      update: {
        nama: a.nama,
        passwordHash,
        role: a.role,
        isActive: a.isActive ?? true,
      },
      create: {
        nama: a.nama,
        email: a.email,
        passwordHash,
        role: a.role,
        isActive: a.isActive ?? true,
      },
    });
    console.log(`✓ ${a.role.padEnd(10)} ${a.email}  (id=${user.id})`);
  }

  const propCount = await prisma.property.count({ where: { deletedAt: null } });
  console.log(`\nProperti aktif di DB: ${propCount} (AC-10.1 #6 minimal 50)`);
  console.log("\nKredensial test:");
  for (const a of ACCOUNTS) {
    console.log(`  ${a.email}  →  ${a.password}`);
  }
}

main()
  .catch((e) => {
    console.error("Seed gagal:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
