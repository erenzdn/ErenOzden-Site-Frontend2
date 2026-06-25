import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Tüm route'ları eşleştir ancak aşağıdakileri hariç tut:
  // - API routes
  // - Static files (_next/static)
  // - Image optimization (_next/image)
  // - Favicon, manifest ve diğer public assets
  matcher: [
    // Tüm path'leri eşleştir
    '/((?!api|_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.webp|.*\\.ico|manifest.json|strapi).*)',
  ],
};
