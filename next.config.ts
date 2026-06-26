import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
import path from "node:path";
import { fileURLToPath } from "node:url";

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

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
  ...(process.env.NODE_ENV === "production" && {
    // Stricter production checks
    reactStrictMode: true,
  }),
};

export default withNextIntl(nextConfig);
