"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/auth-actions";
import { AlertCircle, Lock, Mail, Eye, EyeOff, Shield } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0a0a0f]">
      {/* Animated gradient background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-linear-to-br from-amber-500/20 to-orange-600/10 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-linear-to-tr from-amber-400/15 to-yellow-500/10 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full bg-amber-500/5 blur-3xl" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(251,191,36,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,0.5) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Main card */}
      <div className="relative w-full max-w-md mx-4 z-10">
        {/* Glow border effect */}
        <div className="absolute -inset-0.5 bg-linear-to-r from-amber-500 to-orange-600 rounded-2xl opacity-30 blur" />

        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            {/* Logo area */}
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-amber-400/20 blur-xl rounded-full" />
              <div className="relative w-20 h-20 rounded-2xl bg-linear-to-br from-amber-500/30 to-orange-600/20 border border-amber-500/30 flex items-center justify-center overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="Padi Sharpening Center"
                  width={64}
                  height={64}
                  className="object-contain w-14 h-14"
                  onError={(e) => {
                    // fallback if logo not found
                    e.currentTarget.style.display = "none";
                  }}
                />
                <Shield className="absolute h-8 w-8 text-amber-400 opacity-50" />
              </div>
            </div>

            <div className="text-center">
              <h1 className="text-2xl font-black text-white tracking-tight">
                PADI <span className="text-amber-400">ADMIN</span>
              </h1>
              <p className="text-xs text-white/40 mt-1 font-medium tracking-widest uppercase">
                Sharpening Center · Secure Access
              </p>
            </div>

            {/* Security badge */}
            <div className="mt-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-green-400 font-semibold">Koneksi Aman & Terenkripsi</span>
            </div>
          </div>

          {/* Error message */}
          {state?.error && (
            <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <p className="text-sm font-medium">{state.error}</p>
            </div>
          )}

          {/* Form */}
          <form action={action} className="space-y-5">
            {/* Email field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-xs font-semibold text-white/60 uppercase tracking-widest">
                Email Admin
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 group-focus-within:text-amber-400 transition-colors duration-200" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  disabled={pending}
                  placeholder="admin@padigroup.my.id"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 text-sm font-medium focus:outline-none focus:border-amber-500/50 focus:bg-white/8 focus:ring-1 focus:ring-amber-500/30 transition-all duration-200 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-xs font-semibold text-white/60 uppercase tracking-widest">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 group-focus-within:text-amber-400 transition-colors duration-200" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  disabled={pending}
                  placeholder="••••••••••••"
                  className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 text-sm font-medium focus:outline-none focus:border-amber-500/50 focus:bg-white/8 focus:ring-1 focus:ring-amber-500/30 transition-all duration-200 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors duration-200"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={pending}
              className="relative w-full py-3.5 rounded-xl font-bold text-sm tracking-wide overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 mt-2"
            >
              {/* Button gradient bg */}
              <div className="absolute inset-0 bg-linear-to-r from-amber-500 to-orange-500 group-hover:from-amber-400 group-hover:to-orange-400 transition-all duration-200" />
              {/* Shine effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-linear-to-r from-transparent via-white to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-all duration-700 ease-out" />
              {/* Button text */}
              <span className="relative flex items-center justify-center gap-2 text-white">
                {pending ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Memverifikasi...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4" />
                    Masuk ke Dashboard
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-xs text-white/20">
              © {new Date().getFullYear()} Padi Tech Solutions · Padi Sharpening Center
            </p>
            <p className="text-xs text-white/15 mt-1">
              Akses terbatas untuk administrator resmi
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
