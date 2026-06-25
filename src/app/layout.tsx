import type { Metadata } from 'next';
import { Syne, DM_Sans, Geist } from 'next/font/google';
import { cn } from '@/lib/utils';
import './globals.css';

const geist = Geist({ 
  subsets: ['latin'], 
  variable: '--font-sans',
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
});

const syne = Syne({
  variable: '--font-heading',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
});

const dmSans = DM_Sans({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/apple-icon.png',
  },
};

/**
 * Kök Layout
 * 
 * Next.js gereksinimleri uyarınca root layout mutlaka <html> ve <body> içermelidir.
 * Locale-aware yapılandırma src/app/[locale]/layout.tsx içindedir.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      suppressHydrationWarning
      className={cn(syne.variable, dmSans.variable, 'font-sans', geist.variable)}
    >
      <head>
        <link rel="alternate" hrefLang="tr" href="https://erenozden.com/tr" />
        <link rel="alternate" hrefLang="en" href="https://erenozden.com/en" />
        <link rel="alternate" hrefLang="x-default" href="https://erenozden.com/tr" />
      </head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
