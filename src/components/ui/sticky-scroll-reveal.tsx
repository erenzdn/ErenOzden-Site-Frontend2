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
  goToProjectLabel?: string;
  contentClassName?: string;
}

const SCROLL_TRIGGER_ID = "portfolio-sticky-scroll";

function getActiveIndex(progress: number, total: number): number {
  if (total <= 1) return 0;
  return Math.min(Math.floor(progress * total + 0.0001), total - 1);
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
  goToProjectLabel = "go to project",
  contentClassName,
}: StickyScrollProps) => {
  const [activeCard, setActiveCard] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const totalSlides = content.length;

  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const scrollToSlide = useCallback(
    (index: number) => {
      if (isMobile) {
        setActiveCard(index);
        return;
      }
      const st = ScrollTrigger.getById(SCROLL_TRIGGER_ID);
      if (!st) return;
      const targetProgress = getScrollProgressForSlide(index, totalSlides);
      const scrollY = st.start + (st.end - st.start) * targetProgress;
      window.scrollTo({ top: scrollY, behavior: "smooth" });
    },
    [totalSlides, isMobile]
  );

  useEffect(() => {
    if (!isMounted || totalSlides === 0 || isMobile) return;

    const container = containerRef.current;
    const slider = sliderRef.current;
    const pinned = pinnedRef.current;
    if (!container || !slider || !pinned) return;

    const scrollDistance = (totalSlides + 0.2) * window.innerHeight;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        id: SCROLL_TRIGGER_ID,
        trigger: container,
        start: "top top",
        end: () => `+=${scrollDistance}`,
        pin: pinned,
        pinSpacing: true,
        scrub: 0.3,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        fastScrollEnd: true,
        onEnter: () => setShowProgressBar(true),
        onEnterBack: () => setShowProgressBar(true),
        onLeave: () => setShowProgressBar(false),
        onLeaveBack: () => setShowProgressBar(false),
        onUpdate: (self) => {
          const progress = self.progress;
          const yPercent = totalSlides > 1
            ? -progress * (totalSlides - 1) * 100
            : 0;

          gsap.set(slider, { yPercent });
          setScrollProgress(progress);
          setActiveCard(getActiveIndex(progress, totalSlides));
        },
      });
    }, container);

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh(true);
    }, 300);

    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => ScrollTrigger.refresh(true), 150);
    };
    
    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(refreshTimer);
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", handleResize);
      ctx.revert();
      setShowProgressBar(false);
    };
  }, [isMounted, totalSlides, isMobile]);

  if (!isMounted) {
    return (
      <div className="h-screen flex items-center justify-center bg-dark">
        <div className="w-8 h-8 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (isMobile) {
    return (
      <MobileStickyScroll
        content={content}
        activeCard={activeCard}
        setActiveCard={setActiveCard}
        sectionLabel={sectionLabel}
        sectionTitle={sectionTitle}
        featuredLabel={featuredLabel}
        viewDetailsLabel={viewDetailsLabel}
        goToProjectLabel={goToProjectLabel}
        contentClassName={contentClassName}
      />
    );
  }

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
            "gap-8 md:gap-10 lg:gap-12 xl:gap-20",
            "bg-dark relative z-20",
            "pt-20 sm:pt-24 pb-20 sm:pb-24 lg:pt-0 lg:pb-0"
          )}
          style={{ isolation: "isolate" }}
        >
          {/* Premium Section Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-6 sm:top-8 lg:top-10 left-4 sm:left-6 md:left-8 lg:left-12 xl:left-16 flex flex-col z-30"
          >
            <div className="inline-flex items-center gap-2 mb-2">
              <Sparkles className="w-3 h-3 text-primary" />
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
              transition={{ duration: 0.6 }}
              className="h-0.5 w-20 bg-linear-to-r from-primary/80 to-transparent mt-2 rounded-full"
            />
          </motion.div>

          {/* Premium Project Counter - Mobile (Top Right) */}
          {totalSlides > 1 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="absolute top-6 sm:top-8 right-4 sm:right-6 flex lg:hidden items-center gap-1.5 z-30 px-3 py-1.5 bg-dark/60 backdrop-blur-md rounded-full border border-white/10"
            >
              <span className="text-primary text-xs font-mono font-bold">
                {String(activeCard + 1).padStart(2, "0")}
              </span>
              <span className="text-white/30 text-xs font-mono">
                / {String(totalSlides).padStart(2, "0")}
              </span>
            </motion.div>
          )}

          {/* Premium Project Navigation - Mobile Dots (Bottom) */}
          {totalSlides > 1 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex lg:hidden items-center gap-2 z-30 px-4 py-2 bg-dark/60 backdrop-blur-md rounded-full border border-white/10"
            >
              {content.map((item, idx) => {
                const isActive = activeCard === idx;
                
                return (
                  <button
                    key={`nav-mobile-${idx}`}
                    type="button"
                    onClick={() => scrollToSlide(idx)}
                    className={cn(
                      "relative transition-all duration-200 rounded-full",
                      isActive ? "w-8 h-2" : "w-2 h-2"
                    )}
                    aria-label={`${item.title} ${goToProjectLabel}`}
                  >
                    <div
                      className={cn(
                        "w-full h-full rounded-full transition-all duration-200",
                        isActive 
                          ? "bg-primary" 
                          : "bg-white/30 hover:bg-white/50 active:bg-white/60"
                      )}
                    />
                  </button>
                );
              })}
            </motion.div>
          )}

          {/* Premium Project Navigation - Desktop */}
          {totalSlides > 1 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
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
                        "group flex items-center gap-3 text-left py-2 px-3 rounded-xl transition-all duration-200 cursor-pointer w-full",
                        isActive 
                          ? "bg-primary/10 border border-primary/20" 
                          : "hover:bg-white/5 border border-transparent"
                      )}
                    >
                      {/* Number badge */}
                      <span
                        className={cn(
                          "text-[10px] font-mono tabular-nums shrink-0 transition-all duration-200 px-2 py-1 rounded-md",
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
                          "text-xs truncate transition-colors duration-200",
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
                          className="w-1.5 h-1.5 rounded-full bg-primary ml-auto"
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
              "min-h-[280px] sm:min-h-[320px] md:min-h-[360px] lg:h-[380px]",
              "order-2 lg:order-1",
              "shrink-0",
              contentClassName
            )}
          >
            {content.map((item, index) => (
              <motion.div
                key={`text-${item.title}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: activeCard === index ? 1 : 0,
                  y: activeCard === index ? 0 : 20
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={cn(
                  "flex flex-col justify-center absolute inset-x-0 w-full",
                  "px-2 sm:px-4 md:px-6 lg:px-2 xl:px-4"
                )}
                style={{
                  pointerEvents: activeCard === index ? "auto" : "none",
                }}
              >
                {/* Badge */}
                <div className="flex items-center gap-3 mb-4 md:mb-5 flex-wrap">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 backdrop-blur-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="text-primary text-[10px] sm:text-xs font-bold tracking-wider uppercase">
                      {featuredLabel}
                    </span>
                  </div>
                  <span className="text-white/30 text-[10px] font-mono tabular-nums hidden lg:inline">
                    {String(index + 1).padStart(2, "0")} / {String(totalSlides).padStart(2, "0")}
                  </span>
                </div>

                {/* Title with gradient */}
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] xl:text-5xl font-heading font-bold mb-4 md:mb-5 leading-[1.15]">
                  <span className="bg-linear-to-r from-white via-purple-100 to-white bg-clip-text text-transparent">
                    {item.title}
                  </span>
                  <div className="h-1 w-20 bg-linear-to-r from-primary to-transparent rounded-full mt-2" />
                </h3>

                {/* Description */}
                <p className="text-gray-text text-sm md:text-base leading-relaxed max-w-lg mb-5 md:mb-6 line-clamp-4">
                  {item.description}
                </p>

                {/* Technologies */}
                {item.technologies && item.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6 md:mb-7">
                    {item.technologies.slice(0, 5).map((tech) => (
                      <span
                        key={tech}
                        className="relative group/tech"
                      >
                        <div className="absolute -inset-0.5 bg-primary/10 rounded-full opacity-0 group-hover/tech:opacity-100 transition-opacity" />
                        <span className="relative block px-3 py-1.5 text-[10px] sm:text-[11px] bg-dark/60 backdrop-blur-sm border border-white/10 rounded-full text-white/70 group-hover/tech:text-white group-hover/tech:border-primary/40 transition-all">
                          {tech}
                        </span>
                      </span>
                    ))}
                  </div>
                )}

                {/* CTA Link */}
                {item.href && (
                  <div>
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
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Premium Visual Panel */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={cn(
              "relative w-full rounded-2xl",
              "lg:w-[44%] xl:w-[42%]",
              "h-[280px] sm:h-[320px] md:h-[360px] lg:h-[380px] xl:h-[420px]",
              "order-1 lg:order-2",
              "shrink-0"
            )}
          >
            {/* Subtle Glow Effect - Static */}
            <div className="absolute -inset-2 bg-primary/10 rounded-3xl blur-xl opacity-30 pointer-events-none" />
            
            {/* Main Card Container */}
            <div className="absolute inset-0 rounded-2xl sm:rounded-3xl overflow-hidden z-10 border border-white/10 shadow-2xl shadow-primary/10 backdrop-blur-sm bg-dark/20">
              {/* Top Glass Border */}
              <div className="absolute top-0 left-1/4 right-1/4 h-px bg-linear-to-r from-transparent via-white/30 to-transparent" />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-dark/90 via-dark/30 to-transparent z-20 pointer-events-none" />

              {/* Slider Content */}
              <div
                ref={sliderRef}
                className="w-full will-change-transform relative z-10"
                style={{ 
                  height: `${totalSlides * 100}%`,
                  transform: 'translateZ(0)'
                }}
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
            </div>
            
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-primary/20 rounded-tl-2xl z-20 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-primary/20 rounded-br-2xl z-20 pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </>
  );
};

interface MobileStickyScrollProps {
  content: StickyScrollItem[];
  activeCard: number;
  setActiveCard: (index: number) => void;
  sectionLabel?: string;
  sectionTitle?: string;
  featuredLabel?: string;
  viewDetailsLabel?: string;
  goToProjectLabel?: string;
  contentClassName?: string;
}

function MobileStickyScroll({
  content,
  activeCard,
  setActiveCard,
  sectionLabel = "Projects",
  sectionTitle = "Recent Work",
  featuredLabel = "Featured Project",
  viewDetailsLabel = "View Details",
  goToProjectLabel = "go to project",
}: MobileStickyScrollProps) {
  const totalSlides = content.length;
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<number>(0);
  const touchEndRef = useRef<number>(0);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.current = e.targetTouches[0].clientX;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndRef.current = e.targetTouches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    const diff = touchStartRef.current - touchEndRef.current;
    const threshold = 50;
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0 && activeCard < totalSlides - 1) {
        setActiveCard(activeCard + 1);
      } else if (diff < 0 && activeCard > 0) {
        setActiveCard(activeCard - 1);
      }
    }
  }, [activeCard, totalSlides, setActiveCard]);

  const currentItem = content[activeCard];

  return (
    <section 
      ref={containerRef}
      className="relative w-full bg-dark py-16 sm:py-20 overflow-hidden"
      style={{ isolation: "isolate" }}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 mb-2">
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="text-primary/90 text-[10px] font-bold uppercase tracking-[0.3em]">
              02 / {sectionLabel}
            </span>
          </div>
          <h2 className="text-white font-heading font-bold text-xl sm:text-2xl">
            {sectionTitle}
          </h2>
          <div className="h-0.5 w-20 bg-linear-to-r from-primary/80 to-transparent mt-2 rounded-full" />
        </div>

        {/* Project Counter */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-dark/60 backdrop-blur-md rounded-full border border-white/10">
            <span className="text-primary text-xs font-mono font-bold">
              {String(activeCard + 1).padStart(2, "0")}
            </span>
            <span className="text-white/30 text-xs font-mono">
              / {String(totalSlides).padStart(2, "0")}
            </span>
          </div>
          
          {/* Navigation Dots */}
          <div className="flex items-center gap-2">
            {content.map((_, idx) => (
              <button
                key={`mobile-dot-${idx}`}
                type="button"
                onClick={() => setActiveCard(idx)}
                className={cn(
                  "transition-all duration-200 rounded-full",
                  activeCard === idx ? "w-6 h-2 bg-primary" : "w-2 h-2 bg-white/30"
                )}
                aria-label={`${content[idx].title} ${goToProjectLabel}`}
              />
            ))}
          </div>
        </div>

        {/* Swipeable Card */}
        <div 
          className="relative"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Image Card */}
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-6 border border-white/10 shadow-xl">
            <div className="absolute -inset-2 bg-primary/10 rounded-3xl blur-xl opacity-20 pointer-events-none" />
            <div className="absolute inset-0 bg-linear-to-t from-dark/80 via-transparent to-transparent z-10 pointer-events-none" />
            {currentItem?.content}
          </div>

          {/* Content */}
          <div className="space-y-4">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-primary text-[10px] font-bold tracking-wider uppercase">
                {featuredLabel}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-2xl sm:text-3xl font-heading font-bold leading-tight">
              <span className="bg-linear-to-r from-white via-purple-100 to-white bg-clip-text text-transparent">
                {currentItem?.title}
              </span>
            </h3>

            {/* Description */}
            <p className="text-gray-text text-sm leading-relaxed line-clamp-3">
              {currentItem?.description}
            </p>

            {/* Technologies */}
            {currentItem?.technologies && currentItem.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {currentItem.technologies.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 text-[10px] bg-dark/60 backdrop-blur-sm border border-white/10 rounded-full text-white/70"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}

            {/* CTA Link */}
            {currentItem?.href && (
              <Link
                href={currentItem.href}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/30 text-sm font-semibold text-primary active:bg-primary/20 transition-all w-fit"
              >
                {viewDetailsLabel}
                <ArrowUpRight size={16} />
              </Link>
            )}
          </div>
        </div>

        {/* Swipe Hint */}
        {totalSlides > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6 text-white/30 text-xs">
            <span>←</span>
            <span>Kaydırarak gezin</span>
            <span>→</span>
          </div>
        )}
      </div>
    </section>
  );
}
