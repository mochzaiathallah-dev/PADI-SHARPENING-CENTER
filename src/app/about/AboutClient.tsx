"use client";

import React from "react";
import { useApp } from "../../context/AppContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { ShieldCheck, Flame, Compass } from "lucide-react";

type SiteSettingsType = {
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

type AboutClientProps = {
  settings: SiteSettingsType;
};

export default function AboutClient({ settings }: AboutClientProps) {
  const { t, language } = useApp();

  const aboutTitle = language === "id" 
    ? (settings.aboutTitle_id || "Siapa Kami?") 
    : (settings.aboutTitle_en || "Who We Are?");
  const aboutDesc1 = language === "id" ? settings.aboutDesc1_id : settings.aboutDesc1_en;
  const aboutDesc2 = language === "id" ? settings.aboutDesc2_id : settings.aboutDesc2_en;

  const feat1Title = language === "id" ? settings.feature1Title_id : settings.feature1Title_en;
  const feat1Desc = language === "id" ? settings.feature1Desc_id : settings.feature1Desc_en;

  const feat2Title = language === "id" ? settings.feature2Title_id : settings.feature2Title_en;
  const feat2Desc = language === "id" ? settings.feature2Desc_id : settings.feature2Desc_en;

  const feat3Title = language === "id" ? settings.feature3Title_id : settings.feature3Title_en;
  const feat3Desc = language === "id" ? settings.feature3Desc_id : settings.feature3Desc_en;

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <Navbar />

      <main className="grow bg-background py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
              {t("navAbout")}
            </h1>
            <div className="w-16 h-1 bg-primary mx-auto rounded-full mt-2" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
            <div className="lg:col-span-5 relative self-start">
              <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-primary" />
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground pt-4">
                {aboutTitle}
              </h2>
            </div>

            <div className="lg:col-span-7 flex flex-col space-y-6 text-base sm:text-lg text-muted-foreground leading-relaxed">
              <p>{aboutDesc1}</p>
              <p>{aboutDesc2}</p>
            </div>
          </div>

          {/* Quick Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col space-y-3 p-6 rounded-2xl border border-border bg-card shadow-sm hover:border-primary/45 transition-all">
              <div className="p-3 bg-primary/10 text-primary self-start rounded-lg">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">{feat1Title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feat1Desc}</p>
            </div>

            <div className="flex flex-col space-y-3 p-6 rounded-2xl border border-border bg-card shadow-sm hover:border-primary/45 transition-all">
              <div className="p-3 bg-primary/10 text-primary self-start rounded-lg">
                <Flame className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">{feat2Title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feat2Desc}</p>
            </div>

            <div className="flex flex-col space-y-3 p-6 rounded-2xl border border-border bg-card shadow-sm hover:border-primary/45 transition-all">
              <div className="p-3 bg-primary/10 text-primary self-start rounded-lg">
                <Compass className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">{feat3Title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feat3Desc}</p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
