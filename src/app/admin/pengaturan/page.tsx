"use client";

import React, { useState, useEffect } from "react";
import { getSiteSettings, updateSiteSettings, translateTextAction } from "../actions";
import { Save, Sparkles, Loader2, Settings, AlertCircle, Image, Video, Compass, MapPin, Phone, Mail, FileText, Info } from "lucide-react";
import { useApp } from "../../../context/AppContext";
import { compressMediaFile } from "../../../lib/compress";
import { useRouter } from "next/navigation";

export default function AdminSettings() {
  const { refreshSettings } = useApp();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTranslating, setIsTranslating] = useState<Record<string, boolean>>({});

  // Branding & Hero Assets
  const [logoText, setLogoText] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [heroAnimationUrl, setHeroAnimationUrl] = useState<string | null>(null);
  const [isCompressingLogo, setIsCompressingLogo] = useState(false);
  const [isCompressingAnim, setIsCompressingAnim] = useState(false);

  // Hero Section
  const [heroTitleId, setHeroTitleId] = useState("");
  const [heroTitleEn, setHeroTitleEn] = useState("");
  const [heroSubtitleId, setHeroSubtitleId] = useState("");
  const [heroSubtitleEn, setHeroSubtitleEn] = useState("");

  // Stats
  const [stat1Value, setStat1Value] = useState("");
  const [stat1LabelId, setStat1LabelId] = useState("");
  const [stat1LabelEn, setStat1LabelEn] = useState("");
  const [stat2Value, setStat2Value] = useState("");
  const [stat2LabelId, setStat2LabelId] = useState("");
  const [stat2LabelEn, setStat2LabelEn] = useState("");

  // Maps
  const [mapsEmbedUrl, setMapsEmbedUrl] = useState("");

  // About Section
  const [aboutTitleId, setAboutTitleId] = useState("");
  const [aboutTitleEn, setAboutTitleEn] = useState("");
  const [aboutDesc1Id, setAboutDesc1Id] = useState("");
  const [aboutDesc1En, setAboutDesc1En] = useState("");
  const [aboutDesc2Id, setAboutDesc2Id] = useState("");
  const [aboutDesc2En, setAboutDesc2En] = useState("");

  // 3 Feature Cards
  const [feat1TitleId, setFeat1TitleId] = useState("");
  const [feat1TitleEn, setFeat1TitleEn] = useState("");
  const [feat1DescId, setFeat1DescId] = useState("");
  const [feat1DescEn, setFeat1DescEn] = useState("");

  const [feat2TitleId, setFeat2TitleId] = useState("");
  const [feat2TitleEn, setFeat2TitleEn] = useState("");
  const [feat2DescId, setFeat2DescId] = useState("");
  const [feat2DescEn, setFeat2DescEn] = useState("");

  const [feat3TitleId, setFeat3TitleId] = useState("");
  const [feat3TitleEn, setFeat3TitleEn] = useState("");
  const [feat3DescId, setFeat3DescId] = useState("");
  const [feat3DescEn, setFeat3DescEn] = useState("");

  // Footer & Contacts
  const [footerDescId, setFooterDescId] = useState("");
  const [footerDescEn, setFooterDescEn] = useState("");
  const [footerAddress, setFooterAddress] = useState("");
  const [footerPhone, setFooterPhone] = useState("");
  const [footerEmail, setFooterEmail] = useState("");
  const [footerCoordinates, setFooterCoordinates] = useState("");
  const [footerCopyrightId, setFooterCopyrightId] = useState("");
  const [footerCopyrightEn, setFooterCopyrightEn] = useState("");
  const [footerBrand, setFooterBrand] = useState("");
  const [workingHoursId, setWorkingHoursId] = useState("");
  const [workingHoursEn, setWorkingHoursEn] = useState("");
  
  // Services page dynamic headings states
  const [servicesTitleId, setServicesTitleId] = useState("");
  const [servicesTitleEn, setServicesTitleEn] = useState("");
  const [servicesSubtitleId, setServicesSubtitleId] = useState("");
  const [servicesSubtitleEn, setServicesSubtitleEn] = useState("");
  const [servicesSectionTitleId, setServicesSectionTitleId] = useState("");
  const [servicesSectionTitleEn, setServicesSectionTitleEn] = useState("");
  const [servicesSectionDescId, setServicesSectionDescId] = useState("");
  const [servicesSectionDescEn, setServicesSectionDescEn] = useState("");

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const data = await getSiteSettings();
      setLogoText(data.logoText);
      setLogoUrl(data.logoUrl || null);
      setHeroAnimationUrl(data.heroAnimationUrl || null);

      setHeroTitleId(data.heroTitle_id || "");
      setHeroTitleEn(data.heroTitle_en || "");
      setHeroSubtitleId(data.heroSubtitle_id || "");
      setHeroSubtitleEn(data.heroSubtitle_en || "");

      setStat1Value(data.stat1Value || "");
      setStat1LabelId(data.stat1Label_id || "");
      setStat1LabelEn(data.stat1Label_en || "");
      setStat2Value(data.stat2Value || "");
      setStat2LabelId(data.stat2Label_id || "");
      setStat2LabelEn(data.stat2Label_en || "");

      setMapsEmbedUrl(data.mapsEmbedUrl || "");

      setAboutTitleId(data.aboutTitle_id || "");
      setAboutTitleEn(data.aboutTitle_en || "");
      setAboutDesc1Id(data.aboutDesc1_id || "");
      setAboutDesc1En(data.aboutDesc1_en || "");
      setAboutDesc2Id(data.aboutDesc2_id || "");
      setAboutDesc2En(data.aboutDesc2_en || "");

      setFeat1TitleId(data.feature1Title_id || "");
      setFeat1TitleEn(data.feature1Title_en || "");
      setFeat1DescId(data.feature1Desc_id || "");
      setFeat1DescEn(data.feature1Desc_en || "");

      setFeat2TitleId(data.feature2Title_id || "");
      setFeat2TitleEn(data.feature2Title_en || "");
      setFeat2DescId(data.feature2Desc_id || "");
      setFeat2DescEn(data.feature2Desc_en || "");

      setFeat3TitleId(data.feature3Title_id || "");
      setFeat3TitleEn(data.feature3Title_en || "");
      setFeat3DescId(data.feature3Desc_id || "");
      setFeat3DescEn(data.feature3Desc_en || "");

      setFooterDescId(data.footerDesc_id || "");
      setFooterDescEn(data.footerDesc_en || "");
      setFooterAddress(data.footerAddress || "");
      setFooterPhone(data.footerPhone || "");
      setFooterEmail(data.footerEmail || "");
      setFooterCoordinates(data.footerCoordinates || "");
      setFooterCopyrightId(data.footerCopyright_id || "");
      setFooterCopyrightEn(data.footerCopyright_en || "");
      setFooterBrand(data.footerBrand || "");
      setWorkingHoursId(data.workingHours_id || "");
      setWorkingHoursEn(data.workingHours_en || "");

      setServicesTitleId(data.servicesTitle_id || "");
      setServicesTitleEn(data.servicesTitle_en || "");
      setServicesSubtitleId(data.servicesSubtitle_id || "");
      setServicesSubtitleEn(data.servicesSubtitle_en || "");
      setServicesSectionTitleId(data.servicesSectionTitle_id || "");
      setServicesSectionTitleEn(data.servicesSectionTitle_en || "");
      setServicesSectionDescId(data.servicesSectionDesc_id || "");
      setServicesSectionDescEn(data.servicesSectionDesc_en || "");
    } catch (error) {
      console.error("Failed to load settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleTranslate = async (sourceText: string, targetSetter: (val: string) => void, fieldName: string) => {
    if (!sourceText) return;
    setIsTranslating((prev) => ({ ...prev, [fieldName]: true }));
    try {
      const result = await translateTextAction(sourceText);
      if (result) targetSetter(result);
    } catch (error) {
      console.error("Translate error:", error);
    } finally {
      setIsTranslating((prev) => ({ ...prev, [fieldName]: false }));
    }
  };

  // ─── Upload Helpers (Base64 direct, auto-compression) ────────────────────────
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsCompressingLogo(true);
    try {
      const base64 = await compressMediaFile(file);
      setLogoUrl(base64);
    } catch (error) {
      console.error("Logo upload error:", error);
      alert("Gagal memproses gambar logo.");
    } finally {
      setIsCompressingLogo(false);
    }
  };

  const handleAnimationUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsCompressingAnim(true);
    try {
      const base64 = await compressMediaFile(file);
      setHeroAnimationUrl(base64);
    } catch (error) {
      console.error("Animation upload error:", error);
      alert("Gagal memproses media animasi.");
    } finally {
      setIsCompressingAnim(false);
    }
  };

  const isVideoUrl = (url: string | null): boolean => {
    if (!url) return false;
    // base64 video
    if (url.startsWith("data:video/") || url.includes("video/mp4")) return true;
    // file path video extension
    const lower = url.toLowerCase();
    return lower.endsWith(".mp4") || lower.endsWith(".webm") || lower.endsWith(".mov") || lower.endsWith(".gif");
  };

  // Keep legacy name as alias for any JSX that references the old name
  const isVideoBase64 = isVideoUrl;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSiteSettings({
        logoText,
        logoUrl,
        heroAnimationUrl,

        heroTitle_id: heroTitleId,
        heroTitle_en: heroTitleEn,
        heroSubtitle_id: heroSubtitleId,
        heroSubtitle_en: heroSubtitleEn,

        stat1Value,
        stat1Label_id: stat1LabelId,
        stat1Label_en: stat1LabelEn,
        stat2Value,
        stat2Label_id: stat2LabelId,
        stat2Label_en: stat2LabelEn,

        mapsEmbedUrl,

        aboutTitle_id: aboutTitleId,
        aboutTitle_en: aboutTitleEn,
        aboutDesc1_id: aboutDesc1Id,
        aboutDesc1_en: aboutDesc1En,
        aboutDesc2_id: aboutDesc2Id,
        aboutDesc2_en: aboutDesc2En,

        feature1Title_id: feat1TitleId,
        feature1Title_en: feat1TitleEn,
        feature1Desc_id: feat1DescId,
        feature1Desc_en: feat1DescEn,

        feature2Title_id: feat2TitleId,
        feature2Title_en: feat2TitleEn,
        feature2Desc_id: feat2DescId,
        feature2Desc_en: feat2DescEn,

        feature3Title_id: feat3TitleId,
        feature3Title_en: feat3TitleEn,
        feature3Desc_id: feat3DescId,
        feature3Desc_en: feat3DescEn,

        footerDesc_id: footerDescId,
        footerDesc_en: footerDescEn,
        footerAddress,
        footerPhone,
        footerEmail: footerEmail || null,
        footerCoordinates: footerCoordinates || null,
        footerCopyright_id: footerCopyrightId,
        footerCopyright_en: footerCopyrightEn,
        footerBrand: footerBrand || null,
        workingHours_id: workingHoursId || null,
        workingHours_en: workingHoursEn || null,
        servicesTitle_id: servicesTitleId,
        servicesTitle_en: servicesTitleEn,
        servicesSubtitle_id: servicesSubtitleId,
        servicesSubtitle_en: servicesSubtitleEn,
        servicesSectionTitle_id: servicesSectionTitleId,
        servicesSectionTitle_en: servicesSectionTitleEn,
        servicesSectionDesc_id: servicesSectionDescId,
        servicesSectionDesc_en: servicesSectionDescEn,
      });
      await refreshSettings();
      router.refresh();
      alert("Semua pengaturan website berhasil disimpan!");
    } catch (error) {
      console.error("Failed to save settings:", error);
      alert("Gagal menyimpan pengaturan.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl pb-16">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Pengaturan Website</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Kelola visual logo, media hero, deskripsi, peta alamat, keunggulan fitur, dan footer secara dinamis.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card 1: BRANDING & ASSETS */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2 pb-2 border-b border-border/80">
            <Settings className="h-5 w-5 text-primary" />
            <span>1. Visual Branding & Media Hero</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Logo Text & Image */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground uppercase tracking-wide">Logo Teks</label>
                <input
                  type="text"
                  required
                  value={logoText}
                  onChange={(e) => setLogoText(e.target.value)}
                  placeholder="PADI SHARPENING"
                  className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground uppercase tracking-wide block">Logo Gambar (Disamping Teks)</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-muted/40 rounded-xl border border-border flex items-center justify-center overflow-hidden shrink-0">
                    {isCompressingLogo ? (
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    ) : logoUrl ? (
                      <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
                    ) : (
                      <Image className="h-6 w-6 text-muted-foreground/60" />
                    )}
                  </div>
                  <label className="px-3 py-1.5 border border-border bg-card hover:bg-accent text-xs font-bold text-foreground rounded-md cursor-pointer transition-colors">
                    Upload Logo
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                  {logoUrl && (
                    <button
                      type="button"
                      onClick={() => setLogoUrl(null)}
                      className="text-xs font-semibold text-rose-500 hover:underline"
                    >
                      Hapus
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Hero Animation Asset */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground uppercase tracking-wide block">Hero Media Animasi (Ganti Canvas 3D)</label>
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-4 bg-muted/10 relative">
                {isCompressingAnim ? (
                  <div className="flex flex-col items-center py-4 space-y-1">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <span className="text-[10px] text-muted-foreground">Compressing media...</span>
                  </div>
                ) : heroAnimationUrl ? (
                  <div className="w-full text-center space-y-2">
                    <div className="w-full h-24 bg-black/10 rounded-lg overflow-hidden border border-border flex items-center justify-center">
                      {isVideoBase64(heroAnimationUrl) ? (
                        <video src={heroAnimationUrl} className="w-full h-full object-contain" controls muted />
                      ) : (
                        <img src={heroAnimationUrl} alt="Hero Anim" className="w-full h-full object-contain" />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setHeroAnimationUrl(null)}
                      className="text-xs font-semibold text-rose-500 hover:underline"
                    >
                      Hapus Animasi (Gunakan 3D Canvas Default)
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center py-4 cursor-pointer w-full text-center">
                    <Video className="h-8 w-8 text-muted-foreground mb-1" />
                    <span className="text-[11px] font-bold text-primary hover:underline">Upload Gambar/GIF/Video</span>
                    <span className="text-[9px] text-muted-foreground mt-0.5">Gambar akan otomatis dirender dalam model 3D kustom</span>
                    <input type="file" accept="image/*,video/*" onChange={handleAnimationUpload} className="hidden" />
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: HERO TEXT & STATS */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2 pb-2 border-b border-border/80">
            <Sparkles className="h-5 w-5 text-primary" />
            <span>2. Teks Hero & Statistik (Landing Page)</span>
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground uppercase tracking-wide">Judul Hero (Indonesia)</label>
                <input
                  type="text"
                  required
                  value={heroTitleId}
                  onChange={(e) => setHeroTitleId(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wide">Judul Hero (Inggris)</label>
                  <button
                    type="button"
                    onClick={() => handleTranslate(heroTitleId, setHeroTitleEn, "title")}
                    disabled={isTranslating["title"] || !heroTitleId}
                    className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="h-3 w-3" /> Auto-Translate
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={heroTitleEn}
                  onChange={(e) => setHeroTitleEn(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground uppercase tracking-wide">Sub-Judul Hero (Indonesia)</label>
                <textarea
                  required
                  value={heroSubtitleId}
                  onChange={(e) => setHeroSubtitleId(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wide">Sub-Judul Hero (Inggris)</label>
                  <button
                    type="button"
                    onClick={() => handleTranslate(heroSubtitleId, setHeroSubtitleEn, "subtitle")}
                    disabled={isTranslating["subtitle"] || !heroSubtitleId}
                    className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="h-3 w-3" /> Auto-Translate
                  </button>
                </div>
                <textarea
                  required
                  value={heroSubtitleEn}
                  onChange={(e) => setHeroSubtitleEn(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-border/60">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Statistik Pencapaian</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Stat 1 */}
                <div className="space-y-3 p-4 rounded-xl bg-muted/20 border border-border/80">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Statistik 1 Angka/Nilai</label>
                    <input
                      type="text"
                      required
                      value={stat1Value}
                      onChange={(e) => setStat1Value(e.target.value)}
                      placeholder="Contoh: 1,200+"
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-border bg-card text-foreground focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-muted-foreground uppercase">Label (ID)</label>
                      <input
                        type="text"
                        required
                        value={stat1LabelId}
                        onChange={(e) => setStat1LabelId(e.target.value)}
                        placeholder="Pisau Dipulihkan"
                        className="w-full px-2.5 py-1.5 text-xs rounded border border-border bg-card text-foreground focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[9px] font-bold text-muted-foreground uppercase">Label (EN)</label>
                        <button
                          type="button"
                          onClick={() => handleTranslate(stat1LabelId, setStat1LabelEn, "stat1")}
                          disabled={!stat1LabelId}
                          className="text-[8px] text-primary font-semibold hover:underline"
                        >
                          Translate
                        </button>
                      </div>
                      <input
                        type="text"
                        required
                        value={stat1LabelEn}
                        onChange={(e) => setStat1LabelEn(e.target.value)}
                        placeholder="Blades Restored"
                        className="w-full px-2.5 py-1.5 text-xs rounded border border-border bg-card text-foreground focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Stat 2 */}
                <div className="space-y-3 p-4 rounded-xl bg-muted/20 border border-border/80">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Statistik 2 Angka/Nilai</label>
                    <input
                      type="text"
                      required
                      value={stat2Value}
                      onChange={(e) => setStat2Value(e.target.value)}
                      placeholder="Contoh: 99.9%"
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-border bg-card text-foreground focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-muted-foreground uppercase">Label (ID)</label>
                      <input
                        type="text"
                        required
                        value={stat2LabelId}
                        onChange={(e) => setStat2LabelId(e.target.value)}
                        placeholder="Sudut Presisi"
                        className="w-full px-2.5 py-1.5 text-xs rounded border border-border bg-card text-foreground focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[9px] font-bold text-muted-foreground uppercase">Label (EN)</label>
                        <button
                          type="button"
                          onClick={() => handleTranslate(stat2LabelId, setStat2LabelEn, "stat2")}
                          disabled={!stat2LabelId}
                          className="text-[8px] text-primary font-semibold hover:underline"
                        >
                          Translate
                        </button>
                      </div>
                      <input
                        type="text"
                        required
                        value={stat2LabelEn}
                        onChange={(e) => setStat2LabelEn(e.target.value)}
                        placeholder="Precision Angle"
                        className="w-full px-2.5 py-1.5 text-xs rounded border border-border bg-card text-foreground focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: GOOGLE MAPS */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2 pb-2 border-b border-border/80">
            <Compass className="h-5 w-5 text-primary" />
            <span>3. Integrasi Peta Google Maps</span>
          </h3>

          <div className="space-y-1">
            <label className="text-xs font-bold text-foreground uppercase tracking-wide">Google Maps Iframe Embed URL (src)</label>
            <input
              type="text"
              required
              value={mapsEmbedUrl}
              onChange={(e) => setMapsEmbedUrl(e.target.value)}
              placeholder="https://www.google.com/maps/embed?pb=..."
              className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
            <span className="text-[10px] text-muted-foreground block">
              Salin URL dari menu Bagikan &gt; Sematkan Peta &gt; Ambil nilai atribut `src` saja.
            </span>
          </div>
        </div>

        {/* Card 4: ABOUT US SECTION */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2 pb-2 border-b border-border/80">
            <Info className="h-5 w-5 text-primary" />
            <span>4. Konten Tentang Kami (About Us) & 3 Keunggulan</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground uppercase tracking-wide">Judul Halaman (Indonesia)</label>
              <input
                type="text"
                required
                value={aboutTitleId}
                onChange={(e) => setAboutTitleId(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-foreground uppercase tracking-wide">Judul Halaman (Inggris)</label>
                <button
                  type="button"
                  onClick={() => handleTranslate(aboutTitleId, setAboutTitleEn, "aboutTitle")}
                  disabled={!aboutTitleId}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <Sparkles className="h-3 w-3" /> Translate
                </button>
              </div>
              <input
                type="text"
                required
                value={aboutTitleEn}
                onChange={(e) => setAboutTitleEn(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground uppercase tracking-wide">Paragraf 1 (Indonesia)</label>
              <textarea
                required
                value={aboutDesc1Id}
                onChange={(e) => setAboutDesc1Id(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-foreground uppercase tracking-wide">Paragraf 1 (Inggris)</label>
                <button
                  type="button"
                  onClick={() => handleTranslate(aboutDesc1Id, setAboutDesc1En, "desc1")}
                  disabled={!aboutDesc1Id}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <Sparkles className="h-3 w-3" /> Translate
                </button>
              </div>
              <textarea
                required
                value={aboutDesc1En}
                onChange={(e) => setAboutDesc1En(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground uppercase tracking-wide">Paragraf 2 (Indonesia)</label>
              <textarea
                required
                value={aboutDesc2Id}
                onChange={(e) => setAboutDesc2Id(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-foreground uppercase tracking-wide">Paragraf 2 (Inggris)</label>
                <button
                  type="button"
                  onClick={() => handleTranslate(aboutDesc2Id, setAboutDesc2En, "desc2")}
                  disabled={!aboutDesc2Id}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <Sparkles className="h-3 w-3" /> Translate
                </button>
              </div>
              <textarea
                required
                value={aboutDesc2En}
                onChange={(e) => setAboutDesc2En(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none"
              />
            </div>
          </div>

          {/* Cards Keunggulan */}
          <div className="pt-4 border-t border-border/60 space-y-6">
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wide">Teks 3 Kartu Keunggulan</h4>
            
            {/* Card 1 */}
            <div className="p-4 rounded-xl bg-muted/20 border border-border space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Keunggulan 1 Title (ID)</label>
                  <input type="text" required value={feat1TitleId} onChange={(e) => setFeat1TitleId(e.target.value)} className="w-full px-2.5 py-1.5 text-xs rounded border border-border bg-card text-foreground" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Keunggulan 1 Title (EN)</label>
                    <button type="button" onClick={() => handleTranslate(feat1TitleId, setFeat1TitleEn, "t1")} className="text-[9px] text-primary font-bold hover:underline">Translate</button>
                  </div>
                  <input type="text" required value={feat1TitleEn} onChange={(e) => setFeat1TitleEn(e.target.value)} className="w-full px-2.5 py-1.5 text-xs rounded border border-border bg-card text-foreground" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Keunggulan 1 Desc (ID)</label>
                  <textarea rows={2} required value={feat1DescId} onChange={(e) => setFeat1DescId(e.target.value)} className="w-full px-2.5 py-1.5 text-xs rounded border border-border bg-card text-foreground" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Keunggulan 1 Desc (EN)</label>
                    <button type="button" onClick={() => handleTranslate(feat1DescId, setFeat1DescEn, "d1")} className="text-[9px] text-primary font-bold hover:underline">Translate</button>
                  </div>
                  <textarea rows={2} required value={feat1DescEn} onChange={(e) => setFeat1DescEn(e.target.value)} className="w-full px-2.5 py-1.5 text-xs rounded border border-border bg-card text-foreground" />
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-4 rounded-xl bg-muted/20 border border-border space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Keunggulan 2 Title (ID)</label>
                  <input type="text" required value={feat2TitleId} onChange={(e) => setFeat2TitleId(e.target.value)} className="w-full px-2.5 py-1.5 text-xs rounded border border-border bg-card text-foreground" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Keunggulan 2 Title (EN)</label>
                    <button type="button" onClick={() => handleTranslate(feat2TitleId, setFeat2TitleEn, "t2")} className="text-[9px] text-primary font-bold hover:underline">Translate</button>
                  </div>
                  <input type="text" required value={feat2TitleEn} onChange={(e) => setFeat2TitleEn(e.target.value)} className="w-full px-2.5 py-1.5 text-xs rounded border border-border bg-card text-foreground" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Keunggulan 2 Desc (ID)</label>
                  <textarea rows={2} required value={feat2DescId} onChange={(e) => setFeat2DescId(e.target.value)} className="w-full px-2.5 py-1.5 text-xs rounded border border-border bg-card text-foreground" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Keunggulan 2 Desc (EN)</label>
                    <button type="button" onClick={() => handleTranslate(feat2DescId, setFeat2DescEn, "d2")} className="text-[9px] text-primary font-bold hover:underline">Translate</button>
                  </div>
                  <textarea rows={2} required value={feat2DescEn} onChange={(e) => setFeat2DescEn(e.target.value)} className="w-full px-2.5 py-1.5 text-xs rounded border border-border bg-card text-foreground" />
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-4 rounded-xl bg-muted/20 border border-border space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Keunggulan 3 Title (ID)</label>
                  <input type="text" required value={feat3TitleId} onChange={(e) => setFeat3TitleId(e.target.value)} className="w-full px-2.5 py-1.5 text-xs rounded border border-border bg-card text-foreground" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Keunggulan 3 Title (EN)</label>
                    <button type="button" onClick={() => handleTranslate(feat3TitleId, setFeat3TitleEn, "t3")} className="text-[9px] text-primary font-bold hover:underline">Translate</button>
                  </div>
                  <input type="text" required value={feat3TitleEn} onChange={(e) => setFeat3TitleEn(e.target.value)} className="w-full px-2.5 py-1.5 text-xs rounded border border-border bg-card text-foreground" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Keunggulan 3 Desc (ID)</label>
                  <textarea rows={2} required value={feat3DescId} onChange={(e) => setFeat3DescId(e.target.value)} className="w-full px-2.5 py-1.5 text-xs rounded border border-border bg-card text-foreground" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Keunggulan 3 Desc (EN)</label>
                    <button type="button" onClick={() => handleTranslate(feat3DescId, setFeat3DescEn, "d3")} className="text-[9px] text-primary font-bold hover:underline">Translate</button>
                  </div>
                  <textarea rows={2} required value={feat3DescEn} onChange={(e) => setFeat3DescEn(e.target.value)} className="w-full px-2.5 py-1.5 text-xs rounded border border-border bg-card text-foreground" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 5: FOOTER & CONTACT INFO */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2 pb-2 border-b border-border/80">
            <FileText className="h-5 w-5 text-primary" />
            <span>5. Pengaturan Footer & Kontak Detail</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground uppercase tracking-wide">Deskripsi Footer (Indonesia)</label>
              <textarea
                required
                value={footerDescId}
                onChange={(e) => setFooterDescId(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-foreground uppercase tracking-wide">Deskripsi Footer (Inggris)</label>
                <button
                  type="button"
                  onClick={() => handleTranslate(footerDescId, setFooterDescEn, "footerDesc")}
                  disabled={!footerDescId}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <Sparkles className="h-3 w-3" /> Translate
                </button>
              </div>
              <textarea
                required
                value={footerDescEn}
                onChange={(e) => setFooterDescEn(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-foreground uppercase tracking-wide">Alamat Fisik (Footer & Kontak)</label>
            <textarea
              required
              value={footerAddress}
              onChange={(e) => setFooterAddress(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground uppercase tracking-wide">Nomor Telepon / WA</label>
              <input
                type="text"
                required
                value={footerPhone}
                onChange={(e) => setFooterPhone(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground uppercase tracking-wide">Email (Kosongkan jika ingin disembunyikan)</label>
              <input
                type="text"
                value={footerEmail}
                onChange={(e) => setFooterEmail(e.target.value)}
                placeholder="info@padigroup.my.id"
                className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground uppercase tracking-wide">Koordinat / Kompas (Kosongkan jika disembunyikan)</label>
              <input
                type="text"
                value={footerCoordinates}
                onChange={(e) => setFooterCoordinates(e.target.value)}
                placeholder="-7.3193; 112.7990"
                className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground uppercase tracking-wide">Jam Kerja (Indonesia)</label>
              <textarea
                required
                value={workingHoursId}
                onChange={(e) => setWorkingHoursId(e.target.value)}
                rows={2}
                placeholder="Senin - Sabtu (Monday - Saturday)&#10;08:00 - 17:00 WIB"
                className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-foreground uppercase tracking-wide">Jam Kerja (Inggris)</label>
                <button
                  type="button"
                  onClick={() => handleTranslate(workingHoursId, setWorkingHoursEn, "workingHours")}
                  disabled={!workingHoursId}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <Sparkles className="h-3 w-3" /> Translate
                </button>
              </div>
              <textarea
                required
                value={workingHoursEn}
                onChange={(e) => setWorkingHoursEn(e.target.value)}
                rows={2}
                placeholder="Monday - Saturday&#10;08:00 - 17:00 WIB"
                className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-border/60">
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground uppercase tracking-wide">Teks Copyright (Indonesia)</label>
              <input
                type="text"
                required
                value={footerCopyrightId}
                onChange={(e) => setFooterCopyrightId(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-foreground uppercase tracking-wide">Teks Copyright (Inggris)</label>
                <button
                  type="button"
                  onClick={() => handleTranslate(footerCopyrightId, setFooterCopyrightEn, "copyright")}
                  disabled={!footerCopyrightId}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <Sparkles className="h-3 w-3" /> Translate
                </button>
              </div>
              <input
                type="text"
                required
                value={footerCopyrightEn}
                onChange={(e) => setFooterCopyrightEn(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1 pt-2 border-t border-border/60">
            <label className="text-xs font-bold text-foreground uppercase tracking-wide">Brand Footer / Developer Credit (Kosongkan jika disembunyikan)</label>
            <input
              type="text"
              value={footerBrand}
              onChange={(e) => setFooterBrand(e.target.value)}
              placeholder="Padi Tech Solutions"
              className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Card 6: SERVICES PAGE HEADINGS & DESCRIPTION */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2 pb-2 border-b border-border/80">
            <FileText className="h-5 w-5 text-primary" />
            <span>6. Pengaturan Halaman Layanan (Services Page)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground uppercase tracking-wide">Judul Halaman Layanan (Indonesia)</label>
              <input
                type="text"
                required
                value={servicesTitleId}
                onChange={(e) => setServicesTitleId(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-foreground uppercase tracking-wide">Judul Halaman Layanan (Inggris)</label>
                <button
                  type="button"
                  onClick={() => handleTranslate(servicesTitleId, setServicesTitleEn, "servicesTitle")}
                  disabled={!servicesTitleId}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <Sparkles className="h-3 w-3" /> Translate
                </button>
              </div>
              <input
                type="text"
                required
                value={servicesTitleEn}
                onChange={(e) => setServicesTitleEn(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-border/60">
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground uppercase tracking-wide">Sub-judul Halaman Layanan (Indonesia)</label>
              <textarea
                required
                value={servicesSubtitleId}
                onChange={(e) => setServicesSubtitleId(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-foreground uppercase tracking-wide">Sub-judul Halaman Layanan (Inggris)</label>
                <button
                  type="button"
                  onClick={() => handleTranslate(servicesSubtitleId, setServicesSubtitleEn, "servicesSubtitle")}
                  disabled={!servicesSubtitleId}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <Sparkles className="h-3 w-3" /> Translate
                </button>
              </div>
              <textarea
                required
                value={servicesSubtitleEn}
                onChange={(e) => setServicesSubtitleEn(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-border/60">
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground uppercase tracking-wide">Judul Bagian Jasa Asah (Indonesia)</label>
              <input
                type="text"
                required
                value={servicesSectionTitleId}
                onChange={(e) => setServicesSectionTitleId(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-foreground uppercase tracking-wide">Judul Bagian Jasa Asah (Inggris)</label>
                <button
                  type="button"
                  onClick={() => handleTranslate(servicesSectionTitleId, setServicesSectionTitleEn, "servicesSectionTitle")}
                  disabled={!servicesSectionTitleId}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <Sparkles className="h-3 w-3" /> Translate
                </button>
              </div>
              <input
                type="text"
                required
                value={servicesSectionTitleEn}
                onChange={(e) => setServicesSectionTitleEn(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-border/60">
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground uppercase tracking-wide">Deskripsi Bagian Jasa Asah (Indonesia)</label>
              <textarea
                required
                value={servicesSectionDescId}
                onChange={(e) => setServicesSectionDescId(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-foreground uppercase tracking-wide">Deskripsi Bagian Jasa Asah (Inggris)</label>
                <button
                  type="button"
                  onClick={() => handleTranslate(servicesSectionDescId, setServicesSectionDescEn, "servicesSectionDesc")}
                  disabled={!servicesSectionDescId}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <Sparkles className="h-3 w-3" /> Translate
                </button>
              </div>
              <textarea
                required
                value={servicesSectionDescEn}
                onChange={(e) => setServicesSectionDescEn(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-md hover:bg-primary/95 transition-all gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>Simpan Pengaturan</span>
          </button>
        </div>
      </form>
    </div>
  );
}
