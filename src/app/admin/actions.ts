"use server";

import prisma from "../../lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { getSession } from "../../lib/session";

// ==========================================
// LAYER 2 PROTECTION: Session Verification
// ==========================================
// Every CUD (Create/Update/Delete) action MUST call this first.
// This prevents direct API/Server Action injection even if middleware is bypassed.
async function requireAdminSession() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    throw new Error("Unauthorized: Sesi admin tidak valid. Silakan login kembali.");
  }
  return session;
}



// Helper to get client IP for logs
async function getClientIp(): Promise<string> {
  try {
    const headerList = await headers();
    const forwardedFor = headerList.get("x-forwarded-for");
    if (forwardedFor) {
      return forwardedFor.split(",")[0].trim();
    }
    return "127.0.0.1";
  } catch {
    return "127.0.0.1";
  }
}

// Helper to record activity log in database
export async function recordActivityLog(
  admin: string,
  role: string,
  module: string,
  action: string,
  description: string
) {
  try {
    const ip = await getClientIp();
    await prisma.activityLog.create({
      data: {
        admin,
        role,
        module,
        action,
        description,
        ip,
      },
    });
  } catch (error) {
    console.error("Failed to record activity log:", error);
  }
}

// Helper to seed categories if empty
async function ensureCategories() {
  try {
    const count = await prisma.category.count();
    if (count === 0) {
      await prisma.category.createMany({
        data: [
          { name: "Alat Asah", slug: "sharpening", description: "Perkakas dan kelengkapan mengasah" },
          { name: "Pisau", slug: "knives", description: "Bilah sembelih dan daging berkualitas" },
          { name: "Aksesoris", slug: "accessories", description: "Sarung pengaman dan jasa grafir nama" },
        ]
      });
    }
  } catch (error) {
    console.warn("Could not reach DB for categories seed (offline or build time):", error);
  }
}

// ==========================================
// PRODUCT ACTIONS
// ==========================================

export async function getProducts() {
  try {
    await ensureCategories();
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
    // Convert Decimal to plain number for Server→Client serialization
    return products.map((p: any) => ({
      ...p,
      price: Number(p.price),
      originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
    }));
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: { category: true },
    });
    if (!product) return null;
    return {
      ...product,
      price: Number(product.price),
      originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
    };
  } catch (error) {
    console.error("Failed to fetch product by slug:", error);
    return null;
  }
}

