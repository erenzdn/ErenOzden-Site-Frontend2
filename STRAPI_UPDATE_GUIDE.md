# 🚀 Earthquake Check - Strapi Güncelleme Rehberi

## 📊 Strapi Admin Panel'e Giriş

1. **Strapi Admin URL:** https://api.mehmeterenozden.com/admin
2. Admin hesabınızla giriş yapın
3. Sol menüden **Content Manager > Projects** seçin
4. Mevcut "EarthquakeCheck" veya "Earthquake Check" projesini bulun ve açın

---

## 📝 Güncellenecek Alanlar

### 🔤 Temel Bilgiler

#### **Slug** (URL için önemli)
```
earthquake-check
```
> ⚠️ Slug'ı değiştirirseniz URL'ler değişir, dikkatli olun!

#### **Title (Başlık)**
```
EarthquakeCheck - Deprem Risk Analizi
```

#### **Description (Kısa Açıklama)**
```
Modern sismik modellerle binaların deprem risk durumunu ücretsiz raporlayan, TÜBİTAK destekli sosyal sorumluluk projesi. Gelişmiş CBS teknolojisi ile 3 dakikada anında risk analizi.
```

---

### 📄 Detaylı İçerik

#### **Content (Uzun Açıklama)**
```
EarthquakeCheck, Türkiye'nin deprem realitesinde yapıların güvenliğini modern bilimsel yöntemlerle değerlendiren ücretsiz bir ön analiz platformudur.

TÜBİTAK tarafından desteklenen bu sosyal sorumluluk girişimi, vatandaşların yaşadığı binaların deprem risk durumu hakkında hızlı ve şeffaf bilgi edinmesini sağlar.

Platform Özellikleri:
• Gelişmiş CBS (Coğrafi Bilgi Sistemleri) entegrasyonu ile gerçek zamanlı konum analizi
• Türkiye Deprem Haritaları ve diri fay hatları verileriyle çapraz kontrol
• Sismik ivme (PGA) hesaplamaları ve zemin sınıfı değerlendirmesi
• Türkiye Bina Deprem Yönetmeliği standartlarına uygun algoritma motoru
• KVKK uyumlu, veri kaydetmeyen güvenli mimari
• 3 dakikada detaylı PDF rapor çıktısı
• Tamamen ücretsiz, kayıt gerektirmeyen kullanım

Sistem, kullanıcıların girdiği adres ve bina bilgilerini (inşa yılı, kat sayısı) anlık olarak işleyerek A'dan F'ye derecelendirilmiş risk skoru sunar. Bu sayede vatandaşlar, pahalı teknik raporlara geçmeden önce yapılarının durumu hakkında bilimsel bir ön fikir edinir.

Sosyal Etki: Proje, deprem farkındalığını artırmayı ve halkın bilinçli kararlar almasına yardımcı olmayı amaçlar.
```

---

### 🛠️ Teknolojiler

#### **Tech Stack / Technologies**
Strapi'de virgülle ayrılmış veya array olarak girebilirsiniz:

```
Next.js, TypeScript, React, Tailwind CSS, GIS APIs, Google Maps API, PDF Generation, REST APIs, Vercel, PostgreSQL, AFAD API
```

veya array formatında:
```json
[
  "Next.js",
  "TypeScript",
  "React",
  "Tailwind CSS",
  "GIS APIs",
  "Google Maps API",
  "PDF Generation",
  "REST APIs",
  "Vercel",
  "PostgreSQL",
  "AFAD API"
]
```

---

### 🔗 URL'ler

#### **Live URL / Project URL**
```
https://earthquakecheck.mehmeterenozden.com/
```

#### **GitHub URL**
```
# (Eğer private değilse GitHub repo URL'inizi ekleyin)
# Örnek: https://github.com/erenzdn/earthquake-check
```

---

### 🖼️ Görseller

#### **Thumbnail (Liste görünümü için)**
- **Boyut:** 800x600 veya 1200x800 (16:9 veya 4:3)
- **Dosya:** `earthquake-check-hero.png` veya `earthquake-check-card.png`
- **Önerilen:** Hero section'ın kırpılmış/optimize edilmiş versiyonu

#### **Image (Detay sayfası için)**
- **Boyut:** 1920x1080 veya daha büyük
- **Dosya:** `earthquake-check-hero.png` (Ana hero section görüntüsü)
- **İçerik:** Sitenin en etkileyici ve bilgi verici ekranı

#### **Gallery (Opsiyonel - Eğer Strapi'de varsa)**
- Farklı ekranların screenshots'ları
- Dashboard, form, features, mobile vb.

---

## 🎨 Tasarım Optimizasyonu Önerileri

### Görüntü Dosyalarını Optimize Edin

#### Online Araçlar:
1. **TinyPNG** - https://tinypng.com/
   - PNG dosyalarını %70 küçültür, kalite kaybı minimum
   
2. **Squoosh** - https://squoosh.app/
   - Google'ın gelişmiş sıkıştırma aracı
   - WebP formatına çevirme desteği

3. **SVGOMG** - https://jakearchibald.github.io/svgomg/
   - SVG dosyaları için (eğer logo/icon varsa)

### Önerilen Format ve Boyutlar:

