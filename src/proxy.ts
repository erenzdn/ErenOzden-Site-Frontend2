import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

/**
 * next-intl middleware instance
 * Locale algılama ve yönlendirme mantığını yönetir
 */
const intlMiddleware = createIntlMiddleware(routing);

/**
 * Next.js 16 Proxy fonksiyonu (eski adıyla Middleware)
 * 
 * Görevleri:
 * 1. URL'de locale yoksa Accept-Language header'a göre yönlendir (örn: / → /tr)
 * 2. Geçersiz locale varsa defaultLocale'e yönlendir
 * 3. NEXT_LOCALE cookie'sini ayarla (kullanıcı tercihi için)
 */
export function proxy(request: NextRequest) {
  return intlMiddleware(request);
}

/**
 * Proxy'nin çalışacağı path'leri belirle
 * 
 * Hariç tutulanlar:
 * - /api/* → API rotaları
 * - /_next/* → Next.js internal dosyaları (static, image optimization)
 * - /favicon.ico, /sitemap.xml, /robots.txt → Meta dosyaları
 * - *.png, *.jpg, *.svg, *.ico → Statik medya dosyaları
 */
export const config = {
  matcher: [
    // Tüm path'leri yakala AMA şunları hariç tut:
    '/((?!api|strapi|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico)$).*)',
  ],
};
