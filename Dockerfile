# ==============================================================================
# ERENOZDEN-FRONTEND - Production Dockerfile
# ==============================================================================
# Next.js 16 uyumlu multi-stage build

FROM node:20-alpine AS base

# Bağımlılıkları yükle
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Package dosyalarını kopyala
COPY package.json package-lock.json* ./
RUN npm ci --production=false

# Builder stage - Production build oluştur
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Production için build - Turbopack production'da kullanılmaz
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

# Production runner - Sadece gerekli dosyalar
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Güvenlik: Non-root user oluştur
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Public klasörünü kopyala
COPY --from=builder /app/public ./public

# .next klasöründen gerekli dosyaları kopyala
RUN mkdir .next
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Standalone output kullanarak çalıştır
CMD ["node", "server.js"]
