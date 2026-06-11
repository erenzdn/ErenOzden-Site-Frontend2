"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import { apiClient, normalizeStrapiData, resolveStrapiUrl } from "@/lib/apiClient";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface StrapiRichText { type: string; children: { text: string }[] }
interface StrapiProject {
  id: number; documentId?: string; title?: string; description?: string | StrapiRichText[];
  image?: { url?: string; formats?: { medium?: { url?: string } } };
  thumbnail?: { url?: string; formats?: { medium?: { url?: string } } };
  technologies?: string | string[]; techStack?: string | string[]; 
  projectUrl?: string; liveUrl?: string; githubUrl?: string;
}
interface Project {
  id: number; documentId: string; title: string; description: string;
  imageUrl: string; technologies: string[]; projectUrl: string; githubUrl: string;
}

const GRADIENT_COLORS = [
  "from-neutral-700 to-neutral-900", "from-gray-700 to-black",
  "from-zinc-800 to-zinc-950", "from-stone-700 to-stone-900", "from-slate-700 to-slate-900",
];

function extractPlainText(rt: StrapiRichText[]): string {
  return rt.map((b) => b.children?.map((c) => c.text).join("") || "").join(" ");
}

function parseProject(item: StrapiProject): Project {
  const a = item as unknown as Record<string, unknown>;
  const title = (a.title as string) || "Proje";
  const documentId = (a.documentId as string) || String(a.id);
  
  let description = "";
  if (typeof a.description === "string") description = a.description;
  else if (Array.isArray(a.description)) description = extractPlainText(a.description as StrapiRichText[]);
  
  let imageUrl = "";
  const img = (a.thumbnail || a.image) as StrapiProject["image"];
  imageUrl = resolveStrapiUrl(img?.formats?.medium?.url || img?.url);
  
  let technologies: string[] = [];
  const tech = a.techStack || a.technologies;
  if (typeof tech === "string") technologies = tech.split(",").map((t) => (t as string).trim());
  else if (Array.isArray(tech)) technologies = tech as string[];
  
  return { 
    id: item.id, 
    documentId, 
    title, 
    description, 
    imageUrl, 
    technologies, 
    projectUrl: (a.liveUrl as string) || (a.projectUrl as string) || "#", 
    githubUrl: (a.githubUrl as string) || "#" 
  };
}

interface PortfolioProps {
  isHome?: boolean;
}

export default function Portfolio({ isHome = false }: PortfolioProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  const fetchProjects = async () => {
    try {
      setLoading(true); setError(null);
      const res = await apiClient.get("/api/projects", {
        params: { populate: "*" },
      });
      const normalized = normalizeStrapiData(res);
      setProjects((Array.isArray(normalized) ? normalized : []).map(parseProject));
    } catch { setError("Projeler yüklenirken bir hata oluştu."); } finally { setLoading(false); }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProjects();
  }, []);

  useEffect(() => {
    if (loading || error || isHome) return;

    // Veriler yüklendikten sonra sayfa yüksekliği değiştiği için ScrollTrigger hesaplamalarını yeniliyoruz.
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    const ctx = gsap.context(() => {
      gsap.from(".project-card", {
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
  }, [loading, error, isHome]);

  // Sticky Scroll Reveal için veriyi hazırlıyoruz
  const stickyContent = projects.map((p, idx) => ({
    title: p.title,
    description: p.description,
    content: (
      <div className="flex h-full w-full items-center justify-center text-white relative">
        {p.imageUrl && !failedImages[p.id] ? (
          <Image 
            src={p.imageUrl} 
            alt={p.title} 
            fill 
            className="object-cover"
            sizes="(max-w-768px) 100vw, 400px"
            onError={() => {
              setFailedImages(prev => ({ ...prev, [p.id]: true }));
            }}
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${GRADIENT_COLORS[idx % GRADIENT_COLORS.length]} flex items-center justify-center`}>
            <span className="text-white/40 text-4xl font-heading font-bold">{p.title[0]}</span>
          </div>
        )}
      </div>
    )
  }));

  return (
    <section 
      ref={sectionRef} 
      id="portfolio" 
      className={cn(
        "relative overflow-hidden w-full flex flex-col items-center",
        isHome ? "" : "section-padding"
      )}
    >
      <div className={cn(
        "container mx-auto px-4 md:px-6 lg:px-8 max-w-[1200px] w-full relative z-10",
        isHome ? "py-0" : ""
      )}>
        {!isHome && (
          <SectionTitle subtitle="Projeler" title="Son Çalışmalarım" description="Gerçekleştirdiğim projelerden örnekler." align="center" />
        )}

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6 w-full justify-center">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card animate-pulse"><div className="h-48 bg-dark-lighter rounded-t-2xl" /><div className="p-6 space-y-3"><div className="h-4 bg-dark-lighter rounded w-3/4" /><div className="h-3 bg-dark-lighter rounded w-full" /></div></div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center mt-8 space-y-4 w-full">
            <p className="text-gray-text">{error}</p>
            <button onClick={fetchProjects} className="px-6 py-2 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary-dark transition-colors cursor-pointer">Tekrar Dene</button>
          </div>
        )}

        {!loading && !error && (
          isHome ? (
            // Ana Sayfada Sticky Scroll Reveal tasarımı
            <div className="w-full py-4 relative z-20">
              {stickyContent.length > 0 ? (
                <StickyScroll content={stickyContent} />
              ) : (
                <p className="text-center text-gray-text">Henüz proje eklenmemiş.</p>
              )}
            </div>
          ) : (
            // Projeler Alt Sayfasında Standart Grid tasarımı (Filtreleme ve detaylar için en iyisi)
            <div className="flex flex-wrap justify-center gap-6 w-full">
              {projects.map((p, idx) => (
                <Link 
                  href={`/portfolio/${p.documentId}`} 
                  key={p.id} 
                  className="project-card card card-glow overflow-hidden group block cursor-pointer w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-[380px] shrink-0"
                >
                  <div className="relative h-48 overflow-hidden">
                    {p.imageUrl && !failedImages[p.id] ? (
                      <Image 
                        src={p.imageUrl} 
                        alt={p.title} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-500" 
                        onError={() => {
                          setFailedImages(prev => ({ ...prev, [p.id]: true }));
                        }}
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${GRADIENT_COLORS[idx % GRADIENT_COLORS.length]} flex items-center justify-center`}>
                        <span className="text-white/40 text-4xl font-heading font-bold">{p.title[0]}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-base font-heading font-bold text-white mb-2 group-hover:text-primary transition-colors">{p.title}</h3>
                    <p className="text-gray-text text-sm leading-relaxed mb-4 line-clamp-2">{p.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {p.technologies.map((t) => <span key={t} className="px-2 py-0.5 text-[11px] bg-dark-lighter border border-dark-border rounded-full text-gray-light">{t}</span>)}
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-primary text-sm font-medium">
                      Detayları İncele <ExternalLink size={13} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )
        )}
      </div>
    </section>
  );
}