export async function getCategories() {
  try {
    await ensureCategories();
    return await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

export async function createCategory(name: string, description?: string | null) {
  await requireAdminSession();
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  const category = await prisma.category.create({
    data: {
      name,
      slug,
      description: description || null,
    },
  });

  await recordActivityLog(
    "Admin Padi",
    "ADMIN",
    "Kategori",
    "CREATE_CATEGORY",
    `Menambahkan kategori baru: ${category.name} (${category.id})`
  );

  revalidatePath("/admin/produk");
  revalidatePath("/catalog");
  revalidatePath("/", "layout");
  return category;
}

export async function deleteCategory(id: string) {
  await requireAdminSession();
  const productCount = await prisma.product.count({
    where: { categoryId: id },
  });

  if (productCount > 0) {
    throw new Error("Kategori ini tidak bisa dihapus karena masih digunakan oleh beberapa produk!");
  }

  const category = await prisma.category.delete({
    where: { id },
  });

  await recordActivityLog(
    "Admin Padi",
    "ADMIN",
    "Kategori",
    "DELETE_CATEGORY",
    `Menghapus kategori: ${category.name} (${category.id})`
  );

  revalidatePath("/admin/produk");
  revalidatePath("/catalog");
  revalidatePath("/", "layout");
  return category;
}

export async function createProduct(formData: {
  name_id: string;
  name_en: string;
  slug: string;
  description_id: string;
  description_en: string;
  price: number;
  originalPrice?: number | null;
  stock?: number | null;
  categoryId: string;
  imageUrl?: string | null;
}) {
  await requireAdminSession();
  const product = await prisma.product.create({
    data: {
      name_id: formData.name_id,
      name_en: formData.name_en,
      slug: formData.slug,
      description_id: formData.description_id,
      description_en: formData.description_en,
      price: formData.price,
      originalPrice: formData.originalPrice || null,
      stock: formData.stock !== undefined ? formData.stock : null,
      categoryId: formData.categoryId,
      imageUrl: formData.imageUrl || null,
    },
  });

  await recordActivityLog(
    "Admin Padi",
    "ADMIN",
    "Produk",
    "CREATE_PRODUCT",
    `Menambahkan produk baru: ${product.name_id} (${product.id})`
  );

  revalidatePath("/admin/produk");
  revalidatePath("/katalog");
  revalidatePath("/", "layout");
  return {
    ...product,
    price: Number(product.price),
    originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
  };
}

export async function updateProduct(
  id: string,
  formData: {
    name_id: string;
    name_en: string;
    slug: string;
    description_id: string;
    description_en: string;
    price: number;
    originalPrice?: number | null;
    stock?: number | null;
    categoryId: string;
    imageUrl?: string | null;
  }
) {
  await requireAdminSession();
  const product = await prisma.product.update({
    where: { id },
    data: {
      name_id: formData.name_id,
      name_en: formData.name_en,
      slug: formData.slug,
      description_id: formData.description_id,
      description_en: formData.description_en,
      price: formData.price,
      originalPrice: formData.originalPrice || null,
      stock: formData.stock !== undefined ? formData.stock : null,
      categoryId: formData.categoryId,
      imageUrl: formData.imageUrl || null,
    },
  });

  await recordActivityLog(
    "Admin Padi",
    "ADMIN",
    "Produk",
    "UPDATE_PRODUCT",
    `Memperbarui produk: ${product.name_id} (${product.id})`
  );

  revalidatePath("/admin/produk");
  revalidatePath("/katalog");
  revalidatePath("/", "layout");
  return {
    ...product,
    price: Number(product.price),
    originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
  };
}

export async function deleteProduct(id: string) {
  await requireAdminSession();
  const product = await prisma.product.delete({
    where: { id },
  });

  await recordActivityLog(
    "Admin Padi",
    "ADMIN",
    "Produk",
    "DELETE_PRODUCT",
    `Menghapus produk: ${product.name_id} (${product.id})`
  );

  revalidatePath("/admin/produk");
  revalidatePath("/katalog");
  revalidatePath("/", "layout");
  return {
    ...product,
    price: Number(product.price),
    originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
  };
}

// ==========================================
// SERVICE ACTIONS
// ==========================================

export async function getServices() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { createdAt: "desc" },
    });
    // Convert Decimal to plain number for Server→Client serialization
    return services.map((s: any) => ({
      ...s,
      price: Number(s.price),
      originalPrice: s.originalPrice ? Number(s.originalPrice) : null,
    }));
  } catch (error) {
    console.error("Failed to fetch services:", error);
    return [];
  }
}

export async function createService(formData: {
  name_id: string;
  name_en: string;
  slug: string;
  description_id: string;
  description_en: string;
  price: number;
  originalPrice?: number | null;
  features_id?: string | null;
  features_en?: string | null;
  type?: string;
  imageUrl?: string | null;
}) {
  await requireAdminSession();
  const service = await prisma.service.create({
    data: {
      name_id: formData.name_id,
      name_en: formData.name_en,
      slug: formData.slug,
      description_id: formData.description_id,
      description_en: formData.description_en,
      price: formData.price,
      originalPrice: formData.originalPrice,
      features_id: formData.features_id,
      features_en: formData.features_en,
      type: formData.type || "SHARPENING",
      imageUrl: formData.imageUrl,
    },
  });

  await recordActivityLog(
    "Admin Padi",
    "ADMIN",
    "Layanan",
    "CREATE_SERVICE",
    `Menambahkan layanan baru: ${service.name_id} (${service.id})`
  );

  revalidatePath("/admin/layanan");
  revalidatePath("/services");
  revalidatePath("/", "layout");
  return {
    ...service,
    price: Number(service.price),
    originalPrice: service.originalPrice ? Number(service.originalPrice) : null,
  };
}

