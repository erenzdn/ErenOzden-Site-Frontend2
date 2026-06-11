"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  { name: "Ahmet Yılmaz", role: "CEO", company: "TechStart", text: "Eren ile çalışmak harika bir deneyimdi. Projemizi zamanında ve beklentilerimizin üzerinde teslim etti. Teknik bilgisi ve profesyonelliği ile fark yaratıyor." },
  { name: "Zeynep Kaya", role: "CTO", company: "InnovateTR", text: "Karmaşık sorunlara yaratıcı ve verimli çözümler üretiyor. İletişim becerisi mükemmel, her aşamada bilgilendirme yapıyor." },
  { name: "Mehmet Demir", role: "Product Manager", company: "DigitalPlus", text: "Kullanıcı deneyimi konusundaki hassasiyeti ve kod kalitesi takdire şayan. Kesinlikle tekrar çalışmak istediğimiz bir geliştirici." },
  { name: "Ayşe Çelik", role: "Kurucu", company: "StartupHQ", text: "Müşteri desteği artık sorunsuz. Yanıt sürelerimiz büyük ölçüde iyileşti ve memnuniyet seviyesi tüm zamanların en yüksek seviyesinde." },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-test-animate]", {
        opacity: 0, y: 40, duration: 0.7, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%", toggleActions: "play none none reverse" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const prev = () => setActive((p) => (p === 0 ? testimonials.length - 1 : p - 1));
  const next = () => setActive((p) => (p === testimonials.length - 1 ? 0 : p + 1));

  return (
    <section ref={sectionRef} id="testimonials" className="section-padding relative">
      <div className="glow-blob top-[-100px] left-1/2 -translate-x-1/2" />
      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="text-center mb-14" data-test-animate>
          <span className="badge badge-primary mb-5 inline-flex">Referanslar</span>
          <h2 className="text-3xl md:text-4xl lg:text-[44px] font-heading font-bold text-white mb-5">Müşterilerim Ne Diyor?</h2>
          <p className="text-gray-text text-base max-w-xl mx-auto">Gerçek projeler, gerçek sonuçlar.</p>
        </div>

        {/* Cards grid — 2x2 on desktop */}
        <div className="hidden md:grid grid-cols-2 gap-5" data-test-animate>
          {testimonials.map((t, i) => (
            <div key={i} className="card card-glow p-7">
              <p className="text-gray-text text-sm leading-relaxed mb-5 italic">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-primary text-sm font-bold font-heading">{t.name[0]}</div>
                <div><p className="text-white text-sm font-medium">{t.name}</p><p className="text-gray text-[12px]">{t.role} — {t.company}</p></div>
                <div className="ml-auto flex gap-0.5">{Array.from({ length: 5 }).map((_, j) => <Star key={j} size={12} className="text-primary fill-primary" />)}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile carousel */}
        <div className="md:hidden" data-test-animate>
          <div className="card card-glow p-7">
            <p className="text-gray-text text-sm leading-relaxed mb-5 italic">&ldquo;{testimonials[active].text}&rdquo;</p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-primary text-sm font-bold font-heading">{testimonials[active].name[0]}</div>
              <div><p className="text-white text-sm font-medium">{testimonials[active].name}</p><p className="text-gray text-[12px]">{testimonials[active].role} — {testimonials[active].company}</p></div>
            </div>
          </div>
          <div className="flex justify-center gap-3 mt-6">
            <button onClick={prev} className="w-9 h-9 rounded-full border border-dark-border flex items-center justify-center text-gray-light hover:border-primary hover:text-primary transition-colors cursor-pointer"><ChevronLeft size={16} /></button>
            {testimonials.map((_, i) => <button key={i} onClick={() => setActive(i)} className={`w-2 h-2 rounded-full transition-colors cursor-pointer ${i === active ? "bg-primary" : "bg-dark-lighter"}`} />)}
            <button onClick={next} className="w-9 h-9 rounded-full border border-dark-border flex items-center justify-center text-gray-light hover:border-primary hover:text-primary transition-colors cursor-pointer"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
    </section>
  );
}
