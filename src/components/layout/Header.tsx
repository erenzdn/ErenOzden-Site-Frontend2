'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Menu, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { SITE } from '@/lib/constants';
import { pauseLenis, resumeLenis } from '@/lib/lenisControls';

const NAV_KEYS = ['home', 'about', 'services', 'portfolio', 'contact'] as const;
const NAV_HREFS: Record<(typeof NAV_KEYS)[number], string> = {
  home: '/',
  about: '/about',
  services: '/services',
  portfolio: '/portfolio',
  contact: '/contact',
};

export default function Header() {
  const t = useTranslations('nav');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    let rafId: number | null = null;
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      if (rafId !== null) return;
      
      rafId = requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        if (Math.abs(currentScrollY - lastScrollY) > 5) {
          setIsScrolled(currentScrollY > 30);
          lastScrollY = currentScrollY;
        }
        rafId = null;
      });
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
      pauseLenis();
    } else {
      document.body.style.overflow = '';
      resumeLenis();
    }
    return () => {
      document.body.style.overflow = '';
      resumeLenis();
    };
  }, [isMobileOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-dark/70 backdrop-blur-2xl border-b border-dark-border'
            : 'bg-transparent'
        }`}
      >
        <nav className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-lg sm:text-xl font-heading font-bold text-white tracking-tight shrink-0">
            {SITE.logo.main}<span className="text-primary">{SITE.logo.accent}</span>
          </Link>

          {/* Desktop Nav — ortada */}
          <ul className="hidden lg:flex items-center gap-1 bg-dark-light/60 backdrop-blur-md border border-dark-border rounded-full px-2 py-1">
            {NAV_KEYS.map((key) => (
              <li key={key}>
                <Link
                  href={NAV_HREFS[key]}
                  className="px-4 py-1.5 rounded-full text-[13px] text-gray-light hover:text-white hover:bg-dark-lighter/80 transition-all duration-200 block"
                >
                  {t(key)}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right side: Language Switcher + CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitcher variant="dropdown" />
            <Button href="/contact" variant="primary" showArrow={true} className="text-[13px] px-5 py-2.5">
              {t('cta')}
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden text-white p-2 -mr-2 hover:bg-dark-light/60 rounded-lg transition-colors flex items-center justify-center shrink-0"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Menü"
          >
            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </header>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 bg-dark/95 backdrop-blur-xl flex flex-col items-center justify-center gap-6 px-4 pt-20 pb-8">
          {NAV_KEYS.map((key) => (
            <Link
              key={key}
              href={NAV_HREFS[key]}
              onClick={() => setIsMobileOpen(false)}
              className="text-xl font-heading font-semibold text-white hover:text-primary transition-colors"
            >
              {t(key)}
            </Link>
          ))}
          
          {/* Mobile Language Switcher */}
          <div className="mt-4 mb-2">
            <LanguageSwitcher variant="inline" />
          </div>
          
          <Button href="/contact" variant="primary" showArrow={false} onClick={() => setIsMobileOpen(false)}>
            {t('cta')}
          </Button>
        </div>
      )}
    </>
  );
}
