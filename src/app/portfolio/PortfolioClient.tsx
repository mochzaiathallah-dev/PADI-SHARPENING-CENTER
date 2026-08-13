"use client";

import React from "react";
import { useApp } from "../../context/AppContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Eye, ShieldCheck, Film, ArrowRight } from "lucide-react";
import Link from "next/link";

type PortfolioItem = {
  id: string;
  title_id: string;
  title_en: string;
  slug: string;
  description_id: string;
  description_en: string;
  imageUrl: string; // Base64 compressed image/video URL
  category_id: string;
  category_en: string;
  metric_id: string | null;
  metric_en: string | null;
};

type PortfolioClientProps = {
  initialItems: PortfolioItem[];
};

const FALLBACK_ITEMS = [
  {
    id: "port-1",
    title_id: "Restorasi Golok Sembelih Damascus",
    title_en: "Damascus Slaughter Cleaver Restoration",
    slug: "restorasi-golok-sembelih-damascus-kuno",
    category_id: "Restorasi",
    category_en: "Restoration",
    description_id: "Perbaikan mata pisau gompal (chipping) dan penajaman sudut presisi 15 derajat hingga hair shaving sharp.",
    description_en: "Repairing chipped edges and sharpening to a precise 15-degree angle, achieving hair-shaving sharpness.",
    metric_id: "Grit 8000 Finish",
    metric_en: "Grit 8000 Finish",
    imageUrl: "",
  },
  {
    id: "port-2",
    title_id: "Custom Laser Grafir Nama pada Chef Knife",
    title_en: "Custom Name Laser Engraving on Chef Knife",
    slug: "pengasahan-presisi-set-pisau-dapur-restoran-bintang-5",
    category_id: "Grafir",
    category_en: "Engraving",
    description_id: "Grafir nama presisi tinggi menggunakan fiber laser pada bilah baja anti karat Jerman milik restoran bintang lima.",
    description_en: "High-precision name engraving using a fiber laser on German stainless steel blade for a 5-star restaurant.",
    metric_id: "Permanent Laser",
    metric_en: "Permanent Laser",
    imageUrl: "",
  },
  {
    id: "port-3",
    title_id: "Penyedia Pengadaan Pisau RPH Krian",
    title_en: "Knife Procurement for Krian Abattoir",
    slug: "pelatihan-pengasahan-bilah-untuk-komunitas-jagal-halal",
    category_id: "Pengadaan",
    category_en: "Procurement",
    description_id: "Pengadaan 50 unit pisau sembelih profesional bersertifikasi standar halal dan asah presisi sudut terkontrol.",
    description_en: "Procurement of 50 units of halal-standard professional slaughter knives with angle-controlled sharpness.",
    metric_id: "50+ Bilah",
    metric_en: "50+ Blades Sourced",
    imageUrl: "",
  },
];

export default function PortfolioClient({ initialItems }: PortfolioClientProps) {
  const { t, language } = useApp();

  const displayItems = initialItems.length > 0 ? initialItems : FALLBACK_ITEMS;

  const isVideoBase64 = (base64Str: string | null) => {
    if (!base64Str) return false;
    return base64Str.startsWith("data:video/") || base64Str.includes("video/mp4");
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <Navbar />

      <main className="grow bg-background py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
              {t("navPortfolio")}
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              {language === "id" 
                ? "Galeri karya restorasi penajaman bilah premium dan proyek kustomisasi pelanggan kami."
                : "Gallery of our premium blade sharpening restorations and custom customer projects."}
            </p>
            <div className="w-16 h-1 bg-primary mx-auto rounded-full mt-2" />
          </div>

          {/* Portfolio Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayItems.map((item) => {
              const title = language === "id" ? item.title_id : item.title_en;
              const desc = language === "id" ? item.description_id : item.description_en;
              const category = language === "id" ? item.category_id : item.category_en;
              const metric = language === "id" ? item.metric_id : item.metric_en;

              return (
                <div
                  key={item.id}
                  className="flex flex-col h-full justify-between rounded-2xl border border-border bg-card p-6 shadow-sm hover:border-primary/45 transition-all relative overflow-hidden group"
                >
                  <div className="space-y-4">
                    {/* Visual Media Showcase */}
                    <div className="w-full h-48 bg-muted/30 rounded-xl border border-border/50 flex items-center justify-center relative overflow-hidden">
                      {item.imageUrl ? (
                        isVideoBase64(item.imageUrl) ? (
                          <div className="w-full h-full relative">
                            <video
                              src={item.imageUrl}
                              className="w-full h-full object-cover"
                              autoPlay
                              loop
                              muted
                              playsInline
                            />
                            <div className="absolute top-2 right-2 bg-black/60 text-white rounded p-1">
                              <Film className="h-4 w-4" />
                            </div>
                          </div>
                        ) : (
                          <img
                            src={item.imageUrl}
                            alt={title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        )
                      ) : (
                        <>
                          <div className="absolute inset-0 bg-radial-gradient from-primary/5 to-transparent transition-opacity group-hover:opacity-80" />
                          <Eye className="h-8 w-8 text-muted-foreground/60 group-hover:scale-110 transition-transform" />
                        </>
                      )}
                    </div>

                    <div className="space-y-3">
                      <span className="text-[10px] uppercase font-extrabold tracking-wider bg-primary/10 text-primary px-2.5 py-1 rounded-full inline-block">
                        {category}
                      </span>
                      <h2 className="text-lg font-bold text-foreground line-clamp-2">
                        {title}
                      </h2>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3">
                        {desc}
                      </p>
                      <div className="pt-1">
                        <Link
                          href={`/portfolio/${item.slug}`}
                          className="inline-flex items-center text-xs font-bold text-primary hover:text-primary/80 transition-colors gap-1 group/btn"
                        >
                          <span>{language === "id" ? "Lihat Selengkapnya" : "Read More"}</span>
                          <ArrowRight className="h-3 w-3 group-hover/btn:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border/80 flex items-center justify-between text-xs font-semibold text-muted-foreground">
                    <span className="text-primary">{metric || "-"}</span>
                    <div className="flex items-center space-x-1">
                      <ShieldCheck className="h-4 w-4 text-green-500" />
                      <span>Verified Quality</span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
