/**
 * Seeder Script: Membuat akun Admin Master untuk Padi Sharpening Center
 *
 * Cara menjalankan:
 *   npx ts-node --project tsconfig.json src/lib/seed-admin.ts
 *
 * Atau gunakan API route sementara: POST /api/seed-admin
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seedAdmin() {
  const email = "adminsharpening@padigroup.my.id";
  const plainPassword = "sharpeningcenter#333";
  const name = "Admin Padi Sharpening";

  console.log("🔐 Memulai seeder akun Admin...");

  // Check if admin already exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`✅ Admin dengan email "${email}" sudah ada. Melewati pembuatan.`);
    return;
  }

  // Hash password
  console.log("🔑 Mengenkripsi password dengan bcrypt (cost factor: 12)...");
  const hashedPassword = await bcrypt.hash(plainPassword, 12);

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: "ADMIN",
    },
  });

  console.log("✅ Akun Admin berhasil dibuat!");
  console.log(`   ID    : ${admin.id}`);
  console.log(`   Email : ${admin.email}`);
  console.log(`   Nama  : ${admin.name}`);
  console.log(`   Role  : ${admin.role}`);
  console.log(`   Pass  : [terenkripsi dengan bcrypt]`);
}

seedAdmin()
  .catch((e) => {
    console.error("❌ Seeder gagal:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
