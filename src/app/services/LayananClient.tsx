"use client";

import React from "react";
import { useApp } from "../../context/AppContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { ShieldAlert, RefreshCw, Truck, ArrowRight, CheckCircle, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

type ServiceFromDb = {
  id: string;
  name_id: string;
  name_en: string;
  slug: string;
  description_id: string;
  description_en: string;
  price: any;
  originalPrice?: any | null;
  features_id?: string | null;
  features_en?: string | null;
  type: string;
  imageUrl?: string | null;
};

type LayananClientProps = {
  initialServices: ServiceFromDb[];
};

const FALLBACK_SHARPENING = [
  {
    id: "fallback-std",
    nameId: "Pisau Dapur Standar (Standard)",
    nameEn: "Standard Kitchen Knife",
    slug: "jasa-asah-pisau-dapur-standar",
    price: 15000,
    originalPrice: 20000,
    descId: "Penajaman harian untuk pisau dapur kecil, pisau kupas, dan pisau buah.",
    descEn: "Daily sharpening for small kitchen knives, paring knives, and fruit blades.",
    featuresId: ["Sudut asah 18-20 derajat", "Asah batu air kasar-menengah", "Uji potong kertas", "Selesai dalam 1-2 hari"],
    featuresEn: ["18-20 degree sharpening angle", "Coarse-medium whetstone finish", "Paper cut test pass", "1-2 days turnaround time"],
  },
  {
    id: "fallback-premium",
    nameId: "Pisau Sembelih & Daging (Premium)",
    nameEn: "Slaughter & Meat Knife",
    slug: "jasa-asah-pisau-sembelih-dan-daging",
    price: 35000,
    originalPrice: 45000,
    descId: "Penajaman presisi tinggi khusus untuk pisau sembelih sapi/kambing dan pisau boning.",
    descEn: "High-precision sharpening specifically for cattle slaughtering and boning knives.",
    featuresId: ["Sudut asah 14-16 derajat", "Finishing batu alam premium (6000+)", "Stropping kulit & poles micro-bevel", "Uji cukur bulu (Hair shaving sharp)"],
    featuresEn: ["14-16 degree sharpening angle", "Premium natural whetstone finish (6000+)", "Leather stropping & micro-bevel polish", "Hair-shaving sharp test pass"],
  },
  {
    id: "fallback-heavy",
    nameId: "Pisau Cincang / Bilah Khusus (Heavy)",
    nameEn: "Cleaver / Heavy-Duty Blade",
    slug: "jasa-asah-pisau-cincang-dan-cleaver",
    price: 50000,
    originalPrice: 65000,
    descId: "Penajaman bilah tebal seperti pisau tulang (cleaver), gunting daging, dan bilah industri.",
    descEn: "Sharhing thick blades such as meat cleavers, heavy scissors, and industrial blades.",
    featuresId: ["Sudut asah 22-25 derajat (kuat)", "Asah basah mesin Tormek", "Ketahanan mata bilah ekstra", "Perbaikan chipping/gompel minor"],
    featuresEn: ["22-25 degree angle (durable)", "Tormek water-cooled machine sharpening", "Extra edge retention polish", "Minor chipping repairs included"],
  },
];

