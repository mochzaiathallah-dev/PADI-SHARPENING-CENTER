"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { trackVisitorAction, getSiteSettings } from "../app/admin/actions";

export type Theme = "light" | "dark" | "system";
export type Language = "id" | "en";

export const translations = {
  id: {
    navHome: "Beranda",
    navAbout: "Tentang Kami",
    navServices: "Layanan",
    navPortfolio: "Portofolio",
    navCatalog: "Katalog Toko",
    navTraining: "Pelatihan",
    navContact: "Hubungi Kami",
    
    heroTitle: "Kembalikan Ketajaman Sempurna Bilah Anda",
    heroSubtitle: "Jasa asah pisau profesional, penjualan alat tajam berkualitas tinggi, dan pelatihan asah presisi di Surabaya.",
    heroCtaMain: "Pesan Jasa Asah",
    heroCtaSec: "Lihat Katalog Toko",
    
    aboutTitle: "Siapa Kami?",
    aboutDesc1: "Padi Sharpening Center adalah pusat asah profesional di Surabaya yang mendedikasikan diri untuk merawat dan memulihkan ketajaman segala jenis bilah. Mulai dari pisau dapur rumah tangga, pisau sembelih premium, hingga alat potong industri.",
    aboutDesc2: "Kami memadukan teknik asah manual tradisional dengan presisi mesin modern untuk menghasilkan ketajaman tingkat ekstrem (hair shaving sharp) dengan sudut yang terukur dan ketahanan ketajaman yang optimal.",
    
    feature1Title: "Presisi Tinggi",
    feature1Desc: "Sudut kemiringan bilah diukur secara presisi untuk menjamin hasil asahan yang rapi dan awet tajam.",
    feature2Title: "Teknologi & Manual",
    feature2Desc: "Kombinasi batu asah alam premium dan mesin water-cooled toormek berkualitas tinggi.",
    feature3Title: "Layanan Cepat",
    feature3Desc: "Asah pisau harian Anda selesai dalam waktu singkat tanpa mengorbankan kualitas.",
    
    ctaTitle: "Bilah Anda Tumpul? Kami Punya Solusinya.",
    ctaDesc: "Konsultasikan kebutuhan asah pisau Anda, beli pisau sembelih berkualitas, atau daftarkan diri dalam pelatihan asah profesional.",
    ctaBtn: "Hubungi WhatsApp Kami",
    
    footerDesc: "Pusat layanan asah pisau profesional, penjualan alat tajam, dan pelatihan di Surabaya. Kembalikan ketajaman bilah Anda dengan presisi tinggi bersama Padi Solutions.",
    footerAddress: "Jl. Tambak Medokan Ayu III B / 06, Kelurahan Medokan Ayu, Kecamatan Rungkut, Surabaya, Jawa Timur, 60295",
    footerQuickLinks: "Tautan Cepat",
    footerContact: "Kontak & Lokasi",
    footerCopyright: "© 2026 Padi Sharpening Center. Hak Cipta Dilindungi.",

    // Sprint 3 - Katalog Translations
    catalogTitle: "Katalog Produk Kami",
    catalogSubtitle: "Kami menjual alat asah premium, pisau sembelih/daging berkualitas tinggi, dan aksesoris perawatan bilah.",
    catAll: "Semua Produk",
    catSharpening: "Alat Asah",
    catKnives: "Pisau",
    catAccessories: "Aksesoris",
    searchPlaceholder: "Cari produk...",
    stock: "Stok",
    inStock: "Tersedia",
    outOfStock: "Habis",
    orderWhatsApp: "Pesan via WhatsApp",
    
    // Sprint 3 - Layanan Translations
    layananTitle: "Layanan Profesional Kami",
    layananSubtitle: "Kami menawarkan jasa asah presisi tinggi, persewaan bilah/alat tajam, dan pengadaan skala komersial.",
    srvSharpening: "Jasa Asah Profesional",
    srvRental: "Sewa & Peminjaman Alat",
    srvProcurement: "Pengadaan Alat-Alat",
    srvSharpeningDesc: "Layanan asah profesional untuk pisau dapur, pisau sembelih, pisau daging, gunting, dan bilah industri. Menggunakan metode presisi sudut terkontrol.",
    srvRentalDesc: "Layanan peminjaman pisau dan alat potong standar industri makanan untuk restoran, katering, dan butcher di Surabaya.",
    srvProcurementDesc: "Layanan pengadaan alat asah, pisau sembelih, dan perlengkapan asah komersial untuk RPH, restoran, hotel, dan industri kuliner.",
    inquireWhatsApp: "Hubungi Untuk Layanan",
    priceStarts: "Mulai dari",

    // Sprint 3 - Training Translations
    trainingTitle: "Program Pelatihan Kami",
    trainingSubtitle: "Tingkatkan keterampilan mengasah bilah dan teknik pemakaian secara profesional bersama instruktur ahli kami.",
    courseSchedule: "Jadwal",
    courseCapacity: "Kapasitas",
    courseRegistered: "Terdaftar",
    courseRegisterNow: "Daftar Pelatihan",
    coursePrivateAsah: "Private Asah Presisi",
    coursePrivateAsahDesc: "Pelatihan intensif 1-on-1 mengenai teori sudut asah, penggunaan whetstone batu alam premium, honing steel, dan strop kulit.",
    courseSembelih: "Pelatihan Sembelih Profesional",
    courseSembelihDesc: "Pelatihan teknik pemakaian bilah sembelih, pengasahan cepat tanggap darurat, dan standar kelayakan tajam bilah untuk RPH.",
    courseOthers: "Workshop & Group Masterclass",
    courseOthersDesc: "Pelatihan asah kelompok (min 5 orang) untuk komunitas hobiis, koki restoran, atau staf jagal di RPH/industri kuliner.",
  },
  en: {
    navHome: "Home",
    navAbout: "About Us",
    navServices: "Services",
    navPortfolio: "Portfolio",
    navCatalog: "Shop Catalog",
    navTraining: "Training",
    navContact: "Contact Us",
    
    heroTitle: "Restore Your Blades to Perfect Sharpness",
    heroSubtitle: "Professional knife sharpening services, high-quality cutlery sales, and precision sharpening training in Surabaya.",
    heroCtaMain: "Book Sharpening Service",
    heroCtaSec: "Browse Shop",
    
    aboutTitle: "Who We Are",
    aboutDesc1: "Padi Sharpening Center is a professional sharpening hub in Surabaya dedicated to maintaining and restoring the edge of all types of blades. From household kitchen knives, premium butcher blades, to industrial cutting tools.",
    aboutDesc2: "We blend traditional hand-sharpening techniques with modern machine precision to deliver extreme edge sharpness (hair-shaving sharp) with calibrated bevel angles and long-lasting performance.",
    
    feature1Title: "High Precision",
    feature1Desc: "Bevel angles are precisely calibrated to ensure clean cuts and long-lasting sharpness.",
    feature2Title: "Tech & Manual",
    feature2Desc: "A combined method using premium natural whetstones and high-quality water-cooled machines.",
    feature3Title: "Fast Service",
    feature3Desc: "Get your daily knives sharpened quickly without compromising on ultimate quality.",
    
    ctaTitle: "Dull Blades? We Have the Solution.",
    ctaDesc: "Consult your sharpening needs, purchase high-quality slaughter knives, or enroll in our professional sharpening academy.",
    ctaBtn: "Contact Our WhatsApp",
    
    footerDesc: "Professional sharpening service center, knife sales, and training academy in Surabaya. Restore your blade's edge to maximum precision with Padi Solutions.",
    footerAddress: "Jl. Tambak Medokan Ayu III B / 06, Medokan Ayu, Rungkut, Surabaya, 60295",
    footerQuickLinks: "Quick Links",
    footerContact: "Contact & Location",
    footerCopyright: "© 2026 Padi Sharpening Center. All Rights Reserved.",

    // Sprint 3 - Katalog Translations
    catalogTitle: "Our Product Catalog",
    catalogSubtitle: "We sell premium sharpening tools, high-quality slaughter/butcher knives, and blade care accessories.",
    catAll: "All Products",
    catSharpening: "Sharpening Tools",
    catKnives: "Knives",
    catAccessories: "Accessories",
    searchPlaceholder: "Search products...",
    stock: "Stock",
    inStock: "In Stock",
    outOfStock: "Out of Stock",
    orderWhatsApp: "Order via WhatsApp",
    
    // Sprint 3 - Layanan Translations
    layananTitle: "Our Professional Services",
    layananSubtitle: "We offer high-precision sharpening services, blade rental programs, and commercial-scale cutlery supply.",
    srvSharpening: "Professional Sharpening",
    srvRental: "Cutlery Rental Program",
    srvProcurement: "Bulk Supply & Procurement",
    srvSharpeningDesc: "Professional sharpening service for kitchen knives, butcher knives, meat cleavers, scissors, and industrial blades with angle-controlled methods.",
    srvRentalDesc: "Food-industry grade knife and cutting equipment rentals for restaurants, caterers, and butcher shops in Surabaya.",
    srvProcurementDesc: "Procurement of professional sharpening tools, slaughter knives, and equipment for abattoirs, hotels, and restaurant chains.",
    inquireWhatsApp: "Inquire For Service",
    priceStarts: "Starts from",

    // Sprint 3 - Training Translations
    trainingTitle: "Our Training Programs",
    trainingSubtitle: "Enhance your blade sharpening skills and handling techniques professionally with our expert instructors.",
    courseSchedule: "Schedule",
    courseCapacity: "Capacity",
    courseRegistered: "Registered",
    courseRegisterNow: "Register Training",
    coursePrivateAsah: "Private Precision Sharpening",
    coursePrivateAsahDesc: "Intensive 1-on-1 coaching covering bevel angle theories, premium natural whetstones, honing steels, and leather strops.",
    courseSembelih: "Professional Slaughter Training",
    courseSembelihDesc: "Instruction in slaughter blade handling, quick emergency edge maintenance, and blade sharpness testing guidelines for abattoirs.",
    courseOthers: "Workshop & Group Masterclass",
    courseOthersDesc: "Group sharpening workshops (min 5 people) for hobbyists, kitchen crews, or slaughterhouse butchers.",
  }
};

type AppContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.id) => string;
  logoText: string;
  logoUrl: string | null;
  footerPhone: string;
  footerAddress: string;
  footerEmail: string | null;
  footerCoordinates: string | null;
  footerCopyright_id: string;
  footerCopyright_en: string;
  footerBrand: string | null;
  footerDesc_id: string;
  footerDesc_en: string;
  workingHours_id: string | null;
  workingHours_en: string | null;
  mapsEmbedUrl: string;
  servicesTitle_id: string;
  servicesTitle_en: string;
  servicesSubtitle_id: string;
  servicesSubtitle_en: string;
  servicesSectionTitle_id: string;
  servicesSectionTitle_en: string;
  servicesSectionDesc_id: string;
  servicesSectionDesc_en: string;
  refreshSettings: () => Promise<void>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ 
  children, 
  initialSettings 
}: { 
  children: React.ReactNode; 
  initialSettings?: any;
}) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [language, setLanguageState] = useState<Language>("id");
  const [logoText, setLogoText] = useState(initialSettings?.logoText || "PADI SHARPENING");
  const [logoUrl, setLogoUrl] = useState<string | null>(initialSettings?.logoUrl || null);
  
  // Footer state values
  const [footerPhone, setFooterPhone] = useState(initialSettings?.footerPhone || "+62 812-3456-789");
  const [footerAddress, setFooterAddress] = useState(initialSettings?.footerAddress || "Jl. Tambak Medokan Ayu III B / 06, Rungkut, Surabaya, Jawa Timur");
  const [footerEmail, setFooterEmail] = useState<string | null>(initialSettings?.footerEmail || null);
  const [footerCoordinates, setFooterCoordinates] = useState<string | null>(initialSettings?.footerCoordinates || null);
  const [footerCopyrightId, setFooterCopyrightId] = useState(initialSettings?.footerCopyright_id || "© 2026 Padi Sharpening Center. Hak Cipta Dilindungi.");
  const [footerCopyrightEn, setFooterCopyrightEn] = useState(initialSettings?.footerCopyright_en || "© 2026 Padi Sharpening Center. All Rights Reserved.");
  const [footerBrand, setFooterBrand] = useState<string | null>(initialSettings?.footerBrand !== undefined ? initialSettings.footerBrand : "Padi Tech Solutions");
  const [footerDescId, setFooterDescId] = useState(initialSettings?.footerDesc_id || "Pusat layanan asah pisau profesional, penjualan alat tajam, dan pelatihan di Surabaya.");
  const [footerDescEn, setFooterDescEn] = useState(initialSettings?.footerDesc_en || "Professional sharpening service center, knife sales, and training academy in Surabaya.");
  const [workingHoursId, setWorkingHoursId] = useState<string | null>(initialSettings?.workingHours_id || "Senin - Sabtu (Monday - Saturday)\n08:00 - 17:00 WIB");
  const [workingHoursEn, setWorkingHoursEn] = useState<string | null>(initialSettings?.workingHours_en || "Monday - Saturday\n08:00 - 17:00 WIB");
  const [mapsEmbedUrl, setMapsEmbedUrl] = useState(initialSettings?.mapsEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.382894567406!2d112.7964!3d-7.3193!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7fa68903c706d%3A0xb3de4568393c706d!2sJl.%20Tambak%20Medokan%20Ayu%20III%20B%2C%20Medokan%20Ayu%2C%20Kec.%20Rungkut%2C%20Surabaya%2C%20Jawa%20Timur%2060295!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid");

  // Services page dynamic headings states
  const [servicesTitleId, setServicesTitleId] = useState(initialSettings?.servicesTitle_id || "Layanan Profesional Kami");
  const [servicesTitleEn, setServicesTitleEn] = useState(initialSettings?.servicesTitle_en || "Our Professional Services");
  const [servicesSubtitleId, setServicesSubtitleId] = useState(initialSettings?.servicesSubtitle_id || "Kami menawarkan jasa asah presisi tinggi, persewaan bilah/alat tajam, dan pengadaan skala komersial.");
  const [servicesSubtitleEn, setServicesSubtitleEn] = useState(initialSettings?.servicesSubtitle_en || "We offer high-precision sharpening services, blade rental programs, and commercial-scale cutlery supply.");
  const [servicesSectionTitleId, setServicesSectionTitleId] = useState(initialSettings?.servicesSectionTitle_id || "Jasa Asah Profesional");
  const [servicesSectionTitleEn, setServicesSectionTitleEn] = useState(initialSettings?.servicesSectionTitle_en || "Professional Sharpening");
  const [servicesSectionDescId, setServicesSectionDescId] = useState(initialSettings?.servicesSectionDesc_id || "Layanan asah profesional untuk pisau dapur, pisau sembelih, pisau daging, gunting, dan bilah industri. Menggunakan metode presisi sudut terkontrol.");
  const [servicesSectionDescEn, setServicesSectionDescEn] = useState(initialSettings?.servicesSectionDesc_en || "Professional sharpening service for kitchen knives, butcher knives, meat cleavers, scissors, and industrial blades with angle-controlled methods.");

  const [mounted, setMounted] = useState(false);

  const loadSettings = async () => {
    try {
      const data = await getSiteSettings();
      if (data) {
        if (data.logoText) setLogoText(data.logoText);
        if (data.logoUrl) setLogoUrl(data.logoUrl);
        if (data.footerPhone) setFooterPhone(data.footerPhone);
        if (data.footerAddress) setFooterAddress(data.footerAddress);
        
        // Explicitly set null to hide if desired by user, otherwise use DB value
        setFooterEmail(data.footerEmail || null);
        setFooterCoordinates(data.footerCoordinates || null);

        if (data.footerCopyright_id) setFooterCopyrightId(data.footerCopyright_id);
        if (data.footerCopyright_en) setFooterCopyrightEn(data.footerCopyright_en);
        // Explicitly set null to hide or use DB value/fallback
        setFooterBrand(data.footerBrand !== undefined ? data.footerBrand : "Padi Tech Solutions");
        if (data.footerDesc_id) setFooterDescId(data.footerDesc_id);
        if (data.footerDesc_en) setFooterDescEn(data.footerDesc_en);
        if (data.workingHours_id) setWorkingHoursId(data.workingHours_id);
        if (data.workingHours_en) setWorkingHoursEn(data.workingHours_en);
        if (data.mapsEmbedUrl) setMapsEmbedUrl(data.mapsEmbedUrl);

        if (data.servicesTitle_id) setServicesTitleId(data.servicesTitle_id);
        if (data.servicesTitle_en) setServicesTitleEn(data.servicesTitle_en);
        if (data.servicesSubtitle_id) setServicesSubtitleId(data.servicesSubtitle_id);
        if (data.servicesSubtitle_en) setServicesSubtitleEn(data.servicesSubtitle_en);
        if (data.servicesSectionTitle_id) setServicesSectionTitleId(data.servicesSectionTitle_id);
        if (data.servicesSectionTitle_en) setServicesSectionTitleEn(data.servicesSectionTitle_en);
        if (data.servicesSectionDesc_id) setServicesSectionDescId(data.servicesSectionDesc_id);
        if (data.servicesSectionDesc_en) setServicesSectionDescEn(data.servicesSectionDesc_en);
      }
    } catch (err) {
      console.error("Failed to load branding settings in provider:", err);
    }
  };

  // Initialize theme & language from localStorage and device preferences
  useEffect(() => {
    // Filter out Three.js / Canvas deprecation warnings from third-party libraries
    const originalWarn = console.warn;
    console.warn = (...args) => {
      if (
        args[0] && 
        typeof args[0] === "string" && 
        (args[0].includes("THREE.Clock") || 
         args[0].includes("PCFSoftShadowMap") ||
         args[0].includes("deprecated"))
      ) {
        return;
      }
      originalWarn(...args);
    };

    // 1. Language Initialization
    const savedLang = localStorage.getItem("lang") as Language | null;
    if (savedLang === "id" || savedLang === "en") {
      setLanguageState(savedLang);
    } else {
      const systemLang = navigator.language.toLowerCase();
      const detectedLang: Language = systemLang.startsWith("id") ? "id" : "en";
      setLanguageState(detectedLang);
      localStorage.setItem("lang", detectedLang);
    }

    // 2. Theme Initialization (Resolve system preference automatically if not saved)
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    let initialTheme: Theme;
    if (savedTheme === "light" || savedTheme === "dark") {
      initialTheme = savedTheme;
    } else {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      initialTheme = isDark ? "dark" : "light";
    }
    setThemeState(initialTheme);
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(initialTheme);

    // 3. Track visitor session dynamically once per path per session (reduces DB function invocations)
    try {
      const trackKey = "tracked_" + window.location.pathname;
      if (!sessionStorage.getItem(trackKey)) {
        sessionStorage.setItem(trackKey, "1");
        trackVisitorAction(window.location.pathname).catch((err) => console.error("Visitor tracking failed:", err));
      }
    } catch {
      // Fallback if sessionStorage is disabled/blocked
    }

    // 4. Load branding configs dynamically only if initialSettings wasn't provided by SSR
    if (!initialSettings) {
      loadSettings();
    }

    setMounted(true);
  }, []);

  // Update document class based on theme state
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    // Only accept light or dark
    const resolvedTheme = newTheme === "dark" ? "dark" : "light";
    setThemeState(resolvedTheme);
    localStorage.setItem("theme", resolvedTheme);
  };

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    localStorage.setItem("lang", newLang);
  };

  // Translation helper function
  const t = (key: keyof typeof translations.id): string => {
    const dict = translations[language] || translations.id;
    return dict[key] || translations.id[key] || String(key);
  };

  return (
    <AppContext.Provider value={{ 
      theme, 
      setTheme, 
      language, 
      setLanguage, 
      t, 
      logoText, 
      logoUrl,
      footerPhone,
      footerAddress,
      footerEmail,
      footerCoordinates,
      footerCopyright_id: footerCopyrightId,
      footerCopyright_en: footerCopyrightEn,
      footerBrand,
      footerDesc_id: footerDescId,
      footerDesc_en: footerDescEn,
      workingHours_id: workingHoursId,
      workingHours_en: workingHoursEn,
      mapsEmbedUrl,
      servicesTitle_id: servicesTitleId,
      servicesTitle_en: servicesTitleEn,
      servicesSubtitle_id: servicesSubtitleId,
      servicesSubtitle_en: servicesSubtitleEn,
      servicesSectionTitle_id: servicesSectionTitleId,
      servicesSectionTitle_en: servicesSectionTitleEn,
      servicesSectionDesc_id: servicesSectionDescId,
      servicesSectionDesc_en: servicesSectionDescEn,
      refreshSettings: loadSettings
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
