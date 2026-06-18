"use client";

import React, { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import {
  Code, Smartphone, Globe, Database, Cloud, Palette,
} from "lucide-react";

interface MarqueeProps {
  variant: "brands" | "categories";
}

const brands = [
  "React", "Next.js", "Node.js", "TypeScript", "Python",
  "PostgreSQL", "Docker", "AWS", "Figma",
];

const categoryIcons = {
  webDev: Globe,
  mobileDev: Smartphone,
  uiux: Palette,
  backend: Code,
  devops: Cloud,
  database: Database,
};

export default function Marquee({ variant }: MarqueeProps) {
  const t = useTranslations('marquee');
  const trackRef = useRef<HTMLDivElement>(null);

  const categories = [
    { label: t('categories.webDev'), icon: Globe },
    { label: t('categories.mobileDev'), icon: Smartphone },
    { label: t('categories.uiux'), icon: Palette },
    { label: t('categories.backend'), icon: Code },
    { label: t('categories.devops'), icon: Cloud },
    { label: t('categories.database'), icon: Database },
  ];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const width = track.scrollWidth / 2;
    const tween = gsap.to(track, {
      x: -width, duration: 40, ease: "none", repeat: -1,
    });
    return () => { tween.kill(); };
  }, []);

  if (variant === "brands") {
    const items = [...brands, ...brands, ...brands];
    return (
      <div className="py-10 overflow-hidden border-y border-dark-border bg-dark/50">
        <div ref={trackRef} className="flex items-center gap-16 w-max">
          {items.map((name, i) => (
            <span key={i} className="text-xl md:text-2xl font-heading font-bold text-dark-border hover:text-white transition-colors cursor-default whitespace-nowrap uppercase tracking-wider">
              {name}
            </span>
          ))}
        </div>
      </div>
    );
  }

  const items = [...categories, ...categories, ...categories];
  return (
    <div className="py-10 overflow-hidden border-y border-dark-border bg-dark/50">
      <div ref={trackRef} className="flex items-center gap-12 w-max">
        {items.map((cat, i) => {
          const Icon = cat.icon;
          return (
            <span key={i} className="flex items-center gap-3 px-6 py-3 rounded-full border border-dark-border text-gray-light font-body text-sm font-medium whitespace-nowrap hover:border-primary/50 hover:text-white transition-all bg-dark-card cursor-default">
              <Icon size={16} className="text-primary" />
              {cat.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
