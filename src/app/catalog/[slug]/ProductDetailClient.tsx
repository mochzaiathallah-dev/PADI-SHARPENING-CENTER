"use client";

import React from "react";
import { useApp } from "../../../context/AppContext";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { ArrowLeft, ShoppingBag, CheckCircle, AlertTriangle, MessageSquare } from "lucide-react";
import Link from "next/link";

type ProductType = {
  id: string;
  name_id: string;
  name_en: string;
  slug: string;
  description_id: string;
  description_en: string;
  price: number;
  originalPrice: number | null;
  stock: number | null;
  imageUrl: string | null;
  category: {
    name: string;
    slug: string;
  };
};

type ProductDetailClientProps = {
  product: ProductType;
};

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { t, language, footerPhone } = useApp();

  const productName = language === "id" ? product.name_id : product.name_en;
  const productDesc = language === "id" ? product.description_id : product.description_en;

  const formatPrice = (priceVal: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(priceVal);
  };

  const cleanPhone = footerPhone.replace(/\D/g, "");
  const waPhone = cleanPhone.startsWith("0") ? "62" + cleanPhone.slice(1) : cleanPhone;

  const getWhatsAppLink = () => {
    const priceText = formatPrice(product.price);
    const text = language === "id"
      ? `Halo Padi Sharpening Center, saya ingin memesan produk: *${productName}* (${priceText}). Apakah masih tersedia?`
      : `Hello Padi Sharpening Center, I would like to order: *${productName}* (${priceText}). Is it still available?`;
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
              href="/catalog"
              className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-primary transition-colors gap-2 group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span>{language === "id" ? "Kembali ke Katalog" : "Back to Catalog"}</span>
            </Link>
          </div>

          {/* Product Detail Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
            
            {/* Left Column: Image */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <div className="w-full aspect-4/3 sm:aspect-square bg-muted/30 rounded-2xl border border-border/50 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-radial-gradient from-primary/5 to-transparent" />
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={productName}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-muted-foreground/60 space-y-2">
                    <ShoppingBag className="h-16 w-16 opacity-40" />
                    <span className="text-xs">{language === "id" ? "Tidak ada foto" : "No photo available"}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Details */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                
                {/* Category Badge */}
                <div className="inline-block text-xs uppercase font-extrabold tracking-wider bg-primary/10 text-primary px-3 py-1.5 rounded-full">
                  {product.category.name}
                </div>

                {/* Product Name */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground leading-tight">
                  {productName}
                </h1>

                {/* Stock status */}
                <div className="flex items-center space-x-1.5 text-sm pt-1">
                  {product.stock === null || product.stock === undefined ? (
                    <>
                      <CheckCircle className="h-4.5 w-4.5 text-green-500" />
                      <span className="text-green-500 font-medium">
                        {language === "id" ? "Tersedia" : "In Stock"}
                      </span>
                    </>
                  ) : product.stock > 0 ? (
                    <>
                      <CheckCircle className="h-4.5 w-4.5 text-green-500" />
                      <span className="text-green-500 font-medium">
                        {language === "id" ? `Tersedia (Stok: ${product.stock})` : `In Stock (Qty: ${product.stock})`}
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-4.5 w-4.5 text-rose-500" />
                      <span className="text-rose-500 font-medium">{t("outOfStock")}</span>
                    </>
                  )}
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-border/80 my-2" />

                {/* Price Display (Strikethrough Price ONLY, no discount % badge) */}
                <div className="space-y-1">
                  {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
                    <p className="text-sm sm:text-base text-muted-foreground line-through decoration-muted-foreground/75">
                      {formatPrice(Number(product.originalPrice))}
                    </p>
                  )}
                  <p className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
                    {formatPrice(Number(product.price))}
                  </p>
                </div>

                {/* Product Description */}
                <div className="pt-4 space-y-2">
                  <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                    {language === "id" ? "Deskripsi Produk" : "Product Description"}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {productDesc}
                  </p>
                </div>

              </div>

              {/* Order / Booking Button */}
              <div className="pt-6">
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 text-sm sm:text-base font-bold bg-primary text-primary-foreground rounded-xl shadow-md hover:bg-primary/95 transition-all gap-2.5 group"
                >
                  <MessageSquare className="h-5 w-5" />
                  <span>{language === "id" ? "Pesan Sekarang via WA" : "Order Now via WA"}</span>
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
