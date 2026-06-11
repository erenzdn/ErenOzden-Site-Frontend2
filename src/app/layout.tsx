/**
 * Kök Layout (Minimal)
 * 
 * Bu layout sadece [locale] segmentine yönlendirme için kullanılır.
 * Tüm asıl layout mantığı src/app/[locale]/layout.tsx içindedir.
 * 
 * Not: Next.js 16 App Router'da tüm rotalar [locale] altında olduğunda
 * bu dosya genellikle sadece children'ı render eder.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