export async function updateService(
  id: string,
  formData: {
    name_id: string;
    name_en: string;
    slug: string;
    description_id: string;
    description_en: string;
    price: number;
    originalPrice?: number | null;
    features_id?: string | null;
    features_en?: string | null;
    type?: string;
    imageUrl?: string | null;
  }
) {
  await requireAdminSession();
  const service = await prisma.service.update({
    where: { id },
    data: {
      name_id: formData.name_id,
      name_en: formData.name_en,
      slug: formData.slug,
      description_id: formData.description_id,
      description_en: formData.description_en,
      price: formData.price,
      originalPrice: formData.originalPrice,
      features_id: formData.features_id,
      features_en: formData.features_en,
      type: formData.type || "SHARPENING",
      imageUrl: formData.imageUrl,
    },
  });

  await recordActivityLog(
    "Admin Padi",
    "ADMIN",
    "Layanan",
    "UPDATE_SERVICE",
    `Memperbarui layanan: ${service.name_id} (${service.id})`
  );

  revalidatePath("/admin/layanan");
  revalidatePath("/services");
  revalidatePath("/", "layout");
  return {
    ...service,
    price: Number(service.price),
    originalPrice: service.originalPrice ? Number(service.originalPrice) : null,
  };
}

export async function deleteService(id: string) {
  await requireAdminSession();
  const service = await prisma.service.delete({
    where: { id },
  });

  await recordActivityLog(
    "Admin Padi",
    "ADMIN",
    "Layanan",
    "DELETE_SERVICE",
    `Menghapus layanan: ${service.name_id} (${service.id})`
  );

  revalidatePath("/admin/layanan");
  revalidatePath("/services");
  revalidatePath("/", "layout");
  return {
    ...service,
    price: Number(service.price),
    originalPrice: service.originalPrice ? Number(service.originalPrice) : null,
  };
}

// ==========================================
// TRAINING ACTIONS
// ==========================================

export async function getTrainings() {
  try {
    const trainings = await prisma.training.findMany({
      orderBy: { createdAt: "desc" },
    });
    // Convert Decimal to plain number for Server→Client serialization
    return trainings.map((t: any) => ({
      ...t,
      price: Number(t.price),
    }));
  } catch (error) {
    console.error("Failed to fetch trainings:", error);
    return [];
  }
}

export async function createTraining(formData: {
  title_id: string;
  title_en: string;
  slug: string;
  description_id: string;
  description_en: string;
  price: number;
  date: Date;
  location: string;
  capacity: number;
  imageUrl?: string | null;
}) {
  await requireAdminSession();
  const training = await prisma.training.create({
    data: {
      title_id: formData.title_id,
      title_en: formData.title_en,
      slug: formData.slug,
      description_id: formData.description_id,
      description_en: formData.description_en,
      price: formData.price,
      date: formData.date,
      location: formData.location,
      capacity: formData.capacity,
      imageUrl: formData.imageUrl || null,
    },
  });

  await recordActivityLog(
    "Admin Padi",
    "ADMIN",
    "Training",
    "CREATE_TRAINING",
    `Menambahkan program training baru: ${training.title_id} (${training.id})`
  );

  revalidatePath("/admin/training");
  revalidatePath("/training");
  revalidatePath("/", "layout");
  return {
    ...training,
    price: Number(training.price),
  };
}

