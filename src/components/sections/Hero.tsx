"use client";

/**
 * Hero Section - Vanta.js Dynamic Import ile Optimize Edilmiş
 */

import React, { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import gsap from "gsap";
import Button from "@/components/ui/Button";

// Vanta'yı lazy load (SSR devre dışı)
const VantaPageBackground = dynamic(
  () => import("@/components/ui/VantaPageBackground"),
  {
    ssr: false,
    loading: () => null,
  }
);

export default function Hero() {
  const t = useTranslations("hero");
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 2.8 });
      tl.from("[data-hero-animate]", {
        opacity: 0,
        y: 30,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
        immediateRender: false,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 bg-black"
    >
      <VantaPageBackground loadDelay={3000} />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 text-center relative z-10 py-20">
        {/* Badge */}
        <div data-hero-animate>
          <span className="badge badge-primary mb-8 text-[13px]">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            {t("badge")}
          </span>
        </div>

        {/* Heading */}
        <h1
          data-hero-animate
          className="text-4xl md:text-5xl lg:text-[64px] font-heading font-bold leading-[1.1] text-white max-w-4xl mx-auto mb-6"
        >
          {t("title")} <span className="text-gradient">{t("titleHighlight")}</span>
        </h1>

        {/* Subtext */}
        <p
          data-hero-animate
          className="text-gray-text text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          {t("subtitle")}
        </p>

        {/* CTAs */}
        <div data-hero-animate className="flex flex-wrap items-center justify-center gap-4">
          <Button href="/contact" variant="primary">
            {t("cta")}
          </Button>
          <Button href="/#services" variant="outline">
            {t("viewWork")}
          </Button>
        </div>

        {/* Trust */}
        <p data-hero-animate className="text-gray text-[13px] mt-12">
          {t("trust")}
        </p>
      </div>
    </section>
  );
}
