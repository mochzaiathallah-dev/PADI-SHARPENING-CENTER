"use client";

import React from "react";
import { useApp } from "../../../context/AppContext";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { ArrowLeft, Eye, ShieldCheck, Film, MessageSquare } from "lucide-react";
import Link from "next/link";

type PortfolioType = {
  id: string;
  title_id: string;
  title_en: string;
  slug: string;
  description_id: string;
  description_en: string;
  imageUrl: string;
  category_id: string;
  category_en: string;
  metric_id: string | null;
  metric_en: string | null;
};

type PortfolioDetailClientProps = {
  portfolio: PortfolioType;
};

export default function PortfolioDetailClient({ portfolio }: PortfolioDetailClientProps) {
  const { t, language, footerPhone } = useApp();

  const title = language === "id" ? portfolio.title_id : portfolio.title_en;
  const desc = language === "id" ? portfolio.description_id : portfolio.description_en;
  const category = language === "id" ? portfolio.category_id : portfolio.category_en;
  const metric = language === "id" ? portfolio.metric_id : portfolio.metric_en;

  const isVideoBase64 = (base64Str: string | null) => {
    if (!base64Str) return false;
    return base64Str.startsWith("data:video/") || base64Str.includes("video/mp4");
  };

  const cleanPhone = footerPhone.replace(/\D/g, "");
  const waPhone = cleanPhone.startsWith("0") ? "62" + cleanPhone.slice(1) : cleanPhone;

  const getWhatsAppLink = () => {
    const text = language === "id"
      ? `Halo Padi Sharpening Center, saya tertarik dengan proyek portofolio Anda: *${title}*. Bisakah saya memesan jasa serupa?`
      : `Hello Padi Sharpening Center, I am interested in your portfolio project: *${title}*. Can I order a similar service?`;
    return `https://wa.me/${waPhone}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <Navbar />

      <main className="grow bg-background py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Back Button */}
          <div className="mb-8">
            <Link
              href="/portfolio"
              className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-primary transition-colors gap-2 group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span>{language === "id" ? "Kembali ke Portofolio" : "Back to Portfolio"}</span>
            </Link>
          </div>

          {/* Portfolio Detail Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
            
            {/* Left Column: Media */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <div className="w-full aspect-4/3 sm:aspect-square bg-muted/30 rounded-2xl border border-border/50 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-radial-gradient from-primary/5 to-transparent" />
                {portfolio.imageUrl ? (
                  isVideoBase64(portfolio.imageUrl) ? (
                    <div className="w-full h-full relative">
                      <video
                        src={portfolio.imageUrl}
                        className="w-full h-full object-cover"
                        controls
                        autoPlay
                        loop
                        muted
                        playsInline
                      />
                      <div className="absolute top-4 right-4 bg-black/60 text-white rounded-md p-1.5 shadow-sm">
                        <Film className="h-5 w-5" />
                      </div>
                    </div>
                  ) : (
                    <img
                      src={portfolio.imageUrl}
                      alt={title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center text-muted-foreground/60 space-y-2">
                    <Eye className="h-16 w-16 opacity-40" />
                    <span className="text-xs">{language === "id" ? "Tidak ada galeri" : "No gallery media"}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Details */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                
                {/* Category Badge & Verification Tag */}
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-xs uppercase font-extrabold tracking-wider bg-primary/10 text-primary px-3 py-1.5 rounded-full">
                    {category}
                  </span>
                  <div className="flex items-center space-x-1 text-xs font-semibold text-muted-foreground bg-accent px-3 py-1.5 rounded-full">
                    <ShieldCheck className="h-4 w-4 text-green-500" />
                    <span>Verified Quality</span>
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground leading-tight">
                  {title}
                </h1>

                {/* Metric/Achievement Badge */}
                {metric && (
                  <div className="inline-block text-xs font-mono font-bold text-primary bg-primary/5 border border-primary/20 px-3 py-1.5 rounded-md mt-1">
                    {metric}
                  </div>
                )}

                {/* Divider */}
                <div className="w-full h-px bg-border/80 my-2" />

                {/* Description */}
                <div className="pt-4 space-y-2">
                  <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                    {language === "id" ? "Rincian Pengerjaan" : "Project Details"}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {desc}
                  </p>
                </div>

              </div>

              {/* WA Inquiry Button */}
              <div className="pt-6">
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 text-sm sm:text-base font-bold bg-primary text-primary-foreground rounded-xl shadow-md hover:bg-primary/95 transition-all gap-2.5 group"
                >
                  <MessageSquare className="h-5 w-5" />
                  <span>{language === "id" ? "Tanyakan Layanan Serupa via WA" : "Inquire Similar Service via WA"}</span>
                </a>
              </div>

            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