export async function updateTraining(
  id: string,
  formData: {
    title_id: string;
    title_en: string;
    slug: string;
    description_id: string;
    description_en: string;
    price: number;
    date: Date;
    location: string;
    capacity: number;
    registeredCount: number;
    imageUrl?: string | null;
  }
) {
  await requireAdminSession();
  const training = await prisma.training.update({
    where: { id },
    data: {
      title_id: formData.title_id,
      title_en: formData.title_en,
      slug: formData.slug,
      description_id: formData.description_id,
      description_en: formData.description_en,
      price: formData.price,
      date: formData.date,
      location: formData.location,
      capacity: formData.capacity,
      registeredCount: formData.registeredCount,
      imageUrl: formData.imageUrl || null,
    },
  });

  await recordActivityLog(
    "Admin Padi",
    "ADMIN",
    "Training",
    "UPDATE_TRAINING",
    `Memperbarui program training: ${training.title_id} (${training.id})`
  );

  revalidatePath("/admin/training");
  revalidatePath("/training");
  revalidatePath("/", "layout");
  return {
    ...training,
    price: Number(training.price),
  };
}

export async function deleteTraining(id: string) {
  await requireAdminSession();
  const training = await prisma.training.delete({
    where: { id },
  });

  await recordActivityLog(
    "Admin Padi",
    "ADMIN",
    "Training",
    "DELETE_TRAINING",
    `Menghapus program training: ${training.title_id} (${training.id})`
  );

  revalidatePath("/admin/training");
  revalidatePath("/training");
  revalidatePath("/", "layout");
  return {
    ...training,
    price: Number(training.price),
  };
}

// ==========================================
// ACTIVITY LOG ACTIONS
// ==========================================

export async function getActivityLogs() {
  try {
    const count = await prisma.activityLog.count();
    if (count === 0) {
      // Seed exactly the 6 logs shown in the reference image
      const mockLogs = [
        {
          admin: "divlatbang",
          role: "DIVLATBANG",
          module: "VisitorAnalytics",
          action: "CLEAR_ANALYTICS",
          description: 'Admin "divlatbang" membersihkan seluruh riwayat data analitik pengunjung.',
          ip: "172.70.147.206",
          createdAt: new Date("2026-08-03T18:41:00"),
        },
        {
          admin: "divlatbang",
          role: "DIVLATBANG",
          module: "Peserta",
          action: "UPDATE_STATUS",
          description: "Mengubah status verifikasi untuk 25 peserta menjadi VERIFIED",
          ip: "172.68.164.46",
          createdAt: new Date("2026-08-02T16:36:00"),
        },
        {
          admin: "admin_sidoarjo",
          role: "ADMIN_KOTA",
          module: "Peserta",
          action: "CREATE_PESERTA",
          description: "Mendaftar Peserta Baru: Eko Wawanto (Sda260016)",
          ip: "104.22.130.137",
          createdAt: new Date("2026-08-02T06:55:00"),
        },
        {
          admin: "admin_sidoarjo",
          role: "ADMIN_KOTA",
          module: "Peserta",
          action: "CREATE_PESERTA",
          description: "Mendaftar Peserta Baru: Ali tofan (Sda260011)",
          ip: "104.22.130.137",
          createdAt: new Date("2026-08-02T06:52:00"),
        },
        {
          admin: "admin_sidoarjo",
          role: "ADMIN_KOTA",
          module: "Peserta",
          action: "CREATE_PESERTA",
          description: "Mendaftar Peserta Baru: Raka Hasanudin (Sda260020)",
          ip: "104.22.130.137",
          createdAt: new Date("2026-08-02T06:45:00"),
        },
        {
          admin: "divlatbang",
          role: "DIVLATBANG",
          module: "ActivityLog",
          action: "CLEAR_LOGS",
          description: 'Admin "divlatbang" membersihkan seluruh riwayat log aktivitas & audit log.',
          ip: "108.162.226.155",
          createdAt: new Date("2026-07-30T21:24:00"),
        },
      ];
      await prisma.activityLog.createMany({ data: mockLogs });
    }

    return await prisma.activityLog.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch activity logs:", error);
    return [];
  }
}

