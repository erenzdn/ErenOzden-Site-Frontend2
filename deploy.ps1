# ==============================================================================
# ERENOZDEN-FRONTEND - Deployment Script (PowerShell)
# ==============================================================================
# Windows için production deployment script'i
# Kullanım: .\deploy.ps1

$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting deployment..." -ForegroundColor Green

# Check if docker-compose is installed
try {
    docker-compose --version | Out-Null
} catch {
    Write-Host "❌ docker-compose is not installed" -ForegroundColor Red
    exit 1
}

# Check if .env.production exists
if (-not (Test-Path ".env.production")) {
    Write-Host "⚠️  .env.production not found. Creating from example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env.production"
    Write-Host "⚠️  Please update .env.production with your production values" -ForegroundColor Yellow
    exit 1
}

# Pull latest changes
Write-Host "📥 Pulling latest changes from git..." -ForegroundColor Yellow
try {
    git pull origin main
} catch {
    Write-Host "⚠️  Git pull failed or not in a git repository" -ForegroundColor Yellow
}

# Build Docker images
Write-Host "🔨 Building Docker images..." -ForegroundColor Yellow
docker-compose build --no-cache

# Stop old containers
Write-Host "🛑 Stopping old containers..." -ForegroundColor Yellow
docker-compose down

# Start new containers
Write-Host "🚀 Starting new containers..." -ForegroundColor Yellow
docker-compose up -d

# Wait for services to be healthy
Write-Host "⏳ Waiting for services to be healthy..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check if frontend is running
$frontendStatus = docker-compose ps | Select-String "frontend.*Up"
if ($frontendStatus) {
    Write-Host "✅ Frontend is running" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend failed to start" -ForegroundColor Red
    docker-compose logs frontend
    exit 1
}

# Check if nginx is running
$nginxStatus = docker-compose ps | Select-String "nginx.*Up"
if ($nginxStatus) {
    Write-Host "✅ Nginx is running" -ForegroundColor Green
} else {
    Write-Host "❌ Nginx failed to start" -ForegroundColor Red
    docker-compose logs nginx
    exit 1
}

# Show running containers
Write-Host "📊 Running containers:" -ForegroundColor Green
docker-compose ps

# Show logs (last 20 lines)
Write-Host "📝 Recent logs:" -ForegroundColor Green
docker-compose logs --tail=20

Write-Host "✅ Deployment completed successfully!" -ForegroundColor Green
Write-Host "🌐 Your site should be available at: http://localhost" -ForegroundColor Green
Write-Host ""
Write-Host "To view logs: docker-compose logs -f"
Write-Host "To stop: docker-compose down"
