"use client";

/**
 * Portfolio Client Component (Optimized)
 * - Server'dan gelen veriyi props ile alır
 * - GSAP animasyonları optimize edilmiş (will-change, reduced-motion)
 * - Image optimization enabled (unoptimized kaldırıldı)
 */

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { ExternalLink } from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import { strapiRouteKey } from "@/lib/strapi";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface Project {
  id: number;
  documentId: string;
  slug?: string;
  title: string;
  description: string;
  imageUrl: string;
  technologies: string[];
  projectUrl: string;
  githubUrl: string;
}

interface PortfolioClientProps {
  projects: Project[];
  isHome?: boolean;
}

const GRADIENT_COLORS = [
  "from-neutral-700 to-neutral-900",
  "from-gray-700 to-black",
  "from-zinc-800 to-zinc-950",
  "from-stone-700 to-stone-900",
  "from-slate-700 to-slate-900",
];

export default function PortfolioClient({ projects, isHome = false }: PortfolioClientProps) {
  const t = useTranslations("portfolio");
  const sectionRef = useRef<HTMLElement>(null);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Reduced motion kontrolü
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // GSAP animasyonları (optimize edilmiş)
  useEffect(() => {
    if (prefersReducedMotion || isHome || projects.length === 0) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".project-card");
      if (cards.length === 0) return;

      // will-change optimizasyonu
      cards.forEach((card) => {
        card.style.willChange = "opacity, transform";
      });

      gsap.from(cards, {
        opacity: 0,
        y: 20, // 30'dan 20'ye düşürüldü
        duration: 0.4, // 0.5'ten 0.4'e düşürüldü
        stagger: 0.06, // 0.08'den 0.06'ya düşürüldü
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
          fastScrollEnd: true,
          preventOverlaps: true,
          once: true, // Sadece 1 kere çalış
        },
        onComplete: () => {
          // Animasyon bitince will-change'i temizle
          cards.forEach((card) => {
            card.style.willChange = "auto";
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion, isHome, projects]);

  // StickyScroll için content memoization
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
                quality={85}
                priority={idx < 2}
                onError={() => {
                  setFailedImages((prev) => ({ ...prev, [p.id]: true }));
                }}
              />
            ) : (
              <div
                className={`w-full h-full bg-gradient-to-br ${GRADIENT_COLORS[idx % GRADIENT_COLORS.length]} flex items-center justify-center`}
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

  if (projects.length === 0) {
    return (
      <section className="section-padding">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-text py-20">{t("noProjects")}</p>
        </div>
      </section>
    );
  }

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
        <StickyScroll
          content={stickyContent}
          sectionLabel={t("subtitle")}
          sectionTitle={t("title")}
          featuredLabel={t("featuredLabel")}
          viewDetailsLabel={t("viewDetails")}
        />
      ) : (
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-[1200px] w-full relative z-10">
          <SectionTitle
            subtitle={t("subtitle")}
            title={t("title")}
            description={t("description")}
            align="center"
          />

          <div className="flex flex-wrap justify-center gap-6 w-full mt-12">
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
                      priority={idx < 6}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                      quality={85}
                      onError={() => {
                        setFailedImages((prev) => ({ ...prev, [p.id]: true }));
                      }}
                    />
                  ) : (
                    <div
                      className={`w-full h-full bg-gradient-to-br ${GRADIENT_COLORS[idx % GRADIENT_COLORS.length]} flex items-center justify-center`}
                    >
                      <span className="text-white/40 text-4xl font-heading font-bold">
                        {p.title[0]}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-base font-heading font-bold text-white mb-2 group-hover:text-primary transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-gray-text text-sm leading-relaxed mb-4 line-clamp-2">
                    {p.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {p.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 text-[11px] bg-dark-lighter border border-dark-border rounded-full text-gray-light"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-primary text-sm font-medium">
                    {t("viewDetails")} <ExternalLink size={13} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