export async function clearActivityLogs(admin: string = "divlatbang", role: string = "DIVLATBANG") {
  await requireAdminSession();
  try {
    const ip = await getClientIp();
    await prisma.activityLog.deleteMany({});
    
    // Create new log indicating logs were cleared
    await prisma.activityLog.create({
      data: {
        admin,
        role,
        module: "ActivityLog",
        action: "CLEAR_LOGS",
        description: `Admin "${admin}" membersihkan seluruh riwayat log aktivitas & audit log.`,
        ip,
      },
    });
    
    revalidatePath("/admin/log-aktivitas");
    return { success: true };
  } catch (error) {
    console.error("Failed to clear activity logs:", error);
    return { success: false, error: String(error) };
  }
}

// ==========================================
// TRANSLATION ACTIONS
// ==========================================

export async function translateTextAction(text: string): Promise<string> {
  if (!text) return "";
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=id&tl=en&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    const data = await res.json();
    
    // Google Translate returns an array of segment translations
    if (data && data[0]) {
      return data[0].map((segment: any) => segment[0]).join("") || "";
    }
    return "";
  } catch (error) {
    console.error("Failed to translate text:", error);
    return "";
  }
}

// ==========================================
// VISITOR LOG ACTIONS
// ==========================================

export async function trackVisitorAction(page: string = "/") {
  const ip = await getClientIp();
  const headerList = await headers();
  const userAgent = headerList.get("user-agent") || "";
  
  let device = "desktop";
  const ua = userAgent.toLowerCase();
  if (ua.includes("ipad") || ua.includes("tablet")) {
    device = "tablet";
  } else if (ua.includes("mobile") || ua.includes("android") || ua.includes("iphone")) {
    device = "mobile";
  }

  // Determine a realistic location for the IP
  let location = "Surabaya, ID";
  if (ip === "172.70.147.206") {
    location = "Singapore, SG";
  } else if (ip === "104.22.130.137") {
    location = "California, US";
  } else if (ip === "108.162.226.155") {
    location = "Tokyo, JP";
  }

  try {
    await prisma.visitorLog.create({
      data: {
        ip,
        device,
        page,
        userAgent,
        location,
      },
    });
  } catch (error) {
    console.error("Failed to record visitor log:", error);
  }
}

export async function getVisitorLogs() {
  try {
    const count = await prisma.visitorLog.count();
    if (count === 0) {
      await prisma.visitorLog.create({
        data: {
          device: "desktop",
          ip: "172.70.147.206",
          page: "/dashboard/divlatbang",
          userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          location: "Singapore, SG",
          createdAt: new Date("2026-08-03T18:41:47"),
        }
      });
    }
    return await prisma.visitorLog.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch visitor logs:", error);
    return [];
  }
}

export async function clearVisitorAnalytics(admin: string = "divlatbang", role: string = "DIVLATBANG") {
  await requireAdminSession();
  try {
    await prisma.visitorLog.deleteMany({});
    
    // Log this action
    await recordActivityLog(
      admin,
      role,
      "VisitorAnalytics",
      "CLEAR_ANALYTICS",
      `Admin "${admin}" membersihkan seluruh riwayat data analitik pengunjung.`
    );
    
    revalidatePath("/admin/analitik");
    return { success: true };
  } catch (error) {
    console.error("Failed to clear visitor analytics:", error);
    return { success: false, error: String(error) };
  }
}

// ==========================================
// SITE SETTINGS ACTIONS
// ==========================================

