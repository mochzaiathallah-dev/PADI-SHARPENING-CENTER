import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

/**
 * API Route Sementara untuk Seeding Akun Admin
 * 
 * PENTING: Hapus atau disable route ini setelah seeding berhasil!
 * 
 * Cara menggunakan:
 * POST http://localhost:3000/api/seed-admin
 * Body (JSON): { "secret": "seed-padi-2024" }
 */
export async function POST(req: Request) {
  // Simple secret check to prevent unauthorized seeding
  const SEED_SECRET = "seed-padi-2024";

  try {
    const body = await req.json();
    if (body.secret !== SEED_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = "adminsharpening@padigroup.my.id";
    const plainPassword = "sharpeningcenter#333";
    const name = "Admin Padi Sharpening";

    // Check if admin already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({
        success: true,
        message: `Admin dengan email "${email}" sudah ada.`,
        userId: existing.id,
      });
    }

    // Hash password dengan bcrypt
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

    return NextResponse.json({
      success: true,
      message: "✅ Akun Admin berhasil dibuat!",
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        createdAt: admin.createdAt,
      },
    });
  } catch (error) {
    console.error("Seeder error:", error);
    return NextResponse.json(
      { error: "Seeder gagal. Cek log server untuk detail." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Gunakan POST dengan body JSON: { \"secret\": \"seed-padi-2024\" }",
    endpoint: "POST /api/seed-admin",
  });
}
