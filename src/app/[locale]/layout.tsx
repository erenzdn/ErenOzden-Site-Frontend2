import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing, locales, type Locale } from '@/i18n/routing';
import SmoothScroll from '@/components/providers/SmoothScroll';
import { SlugMapProvider } from '@/contexts/SlugMapContext';

/**
 * Build zamanında statik sayfalar oluşturmak için desteklenen dilleri döndür
 */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/**
 * Kök metadata tanımı
 * metadataBase tüm URL-tabanlı metadata alanları için base URL sağlar
 */
export const metadata: Metadata = {
  metadataBase: new URL('https://erenozden.com'),
  authors: [{ name: 'Eren Özden' }],
  creator: 'Eren Özden',
  keywords: [
    'Eren Özden',
    'Full Stack',
    'Web Geliştirme',
    'React',
    'Next.js',
    'TypeScript',
  ],
  alternates: {
    canonical: '/',
    languages: {
      'tr': '/tr',
      'en': '/en',
      'x-default': '/tr',
    },
  },
};

/**
 * Layout Props tipi
 */
type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

/**
 * Locale-aware Root Layout
 * 
 * Bu layout tüm [locale] altındaki sayfalar için geçerlidir.
 * - HTML lang attribute'u ve font'lar üst layout'tan alınır
 * - NextIntlClientProvider ile client components çevirilere erişebilir
 * - setRequestLocale ile statik rendering etkinleştirilir
 */
export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Geçersiz locale kontrolü
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Statik rendering için locale'i ayarla
  setRequestLocale(locale);

  // Server tarafında mesajları yükle
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <SlugMapProvider>
        <SmoothScroll>{children}</SmoothScroll>
      </SlugMapProvider>
    </NextIntlClientProvider>
  );
}
