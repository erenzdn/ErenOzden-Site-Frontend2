import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

/**
 * Desteklenen diller ve varsayılan dil yapılandırması
 */
export const locales = ['tr', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'tr';

/**
 * next-intl routing yapılandırması
 * - localePrefix: 'always' → URL'de her zaman /tr veya /en prefix'i bulunur (SEO için önerilir)
 * - localeDetection: true → Accept-Language header'ına göre otomatik dil algılama
 */
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'always',
  localeDetection: true,
});

/**
 * Localized navigation utilities
 * Bu fonksiyonları next/navigation yerine kullanın
 * Otomatik olarak locale prefix'i eklerler
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
