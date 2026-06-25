"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { pauseLenis, resumeLenis } from "@/lib/lenisControls";

gsap.registerPlugin(ScrollTrigger);

const PRELOADER_TIMEOUT_MS = 4000;

export default function Preloader() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const finishedRef = useRef(false);
  const [isComplete, setIsComplete] = useState(false);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;

    timelineRef.current?.kill();
    document.body.style.overflow = "";
    resumeLenis();
    setIsComplete(true);

    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }

    document.body.style.overflow = "hidden";
    pauseLenis();

    const overlay = overlayRef.current;
    const text = textRef.current;
    const bar = barRef.current;

    if (!overlay || !text || !bar) {
      finish();
      return;
    }

    const fallbackTimer = window.setTimeout(finish, PRELOADER_TIMEOUT_MS);

    const tl = gsap.timeline({ onComplete: finish });
    timelineRef.current = tl;

    tl.to(bar, {
      width: "100%",
      duration: 1.5,
      ease: "power2.inOut",
    });

    tl.to(text, {
      opacity: 0,
      y: -10,
      duration: 0.4,
      ease: "power2.in",
    }, "-=0.2");

    tl.to(overlay, {
      yPercent: -100,
      duration: 0.8,
      ease: "power4.inOut",
    });

    return () => {
      window.clearTimeout(fallbackTimer);
      tl.kill();
      document.body.style.overflow = "";
      resumeLenis();
    };
  }, [finish]);

  if (isComplete) return null;

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
