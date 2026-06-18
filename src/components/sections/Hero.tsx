"use client";

import React, { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import Button from "@/components/ui/Button";
import { createVantaCellsEffect } from "@/lib/vantaLoader";

export default function Hero() {
  const t = useTranslations('hero');
  const sectionRef = useRef<HTMLElement>(null);
  const vantaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 2.2 });
      tl.from("[data-hero-animate]", {
        opacity: 0,
        y: 30,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    let effect: ReturnType<typeof createVantaCellsEffect> extends Promise<infer T> ? T : never = null;
    let cancelled = false;

    (async () => {
      const instance = await createVantaCellsEffect(vantaRef.current, {});
      if (cancelled) {
        if (instance?.destroy) instance.destroy();
        return;
      }
      if (!instance) return;
      effect = instance;
    })();

    return () => {
      cancelled = true;
      if (effect?.destroy) effect.destroy();
    };
  }, []);

  return (
    <section ref={sectionRef} id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 bg-black">
      {/* Vanta Cells Interactive 3D Animated Background */}
      <div 
        ref={vantaRef} 
        className="absolute inset-0 z-0 opacity-25 transition-opacity duration-1000" 
      />

      {/* Subtle overlay gradient to ensure high-contrast readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black z-0 pointer-events-none" />

      {/* Background glow blob */}
      <div className="glow-blob top-[-200px] left-1/2 -translate-x-1/2 opacity-60 z-0 pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-6 text-center relative z-10 py-20">
        {/* Badge */}
        <div data-hero-animate>
          <span className="badge badge-primary mb-8 text-[13px]">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            {t('badge')}
          </span>
        </div>

        {/* Heading */}
        <h1 data-hero-animate className="text-4xl md:text-5xl lg:text-[64px] font-heading font-bold leading-[1.1] text-white max-w-4xl mx-auto mb-6">
          {t('title')}{" "}
          <span className="text-gradient">{t('titleHighlight')}</span>
        </h1>

        {/* Subtext */}
        <p data-hero-animate className="text-gray-text text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          {t('subtitle')}
        </p>

        {/* CTAs */}
        <div data-hero-animate className="flex flex-wrap items-center justify-center gap-4">
          <Button href="/contact" variant="primary">{t('cta')}</Button>
          <Button href="/#services" variant="outline">{t('viewWork')}</Button>
        </div>

        {/* Trust */}
        <p data-hero-animate className="text-gray text-[13px] mt-12">
          {t('trust')}
        </p>
      </div>
    </section>
  );
}
