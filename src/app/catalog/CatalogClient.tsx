"use client";

import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Search, ShoppingBag, CheckCircle, AlertTriangle, ArrowRight } from "lucide-react";

type ProductFromDb = {
  id: string;
  name_id: string;
  name_en: string;
  slug: string;
  description_id: string;
  description_en: string;
  price: any;
  originalPrice?: any;
  imageUrl?: string | null;
  stock: number;
  categoryId: string;
  category: {
    name: string;
    slug: string;
  };
};

type CategoryFromDb = {
  id: string;
  name: string;
  slug: string;
};

type CatalogClientProps = {
  initialProducts: ProductFromDb[];
  initialCategories: CategoryFromDb[];
};

export default function CatalogClient({ initialProducts, initialCategories }: CatalogClientProps) {
  const { t, language, footerPhone } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredProducts = initialProducts.filter((product) => {
    const name = language === "id" ? product.name_id : product.name_en;
    const desc = language === "id" ? product.description_id : product.description_en;
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          desc.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || product.category.slug === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getWhatsAppLink = (productName: string) => {
    const text = encodeURIComponent(
      language === "id"
        ? `Halo Padi Sharpening Center, saya tertarik untuk memesan produk: ${productName}. Apakah stoknya masih tersedia?`
        : `Hello Padi Sharpening Center, I am interested in ordering: ${productName}. Is it currently in stock?`
    );
    const cleanPhone = footerPhone.replace(/\D/g, "");
    const waPhone = cleanPhone.startsWith("0") ? "62" + cleanPhone.slice(1) : cleanPhone;
    return `https://wa.me/${waPhone}?text=${text}`;
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <Navbar />

      <main className="grow bg-background py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
              {t("catalogTitle")}
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              {t("catalogSubtitle")}
            </p>
            <div className="w-16 h-1 bg-primary mx-auto rounded-full mt-2" />
          </div>

          {/* Filtering & Search Controls */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8 pb-6 border-b border-border/80">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 justify-center w-full md:w-auto">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${
                  selectedCategory === "all"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-card border border-border text-foreground hover:bg-accent"
                }`}
              >
                {t("catAll") || "Semua"}
              </button>
              {initialCategories.map((cat) => {
                let label = cat.name;
                if (cat.slug === "sharpening") label = t("catSharpening") || cat.name;
                else if (cat.slug === "knives") label = t("catKnives") || cat.name;
                else if (cat.slug === "accessories") label = t("catAccessories") || cat.name;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${
                      selectedCategory === cat.slug
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-card border border-border text-foreground hover:bg-accent"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-md border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const productName = language === "id" ? product.name_id : product.name_en;
                const productDesc = language === "id" ? product.description_id : product.description_en;

                return (
                  <div
                    key={product.id}
                    className="flex flex-col h-full rounded-2xl border border-border bg-card p-6 shadow-sm hover:border-primary/45 transition-all relative overflow-hidden"
                  >
                    <div className="grow space-y-4">
                      {/* Product Image / Placeholder Icon */}
                      <div className="w-full h-40 bg-muted/30 rounded-xl border border-border/50 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-radial-gradient from-primary/5 to-transparent" />
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={productName}
                            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                          />
                        ) : (
                          <ShoppingBag className="h-10 w-10 text-muted-foreground/60" />
                        )}
                        
                        {/* Category Tag Overlay (positioned cleanly inside top-right of image with high-readability backdrop) */}
                        <div className="absolute top-2.5 right-2.5 z-10 text-[9px] uppercase font-extrabold tracking-wider bg-background/90 backdrop-blur-xs text-primary border border-primary/20 px-2.5 py-1 rounded-full shadow-sm">
                          {product.category.name}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-foreground line-clamp-1">
                          {productName}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                          {productDesc}
                        </p>
                      </div>
                    </div>

                    {/* Footer Details */}
                    <div className="mt-6 pt-4 border-t border-border/80 flex flex-col space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                          {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
                            <div className="flex items-center space-x-1.5">
                              <span className="text-xs text-muted-foreground line-through">
                                {formatPrice(Number(product.originalPrice))}
                              </span>
                            </div>
                          )}
                          <span className="text-lg font-black text-foreground">
                            {formatPrice(Number(product.price))}
                          </span>
                        </div>
                        
                        {/* Stock indicator */}
                        <div className="flex items-center space-x-1 text-xs">
                          {product.stock === null || product.stock === undefined ? (
                            <>
                              <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                              <span className="text-green-500 font-medium">{t("inStock")}</span>
                            </>
                          ) : product.stock > 0 ? (
                            <>
                              <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                              <span className="text-green-500 font-medium">{t("inStock")} ({product.stock})</span>
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />
                              <span className="text-rose-500 font-medium">{t("outOfStock")}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          href={`/catalog/${product.slug}`}
                          className="py-2.5 px-3 text-xs font-semibold border border-border bg-card text-foreground hover:bg-accent rounded-md text-center transition-all flex items-center justify-center"
                        >
                          {language === "id" ? "Detail" : "Details"}
                        </Link>
                        <a
                          href={getWhatsAppLink(productName)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2.5 px-3 text-xs font-bold bg-primary text-primary-foreground rounded-md text-center shadow-sm hover:bg-primary/95 transition-all flex items-center justify-center space-x-1"
                        >
                          <span>{language === "id" ? "Pesan WA" : "Order WA"}</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-border rounded-2xl bg-card/25">
              <ShoppingBag className="h-12 w-12 text-muted-foreground/60 mx-auto mb-3" />
              <p className="text-muted-foreground font-semibold">
                {language === "id" ? "Produk tidak ditemukan." : "No products found."}
              </p>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
