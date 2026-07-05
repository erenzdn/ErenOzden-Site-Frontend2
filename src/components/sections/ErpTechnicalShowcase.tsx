'use client';

import React, { useState } from 'react';
import {
  Layers,
  Monitor,
  Server,
  ShieldCheck,
  Database,
  GitBranch,
  Cpu,
  Box,
  Lock,
  FileCode2,
  Container,
  ArrowLeftRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErpTechnicalShowcaseProps {
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

export default function ErpTechnicalShowcase({ locale }: ErpTechnicalShowcaseProps) {
  const isTr = locale === 'tr';

  const categories: Category[] = [
    {
      id: 'architecture',
      title: isTr ? 'Mimari & Altyapı' : 'Architecture & Infra',
      description: isTr
        ? 'API-first prensiplerle tasarlanmış, Electron istemci ve REST backend arasında net sorumluluk ayrımı sunan katmanlı sistem mimarisi.'
        : 'A layered system built on API-first principles, with clear separation between the Electron client and REST backend.',
      sections: [
        {
          id: 'overview',
          badge: isTr ? 'Genel Bakış' : 'Overview',
          title: isTr ? 'Uçtan Uca Sistem Mimarisi' : 'End-to-End System Architecture',
          desc: isTr
            ? 'İskeleTakip; iskele kiralama, envanter, teklif/sözleşme, stok ve finans süreçlerini tek platformda birleştirir. Tüm iş mantığı backend\'de tutulur; masaüstü istemci yalnızca sunum ve API iletişiminden sorumludur.'
            : 'İskeleTakip unifies scaffolding rental, inventory, quote/contract, stock and finance workflows on one platform. Business logic lives on the backend; the desktop client handles presentation and API communication only.',
          bullets: isTr
            ? [
                'Electron kabuğu içinde çalışan React SPA istemci',
                'Node.js + Express 5 REST API backend',
                'PostgreSQL 16 ilişkisel veritabanı',
                'JWT Bearer token ile kimlik doğrulama',
                'Docker Compose ile konteyner tabanlı dağıtım',
              ]
            : [
                'React SPA client running inside an Electron shell',
                'Node.js + Express 5 REST API backend',
                'PostgreSQL 16 relational database',
                'JWT Bearer token authentication',
                'Container-based deployment via Docker Compose',
              ],
          icon: Layers,
        },
        {
          id: 'client-arch',
          badge: isTr ? 'İstemci Katmanları' : 'Client Layers',
          title: isTr ? 'Electron Üç Katmanlı Yapı' : 'Electron Three-Layer Structure',
          desc: isTr
            ? 'Masaüstü uygulama; ana süreç, preload köprüsü ve React renderer olmak üzere üç katmandan oluşur. Güvenli Electron yapılandırması ile renderer doğrudan Node.js API\'lerine erişemez.'
            : 'The desktop app consists of three layers: main process, preload bridge, and React renderer. Secure Electron configuration prevents the renderer from accessing Node.js APIs directly.',
          bullets: isTr
            ? [
                'Main Process: pencere yönetimi, CSP, otomatik güncelleme (electron-updater)',
                'Preload: contextBridge ile sınırlı IPC API yüzeyi',
                'Renderer: HashRouter → ProtectedRoute → Sayfalar → Servisler → ApiClient',
                'nodeIntegration: false, contextIsolation: true',
                'Zustand yalnızca oturum, tema ve güncelleme durumu için',
              ]
            : [
                'Main Process: window management, CSP, auto-update (electron-updater)',
                'Preload: limited IPC API surface via contextBridge',
                'Renderer: HashRouter → ProtectedRoute → Pages → Services → ApiClient',
                'nodeIntegration: false, contextIsolation: true',
                'Zustand used only for session, theme, and update state',
              ],
          icon: Monitor,
        },
        {
          id: 'server-arch',
          badge: isTr ? 'Sunucu Katmanları' : 'Server Layers',
          title: isTr ? 'Katmanlı Backend Mimarisi' : 'Layered Backend Architecture',
          desc: isTr
            ? 'Backend; HTTP, middleware, route, repository, service ve veritabanı katmanlarına ayrılmıştır. İş kuralları repository ve service katmanlarında toplanır; route dosyaları ince orchestration yapar.'
            : 'The backend is split into HTTP, middleware, route, repository, service, and database layers. Business rules live in repository and service layers; routes perform thin orchestration.',
          bullets: isTr
            ? [
                'Repository Pattern: ham SQL sorguları route\'lardan izole',
                'Service Layer: PDF render, Excel import, yedekleme gibi çok adımlı işlemler',
                'Middleware zinciri: requestSigning → auth → requirePermission → validate',
                'Transaction-first stok işlemleri (SELECT FOR UPDATE)',
                'Fail-fast yapılandırma ve otomatik migration',
              ]
            : [
                'Repository Pattern: raw SQL isolated from routes',
                'Service Layer: multi-step ops like PDF render, Excel import, backup',
                'Middleware chain: requestSigning → auth → requirePermission → validate',
                'Transaction-first stock operations (SELECT FOR UPDATE)',
                'Fail-fast configuration and automatic migrations',
              ],
          icon: Server,
        },
        {
          id: 'communication',
          badge: isTr ? 'İletişim' : 'Communication',
          title: isTr ? 'İstemci–Backend İletişim Modeli' : 'Client–Backend Communication Model',
          desc: isTr
            ? 'Tüm CRUD ve iş mantığı REST API üzerinden yürütülür. Merkezi ApiClient istekleri standartlaştırır; istemci tarafında kalıcı veritabanı bulunmaz.'
            : 'All CRUD and business logic runs over REST API. A central ApiClient standardizes requests; there is no persistent database on the client side.',
          bullets: isTr
            ? [
                'HTTPS REST + JSON istek/yanıt formatı',
                'Authorization: Bearer token otomatik ekleme',
                'GET, POST, PATCH, DELETE, PUT + blob indirme ve multipart upload',
                'Opsiyonel HMAC-SHA256 request signing (X-Timestamp, X-Nonce, X-Signature)',
                'Offline çalışma desteklenmez — API bağımlı mimari',
              ]
            : [
                'HTTPS REST + JSON request/response format',
                'Authorization: Bearer token auto-injected',
                'GET, POST, PATCH, DELETE, PUT + blob download and multipart upload',
                'Optional HMAC-SHA256 request signing (X-Timestamp, X-Nonce, X-Signature)',
                'No offline mode — API-dependent architecture',
              ],
          icon: ArrowLeftRight,
        },
      ],
    },
    {
      id: 'frontend',
      title: isTr ? 'Frontend (Desktop)' : 'Frontend (Desktop)',
      description: isTr
        ? 'Electron + React + TypeScript ile geliştirilmiş, domain odaklı modül organizasyonuna sahip masaüstü istemci uygulaması.'
        : 'A desktop client built with Electron + React + TypeScript, organized around domain-focused modules.',
      sections: [
        {
          id: 'core-stack',
          badge: isTr ? 'Çekirdek Stack' : 'Core Stack',
          title: isTr ? 'Temel Teknolojiler' : 'Core Technologies',
          desc: isTr
            ? 'Uygulama Electron kabuğu içinde Vite ile derlenen bir React SPA olarak çalışır. TypeScript strict mode ile tip güvenliği sağlanır.'
            : 'The app runs as a React SPA compiled with Vite inside an Electron shell. TypeScript strict mode ensures type safety.',
          techStack: [
            { name: 'Electron', version: '28.x', role: isTr ? 'Masaüstü uygulama kabuğu' : 'Desktop app shell' },
            { name: 'React', version: '18.x', role: isTr ? 'UI framework (hooks + functional components)' : 'UI framework (hooks + functional components)' },
            { name: 'TypeScript', version: '5.x', role: isTr ? 'Tip güvenliği (strict mode)' : 'Type safety (strict mode)' },
            { name: 'Vite', version: '5.x', role: isTr ? 'Build aracı ve dev sunucusu' : 'Build tool and dev server' },
          ],
          icon: Cpu,
        },
        {
          id: 'ui-stack',
          badge: isTr ? 'UI & Stil' : 'UI & Styling',
          title: isTr ? 'Arayüz ve Görsel Katman' : 'Interface & Visual Layer',
          desc: isTr
            ? 'Tailwind CSS ile utility-first stil yaklaşımı; açık/koyu tema desteği. Zengin içerik editörü ve PDF önizleme yetenekleri.'
            : 'Utility-first styling with Tailwind CSS; light/dark theme support. Rich content editor and PDF preview capabilities.',
          techStack: [
            { name: 'Tailwind CSS', version: '3.x', role: isTr ? 'Utility-first CSS, koyu/açık tema' : 'Utility-first CSS, dark/light theme' },
            { name: 'Phosphor Icons', version: '2.x', role: isTr ? 'İkon seti' : 'Icon set' },
            { name: 'Recharts', version: '3.x', role: isTr ? 'Dashboard grafikleri' : 'Dashboard charts' },
            { name: 'Tiptap', version: '3.x', role: isTr ? 'Sözleşme/teklif şablon editörü' : 'Contract/quote template editor' },
            { name: 'react-pdf', version: '7.x', role: isTr ? 'PDF önizleme' : 'PDF preview' },
          ],
          icon: Box,
        },
        {
          id: 'routing-state',
          badge: isTr ? 'Routing & State' : 'Routing & State',
          title: isTr ? 'Yönlendirme ve Durum Yönetimi' : 'Routing & State Management',
          desc: isTr
            ? 'Hash tabanlı routing paketlenmiş Electron dağıtımına uygundur. Global state bilinçli olarak minimal tutulur; sayfa verisi servis + lokal state ile yönetilir.'
            : 'Hash-based routing suits packaged Electron distribution. Global state is intentionally minimal; page data is managed via services + local state.',
          techStack: [
            { name: 'React Router DOM', version: '6.x', role: isTr ? 'Hash tabanlı istemci routing' : 'Hash-based client routing' },
            { name: 'Zustand', version: '4.x', role: isTr ? 'Oturum, tema, toast, güncelleme durumu' : 'Session, theme, toast, update state' },
          ],
          bullets: isTr
            ? [
                '21 sayfa modülü (Dashboard, Müşteriler, Envanter, Depolar, Sözleşmeler vb.)',
                '27 domain servisi (apiClient.ts üzerinden)',
                'Sayfa + Modal deseni ile derin navigasyon ihtiyacı azaltılır',
                'ProtectedRoute: oturum, admin ve izin kontrolü',
              ]
            : [
                '21 page modules (Dashboard, Customers, Inventory, Warehouses, Contracts, etc.)',
                '27 domain services (via apiClient.ts)',
                'Page + Modal pattern reduces deep navigation needs',
                'ProtectedRoute: session, admin, and permission checks',
              ],
          icon: GitBranch,
        },
        {
          id: 'electron-eco',
          badge: isTr ? 'Dağıtım' : 'Distribution',
          title: isTr ? 'Electron Ekosistemi & Dağıtım' : 'Electron Ecosystem & Distribution',
          desc: isTr
            ? 'Windows hedefli NSIS installer ve GitHub Releases tabanlı otomatik güncelleme ile dağıtılır.'
            : 'Distributed via Windows NSIS installer and GitHub Releases-based auto-update.',
          techStack: [
            { name: 'electron-builder', version: '24.x', role: isTr ? 'Windows NSIS installer' : 'Windows NSIS installer' },
            { name: 'electron-updater', version: '6.x', role: isTr ? 'GitHub Releases otomatik güncelleme' : 'GitHub Releases auto-update' },
            { name: 'Vitest', version: '4.x', role: isTr ? 'Birim testleri' : 'Unit tests' },
          ],
          bullets: isTr
            ? [
                'Hedef platform: Windows x64',
                'Uygulama kimliği: com.iskeletakip.app',
                'Dev port: 5175, production: dist-web/index.html',
              ]
            : [
                'Target platform: Windows x64',
                'App ID: com.iskeletakip.app',
                'Dev port: 5175, production: dist-web/index.html',
              ],
          icon: FileCode2,
        },
      ],
    },
    {
      id: 'backend',
      title: isTr ? 'Backend (API)' : 'Backend (API)',
      description: isTr
        ? 'Node.js 20 + Express 5 + PostgreSQL 16 üzerine inşa edilmiş, repository pattern ve service katmanı ile organize kurumsal REST API.'
        : 'An enterprise REST API built on Node.js 20 + Express 5 + PostgreSQL 16, organized with repository pattern and service layer.',
      sections: [
        {
          id: 'api-core',
          badge: isTr ? 'Çekirdek' : 'Core',
          title: isTr ? 'API Çekirdek Teknolojileri' : 'API Core Technologies',
          desc: isTr
            ? 'ES Modules tabanlı Node.js backend; Express 5 HTTP sunucusu ve pg bağlantı havuzu ile PostgreSQL 16 veritabanına bağlanır.'
            : 'ES Modules-based Node.js backend; Express 5 HTTP server connects to PostgreSQL 16 via pg connection pool.',
          techStack: [
            { name: 'Node.js', version: '20', role: isTr ? 'Çalışma ortamı' : 'Runtime' },
            { name: 'Express', version: '5.x', role: isTr ? 'HTTP sunucusu ve routing' : 'HTTP server and routing' },
            { name: 'PostgreSQL', version: '16', role: isTr ? 'İlişkisel veritabanı' : 'Relational database' },
            { name: 'pg', version: '8.x', role: isTr ? 'Bağlantı havuzu' : 'Connection pool' },
          ],
          icon: Database,
        },
        {
          id: 'api-security',
          badge: isTr ? 'Güvenlik' : 'Security',
          title: isTr ? 'Kimlik Doğrulama & Yetkilendirme' : 'Authentication & Authorization',
          desc: isTr
            ? 'JWT tabanlı kimlik doğrulama ve aksiyon bazlı izin sistemi. Parolalar bcrypt ile hashlenir; hassas log alanları maskelenir.'
            : 'JWT-based authentication and action-based permission system. Passwords hashed with bcrypt; sensitive log fields masked.',
          techStack: [
            { name: 'jsonwebtoken', role: isTr ? 'JWT üretimi ve doğrulama' : 'JWT generation and validation' },
            { name: 'bcryptjs', role: isTr ? 'Parola hashleme' : 'Password hashing' },
            { name: 'express-rate-limit', role: isTr ? 'Hassas uç noktalarda hız sınırlama' : 'Rate limiting on sensitive endpoints' },
            { name: 'express-validator', role: isTr ? 'HTTP istek doğrulama' : 'HTTP request validation' },
            { name: 'joi', role: isTr ? 'Excel import şema doğrulama' : 'Excel import schema validation' },
          ],
          bullets: isTr
            ? [
                'İzin formatı: {modül}_{aksiyon} (ör. customers_view, contracts_create)',
                'Opsiyonel HMAC-SHA256 request signing',
                '66+ versiyonlu SQL migration dosyası',
              ]
            : [
                'Permission format: {module}_{action} (e.g. customers_view, contracts_create)',
                'Optional HMAC-SHA256 request signing',
                '66+ versioned SQL migration files',
              ],
          icon: Lock,
        },
        {
          id: 'api-docs',
          badge: isTr ? 'Belge Motoru' : 'Document Engine',
          title: isTr ? 'Belge Üretim & Raporlama' : 'Document Generation & Reporting',
          desc: isTr
            ? 'TipTap JSON şablonları widget kayıtları ve placeholder değiştirme ile HTML\'e dönüştürülür; ardından PDF veya DOCX olarak export edilir.'
            : 'TipTap JSON templates are converted to HTML via widget registry and placeholder replacement; then exported as PDF or DOCX.',
          techStack: [
            { name: '@tiptap/html', role: isTr ? 'JSON şablon → HTML' : 'JSON template → HTML' },
            { name: 'Puppeteer', role: isTr ? 'HTML → PDF render (Chromium)' : 'HTML → PDF render (Chromium)' },
            { name: 'docx', role: isTr ? 'DOCX belge üretimi' : 'DOCX document generation' },
            { name: 'exceljs', role: isTr ? 'Excel import/export' : 'Excel import/export' },
          ],
          icon: FileCode2,
        },
        {
          id: 'api-infra',
          badge: isTr ? 'Altyapı' : 'Infrastructure',
          title: isTr ? 'Dağıtım & Gözlemlenebilirlik' : 'Deployment & Observability',
          desc: isTr
            ? 'Docker Compose ile api, db ve db-backup servisleri olarak çalışır. Winston ile yapılandırılmış JSON loglama; günlük otomatik veritabanı yedeklemesi.'
            : 'Runs as api, db, and db-backup services via Docker Compose. Structured JSON logging with Winston; daily automatic database backup.',
          techStack: [
            { name: 'Docker / Docker Compose', role: isTr ? 'Konteyner tabanlı dağıtım' : 'Container-based deployment' },
            { name: 'Winston', role: isTr ? 'Yapılandırılmış loglama (JSON, redaction)' : 'Structured logging (JSON, redaction)' },
            { name: 'multer', role: isTr ? 'Dosya yükleme (şablon görselleri)' : 'File upload (template images)' },
            { name: 'nodemon', role: isTr ? 'Geliştirme ortamı hot reload' : 'Dev environment hot reload' },
          ],
          bullets: isTr
            ? [
                '~30 route modülü, ~25 repository modülü',
                'GET /health → { "status": "ok" }',
                'Admin yedekleme: POST /api/v1/admin/system/backup',
                'pg_advisory_lock ile eşzamanlı migration koruması',
              ]
            : [
                '~30 route modules, ~25 repository modules',
                'GET /health → { "status": "ok" }',
                'Admin backup: POST /api/v1/admin/system/backup',
                'Concurrent migration protection via pg_advisory_lock',
              ],
          icon: Container,
        },
      ],
    },
    {
      id: 'patterns',
      title: isTr ? 'Mimari Desenler' : 'Architecture Patterns',
      description: isTr
        ? 'Projeyi ölçeklenebilir ve bakımı kolay kılan temel yazılım desenleri ve domain mantığı.'
        : 'Core software patterns and domain logic that keep the project scalable and maintainable.',
      sections: [
        {
          id: 'domain-logic',
          badge: isTr ? 'Domain Mantığı' : 'Domain Logic',
          title: isTr ? 'İş Modülleri & Domain Kuralları' : 'Business Modules & Domain Rules',
          desc: isTr
            ? 'Teklif → sözleşme dönüşümü, kiralama fiyatlandırması, stok fişi motoru ve çoklu para birimi desteği gibi kritik iş kuralları backend\'de merkezi olarak yönetilir.'
            : 'Critical business rules like quote → contract conversion, rental pricing, stock receipt engine, and multi-currency support are centrally managed on the backend.',
          bullets: isTr
            ? [
                'Teklif durumları: pending, accepted, rejected → sözleşmeye dönüşüm',
                'Minimum kiralama süresi 30 gün; TRY, EUR, USD desteği',
                'Stok fişi tipleri: IN, OUT, TRANSFER, CONSUMPTION',
                'Otomatik fiş numarası: SF-YYYYMM-XXXX',
                'AuditLogs: CREATE/UPDATE/DELETE işlemleri izlenir',
              ]
            : [
                'Quote states: pending, accepted, rejected → contract conversion',
                'Minimum rental period 30 days; TRY, EUR, USD support',
                'Stock receipt types: IN, OUT, TRANSFER, CONSUMPTION',
                'Auto receipt number: SF-YYYYMM-XXXX',
                'AuditLogs: CREATE/UPDATE/DELETE operations tracked',
              ],
          icon: Layers,
        },
        {
          id: 'client-patterns',
          badge: isTr ? 'İstemci Desenleri' : 'Client Patterns',
          title: isTr ? 'Frontend Mimari Desenleri' : 'Frontend Architecture Patterns',
          desc: isTr
            ? 'Domain odaklı organizasyon, merkezi API istemcisi ve minimal global state ile bakımı kolay bir istemci mimarisi.'
            : 'A maintainable client architecture with domain-focused organization, central API client, and minimal global state.',
          bullets: isTr
            ? [
                'API-First: tüm CRUD backend\'de, istemci sunum katmanı',
                'Domain odaklı: her iş alanı kendi sayfa, modal ve servisi',
                'Merkezi ApiClient: hata normalizasyonu, metrik toplama, blob/upload',
                'Route Guard: oturum + admin + izin üç seviyeli kontrol',
                'apiError.ts: backend hatalarını Türkçe kullanıcı dostu metne dönüştürme',
              ]
            : [
                'API-First: all CRUD on backend, client is presentation layer',
                'Domain-focused: each business area has its own page, modals, and service',
                'Central ApiClient: error normalization, metrics, blob/upload',
                'Route Guard: session + admin + permission three-level check',
                'apiError.ts: converts backend errors to user-friendly Turkish messages',
              ],
          icon: Monitor,
        },
        {
          id: 'server-patterns',
          badge: isTr ? 'Sunucu Desenleri' : 'Server Patterns',
          title: isTr ? 'Backend Mimari Desenleri' : 'Backend Architecture Patterns',
          desc: isTr
            ? 'Repository pattern, service layer ve transaction-first yaklaşım ile veri tutarlılığı ve iş kuralı ayrıştırması.'
            : 'Data consistency and business rule separation via repository pattern, service layer, and transaction-first approach.',
          bullets: isTr
            ? [
                'Thin Controllers: çoğu akış route → repository zinciri',
                'Transaction-first: stok fişleri, sözleşme dönüşümleri',
                'SELECT FOR UPDATE ile yarış durumu koruması',
                'schema_migrations: SHA-256 checksum + advisory lock',
                'WidgetRegistry: {{malzemeTablosu}}, {{musteriAdi}} placeholder sistemi',
              ]
            : [
                'Thin Controllers: most flows follow route → repository chain',
                'Transaction-first: stock receipts, contract conversions',
                'Race condition protection via SELECT FOR UPDATE',
                'schema_migrations: SHA-256 checksum + advisory lock',
                'WidgetRegistry: {{malzemeTablosu}}, {{musteriAdi}} placeholder system',
              ],
          icon: Server,
        },
        {
          id: 'security-patterns',
          badge: isTr ? 'Güvenlik' : 'Security',
          title: isTr ? 'Güvenlik Mimarisi' : 'Security Architecture',
          desc: isTr
            ? 'Uçtan uca güvenlik: Electron izolasyonu, JWT kimlik doğrulama, aksiyon bazlı izinler ve opsiyonel istek imzalama.'
            : 'End-to-end security: Electron isolation, JWT authentication, action-based permissions, and optional request signing.',
          bullets: isTr
            ? [
                'Electron: nodeIntegration kapalı, contextIsolation aktif, CSP kuralları',
                'JWT payload: userId, username, permissions dizisi',
                'Winston: Authorization, password, token alanları maskelenir',
                'Nginx arkası: trust proxy etkin, JSON body limiti 10 MB',
                'Timing-safe karşılaştırma ile timing attack koruması',
              ]
            : [
                'Electron: nodeIntegration off, contextIsolation on, CSP rules',
                'JWT payload: userId, username, permissions array',
                'Winston: Authorization, password, token fields masked',
                'Behind Nginx: trust proxy enabled, JSON body limit 10 MB',
                'Timing attack protection via timing-safe comparison',
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
      {/* Category Tabs */}
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

      {/* Category description */}
      <div className="max-w-2xl">
        <p className="text-gray-light text-sm sm:text-base italic">{currentCategory.description}</p>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:grid grid-cols-[380px_1fr] gap-8 lg:gap-12 items-stretch min-h-[480px]">
        {/* Left: Section Selectors */}
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

        {/* Right: Detail Panel */}
        <div className="flex flex-col bg-dark-card border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
          {/* Header Bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-black/40">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/[0.03] border border-white/5 rounded-md text-[11px] font-mono text-gray-light select-none">
              <Layers size={10} className="text-gray" />
              <span>tech.iskeletakip.com/{currentSection.id}</span>
            </div>
            <div className="w-12" />
          </div>

          {/* Content */}
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

      {/* Mobile Accordion */}
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
