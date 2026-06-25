"use client";

import React, { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { 
  Code,
  Gauge,
  Brain
} from "lucide-react";
import Button from "@/components/ui/Button";

gsap.registerPlugin(ScrollTrigger);

const statIcons = [Code, Gauge, Brain];

export default function About() {
  const t = useTranslations('about');
  const containerRef = useRef<HTMLDivElement>(null);

  const stats = [
    { 
      title: t('stats.modular.title'), 
      desc: t('stats.modular.desc'),
      icon: Code 
    },
    { 
      title: t('stats.performance.title'), 
      desc: t('stats.performance.desc'),
      icon: Gauge 
    },
    { 
      title: t('stats.scalable.title'), 
      desc: t('stats.scalable.desc'),
      icon: Brain 
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".about-hero-animate", {
        opacity: 0,
        y: 30, // 40'tan 30'a düşürüldü
        duration: 0.6, // 0.8'den 0.6'ya düşürüldü
        stagger: 0.1, // 0.15'ten 0.1'e düşürüldü
        ease: "power2.out", // power3'ten power2'ye değiştirildi
      });

      gsap.from(".who-we-are-animate", {
        opacity: 0,
        y: 25, // 30'dan 25'e düşürüldü
        duration: 0.5, // 0.7'den 0.5'e düşürüldü
        stagger: 0.1, // 0.15'ten 0.1'e düşürüldü
        ease: "power2.out", // power3'ten power2'ye değiştirildi
        scrollTrigger: {
          trigger: ".who-we-are-trigger",
          start: "top 80%",
          toggleActions: "play none none reverse",
          fastScrollEnd: true,
          preventOverlaps: true,
        }
      });

      gsap.from(".cta-animate", {
        opacity: 0,
        y: 25, // 30'dan 25'e düşürüldü
        duration: 0.6, // 0.8'den 0.6'ya düşürüldü
        ease: "power2.out", // power3'ten power2'ye değiştirildi
        scrollTrigger: {
          trigger: ".cta-trigger",
          start: "top 85%",
          toggleActions: "play none none reverse",
          fastScrollEnd: true,
          preventOverlaps: true,
        }
      });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full relative overflow-hidden bg-dark">
      {/* Background Glowing Blobs */}
      <div className="glow-blob top-0 right-[-150px] opacity-40" />
      <div className="glow-blob top-[30%] left-[-200px] opacity-30" />
      <div className="glow-blob bottom-10 right-[-100px] opacity-25" />

      {/* 1. Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-16 md:pb-28 z-10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 text-center">
          <span className="badge badge-primary mb-6 about-hero-animate">
            {t('badge')}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-[56px] font-heading font-bold leading-[1.1] mb-6 max-w-4xl mx-auto about-hero-animate">
            <span className="text-gradient">{t('title')}</span>
            <br />
            {t('titleSuffix')}
          </h1>
          <p className="text-gray-text text-base md:text-lg max-w-3xl mx-auto mb-8 leading-relaxed about-hero-animate">
            {t('description')}
          </p>
          <div className="flex flex-wrap justify-center gap-4 about-hero-animate">
            <Button href="/contact" variant="primary" showArrow className="px-7 py-3.5">
              {t('ctaPrimary')}
            </Button>
            <Button href="/portfolio" variant="outline" className="px-7 py-3.5">
              {t('ctaSecondary')}
            </Button>
          </div>

          {/* Tech/Trust row */}
          <div className="mt-20 text-center about-hero-animate">
            <p className="text-xs uppercase tracking-widest text-gray-light font-bold mb-6">{t('techTitle')}</p>
            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 opacity-30 select-none">
              <span className="text-sm font-bold tracking-widest text-white">REACT</span>
              <span className="text-sm font-bold tracking-widest text-white">NEXT.JS</span>
              <span className="text-sm font-bold tracking-widest text-white">NODE.JS</span>
              <span className="text-sm font-bold tracking-widest text-white">PYTHON</span>
              <span className="text-sm font-bold tracking-widest text-white">STRAPI</span>
              <span className="text-sm font-bold tracking-widest text-white">GSAP</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Who We Are Section */}
      <section className="who-we-are-trigger relative py-20 md:py-28 border-t border-dark-border/40 z-10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Col - Text */}
            <div className="lg:col-span-7 space-y-6 who-we-are-animate">
              <span className="badge">
                {t('whoWeAre.badge')}
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-white leading-tight">
                {t('whoWeAre.title')}
              </h2>
              <p className="text-gray-text text-base leading-relaxed">
                {t('whoWeAre.description1')}
              </p>
              <p className="text-gray-text text-base leading-relaxed">
                {t('whoWeAre.description2')}
              </p>
            </div>

            {/* Right Col - Stats Cards */}
            <div className="lg:col-span-5 space-y-4 who-we-are-animate">
              {stats.map((s, idx) => {
                const IconComponent = s.icon;
                return (
                  <div key={idx} className="card card-glow p-6 flex gap-4 items-start">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-white shrink-0">
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base font-heading font-bold text-white mb-1">{s.title}</h3>
                      <p className="text-[13px] text-gray-text leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* 5. CTA Section */}
      <section className="cta-trigger relative py-20 md:py-28 border-t border-dark-border/40 z-10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="cta-animate card card-glow p-8 md:p-16 relative overflow-hidden text-center max-w-[1000px] mx-auto">
            <div className="glow-blob top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20" />
            <span className="badge badge-primary mb-6">{t('cta.badge')}</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-6 max-w-2xl mx-auto leading-tight">
              {t('cta.title')}
            </h2>
            <p className="text-gray-text text-sm md:text-base max-w-xl mx-auto mb-8 leading-relaxed">
              {t('cta.description')}
            </p>
            <div className="flex justify-center">
              <Button href="/contact" variant="primary" showArrow className="px-8 py-4 text-base">
                {t('cta.button')}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
