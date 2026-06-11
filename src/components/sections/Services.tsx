"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Smartphone, Globe, Bot, Layers, Code, LucideIcon } from "lucide-react";
import Link from "next/link";
import SectionTitle from "@/components/ui/SectionTitle";
import { apiClient, normalizeStrapiData } from "@/lib/apiClient";

gsap.registerPlugin(ScrollTrigger);

interface StrapiService {
  documentId: string;
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
  const sectionRef = useRef<HTMLElement>(null);
  const [services, setServices] = useState<StrapiService[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      const res = await apiClient.get("/api/services", {
        params: { sort: "order:asc" },
      });
      const normalized = normalizeStrapiData(res);
      setServices(normalized || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchServices();
  }, []);

  useEffect(() => {
    if (loading) return;
    
    // Veriler yüklendikten sonra sayfa yüksekliği değiştiği için ScrollTrigger hesaplamalarını yeniliyoruz.
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    const ctx = gsap.context(() => {
      gsap.from(".service-card", {
        opacity: 0,
        y: 50,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
        clearProps: "all", // Animasyon bittikten sonra tüm inline CSS'leri temizleyerek silik görünümü önler
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [loading]);

  return (
    <section ref={sectionRef} id="services" className="section-padding relative overflow-hidden w-full flex flex-col items-center">
      <div className="glow-blob bottom-[-100px] left-[-200px]" />
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-[1200px] w-full relative z-10">
        <SectionTitle subtitle="Hizmetler" title="Neler Yapıyorum" description="İşletmelerin dijital dönüşümüne yardımcı olan profesyonel yazılım hizmetleri sunuyorum. Detaylar için kartlara tıklayın." align="center" />
        
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
                <Link href={`/services/${s.documentId}`} key={s.documentId} className="service-card card card-glow p-7 flex flex-col group cursor-pointer">
                  <div className="flex justify-between items-start mb-5">
                    <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                      <Icon size={22} className="text-white" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-dark border border-dark-border flex items-center justify-center group-hover:bg-white group-hover:text-dark transition-colors">
                      <ArrowRight size={14} />
                    </div>
                  </div>
                  <h3 className="text-lg font-heading font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-gray-text text-sm leading-relaxed mb-5 flex-1 line-clamp-3">{s.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {s.features?.slice(0, 3).map((f) => (
                      <span key={f} className="px-2.5 py-1 text-[11px] bg-dark-lighter border border-dark-border rounded-full text-gray-light truncate max-w-full">{f}</span>
                    ))}
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
