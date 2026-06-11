"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Phone, Mail } from "lucide-react";
import { CONTACT } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Sayfa yüklendiğinde veya mount edildiğinde ScrollTrigger hesaplamalarını garantiye alıyoruz
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    const ctx = gsap.context(() => {
      gsap.from("[data-contact-animate]", {
        opacity: 0,
        y: 40,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
        clearProps: "all", // Animasyon tamamlandıktan sonra tüm opacity kilitlerini açar ve alanların görünmesini garanti eder
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 90%", // Sayfa açılır açılmaz tetiklenmesini garanti etmek için daha aşağı çekildi
          toggleActions: "play none none reverse",
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="contact" className="section-padding relative overflow-hidden w-full flex flex-col items-center">
      <div className="glow-blob top-1/2 left-0 -translate-y-1/2" />
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-[1200px] w-full relative z-10">
        
        {/* Top Header */}
        <div className="text-center mb-16" data-contact-animate>
          <span className="badge badge-primary mb-5 inline-flex">İletişim</span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-5 leading-tight">
            Benimle İletişime Geçin
          </h2>
          <p className="text-gray-text text-base max-w-xl mx-auto">
            Projeleriniz, fikirleriniz veya herhangi bir sorunuz için aşağıdaki formu doldurarak ulaşabilirsiniz. Size en kısa sürede dönüş yapacağım.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          
          {/* Left Info Cards */}
          <div className="lg:col-span-5 space-y-5">
            <div data-contact-animate className="card card-glow p-8 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Mail size={22} className="text-primary" />
              </div>
              <div>
                <p className="text-gray-text text-sm mb-1">E-posta</p>
                <a href={`mailto:${CONTACT.email}`} className="text-white text-lg font-heading font-semibold hover:text-primary transition-colors">
                  {CONTACT.email}
                </a>
              </div>
            </div>

            <div data-contact-animate className="card card-glow p-8 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Phone size={22} className="text-primary" />
              </div>
              <div>
                <p className="text-gray-text text-sm mb-1">Telefon</p>
                <a href={`tel:${CONTACT.phone.replace(/\s+/g, '')}`} className="text-white text-lg font-heading font-semibold hover:text-primary transition-colors">
                  {CONTACT.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="lg:col-span-7">
            <form data-contact-animate className="card p-8 md:p-10" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div className="space-y-2">
                  <label className="text-white text-sm font-medium ml-1">İsim</label>
                  <input 
                    type="text" 
                    placeholder="Eren" 
                    className="w-full px-5 py-3.5 bg-dark border border-dark-border rounded-xl text-white text-sm placeholder:text-gray focus:outline-none focus:border-primary/50 transition-colors" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-white text-sm font-medium ml-1">Soyisim</label>
                  <input 
                    type="text" 
                    placeholder="Özden" 
                    className="w-full px-5 py-3.5 bg-dark border border-dark-border rounded-xl text-white text-sm placeholder:text-gray focus:outline-none focus:border-primary/50 transition-colors" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div className="space-y-2">
                  <label className="text-white text-sm font-medium ml-1">E-posta</label>
                  <input 
                    type="email" 
                    placeholder="ornek@mail.com" 
                    className="w-full px-5 py-3.5 bg-dark border border-dark-border rounded-xl text-white text-sm placeholder:text-gray focus:outline-none focus:border-primary/50 transition-colors" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-white text-sm font-medium ml-1">Telefon</label>
                  <input 
                    type="tel" 
                    placeholder="+90 555 000 00 00" 
                    className="w-full px-5 py-3.5 bg-dark border border-dark-border rounded-xl text-white text-sm placeholder:text-gray focus:outline-none focus:border-primary/50 transition-colors" 
                  />
                </div>
              </div>

              <div className="space-y-2 mb-8">
                <label className="text-white text-sm font-medium ml-1">Mesajınız</label>
                <textarea 
                  rows={5} 
                  placeholder="Projenizden veya fikrinizden bahsedin..." 
                  className="w-full px-5 py-3.5 bg-dark border border-dark-border rounded-xl text-white text-sm placeholder:text-gray focus:outline-none focus:border-primary/50 transition-colors resize-none" 
                />
              </div>

              <button 
                type="submit" 
                className="w-full py-4 bg-primary text-dark font-medium rounded-xl hover:bg-primary-dark transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/40 cursor-pointer"
              >
                Formu Gönder
              </button>
            </form>
          </div>
          
        </div>
      </div>
    </section>
  );
}
