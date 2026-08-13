import "dotenv/config";
import { prisma } from "./prisma";
import * as fs from "fs";

async function main() {
  console.log("Starting seeding portfolios...");

  // Image Paths
  const img1 = "C:\\Users\\Hype G12\\.gemini\\antigravity-ide\\brain\\537e327e-2906-4e61-b9ee-ae7a2a220368\\portfolio_restorasi_1785665391358.png";
  const img2 = "C:\\Users\\Hype G12\\.gemini\\antigravity-ide\\brain\\537e327e-2906-4e61-b9ee-ae7a2a220368\\portfolio_pengasahan_1785665407849.png";
  const img3 = "C:\\Users\\Hype G12\\.gemini\\antigravity-ide\\brain\\537e327e-2906-4e61-b9ee-ae7a2a220368\\portfolio_pelatihan_1785665432547.png";

  let b1 = "";
  let b2 = "";
  let b3 = "";

  if (fs.existsSync(img1)) {
    b1 = `data:image/png;base64,${fs.readFileSync(img1).toString("base64")}`;
    console.log("Restoration image converted to base64.");
  } else {
    console.warn("Restoration image not found!");
  }

  if (fs.existsSync(img2)) {
    b2 = `data:image/png;base64,${fs.readFileSync(img2).toString("base64")}`;
    console.log("Sharpening image converted to base64.");
  } else {
    console.warn("Sharpening image not found!");
  }

  if (fs.existsSync(img3)) {
    b3 = `data:image/png;base64,${fs.readFileSync(img3).toString("base64")}`;
    console.log("Workshop image converted to base64.");
  } else {
    console.warn("Workshop image not found!");
  }

  // Insert Item 1
  const p1 = await prisma.portfolio.create({
    data: {
      title_id: "Restorasi Golok Sembelih Damascus Kuno",
      title_en: "Restoration of Antique Damascus Slaughter Golok",
      slug: "restorasi-golok-sembelih-damascus-kuno",
      description_id: "Proses restorasi menyeluruh golok sembelih Damascus yang berkarat berat. Meliputi pembersihan karat dengan metode non-destruktif, perbaikan profil bilah, pengasahan ulang hingga ketajaman silet (grit 8000), serta penggantian gagang menggunakan kayu jati premium dengan pin kuningan.",
      description_en: "Comprehensive restoration of a heavily rusted Damascus slaughter golok. Includes non-destructive rust removal, blade profile correction, sharpening to razor-sharp finish (8000 grit), and handle replacement using premium teak wood with brass pins.",
      category_id: "Restorasi",
      category_en: "Restoration",
      metric_id: "Grit 8000 Finish, 100% Fungsi Kembali",
      metric_en: "8000 Grit Finish, 100% Restored Function",
      imageUrl: b1,
    },
  });

  // Insert Item 2
  const p2 = await prisma.portfolio.create({
    data: {
      title_id: "Pengasahan Presisi Set Pisau Dapur Restoran Bintang 5",
      title_en: "Precision Sharpening of 5-Star Restaurant Chef Knife Set",
      slug: "pengasahan-presisi-set-pisau-dapur-restoran-bintang-5",
      description_id: "Layanan pengasahan berkala untuk 12 buah pisau dapur profesional milik chef kepala di restoran bintang 5 Surabaya. Pengasahan dilakukan menggunakan kombinasi batu asah alam jepang premium hingga grit 10000 untuk menjamin ketajaman mikro yang awet untuk memotong daging dan sayur presisi.",
      description_en: "Routine professional sharpening service for a set of 12 chef knives belonging to a 5-star restaurant head chef in Surabaya. Sharpened using premium Japanese waterstones up to 10000 grit to guarantee long-lasting micro-sharpness for precision meat and vegetable slicing.",
      category_id: "Pengasahan",
      category_en: "Sharpening",
      metric_id: "12 Pisau, Ketajaman Mikro Grit 10000",
      metric_en: "12 Knives, 10000 Grit Micro Sharpness",
      imageUrl: b2,
    },
  });

  // Insert Item 3
  const p3 = await prisma.portfolio.create({
    data: {
      title_id: "Pelatihan Pengasahan Bilah untuk Komunitas Jagal Halal",
      title_en: "Blade Sharpening Workshop for Halal Butcher Community",
      slug: "pelatihan-pengasahan-bilah-untuk-komunitas-jagal-halal",
      description_id: "Pelatihan tatap muka bersama 30 anggota Asosiasi Juru Sembelih Halal. Materi berfokus pada teknik mengasah cepat di lapangan menggunakan batu asah kombinasi, perawatan bilah selama proses penyembelihan massal, dan teknik pengujian ketajaman standar syar'i.",
      description_en: "Hands-on training session with 30 members of the Halal Butcher Association. Curriculum focuses on rapid field sharpening techniques using combination stones, blade maintenance during mass slaughtering, and sharia-compliant sharpness testing.",
      category_id: "Pelatihan",
      category_en: "Workshop",
      metric_id: "30+ Peserta Bersertifikat Kompeten",
      metric_en: "30+ Certified Competent Participants",
      imageUrl: b3,
    },
  });

  console.log("Portfolios seeded successfully:", p1.title_id, ",", p2.title_id, ",", p3.title_id);
  console.log("Portfolios seeding complete!");
}

main()
  .catch((e) => {
    console.error("Error during portfolios seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
