"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useApp } from "../context/AppContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ShieldCheck, Flame, Compass, ArrowRight } from "lucide-react";

// Defer 3D Canvas dynamically
const Hero3D = dynamic(() => import("../components/Hero3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-87.5 sm:min-h-125 flex items-center justify-center bg-card/20 rounded-3xl">
      <div className="h-10 w-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
    </div>
  ),
});

type SiteSettingsType = {
  logoText: string;
  logoUrl?: string | null;
  heroAnimationUrl?: string | null;

  heroTitle_id: string;
  heroTitle_en: string;
  heroSubtitle_id: string;
  heroSubtitle_en: string;

  stat1Value?: string | null;
  stat1Label_id?: string | null;
  stat1Label_en?: string | null;
  stat2Value?: string | null;
  stat2Label_id?: string | null;
  stat2Label_en?: string | null;

  mapsEmbedUrl?: string | null;

  aboutTitle_id?: string | null;
  aboutTitle_en?: string | null;
  aboutDesc1_id: string;
  aboutDesc1_en: string;
  aboutDesc2_id: string;
  aboutDesc2_en: string;

  feature1Title_id?: string | null;
  feature1Title_en?: string | null;
  feature1Desc_id?: string | null;
  feature1Desc_en?: string | null;

  feature2Title_id?: string | null;
  feature2Title_en?: string | null;
  feature2Desc_id?: string | null;
  feature2Desc_en?: string | null;

  feature3Title_id?: string | null;
  feature3Title_en?: string | null;
  feature3Desc_id?: string | null;
  feature3Desc_en?: string | null;
};

type HomeClientProps = {
  settings: SiteSettingsType;
};

