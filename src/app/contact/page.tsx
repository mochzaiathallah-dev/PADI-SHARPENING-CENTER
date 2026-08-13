"use client";

import React from "react";
import { useApp } from "../../context/AppContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Phone, Mail, MapPin, Compass, Clock } from "lucide-react";

export default function Contact() {
  const { 
    t, 
    language, 
    footerPhone, 
    footerAddress, 
    footerEmail, 
    footerCoordinates, 
    workingHours_id,
    workingHours_en,
    mapsEmbedUrl 
  } = useApp();

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

  const cleanMapsUrl = extractMapsUrl(mapsEmbedUrl) || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.382894567406!2d112.7964!3d-7.3193!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7fa68903c706d%3A0xb3de4568393c706d!2sJl.%20Tambak%20Medokan%20Ayu%20III%20B%2C%20Medokan%20Ayu%2C%20Kec.%20Rungkut%2C%20Surabaya%2C%20Jawa%20Timur%2060295!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid";

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <Navbar />

      <main className="grow bg-background py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
              {t("navContact")}
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              {language === "id"
                ? "Hubungi tim ahli kami untuk asah pisau presisi, pemesanan kustom, atau pendaftaran program pelatihan."
                : "Contact our expert team for precision sharpening, custom orders, or training program enrollments."}
            </p>
            <div className="w-16 h-1 bg-primary mx-auto rounded-full mt-2" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-12">
            {/* Left Contact Details Card */}
            <div className="lg:col-span-4 rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-foreground">Padi Solutions</h2>
              
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-semibold">
                    {footerAddress}
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <Phone className="h-4.5 w-4.5 text-primary shrink-0" />
                  <span className="font-semibold">{footerPhone}</span>
                </li>
                {footerEmail && (
                  <li className="flex items-center space-x-3">
                    <Mail className="h-4.5 w-4.5 text-primary shrink-0" />
                    <span>{footerEmail}</span>
                  </li>
                )}
                {footerCoordinates && (
                  <li className="flex items-center space-x-3">
                    <Compass className="h-4.5 w-4.5 text-primary shrink-0" />
                    <span>{footerCoordinates}</span>
                  </li>
                )}
                <li className="flex items-start space-x-3 border-t border-border/80 pt-4">
                  <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-foreground block">
                      {language === "id" ? "Jam Kerja:" : "Working Hours:"}
                    </span>
                    <span className="block mt-0.5 whitespace-pre-line leading-relaxed">
                      {language === "id" 
                        ? (workingHours_id || "Senin - Sabtu (Monday - Saturday)\n08:00 - 17:00 WIB") 
                        : (workingHours_en || "Monday - Saturday\n08:00 - 17:00 WIB")}
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Right Map Card */}
            <div className="lg:col-span-8 space-y-6">
              <div className="w-full h-112.5 rounded-2xl overflow-hidden border border-border shadow-md">
                <iframe
                  src={cleanMapsUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
