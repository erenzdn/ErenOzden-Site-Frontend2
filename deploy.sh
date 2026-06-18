#!/bin/bash

# ==============================================================================
# ERENOZDEN-FRONTEND - Deployment Script
# ==============================================================================
# Production deployment için hızlı deployment script'i
# Kullanım: ./deploy.sh

set -e

echo "🚀 Starting deployment..."

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ docker-compose is not installed${NC}"
    exit 1
fi

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo -e "${YELLOW}⚠️  .env.production not found. Creating from example...${NC}"
    cp .env.example .env.production
    echo -e "${YELLOW}⚠️  Please update .env.production with your production values${NC}"
    exit 1
fi

# Pull latest changes
echo -e "${YELLOW}📥 Pulling latest changes from git...${NC}"
git pull origin main || echo -e "${YELLOW}⚠️  Git pull failed or not in a git repository${NC}"

# Build Docker images
echo -e "${YELLOW}🔨 Building Docker images...${NC}"
docker-compose build --no-cache

# Stop old containers
echo -e "${YELLOW}🛑 Stopping old containers...${NC}"
docker-compose down

# Start new containers
echo -e "${YELLOW}🚀 Starting new containers...${NC}"
docker-compose up -d

# Wait for services to be healthy
echo -e "${YELLOW}⏳ Waiting for services to be healthy...${NC}"
sleep 10

# Check if frontend is running
if docker-compose ps | grep -q "frontend.*Up"; then
    echo -e "${GREEN}✅ Frontend is running${NC}"
else
    echo -e "${RED}❌ Frontend failed to start${NC}"
    docker-compose logs frontend
    exit 1
fi

# Check if nginx is running
if docker-compose ps | grep -q "nginx.*Up"; then
    echo -e "${GREEN}✅ Nginx is running${NC}"
else
    echo -e "${RED}❌ Nginx failed to start${NC}"
    docker-compose logs nginx
    exit 1
fi

# Show running containers
echo -e "${GREEN}📊 Running containers:${NC}"
docker-compose ps

# Show logs (last 20 lines)
echo -e "${GREEN}📝 Recent logs:${NC}"
docker-compose logs --tail=20

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${GREEN}🌐 Your site should be available at: http://localhost${NC}"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop: docker-compose down"
