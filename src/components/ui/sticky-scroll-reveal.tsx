"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface StickyScrollItem {
  title: string;
  description: string;
  href?: string;
  technologies?: string[];
  content?: React.ReactNode;
}

interface StickyScrollProps {
  content: StickyScrollItem[];
  sectionLabel?: string;
  sectionTitle?: string;
  featuredLabel?: string;
  viewDetailsLabel?: string;
  contentClassName?: string;
}

const SCROLL_TRIGGER_ID = "portfolio-sticky-scroll";

function getActiveIndex(progress: number, total: number): number {
  if (total <= 1) return 0;
  return Math.min(Math.floor(progress * total + 0.0001), total - 1);
}

function getSegmentFill(progress: number, index: number, total: number): number {
  const segStart = index / total;
  const segEnd = (index + 1) / total;
  if (progress >= segEnd) return 1;
  if (progress <= segStart) return 0;
  return (progress - segStart) / (segEnd - segStart);
}

function getScrollProgressForSlide(index: number, total: number): number {
  if (total <= 1) return 0;
  return (index + 0.5) / total;
}

export const StickyScroll = ({
  content,
  sectionLabel = "Projects",
  sectionTitle = "Recent Work",
  featuredLabel = "Featured Project",
  viewDetailsLabel = "View Details",
  contentClassName,
}: StickyScrollProps) => {
  const [activeCard, setActiveCard] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  const totalSlides = content.length;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const scrollToSlide = useCallback(
    (index: number) => {
      const st = ScrollTrigger.getById(SCROLL_TRIGGER_ID);
      if (!st) return;
      const targetProgress = getScrollProgressForSlide(index, totalSlides);
      const scrollY = st.start + (st.end - st.start) * targetProgress;
      window.scrollTo({ top: scrollY, behavior: "smooth" });
    },
    [totalSlides]
  );

  useEffect(() => {
    if (!isMounted || totalSlides === 0) return;

    const container = containerRef.current;
    const slider = sliderRef.current;
    const pinned = pinnedRef.current;
    if (!container || !slider || !pinned) return;

    // Her slide için tam viewport height + minimal ekstra space
    const scrollDistance = (totalSlides + 0.2) * window.innerHeight;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        id: SCROLL_TRIGGER_ID,
        trigger: container,
        start: "top top",
        end: () => `+=${scrollDistance}`,
        pin: pinned,
        pinSpacing: true,
        scrub: 0.5,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        fastScrollEnd: true,
        onEnter: () => setShowProgressBar(true),
        onEnterBack: () => setShowProgressBar(true),
        onLeave: () => setShowProgressBar(false),
        onLeaveBack: () => setShowProgressBar(false),
        onUpdate: (self) => {
          const progress = self.progress;
          
          // Her slide tam align olsun - basit hesaplama
          // Progress 0-1 arası, her slide için eşit dağılım
          const yPercent = totalSlides > 1
            ? -progress * (totalSlides - 1) * 100
            : 0;

          gsap.set(slider, { yPercent });
          setScrollProgress(progress);
          setActiveCard(getActiveIndex(progress, totalSlides));
        },
      });
    }, container);

    // ScrollTrigger'ı birkaç kez refresh et ki pinSpacing düzgün hesaplansın
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    });
    
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh(true);
    }, 500);

    const handleResize = () => {
      ScrollTrigger.refresh(true);
    };
    
    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(refreshTimer);
      window.removeEventListener("resize", handleResize);
      ctx.revert();
      setShowProgressBar(false);
    };
  }, [isMounted, totalSlides]);

  if (!isMounted) {
    return (
      <div className="h-screen flex items-center justify-center bg-dark">
        <div className="w-8 h-8 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
      </div>
    );
  }

  const overallPercent = Math.round(scrollProgress * 100);
  const currentSegmentFill =
    totalSlides > 1
      ? getSegmentFill(scrollProgress, activeCard, totalSlides)
      : scrollProgress;

  return (
    <>
      <div
        ref={containerRef}
        className="relative w-full isolate"
        style={{ height: `${(totalSlides + 0.2) * 100}vh` }}
      >
        <div
          ref={pinnedRef}
          className={cn(
            "w-full h-screen flex flex-col lg:flex-row justify-center items-center",
            "px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16",
            "gap-6 md:gap-8 lg:gap-12 xl:gap-20",
            "bg-dark relative z-10"
          )}
        >
          {/* Premium Section Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="absolute top-6 sm:top-8 lg:top-10 left-4 sm:left-6 md:left-8 lg:left-12 xl:left-16 flex flex-col z-30"
          >
            <div className="inline-flex items-center gap-2 mb-2">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-3 h-3 text-primary" />
              </motion.div>
              <span className="text-primary/90 text-[10px] font-bold uppercase tracking-[0.3em]">
                02 / {sectionLabel}
              </span>
            </div>
            <span className="text-white font-heading font-bold text-base sm:text-lg lg:text-xl bg-linear-to-r from-white via-purple-100 to-white bg-clip-text">
              {sectionTitle}
            </span>
            {/* Decorative line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="h-0.5 w-20 bg-linear-to-r from-primary/80 to-transparent mt-2 rounded-full"
            />
          </motion.div>

          {/* Premium Project Navigation */}
          {totalSlides > 1 && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="absolute right-4 sm:right-6 md:right-8 lg:right-12 xl:right-16 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-2 z-30 max-w-[220px]"
            >
              {/* Glassmorphic background */}
              <div className="absolute -inset-3 bg-dark/20 backdrop-blur-xl rounded-2xl border border-white/5 opacity-80" />
              
              <div className="relative z-10 p-2 space-y-1">
                {content.map((item, idx) => {
                  const isActive = activeCard === idx;
                  
                  return (
                    <motion.button
                      key={`nav-${idx}`}
                      type="button"
                      onClick={() => scrollToSlide(idx)}
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "group flex items-center gap-3 text-left py-2 px-3 rounded-xl transition-all duration-300 cursor-pointer w-full",
                        isActive 
                          ? "bg-primary/10 border border-primary/20" 
                          : "hover:bg-white/5 border border-transparent"
                      )}
                    >
                      {/* Number badge */}
                      <span
                        className={cn(
                          "text-[10px] font-mono tabular-nums shrink-0 transition-all duration-300 px-2 py-1 rounded-md",
                          isActive 
                            ? "text-primary bg-primary/10 font-bold" 
                            : "text-white/40 bg-white/5 group-hover:text-white/60"
                        )}
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      
                      {/* Title */}
                      <span
                        className={cn(
                          "text-xs truncate transition-colors duration-300",
                          isActive
                            ? "text-white font-semibold"
                            : "text-white/50 group-hover:text-white/80"
                        )}
                      >
                        {item.title}
                      </span>
                      
                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="w-1.5 h-1.5 rounded-full bg-primary ml-auto shadow-lg shadow-primary/50"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Text panel */}
          <div
            className={cn(
              "relative w-full flex items-center justify-center",
              "lg:w-[48%] xl:w-[46%]",
              "min-h-[220px] sm:min-h-[240px] md:min-h-[260px] lg:h-[380px]",
              "order-2 lg:order-1",
              contentClassName
            )}
          >
            {content.map((item, index) => (
              <motion.div
                key={`text-${item.title}-${index}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ 
                  opacity: activeCard === index ? 1 : 0,
                  y: activeCard === index ? 0 : 30
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={cn(
                  "flex flex-col justify-center absolute inset-x-0 w-full",
                  "px-2 sm:px-4 md:px-6 lg:px-2 xl:px-4"
                )}
                style={{
                  pointerEvents: activeCard === index ? "auto" : "none",
                }}
              >
                {/* Badge */}
                <motion.div 
                  className="flex items-center gap-3 mb-4 md:mb-5"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: activeCard === index ? 1 : 0, x: activeCard === index ? 0 : -20 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 backdrop-blur-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-primary text-[10px] sm:text-xs font-bold tracking-wider uppercase">
                      {featuredLabel}
                    </span>
                  </div>
                  <span className="text-white/30 text-[10px] font-mono tabular-nums">
                    {String(index + 1).padStart(2, "0")} / {String(totalSlides).padStart(2, "0")}
                  </span>
                </motion.div>

                {/* Title with gradient */}
                <motion.h3 
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] xl:text-5xl font-heading font-bold mb-4 md:mb-5 leading-[1.15]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: activeCard === index ? 1 : 0, y: activeCard === index ? 0 : 20 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <span className="bg-linear-to-r from-white via-purple-100 to-white bg-clip-text text-transparent">
                    {item.title}
                  </span>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: activeCard === index ? 1 : 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="h-1 w-20 bg-linear-to-r from-primary to-transparent rounded-full mt-2"
                  />
                </motion.h3>

                {/* Description */}
                <motion.p 
                  className="text-gray-text text-sm md:text-base leading-relaxed max-w-lg mb-5 md:mb-6 line-clamp-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: activeCard === index ? 1 : 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {item.description}
                </motion.p>

                {/* Technologies */}
                {item.technologies && item.technologies.length > 0 && (
                  <motion.div 
                    className="flex flex-wrap gap-2 mb-6 md:mb-7"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: activeCard === index ? 1 : 0, y: activeCard === index ? 0 : 10 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                  >
                    {item.technologies.slice(0, 5).map((tech, i) => (
                      <motion.span
                        key={tech}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ 
                          opacity: activeCard === index ? 1 : 0,
                          scale: activeCard === index ? 1 : 0.8
                        }}
                        transition={{ duration: 0.3, delay: 0.5 + i * 0.05 }}
                        className="relative group/tech"
                      >
                        <div className="absolute -inset-0.5 bg-linear-to-r from-primary/20 to-purple-500/20 rounded-full opacity-0 group-hover/tech:opacity-100 blur transition-opacity" />
                        <span className="relative block px-3 py-1.5 text-[10px] sm:text-[11px] bg-dark/60 backdrop-blur-sm border border-white/10 rounded-full text-white/70 group-hover/tech:text-white group-hover/tech:border-primary/40 transition-all">
                          {tech}
                        </span>
                      </motion.span>
                    ))}
                  </motion.div>
                )}

                {/* CTA Link */}
                {item.href && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: activeCard === index ? 1 : 0, x: activeCard === index ? 0 : -10 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                  >
                    <Link
                      href={item.href}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/30 text-sm font-semibold text-primary hover:bg-primary/20 hover:border-primary/50 transition-all group/link w-fit backdrop-blur-sm"
                    >
                      {viewDetailsLabel}
                      <ArrowUpRight
                        size={16}
                        className="transition-transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1"
                      />
                    </Link>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Premium Visual Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={cn(
              "relative w-full rounded-2xl group/sticky",
              "lg:w-[44%] xl:w-[42%]",
              "h-[260px] sm:h-[300px] md:h-[340px] lg:h-[380px] xl:h-[420px]",
              "order-1 lg:order-2"
            )}
          >
            {/* Animated Glow Effect */}
            <motion.div 
              className="absolute -inset-2 sm:-inset-3 bg-linear-to-r from-primary/30 via-purple-500/20 to-pink-500/30 rounded-3xl blur-2xl opacity-40 group-hover/sticky:opacity-70 transition-opacity duration-700 pointer-events-none"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.4, 0.6, 0.4],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            
            {/* Secondary Glow */}
            <div className="absolute -inset-1 bg-linear-to-br from-primary/20 to-purple-500/20 rounded-3xl blur-xl opacity-30 group-hover/sticky:opacity-50 transition-opacity duration-700 pointer-events-none" />
            
            {/* Main Card Container */}
            <div className="absolute inset-0 rounded-2xl sm:rounded-3xl overflow-hidden z-10 border border-white/10 shadow-2xl shadow-primary/10 backdrop-blur-sm bg-dark/20">
              {/* Top Glass Border */}
              <div className="absolute top-0 left-1/4 right-1/4 h-px bg-linear-to-r from-transparent via-white/30 to-transparent" />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-dark/90 via-dark/30 to-transparent z-20 pointer-events-none" />
              
              {/* Grid Pattern Overlay */}
              <div className="absolute inset-0 opacity-[0.02] z-20 pointer-events-none">
                <div className="w-full h-full" style={{
                  backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                   linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                  backgroundSize: '30px 30px'
                }} />
              </div>

              {/* Slider Content */}
              <div
                ref={sliderRef}
                className="w-full will-change-transform relative z-10"
                style={{ height: `${totalSlides * 100}%` }}
              >
                {content.map((item, idx) => (
                  <div
                    key={`slide-${idx}`}
                    className="w-full overflow-hidden"
                    style={{ height: `${100 / totalSlides}%` }}
                  >
                    <div className="w-full h-full relative">
                      {item.content ?? null}
                      
                      {/* Vignette Effect */}
                      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-dark/50" />
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Shine Effect */}
              <motion.div
                className="absolute inset-0 bg-linear-to-tr from-transparent via-white/5 to-transparent z-30 pointer-events-none"
                animate={{
                  x: ['-100%', '200%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 2,
                  ease: "easeInOut",
                }}
              />
            </div>
            
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-primary/30 rounded-tl-2xl z-20 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-primary/30 rounded-br-2xl z-20 pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </>
  );
};