export default function LayananClient({ initialServices }: LayananClientProps) {
  const { 
    t, 
    language,
    footerPhone,
    servicesTitle_id,
    servicesTitle_en,
    servicesSubtitle_id,
    servicesSubtitle_en,
    servicesSectionTitle_id,
    servicesSectionTitle_en,
    servicesSectionDesc_id,
    servicesSectionDesc_en,
  } = useApp();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getWhatsAppLink = (serviceName: string, type: string) => {
    let text = "";
    if (type === "SHARPENING") {
      text = language === "id"
        ? `Halo Padi Sharpening Center, saya ingin memesan layanan Jasa Asah untuk kategori: ${serviceName}.`
        : `Hello Padi Sharpening Center, I want to order Sharpening Service for: ${serviceName}.`;
    } else if (type === "RENTAL") {
      text = language === "id"
        ? `Halo Padi Sharpening Center, saya tertarik dengan program: ${serviceName}.`
        : `Hello Padi Sharpening Center, I am interested in the program: ${serviceName}.`;
    } else if (type === "PROCUREMENT") {
      text = language === "id"
        ? `Halo Padi Sharpening Center, saya ingin mengajukan pengadaan: ${serviceName}.`
        : `Hello Padi Sharpening Center, I would like to request procurement for: ${serviceName}.`;
    } else {
      text = language === "id"
        ? `Halo Padi Sharpening Center, saya tertarik dengan layanan: ${serviceName}.`
        : `Hello Padi Sharpening Center, I am interested in the service: ${serviceName}.`;
    }

    const cleanPhone = footerPhone.replace(/\D/g, "");
    const waPhone = cleanPhone.startsWith("0") 
      ? "62" + cleanPhone.slice(1) 
      : cleanPhone.startsWith("62") 
        ? cleanPhone 
        : cleanPhone.startsWith("8")
          ? "62" + cleanPhone
          : cleanPhone || "6281331254199";

    return `https://wa.me/${waPhone}?text=${encodeURIComponent(text)}`;
  };

  const parseFeatures = (s: ServiceFromDb) => {
    const raw = language === "id" ? s.features_id : s.features_en;
    if (!raw) return [];
    return raw.split("\n").map(f => f.trim()).filter(Boolean);
  };

  // Divide services dynamically
  const dbSharpening = initialServices.filter(s => s.type === "SHARPENING");
  const dbRental = initialServices.filter(s => s.type === "RENTAL");
  const dbProcurement = initialServices.filter(s => s.type === "PROCUREMENT");

  const otherTypes = Array.from(
    new Set(
      initialServices
        .map(s => s.type)
        .filter(t => t !== "SHARPENING" && t !== "RENTAL" && t !== "PROCUREMENT")
    )
  );

  const displaySharpening = dbSharpening.length > 0
    ? dbSharpening.map(s => ({
        id: s.id,
        nameId: s.name_id,
        nameEn: s.name_en,
        price: Number(s.price),
        originalPrice: s.originalPrice ? Number(s.originalPrice) : null,
        descId: s.description_id,
        descEn: s.description_en,
        features: parseFeatures(s),
        imageUrl: s.imageUrl,
        type: s.type,
        slug: s.slug,
      }))
    : FALLBACK_SHARPENING.map(s => ({
        id: s.id,
        nameId: s.nameId,
        nameEn: s.nameEn,
        price: s.price,
        originalPrice: s.originalPrice,
        descId: s.descId,
        descEn: s.descEn,
        features: language === "id" ? s.featuresId : s.featuresEn,
        imageUrl: null,
        type: "SHARPENING",
        slug: s.slug,
      }));

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <Navbar />

      <main className="grow bg-background py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
              {language === "id" ? servicesTitle_id : servicesTitle_en}
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              {language === "id" ? servicesSubtitle_id : servicesSubtitle_en}
            </p>
            <div className="w-16 h-1 bg-primary mx-auto rounded-full mt-2" />
          </div>

          {/* SECTION 1: SHARPENING SERVICE PRICING TIERS */}
          <div className="space-y-8 mb-20">
            <div className="text-center md:text-left">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground flex items-center justify-center md:justify-start gap-2">
                <RefreshCw className="h-6 w-6 text-primary animate-spin-slow" />
                <span>{language === "id" ? servicesSectionTitle_id : servicesSectionTitle_en}</span>
              </h2>
              <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
                {language === "id" ? servicesSectionDesc_id : servicesSectionDesc_en}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {displaySharpening.map((tier, idx) => {
                const tierName = language === "id" ? tier.nameId : tier.nameEn;
                const tierDesc = language === "id" ? tier.descId : tier.descEn;

                return (
                  <div
                    key={tier.id}
                    className="flex flex-col h-full justify-between rounded-2xl border border-border bg-card p-6 shadow-sm hover:border-primary/45 transition-all relative overflow-hidden"
                  >
                    <div className="space-y-6">
                      {tier.imageUrl && (
                        <div className="w-full h-36 rounded-lg overflow-hidden border border-border bg-muted/20">
                          <img src={tier.imageUrl} alt={tierName} className="w-full h-full object-cover" />
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-foreground">{tierName}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{tierDesc}</p>
                      </div>

                      {/* Pricing with dynamic crossed out discount price */}
                      <div className="py-4 border-t border-b border-border/80">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold block">{t("priceStarts")}</span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-black text-foreground">{formatPrice(tier.price)}</span>
                          {tier.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through decoration-rose-500 font-bold">
                              {formatPrice(tier.originalPrice)}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground block mt-1"> / pcs</span>
                      </div>

                      <ul className="space-y-2.5 text-xs sm:text-sm text-muted-foreground">
                        {tier.features.map((feat, i) => (
                          <li key={i} className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-2">
                      <Link
                        href={`/services/${tier.slug}`}
                        className="py-2.5 px-3 text-xs font-semibold border border-border bg-card text-foreground hover:bg-accent rounded-md text-center transition-all flex items-center justify-center"
                      >
                        {language === "id" ? "Detail" : "Details"}
                      </Link>
                      <a
                        href={getWhatsAppLink(tierName, "SHARPENING")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-3 text-xs font-bold bg-primary text-primary-foreground rounded-md text-center shadow-sm hover:bg-primary/95 transition-all flex items-center justify-center space-x-1"
                      >
                        <span>{language === "id" ? "Hubungi" : "Inquire"}</span>
                        <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: OTHER SERVICES (RENTAL & PROCUREMENT) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8 border-t border-border/80">
            
            {/* Rental Program */}
            {dbRental.length > 0 ? (
              dbRental.map((rental) => {
                const name = language === "id" ? rental.name_id : rental.name_en;
                const desc = language === "id" ? rental.description_id : rental.description_en;
                const features = parseFeatures(rental);

                return (
                  <div key={rental.id} className="flex flex-col justify-between rounded-2xl border border-border bg-card p-8 shadow-sm hover:border-primary/45 transition-all">
                    <div className="space-y-6">
                      {rental.imageUrl ? (
                        <div className="w-full h-40 rounded-xl overflow-hidden border border-border">
                          <img src={rental.imageUrl} alt={name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="p-4 bg-primary/10 text-primary self-start rounded-xl inline-block">
                          <ShieldAlert className="h-8 w-8" />
                        </div>
                      )}
                      <div className="space-y-2">
                        <h2 className="text-2xl font-extrabold text-foreground">{name}</h2>
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                          {desc}
                        </p>
                      </div>
                      
                      {features.length > 0 && (
                        <div className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                          {features.map((feat, i) => (
                            <div key={i} className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-primary" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-2">
                      <Link
                        href={`/services/${rental.slug}`}
                        className="py-2.5 px-3 text-sm font-semibold border border-border bg-card text-foreground hover:bg-accent rounded-md text-center transition-all flex items-center justify-center"
                      >
                        {language === "id" ? "Detail" : "Details"}
                      </Link>
                      <a
                        href={getWhatsAppLink(name, "RENTAL")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-3 text-sm font-bold bg-primary text-primary-foreground rounded-md text-center hover:bg-primary/95 transition-all flex items-center justify-center space-x-1"
                      >
                        <span>{t("inquireWhatsApp")}</span>
                        <ArrowRight className="h-4 w-4 shrink-0" />
                      </a>
                    </div>
                  </div>
                );
              })
            ) : (
              /* Fallback Rental */
              <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-8 shadow-sm hover:border-primary/45 transition-all">
                <div className="space-y-6">
                  <div className="p-4 bg-primary/10 text-primary self-start rounded-xl inline-block">
                    <ShieldAlert className="h-8 w-8" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-extrabold text-foreground">{t("srvRental")}</h2>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {t("srvRentalDesc")}
                    </p>
                  </div>
                  
                  <div className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>{language === "id" ? "Bilah berkualitas tinggi selalu tajam" : "High-quality blades kept razor-sharp"}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>{language === "id" ? "Siklus tukar asah rutin mingguan/bulanan" : "Weekly/monthly replacement cycles"}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>{language === "id" ? "Hemat biaya investasi pembelian pisau dapur" : "Saves capital expenditure on knives"}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <a
                    href={getWhatsAppLink("Sewa Alat", "RENTAL")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-4 text-sm font-bold bg-primary text-primary-foreground rounded-md text-center hover:bg-primary/95 transition-all flex items-center justify-center space-x-2"
                  >
                    <span>{t("inquireWhatsApp")}</span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            )}

            {/* Procurement Supply */}
            {dbProcurement.length > 0 ? (
              dbProcurement.map((proc) => {
                const name = language === "id" ? proc.name_id : proc.name_en;
                const desc = language === "id" ? proc.description_id : proc.description_en;
                const features = parseFeatures(proc);

                return (
                  <div key={proc.id} className="flex flex-col justify-between rounded-2xl border border-border bg-card p-8 shadow-sm hover:border-primary/45 transition-all">
                    <div className="space-y-6">
                      {proc.imageUrl ? (
                        <div className="w-full h-40 rounded-xl overflow-hidden border border-border">
                          <img src={proc.imageUrl} alt={name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="p-4 bg-primary/10 text-primary self-start rounded-xl inline-block">
                          <Truck className="h-8 w-8" />
                        </div>
                      )}
                      <div className="space-y-2">
                        <h2 className="text-2xl font-extrabold text-foreground">{name}</h2>
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                          {desc}
                        </p>
                      </div>
                      
                      {features.length > 0 && (
                        <div className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                          {features.map((feat, i) => (
                            <div key={i} className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-primary" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-2">
                      <Link
                        href={`/services/${proc.slug}`}
                        className="py-2.5 px-3 text-sm font-semibold border border-border bg-card text-foreground hover:bg-accent rounded-md text-center transition-all flex items-center justify-center"
                      >
                        {language === "id" ? "Detail" : "Details"}
                      </Link>
                      <a
                        href={getWhatsAppLink(name, "PROCUREMENT")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-3 text-sm font-bold bg-primary text-primary-foreground rounded-md text-center hover:bg-primary/95 transition-all flex items-center justify-center space-x-1"
                      >
                        <span>{t("inquireWhatsApp")}</span>
                        <ArrowRight className="h-4 w-4 shrink-0" />
                      </a>
                    </div>
                  </div>
                );
              })
            ) : (
              /* Fallback Procurement */
              <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-8 shadow-sm hover:border-primary/45 transition-all">
                <div className="space-y-6">
                  <div className="p-4 bg-primary/10 text-primary self-start rounded-xl inline-block">
                    <Truck className="h-8 w-8" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-extrabold text-foreground">{t("srvProcurement")}</h2>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {t("srvProcurementDesc")}
                    </p>
                  </div>

                  <div className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>{language === "id" ? "Pengadaan pisau impor/lokal bergaransi" : "Warrantied local & imported knife sourcing"}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>{language === "id" ? "Paket lengkap alat asah (whetstone, strop)" : "Full sharpening setups (stones, strops)"}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>{language === "id" ? "Konsultasi standarisasi ketajaman industri" : "Consultation on industrial sharpness standards"}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <a
                    href={getWhatsAppLink("Pengadaan Alat", "PROCUREMENT")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-4 text-sm font-bold bg-primary text-primary-foreground rounded-md text-center hover:bg-primary/95 transition-all flex items-center justify-center space-x-2"
                  >
                    <span>{t("inquireWhatsApp")}</span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            )}

          </div>

          {/* Dynamic Custom Categories */}
          {otherTypes.map((customType) => {
            const customServices = initialServices.filter(s => s.type === customType);
            // Title formatting (e.g. "juru_sembelih" -> "Juru Sembelih")
            const displayCustomName = customType
              .replace(/_/g, " ")
              .replace(/-/g, " ")
              .replace(/\b\w/g, c => c.toUpperCase());

            return (
              <div key={customType} className="space-y-8 mt-20 pt-8 border-t border-border/80">
                <div className="text-center md:text-left">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground flex items-center justify-center md:justify-start gap-2 capitalize">
                    <CheckCircle className="h-6 w-6 text-primary shrink-0" />
                    <span>{displayCustomName}</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {customServices.map((service) => {
                    const sName = language === "id" ? service.name_id : service.name_en;
                    const sDesc = language === "id" ? service.description_id : service.description_en;
                    const sFeatures = parseFeatures(service);
                    const sPrice = Number(service.price);
                    const sOriginalPrice = service.originalPrice ? Number(service.originalPrice) : null;

                    return (
                      <div
                        key={service.id}
                        className="flex flex-col h-full justify-between rounded-2xl border border-border bg-card p-6 shadow-sm hover:border-primary/45 transition-all relative overflow-hidden"
                      >
                        <div className="space-y-6">
                          {service.imageUrl && (
                            <div className="w-full h-36 rounded-lg overflow-hidden border border-border bg-muted/20">
                              <img src={service.imageUrl} alt={sName} className="w-full h-full object-cover" />
                            </div>
                          )}
                          
                          <div className="space-y-2">
                            <h3 className="text-lg font-bold text-foreground">{sName}</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{sDesc}</p>
                          </div>

                          {/* Pricing */}
                          {sPrice > 0 && (
                            <div className="py-4 border-t border-b border-border/80">
                              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold block">{t("priceStarts")}</span>
                              <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-black text-foreground">{formatPrice(sPrice)}</span>
                                {sOriginalPrice && (
                                  <span className="text-sm text-muted-foreground line-through decoration-rose-500 font-bold">
                                    {formatPrice(sOriginalPrice)}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {sFeatures.length > 0 && (
                            <ul className="space-y-2.5 text-xs sm:text-sm text-muted-foreground">
                              {sFeatures.map((feat, i) => (
                                <li key={i} className="flex items-center space-x-2">
                                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                                  <span>{feat}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        <div className="mt-8 grid grid-cols-2 gap-2">
                          <Link
                            href={`/services/${service.slug}`}
                            className="py-2.5 px-3 text-xs font-semibold border border-border bg-card text-foreground hover:bg-accent rounded-md text-center transition-all flex items-center justify-center"
                          >
                            {language === "id" ? "Detail" : "Details"}
                          </Link>
                          <a
                            href={getWhatsAppLink(sName, customType)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-2.5 px-3 text-xs font-bold bg-primary text-primary-foreground rounded-md text-center shadow-sm hover:bg-primary/95 transition-all flex items-center justify-center space-x-1"
                          >
                            <span>{t("inquireWhatsApp")}</span>
                            <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

        </div>
      </main>

      <Footer />
    </div>
  );
}
