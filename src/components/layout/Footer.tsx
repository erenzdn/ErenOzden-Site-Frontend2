"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { SITE, CONTACT, SOCIAL, NAV_LINKS } from "@/lib/constants";
import { createVantaCellsEffect } from "@/lib/vantaLoader";

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function Footer() {
  const vantaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let effect: any = null;
    let cancelled = false;

    (async () => {
      const instance = await createVantaCellsEffect(vantaRef.current, {});
      if (cancelled) {
        if (instance?.destroy) instance.destroy();
        return;
      }
      if (!instance) return;
      effect = instance;
    })();

    return () => {
      cancelled = true;
      if (effect?.destroy) effect.destroy();
    };
  }, []);

  return (
    <footer className="bg-dark border-t border-dark-border pt-16 pb-8 relative overflow-hidden bg-black">
      {/* Vanta Cells Interactive 3D Animated Background */}
      <div 
        ref={vantaRef} 
        className="absolute inset-0 z-0 opacity-20 transition-opacity duration-1000 pointer-events-none" 
      />

      {/* Subtle overlay gradient to ensure high-contrast readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 z-0 pointer-events-none" />

      {/* Background glow blob */}
      <div className="glow-blob bottom-[-200px] left-1/2 -translate-x-1/2 opacity-50 z-0 pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          {/* Brand Col */}
          <div className="lg:col-span-2">
            <Link href="/" className="text-2xl font-heading font-bold text-white mb-4 inline-block">
              {SITE.logo.main}<span className="text-primary">{SITE.logo.accent}</span>
            </Link>
            <p className="text-gray-text text-sm leading-relaxed mb-6 max-w-sm">
              Crafting high-performance digital experiences through modern engineering and scalable software solutions.
            </p>
            <div className="flex items-center gap-3">
              <a href={SOCIAL.github} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-dark-border flex items-center justify-center text-gray-light hover:text-primary hover:border-primary transition-colors"><GithubIcon /></a>
              <a href={SOCIAL.linkedin} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-dark-border flex items-center justify-center text-gray-light hover:text-primary hover:border-primary transition-colors"><LinkedinIcon /></a>
              <a href={SOCIAL.twitter} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-dark-border flex items-center justify-center text-gray-light hover:text-primary hover:border-primary transition-colors"><TwitterIcon /></a>
            </div>
          </div>

          {/* Links Col */}
          <div>
            <h4 className="text-white font-heading font-semibold mb-4 text-sm tracking-wide">Hizmetlerim</h4>
            <ul className="space-y-2.5">
              <li><Link href="/services" className="text-gray-text text-sm hover:text-primary transition-colors">Web Geliştirme</Link></li>
              <li><Link href="/services" className="text-gray-text text-sm hover:text-primary transition-colors">Mobil Uygulama</Link></li>
              <li><Link href="/services" className="text-gray-text text-sm hover:text-primary transition-colors">Backend API</Link></li>
              <li><Link href="/services" className="text-gray-text text-sm hover:text-primary transition-colors">Veritabanı</Link></li>
              <li><Link href="/services" className="text-gray-text text-sm hover:text-primary transition-colors">DevOps</Link></li>
            </ul>
          </div>

          {/* Pages Col */}
          <div>
            <h4 className="text-white font-heading font-semibold mb-4 text-sm tracking-wide">Sayfalar</h4>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}><Link href={link.href} className="text-gray-text text-sm hover:text-primary transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h4 className="text-white font-heading font-semibold mb-4 text-sm tracking-wide">İletişim</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-gray-text text-sm"><Phone size={16} className="text-primary shrink-0 mt-0.5" />{CONTACT.phone}</li>
              <li className="flex items-start gap-2 text-gray-text text-sm"><MapPin size={16} className="text-primary shrink-0 mt-0.5" />{CONTACT.location}</li>
              <li className="flex items-start gap-2 text-gray-text text-sm"><Mail size={16} className="text-primary shrink-0 mt-0.5" />{CONTACT.email}</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-dark-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-text text-[13px]">© {new Date().getFullYear()} {SITE.name}. All right reserved</p>
          <div className="flex gap-4">
            <a href="#" className="text-gray-text text-[13px] hover:text-white transition-colors">Gizlilik Politikası</a>
            <a href="#" className="text-gray-text text-[13px] hover:text-white transition-colors">Kullanım Şartları</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
