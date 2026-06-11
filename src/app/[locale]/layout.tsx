import type { Metadata } from 'next';
import { Syne, DM_Sans, Geist } from 'next/font/google';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing, locales, type Locale } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import SmoothScroll from '@/components/providers/SmoothScroll';
import { SlugMapProvider } from '@/contexts/SlugMapContext';
import '../globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const syne = Syne({
  variable: '--font-heading',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const dmSans = DM_Sans({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

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
 * - HTML lang attribute'u dinamik olarak locale'e göre ayarlanır
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
  // Bu fonksiyon her layout ve page'de çağrılmalı
  setRequestLocale(locale);

  // Server tarafında mesajları yükle
  const messages = await getMessages();

  // OpenGraph locale formatı (tr → tr_TR, en → en_US)
  const ogLocale = locale === 'tr' ? 'tr_TR' : 'en_US';

  return (
    <html
      lang={locale}
      className={cn(syne.variable, dmSans.variable, 'font-sans', geist.variable)}
      suppressHydrationWarning
    >
      <head>
        {/* Alternatif dil linkleri (SEO için hreflang) */}
        <link rel="alternate" hrefLang="tr" href="https://erenozden.com/tr" />
        <link rel="alternate" hrefLang="en" href="https://erenozden.com/en" />
        <link rel="alternate" hrefLang="x-default" href="https://erenozden.com/tr" />
      </head>
      <body suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <SlugMapProvider>
            <SmoothScroll>{children}</SmoothScroll>
          </SlugMapProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
