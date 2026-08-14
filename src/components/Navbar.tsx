"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "../context/AppContext";
import { Menu, X, Sun, Moon, Globe } from "lucide-react";

export default function Navbar() {
  const { t, language, setLanguage, theme, setTheme, logoText, logoUrl } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
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

  const toggleLanguage = () => {
    setLanguage(language === "id" ? "en" : "id");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border glass transition-colors duration-300">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2 shrink-0" aria-label="Padi Sharpening Center Home">
          {logoUrl && (
            <img 
              src={logoUrl} 
              alt="Padi Sharpening Center Logo" 
              width={40} 
              height={40} 
              className="w-10 h-10 object-contain shrink-0" 
            />
          )}
          <span className="text-xs min-[350px]:text-sm sm:text-base md:text-lg font-black tracking-tight text-foreground uppercase shrink-0">
            {firstWord}<span className="text-primary"> {restWords}</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 text-sm" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors py-2 px-1 relative ${
                  isActive 
                    ? "text-primary font-bold border-b-2 border-primary" 
                    : "text-foreground/80 hover:text-primary font-medium"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls (Desktop) */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-md border border-border bg-card text-foreground/80 hover:text-primary hover:bg-accent transition-all text-xs font-semibold cursor-pointer"
            aria-label={`Switch Language (Current: ${language.toUpperCase()})`}
          >
            <Globe className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{language.toUpperCase()}</span>
          </button>

          {/* Theme Selector */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-md border border-border bg-card text-foreground/85 hover:text-primary hover:bg-accent transition-all cursor-pointer"
            aria-label={`Switch Theme (Current: ${theme})`}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
          </button>
        </div>

        {/* Mobile controls & Toggle */}
        <div className="flex md:hidden items-center space-x-3">
          {/* Language Toggle (Mobile) */}
          <button
            onClick={toggleLanguage}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-md border border-border bg-card text-foreground/80 text-xs font-semibold"
            aria-label={`Switch Language (Current: ${language.toUpperCase()})`}
          >
            <Globe className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{language.toUpperCase()}</span>
          </button>

          {/* Theme Toggle (Mobile) */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-md border border-border bg-card text-foreground/80 cursor-pointer"
            aria-label={`Switch Theme (Current: ${theme})`}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md border border-border bg-card text-foreground/85"
            aria-label={isOpen ? "Close Menu" : "Open Menu"}
          >
            {isOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 pt-2 pb-6 space-y-3 transition-all duration-300">
          <nav className="flex flex-col space-y-2 pt-2" aria-label="Mobile Navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block py-2.5 px-3 text-sm font-bold border-b transition-all ${
                    isActive 
                      ? "text-primary border-primary bg-primary/5 rounded-md" 
                      : "text-foreground/80 border-border/40 hover:text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
