"use client";

/**
 * SmoothScroll Provider (Lenis) - Mobil Optimize Edilmiş
 * - Mobile cihazlarda (< 768px) devre dışı (native scroll)
 * - Desktop'ta pürüzsüz kaydırma
 * - GSAP ScrollTrigger entegrasyonu
 */

import { useEffect, useRef, useState, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { setLenisInstance } from "@/lib/lenisControls";

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<any>(null);
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  // Mobil kontrolü (SSR-safe)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Lenis initialization (sadece desktop'ta)
  useEffect(() => {
    // Mobilde Lenis yükleme (native scroll kullan)
    if (isMobile) {
      return;
    }

    let cleanup: (() => void) | null = null;
    let cancelled = false;

    const initLenis = async () => {
      try {
        // Dinamik import (code-splitting)
        const [gsapModule, lenisModule, scrollTriggerModule] = await Promise.all([
          import("gsap"),
          import("lenis"),
          import("gsap/ScrollTrigger"),
        ]);

        if (cancelled) return;

        const gsap = gsapModule.default;
        const Lenis = lenisModule.default;
        const ScrollTrigger = scrollTriggerModule.ScrollTrigger;

        // GSAP plugin'ini kaydet
        gsap.registerPlugin(ScrollTrigger);

        // Lenis instance oluştur (optimize edilmiş ayarlar)
        const lenis = new Lenis({
          duration: 0.9,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: "vertical",
          gestureOrientation: "vertical",
          smoothWheel: true,
          wheelMultiplier: 0.9,
          touchMultiplier: 1.5,
          infinite: false,
          autoResize: true,
          syncTouch: false,
        });

        if (cancelled) {
          lenis.destroy();
          return;
        }

        lenisRef.current = lenis;
        setLenisInstance(lenis);

        // ScrollTrigger entegrasyonu
        lenis.on("scroll", ScrollTrigger.update);

        // GSAP ticker ile senkronizasyon
        const updatePhysics = (time: number) => {
          lenis.raf(time * 1000);
        };
        gsap.ticker.add(updatePhysics);
        gsap.ticker.lagSmoothing(0);

        // Cleanup function tanımla
        cleanup = () => {
          gsap.ticker.remove(updatePhysics);
          lenis.destroy();
          lenisRef.current = null;
          setLenisInstance(null);
        };
      } catch (error) {
        console.error("[Lenis] Failed to initialize smooth scroll", error);
      }
    };

    initLenis();

    // useEffect cleanup
    return () => {
      cancelled = true;
      if (cleanup) cleanup();
    };
  }, [isMobile]);

  // Route değişiminde scroll reset
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      // Mobilde veya Lenis yüklenmemişse native scroll
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return <>{children}</>;
}
