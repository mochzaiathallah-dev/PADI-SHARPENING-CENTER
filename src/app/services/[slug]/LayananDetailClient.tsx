"use client";

import React from "react";
import { useApp } from "../../../context/AppContext";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { ArrowLeft, RefreshCw, CheckCircle, ShieldCheck, MessageSquare } from "lucide-react";
import Link from "next/link";

type ServiceType = {
  id: string;
  name_id: string;
  name_en: string;
  slug: string;
  description_id: string;
  description_en: string;
  price: number;
  originalPrice: number | null;
  features_id: string | null;
  features_en: string | null;
  type: string;
  imageUrl: string | null;
};

type LayananDetailClientProps = {
  service: ServiceType;
};

export default function LayananDetailClient({ service }: LayananDetailClientProps) {
  const { t, language, footerPhone } = useApp();

  const name = language === "id" ? service.name_id : service.name_en;
  const desc = language === "id" ? service.description_id : service.description_en;
  const rawFeatures = language === "id" ? service.features_id : service.features_en;

  const features = rawFeatures
    ? rawFeatures.split("\n").map(f => f.trim()).filter(Boolean)
    : [];

  const formatPrice = (priceVal: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(priceVal);
  };

  const cleanPhone = footerPhone.replace(/\D/g, "");
  const waPhone = cleanPhone.startsWith("0") 
    ? "62" + cleanPhone.slice(1) 
    : cleanPhone.startsWith("62") 
      ? cleanPhone 
      : cleanPhone.startsWith("8")
        ? "62" + cleanPhone
        : cleanPhone || "6281331254199";

  const getWhatsAppLink = () => {
    const text = language === "id"
      ? `Halo Padi Sharpening Center, saya tertarik untuk memesan layanan: *${name}*. Bagaimana prosedur selengkapnya?`
      : `Hello Padi Sharpening Center, I am interested in ordering the service: *${name}*. What are the next steps?`;
    return `https://wa.me/${waPhone}?text=${encodeURIComponent(text)}`;
  };

  const getServiceTypeLabel = (type: string) => {
    if (type === "SHARPENING") return language === "id" ? "Jasa Asah" : "Sharpening Service";
    if (type === "RENTAL") return language === "id" ? "Sewa Alat" : "Rental Program";
    if (type === "PROCUREMENT") return language === "id" ? "Pengadaan Alat" : "Procurement Supply";
    return type.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <Navbar />

      <main className="grow bg-background py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Back Button */}
          <div className="mb-8">
            <Link
              href="/services"
              className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-primary transition-colors gap-2 group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span>{language === "id" ? "Kembali ke Layanan" : "Back to Services"}</span>
            </Link>
          </div>

          {/* Service Detail Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
            
            {/* Left Column: Image */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <div className="w-full aspect-4/3 sm:aspect-square bg-muted/30 rounded-2xl border border-border/50 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-radial-gradient from-primary/5 to-transparent" />
                {service.imageUrl ? (
                  <img
                    src={service.imageUrl}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-muted-foreground/60 space-y-2">
                    <RefreshCw className="h-16 w-16 opacity-40 animate-spin-slow" />
                    <span className="text-xs">{language === "id" ? "Tidak ada foto" : "No photo available"}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Details */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                
                {/* Type Badge & Quality Badge */}
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-xs uppercase font-extrabold tracking-wider bg-primary/10 text-primary px-3 py-1.5 rounded-full">
                    {getServiceTypeLabel(service.type)}
                  </span>
                  <div className="flex items-center space-x-1 text-xs font-semibold text-muted-foreground bg-accent px-3 py-1.5 rounded-full">
                    <ShieldCheck className="h-4 w-4 text-green-500" />
                    <span>Verified Quality</span>
                  </div>
                </div>

                {/* Service Name */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground leading-tight">
                  {name}
                </h1>

                {/* Price Display */}
                {service.price > 0 && (
                  <div className="py-2.5">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold block">{t("priceStarts")}</span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-3xl font-black text-foreground">{formatPrice(Number(service.price))}</span>
                      {service.originalPrice && (
                        <span className="text-base text-muted-foreground line-through decoration-rose-500 font-bold">
                          {formatPrice(Number(service.originalPrice))}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground font-semibold"> / pcs</span>
                    </div>
                  </div>
                )}

                {/* Divider */}
                <div className="w-full h-px bg-border/80 my-2" />

                {/* Description */}
                <div className="pt-2 space-y-2">
                  <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                    {language === "id" ? "Deskripsi Layanan" : "Service Description"}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {desc}
                  </p>
                </div>

                {/* Features list */}
                {features.length > 0 && (
                  <div className="pt-4 space-y-3">
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                      {language === "id" ? "Cakupan / Fitur Layanan" : "Service Features / Scope"}
                    </h3>
                    <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                      {features.map((feat, i) => (
                        <li key={i} className="flex items-center space-x-2">
                          <CheckCircle className="h-4.5 w-4.5 text-primary shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>

              {/* WA Order/Inquiry Button */}
              <div className="pt-6">
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 text-sm sm:text-base font-bold bg-primary text-primary-foreground rounded-xl shadow-md hover:bg-primary/95 transition-all gap-2.5 group"
                >
                  <MessageSquare className="h-5 w-5" />
                  <span>{language === "id" ? "Pesan / Hubungi via WA" : "Order / Inquire via WA"}</span>
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
