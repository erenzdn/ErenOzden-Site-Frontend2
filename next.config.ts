import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
import path from "node:path";
import { fileURLToPath } from "node:url";

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const isProduction = process.env.NODE_ENV === "production";

/** Production HTML sayfaları için CSP (Turnstile, Strapi medya, Vanta arka plan, Google Analytics). */
const productionContentSecurityPolicy = [
  "default-src 'self'",
  // Next.js RSC bootstrap inline script'leri + harici kaynaklar
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://www.googletagmanager.com",
  // Tailwind utility sınıfları ve GSAP inline style enjeksiyonu için bilinçli istisna
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' https://api.mehmeterenozden.com data: blob:",
  "font-src 'self' data:",
  "connect-src 'self' https://api.mehmeterenozden.com https://challenges.cloudflare.com https://www.google-analytics.com https://analytics.google.com https://*.google-analytics.com",
  "frame-src 'self' https://challenges.cloudflare.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join("; ");

const nextConfig: NextConfig = {
  // Turbopack only for development
  ...(process.env.NODE_ENV === "development" && {
    turbopack: {
      root: projectRoot,
    },
  }),

  // Standalone output for Docker optimization
  output: process.env.NODE_ENV === "production" ? "standalone" : undefined,

  // Image optimization
  images: {
    // PRODUCTION FIX: unoptimized false yapıldı (image optimization aktif)
    unoptimized: false,
    // Quality seviyeleri tanımla
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ["image/webp"],
    minimumCacheTTL: 60,
    remotePatterns: [
      // Development Strapi (local)
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "1337",
        pathname: "/uploads/**",
      },
      // Production Strapi
      {
        protocol: "https",
        hostname: "mehmeterenozden.com",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "api.mehmeterenozden.com",
        pathname: "/uploads/**",
      },
    ],
  },

  // Development origins
  allowedDevOrigins: ["localhost", "127.0.0.1", "192.168.1.103"],

  // Security: Remove X-Powered-By header
  poweredByHeader: false,

  // Enable compression
  compress: true,

  // Production optimizations
  ...(isProduction && {
    // Stricter production checks
    reactStrictMode: true,
  }),

  async headers() {
    const cacheHeaders = [
      {
        source: "/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif|woff|woff2|ttf|otf)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];

    if (!isProduction) {
      return cacheHeaders;
    }

    return [
      ...cacheHeaders,
      {
        // HTML sayfaları — statik asset matcher'larından ayrı tutulur
        source: "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|jpg|jpeg|png|gif|ico|webp|avif|woff|woff2|ttf|otf)$).*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: productionContentSecurityPolicy,
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
