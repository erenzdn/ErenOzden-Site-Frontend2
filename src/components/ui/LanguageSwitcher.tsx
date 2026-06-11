'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { locales, type Locale } from '@/i18n/routing';
import { useSlugMap } from '@/contexts/SlugMapContext';
import { Globe, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'inline';
  className?: string;
}

const localeNames: Record<Locale, string> = {
  tr: 'TR',
  en: 'EN',
};

const localeFullNames: Record<Locale, string> = {
  tr: 'Türkçe',
  en: 'English',
};

export default function LanguageSwitcher({ variant = 'dropdown', className = '' }: LanguageSwitcherProps) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('language');
  
  // Dinamik slug haritası (services/[slug], portfolio/[id] gibi sayfalarda kullanılır)
  const { slugMap, basePath } = useSlugMap();
  
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocaleChange = (newLocale: Locale) => {
    // Eğer slug haritası varsa, dinamik slug ile yönlendir
    // Örn: /tr/services/web-tasarim → /en/services/web-design
    if (slugMap && basePath && slugMap[newLocale]) {
      const newPath = `${basePath}/${slugMap[newLocale]}`;
      router.replace(newPath, { locale: newLocale });
    } else {
      // Normal sayfalarda pathname'i koru
      router.replace(pathname, { locale: newLocale });
    }
    setIsOpen(false);
  };

  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {locales.map((l, index) => (
          <span key={l} className="flex items-center">
            <button
              onClick={() => handleLocaleChange(l)}
              className={`px-2 py-1 text-sm font-medium transition-colors ${
                locale === l
                  ? 'text-white'
                  : 'text-gray-light hover:text-white'
              }`}
              aria-label={t('switchTo')}
            >
              {localeNames[l]}
            </button>
            {index < locales.length - 1 && (
              <span className="text-dark-border">/</span>
            )}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-dark-light/60 backdrop-blur-md border border-dark-border text-gray-light hover:text-white hover:border-gray-light/30 transition-all duration-200"
        aria-label={t('switchTo')}
        aria-expanded={isOpen}
      >
        <Globe size={16} className="text-slate-400" />
        <span className="text-[13px] font-medium">{localeNames[locale]}</span>
        <ChevronDown
          size={14}
          className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 py-1 min-w-[140px] bg-dark-card/95 backdrop-blur-xl border border-dark-border rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {locales.map((l) => (
            <button
              key={l}
              onClick={() => handleLocaleChange(l)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                locale === l
                  ? 'bg-primary/10 text-white'
                  : 'text-gray-light hover:bg-dark-lighter hover:text-white'
              }`}
            >
              <span className="w-6 text-center font-medium text-slate-400">
                {localeNames[l]}
              </span>
              <span>{localeFullNames[l]}</span>
              {locale === l && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
