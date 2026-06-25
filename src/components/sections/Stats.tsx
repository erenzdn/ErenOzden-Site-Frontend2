"use client";

import React, { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Stats() {
  const t = useTranslations('stats');
  const sectionRef = useRef<HTMLElement>(null);
  const counterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const stats = [
    { value: parseInt(t('experience.value')), suffix: t('experience.suffix'), label: t('experience.label') },
    { value: parseInt(t('projects.value')), suffix: t('projects.suffix'), label: t('projects.label') },
    { value: parseInt(t('clients.value')), suffix: t('clients.suffix'), label: t('clients.label') },
    { value: parseInt(t('code.value')), suffix: t('code.suffix'), label: t('code.label') },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".stat-item", {
        opacity: 0, y: 30, duration: 0.7, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%", toggleActions: "play none none reverse" },
      });
      stats.forEach((s, i) => {
        const el = counterRefs.current[i];
        if (!el) return;
        const obj = { value: 0 };
        gsap.to(obj, {
          value: s.value, duration: 2, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
          onUpdate: () => { if (el) el.textContent = Math.round(obj.value).toString(); },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="stats" className="py-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="card p-10 md:p-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <div key={s.label} className="stat-item text-center">
                <div className="flex items-baseline justify-center gap-0.5">
                  <span ref={(el) => { counterRefs.current[i] = el; }} className="text-4xl md:text-5xl font-heading font-bold text-primary">0</span>
                  {s.suffix && <span className="text-lg font-heading font-bold text-primary">{s.suffix}</span>}
                </div>
                <p className="text-gray-text text-sm mt-2">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
