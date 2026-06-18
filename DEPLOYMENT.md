# 🚀 ERENOZDEN-FRONTEND - Production Deployment Kılavuzu

Bu dokümantasyon, projeyi canlıya almak için gereken tüm adımları içerir.

---

## 📋 İçindekiler

1. [Ön Hazırlık](#-ön-hazırlık)
2. [Ortam Değişkenleri](#-ortam-değişkenleri)
3. [Next.js Konfigürasyonu](#-nextjs-konfigürasyonu)
4. [Docker ile Deployment](#-docker-ile-deployment)
5. [Nginx Konfigürasyonu](#-nginx-konfigürasyonu)
6. [SSL Sertifikası (Let's Encrypt)](#-ssl-sertifikası-lets-encrypt)
7. [Performans Optimizasyonları](#-performans-optimizasyonları)
8. [Production Checklist](#-production-checklist)
9. [Monitoring ve Logging](#-monitoring-ve-logging)

---

## 🔧 Ön Hazırlık

### 1. Sunucu Gereksinimleri

- **İşletim Sistemi:** Ubuntu 20.04+ / Debian 11+ / CentOS 8+
- **RAM:** Minimum 2GB (Önerilen 4GB)
- **CPU:** 2 Core (Önerilen 4 Core)
- **Disk:** Minimum 20GB
- **Docker:** 24.0+
- **Docker Compose:** 2.0+

### 2. Domain ve DNS Ayarları

```
A Record: mehmeterenozden.com → SUNUCU_IP_ADRESI
A Record: www.mehmeterenozden.com → SUNUCU_IP_ADRESI
```

### 3. Güvenlik Duvarı

```bash
# UFW kullanıyorsanız
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 22/tcp    # SSH
sudo ufw enable
```

---

## 📝 Ortam Değişkenleri

### 1. `.env.production` Dosyası Oluşturma

`.env.production` dosyasını projenin kök dizinine oluşturun:

```bash
NEXT_PUBLIC_STRAPI_URL=https://api.mehmeterenozden.com
NEXT_TELEMETRY_DISABLED=1
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0
```

### 2. Docker Compose için Environment

`docker-compose.yml` içinde environment değişkenlerini ayarlayın veya `.env` dosyası oluşturun:

```bash
# .env dosyası (docker-compose.yml ile aynı dizinde)
NEXT_PUBLIC_STRAPI_URL=https://api.mehmeterenozden.com
```

---

## ⚙️ Next.js Konfigürasyonu

### 1. `next.config.ts` Production Ayarları

Aşağıdaki değişiklikleri yapın:

```typescript
const nextConfig: NextConfig = {
  // Production için Turbopack devre dışı (sadece dev modda kullanılır)
  
  // Standalone output - Docker için optimize
  output: 'standalone',
  
  // Image optimization
  images: {
    unoptimized: false,  // Production'da false yapın
    remotePatterns: [
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
  
  // Production için güvenlik
  poweredByHeader: false,
  
  // Compression
  compress: true,
};
```

### 2. Package.json Build Script

Build script'inin doğru olduğundan emin olun:

```json
{
  "scripts": {
    "dev": "next dev --turbopack -p 3001",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  }
}
```

---

## 🐳 Docker ile Deployment

### 1. Docker Image Build

```bash
# Image'ı build edin
docker build -t erenozden-frontend:latest .

# Başarılı build'i kontrol edin
docker images | grep erenozden-frontend
```

### 2. Docker Compose ile Çalıştırma

```bash
# Servisleri başlatın (detached mode)
docker-compose up -d

# Logları kontrol edin
docker-compose logs -f frontend

# Container durumunu kontrol edin
docker-compose ps
```

### 3. Docker Komutları

```bash
# Servisleri durdurma
docker-compose down

# Yeniden build ile başlatma
docker-compose up -d --build

# Belirli bir servisi restart
docker-compose restart frontend

# Container içine giriş
docker-compose exec frontend sh
```

---

## 🌐 Nginx Konfigürasyonu

### 1. Nginx Klasör Yapısı

```
nginx/
├── nginx.conf           # Ana konfigürasyon
├── conf.d/
│   └── default.conf     # Site konfigürasyonu
└── ssl/                 # SSL sertifikaları (oluşturulacak)
    ├── fullchain.pem
    └── privkey.pem
```

### 2. Nginx Test ve Reload

```bash
# Konfigürasyon testi
docker-compose exec nginx nginx -t

# Nginx reload (config değişikliklerinden sonra)
docker-compose exec nginx nginx -s reload
```

### 3. Rate Limiting Ayarları

`nginx.conf` içinde rate limiting aktif:

- **General:** 10 request/second (burst: 20)
- **API:** 30 request/second

Gerekirse bu değerleri artırın/azaltın.

---

## 🔒 SSL Sertifikası (Let's Encrypt)

### 1. Certbot ile SSL Kurulumu

```bash
# Certbot yükleyin
sudo apt-get update
sudo apt-get install certbot

# SSL sertifikası oluşturun (Standalone mode)
sudo certbot certonly --standalone -d mehmeterenozden.com -d www.mehmeterenozden.com

# Sertifikaları nginx klasörüne kopyalayın
sudo cp /etc/letsencrypt/live/mehmeterenozden.com/fullchain.pem ./nginx/ssl/
sudo cp /etc/letsencrypt/live/mehmeterenozden.com/privkey.pem ./nginx/ssl/
sudo chmod 644 ./nginx/ssl/*.pem
```

### 2. Nginx HTTPS Konfigürasyonunu Aktif Etme

`nginx/conf.d/default.conf` dosyasında:

1. HTTPS server bloğundaki yorumları kaldırın
2. HTTP to HTTPS redirect'i aktif edin
3. SSL sertifika yollarını doğrulayın

```bash
# Nginx'i reload edin
docker-compose restart nginx
```

### 3. SSL Otomatik Yenileme

```bash
# Cron job ekleyin (her gün 2:00'da kontrol)
sudo crontab -e

# Aşağıdaki satırı ekleyin:
0 2 * * * certbot renew --quiet --deploy-hook "docker-compose -f /path/to/docker-compose.yml restart nginx"
```

---

## ⚡ Performans Optimizasyonları

### 1. Next.js Image Optimization

`next.config.ts` içinde `unoptimized: false` yapın (production için).

### 2. Static Asset Caching

Nginx konfigürasyonunda cache ayarları aktif:

- `/_next/static`: 1 yıl cache
- `/_next/image`: 7 gün cache
- `/public`: 7 gün cache

### 3. Gzip Compression

Nginx'te gzip aktif (level 6). Gerekirse `gzip_comp_level` değerini 4-5'e düşürün (CPU kullanımı azalır).

### 4. Connection Keepalive

Nginx'te `keepalive_timeout: 65s` ve upstream'de `keepalive 64` aktif.

---

## ✅ Production Checklist

### Pre-Deployment

- [ ] `.env.production` dosyası oluşturuldu ve production URL'leri eklendi
- [ ] `next.config.ts` içinde `output: 'standalone'` eklendi
- [ ] `next.config.ts` içinde `unoptimized: false` yapıldı
- [ ] Domain DNS ayarları yapıldı (A Record)
- [ ] Sunucuda Docker ve Docker Compose yüklü
- [ ] Güvenlik duvarı ayarları yapıldı (80, 443, 22 portları)

### Deployment

- [ ] Docker image başarıyla build edildi
- [ ] `docker-compose up -d` ile servisler başlatıldı
- [ ] Frontend container çalışıyor (`docker-compose ps`)
- [ ] Nginx container çalışıyor
- [ ] HTTP üzerinden site erişilebilir (http://mehmeterenozden.com)

### SSL & HTTPS

- [ ] Let's Encrypt sertifikası oluşturuldu
- [ ] Sertifikalar `nginx/ssl/` klasörüne kopyalandı
- [ ] Nginx HTTPS konfigürasyonu aktif edildi
- [ ] HTTP to HTTPS redirect çalışıyor
- [ ] SSL Labs test: A+ rating (https://www.ssllabs.com/ssltest/)

### Testing

- [ ] Ana sayfa yükleniyor
- [ ] Tüm bölümler görüntüleniyor (Hero, About, Services, Portfolio, Contact, etc.)
- [ ] Strapi API'den projeler çekiliyor
- [ ] Görseller yükleniyor
- [ ] Responsive tasarım çalışıyor (mobil/tablet/desktop)
- [ ] GSAP animasyonlar çalışıyor
- [ ] Form gönderimi çalışıyor (eğer backend varsa)

### Performance

- [ ] Google PageSpeed Insights: 90+ skor
- [ ] First Contentful Paint < 1.8s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Time to Interactive < 3.8s
- [ ] Cumulative Layout Shift < 0.1

### Security

- [ ] HTTPS zorunlu
- [ ] Security headers aktif (X-Frame-Options, X-Content-Type-Options, etc.)
- [ ] Rate limiting çalışıyor
- [ ] Sensitive dosyalar (.env, vb.) public'e erişilemiyor

---

## 📊 Monitoring ve Logging

### 1. Docker Logs

```bash
# Tüm servislerin logları
docker-compose logs -f

# Sadece frontend logları
docker-compose logs -f frontend

# Son 100 satır
docker-compose logs --tail=100 frontend

# Belirli bir zaman aralığı
docker-compose logs --since 30m frontend
```

### 2. Nginx Access Logs

```bash
# Nginx access log
docker-compose exec nginx tail -f /var/log/nginx/access.log

# Nginx error log
docker-compose exec nginx tail -f /var/log/nginx/error.log
```

### 3. System Resource Monitoring

```bash
# Container resource kullanımı
docker stats

# Disk kullanımı
docker system df

# Temizlik (kullanılmayan image/container/volume)
docker system prune -a
```

### 4. Uptime Monitoring (Önerilen Servisler)

- **UptimeRobot** (https://uptimerobot.com) - Ücretsiz
- **Better Uptime** (https://betteruptime.com) - Ücretsiz plan
- **Pingdom** (https://www.pingdom.com)

---

## 🔄 Güncelleme ve Bakım

### 1. Kod Güncellemesi

```bash
# Git'ten son değişiklikleri çek
git pull origin main

# Docker image'ı yeniden build et
docker-compose build --no-cache frontend

# Servisleri yeniden başlat
docker-compose up -d
```

### 2. Sıfır Downtime Deployment (Blue-Green)

```bash
# Yeni image build et
docker-compose build frontend

# Yeni container'ı başlat (port mapping değiştirerek)
docker-compose up -d --no-deps --scale frontend=2 frontend

# Eski container'ı kapat
docker-compose up -d --no-deps --scale frontend=1 frontend
```

### 3. Database Backup (Strapi için)

Strapi kullanıyorsanız backend'de düzenli backup alın:

```bash
# PostgreSQL backup örneği
docker exec strapi-db pg_dump -U postgres strapi > backup_$(date +%Y%m%d).sql
```

---

## 🆘 Sorun Giderme

### 1. Frontend Container Başlamıyor

```bash
# Container loglarını kontrol edin
docker-compose logs frontend

# Node.js memory limiti artırın (docker-compose.yml)
environment:
  - NODE_OPTIONS="--max-old-space-size=4096"
```

### 2. Nginx 502 Bad Gateway

```bash
# Upstream bağlantısını kontrol edin
docker-compose exec nginx ping frontend

# Frontend container çalışıyor mu?
docker-compose ps frontend
```

### 3. Strapi API'den Veri Gelmiyor

```bash
# Environment variable kontrol
docker-compose exec frontend printenv | grep STRAPI

# API erişim testi
docker-compose exec frontend wget -O- $NEXT_PUBLIC_STRAPI_URL/api/projects
```

### 4. SSL Sertifikası Hatası

```bash
# Sertifika dosyalarını kontrol
ls -la nginx/ssl/

# Sertifika geçerlilik tarihi
openssl x509 -in nginx/ssl/fullchain.pem -noout -dates

# Certbot yenileme
sudo certbot renew --force-renewal
```

---

## 📚 Ek Kaynaklar

- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Nginx Security Headers](https://securityheaders.com/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)

---

## 📞 Destek

Sorun yaşarsanız:

1. Bu dokümantasyondaki troubleshooting bölümünü kontrol edin
2. Docker ve Nginx loglarını inceleyin
3. GitHub Issues açın veya iletişime geçin

---

**Son Güncelleme:** 18 Haziran 2026

**Hazırlayan:** Claude (Cursor AI)
