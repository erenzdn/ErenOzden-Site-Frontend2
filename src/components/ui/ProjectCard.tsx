/**
 * Optimize Edilmiş Project Card Component
 * - GSAP ile smooth animasyon
 * - will-change optimizasyonu
 * - Reduced motion desteği
 * - Image optimization enabled
 */

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { ExternalLink } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface ProjectCardData {
  id: number;
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  technologies: string[];
  href: string;
}

interface ProjectCardProps {
  project: ProjectCardData;
  index: number;
  prefersReducedMotion?: boolean;
}

const GRADIENT_COLORS = [
  "from-neutral-700 to-neutral-900",
  "from-gray-700 to-black",
  "from-zinc-800 to-zinc-950",
  "from-stone-700 to-stone-900",
  "from-slate-700 to-slate-900",
];

export default function ProjectCard({
  project,
  index,
  prefersReducedMotion = false,
}: ProjectCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion || !cardRef.current) return;

    const card = cardRef.current;

    // will-change optimizasyonu
    card.style.willChange = "opacity, transform";

    const ctx = gsap.context(() => {
      gsap.from(card, {
        opacity: 0,
        y: 20,
        duration: 0.4,
        delay: index * 0.06, // Stagger effect
        ease: "power2.out",
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          toggleActions: "play none none none",
          fastScrollEnd: true,
          once: true,
        },
        onComplete: () => {
          // Animasyon bitince will-change temizle
          card.style.willChange = "auto";
        },
      });
    });

    return () => {
      ctx.revert();
      card.style.willChange = "auto";
    };
  }, [index, prefersReducedMotion]);

  return (
    <Link
      ref={cardRef}
      href={project.href}
      className="project-card card card-glow overflow-hidden group block cursor-pointer w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-[380px] shrink-0"
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        {project.imageUrl && !imageError ? (
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority={index < 6}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
            quality={85}
            onError={() => setImageError(true)}
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${GRADIENT_COLORS[index % GRADIENT_COLORS.length]} flex items-center justify-center`}
          >
            <span className="text-white/40 text-4xl font-heading font-bold">
              {project.title[0]}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-base font-heading font-bold text-white mb-2 group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        <p className="text-gray-text text-sm leading-relaxed mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 text-[11px] bg-dark-lighter border border-dark-border rounded-full text-gray-light"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* CTA */}
        <span className="inline-flex items-center gap-1.5 text-primary text-sm font-medium">
          View Details <ExternalLink size={13} />
        </span>
      </div>
    </Link>
  );
}
