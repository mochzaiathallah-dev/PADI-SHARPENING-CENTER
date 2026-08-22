"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "../context/AppContext";
import { Phone, Mail, MapPin, Compass } from "lucide-react";

export default function Footer() {
  const { 
    t, 
    logoText, 
    logoUrl, 
    language,
    footerPhone,
    footerAddress,
    footerEmail,
    footerCoordinates,
    footerCopyright_id,
    footerCopyright_en,
    footerBrand,
    footerDesc_id,
    footerDesc_en
  } = useApp();

  const quickLinks = [
    { href: "/", label: t("navHome") },
    { href: "/about", label: t("navAbout") },
    { href: "/services", label: t("navServices") },
    { href: "/portfolio", label: t("navPortfolio") },
    { href: "/catalog", label: t("navCatalog") },
    { href: "/training", label: t("navTraining") },
    { href: "/contact", label: t("navContact") },
  ];

  const logoParts = logoText.split(" ");
  const firstWord = logoParts[0] || "PADI";
  const restWords = logoParts.slice(1).join(" ") || "SHARPENING";

  const description = language === "id" ? footerDesc_id : footerDesc_en;
  const copyright = language === "id" ? footerCopyright_id : footerCopyright_en;

  const cleanPhone = footerPhone.replace(/\D/g, "");
  const telPhone = cleanPhone.startsWith("0") ? "+62" + cleanPhone.slice(1) : "+" + cleanPhone;

  return (
    <footer className="w-full border-t border-border bg-card text-foreground transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          
          {/* Brand Info */}
          <div className="flex flex-col space-y-4">
            <Link href="/" className="flex items-center space-x-2" aria-label="Padi Sharpening Center Home">
              {logoUrl && (
                <img 
                  src={logoUrl} 
                  alt="Padi Sharpening Center Logo" 
                  width={32} 
                  height={32} 
                  className="w-8 h-8 object-contain shrink-0" 
                  loading="lazy"
                  decoding="async"
                />
              )}
              <span className="text-xl font-black tracking-tight uppercase text-foreground">
                {firstWord}<span className="text-primary"> {restWords}</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              {description}
            </p>
          </div>

          {/* Quick Links */}
          <nav className="flex flex-col space-y-4" aria-label="Footer Navigation">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
              {t("footerQuickLinks")}
            </h3>
            <ul className="grid grid-cols-2 gap-2 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors py-1 block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact Details & Geo Coordinates */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
              {t("footerContact")}
            </h3>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start space-x-3 text-muted-foreground">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                <span className="leading-relaxed">
                  {footerAddress}
                </span>
              </li>
              <li className="flex items-center space-x-3 text-muted-foreground">
                <Phone className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                <a href={`tel:${telPhone}`} className="hover:text-primary transition-colors" aria-label={`Call ${footerPhone}`}>
                  {footerPhone}
                </a>
              </li>
              {footerEmail && (
                <li className="flex items-center space-x-3 text-muted-foreground">
                  <Mail className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                  <a href={`mailto:${footerEmail}`} className="hover:text-primary transition-colors" aria-label={`Email ${footerEmail}`}>
                    {footerEmail}
                  </a>
                </li>
              )}
              {footerCoordinates && (
                <li className="flex items-center space-x-3 text-muted-foreground">
                  <Compass className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                  <span>{footerCoordinates}</span>
                </li>
              )}
            </ul>
          </div>

        </div>

        {/* Divider & Copyright */}
        <div className="mt-12 pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>{copyright}</p>
          {footerBrand && (
            <div className="flex space-x-4">
              <span>{footerBrand}</span>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
