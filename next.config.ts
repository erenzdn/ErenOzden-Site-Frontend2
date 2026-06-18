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
    // Set to false in production for optimization, true in development
    unoptimized: process.env.NODE_ENV !== "production",
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
