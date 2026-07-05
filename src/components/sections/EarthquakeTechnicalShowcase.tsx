'use client';

import React, { useState } from 'react';
import {
  Layers,
  Monitor,
  Server,
  ShieldCheck,
  Database,
  GitBranch,
  Map,
  Box,
  Lock,
  FileCode2,
  Container,
  ArrowLeftRight,
  Activity,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EarthquakeTechnicalShowcaseProps {
  locale: 'tr' | 'en';
}

interface TechItem {
  name: string;
  version?: string;
  role: string;
}

interface DetailSection {
  id: string;
  badge: string;
  title: string;
  desc: string;
  bullets?: string[];
  techStack?: TechItem[];
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

interface Category {
  id: string;
  title: string;
  description: string;
  sections: DetailSection[];
}

export default function EarthquakeTechnicalShowcase({ locale }: EarthquakeTechnicalShowcaseProps) {
  const isTr = locale === 'tr';

  const categories: Category[] = [
    {
      id: 'architecture',
      title: isTr ? 'Mimari & Altyapı' : 'Architecture & Infra',
      description: isTr
        ? 'React SPA istemci, Spring Boot REST API ve Nginx gateway üzerinde konumlandırılmış, CBS destekli deprem risk analiz platformu.'
        : 'A GIS-backed seismic risk platform with a React SPA client, Spring Boot REST API, and Nginx gateway.',
      sections: [
        {
          id: 'overview',
          badge: isTr ? 'Genel Bakış' : 'Overview',
          title: isTr ? 'Uçtan Uca Sistem Mimarisi' : 'End-to-End System Architecture',
          desc: isTr
            ? 'EarthquakeCheck; adres/koordinat ve bina bilgilerini alarak A–F risk sınıfı ve güvenlik yüzdesi üreten bir deprem güvenlik değerlendirme platformudur. Frontend ayrı repoda React SPA; backend Spring Boot REST API olarak çalışır.'
            : 'EarthquakeCheck is a seismic safety assessment platform that produces A–F risk grades and safety percentages from address/coordinates and building data. The frontend is a React SPA; the backend is a Spring Boot REST API.',
          bullets: isTr
            ? [
                'React 19 SPA (Create React App) — tarayıcı istemcisi',
                'Spring Boot 3.4 REST API — Java 17',
                'PostgreSQL 15 + Flyway migrasyonları',
                'Nginx reverse proxy: /api/ → backend, / → frontend',
                'Docker Compose ile db, app ve frontend orkestrasyonu',
              ]
            : [
                'React 19 SPA (Create React App) — browser client',
                'Spring Boot 3.4 REST API — Java 17',
                'PostgreSQL 15 + Flyway migrations',
                'Nginx reverse proxy: /api/ → backend, / → frontend',
                'Docker Compose orchestration for db, app, and frontend',
              ],
          icon: Layers,
        },
        {
          id: 'gateway',
          badge: isTr ? 'Gateway' : 'Gateway',
          title: isTr ? 'Nginx & Dağıtım Topolojisi' : 'Nginx & Deployment Topology',
          desc: isTr
            ? 'Üretim ortamında Nginx gateway HTTPS trafiğini yönlendirir; frontend statik dosyalar Nginx Alpine konteynerinde, API Spring Boot uygulamasında sunulur.'
            : 'In production, the Nginx gateway routes HTTPS traffic; frontend static files are served from an Nginx Alpine container, the API from the Spring Boot app.',
          bullets: isTr
            ? [
                'location /api/ → earthquakecheck-app:8081',
                'location / → earthquakecheck-frontend:80',
                'client_max_body_size 12m (XLSX import için)',
                'Cloudflare CF-Connecting-IP ile gerçek istemci IP\'si',
                'Multi-stage Dockerfile: Maven build + JRE Alpine runtime',
              ]
            : [
                'location /api/ → earthquakecheck-app:8081',
                'location / → earthquakecheck-frontend:80',
                'client_max_body_size 12m (for XLSX import)',
                'Real client IP via Cloudflare CF-Connecting-IP',
                'Multi-stage Dockerfile: Maven build + JRE Alpine runtime',
              ],
          icon: Container,
        },
        {
          id: 'data-flow',
          badge: isTr ? 'Veri Akışı' : 'Data Flow',
          title: isTr ? 'Risk Değerlendirme Akışı' : 'Risk Assessment Flow',
          desc: isTr
            ? 'Kullanıcı adres veya harita koordinatı ile bina verisini girer; frontend Api.js üzerinden backend\'e POST isteği gönderir; sonuç harf notu, yüzde ve önerilerle görselleştirilir.'
            : 'The user enters building data with an address or map coordinates; the frontend sends a POST via Api.js to the backend; results are visualized with letter grade, percentage, and recommendations.',
          bullets: isTr
            ? [
                'Adım 1: Adres girişi veya Leaflet harita seçimi',
                'Adım 2: Yapım yılı ve kat sayısı',
                'POST /api/building/evaluate → risk sınıfı (A–F)',
                'POST /api/geolocation/coordinates → adres → koordinat',
                'GET /api/pga/value → konuma göre PGA sorgusu',
              ]
            : [
                'Step 1: Address input or Leaflet map selection',
                'Step 2: Year built and floor count',
                'POST /api/building/evaluate → risk class (A–F)',
                'POST /api/geolocation/coordinates → address → coordinates',
                'GET /api/pga/value → PGA query by location',
              ],
          icon: ArrowLeftRight,
        },
        {
          id: 'external',
          badge: isTr ? 'Harici Servisler' : 'External Services',
          title: isTr ? 'Dış API Entegrasyonları' : 'External API Integrations',
          desc: isTr
            ? 'Platform harici coğrafi ve sismik veri kaynaklarıyla entegre çalışır; canlı deprem ticker\'ı doğrudan tarayıcıdan harici API\'ye bağlanır.'
            : 'The platform integrates with external geographic and seismic data sources; the live earthquake ticker connects directly from the browser to an external API.',
          bullets: isTr
            ? [
                'Nominatim (OpenStreetMap) — Türkiye odaklı geocoding',
                'Kandilli canlı deprem API — 60 sn polling, fallback veri',
                'OpenStreetMap tile katmanı — Leaflet harita',
                'navigator.geolocation — kullanıcı konumuna odaklanma',
              ]
            : [
                'Nominatim (OpenStreetMap) — Turkey-focused geocoding',
                'Kandilli live earthquake API — 60s polling, fallback data',
                'OpenStreetMap tile layer — Leaflet map',
                'navigator.geolocation — focus on user location',
              ],
          icon: Activity,
        },
      ],
    },
    {
      id: 'frontend',
      title: isTr ? 'Frontend (Web)' : 'Frontend (Web)',
      description: isTr
        ? 'React 19 tabanlı SPA; Leaflet harita, çok adımlı form, GSAP animasyonları ve Tailwind CSS ile zengin kullanıcı deneyimi.'
        : 'React 19 SPA with Leaflet maps, multi-step forms, GSAP animations, and Tailwind CSS for a rich user experience.',
      sections: [
        {
          id: 'core-stack',
          badge: isTr ? 'Çekirdek Stack' : 'Core Stack',
          title: isTr ? 'Temel Teknolojiler' : 'Core Technologies',
          desc: isTr
            ? 'Create React App ile derlenen, client-side routing kullanan SSR\'siz tek sayfa uygulaması. Global state kütüphanesi kullanılmaz; bileşen içi useState yeterlidir.'
            : 'A non-SSR single-page app built with Create React App and client-side routing. No global state library; component-level useState suffices.',
          techStack: [
            { name: 'React', version: '19.x', role: isTr ? 'Bileşen tabanlı UI' : 'Component-based UI' },
            { name: 'react-router-dom', version: '6.x', role: isTr ? 'Client-side routing' : 'Client-side routing' },
            { name: 'Create React App', version: '5.0.1', role: isTr ? 'Build ve dev sunucusu' : 'Build and dev server' },
          ],
          icon: Monitor,
        },
        {
          id: 'map-ui',
          badge: isTr ? 'Harita & Konum' : 'Map & Location',
          title: isTr ? 'CBS ve Harita Katmanı' : 'GIS & Map Layer',
          desc: isTr
            ? 'Leaflet + react-leaflet ile interaktif harita; tıklama ile koordinat seçimi, geolocation ile otomatik merkezleme. AddressForm çok adımlı analiz akışını yönetir.'
            : 'Interactive map with Leaflet + react-leaflet; click-to-select coordinates, auto-center via geolocation. AddressForm manages the multi-step analysis flow.',
          techStack: [
            { name: 'Leaflet', version: '1.9.4', role: isTr ? 'Harita motoru' : 'Map engine' },
            { name: 'react-leaflet', version: '5.x', role: isTr ? 'React harita sarmalayıcıları' : 'React map wrappers' },
            { name: 'OpenStreetMap', role: isTr ? 'Tile kaynağı' : 'Tile source' },
          ],
          bullets: isTr
            ? [
                'AddressForm: 3 adım (adres → bina bilgisi → sonuç)',
                'Client-side XSS önleme ve sayısal doğrulama',
                'Sonuç kartında sayaç animasyonu ve yazdırma desteği',
                'PageTransition: GSAP route geçiş animasyonları',
              ]
            : [
                'AddressForm: 3 steps (address → building info → result)',
                'Client-side XSS prevention and numeric validation',
                'Counter animation on result card and print support',
                'PageTransition: GSAP route transition animations',
              ],
          icon: Map,
        },
        {
          id: 'animation-style',
          badge: isTr ? 'UI & Animasyon' : 'UI & Animation',
          title: isTr ? 'Animasyon ve Stil Mimarisi' : 'Animation & Style Architecture',
          desc: isTr
            ? 'Üç katmanlı stil stratejisi: Tailwind utility sınıfları, özel ec-* design token\'ları ve global CSS animasyonları.'
            : 'Three-layer styling strategy: Tailwind utilities, custom ec-* design tokens, and global CSS animations.',
          techStack: [
            { name: 'Tailwind CSS', version: '3.4.x', role: isTr ? 'Utility-first CSS' : 'Utility-first CSS' },
            { name: 'framer-motion', version: '12.x', role: isTr ? 'Bileşen animasyonları, FAQ' : 'Component animations, FAQ' },
            { name: 'GSAP', version: '3.x', role: isTr ? 'Sayfa geçişleri, anchor scroll' : 'Page transitions, anchor scroll' },
            { name: 'AOS', version: '2.x', role: isTr ? 'Scroll tetiklemeli animasyonlar' : 'Scroll-triggered animations' },
            { name: 'react-icons', version: '5.x', role: isTr ? 'Lucide ikon seti' : 'Lucide icon set' },
          ],
          icon: Box,
        },
        {
          id: 'frontend-deploy',
          badge: isTr ? 'Dağıtım' : 'Deployment',
          title: isTr ? 'Frontend Dağıtım' : 'Frontend Deployment',
          desc: isTr
            ? 'Docker multi-stage build: Node 18 Alpine ile derleme, Nginx Alpine ile statik sunum. REACT_APP_API_URL build-time enjekte edilir.'
            : 'Docker multi-stage build: compile with Node 18 Alpine, serve static files with Nginx Alpine. REACT_APP_API_URL injected at build time.',
          techStack: [
            { name: 'Docker', role: isTr ? 'Multi-stage imaj derleme' : 'Multi-stage image build' },
            { name: 'Nginx', role: isTr ? 'SPA fallback, güvenlik başlıkları, CSP' : 'SPA fallback, security headers, CSP' },
            { name: 'Jest + Testing Library', role: isTr ? 'Birim ve bileşen testleri' : 'Unit and component tests' },
          ],
          bullets: isTr
            ? [
                'try_files $uri $uri/ /index.html — SPA fallback',
                'CSP: script, style, img, connect kaynakları tanımlı',
                'Admin paneli: sessionStorage token, noindex meta',
              ]
            : [
                'try_files $uri $uri/ /index.html — SPA fallback',
                'CSP: script, style, img, connect sources defined',
                'Admin panel: sessionStorage token, noindex meta',
              ],
          icon: FileCode2,
        },
      ],
    },
    {
      id: 'backend',
      title: isTr ? 'Backend (API)' : 'Backend (API)',
      description: isTr
        ? 'Spring Boot 3.4 katmanlı mimarisi; deprem değerlendirme algoritması, geocoding, PGA sorgulama ve rate limiting.'
        : 'Spring Boot 3.4 layered architecture; earthquake evaluation algorithm, geocoding, PGA queries, and rate limiting.',
      sections: [
        {
          id: 'api-core',
          badge: isTr ? 'Çekirdek' : 'Core',
          title: isTr ? 'API Çekirdek Teknolojileri' : 'API Core Technologies',
          desc: isTr
            ? 'Java 17 ve Spring Boot 3.4.5 üzerine inşa edilmiş REST API; Maven bağımlılık yönetimi, Lombok ile boilerplate azaltma.'
            : 'REST API built on Java 17 and Spring Boot 3.4.5; Maven dependency management, Lombok for boilerplate reduction.',
          techStack: [
            { name: 'Java', version: '17', role: isTr ? 'Programlama dili' : 'Programming language' },
            { name: 'Spring Boot', version: '3.4.5', role: isTr ? 'REST API, JPA, Security, Validation' : 'REST API, JPA, Security, Validation' },
            { name: 'PostgreSQL', version: '15', role: isTr ? 'Kalıcı veri saklama' : 'Persistent storage' },
            { name: 'Flyway', role: isTr ? 'Şema migrasyonları (V1–V5)' : 'Schema migrations (V1–V5)' },
            { name: 'Hibernate', role: isTr ? 'JPA ORM, ddl-auto=validate' : 'JPA ORM, ddl-auto=validate' },
          ],
          icon: Database,
        },
        {
          id: 'api-services',
          badge: isTr ? 'Servisler' : 'Services',
          title: isTr ? 'İş Mantığı & Algoritmalar' : 'Business Logic & Algorithms',
          desc: isTr
            ? 'EvaluationServiceImpl deprem güvenlik skorunu hesaplar; NominatimGeocodingService adres çözümleme; PGAServiceImpl grid tabanlı PGA sorgusu yapar.'
            : 'EvaluationServiceImpl computes seismic safety scores; NominatimGeocodingService resolves addresses; PGAServiceImpl performs grid-based PGA queries.',
          bullets: isTr
            ? [
                'Skor: ageScore + floorScore × pgaFactor → A–F sınıflandırma',
                'Geocoding: token eşleşme skoru, Türkçe kısaltma normalizasyonu',
                'PGA: 0.1° grid yuvarlama, Öklid mesafesi ile en yakın nokta',
                'XLSX import: Apache POI, 1000\'lik paralel batch, max 500K satır',
                'Controller ince, Service kalın — DTO/Entity ayrımı',
              ]
            : [
                'Score: ageScore + floorScore × pgaFactor → A–F classification',
                'Geocoding: token match score, Turkish abbreviation normalization',
                'PGA: 0.1° grid rounding, nearest point via Euclidean distance',
                'XLSX import: Apache POI, 1000-row parallel batches, max 500K rows',
                'Thin controllers, thick services — DTO/Entity separation',
              ],
          icon: Server,
        },
        {
          id: 'api-security',
          badge: isTr ? 'Güvenlik' : 'Security',
          title: isTr ? 'Güvenlik & Rate Limiting' : 'Security & Rate Limiting',
          desc: isTr
            ? 'Stateless güvenlik zinciri; admin yetkisi X-Admin-Token başlığı ile. Bucket4j token bucket algoritması IP bazlı istek sınırlama uygular.'
            : 'Stateless security chain; admin access via X-Admin-Token header. Bucket4j token bucket algorithm applies IP-based rate limiting.',
          techStack: [
            { name: 'Spring Security', role: isTr ? 'Stateless, ROLE_ADMIN yetkilendirme' : 'Stateless, ROLE_ADMIN authorization' },
            { name: 'Bucket4j', version: '8.14', role: isTr ? 'IP tabanlı rate limiting' : 'IP-based rate limiting' },
            { name: 'Caffeine', role: isTr ? 'Rate limit bucket önbelleği' : 'Rate limit bucket cache' },
            { name: 'springdoc-openapi', version: '2.8.9', role: isTr ? 'Swagger UI (dev profili)' : 'Swagger UI (dev profile)' },
          ],
          bullets: isTr
            ? [
                'STRICT: 10 istek/dk — POST /api/building/evaluate',
                'RELAXED: 60 istek/dk — genel /api/**',
                'CONTACT: 5 istek/saat — iletişim formu',
                'ProductionSecurityValidator: prod başlangıç kontrolleri',
              ]
            : [
                'STRICT: 10 req/min — POST /api/building/evaluate',
                'RELAXED: 60 req/min — general /api/**',
                'CONTACT: 5 req/hour — contact form',
                'ProductionSecurityValidator: prod startup checks',
              ],
          icon: Lock,
        },
        {
          id: 'api-data',
          badge: isTr ? 'Veri Modeli' : 'Data Model',
          title: isTr ? 'Veritabanı Şeması' : 'Database Schema',
          desc: isTr
            ? 'earthquakecheck şeması; Building ↔ EvaluationResult ilişkisi, PGA grid verisi ve iletişim mesajları.'
            : 'earthquakecheck schema; Building ↔ EvaluationResult relationship, PGA grid data, and contact messages.',
          bullets: isTr
            ? [
                'building — adres, yıl, tip, kat, koordinat',
                'evaluation_result — risk sınıfı, güvenlik % (FK cascade delete)',
                'pga_value — lat, lon, dd1–dd4 grid verisi',
                'contact_messages — UUID PK, durum, zaman damgası',
                'GlobalExceptionHandler — standart JSON hata yanıtları',
              ]
            : [
                'building — address, year, type, floors, coordinates',
                'evaluation_result — risk class, safety % (FK cascade delete)',
                'pga_value — lat, lon, dd1–dd4 grid data',
                'contact_messages — UUID PK, status, timestamp',
                'GlobalExceptionHandler — standard JSON error responses',
              ],
          icon: GitBranch,
        },
      ],
    },
    {
      id: 'patterns',
      title: isTr ? 'Mimari Desenler' : 'Architecture Patterns',
      description: isTr
        ? 'Katmanlı mimari prensipleri, olay tabanlı genişleme ve frontend-backend sorumluluk ayrımı.'
        : 'Layered architecture principles, event-driven extensibility, and frontend-backend responsibility separation.',
      sections: [
        {
          id: 'backend-patterns',
          badge: isTr ? 'Backend Desenleri' : 'Backend Patterns',
          title: isTr ? 'Spring Boot Mimari Prensipleri' : 'Spring Boot Architecture Principles',
          desc: isTr
            ? 'Profil bazlı konfigürasyon (dev/prod), arayüz + implementasyon servis deseni ve domain odaklı paketleme.'
            : 'Profile-based configuration (dev/prod), interface + implementation service pattern, and domain-focused packaging.',
          bullets: isTr
            ? [
                'Filter sırası: RateLimit → AdminToken → SecurityFilterChain',
                'ContactMessageCreatedEvent — genişletilebilir olay tabanlı mimari',
                'Interface + Impl: EvaluationService → EvaluationServiceImpl',
                'dev: Swagger açık, DEBUG log | prod: Swagger kapalı, INFO log',
                'TÜBİTAK kapsamında geliştirilmiş kurumsal backend',
              ]
            : [
                'Filter order: RateLimit → AdminToken → SecurityFilterChain',
                'ContactMessageCreatedEvent — extensible event-driven architecture',
                'Interface + Impl: EvaluationService → EvaluationServiceImpl',
                'dev: Swagger open, DEBUG logs | prod: Swagger closed, INFO logs',
                'Enterprise backend developed under TÜBİTAK scope',
              ],
          icon: Server,
        },
        {
          id: 'frontend-patterns',
          badge: isTr ? 'Frontend Desenleri' : 'Frontend Patterns',
          title: isTr ? 'React SPA Organizasyonu' : 'React SPA Organization',
          desc: isTr
            ? 'Merkezi Api.js istemcisi, errorMapping.js ile Türkçe hata mesajları ve route bazlı sayfa bileşenleri.'
            : 'Central Api.js client, Turkish error messages via errorMapping.js, and route-based page components.',
          bullets: isTr
            ? [
                'Api.js: buildEvaluationPayload() normalizasyonu',
                'errorMapping.js: backend details → kullanıcı dostu mesajlar',
                'Global state yok — bileşen içi useState yeterli',
                'Route\'lar PageTransition sarmalayıcısı içinde',
                'web-vitals ile Core Web Vitals ölçümü',
              ]
            : [
                'Api.js: buildEvaluationPayload() normalization',
                'errorMapping.js: backend details → user-friendly messages',
                'No global state — component-level useState suffices',
                'Routes wrapped in PageTransition',
                'Core Web Vitals measurement via web-vitals',
              ],
          icon: Monitor,
        },
        {
          id: 'risk-algo',
          badge: isTr ? 'Algoritma' : 'Algorithm',
          title: isTr ? 'Deprem Güvenlik Değerlendirme Motoru' : 'Seismic Safety Evaluation Engine',
          desc: isTr
            ? 'Bina yaşı, kat sayısı ve koordinat sinyaline dayalı skor hesaplama; A (≥90%) ile F (<30%) arası risk sınıflandırması.'
            : 'Score calculation based on building age, floor count, and coordinate signal; risk classification from A (≥90%) to F (<30%).',
          bullets: isTr
            ? [
                'ageScore: 5–30 puan (bina yaşına göre)',
                'floorScore: 5–20 puan (kat sayısına göre)',
                'pgaFactor: koordinat tabanlı simülasyon (1.0–1.8)',
                'safetyGradePercentage = clamp(100 - rawScore, 0, 100)',
                'Koordinat yoksa Nominatim geocoding → fallback (39.0, 35.0)',
              ]
            : [
                'ageScore: 5–30 points (by building age)',
                'floorScore: 5–20 points (by floor count)',
                'pgaFactor: coordinate-based simulation (1.0–1.8)',
                'safetyGradePercentage = clamp(100 - rawScore, 0, 100)',
                'If no coordinates: Nominatim geocoding → fallback (39.0, 35.0)',
              ],
          icon: Activity,
        },
        {
          id: 'security-patterns',
          badge: isTr ? 'Güvenlik' : 'Security',
          title: isTr ? 'Uçtan Uca Güvenlik' : 'End-to-End Security',
          desc: isTr
            ? 'Frontend input sanitizasyonu, Nginx CSP başlıkları, backend rate limiting ve admin token doğrulama katmanları.'
            : 'Frontend input sanitization, Nginx CSP headers, backend rate limiting, and admin token validation layers.',
          bullets: isTr
            ? [
                'Frontend: sayısal alan filtreleme, rel="noopener noreferrer"',
                'Nginx: X-Frame-Options, X-Content-Type-Options, CSP',
                'Backend: APP_ADMIN_TOKEN min. 32 karakter (prod zorunlu)',
                'CORS: CORS_ALLOWED_ORIGINS ile origin whitelist',
                '429 yanıtında X-Rate-Limit-* başlıkları',
              ]
            : [
                'Frontend: numeric field filtering, rel="noopener noreferrer"',
                'Nginx: X-Frame-Options, X-Content-Type-Options, CSP',
                'Backend: APP_ADMIN_TOKEN min. 32 chars (required in prod)',
                'CORS: origin whitelist via CORS_ALLOWED_ORIGINS',
                '429 responses include X-Rate-Limit-* headers',
              ],
          icon: ShieldCheck,
        },
      ],
    },
  ];

  const [activeCategory, setActiveCategory] = useState<string>('architecture');
  const [activeSection, setActiveSection] = useState<string>('overview');

  const currentCategory = categories.find((c) => c.id === activeCategory) || categories[0];
  const currentSection =
    currentCategory.sections.find((s) => s.id === activeSection) || currentCategory.sections[0];

  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId);
    const cat = categories.find((c) => c.id === catId);
    if (cat && cat.sections.length > 0) {
      setActiveSection(cat.sections[0].id);
    }
  };

  return (
    <div className="space-y-8 sm:space-y-12">
      <div className="flex flex-col sm:flex-row flex-wrap gap-2 border-b border-white/5 pb-4">
        {categories.map((category) => {
          const isActive = activeCategory === category.id;
          return (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={cn(
                'px-5 py-3 rounded-lg text-left sm:text-center text-sm font-semibold transition-all duration-300 relative overflow-hidden outline-none cursor-pointer',
                isActive
                  ? 'bg-white text-dark shadow-lg shadow-white/5'
                  : 'text-gray-light hover:text-white hover:bg-white/5'
              )}
            >
              {category.title}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
              )}
            </button>
          );
        })}
      </div>

      <div className="max-w-2xl">
        <p className="text-gray-light text-sm sm:text-base italic">{currentCategory.description}</p>
      </div>

      <div className="hidden md:grid grid-cols-[380px_1fr] gap-8 lg:gap-12 items-stretch min-h-[480px]">
        <div className="space-y-3 flex flex-col justify-start">
          {currentCategory.sections.map((section) => {
            const isActive = activeSection === section.id;
            const Icon = section.icon;

            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  'w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-start gap-4 cursor-pointer select-none',
                  isActive
                    ? 'bg-white/[0.03] border-white/15 shadow-xl shadow-black/40 translate-x-1'
                    : 'bg-transparent border-transparent hover:bg-white/[0.01] hover:border-white/5'
                )}
              >
                <div
                  className={cn(
                    'p-2.5 rounded-lg border transition-all duration-300',
                    isActive
                      ? 'bg-white text-dark border-white/20'
                      : 'bg-dark-lighter border-white/5 text-gray-light'
                  )}
                >
                  <Icon size={18} />
                </div>

                <div className="space-y-1">
                  <span
                    className={cn(
                      'inline-block px-1.5 py-0.5 rounded text-[10px] font-mono',
                      isActive ? 'bg-white/10 text-white' : 'bg-white/5 text-gray-light'
                    )}
                  >
                    {section.badge}
                  </span>
                  <h4
                    className={cn(
                      'text-sm font-bold transition-colors',
                      isActive ? 'text-white' : 'text-gray-light'
                    )}
                  >
                    {section.title}
                  </h4>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col bg-dark-card border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-black/40">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/[0.03] border border-white/5 rounded-md text-[11px] font-mono text-gray-light select-none">
              <Layers size={10} className="text-gray" />
              <span>tech.earthquakecheck.com/{currentSection.id}</span>
            </div>
            <div className="w-12" />
          </div>

          <div className="p-6 space-y-6 flex-1">
            <div className="space-y-2">
              <span className="inline-block px-2.5 py-0.5 text-[10px] font-mono font-semibold tracking-wider rounded bg-white/5 border border-white/10 text-white">
                {currentSection.badge}
              </span>
              <h3 className="text-lg font-bold text-white">{currentSection.title}</h3>
              <p className="text-gray-text text-sm leading-relaxed max-w-3xl">{currentSection.desc}</p>
            </div>

            {currentSection.bullets && currentSection.bullets.length > 0 && (
              <ul className="space-y-2.5">
                {currentSection.bullets.map((bullet, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-text">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/40 shrink-0" />
                    <span className="leading-relaxed">{bullet}</span>
                  </li>
                ))}
              </ul>
            )}

            {currentSection.techStack && currentSection.techStack.length > 0 && (
              <div className="space-y-3">
                <div className="text-[10px] font-mono uppercase tracking-wider text-gray-light font-semibold">
                  {isTr ? 'Teknoloji Stack' : 'Tech Stack'}
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {currentSection.techStack.map((tech) => (
                    <div
                      key={tech.name}
                      className="p-3.5 rounded-lg border border-white/5 bg-white/[0.02] hover:border-white/10 transition-colors space-y-1"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-bold text-white">{tech.name}</span>
                        {tech.version && (
                          <span className="text-[10px] font-mono text-gray-light bg-white/5 px-1.5 py-0.5 rounded">
                            {tech.version}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-text leading-relaxed">{tech.role}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="md:hidden space-y-4">
        {currentCategory.sections.map((section) => {
          const isActive = activeSection === section.id;
          const Icon = section.icon;

          return (
            <div
              key={section.id}
              className={cn(
                'border rounded-xl transition-all duration-300 overflow-hidden bg-dark-card',
                isActive ? 'border-white/15 shadow-lg' : 'border-white/5'
              )}
            >
              <button
                onClick={() => setActiveSection(isActive ? '' : section.id)}
                className="w-full text-left p-4 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'p-2 rounded-lg border',
                      isActive
                        ? 'bg-white text-dark border-white/20'
                        : 'bg-dark-lighter border-white/5 text-gray-light'
                    )}
                  >
                    <Icon size={16} />
                  </div>
                  <div>
                    <span className="px-1 py-0.5 rounded bg-white/5 text-[9px] font-mono text-gray-light">
                      {section.badge}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-white">{section.title}</h4>
                  </div>
                </div>
                <span
                  className={cn(
                    'text-xs transition-transform duration-300',
                    isActive ? 'rotate-90 text-white' : 'text-gray'
                  )}
                >
                  →
                </span>
              </button>

              {isActive && (
                <div className="p-4 pt-0 border-t border-white/5 space-y-4 bg-black/20">
                  <p className="text-gray-text text-xs leading-relaxed mt-4">{section.desc}</p>

                  {section.bullets && (
                    <ul className="space-y-2">
                      {section.bullets.map((bullet, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-gray-text">
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-white/40 shrink-0" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.techStack && (
                    <div className="grid gap-2">
                      {section.techStack.map((tech) => (
                        <div
                          key={tech.name}
                          className="p-3 rounded-lg border border-white/5 bg-white/[0.02] space-y-0.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white">{tech.name}</span>
                            {tech.version && (
                              <span className="text-[9px] font-mono text-gray-light">{tech.version}</span>
                            )}
                          </div>
                          <p className="text-[11px] text-gray-text">{tech.role}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
