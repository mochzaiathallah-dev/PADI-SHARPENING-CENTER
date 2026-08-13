import "dotenv/config";
import { prisma } from "./prisma";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("Starting seeding new categories and products...");

  // 1. Create Categories
  const aqiqahCat = await prisma.category.upsert({
    where: { slug: "aqiqah" },
    update: {},
    create: {
      name: "Aqiqah",
      slug: "aqiqah",
      description: "Layanan penyembelihan, pengolahan, dan paket aqiqah syar'i"
    }
  });

  const julehaCat = await prisma.category.upsert({
    where: { slug: "juru-sembelih-halal" },
    update: {},
    create: {
      name: "Juru Sembelih Halal",
      slug: "juru-sembelih-halal",
      description: "Jasa penyembelihan hewan halal bersertifikat BNSP"
    }
  });

  console.log("Categories initialized:", aqiqahCat.name, "and", julehaCat.name);

  // 2. Read and convert images to Base64
  const aqiqahImgPath = "C:\\Users\\Hype G12\\.gemini\\antigravity-ide\\brain\\537e327e-2906-4e61-b9ee-ae7a2a220368\\aqiqah_kambing_1785660285546.png";
  const julehaImgPath = "C:\\Users\\Hype G12\\.gemini\\antigravity-ide\\brain\\537e327e-2906-4e61-b9ee-ae7a2a220368\\halal_butcher_1785660305286.png";

  let aqiqahBase64 = "";
  let julehaBase64 = "";

  if (fs.existsSync(aqiqahImgPath)) {
    const data = fs.readFileSync(aqiqahImgPath);
    aqiqahBase64 = `data:image/png;base64,${data.toString("base64")}`;
    console.log("Aqiqah image converted to base64.");
  } else {
    console.warn("Aqiqah image file not found at:", aqiqahImgPath);
  }

  if (fs.existsSync(julehaImgPath)) {
    const data = fs.readFileSync(julehaImgPath);
    julehaBase64 = `data:image/png;base64,${data.toString("base64")}`;
    console.log("Halal butcher image converted to base64.");
  } else {
    console.warn("Halal butcher image file not found at:", julehaImgPath);
  }

  // 3. Create Products
  const p1 = await prisma.product.upsert({
    where: { slug: "kambing-aqiqah-super-premium" },
    update: {
      imageUrl: aqiqahBase64 || null,
      price: 3500000,
      originalPrice: 3800000,
      categoryId: aqiqahCat.id,
      stock: 15
    },
    create: {
      name_id: "Kambing Aqiqah Super Premium",
      name_en: "Super Premium Aqiqah Sheep",
      slug: "kambing-aqiqah-super-premium",
      description_id: "Kambing aqiqah sehat, tidak cacat, dan memenuhi syarat syar'i. Dipelihara dengan pakan organik berkualitas. Harga sudah termasuk biaya penyembelihan, pengolahan masakan (sate/gulai), prasmanan box, dan sertifikat aqiqah resmi dari Padi Sharpening Center.",
      description_en: "Healthy, flawless aqiqah sheep that meets syar'i standards. Fed with premium organic feed. Price includes slaughtering, cooking (satay/curry), box packaging, and an official aqiqah certificate from Padi Sharpening Center.",
      price: 3500000,
      originalPrice: 3800000,
      imageUrl: aqiqahBase64 || null,
      stock: 15,
      categoryId: aqiqahCat.id
    }
  });

  const p2 = await prisma.product.upsert({
    where: { slug: "jasa-juru-sembelih-halal-bersertifikat-bnsp" },
    update: {
      imageUrl: julehaBase64 || null,
      price: 250000,
      originalPrice: 300000,
      categoryId: julehaCat.id,
      stock: 50
    },
    create: {
      name_id: "Jasa Juru Sembelih Halal Bersertifikat BNSP",
      name_en: "Certified Professional Halal Slaughterer Service",
      slug: "jasa-juru-sembelih-halal-bersertifikat-bnsp",
      description_id: "Layanan juru sembelih halal profesional yang telah bersertifikat kompetensi dari BNSP. Menjamin proses penyembelihan hewan qurban, aqiqah, atau harian sesuai dengan syariat Islam yang sah, higienis, cepat, dan berperikehewanan.",
      description_en: "Professional halal slaughterer service certified by BNSP (National Board for Professional Certification). Guarantees valid Islamic sharia, hygienic, fast, and animal welfare compliant slaughtering processes for Qurban, Aqiqah, or daily livestock.",
      price: 250000,
      originalPrice: 300000,
      imageUrl: julehaBase64 || null,
      stock: 50,
      categoryId: julehaCat.id
    }
  });

  console.log("Products seeded:", p1.name_id, "and", p2.name_id);
  console.log("Seeding complete successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
