"use client";

import { useEffect, useRef, ReactNode } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setLenisInstance } from "@/lib/lenisControls";
import "lenis/dist/lenis.css";

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // GSAP ile ScrollTrigger plugin'ini kaydet
    gsap.registerPlugin(ScrollTrigger);

    // Lenis pürüzsüz kaydırma motorunu başlat
    const lenis = new Lenis({
      duration: 1.0, // 1.2'den 1.0'a düşürüldü (daha hızlı)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0, // 1.05'ten 1.0'a düşürüldü (daha responsive)
      touchMultiplier: 1.5,
      infinite: false,
      autoResize: true,
      syncTouch: false, // Touch performansı için optimize edildi
    });

    lenisRef.current = lenis;
    setLenisInstance(lenis);

    // Her kaydırmada ScrollTrigger tetikleyicilerini güncelle
    lenis.on("scroll", ScrollTrigger.update);

    // GSAP ticker döngüsünü Lenis raf fonksiyonu ile senkronize et
    const updatePhysics = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updatePhysics);

    // GSAP'in lag dengeleme gecikmesini devre dışı bırakarak senkronizasyon kaymasını önle
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updatePhysics);
      lenis.destroy();
      lenisRef.current = null;
      setLenisInstance(null);
    };
  }, []);

  // Sayfa rotası her değiştiğinde pürüzsüzce veya anında yukarı kaydır
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  return <>{children}</>;
}
