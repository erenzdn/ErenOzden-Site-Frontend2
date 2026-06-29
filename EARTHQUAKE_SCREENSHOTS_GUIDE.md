# Earthquake Check - Ekran Görüntüsü Rehberi

## 🎯 Alınması Gereken Görüntüler

### 1. Ana Sayfa Hero Section (Öncelikli)
- **URL:** https://earthquakecheck.mehmeterenozden.com/
- **Boyut:** 1920x1080 (Full HD)
- **Alan:** Hero section + "Deprem Konsolu" bölümü
- **İpucu:** Sayfayı yeni açtığınızda ilk görünen alanı çekin

### 2. Canlı CBS Bağlantı Ekranı
- **Odak:** "COĞRAFİ BİLGİ SİSTEMLERİ (CBS) CANLI BAĞLANTI" kartı
- **Boyut:** 1920x1080
- **Özellik:** Sismik PGA ivmesi ve canlı deprem verilerinin göründüğü alan

### 3. Özellikler Bölümü
- **Odak:** "Gelişmiş Ön Analiz Altyapısı" kartları
- **Boyut:** 1920x1080
- **Alan:** 4 özellik kartını içeren section

### 4. Analiz Formu (Opsiyonel)
- **Odak:** "Deprem Risk Analizi" formu
- **Boyut:** 1200x800
- **Alan:** Form adımlarının görünür olduğu kısım

---

## 🛠️ Önerilen Araçlar

### Windows İçin:
1. **Snipping Tool** (Windows 11)
   - Win + Shift + S kısayolu
   - Tam sayfa capture için Scrolling Window modu

2. **ShareX** (Ücretsiz, Profesyonel)
   - https://getsharex.com/
   - Tam sayfa scroll screenshot destekler
   - Otomatik dosya adlandırma

3. **Chrome DevTools**
   - F12 > Ctrl+Shift+P > "Capture full size screenshot"
   - En net sonuç için önerilir

---

## 📐 Teknik Özellikler

- **Format:** PNG (en kaliteli) veya JPG (optimize)
- **Boyut:** Minimum 1920px genişlik (Retina display için 2560px ideal)
- **Aspect Ratio:** 16:9 (Hero için) veya 4:3 (Form için)
- **Dosya Adı:** `earthquake-check-hero.png`, `earthquake-check-features.png`, vb.

---

## 💡 Tasarım İpuçları

1. **Zamanlamaya Dikkat:**
   - Animasyonlar tamamlandıktan sonra çekin
   - Canlı veri yüklendiğinden emin olun

2. **Temiz Görünüm:**
   - Tarayıcı araç çubuğunu gizleyin (F11 tam ekran)
   - Developer tools kapalı olsun
   - Mouse cursor görünmesin

3. **Mobil Görünümler:**
   - Chrome DevTools ile 390x844 (iPhone 13 Pro) boyutunda mobil screenshot alabilirsiniz
   - Responsive tasarımı göstermek için faydalı olabilir

---

## 📁 Önerilen Klasör Yapısı

```
public/
  projects/
    earthquake-check/
      hero.png          (Ana görüntü - Strapi'de ana image olarak)
      dashboard.png     (Dashboard/Konsol ekranı)
      features.png      (Özellikler bölümü)
      form.png          (Analiz formu)
      mobile-hero.png   (Mobil görünüm - opsiyonel)
```

---

## 🚀 Hızlı Başlangıç

### Chrome ile Tam Sayfa Screenshot (En Kolay):
1. https://earthquakecheck.mehmeterenozden.com/ adresini açın
2. F12 tuşuna basın (DevTools açılır)
3. Ctrl + Shift + P tuşlarına basın
4. "Capture full size screenshot" yazın
5. Enter'a basın
6. Otomatik indirilir!

---

## ✅ Tamamlandıktan Sonra

Görüntüleri aldıktan sonra:
1. `public/projects/earthquake-check/` klasörüne kaydedin
2. Strapi Admin Panel'den EarthquakeCheck projesini açın
3. Image/Thumbnail alanlarına yükleyin
4. Projeyi "Publish" durumuna getirin
