"use client";

import React, { useEffect, useState, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function NavigationProgressContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Reset progress when route change completes
  useEffect(() => {
    if (isLoading) {
      setProgress(100);
      const timer = setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  // Intercept link clicks & buttons with data-nav attribute
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a, button[data-nav], [data-nav]");
      if (!target) return;

      if (target.tagName.toLowerCase() === "a") {
        const anchor = target as HTMLAnchorElement;
        const href = anchor.getAttribute("href");
        const targetAttr = anchor.getAttribute("target");

        if (
          href &&
          href.startsWith("/") &&
          !href.startsWith("#") &&
          targetAttr !== "_blank" &&
          href !== window.location.pathname + window.location.search
        ) {
          setIsLoading(true);
          setProgress(25);
        }
      } else if (target.hasAttribute("data-nav")) {
        setIsLoading(true);
        setProgress(25);
      }
    };

    window.addEventListener("click", handleGlobalClick, { capture: true });
    return () => window.removeEventListener("click", handleGlobalClick, { capture: true });
  }, []);

  // Animate progress incrementally
  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 85) {
          clearInterval(interval);
          return 85;
        }
        return prev + Math.floor(Math.random() * 12) + 6;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [isLoading]);

  if (!isLoading && progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none">
      {/* Top glowing progress bar */}
      <div
        className="h-1 bg-gradient-to-r from-primary via-amber-500 to-primary transition-all duration-300 ease-out shadow-[0_0_12px_hsl(var(--primary)/0.8)]"
        style={{
          width: `${progress}%`,
          opacity: isLoading || progress > 0 ? 1 : 0,
        }}
      />

      {/* Floating subtle loading badge */}
      {isLoading && (
        <div className="fixed top-4 right-4 bg-background/90 backdrop-blur-md border border-primary/30 px-3.5 py-1.5 rounded-full shadow-xl flex items-center space-x-2 animate-fade-in text-xs font-semibold text-foreground z-[9999]">
          <div className="w-3.5 h-3.5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <span>Memuat...</span>
        </div>
      )}
    </div>
  );
}

export default function NavigationProgress() {
  return (
    <Suspense fallback={null}>
      <NavigationProgressContent />
    </Suspense>
  );
}
