"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────
   useGsapScrollTrigger
   Container içindeki [data-animate] elemanlarına
   otomatik scroll animasyonu uygular.
   ───────────────────────────────────────────── */
export function useGsapScrollTrigger() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const elements = container.querySelectorAll("[data-animate]");

    const triggers: ScrollTrigger[] = [];

    elements.forEach((el) => {
      const direction = (el as HTMLElement).dataset.animate || "up";
      const delay = parseFloat((el as HTMLElement).dataset.delay || "0");
      const duration = parseFloat(
        (el as HTMLElement).dataset.duration || "0.8"
      );

      const from: gsap.TweenVars = { opacity: 0 };

      switch (direction) {
        case "up":
          from.y = 60;
          break;
        case "down":
          from.y = -60;
          break;
        case "left":
          from.x = 60;
          break;
        case "right":
          from.x = -60;
          break;
        case "scale":
          from.scale = 0.8;
          break;
        case "fade":
        default:
          break;
      }

      const tween = gsap.from(el, {
        ...from,
        duration,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      });

      if (tween.scrollTrigger) {
        triggers.push(tween.scrollTrigger);
      }
    });

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, []);

  return containerRef;
}

/* ─────────────────────────────────────────────
   useCountUp
   Sayıyı 0'dan hedefe doğru animate eder.
   ScrollTrigger ile viewport'a girdiğinde tetiklenir.
   ───────────────────────────────────────────── */
export function useCountUp(
  target: number,
  triggerRef: React.RefObject<HTMLElement | null>,
  duration = 2
) {
  const valueRef = useRef({ value: 0 });

  useEffect(() => {
    const el = triggerRef.current;
    if (!el) return;

    const tween = gsap.to(valueRef.current, {
      value: target,
      duration,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        toggleActions: "play none none none",
      },
      onUpdate: () => {
        el.textContent = Math.round(valueRef.current.value).toString();
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [target, triggerRef, duration]);
}
