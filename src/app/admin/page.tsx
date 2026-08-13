import React from "react";
import Link from "next/link";
import prisma from "../../lib/prisma";
import { ShoppingBag, Wrench, GraduationCap, History, ArrowRight } from "lucide-react";

export const revalidate = 0; // Disable caching for admin dashboard

export default async function AdminDashboard() {
  // Query summary counts directly from local MariaDB/MySQL via Prisma
  let productCount = 0;
  let serviceCount = 0;
  let trainingCount = 0;
  let logCount = 0;

  try {
    const [pCount, sCount, tCount, lCount] = await Promise.all([
      prisma.product.count(),
      prisma.service.count(),
      prisma.training.count(),
      prisma.activityLog.count(),
    ]);
    productCount = pCount;
    serviceCount = sCount;
    trainingCount = tCount;
    logCount = lCount;
  } catch (error) {
    console.error("Failed to query dashboard statistics from database:", error);
  }

  const statCards = [
    {
      label: "Total Produk",
      count: productCount,
      href: "/admin/produk",
      color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
      icon: ShoppingBag,
    },
    {
      label: "Total Layanan",
      count: serviceCount,
      href: "/admin/layanan",
      color: "text-green-500 bg-green-500/10 border-green-500/20",
      icon: Wrench,
    },
    {
      label: "Total Training",
      count: trainingCount,
      href: "/admin/training",
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
      icon: GraduationCap,
    },
    {
      label: "Log Aktivitas",
      count: logCount,
      href: "/admin/log-aktivitas",
      color: "text-red-500 bg-red-500/10 border-red-500/20",
      icon: History,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="space-y-1">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Selamat Datang, Admin Padi
        </h2>
        <p className="text-sm text-muted-foreground">
          Kelola seluruh konten, stok produk, registrasi pelatihan, dan pantau log aktivitas dari satu panel kendali.
        </p>
      </div>

      {/* Grid Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:border-primary/45 transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-muted-foreground">
                  {card.label}
                </span>
                <div className={`p-2.5 rounded-lg border ${card.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <span className="text-3xl font-black text-foreground block">
                  {card.count}
                </span>
                <Link
                  href={card.href}
                  className="inline-flex items-center text-xs font-bold text-primary hover:underline group"
                >
                  <span>Kelola Selengkapnya</span>
                  <ArrowRight className="h-3.5 w-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Setup Notice */}
      <div className="p-6 rounded-2xl border border-border bg-card/50 space-y-4">
        <h3 className="text-lg font-bold text-foreground">Status Sinkronisasi Database</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Semua perubahan CRUD yang Anda lakukan pada tab di atas akan langsung disinkronkan ke basis data lokal MySQL Anda (`127.0.0.1:3306`) dan terekam dalam log aktivitas. Untuk menguji coba CRUD dan fitur Google Auto-Translate, silakan pilih salah satu menu manajemen di atas.
        </p>
      </div>
    </div>
  );
}
