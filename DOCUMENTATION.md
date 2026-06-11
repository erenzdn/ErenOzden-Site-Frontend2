# ERENOZDEN-FRONTEND — Proje Dokümantasyonu

> **Eren Özden** kişisel portfolyo web sitesinin kapsamlı teknik dokümantasyonu.

---

## İçindekiler

1. [Proje Özeti](#1-proje-özeti)
2. [Teknoloji Yığını (Tech Stack)](#2-teknoloji-yığını-tech-stack)
3. [Proje Yapısı (Dosya Ağacı)](#3-proje-yapısı-dosya-ağacı)
4. [Yapılandırma Dosyaları](#4-yapılandırma-dosyaları)
5. [Tema ve Stil Sistemi](#5-tema-ve-stil-sistemi)
6. [Layout Bileşenleri](#6-layout-bileşenleri)
7. [UI Bileşenleri](#7-ui-bileşenleri)
8. [Bölüm (Section) Bileşenleri](#8-bölüm-section-bileşenleri)
9. [Hook'lar](#9-hooklar)
10. [Yardımcı Kütüphane (Lib)](#10-yardımcı-kütüphane-lib)
11. [Routing Yapısı](#11-routing-yapısı)
12. [Durum Yönetimi (State Management)](#12-durum-yönetimi-state-management)
13. [API Entegrasyonu](#13-api-entegrasyonu)
14. [Animasyon Mimarisi](#14-animasyon-mimarisi)
15. [Sayfa Akışı (Render Sırası)](#15-sayfa-akışı-render-sırası)
16. [Tekrarlayan Sabitler ve İletişim Bilgileri](#16-tekrarlayan-sabitler-ve-iletişim-bilgileri)
17. [Bilinen Sorunlar ve İyileştirme Önerileri](#17-bilinen-sorunlar-ve-iyileştirme-önerileri)

---

## 1. Proje Özeti

Bu proje, **Eren Özden** isimli bir bilgisayar mühendisinin kişisel portfolyo/tanıtım web sitesidir. Türkçe metinli, koyu temalı, tek sayfalık (SPA) bir tasarıma sahiptir.

- **Tür:** Kişisel portfolyo / tanıtım sitesi
- **Dil:** Türkçe
- **Sayfa sayısı:** 1 (tek sayfa — bölümler arası hash navigasyon)
- **Tema:** Koyu (dark) — yeşil-sarı (#c9f31d) vurgu rengi
- **Proje adı:** `erenozden-frontend`
- **Versiyon:** `0.1.0`

---

## 2. Teknoloji Yığını (Tech Stack)

| Kategori | Teknoloji | Versiyon |
|----------|-----------|----------|
| Framework | Next.js (App Router) | 16.2.3 |
| UI Kütüphanesi | React | 19.2.4 |
| Dil | TypeScript | ^5 |
| Stil | Tailwind CSS v4 | ^4 |
| Animasyon (React entegrasyonu) | @gsap/react | ^2.1.2 |
| Animasyon | GSAP (GreenSock) | ^3.14.2 |
| Smooth scroll | Lenis | ^1.3.21 |
| İkonlar | lucide-react | ^1.8.0 |
| Linting | ESLint + eslint-config-next | ^9 / 16.2.3 |
| PostCSS | @tailwindcss/postcss | ^4 |

### npm Script'leri

| Komut | Açıklama |
|-------|----------|
| `npm run dev` | Geliştirme sunucusu (Turbopack ile) |
| `npm run build` | Üretim derlemesi |
| `npm run start` | Üretim sunucusu |
| `npm run lint` | ESLint kontrol |

---

## 3. Proje Yapısı (Dosya Ağacı)

```
ERENOZDEN-FRONTEND/
├── public/                         # Statik dosyalar (SVG'ler)
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── layout.tsx              # Kök layout (metadata + fontlar)
│   │   ├── page.tsx                # Ana sayfa (tüm bölümler)
│   │   └── globals.css             # Global stiller + Tailwind tema
│   ├── components/
│   │   ├── layout/                 # Yapısal bileşenler
│   │   │   ├── Header.tsx          # Navigasyon çubuğu
│   │   │   └── Footer.tsx          # Alt bilgi
│   │   ├── sections/               # Sayfa bölümleri
│   │   │   ├── Preloader.tsx       # Yükleme animasyonu
│   │   │   ├── Hero.tsx            # Ana giriş bölümü
│   │   │   ├── Marquee.tsx         # Kayan yazı bandı
│   │   │   ├── About.tsx           # Hakkımda
│   │   │   ├── Services.tsx        # Hizmetler
│   │   │   ├── Portfolio.tsx       # Projeler (Strapi API)
│   │   │   ├── Testimonials.tsx    # Referanslar/Yorumlar
│   │   │   ├── Stats.tsx           # İstatistikler
│   │   │   ├── Contact.tsx         # İletişim formu
│   │   │   ├── Blog.tsx            # Blog kartları
│   │   │   └── CTA.tsx             # Aksiyon çağrısı
│   │   └── ui/                     # Yeniden kullanılabilir UI
│   │       ├── Button.tsx          # Buton bileşeni
│   │       └── SectionTitle.tsx    # Bölüm başlığı
│   ├── hooks/
│   │   └── useGsap.ts             # GSAP scroll animasyon hook'ları
│   └── lib/
│       └── animations.ts          # GSAP animasyon yardımcıları
├── package.json
├── next.config.ts
├── tsconfig.json
├── postcss.config.mjs
├── eslint.config.mjs
└── .gitignore
```

---

## 4. Yapılandırma Dosyaları

### `next.config.ts`
- **Turbopack:** `root` olarak proje dizini tanımlı — geliştirme modunda Turbopack kullanılır.
- **Remote Images:** `http://localhost:1337/uploads/**` pattern'i ile Strapi medya dosyalarının `next/image` ile kullanılmasına izin verilir.

### `tsconfig.json`
- **Strict mode** aktif
- **Path alias:** `@/*` → `./src/*` (tüm import'larda `@/components/...` şeklinde kullanılır)
- **Target:** ES2017
- **JSX:** `react-jsx` (React import'u gerekmez)

### `postcss.config.mjs`
- Yalnızca `@tailwindcss/postcss` eklentisi — Tailwind v4 CSS-first yapılandırma.
- Ayrı bir `tailwind.config.js` dosyası **yoktur**; tema doğrudan `globals.css` içinde tanımlıdır.

### `eslint.config.mjs`
- `eslint-config-next` (core-web-vitals + typescript kuralları)
- `.next`, `out`, `build`, `next-env.d.ts` dosyaları ignore edilir.

---

## 5. Tema ve Stil Sistemi

### `src/app/globals.css`

Tailwind CSS v4 kullanılır. Tema, CSS `@theme inline` direktifi ile tanımlanmıştır:

#### Renk Paleti

| Token | Değer | Kullanım |
|-------|-------|----------|
| `--color-primary` | `#c9f31d` | Ana vurgu rengi (yeşil-sarı) |
| `--color-primary-dark` | `#a8cc18` | Primary hover tonu |
| `--color-dark` | `#0d0d0d` | Sayfa arka planı |
| `--color-dark-light` | `#1a1a1a` | Kart/input arka planları |
| `--color-dark-lighter` | `#2a2a2a` | Scrollbar, kenarlıklar |
| `--color-gray` | `#888888` | İkincil metin |
| `--color-gray-light` | `#b0b0b0` | Açıklama metinleri |
| `--color-white` | `#ffffff` | Birincil metin |
| `--color-off-white` | `#f5f5f5` | Açık arka planlar |

#### Fontlar

| Değişken | Font | Kullanım |
|----------|------|----------|
| `--font-heading` | Syne (400–800) | Başlıklar, logo, navigasyon |
| `--font-body` | DM Sans (300–700) | Gövde metni, paragraflar |

#### Yardımcı CSS Sınıfları

| Sınıf | Açıklama |
|-------|----------|
| `.font-heading` | Başlık fontunu uygular |
| `.font-body` | Gövde fontunu uygular |
| `.text-gradient` | Yeşil-sarı gradient metin efekti |
| `.section-padding` | `padding: 100px 0` (mobilde `60px 0`) |

#### Genel Stiller
- `scroll-behavior: smooth` — hash navigasyonda yumuşak kaydırma
- `body` arka planı koyu (`--color-dark`), metin beyaz
- Özel scrollbar tasarımı (koyu tema ile uyumlu)
- `::selection` rengi primary yeşil-sarı

---

## 6. Layout Bileşenleri

### `Header.tsx` (162 satır)

Sayfanın üst kısmında yer alan navigasyon çubuğu.

**Özellikler:**
- **Üst bilgi çubuğu (Top Bar):** Yalnızca masaüstünde (lg+) görünür. E-posta ve telefon bilgisi içerir.
- **Sabit Navbar:** Scroll edildiğinde (>50px) arka plan bulanıklaşır ve gölge eklenir.
- **Logo:** "EREN" + "." — tıklandığında `#hero`'ya yönlendirir.
- **Masaüstü Menü:** 6 adet hash link (Ana Sayfa, Hakkımda, Hizmetler, Projeler, Blog, İletişim)
- **Mobil Menü:** Tam ekran overlay; hamburger ikonu ile açılır/kapanır.
- **CTA Butonu:** "İletişime Geç" — `#contact`'a yönlendirir.

**Navigasyon Linkleri:**

| Label | Hedef |
|-------|-------|
| Ana Sayfa | `#hero` |
| Hakkımda | `#about` |
| Hizmetler | `#services` |
| Projeler | `#portfolio` |
| Blog | `#blog` |
| İletişim | `#contact` |

**State Yönetimi:**
- `isScrolled` — scroll pozisyonu >50px mi?
- `isMobileOpen` — mobil menü açık mı?
- Mobil menü açıkken `body.overflow = "hidden"` ile arka plan scroll engellenir.

**Bağımlılıklar:** `lucide-react` (Menu, X, Mail, Phone, MapPin), `Button`

---

### `Footer.tsx` (206 satır)

Sayfanın alt bölümü.

**Bölümleri:**
1. **Bülten Alanı:** Logo, başlık, e-posta input + "Abone Ol" butonu (sadece UI — backend bağlantısı yok)
2. **Link Grid (4 sütun):**
   - **Hakkında:** Kısa tanıtım metni + sosyal medya ikonları (GitHub, LinkedIn, Twitter/X)
   - **Hizmetlerim:** Web, Mobil, Backend API, Veritabanı, DevOps linkleri
   - **Hızlı Erişim:** Sayfa bölümlerine hash linkler
   - **İletişim:** Telefon, konum, e-posta
3. **Telif:** Dinamik yıl + yasal linkler (henüz `#` ile placeholder)

**Yerel Bileşenler:** `GithubIcon`, `LinkedinIcon`, `TwitterIcon` — özel SVG ikon bileşenleri (dışa aktarılmaz).

---

## 7. UI Bileşenleri

### `Button.tsx` (57 satır)

Yeniden kullanılabilir buton bileşeni.

**Props:**

| Prop | Tip | Varsayılan | Açıklama |
|------|-----|------------|----------|
| `children` | `React.ReactNode` | — | Buton içeriği |
| `variant` | `"primary"` \| `"outline"` \| `"dark"` | `"primary"` | Görünüm stili |
| `href` | `string` | — | Varsa `<a>`, yoksa `<button>` render edilir |
| `onClick` | `() => void` | — | Tıklama olayı |
| `className` | `string` | — | Ek CSS sınıfları |
| `showArrow` | `boolean` | `true` | Ok ikonu gösterilsin mi? |

**Varyantlar:**
- **primary:** Yeşil-sarı arka plan, koyu metin
- **outline:** Şeffaf arka plan, beyaz kenarlık
- **dark:** Koyu arka plan, beyaz metin

---

### `SectionTitle.tsx` (50 satır)

Bölüm başlıkları için standart bileşen.

**Props:**

| Prop | Tip | Varsayılan | Açıklama |
|------|-----|------------|----------|
| `subtitle` | `string` | — | Üst etiket (pill şeklinde) |
| `title` | `string` | — | Ana başlık (h2) |
| `description` | `string` | — | Açıklama paragrafı |
| `align` | `"left"` \| `"center"` | `"left"` | Hizalama |
| `light` | `boolean` | `false` | Açık tema varyantı |

**Özellikler:**
- `data-animate="up"` attribute'u — GSAP scroll animasyonu için hazır
- Subtitle bir "pill" badge şeklinde gösterilir
- Light modda metin renkleri değişir

---

## 8. Bölüm (Section) Bileşenleri

### `Preloader.tsx` (83 satır)

Sayfa ilk yüklendiğinde görünen tam ekran yükleme animasyonu.

**Davranış:**
1. "LOADING" kelimesinin her harfi sırayla görünür (GSAP stagger)
2. Alt kısımda progress çizgisi genişler
3. Tamamlandığında overlay yukarı kayarak gizlenir
4. `body.overflow = "hidden"` ile sayfa scroll'u engellenir, animasyon bitince serbest bırakılır

**Animasyon Süresi:** ~2 saniye (harfler 0.6s + progress 1.2s + overlay çıkışı 0.8s)

---

### `Hero.tsx` (221 satır)

Ana giriş bölümü — sayfanın ilk görünen alanı.

**İçerik:**
- Sol taraf: Başlık, alt başlık ("Bilgisayar Mühendisi & Full Stack Geliştirici"), açıklama metni
- Sayaç animasyonu: 0'dan 920'ye (tamamlanan proje sayısı)
- İki CTA butonu: "Projelerimi Gör" + "Hakkımda"
- İletişim linkleri: E-posta ve telefon
- Sağ taraf: Dekoratif daire, "5+ Yıl Deneyim" sticker'ı

**Animasyon:** GSAP timeline — preloader'dan sonra (~2.2s gecikme) sırayla elemanlar görünür.

**ID:** `#hero`

---

### `Marquee.tsx` (101 satır)

Yatay kayan yazı bandı — iki farklı varyantla kullanılır.

**Props:**

| Prop | Değer | İçerik |
|------|-------|--------|
| `variant` | `"brands"` | Teknoloji isimleri: React, Next.js, Node.js, TypeScript, Python, PostgreSQL, Docker, AWS, Figma |
| `variant` | `"categories"` | İkon + etiket: Web Geliştirme, Mobil Uygulama, UI/UX Tasarım, Backend API, DevOps, Veritabanı |

**Animasyon:** GSAP `x` animasyonu ile sonsuz yatay kaydırma. İçerik iki kez kopyalanarak kesintisiz döngü sağlanır.

---

### `About.tsx` (156 satır)

Hakkımda bölümü — iki sütunlu düzen.

**Sol sütun:**
- Bölüm başlığı (SectionTitle: "Hakkımda")
- Tanıtım paragrafları
- Deneyim sayacı: 0→5 (yıl, GSAP animasyonu)
- Teknoloji pill'leri: React, Next.js, Node.js, TypeScript, Python, Docker
- CTA butonu: "Daha Fazla Bilgi"

**Sağ sütun:**
- Fotoğraf alanı placeholder ("EÖ" monogramı)

**ID:** `#about`

**Animasyon:** GSAP ScrollTrigger ile elemanlar scroll'a bağlı olarak görünür.

---

### `Services.tsx` (125 satır)

Sunulan hizmetlerin listelendiği bölüm.

**Hizmet Kartları (3 adet):**

| Hizmet | İkon | Özellikler |
|--------|------|------------|
| Web Geliştirme | Globe | Responsive Tasarım, SEO Optimizasyonu, Performans Odaklı, Modern Teknolojiler |
| Backend Geliştirme | Server | RESTful API, Veritabanı Yönetimi, Güvenlik, Ölçeklenebilirlik |
| Mobil Geliştirme | Smartphone | Cross-Platform, Native Performans, Kullanıcı Deneyimi, App Store Optimizasyonu |

**ID:** `#services`

**Animasyon:** GSAP ScrollTrigger ile kartlar stagger animasyonuyla görünür.

---

### `Portfolio.tsx` (290 satır)

Projelerin listelendiği bölüm — **Strapi CMS'den** dinamik veri çeker.

**API Detayları:**
- **Endpoint:** `GET http://localhost:1337/api/projects?populate=*`
- **Backend:** Strapi (headless CMS)
- **Veri Formatı:** Strapi v4/v5 uyumlu JSON parse

**State'ler:**
- `projects` — proje listesi
- `loading` — yükleniyor mu?
- `error` — hata mesajı

**Proje Kartı İçeriği:**
- Görsel (Strapi'den veya gradient placeholder)
- Başlık
- Açıklama (rich text → plain text dönüşümü)
- Teknoloji etiketleri
- Proje linki

**Hata Yönetimi:**
- Yükleme sırasında iskelet (skeleton) kartları gösterilir
- Hata durumunda mesaj + "Tekrar Dene" butonu

**Yerel Tipler:**
- `StrapiRichText` — Strapi rich text yapısı
- `StrapiProject` — Strapi proje objesi
- `Project` — parse edilmiş proje

**Yardımcı Fonksiyonlar:**
- `parseProject(item)` — Strapi yanıtını standart `Project` objesine dönüştürür
- `extractPlainText(richText)` — Rich text'ten düz metin çıkarır

**Sabit:** `STRAPI_URL = "http://localhost:1337"`, `GRADIENT_COLORS` (placeholder renkler dizisi)

**ID:** `#portfolio`

---

### `Testimonials.tsx` (200 satır)

Müşteri referansları / yorumları carousel bileşeni.

**Statik Veri (3 kayıt):**

| İsim | Rol | Şirket |
|------|-----|--------|
| Ahmet Yılmaz | CEO | TechStart |
| Zeynep Kaya | CTO | InnovateTR |
| Mehmet Demir | Product Manager | DigitalPlus |

**Özellikler:**
- Ok tuşları ile ileri/geri navigasyon
- Dot (nokta) göstergeleri
- Aktif referans kartı gösterilir
- Sayaç animasyonu: 0→32 "Mutlu Müşteri"

**Animasyon:** GSAP ile kart geçiş ve sayaç animasyonları.

---

### `Stats.tsx` (99 satır)

Rakamlarla özet istatistikler.

**İstatistikler:**

| Değer | Sonek | Etiket |
|-------|-------|--------|
| 5 | + | Yıl Deneyim |
| 920 | + | Tamamlanan Proje |
| 32 | | Mutlu Müşteri |
| 10 | K+ | Satır Kod |

**Animasyon:** GSAP ScrollTrigger — sayılar 0'dan hedef değere sayar, kartlar fade-in ile görünür.

**ID:** `#stats`

---

### `Contact.tsx` (171 satır)

İletişim bölümü — bilgi kartları ve form.

**Sol Sütun — İletişim Bilgileri:**

| Tür | Değer |
|-----|-------|
| Telefon | +90 555 123 45 67 |
| Konum | İstanbul, Türkiye |
| E-posta | info@erenozden.com |

**Sağ Sütun — İletişim Formu:**
- İsim input
- E-posta input
- Konu input
- Mesaj textarea
- Gönder butonu

> **Not:** Form `onSubmit` işlevi **henüz bağlanmamış** — yalnızca UI mevcuttur.

**ID:** `#contact`

---

### `Blog.tsx` (105 satır)

Blog yazıları bölümü — statik mock veri ile.

**Mock Blog Yazıları (3 adet):**

| Başlık | Kategori | Tarih |
|--------|----------|-------|
| Modern Web Geliştirmede Next.js'in Yeri | Web Geliştirme | 15 Mart 2024 |
| TypeScript ile Güvenli Kod Yazma | Programlama | 10 Mart 2024 |
| Docker ile Mikroservis Mimarisi | DevOps | 5 Mart 2024 |

**Animasyon:** GSAP ScrollTrigger ile `.blog-card` sınıflı kartlar stagger ile görünür.

**ID:** `#blog`

---

### `CTA.tsx` (88 satır)

Son aksiyon çağrısı bölümü — sayfanın alt kısmında.

**İçerik:**
- Büyük başlık: "Birlikte harika projeler yaratmaya hazır mısınız?"
- Açıklama metni
- CTA butonu: "Hemen İletişime Geçin"
- Dairesel ok linki

**Animasyon:** GSAP ile metin ve ok elementleri scroll'a bağlı görünür.

---

## 9. Hook'lar

### `useGsap.ts` (99 satır)

İki adet özel React hook'u içerir:

#### `useGsapScrollTrigger()`
- Bir ref container içindeki `[data-animate]` attribute'una sahip tüm elementlere otomatik GSAP animasyonu uygular.
- Desteklenen animasyon yönleri: `up`, `down`, `left`, `right`, `fade`, `scale`
- `data-delay` ve `data-duration` ile özelleştirilebilir
- ScrollTrigger ile scroll'a bağlı tetikleme

#### `useCountUp(target, triggerRef, duration?)`
- Bir sayıyı 0'dan hedefe kadar animate eder
- ScrollTrigger ile viewport'a girdiğinde tetiklenir
- Varsayılan süre: 2 saniye

> **Not:** Bu hook'lar şu an projede **aktif olarak kullanılmamaktadır**. Bölüm bileşenleri kendi GSAP kodlarını inline olarak yazmaktadır.

---

## 10. Yardımcı Kütüphane (Lib)

### `animations.ts` (63 satır)

Üç adet GSAP yardımcı fonksiyonu:

#### `animateStagger(containerSelector, itemSelector, options?)`
- Container tetikleyicili toplu giriş animasyonu
- ScrollTrigger ile bağlı

#### `animateCounter(element, target, duration?)`
- Sayı sayma animasyonu
- ScrollTrigger kullanmaz, doğrudan tetiklenir

#### `createMarquee(containerSelector, direction?, speed?)`
- Yatay sonsuz kaydırma animasyonu
- `x` ekseninde GSAP `to` animasyonu

> **Not:** Bu fonksiyonlar da şu an projede **aktif olarak kullanılmamaktadır**. Bölüm bileşenleri GSAP'i doğrudan kullanmaktadır.

---

## 11. Routing Yapısı

Proje **Next.js App Router** kullanır ancak yalnızca **tek bir sayfa** vardır:

```
src/app/
├── layout.tsx    → Kök layout (tüm sayfalar için)
└── page.tsx      → "/" rotası (ana sayfa)
```

- Alt sayfalar (`/about`, `/blog/[slug]` vb.) **yoktur**.
- Navigasyon tamamen **hash anchor** (`#hero`, `#about`, vb.) ile yapılır.
- `next/link` bileşeni **kullanılmamaktadır**.
- `scroll-behavior: smooth` CSS ile hash navigasyonda yumuşak geçiş sağlanır.

---

## 12. Durum Yönetimi (State Management)

- **Global state kütüphanesi yoktur** (Redux, Zustand, Jotai, MobX, Context API tabanlı store yok).
- Durum yalnızca **yerel React hook'ları** (`useState`, `useEffect`) ile yönetilir.
- Sunucu tarafı veri katmanı (React Query, SWR) kullanılmamaktadır.

**State kullanımı olan bileşenler:**

| Bileşen | State | Açıklama |
|---------|-------|----------|
| Header | `isScrolled`, `isMobileOpen` | Scroll ve mobil menü durumu |
| Preloader | Ref'ler | GSAP animasyon referansları |
| Portfolio | `projects`, `loading`, `error` | API verisi ve yükleme durumu |
| Testimonials | `active` | Aktif referans kartı indeksi |

---

## 13. API Entegrasyonu

Projede **tek bir API bağlantısı** vardır:

### Strapi CMS — Projeler

| Özellik | Değer |
|---------|-------|
| **URL** | `http://localhost:1337/api/projects?populate=*` |
| **Metod** | `GET` |
| **Backend** | Strapi (headless CMS) |
| **Bileşen** | `Portfolio.tsx` |
| **Kullanım** | `useEffect` içinde `fetch()` ile |

**Yanıt Yapısı:**
```typescript
{
  data: [
    {
      id: number,
      title: string,
      description: string | RichText[],
      image: { url: string } | { formats: { medium: { url: string } } },
      technologies: string | string[],
      projectUrl: string,
      githubUrl: string
    }
  ]
}
```

**Diğer bölümler** (Blog, Testimonials, Stats, Services) **statik/sabit veri** kullanır — henüz API entegrasyonu yoktur.

**Form gönderimi** (Contact, Newsletter) **henüz implemente edilmemiştir**.

---

## 14. Animasyon Mimarisi

### GSAP Kullanım Modeli

Projede GSAP animasyonları **üç farklı şekilde** tanımlanmıştır:

1. **Inline (Aktif):** Her bölüm bileşeni kendi `useEffect` içinde GSAP kodunu doğrudan yazar. Bu yöntem şu an **aktif olarak kullanılmaktadır**.

2. **Custom Hook (Pasif):** `useGsap.ts` dosyasındaki `useGsapScrollTrigger` ve `useCountUp` hook'ları. **Şu an kullanılmamaktadır.**

3. **Lib Fonksiyonları (Pasif):** `animations.ts` dosyasındaki yardımcı fonksiyonlar. **Şu an kullanılmamaktadır.**

### Animasyon Türleri

| Tür | Kullanıldığı Yerler |
|-----|---------------------|
| Sayfa yükleme (timeline) | Preloader, Hero |
| Scroll tetiklemeli (ScrollTrigger) | About, Services, Portfolio, Testimonials, Stats, Blog, CTA |
| Sayaç (counter) | Hero (920), About (5), Testimonials (32), Stats (tümü) |
| Sonsuz kaydırma (marquee) | Marquee |
| Stagger (sıralı giriş) | Services, Portfolio, Blog |

### Önemli Not — ScrollTrigger Temizliği
Birçok bölüm `ScrollTrigger.getAll().forEach(t => t.kill())` kullanır. Bu, tüm sayfadaki ScrollTrigger instance'larını temizler — farklı bölümler arasında çakışma riski oluşturabilir.

---

## 15. Sayfa Akışı (Render Sırası)

Sayfa `page.tsx` içinde aşağıdaki sırayla render edilir:

```
1.  Preloader          → Tam ekran yükleme animasyonu
2.  Header             → Sabit navigasyon çubuğu
3.  ─── <main> ───
4.  Hero               → Ana giriş, CTA, sayaç
5.  Marquee (brands)   → Teknoloji isimleri kayan band
6.  About              → Hakkımda, deneyim, teknolojiler
7.  Services           → Hizmet kartları
8.  Marquee (categories) → Hizmet kategorileri kayan band
9.  Portfolio           → Projeler (Strapi API)
10. Testimonials        → Müşteri yorumları
11. Stats               → Rakamsal istatistikler
12. Contact             → İletişim formu
13. Blog                → Blog kartları
14. CTA                 → Son aksiyon çağrısı
15. ─── </main> ───
16. Footer              → Alt bilgi, bülten, linkler
```

---

## 16. Tekrarlayan Sabitler ve İletişim Bilgileri

Aşağıdaki bilgiler birden fazla bileşende tekrarlanmaktadır:

| Bilgi | Kullanıldığı Bileşenler |
|-------|-------------------------|
| `info@erenozden.com` | Header, Footer, Hero, Contact |
| `+90 555 123 45 67` | Header, Footer, Hero, Contact |
| `Türkiye` / `İstanbul, Türkiye` | Header, Footer, Contact |
| Logo ("EREN" + ".") | Header, Footer |
| Sosyal medya URL'leri | Footer |
| `STRAPI_URL = "http://localhost:1337"` | Portfolio |

> **Öneri:** Bu sabitleri merkezi bir `constants.ts` dosyasında toplamak bakım kolaylığı sağlar.

---

## 17. Bilinen Sorunlar ve İyileştirme Önerileri

### Aktif Sorunlar

1. **Kullanılmayan Kod:**
   - `src/hooks/useGsap.ts` — hiçbir bileşende import edilmiyor
   - `src/lib/animations.ts` — hiçbir bileşende import edilmiyor
   - Bu dosyalar ya entegre edilmeli ya da kaldırılmalıdır.

2. **Hardcoded Strapi URL:**
   - `Portfolio.tsx` içinde `STRAPI_URL = "http://localhost:1337"` sabit olarak yazılmış.
   - Ortam değişkenine (`NEXT_PUBLIC_STRAPI_URL`) taşınmalıdır.

3. **Form İşlevselliği Eksik:**
   - Contact formu `onSubmit` handler'ı yok.
   - Newsletter bülten formu backend bağlantısı yok.

4. **ScrollTrigger Temizlik Çakışması:**
   - Birçok bölüm `ScrollTrigger.getAll().forEach(t => t.kill())` kullanıyor.
   - Bu, diğer bölümlerin animasyonlarını bozabilir.
   - Her bileşen yalnızca kendi oluşturduğu trigger'ları temizlemelidir.

5. **Sosyal Medya Linkleri Placeholder:**
   - Footer'daki GitHub, LinkedIn, Twitter linkleri genel URL'lere (`https://github.com`) yönleniyor.

6. **Yasal Linkler Placeholder:**
   - "Gizlilik Politikası" ve "Kullanım Şartları" linkleri `#` ile placeholder.

### İyileştirme Önerileri

1. **Test Altyapısı:** Projede test yoktur. Jest/Vitest + React Testing Library eklenebilir.
2. **SEO:** Open Graph meta tag'leri, sitemap.xml, robots.txt eklenebilir.
3. **Erişilebillik (a11y):** ARIA label'ları ve klavye navigasyonu iyileştirilebilir.
4. **Performans:** `next/image` bileşeni Portfolio'daki `<img>` yerine kullanılabilir.
5. **Çoklu Sayfa:** Blog detay sayfaları (`/blog/[slug]`), Proje detay sayfaları eklenebilir.
6. **Ortam Değişkenleri:** `.env.local` dosyası ile API URL'leri ve iletişim bilgileri yönetilebilir.
7. **İçerik Yönetimi:** Tüm statik içerik (services, testimonials, blog, stats) Strapi'ye taşınabilir.

---

> **Son Güncelleme:** 12 Nisan 2026
