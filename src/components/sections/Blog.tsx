"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Calendar, ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const posts = [
  { title: "Modern Web Geliştirmede Next.js'in Yeri", category: "Web Geliştirme", date: "15 Mart 2024", excerpt: "Next.js'in sunucu bileşenleri ve App Router ile modern web geliştirme süreçlerini nasıl dönüştürdüğüne bakıyoruz." },
  { title: "TypeScript ile Güvenli Kod Yazma", category: "Programlama", date: "10 Mart 2024", excerpt: "TypeScript'in tip sistemi sayesinde daha güvenli ve bakımı kolay kod yazmak mümkün." },
  { title: "Docker ile Mikroservis Mimarisi", category: "DevOps", date: "5 Mart 2024", excerpt: "Docker container'ları ile mikroservis mimarisinin avantajları ve uygulama stratejileri." },
];

export default function Blog() {
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".blog-card", {
        opacity: 0, y: 50, duration: 0.7, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%", toggleActions: "play none none reverse" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="blog" className="section-padding">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="badge badge-primary mb-5 inline-flex">Blog</span>
          <h2 className="text-3xl md:text-4xl lg:text-[44px] font-heading font-bold text-white">Son Yazılarım</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {posts.map((post) => (
            <article key={post.title} className="blog-card card card-glow overflow-hidden group">
              <div className="h-44 bg-dark-lighter flex items-center justify-center border-b border-dark-border">
                <span className="text-gray/20 text-sm font-heading uppercase tracking-widest">{post.category}</span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-gray text-[12px] mb-3"><Calendar size={11} />{post.date}</div>
                <h3 className="text-base font-heading font-bold text-white mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                <p className="text-gray-text text-sm leading-relaxed mb-4">{post.excerpt}</p>
                <a href="#" className="inline-flex items-center gap-1.5 text-primary text-sm font-medium hover:underline">Devamını Oku <ArrowRight size={13} /></a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
