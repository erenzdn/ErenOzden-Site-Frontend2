"use client";

import React, { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Button from "@/components/ui/Button";

gsap.registerPlugin(ScrollTrigger);

export default function CTA() {
  const t = useTranslations('cta');
  const sectionRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-cta-animate]", {
        opacity: 0, 
        y: 30, // 40'tan 30'a düşürüldü
        duration: 0.5, // 0.7'den 0.5'e düşürüldü
        stagger: 0.08, // 0.12'den 0.08'e düşürüldü
        ease: "power2.out", // power3'ten power2'ye değiştirildi
        scrollTrigger: { 
          trigger: sectionRef.current, 
          start: "top 75%", 
          toggleActions: "play none none reverse",
          fastScrollEnd: true,
          preventOverlaps: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 relative z-20 bg-dark">
      <div className="glow-blob top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 text-center relative z-10">
        <h2 data-cta-animate className="text-3xl md:text-4xl lg:text-[44px] font-heading font-bold text-white leading-[1.15] mb-5">
          {t('title')}
        </h2>
        <p data-cta-animate className="text-gray-text text-base mb-8 max-w-lg mx-auto">
          {t('subtitle')}
        </p>
        <div data-cta-animate className="flex flex-wrap items-center justify-center gap-4">
          <Button href="/contact" variant="primary">{t('button')}</Button>
          <Button href="/#portfolio" variant="outline">{t('secondary')}</Button>
        </div>
      </div>
    </section>
  );
}