| Kullanım | Format | Boyut | Kalite |
|----------|--------|-------|--------|
| Thumbnail (Card) | JPG/WebP | 800x600 | 85% |
| Main Image (Hero) | JPG/WebP | 1920x1080 | 90% |
| Gallery Images | JPG/WebP | 1200x800 | 85% |
| Logo/Icons | SVG/PNG | Orijinal | - |

---

## ✅ Kontrol Listesi

Strapi güncellemesini yaptıktan sonra kontrol edin:

- [ ] Slug doğru mu? (`earthquake-check`)
- [ ] Başlık Türkçe ve açıklayıcı mı?
- [ ] Açıklama 150-200 karakter arasında mı?
- [ ] Detaylı içerik yeterince bilgilendirici mi?
- [ ] Tech stack doğru girilmiş mi?
- [ ] Live URL çalışıyor mu?
- [ ] Thumbnail yüklenmiş mi? (800x600 ideal)
- [ ] Ana image yüklenmiş mi? (1920x1080 ideal)
- [ ] Proje "Published" durumunda mı?
- [ ] Locale seçimi doğru mu? (TR için `tr`, EN için `en`)

---

## 🌐 Çoklu Dil Desteği (Opsiyonel)

Eğer Strapi'de Internationalization (i18n) aktifse:

### İngilizce Versiyon Ekleyin:
1. Projeyi açın
2. Sağ üstten "Create new locale" seçin
3. `en` seçin
4. Aşağıdaki İngilizce içeriği girin:

#### **Title (EN)**
```
EarthquakeCheck - Earthquake Risk Analysis
```

#### **Description (EN)**
```
A TÜBİTAK-supported social responsibility project that provides free earthquake risk assessment for buildings using modern seismic models. Instant risk analysis in 3 minutes with advanced GIS technology.
```

#### **Content (EN)**
```
EarthquakeCheck is a free preliminary analysis platform that assesses building safety in Turkey's earthquake reality using modern scientific methods.

Supported by TÜBİTAK, this social responsibility initiative enables citizens to quickly and transparently obtain information about the earthquake risk status of their buildings.

Platform Features:
• Real-time location analysis with advanced GIS (Geographic Information Systems) integration
• Cross-verification with Turkey Earthquake Maps and active fault line data
• Seismic acceleration (PGA) calculations and soil class assessment
• Algorithm engine compliant with Turkish Building Earthquake Code standards
• Secure, KVKK-compliant architecture that doesn't store data
• Detailed PDF report output in 3 minutes
• Completely free, no registration required

The system processes user-entered address and building information (construction year, number of floors) instantly, providing a risk score graded from A to F. This allows citizens to gain scientific preliminary insight into their building's condition before proceeding with expensive technical reports.

Social Impact: The project aims to increase earthquake awareness and help the public make informed decisions.
```

---

## 🔄 Güncelleme Sonrası Test

1. **Frontend Kontrolü:**
   ```bash
   # Terminalden çalıştırın
   npm run dev
   ```

2. **Portfolio Sayfasını Kontrol Edin:**
   - http://localhost:3000/tr/portfolio
   - Earthquake Check kartının göründüğünden emin olun

3. **Detay Sayfasını Kontrol Edin:**
   - http://localhost:3000/tr/portfolio/earthquake-check
   - Tüm bilgilerin doğru göründüğünden emin olun

4. **Görselleri Kontrol Edin:**
   - Görseller yükleniyor mu?
   - Mobilde düzgün görünüyor mu?
   - Hover efektleri çalışıyor mu?

---

## 🚨 Sorun Giderme

### Proje Görünmüyorsa:
1. Strapi'de projenin "Published" olduğundan emin olun
2. Cache'i temizleyin: `.next` klasörünü silin ve `npm run dev` çalıştırın
3. Strapi API erişimini kontrol edin: https://api.mehmeterenozden.com/api/projects

### Görseller Yüklenmiyorsa:
1. Strapi Media Library'de dosyaların yüklendiğinden emin olun
2. Dosya izinlerini kontrol edin
3. URL'lerin doğru olduğunu kontrol edin (`pickStrapiImageUrl` fonksiyonu)

### 404 Hatası Alıyorsanız:
1. `slug` değerinin doğru olduğundan emin olun
2. `generateStaticParams` fonksiyonunu kontrol edin
3. Dev server'ı yeniden başlatın

---

## 📞 İletişim

Herhangi bir sorunla karşılaşırsanız:
- Strapi loglarını kontrol edin
- Next.js console'u kontrol edin (F12 > Console)
- Network sekmesinden API isteklerini inceleyin

---

## 🎯 Sonraki Adımlar

1. ✅ Ekran görüntülerini alın (`EARTHQUAKE_SCREENSHOTS_GUIDE.md`'ye bakın)
2. ✅ Görselleri optimize edin (TinyPNG/Squoosh)
3. ✅ Strapi'de projeyi bu rehbere göre güncelleyin
4. ✅ Görselleri yükleyin
5. ✅ Projeyi "Publish" edin
6. ✅ Frontend'de kontrol edin
7. ✅ Production'a deploy edin

---

**Not:** Bu rehber, mevcut Next.js + Strapi yapınız için özelleştirilmiştir. Strapi'deki alan isimleri farklıysa (`techStack` vs `technologies`, `liveUrl` vs `projectUrl` gibi), ilgili alanları kendiniz eşleştirin.

**Başarılar! 🚀**
