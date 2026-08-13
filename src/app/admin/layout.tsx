"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Wrench, 
  GraduationCap, 
  BarChart3, 
  History, 
  Menu, 
  X,
  User,
  ArrowLeft,
  Settings,
  Image as ImageIcon
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import LogoutButton from "../../components/LogoutButton";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logoUrl } = useApp();

  const menuItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/produk", label: "Kelola Produk", icon: ShoppingBag },
    { href: "/admin/layanan", label: "Kelola Layanan", icon: Wrench },
    { href: "/admin/training", label: "Kelola Training", icon: GraduationCap },
    { href: "/admin/portfolio", label: "Kelola Portofolio", icon: ImageIcon },
    { href: "/admin/analitik", label: "Analitik", icon: BarChart3 },
    { href: "/admin/log-aktivitas", label: "Log Aktivitas", icon: History },
    { href: "/admin/pengaturan", label: "Pengaturan Web", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background flex text-foreground transition-colors duration-300">
      
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-card border-r border-border shrink-0 sticky top-0 h-screen">
        {/* Header */}
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link href="/admin" className="flex items-center space-x-2">
            {logoUrl && (
              <img src={logoUrl} alt="Logo" className="w-8 h-8 object-contain shrink-0" />
            )}
            <span className="text-lg font-black tracking-tight uppercase">
              PADI<span className="text-primary"> ADMIN</span>
            </span>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer info / Back to site + Logout */}
        <div className="p-4 border-t border-border bg-muted/20 space-y-1">
          <Link
            href="/"
            className="flex items-center space-x-2 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors px-2 py-1.5"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Kembali ke Website</span>
          </Link>
          <LogoutButton />
        </div>
      </aside>

      {/* Mobile Drawer (Sidebar overlay) */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-background/80 backdrop-blur-sm">
          <div className="relative flex flex-col w-64 bg-card border-r border-border h-full shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1.5 rounded-md border border-border bg-card text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="h-16 flex items-center px-6 border-b border-border space-x-2">
              {logoUrl && (
                <img src={logoUrl} alt="Logo" className="w-8 h-8 object-contain shrink-0" />
              )}
              <span className="text-lg font-black tracking-tight">
                PADI<span className="text-primary"> ADMIN</span>
              </span>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-border bg-muted/20 space-y-1">
              <Link
                href="/"
                className="flex items-center space-x-2 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors px-2 py-1.5"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Kembali ke Website</span>
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      )}

      {/* Main Panel Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header bar */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-colors duration-300">
          <div className="flex items-center">
            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 mr-3 rounded-md border border-border text-foreground lg:hidden"
              aria-label="Open Sidebar"
            >
              <Menu className="h-4 w-4" />
            </button>
            <h1 className="text-base sm:text-lg font-bold text-foreground capitalize">
              {pathname === "/admin" && "Dashboard Overview"}
              {pathname === "/admin/produk" && "Kelola Katalog Produk"}
              {pathname === "/admin/layanan" && "Kelola Jasa & Layanan"}
              {pathname === "/admin/training" && "Kelola Pelatihan & Training"}
              {pathname === "/admin/analitik" && "Analitik Pengunjung"}
              {pathname === "/admin/log-aktivitas" && "Log Aktivitas CRUD"}
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full border border-border bg-muted/20 text-xs font-semibold text-foreground/80">
              <User className="h-3.5 w-3.5" />
              <span>Admin Center</span>
            </div>
          </div>
        </header>

        {/* Content Children wrapper */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
