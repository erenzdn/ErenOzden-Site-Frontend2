"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { ExternalLink } from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import { StackedCards3D } from "@/components/ui/stacked-cards-3d";
import {
  extractStrapiPlainText,
  loadStrapiCollection,
  pickStrapiImageUrl,
  strapiRouteKey,
  type StrapiRichTextBlock,
} from "@/lib/strapi";
import { type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface StrapiProject {
  id: number; documentId?: string; slug?: string; title?: string;
  description?: string | StrapiRichTextBlock[];
  image?: { url?: string; formats?: { medium?: { url?: string }; small?: { url?: string } } };
  thumbnail?: { url?: string; formats?: { medium?: { url?: string }; small?: { url?: string } } };
  technologies?: string | string[]; techStack?: string | string[] | null;
  projectUrl?: string; liveUrl?: string; githubUrl?: string;
}
interface Project {
  id: number; documentId: string; slug?: string; title: string; description: string;
  imageUrl: string; technologies: string[]; projectUrl: string; githubUrl: string;
}

const GRADIENT_COLORS = [
  "from-neutral-700 to-neutral-900", "from-gray-700 to-black",
  "from-zinc-800 to-zinc-950", "from-stone-700 to-stone-900", "from-slate-700 to-slate-900",
];

function parseProject(item: StrapiProject, defaultTitle: string): Project {
  const a = item as unknown as Record<string, unknown>;
  const title = (a.title as string) || defaultTitle;
  const documentId = (a.documentId as string) || String(a.id);
  
  const description = extractStrapiPlainText(a.description as string | StrapiRichTextBlock[]);
  const imageUrl = pickStrapiImageUrl((a.thumbnail || a.image) as StrapiProject["thumbnail"]);
  
  let technologies: string[] = [];
  const tech = a.techStack || a.technologies;
  if (typeof tech === "string") technologies = tech.split(",").map((t) => (t as string).trim());
  else if (Array.isArray(tech)) technologies = tech as string[];
  
  return { 
    id: item.id, 
    documentId,
    slug: a.slug as string | undefined,
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
  const locale = useLocale() as Locale;
  const t = useTranslations('portfolio');
  const sectionRef = useRef<HTMLElement>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  const fetchProjects = async () => {
    try {
      setLoading(true); setError(null);
      const items = await loadStrapiCollection<StrapiProject>(
        "/api/projects",
        locale,
        { populate: "*" }
      );
      setProjects(items.map((item) => parseProject(item, t('defaultTitle'))));
    } catch { setError(t('errorLoading')); } finally { setLoading(false); }
  };

  useEffect(() => {
    fetchProjects();
  }, [locale]);

  useEffect(() => {
    if (loading || error || isHome) return;

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    const ctx = gsap.context(() => {
      gsap.from(".project-card", {
        opacity: 0,
        y: 30, // 50'den 30'a düşürüldü
        duration: 0.5, // 0.7'den 0.5'e düşürüldü
        stagger: 0.08, // 0.12'den 0.08'e düşürüldü
        ease: "power2.out", // power3'ten power2'ye değiştirildi
        clearProps: "all",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
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
  }, [loading, error, isHome]);

  const stickyContent = useMemo(
    () =>
      projects.map((p, idx) => ({
        title: p.title,
        description: p.description,
        href: `/portfolio/${strapiRouteKey(p)}`,
        technologies: p.technologies,
        imageUrl: p.imageUrl,
        content: (
          <div className="flex h-full w-full items-center justify-center text-white relative">
            {p.imageUrl && !failedImages[p.id] ? (
              <Image
                src={p.imageUrl}
                alt={p.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 480px"
                unoptimized
                onError={() => {
                  setFailedImages((prev) => ({ ...prev, [p.id]: true }));
                }}
              />
            ) : (
              <div
                className={`w-full h-full bg-linear-to-br ${GRADIENT_COLORS[idx % GRADIENT_COLORS.length]} flex items-center justify-center`}
              >
                <span className="text-white/40 text-4xl font-heading font-bold">
                  {p.title[0]}
                </span>
              </div>
            )}
          </div>
        ),
      })),
    [projects, failedImages]
  );

  return (
    <section 
      ref={sectionRef} 
      id="portfolio" 
      className={cn(
        "relative w-full flex flex-col items-center",
        isHome ? "overflow-visible z-10" : "overflow-hidden section-padding"
      )}
    >
      {isHome ? (
        <>
          {loading && (
            <div className="w-full min-h-screen flex items-center justify-center py-20">
              <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="relative group">
                      <div className="absolute -inset-0.5 bg-linear-to-r from-primary/20 via-purple-500/20 to-primary/20 rounded-3xl blur-xl animate-pulse" />
                      <div className="relative bg-linear-to-br from-dark-lighter/80 to-dark/80 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10">
                        <div className="h-64 md:h-80 bg-linear-to-br from-dark-lighter to-dark animate-pulse" />
                        <div className="p-6 md:p-8 space-y-4">
                          <div className="h-8 bg-dark-lighter/50 rounded-xl w-3/4 animate-pulse" />
                          <div className="space-y-2">
                            <div className="h-4 bg-dark-lighter/50 rounded-lg w-full animate-pulse" />
                            <div className="h-4 bg-dark-lighter/50 rounded-lg w-5/6 animate-pulse" />
                          </div>
                          <div className="flex gap-2">
                            {[1, 2, 3].map((j) => (
                              <div key={j} className="h-7 w-16 bg-dark-lighter/50 rounded-full animate-pulse" />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="text-center py-32 space-y-6 w-full px-4">
              <div className="inline-flex p-4 rounded-2xl bg-red-500/10 border border-red-500/20 backdrop-blur-sm">
                <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-heading font-bold text-white mb-2">Oops! Something went wrong</h3>
                <p className="text-gray-text">{error}</p>
              </div>
              <button 
                onClick={fetchProjects} 
                className="group px-8 py-3 bg-linear-to-r from-primary to-purple-600 text-white rounded-full text-sm font-medium hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 cursor-pointer inline-flex items-center gap-2"
              >
                <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {t('retry')}
              </button>
            </div>
          )}

          {!loading && !error && (
            stickyContent.length > 0 ? (
              <StickyScroll
                content={stickyContent}
                sectionLabel={t("subtitle")}
                sectionTitle={t("title")}
                featuredLabel={t("featuredLabel")}
                viewDetailsLabel={t("viewDetails")}
              />
            ) : (
              <p className="text-center text-gray-text py-20">{t('noProjects')}</p>
            )
          )}
        </>
      ) : (
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-[1200px] w-full relative z-10">
        <SectionTitle 
          subtitle={t('subtitle')} 
          title={t('title')} 
          description={t('description')} 
          align="center" 
        />

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
            <button onClick={fetchProjects} className="px-6 py-2 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary-dark transition-colors cursor-pointer">{t('retry')}</button>
          </div>
        )}

        {!loading && !error && (
            <div className="flex flex-wrap justify-center gap-6 w-full">
              {projects.map((p, idx) => (
                <Link 
                  href={`/portfolio/${strapiRouteKey(p)}`} 
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
            priority={idx < 3}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
            unoptimized
            onError={() => {
              setFailedImages(prev => ({ ...prev, [p.id]: true }));
            }}
          />
                    ) : (
                      <div className={`w-full h-full bg-linear-to-br ${GRADIENT_COLORS[idx % GRADIENT_COLORS.length]} flex items-center justify-center`}>
                        <span className="text-white/40 text-4xl font-heading font-bold">{p.title[0]}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-base font-heading font-bold text-white mb-2 group-hover:text-primary transition-colors">{p.title}</h3>
                    <p className="text-gray-text text-sm leading-relaxed mb-4 line-clamp-2">{p.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {p.technologies.map((tech) => <span key={tech} className="px-2 py-0.5 text-[11px] bg-dark-lighter border border-dark-border rounded-full text-gray-light">{tech}</span>)}
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-primary text-sm font-medium">
                      {t('viewDetails')} <ExternalLink size={13} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
        )}
      </div>
      )}
    </section>
  );
}
