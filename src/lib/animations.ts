"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────
   animateStagger
   Container tetikleyicili toplu giriş animasyonu
   ───────────────────────────────────────────── */
export function animateStagger(
  containerSelector: string,
  itemSelector: string,
  options?: {
    y?: number;
    duration?: number;
    stagger?: number;
    start?: string;
  }
) {
  const {
    y = 60,
    duration = 0.8,
    stagger = 0.15,
    start = "top 80%",
  } = options || {};

  gsap.from(itemSelector, {
    y,
    opacity: 0,
    duration,
    stagger,
    ease: "power3.out",
    scrollTrigger: {
      trigger: containerSelector,
      start,
      toggleActions: "play none none reverse",
    },
  });
}

/* ─────────────────────────────────────────────
   animateCounter
   Sayı sayma animasyonu — doğrudan tetiklenir
   ───────────────────────────────────────────── */
export function animateCounter(
  element: HTMLElement,
  target: number,
  duration = 2
) {
  const obj = { value: 0 };
  gsap.to(obj, {
    value: target,
    duration,
    ease: "power2.out",
    onUpdate: () => {
      element.textContent = Math.round(obj.value).toString();
    },
  });
}

/* ─────────────────────────────────────────────
   createMarquee
   Yatay sonsuz kaydırma animasyonu
   ───────────────────────────────────────────── */
export function createMarquee(
  containerSelector: string,
  direction: "left" | "right" = "left",
  speed = 50
) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const width = (container as HTMLElement).scrollWidth / 2;

  gsap.to(containerSelector, {
    x: direction === "left" ? -width : width,
    duration: speed,
    ease: "none",
    repeat: -1,
  });
}
