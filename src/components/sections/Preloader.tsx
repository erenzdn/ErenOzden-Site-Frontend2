"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Preloader() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    window.lenis?.stop();

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        window.lenis?.start();
        // Preloader bittiğinde ScrollTrigger'ı yeniliyoruz ki tüm animasyonlar doğru tetiklensin
        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 100);
      },
    });

    tl.to(barRef.current, {
      width: "100%",
      duration: 1.5,
      ease: "power2.inOut",
    });

    tl.to(textRef.current, {
      opacity: 0,
      y: -10,
      duration: 0.4,
      ease: "power2.in",
    }, "-=0.2");

    tl.to(overlayRef.current, {
      yPercent: -100,
      duration: 0.8,
      ease: "power4.inOut",
    });

    return () => {
      tl.kill();
      document.body.style.overflow = "";
      window.lenis?.start();
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] bg-dark flex flex-col items-center justify-center"
    >
      <div ref={textRef} className="flex flex-col items-center gap-6 w-full max-w-xs px-6">
        <span className="text-xl font-heading font-bold text-white tracking-widest">
          EREN<span className="text-primary">.</span>
        </span>
        <div className="w-full h-[2px] bg-dark-border rounded-full overflow-hidden">
          <div
            ref={barRef}
            className="h-full bg-primary rounded-full"
            style={{ width: "0%" }}
          />
        </div>
      </div>
    </div>
  );
}