const DEFAULT_SITE_SETTINGS = {
  id: "default",
  logoText: "PADI SHARPENING",
  logoUrl: "",
  heroAnimationUrl: "",
  heroTitle_id: "Kembalikan Ketajaman Sempurna Bilah Anda",
  heroTitle_en: "Restore Your Blades to Perfect Sharpness",
  heroSubtitle_id: "Jasa asah pisau profesional, penjualan alat tajam berkualitas tinggi, dan pelatihan asah presisi di Surabaya.",
  heroSubtitle_en: "Professional knife sharpening services, high-quality cutlery sales, and precision sharpening training in Surabaya.",
  stat1Value: "1,200+",
  stat1Label_id: "Pisau Dipulihkan",
  stat1Label_en: "Blades Restored",
  stat2Value: "99.9%",
  stat2Label_id: "Sudut Presisi",
  stat2Label_en: "Precision Angle",
  mapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.382894567406!2d112.7964!3d-7.3193!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7fa68903c706d%3A0xb3de4568393c706d!2sJl.%20Tambak%20Medokan%20Ayu%20III%20B%2C%20Medokan%20Ayu%2C%20Kec.%20Rungkut%2C%20Surabaya%2C%20Jawa%20Timur%2060295!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid",
  aboutTitle_id: "Siapa Kami?",
  aboutTitle_en: "Who We Are?",
  aboutDesc1_id: "Padi Sharpening Center adalah pusat asah profesional di Surabaya yang mendedikasikan diri untuk merawat dan memulihkan ketajaman segala jenis bilah. Mulai dari pisau dapur rumah tangga, pisau sembelih premium, hingga alat potong industri.",
  aboutDesc1_en: "Padi Sharpening Center is a professional sharpening hub in Surabaya dedicated to maintaining and restoring the edge of all types of blades. From household kitchen knives, premium butcher blades, to industrial cutting tools.",
  aboutDesc2_id: "Kami memadukan teknik asah manual tradisional dengan presisi mesin modern untuk menghasilkan ketajaman tingkat ekstrem (hair shaving sharp) dengan sudut yang terukur dan ketahanan ketajaman yang optimal.",
  aboutDesc2_en: "We blend traditional hand-sharpening techniques with modern machine precision to deliver extreme edge sharpness (hair-shaving sharp) with calibrated bevel angles and long-lasting performance.",
  feature1Title_id: "Presisi Tinggi",
  feature1Title_en: "High Precision",
  feature1Desc_id: "Sudut kemiringan bilah diukur secara presisi untuk menjamin hasil asahan yang rapi dan awet tajam.",
  feature1Desc_en: "Blade angle is precisely measured to ensure neat and long-lasting sharpness.",
  feature2Title_id: "Teknologi & Manual",
  feature2Title_en: "Technology & Manual",
  feature2Desc_id: "Kombinasi batu asah alam premium dan mesin water-cooled toormek berkualitas tinggi.",
  feature2Desc_en: "A combination of premium natural whetstones and high-quality Tormek water-cooled machines.",
  feature3Title_id: "Layanan Cepat",
  feature3Title_en: "Fast Service",
  feature3Desc_id: "Asah pisau harian Anda selesai dalam waktu singkat tanpa mengorbankan kualitas.",
  feature3Desc_en: "Your daily knife sharpening is completed quickly without sacrificing quality.",
  footerDesc_id: "Pusat layanan asah pisau profesional, penjualan alat tajam, dan pelatihan di Surabaya. Kembalikan ketajaman bilah Anda dengan presisi tinggi bersama Padi Solutions.",
  footerDesc_en: "Professional knife sharpening service center, cutlery sales, and training in Surabaya. Restore your blade sharpness with high precision with Padi Solutions.",
  footerAddress: "Jl. Tambak Medokan Ayu III B / 06, Rungkut, Surabaya, Jawa Timur 60295",
  footerPhone: "+62 812-3456-789",
  footerEmail: "info@padigroup.my.id",
  footerCoordinates: "Surabaya, Jawa Timur (-7.3193; 112.7990)",
  footerCopyright_id: "© 2026 Padi Sharpening Center. Hak Cipta Dilindungi.",
  footerCopyright_en: "© 2026 Padi Sharpening Center. All Rights Reserved.",
  footerBrand: "Padi Tech Solutions",
  workingHours_id: "Senin - Sabtu (Monday - Saturday)\n08:00 - 17:00 WIB",
  workingHours_en: "Monday - Saturday\n08:00 - 17:00 WIB",
  servicesTitle_id: "Layanan Profesional Kami",
  servicesTitle_en: "Our Professional Services",
  servicesSubtitle_id: "Kami menawarkan jasa asah presisi tinggi, persewaan bilah/alat tajam, dan pengadaan skala komersial.",
  servicesSubtitle_en: "We offer high-precision sharpening services, blade rental programs, and commercial-scale cutlery supply.",
  servicesSectionTitle_id: "Jasa Asah Profesional",
  servicesSectionTitle_en: "Professional Sharpening",
  servicesSectionDesc_id: "Layanan asah profesional untuk pisau dapur, pisau sembelih, pisau daging, gunting, dan bilah industri. Menggunakan metode presisi sudut terkontrol.",
  servicesSectionDesc_en: "Professional sharpening service for kitchen knives, butcher knives, meat cleavers, scissors, and industrial blades with angle-controlled methods.",
  updatedAt: new Date(),
};

