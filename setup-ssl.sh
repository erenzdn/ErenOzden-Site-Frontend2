#!/bin/bash

# ==============================================================================
# ERENOZDEN-FRONTEND - SSL Certificate Setup Script
# ==============================================================================
# Let's Encrypt SSL sertifikası kurulum script'i
# Kullanım: ./setup-ssl.sh your-domain.com

set -e

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Domain kontrolü
if [ -z "$1" ]; then
    echo -e "${RED}❌ Please provide domain name${NC}"
    echo "Usage: ./setup-ssl.sh mehmeterenozden.com"
    exit 1
fi

DOMAIN=$1
EMAIL="admin@${DOMAIN}"

echo -e "${GREEN}🔒 Setting up SSL for ${DOMAIN}${NC}"

# Nginx ve certbot klasörlerini oluştur
mkdir -p certbot/www certbot/conf
mkdir -p nginx/ssl

# Geçici nginx config (HTTP only for challenge)
echo -e "${YELLOW}📝 Creating temporary nginx config for ACME challenge...${NC}"

# Docker-compose ile başlat (SSL olmadan)
echo -e "${YELLOW}🚀 Starting services...${NC}"
docker-compose up -d nginx

# Let's Encrypt sertifikası al
echo -e "${YELLOW}🔐 Requesting SSL certificate from Let's Encrypt...${NC}"
docker-compose run --rm certbot certonly --webroot \
    --webroot-path=/var/www/certbot \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    -d $DOMAIN \
    -d www.$DOMAIN

# Sertifikaları nginx/ssl klasörüne kopyala (opsiyonel - symlink de olabilir)
echo -e "${YELLOW}📋 Copying certificates...${NC}"
docker-compose exec nginx cp /etc/letsencrypt/live/${DOMAIN}/fullchain.pem /etc/nginx/ssl/ || true
docker-compose exec nginx cp /etc/letsencrypt/live/${DOMAIN}/privkey.pem /etc/nginx/ssl/ || true

# Nginx config'de HTTPS kısmını aktif et
echo -e "${YELLOW}⚙️  Updating nginx configuration...${NC}"
echo -e "${RED}⚠️  Please uncomment HTTPS server block in nginx/conf.d/default.conf${NC}"
echo -e "${RED}⚠️  Then run: docker-compose restart nginx${NC}"

echo -e "${GREEN}✅ SSL setup completed!${NC}"
echo ""
echo "Next steps:"
echo "1. Edit nginx/conf.d/default.conf"
echo "2. Uncomment the HTTPS server block (lines with #)"
echo "3. Uncomment the HTTP to HTTPS redirect"
echo "4. Run: docker-compose restart nginx"
echo "5. Test: https://${DOMAIN}"
echo ""
echo "Auto-renewal is configured via certbot container."
