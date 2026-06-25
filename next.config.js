const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performans optimizasyonları
  compress: true, // Gzip compression
  poweredByHeader: false, // X-Powered-By header'ı kaldır
  
  // React optimizasyonları
  reactStrictMode: true,
  
  // Görsel optimizasyonları
  images: {
    unoptimized: true, // Turbopack bug workaround - production'da false yapılacak
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.mehmeterenozden.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
      },
    ],
  },

  // Compiler optimizasyonları
  compiler: {
    // Emotion ve styled-components kullanılmıyorsa kaldır
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
  },

  // Experimental features
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@gsap/react',
      'next-intl'
    ],
    // Server Actions için cache
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // Turbopack config (Next.js 16+ için gerekli)
  turbopack: {},

  // Headers - Cache ve security
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif|woff|woff2|ttf|otf)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