function HeroMediaContainer({ settings }: { settings: SiteSettingsType }) {
  const [shouldLoad3D, setShouldLoad3D] = useState(false);

  const isVideoBase64 = (url: string | null) => {
    if (!url) return false;
    if (url.startsWith("data:video/") || url.includes("video/mp4")) return true;
    const lower = url.toLowerCase();
    return lower.endsWith(".mp4") || lower.endsWith(".webm") || lower.endsWith(".mov") || lower.endsWith(".gif");
  };

  return (
    <div 
      className="lg:col-span-6 w-full h-90 sm:h-115 lg:h-125 flex items-center justify-center bg-card/45 border border-border/60 rounded-3xl overflow-hidden shadow-2xl relative shrink-0"
    >
      {/* Abstract corner decors */}
      <div className="absolute top-4 left-4 flex space-x-1.5 z-10">
        <div className="h-2.5 w-2.5 rounded-full bg-primary/40" />
        <div className="h-2.5 w-2.5 rounded-full bg-border" />
        <div className="h-2.5 w-2.5 rounded-full bg-border" />
      </div>

      {shouldLoad3D && (
        <button
          onClick={() => setShouldLoad3D(false)}
          className="absolute top-4 right-4 z-20 px-3 py-1 text-xs font-semibold rounded-full bg-background/90 text-foreground border border-border/80 shadow hover:bg-accent transition-colors"
          aria-label="Tutup Mode 3D"
        >
          ✕ Tutup 3D
        </button>
      )}
      
      {settings.heroAnimationUrl && isVideoBase64(settings.heroAnimationUrl) ? (
        <video
          src={settings.heroAnimationUrl}
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        />
      ) : shouldLoad3D ? (
        <Hero3D imageUrl={settings.heroAnimationUrl} />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center relative group">
          <div className="absolute inset-0 bg-linear-to-tr from-primary/10 via-transparent to-primary/5 pointer-events-none" />
          <img
            src="/uploads/1785501651772_Gemini_Generated_Image_murzqsmurzqsmurz-clean-Photoroom.png"
            alt="Padi Sharpening Premium Blade Preview"
            width={480}
            height={360}
            fetchPriority="high"
            decoding="async"
            className="w-64 sm:w-80 md:w-96 max-w-full h-auto object-contain drop-shadow-2xl transform group-hover:scale-105 transition-transform duration-500 pointer-events-none select-none"
          />
          <button
            type="button"
            onClick={() => setShouldLoad3D(true)}
            className="mt-4 inline-flex items-center space-x-2 rounded-full bg-background/90 hover:bg-background border border-primary/40 hover:border-primary px-4 py-1.5 text-xs font-bold text-foreground shadow-md transition-all z-10 cursor-pointer group-hover:shadow-primary/20"
            aria-label="Aktifkan Mode 3D Interaktif untuk memutar bilah"
          >
            <span>✨ Mode 3D Interaktif</span>
            <span className="text-[10px] bg-primary/15 text-primary px-1.5 py-0.5 rounded font-mono">PUTAR</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default function HomeClient({ settings }: HomeClientProps) {
  const { t, language, footerPhone } = useApp();

  const cleanPhone = footerPhone.replace(/\D/g, "");
  const waPhone = cleanPhone.startsWith("0") ? "62" + cleanPhone.slice(1) : cleanPhone;

  const heroTitle = language === "id" ? settings.heroTitle_id : settings.heroTitle_en;
  const heroSubtitle = language === "id" ? settings.heroSubtitle_id : settings.heroSubtitle_en;
  const aboutTitle = language === "id" 
    ? (settings.aboutTitle_id || "Siapa Kami?") 
    : (settings.aboutTitle_en || "Who We Are?");
  const aboutDesc1 = language === "id" ? settings.aboutDesc1_id : settings.aboutDesc1_en;
  const aboutDesc2 = language === "id" ? settings.aboutDesc2_id : settings.aboutDesc2_en;

  const stat1Value = settings.stat1Value || "1,200+";
  const stat1Label = language === "id" ? settings.stat1Label_id : settings.stat1Label_en;
  
  const stat2Value = settings.stat2Value || "99.9%";
  const stat2Label = language === "id" ? settings.stat2Label_id : settings.stat2Label_en;

  const feat1Title = language === "id" ? settings.feature1Title_id : settings.feature1Title_en;
  const feat1Desc = language === "id" ? settings.feature1Desc_id : settings.feature1Desc_en;

  const feat2Title = language === "id" ? settings.feature2Title_id : settings.feature2Desc_en;
  const feat2Desc = language === "id" ? settings.feature2Desc_id : settings.feature2Desc_en;

  const feat3Title = language === "id" ? settings.feature3Title_id : settings.feature3Title_en;
  const feat3Desc = language === "id" ? settings.feature3Desc_id : settings.feature3Desc_en;

  const extractMapsUrl = (url: string | null | undefined): string => {
    if (!url) return "";
    const trimmed = url.trim();
    if (trimmed.startsWith("<iframe") || trimmed.includes("src=")) {
      const match = trimmed.match(/src=["']([^"']+)["']/i);
      if (match && match[1]) {
        return match[1];
      }
    }
    return trimmed;
  };

  const mapsUrl = extractMapsUrl(settings.mapsEmbedUrl) || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.382894567406!2d112.7964!3d-7.3193!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7fa68903c706d%3A0xb3de4568393c706d!2sJl.%20Tambak%20Medokan%20Ayu%20III%20B%2C%20Medokan%20Ayu%2C%20Kec.%20Rungkut%2C%20Surabaya%2C%20Jawa%20Timur%2060295!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid";

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <Navbar />

      <main className="grow">
        {/* HERO SECTION */}
        <section className="relative w-full overflow-hidden bg-background pt-8 pb-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Hero Left Content */}
              <div className="lg:col-span-6 flex flex-col space-y-6 sm:space-y-8">
                
                {/* Promo Badge */}
                <div className="inline-flex items-center space-x-2 self-start rounded-full border border-primary/25 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                  <Flame className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                  <span>Surabaya Local Business #1</span>
                </div>

                <div className="space-y-4">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1] sm:leading-[1.05]">
                    {heroTitle.split(" ").map((word, index) => {
                      const cleanWord = word.toLowerCase().replace(/[^a-z]/g, "");
                      if (cleanWord === "ketajaman" || cleanWord === "sharpness") {
                        return <span key={index} className="text-primary">{word} </span>;
                      }
                      return word + " ";
                    })}
                  </h1>
                  <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
                    {heroSubtitle}
                  </p>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href={`https://wa.me/${waPhone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-md hover:bg-primary/95 transition-all group gap-2"
                    aria-label="Book Sharpening Service on WhatsApp"
                  >
                    <span>{t("heroCtaMain")}</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </a>
                  <Link
                    href="/catalog"
                    className="inline-flex items-center justify-center rounded-md border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground hover:bg-accent transition-all"
                  >
                    {t("heroCtaSec")}
                  </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-8 pt-4 border-t border-border/80 max-w-md">
                  <div>
                    <p className="text-2xl sm:text-3xl font-extrabold text-foreground">{stat1Value}</p>
                    <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">{stat1Label}</p>
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-extrabold text-foreground">{stat2Value}</p>
                    <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">{stat2Label}</p>
                  </div>
                </div>

              </div>

              {/* Hero Right Media Anim / 3D Canvas (Zero CLS container with fixed min-height) */}
              <HeroMediaContainer settings={settings} />

            </div>
          </div>
        </section>

        {/* BRIEF ABOUT SECTION */}
        <section className="py-16 sm:py-20 border-t border-border/80 bg-card/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-5 relative self-start">
                <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-primary" />
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground pt-4">
                  {aboutTitle}
                </h2>
                <div className="mt-4 h-1 w-20 bg-primary" />
              </div>

              <div className="lg:col-span-7 flex flex-col space-y-6 text-base sm:text-lg text-muted-foreground leading-relaxed">
                <p>{aboutDesc1}</p>
                <p>{aboutDesc2}</p>
              </div>

            </div>

            {/* Quick Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-16">
              <div className="flex flex-col space-y-3 p-6 rounded-2xl border border-border bg-card shadow-sm hover:border-primary/45 transition-all">
                <div className="p-3 bg-primary/10 text-primary self-start rounded-lg">
                  <ShieldCheck className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-foreground">{feat1Title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feat1Desc}</p>
              </div>

              <div className="flex flex-col space-y-3 p-6 rounded-2xl border border-border bg-card shadow-sm hover:border-primary/45 transition-all">
                <div className="p-3 bg-primary/10 text-primary self-start rounded-lg">
                  <Flame className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-foreground">{feat2Title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feat2Desc}</p>
              </div>

              <div className="flex flex-col space-y-3 p-6 rounded-2xl border border-border bg-card shadow-sm hover:border-primary/45 transition-all">
                <div className="p-3 bg-primary/10 text-primary self-start rounded-lg">
                  <Compass className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-foreground">{feat3Title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feat3Desc}</p>
              </div>
            </div>
          </div>
        </section>

        {/* GOOGLE MAPS EMBED SECTION (Zero CLS container) */}
        <section className="py-12 bg-background border-t border-border/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                {language === "id" ? "Lokasi Kami" : "Our Location"}
              </h2>
            </div>
            <div 
              className="w-full h-96 min-h-96 rounded-2xl overflow-hidden border border-border shadow-md shrink-0"
              style={{ height: "384px", minHeight: "384px" }}
            >
              <iframe
                src={mapsUrl}
                width="100%"
                height="384"
                title="Padi Sharpening Center Location Map"
                style={{ border: 0, height: "384px", minHeight: "384px" }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
