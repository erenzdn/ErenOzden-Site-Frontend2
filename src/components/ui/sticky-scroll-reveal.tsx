"use client";
import React, { useRef, useEffect, useState, useCallback } from "react";
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
  const [previousCard, setPreviousCard] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const visualCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const textCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const textElementsRef = useRef<{
    label: (HTMLSpanElement | null)[];
    title: (HTMLHeadingElement | null)[];
    description: (HTMLParagraphElement | null)[];
  }>({ label: [], title: [], description: [] });

  // Responsive check ve resize handler
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.matchMedia("(min-width: 1024px)").matches);
    };
    
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // ScrollTrigger setup
  useEffect(() => {
    if (content.length === 0 || !containerRef.current) return;

    const ctx = gsap.context(() => {
      if (isDesktop) {
        // Desktop: Pinned full-screen showcase
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top top",
          end: `+=${content.length * 100}%`,
          pin: true,
          scrub: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const index = Math.min(
              Math.floor(self.progress * content.length),
              content.length - 1
            );
            if (index !== activeCard) {
              setPreviousCard(activeCard);
              setActiveCard(index);
            }
          },
        });
      } else {
        // Mobile & Tablet: Natural scroll with card triggers
        content.forEach((_, index) => {
          ScrollTrigger.create({
            trigger: containerRef.current,
            start: `top+=${index * 400} center`,
            end: `top+=${(index + 1) * 400} center`,
            onEnter: () => {
              setPreviousCard(activeCard);
              setActiveCard(index);
            },
            onEnterBack: () => {
              setPreviousCard(activeCard);
              setActiveCard(index);
            },
          });
        });
      }

      // Sadece bu bileşen mount olduğunda refresh
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [content, activeCard, isDesktop]);

  // Animasyonlar - Responsive optimized
  useEffect(() => {
    if (!sliderRef.current) return;
    
    const duration = isDesktop ? 1.2 : 0.8;
    const ease = isDesktop ? "power3.inOut" : "power2.out";
    
    // Ana slider animasyonu
    gsap.to(sliderRef.current, {
      yPercent: -activeCard * 100,
      duration,
      ease,
    });

    // Görsel kartlar animasyonu
    visualCardsRef.current.forEach((card, idx) => {
      if (!card) return;
      
      if (idx === activeCard) {
        if (isDesktop) {
          // Desktop: Full 3D effect
          gsap.fromTo(
            card,
            {
              scale: 0.92,
              rotateX: 8,
              rotateY: -5,
              z: -100,
              opacity: 0.6,
            },
            {
              scale: 1,
              rotateX: 0,
              rotateY: 0,
              z: 0,
              opacity: 1,
              duration,
              ease: "power3.out",
            }
          );
        } else {
          // Mobile: Simplified animation
          gsap.fromTo(
            card,
            {
              scale: 0.95,
              opacity: 0.7,
            },
            {
              scale: 1,
              opacity: 1,
              duration,
              ease: "power2.out",
            }
          );
        }
      } else if (idx === previousCard && idx !== activeCard) {
        if (isDesktop) {
          gsap.to(card, {
            scale: 0.88,
            rotateX: -8,
            rotateY: 5,
            z: -150,
            opacity: 0.3,
            duration,
            ease: "power3.in",
          });
        } else {
          gsap.to(card, {
            scale: 0.9,
            opacity: 0.4,
            duration,
            ease: "power2.in",
          });
        }
      }
    });

    // Metin kartları animasyonu - Responsive optimized
    textCardsRef.current.forEach((card, idx) => {
      if (!card) return;
      
      const isActive = idx === activeCard;
      const isPrevious = idx === previousCard && idx !== activeCard;
      const isFuture = idx > activeCard;
      
      if (isActive) {
        // Aktif kart - Giriş animasyonu
        const yOffset = isDesktop ? 48 : 24;
        const rotationZ = isDesktop ? (isFuture ? 3 : -3) : 0;
        const blurAmount = isDesktop ? 8 : 4;
        
        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: isFuture ? yOffset : -yOffset,
            scale: 0.9,
            rotationZ: rotationZ,
            filter: `blur(${blurAmount}px)`,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotationZ: 0,
            filter: "blur(0px)",
            duration,
            ease: "power3.out",
          }
        );

        // Alt elemanlar için stagger animasyonu
        const label = textElementsRef.current.label[idx];
        const title = textElementsRef.current.title[idx];
        const description = textElementsRef.current.description[idx];

        const xOffset = isDesktop ? 16 : 8;
        const stagDuration = isDesktop ? 0.8 : 0.5;

        if (label) {
          gsap.fromTo(
            label,
            { opacity: 0, x: -xOffset },
            { opacity: 1, x: 0, duration: stagDuration, delay: 0.1, ease: "power2.out" }
          );
        }
        if (title) {
          gsap.fromTo(
            title,
            { opacity: 0, x: -xOffset * 2 },
            { opacity: 1, x: 0, duration: stagDuration + 0.1, delay: 0.2, ease: "power2.out" }
          );
        }
        if (description) {
          gsap.fromTo(
            description,
            { opacity: 0, x: -xOffset * 1.5 },
            { opacity: 1, x: 0, duration: stagDuration + 0.2, delay: 0.3, ease: "power2.out" }
          );
        }
      } else if (isPrevious) {
        // Önceki kart - Çıkış animasyonu
        const yOffset = isDesktop ? 48 : 24;
        const rotationZ = isDesktop ? -3 : 0;
        const blurAmount = isDesktop ? 8 : 4;
        
        gsap.to(card, {
          opacity: 0,
          y: -yOffset,
          scale: 0.9,
          rotationZ: rotationZ,
          filter: `blur(${blurAmount}px)`,
          duration,
          ease: "power3.in",
        });
      } else if (isFuture) {
        // Gelecek kartlar
        const yOffset = isDesktop ? 48 : 24;
        const blurAmount = isDesktop ? 8 : 4;
        
        gsap.set(card, {
          opacity: 0,
          y: yOffset,
          scale: 0.9,
          rotationZ: isDesktop ? 3 : 0,
          filter: `blur(${blurAmount}px)`,
        });
      } else {
        // Geçmiş kartlar
        const yOffset = isDesktop ? 48 : 24;
        const blurAmount = isDesktop ? 8 : 4;
        
        gsap.set(card, {
          opacity: 0,
          y: -yOffset,
          scale: 0.9,
          rotationZ: isDesktop ? -3 : 0,
          filter: `blur(${blurAmount}px)`,
        });
      }
    });
  }, [activeCard, previousCard, isDesktop]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full flex flex-col lg:flex-row justify-center items-center bg-transparent overflow-hidden",
        "py-12 sm:py-16 md:py-20 lg:py-0",
        "px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16",
        "gap-8 md:gap-10 lg:gap-12 xl:gap-20",
        isDesktop ? "min-h-screen lg:h-screen" : "min-h-auto"
      )}
    >
      {/* Section indicator - Desktop only */}
      <div className="absolute top-6 sm:top-8 lg:top-10 left-4 sm:left-6 md:left-8 lg:left-12 xl:left-16 hidden lg:flex flex-col z-30">
        <span className="text-primary/60 text-[10px] font-semibold uppercase tracking-[0.2em]">02 / Portfolyo</span>
        <span className="text-white font-heading font-bold text-base lg:text-lg mt-1">Son Çalışmalarım</span>
      </div>

      {/* Left side: Premium text content - Fully responsive */}
      <div className={cn(
        "relative w-full flex items-center justify-center perspective-1000",
        "lg:w-1/2",
        "min-h-[200px] sm:min-h-[220px] md:min-h-[250px] lg:h-[350px]",
        "order-2 lg:order-1"
      )}>
        {content.map((item, index) => (
          <div
            key={item.title + index}
            ref={(el) => { textCardsRef.current[index] = el; }}
            className={cn(
              "flex flex-col justify-center absolute inset-x-0 w-full",
              "px-3 sm:px-4 md:px-6 lg:px-4"
            )}
            style={{
              willChange: 'transform, opacity, filter',
              pointerEvents: activeCard === index ? 'auto' : 'none',
            }}
          >
            <span 
              ref={(el) => { textElementsRef.current.label[index] = el; }}
              className="text-primary text-[10px] sm:text-[11px] md:text-xs font-semibold tracking-wider uppercase mb-2 md:mb-3 block"
            >
              Seçkin Proje
            </span>
            <h3 
              ref={(el) => { textElementsRef.current.title[index] = el; }}
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-transparent bg-clip-text bg-linear-to-r from-white via-white to-purple-400 mb-3 md:mb-4 leading-tight"
            >
              {item.title}
            </h3>
            <p 
              ref={(el) => { textElementsRef.current.description[index] = el; }}
              className="text-gray-text text-xs sm:text-sm md:text-base leading-relaxed max-w-md"
            >
              {item.description}
            </p>
          </div>
        ))}
      </div>

      {/* Right side: Premium visual container - Fully responsive */}
      <div className={cn(
        "relative w-full rounded-2xl content-container group/sticky perspective-2000",
        "lg:w-[45%] xl:w-[42%]",
        "h-[240px] xs:h-[260px] sm:h-[280px] md:h-[340px] lg:h-[360px] xl:h-[380px]",
        "order-1 lg:order-2"
      )}>
        {/* Enhanced Multi-layer Neon Glow - Responsive */}
        <div className="absolute -inset-1.5 sm:-inset-2 bg-linear-to-r from-purple-500/30 via-blue-500/20 to-pink-500/30 rounded-2xl sm:rounded-3xl blur-lg sm:blur-xl opacity-50 group-hover/sticky:opacity-80 transition-all duration-1000 group-hover/sticky:duration-300 animate-pulse-slow pointer-events-none" />
        <div className="absolute -inset-0.5 sm:-inset-1 bg-linear-to-br from-purple-600/20 to-blue-600/20 rounded-2xl sm:rounded-3xl blur-sm sm:blur-md opacity-40 group-hover/sticky:opacity-70 transition-all duration-700 pointer-events-none" />
        
        {/* Core Card Container with 3D Transform */}
        <div 
          className="absolute inset-0 rounded-xl sm:rounded-2xl overflow-hidden z-10 border border-dark-border shadow-xl sm:shadow-2xl shadow-purple-500/10"
          style={{
            transformStyle: isDesktop ? 'preserve-3d' : 'flat',
            transform: 'translateZ(0)',
          }}
        >
          {/* Gradient Overlay for Depth */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent z-20 pointer-events-none" />
          <div className="absolute inset-0 bg-linear-to-br from-purple-500/5 to-blue-500/5 z-20 pointer-events-none" />
          
          {/* GSAP sliding wrapper */}
          <div 
            ref={sliderRef} 
            className="w-full h-full flex flex-col"
            style={{
              transformStyle: isDesktop ? 'preserve-3d' : 'flat',
            }}
          >
            {content.map((item, idx) => (
              <div 
                key={idx}
                ref={(el) => { visualCardsRef.current[idx] = el; }}
                className="w-full h-full shrink-0 relative overflow-hidden bg-dark-card"
                style={{
                  transformStyle: isDesktop ? 'preserve-3d' : 'flat',
                  backfaceVisibility: 'hidden',
                  willChange: 'transform, opacity',
                }}
              >
                {/* Inner glow for active card */}
                {activeCard === idx && (
                  <div className="absolute inset-0 bg-gradient-radial from-purple-500/10 via-transparent to-transparent z-10 pointer-events-none animate-fade-in" />
                )}
                {item.content ?? null}
              </div>
            ))}
          </div>

          {/* Premium Corner Accent - Desktop only */}
          <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-linear-to-br from-purple-500/10 to-transparent rounded-bl-full z-30 pointer-events-none hidden sm:block" />
          <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-linear-to-tr from-blue-500/10 to-transparent rounded-tr-full z-30 pointer-events-none hidden sm:block" />
        </div>
      </div>
    </div>
  );
};
