"use client";

/**
 * VantaPageBackground - Full Device Support (Optimized)
 * - Desktop: Full quality Vanta.js
 * - Mobile: Optimized Vanta.js (lower settings for performance)
 * - Battery-friendly: Reduced complexity on mobile
 */

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type VantaPageBackgroundProps = {
  /** Vanta yüklemesini geciktir (ms) */
  loadDelay?: number;
  className?: string;
};

export default function VantaPageBackground({
  loadDelay = 0,
  className,
}: VantaPageBackgroundProps) {
  const vantaRef = useRef<HTMLDivElement>(null);
  const [vantaLoaded, setVantaLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Mobil kontrolü (SSR-safe)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    let effect: { destroy?: () => void } | null = null;
    let cancelled = false;

    const timeoutId = setTimeout(async () => {
      if (cancelled) return;

      try {
        const { createVantaCellsEffect } = await import("@/lib/vantaLoader");
        if (cancelled) return;

        // Mobil ve Desktop için farklı ayarlar
        const options = isMobile
          ? {
              // Mobil: Optimize edilmiş ayarlar
              mouseControls: false, // Mouse kontrolü kapalı
              touchControls: true, // Touch kontrolü açık
              gyroControls: false, // Gyro kapalı (batarya tasarrufu)
              minHeight: 200,
              minWidth: 200,
              scale: 1.2, // Daha büyük ölçek (daha az parçacık)
              color1: 0x0,
              color2: 0xffffff,
              size: 1.2, // Daha büyük hücreler (daha az hesaplama)
              speed: 0.6, // Daha yavaş animasyon (30fps target)
            }
          : {
              // Desktop: Full quality
              mouseControls: true,
              touchControls: true,
              gyroControls: false,
              minHeight: 200,
              minWidth: 200,
              scale: 1,
              color1: 0x0,
              color2: 0xffffff,
              size: 1.0,
              speed: 1.0,
            };

        const instance = await createVantaCellsEffect(vantaRef.current, options);
        if (cancelled) {
          if (instance?.destroy) instance.destroy();
          return;
        }
        if (!instance) return;

        effect = instance;
        setVantaLoaded(true);
      } catch (error) {
        console.error("[Vanta] WebGL effect failed to load", error);
      }
    }, loadDelay);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
      if (effect?.destroy) {
        effect.destroy();
      }
    };
  }, [loadDelay, isMobile]);

  return (
    <div
      className={cn("absolute inset-0 z-0 pointer-events-none", className)}
      aria-hidden
    >
      {/* Vanta canvas (her iki modda da) */}
      <div
        ref={vantaRef}
        className={cn(
          "absolute inset-0 transition-opacity duration-1000",
          vantaLoaded ? (isMobile ? "opacity-15" : "opacity-20") : "opacity-0"
        )}
      />

      {/* Overlay gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black" />
      <div className="glow-blob top-[-200px] left-1/2 -translate-x-1/2 opacity-60" />
    </div>
  );
}