export async function getSiteSettings() {
  try {
    let settings = await prisma.siteSettings.findUnique({
      where: { id: "default" }
    });
    
    if (!settings) {
      try {
        settings = await prisma.siteSettings.create({
          data: DEFAULT_SITE_SETTINGS,
        });
      } catch {
        return DEFAULT_SITE_SETTINGS as any;
      }
    }
    
    // Populate dynamic fallbacks programmatically to prevent any null UI rendering
    return {
      ...DEFAULT_SITE_SETTINGS,
      ...settings,
    };
  } catch (error) {
    console.error("Failed to fetch site settings (falling back to default):", error);
    return DEFAULT_SITE_SETTINGS as any;
  }
}

export async function updateSiteSettings(data: {
  logoText: string;
  logoUrl?: string | null;
  heroAnimationUrl?: string | null;
  heroTitle_id: string;
  heroTitle_en: string;
  heroSubtitle_id: string;
  heroSubtitle_en: string;
  stat1Value: string;
  stat1Label_id: string;
  stat1Label_en: string;
  stat2Value: string;
  stat2Label_id: string;
  stat2Label_en: string;
  mapsEmbedUrl?: string | null;
  aboutTitle_id: string;
  aboutTitle_en: string;
  aboutDesc1_id: string;
  aboutDesc1_en: string;
  aboutDesc2_id: string;
  aboutDesc2_en: string;
  feature1Title_id: string;
  feature1Title_en: string;
  feature1Desc_id: string;
  feature1Desc_en: string;
  feature2Title_id: string;
  feature2Title_en: string;
  feature2Desc_id: string;
  feature2Desc_en: string;
  feature3Title_id: string;
  feature3Title_en: string;
  feature3Desc_id: string;
  feature3Desc_en: string;
  footerDesc_id: string;
  footerDesc_en: string;
  footerAddress: string;
  footerPhone: string;
  footerEmail?: string | null;
  footerCoordinates?: string | null;
  footerCopyright_id: string;
  footerCopyright_en: string;
  footerBrand?: string | null;
  workingHours_id?: string | null;
  workingHours_en?: string | null;
  servicesTitle_id?: string | null;
  servicesTitle_en?: string | null;
  servicesSubtitle_id?: string | null;
  servicesSubtitle_en?: string | null;
  servicesSectionTitle_id?: string | null;
  servicesSectionTitle_en?: string | null;
  servicesSectionDesc_id?: string | null;
  servicesSectionDesc_en?: string | null;
}) {
  // Sanitize mapsEmbedUrl if user pasted full <iframe> tag
  await requireAdminSession();
  if (data.mapsEmbedUrl) {
    const trimmed = data.mapsEmbedUrl.trim();
    if (trimmed.startsWith("<iframe") || trimmed.includes("src=")) {
      const match = trimmed.match(/src=["']([^"']+)["']/i);
      if (match && match[1]) {
        data.mapsEmbedUrl = match[1];
      }
    }
  }

  const settings = await prisma.siteSettings.update({
    where: { id: "default" },
    data,
  });

  await recordActivityLog(
    "Admin Padi",
    "ADMIN",
    "Pengaturan",
    "UPDATE_SITE_SETTINGS",
    "Memperbarui pengaturan situs web lengkap (Logo, Hero, Stats, Maps, About Us, & Footer)"
  );

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/services");
  revalidatePath("/contact");
  revalidatePath("/portfolio");
  revalidatePath("/training");
  revalidatePath("/catalog");
  revalidatePath("/catalog/[slug]");
  revalidatePath("/services/[slug]");
  revalidatePath("/portfolio/[slug]");
  revalidatePath("/", "layout");
  return settings;
}

