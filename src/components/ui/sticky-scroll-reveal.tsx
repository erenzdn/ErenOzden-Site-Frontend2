"use client";
import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: {
    title: string;
    description: string;
    content?: React.ReactNode | any;
  }[];
  contentClassName?: string;
}) => {
  const [activeCard, setActiveCard] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Pinning and active card state update using GSAP ScrollTrigger
  useEffect(() => {
    if (content.length === 0 || !containerRef.current) return;

    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

    const ctx = gsap.context(() => {
      if (isDesktop) {
        // Desktop: Pinned full-screen showcase
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top top",
          end: `+=${content.length * 100}%`,
          pin: true,
          scrub: true,
          onUpdate: (self) => {
            const index = Math.min(
              Math.floor(self.progress * content.length),
              content.length - 1
            );
            setActiveCard(index);
          },
        });
      } else {
        // Mobile: Natural vertical scroll with index updates
        content.forEach((_, index) => {
          ScrollTrigger.create({
            trigger: containerRef.current,
            start: `top+=${index * 250} center`,
            end: `top+=${(index + 1) * 250} center`,
            onEnter: () => setActiveCard(index),
            onEnterBack: () => setActiveCard(index),
          });
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [content]);

  // GSAP animation to smoothly slide the content container vertically (Desktop only)
  useEffect(() => {
    if (!sliderRef.current) return;
    gsap.to(sliderRef.current, {
      yPercent: -activeCard * 100,
      duration: 0.65,
      ease: "power2.out",
    });
  }, [activeCard]);

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen lg:h-screen flex flex-col lg:flex-row justify-center items-center bg-transparent overflow-hidden lg:space-x-12 xl:space-x-20 py-20 lg:py-0 px-4 md:px-10 lg:px-16"
    >
      {/* Subtle compact section indicator for premium desktop layout */}
      <div className="absolute top-10 left-4 md:left-10 lg:left-16 hidden lg:flex flex-col z-30">
        <span className="text-primary/60 text-[10px] font-semibold uppercase tracking-[0.2em]">02 / Portfolyo</span>
        <span className="text-white font-heading font-bold text-lg mt-1">Son Çalışmalarım</span>
      </div>

      {/* Left side: Absolute cross-fading text content (Stacked on mobile, absolute on desktop) */}
      <div className="relative w-full lg:w-1/2 min-h-[250px] lg:h-[350px] flex items-center justify-center">
        {content.map((item, index) => (
          <div
            key={item.title + index}
            className={cn(
              "flex flex-col justify-center transition-all duration-600 ease-out px-4",
              "absolute inset-x-0 w-full",
              activeCard === index
                ? "opacity-100 translate-y-0 scale-100 pointer-events-auto z-10"
                : "opacity-0 translate-y-8 scale-95 pointer-events-none z-0"
            )}
          >
            <span className="text-primary text-[11px] md:text-xs font-semibold tracking-wider uppercase mb-3 block">Seçkin Proje</span>
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-purple-400 mb-4 leading-tight">
              {item.title}
            </h3>
            <p className="text-gray-text text-sm md:text-base leading-relaxed max-w-md">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      {/* Right side: Sticky visual container */}
      <div className="relative w-full lg:w-[45%] h-[280px] md:h-[340px] xl:h-[380px] rounded-2xl content-container group/sticky">
        {/* Premium Neon Radial Glow Backing */}
        <div className="absolute -inset-1.5 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-3xl blur opacity-40 group-hover/sticky:opacity-60 transition duration-1000 group-hover/sticky:duration-200 pointer-events-none" />
        
        {/* Core Card Container */}
        <div className="absolute inset-0 bg-dark-card rounded-2xl overflow-hidden z-10 border border-dark-border">
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-20 pointer-events-none" />
          
          {/* GSAP sliding wrapper containing all screens */}
          <div ref={sliderRef} className="w-full h-full flex flex-col">
            {content.map((item, idx) => (
              <div key={idx} className="w-full h-full shrink-0 relative overflow-hidden bg-dark-card">
                {item.content ?? null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
