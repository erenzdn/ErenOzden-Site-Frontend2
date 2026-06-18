# ⚡ Hızlı Başlangıç - Production Deployment

Bu kılavuz, projeyi canlıya almak için gereken minimum adımları içerir.

---

## 🎯 Hızlı Kurulum (5 Dakika)

### 1. Gereksinimler

```bash
# Docker ve Docker Compose yüklü olmalı
docker --version
docker-compose --version
```

### 2. Ortam Değişkenlerini Ayarla

```bash
# .env.production dosyasını düzenle
cp .env.example .env.production
nano .env.production

# NEXT_PUBLIC_STRAPI_URL değerini production URL'iniz ile değiştirin
# Örnek: NEXT_PUBLIC_STRAPI_URL=https://api.mehmeterenozden.com
```

### 3. Deploy Et

**Linux/Mac:**
```bash
chmod +x deploy.sh
./deploy.sh
```

**Windows:**
```powershell
.\deploy.ps1
```

**Manuel:**
```bash
docker-compose build
docker-compose up -d
```

### 4. Kontrol Et

```bash
# Servislerin durumunu kontrol et
docker-compose ps

# Logları izle
docker-compose logs -f

# Tarayıcıda aç
# http://YOUR_SERVER_IP veya http://localhost
```

---

## 🔒 SSL Sertifikası Ekle (Opsiyonel)

### 1. DNS Ayarları

Domain'inizin A record'unu sunucunuzun IP adresine yönlendirin:

```
A    mehmeterenozden.com       → YOUR_SERVER_IP
A    www.mehmeterenozden.com   → YOUR_SERVER_IP
```

### 2. SSL Kurulumu

```bash
chmod +x setup-ssl.sh
./setup-ssl.sh mehmeterenozden.com
```

### 3. Nginx HTTPS'i Aktif Et

`nginx/conf.d/default.conf` dosyasını düzenleyin:

1. HTTPS server bloğundaki `#` işaretlerini kaldırın
2. HTTP to HTTPS redirect'i aktif edin
3. Nginx'i yeniden başlatın:

```bash
docker-compose restart nginx
```

### 4. Test Et

```
https://mehmeterenozden.com
```

---

## 🛠️ Faydalı Komutlar

```bash
# Servisleri durdur
docker-compose down

# Logları görüntüle
docker-compose logs -f frontend
docker-compose logs -f nginx

# Yeniden başlat
docker-compose restart

# Yeniden build et
docker-compose up -d --build

# Temizlik (dikkatli kullanın!)
docker-compose down -v
docker system prune -a
```

---

## 📊 Durum Kontrolü

```bash
# Container durumları
docker-compose ps

# Resource kullanımı
docker stats

# Health check
curl http://localhost/health

# SSL test (SSL kurulumu sonrası)
curl -I https://mehmeterenozden.com
```

---

## 🐛 Sorun Giderme

### Frontend başlamıyor

```bash
# Logları kontrol et
docker-compose logs frontend

# Yeniden başlat
docker-compose restart frontend
```

### Nginx 502 hatası

```bash
# Frontend çalışıyor mu?
docker-compose ps frontend

# Nginx logları
docker-compose logs nginx

# Upstream bağlantısını test et
docker-compose exec nginx ping frontend
```

### Strapi'den veri gelmiyor

```bash
# Environment variable kontrolü
docker-compose exec frontend printenv | grep STRAPI

# .env.production dosyasını kontrol et
cat .env.production
```

---

## 📚 Detaylı Dokümantasyon

Daha fazla bilgi için:
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Kapsamlı deployment kılavuzu
- **[DOCUMENTATION.md](./DOCUMENTATION.md)** - Proje dokümantasyonu

---

## ✅ Production Checklist

- [ ] `.env.production` dosyası oluşturuldu ve production URL'leri eklendi
- [ ] Docker ve Docker Compose yüklü
- [ ] Domain DNS ayarları yapıldı (SSL için)
- [ ] `docker-compose up -d` ile servisler başlatıldı
- [ ] Site HTTP üzerinden erişilebilir
- [ ] SSL sertifikası kuruldu (opsiyonel)
- [ ] HTTPS üzerinden erişilebilir (opsiyonel)
- [ ] Strapi API'den projeler çekiliyor
- [ ] Tüm bölümler düzgün yükleniyor

---

**🎉 Tebrikler! Projeniz canlıda!**

Sorularınız için: [Issues](https://github.com/your-repo/issues)