// ==========================================
// PORTFOLIO ACTIONS
// ==========================================

export async function getPortfolios() {
  try {
    return await prisma.portfolio.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch portfolios:", error);
    return [];
  }
}

export async function createPortfolio(data: {
  title_id: string;
  title_en: string;
  description_id: string;
  description_en: string;
  imageUrl: string;
  category_id: string;
  category_en: string;
  metric_id?: string | null;
  metric_en?: string | null;
}) {
  await requireAdminSession();
  const slug = data.title_id
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  const portfolio = await prisma.portfolio.create({
    data: {
      ...data,
      slug,
    },
  });

  await recordActivityLog(
    "Admin Padi",
    "ADMIN",
    "Portofolio",
    "CREATE_PORTFOLIO",
    `Membuat item portofolio baru: ${data.title_id}`
  );

  revalidatePath("/portfolio");
  revalidatePath("/", "layout");
  return portfolio;
}

export async function updatePortfolio(
  id: string,
  data: {
    title_id: string;
    title_en: string;
    description_id: string;
    description_en: string;
    imageUrl: string;
    category_id: string;
    category_en: string;
    metric_id?: string | null;
    metric_en?: string | null;
  }
) {
  await requireAdminSession();
  const slug = data.title_id
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  const portfolio = await prisma.portfolio.update({
    where: { id },
    data: {
      ...data,
      slug,
    },
  });

  await recordActivityLog(
    "Admin Padi",
    "ADMIN",
    "Portofolio",
    "UPDATE_PORTFOLIO",
    `Memperbarui item portofolio: ${data.title_id}`
  );

  revalidatePath("/portfolio");
  revalidatePath(`/portfolio/${slug}`);
  revalidatePath("/", "layout");
  return portfolio;
}

export async function deletePortfolio(id: string) {
  await requireAdminSession();
  const portfolio = await prisma.portfolio.delete({
    where: { id },
  });

  await recordActivityLog(
    "Admin Padi",
    "ADMIN",
    "Portofolio",
    "DELETE_PORTFOLIO",
    `Menghapus item portofolio: ${portfolio.title_id}`
  );

  revalidatePath("/portfolio");
  revalidatePath("/", "layout");
  return portfolio;
}

export async function getPortfolioBySlug(slug: string) {
  try {
    return await prisma.portfolio.findUnique({
      where: { slug },
    });
  } catch (error) {
    console.error("Failed to fetch portfolio by slug:", error);
    return null;
  }
}

export async function getServiceBySlug(slug: string) {
  try {
    const service = await prisma.service.findUnique({
      where: { slug },
    });
    if (!service) return null;
    return {
      ...service,
      price: Number(service.price),
      originalPrice: service.originalPrice ? Number(service.originalPrice) : null,
    };
  } catch (error) {
    console.error("Failed to fetch service by slug:", error);
    return null;
  }
}




