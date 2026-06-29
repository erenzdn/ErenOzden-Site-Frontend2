"use client";

import React, { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Smartphone, Globe, Bot, Layers, Code, LucideIcon } from "lucide-react";
import { Link } from "@/i18n/routing";
import SectionTitle from "@/components/ui/SectionTitle";
import { type Locale } from "@/i18n/routing";
import { loadStrapiCollection, strapiRouteKey } from "@/lib/strapi";

gsap.registerPlugin(ScrollTrigger);

interface StrapiService {
  documentId: string;
  slug?: string | null;
  title: string;
  description: string;
  iconName: string;
  order: number;
  features: string[];
}

const iconMap: Record<string, LucideIcon> = {
  Smartphone: Smartphone,
  Globe: Globe,
  auto: Bot,
  process: Layers,
};

export default function Services() {
  const locale = useLocale() as Locale;
  const t = useTranslations('services');
  const sectionRef = useRef<HTMLElement>(null);
  const [services, setServices] = useState<StrapiService[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      const items = await loadStrapiCollection<StrapiService>(
        "/api/services",
        locale,
        { sort: "order:asc" }
      );
      setServices(items);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [locale]);

  useEffect(() => {
    if (loading) return;
    
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    const ctx = gsap.context(() => {
      // Mobil kontrolü
      const isMobile = window.innerWidth < 768;
      
      gsap.from(".service-card", {
        opacity: 0,
        y: isMobile ? 60 : 30, // Mobilde daha fazla hareket
        scale: isMobile ? 0.92 : 1, // Mobilde scale efekti eklendi
        duration: isMobile ? 0.8 : 0.5, // Mobilde daha yavaş animasyon
        stagger: isMobile ? 0.15 : 0.08, // Mobilde daha belirgin stagger
        ease: "power3.out", // Daha yumuşak animasyon
        clearProps: "all",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: isMobile ? "top 90%" : "top 85%", // Mobilde daha geç başlasın
          toggleActions: "play none none reverse",
          fastScrollEnd: true,
          preventOverlaps: true,
        },
      });
    }, sectionRef);
    
    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, [loading]);

  return (
    <section ref={sectionRef} id="services" className="section-padding relative overflow-hidden w-full flex flex-col items-center">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-[1200px] w-full relative z-10">
        <SectionTitle 
          subtitle={t('subtitle')} 
          title={t('title')} 
          description={t('description')} 
          align="center" 
        />
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full justify-center">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="card animate-pulse h-[300px]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full justify-center">
            {services.map((s) => {
              const Icon = iconMap[s.iconName] || Code;
              return (
                <Link 
                  href={`/services/${strapiRouteKey(s)}`} 
                  key={s.documentId} 
                  className="service-card service-card-premium card p-7 flex flex-col group cursor-pointer relative"
                >
                  {/* Animated gradient overlay */}
                  <div className="absolute inset-0 bg-linear-to-br from-white/0 via-gray-400/0 to-white/0 group-hover:from-white/5 group-hover:via-gray-400/5 group-hover:to-white/5 transition-all duration-700 rounded-xl pointer-events-none" />
                  
                  {/* Content wrapper */}
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-5">
                      <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center transition-all duration-500 group-hover:bg-linear-to-br group-hover:from-white/30 group-hover:to-gray-300/30 group-hover:border-white/70 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] group-hover:scale-110">
                        <Icon size={22} className="text-white transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" />
                      </div>
                      <div className="w-8 h-8 rounded-full bg-dark border border-dark-border flex items-center justify-center transition-all duration-500 group-hover:bg-linear-to-r group-hover:from-gray-200 group-hover:to-white group-hover:text-dark group-hover:border-transparent group-hover:shadow-[0_0_15px_rgba(255,255,255,0.6)] group-hover:rotate-45 group-hover:scale-110">
                        <ArrowRight size={14} className="transition-transform duration-500" />
                      </div>
                    </div>
                    <h3 className="text-lg font-heading font-bold text-white mb-2 transition-all duration-500 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-white group-hover:via-gray-100 group-hover:to-gray-200">{s.title}</h3>
                    <p className="text-gray-text text-sm leading-relaxed mb-5 flex-1 line-clamp-3 transition-all duration-500 group-hover:text-gray-200">{s.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {s.features?.slice(0, 3).map((f, idx) => (
                        <span 
                          key={f} 
                          className="px-2.5 py-1 text-[11px] bg-dark-lighter border border-dark-border rounded-full text-gray-light truncate max-w-full transition-all duration-500 group-hover:bg-linear-to-r group-hover:from-gray-800/60 group-hover:to-gray-700/60 group-hover:border-gray-400/50 group-hover:text-gray-100 group-hover:shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                          style={{ 
                            transitionDelay: `${idx * 50}ms` 
                          }}
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
