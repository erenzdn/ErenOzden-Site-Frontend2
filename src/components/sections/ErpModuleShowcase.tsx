'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  ShieldCheck, 
  Users, 
  Package, 
  Warehouse, 
  History, 
  Coins, 
  Lock, 
  FileText, 
  FileSignature, 
  BarChart3,
  Sparkles,
  Monitor,
  LayoutTemplate,
  FileEdit
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErpModuleShowcaseProps {
  locale: 'tr' | 'en';
}

interface FeatureItem {
  id: string;
  step: string;
  badge: string;
  title: string;
  desc: string;
  image: string;
  icon: React.ComponentType<any>;
}

interface Category {
  id: string;
  title: string;
  description: string;
  features: FeatureItem[];
}

export default function ErpModuleShowcase({ locale }: ErpModuleShowcaseProps) {
  const isTr = locale === 'tr';

  const categories: Category[] = [
    {
      id: 'operations',
      title: isTr ? 'Operasyonel Altyapı' : 'Operational Base',
      description: isTr 
        ? 'Şantiye envanterlerini ve lojistik akışlarını sıfır hata ile yöneten omurga modülleri.'
        : 'Core modules designed to manage jobsite inventories and logistical flows with zero error.',
      features: [
        {
          id: 'inventory',
          step: '03',
          badge: isTr ? 'Stok Kontrolü' : 'Stock Control',
          title: isTr ? 'Gerçek Zamanlı Akıllı Envanter Takibi' : 'Real-time Smart Inventory Ledger',
          desc: isTr
            ? 'İskele ve ekipmanların ağırlık, birim fiyat ve döviz bazlı maliyetlerinin (TL, USD, EUR) takibi. Stok durumunu ("Stok Yok", "Kritik", "Düşük") otomatik analiz ederek uyarılar üretir.'
            : 'Tracking of scaffolding units with weight metrics, unit costs, and multi-currency ledgers (TRY, USD, EUR). Generates automatic warnings for low or critical stock levels.',
          image: '/projects/iskele-takip/inventory-mockup.png',
          icon: Package,
        },
        {
          id: 'warehouses',
          step: '04',
          badge: isTr ? 'Lojistik & Depolama' : 'Logistics & Warehousing',
          title: isTr ? 'Çoklu Depo ve Kiralama Sevkiyat Takibi' : 'Multi-Warehouse & Rental Tracking',
          desc: isTr
            ? 'Ana depo ve şubeler arasındaki ürün dağılımlarının, aktif kiradaki malzemelerin ve depo doluluk oranlarının anlık izlenmesi. Depolar arası sevkiyat planlamasını kolaylaştırır.'
            : 'Instant monitoring of product distribution, rented equipment, and utilization rates across multiple warehouses. Facilitates seamless logistics planning.',
          image: '/projects/iskele-takip/warehouses-mockup.png',
          icon: Warehouse,
        },
        {
          id: 'invoice',
          step: '08',
          badge: isTr ? 'Fatura Kaydı' : 'Billing Ledger',
          title: isTr ? 'Hızlı Alış Faturası ve Girdi Girişi' : 'Accelerated Purchase Invoice Logging',
          desc: isTr
            ? 'Tedarikçi bilgileri, vergi oranları, iskonto oranları ve depo konumlarının girildiği fatura formu. Malzeme girişlerini otomatik olarak envanter stok miktarlarıyla senkronize eder.'
            : 'Invoice registry for logging supplier profiles, tax details, and destination warehouses. Automatically feeds and synchronizes physical inventory quantities.',
          image: '/projects/iskele-takip/purchase-invoice-mockup.png',
          icon: FileText,
        },
        {
          id: 'crm',
          step: '02',
          badge: isTr ? 'Müşteri İlişkileri' : 'CRM Engine',
          title: isTr ? 'Müşteri ve Sözleşme Portföy Yönetimi' : 'Client & Contract Lifecycle Management',
          desc: isTr
            ? 'Cari hesapların, vergi detaylarının, iletişim bilgilerinin ve aktif sözleşmelerin tek ekrandan yönetimi. Hızlı filtreleme ve dışa/içe veri aktarım desteğiyle operasyonel hızı artırır.'
            : 'Unified console to manage clients, tax profiles, contact info, and active contracts. Features rapid filtering and bulk data import/export to accelerate workflow.',
          image: '/projects/iskele-takip/customers-mockup.png',
          icon: Users,
        },
      ],
    },
    {
      id: 'commerce',
      title: isTr ? 'Ticari & Finans Motoru' : 'Commerce & Finance',
      description: isTr
        ? 'Kiralama tekliflerinden kasa hesaplarına kadar nakit akışını ve satışları yöneten finansal araçlar.'
        : 'Financial tools managing revenue streams, active sales pipelines, and cash registers.',
      features: [
        {
          id: 'rental-quote',
          step: '09',
          badge: isTr ? 'Teklif Hazırlama' : 'Rental Proposals',
          title: isTr ? 'Kiralama Teklifi ve Fiyatlandırma Modülü' : 'Customizable Rental Proposals & Quoting',
          desc: isTr
            ? 'Süre, para birimi, dil ve iskonto seçenekleriyle kiralama teklifi oluşturma formu. Sistem şablonları ve hazır paketler sayesinde teklif hazırlama süresini dakikalara indirir.'
            : 'Proposal manager allowing quick compilation of client quotes. Combines pre-configured templates and kit packages to reduce quoting lifecycle to minutes.',
          image: '/projects/iskele-takip/rental-quote-mockup.png',
          icon: FileSignature,
        },
        {
          id: 'sales-quotes',
          step: '10',
          badge: isTr ? 'Teklif Portföyü' : 'Sales Pipeline',
          title: isTr ? 'Satış Teklifleri ve Durum Takip Paneli' : 'Sales Pipeline & Proposal Analytics',
          desc: isTr
            ? 'Oluşturulan tüm satış ve kiralama tekliflerinin, onay durumlarının (Beklemede, Onaylandı, İptal Edildi) ve geçerlilik tarihlerinin kronolojik ve aranabilir listesi.'
            : 'Centralized registry displaying all generated commercial proposals, along with real-time status indicators (Pending, Approved, Canceled) and audit meta.',
          image: '/projects/iskele-takip/sales-quotes-mockup.png',
          icon: BarChart3,
        },
        {
          id: 'quote-templates',
          step: '11',
          badge: isTr ? 'Şablon Kütüphanesi' : 'Template Library',
          title: isTr ? 'Teklif Şablonları ve Kategori Yönetimi' : 'Proposal Templates & Category Management',
          desc: isTr
            ? 'Kategori, alt kategori, teklif şablonu ve hazır teklif paketi işlemlerinin tek merkezden yönetilmesi. Şablon kopyalama, düzenleme ve silme süreçleriyle teklif işlemlerini standartlaştırır.'
            : 'Centralized control panel for managing categories, subcategories, proposal templates, and pre-packaged offers. Standardizes workflows with quick duplicate, edit, and delete tools.',
          image: '/projects/iskele-takip/quote-templates-mockup.png',
          icon: LayoutTemplate,
        },
        {
          id: 'quote-editor',
          step: '12',
          badge: isTr ? 'Şablon Editörü' : 'Template Editor',
          title: isTr ? 'Zengin İçerikli Dinamik Teklif Editörü' : 'Dynamic Rich-Text Proposal Editor',
          desc: isTr
            ? 'Müşteri, şantiye, çek ve teklif detayları gibi dinamik değişkenlerin ve malzeme tablolarının tek tıkla eklenebildiği gelişmiş WYSIWYG şablon tasarım editörü.'
            : 'An advanced WYSIWYG template editor allowing on-the-fly injection of dynamic client profiles, payment terms, site info, and multi-currency equipment lists.',
          image: '/projects/iskele-takip/quote-editor-mockup.png',
          icon: FileEdit,
        },
        {
          id: 'finance',
          step: '06',
          badge: isTr ? 'Finansal Takip' : 'Treasury Management',
          title: isTr ? 'Kasa, Banka ve Nakit Akışı Yönetimi' : 'Cash, Bank & Cash Flow Registry',
          desc: isTr
            ? 'Şirket kasalarının ve banka hesaplarının TL, USD, EUR bazlı bakiye takipleri. Tahsilat, ödeme ve fatura işlemlerinin mali hareketlerini tek bir finans panelinden yönetir.'
            : 'Real-time balance tracking across cash registers and bank accounts in multi-currency ledger. Streamlines collections, disbursements, and financial operations.',
          image: '/projects/iskele-takip/cash-bank-mockup.png',
          icon: Coins,
        },
      ],
    },
    {
      id: 'security',
      title: isTr ? 'Güvenlik & Denetim' : 'Security & Access',
      description: isTr
        ? 'Kurumsal düzeyde rol yetkilendirmesi ve geriye dönük audit takibi sağlayan güvenlik kalkanı.'
        : 'Enterprise security providing role delegation, granular permissions, and full audit logs.',
      features: [
        {
          id: 'auth',
          step: '01',
          badge: isTr ? 'Güvenli Giriş' : 'Secure Auth',
          title: isTr ? 'Merkezi Kimlik Doğrulama & Yetkilendirme' : 'Centralized Authentication & Role Management',
          desc: isTr
            ? 'Sisteme yetkisiz erişimleri engelleyen, modern şifreleme algoritmaları ile güçlendirilmiş güvenli giriş ekranı. Kullanıcı rolüne göre dinamik menü ve yetki sınırlandırması uygular.'
            : 'Secure gateway designed to block unauthorized access using advanced encryption. Enforces dynamic menu visibility and operational limits based on user role.',
          image: '/projects/iskele-takip/login-mockup.png',
          icon: ShieldCheck,
        },
        {
          id: 'permissions',
          step: '07',
          badge: isTr ? 'Gelişmiş İzinler' : 'Role-Based Access',
          title: isTr ? 'Kullanıcı Rolü ve Detaylı İzin Yönetimi' : 'Granular User Permission & Role Controls',
          desc: isTr
            ? 'Sistem yöneticilerinin yeni kullanıcılar eklemesini ve bunlara modül bazlı (Kasa, Depolar, Fatura vb.) ekleme, silme, güncelleme veya görüntüleme yetkileri atamasını sağlayan modal panel.'
            : 'Modular administrative panel enabling system operators to provision new users and map explicit CRUD operations to separate database registers.',
          image: '/projects/iskele-takip/new-user-mockup.png',
          icon: Lock,
        },
        {
          id: 'audit',
          step: '05',
          badge: isTr ? 'Denetim & Güvenlik' : 'Audit & Compliance',
          title: isTr ? 'Detaylı Aktivite İzleme ve Audit Günlükleri' : 'Comprehensive User Activity & Audit Trails',
          desc: isTr
            ? 'Sistem üzerindeki tüm ekleme, güncelleme ve silme işlemlerinin veri tabanı seviyesinde loglanması. Geriye dönük güvenlik denetimleri ve veri tutarlılığı takibi sağlar.'
            : 'Database-level logging of every insert, update, and delete operation across all tables. Ensures total data traceability, security compliance, and recovery audit trails.',
          image: '/projects/iskele-takip/audit-mockup.png',
          icon: History,
        },
      ],
    },
  ];

  const [activeCategory, setActiveCategory] = useState<string>('operations');
  const [activeFeature, setActiveFeature] = useState<string>('inventory');

  const currentCategory = categories.find(c => c.id === activeCategory) || categories[0];
  const currentFeature = currentCategory.features.find(f => f.id === activeFeature) || currentCategory.features[0];

  // Helper to change category and auto-select its first feature
  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId);
    const cat = categories.find(c => c.id === catId);
    if (cat && cat.features.length > 0) {
      setActiveFeature(cat.features[0].id);
    }
  };

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Categories Navigator */}
      <div className="flex flex-col sm:flex-row gap-2 border-b border-white/5 pb-4">
        {categories.map((category) => {
          const isActive = activeCategory === category.id;
          return (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={cn(
                "px-5 py-3 rounded-lg text-left sm:text-center text-sm font-semibold transition-all duration-300 relative overflow-hidden outline-none cursor-pointer",
                isActive 
                  ? "bg-white text-dark shadow-lg shadow-white/5" 
                  : "text-gray-light hover:text-white hover:bg-white/5"
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
        <p className="text-gray-light text-sm sm:text-base italic">
          {currentCategory.description}
        </p>
      </div>

      {/* Desktop & Tablet Interactive Grid (hidden on narrow mobile) */}
      <div className="hidden md:grid grid-cols-[380px_1fr] gap-8 lg:gap-12 items-stretch min-h-[500px]">
        {/* Left Side: Feature Selectors */}
        <div className="space-y-3 flex flex-col justify-start">
          {currentCategory.features.map((feat) => {
            const isActive = activeFeature === feat.id;
            const Icon = feat.icon;
            
            return (
              <button
                key={feat.id}
                onClick={() => setActiveFeature(feat.id)}
                className={cn(
                  "w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-start gap-4 cursor-pointer select-none",
                  isActive
                    ? "bg-white/[0.03] border-white/15 shadow-xl shadow-black/40 translate-x-1"
                    : "bg-transparent border-transparent hover:bg-white/[0.01] hover:border-white/5"
                )}
              >
                <div className={cn(
                  "p-2.5 rounded-lg border transition-all duration-300",
                  isActive 
                    ? "bg-white text-dark border-white/20" 
                    : "bg-dark-lighter border-white/5 text-gray-light"
                )}>
                  <Icon size={18} />
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono tracking-wider text-gray uppercase font-semibold">
                      Step {feat.step}
                    </span>
                    <span className={cn(
                      "px-1.5 py-0.5 rounded text-[10px] font-mono",
                      isActive ? "bg-white/10 text-white" : "bg-white/5 text-gray-light"
                    )}>
                      {feat.badge}
                    </span>
                  </div>
                  <h4 className={cn(
                    "text-sm font-bold transition-colors",
                    isActive ? "text-white" : "text-gray-light"
                  )}>
                    {feat.title}
                  </h4>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Side: Showcase Viewport */}
        <div className="flex flex-col justify-between bg-dark-card border border-white/5 rounded-2xl overflow-hidden shadow-2xl relative">
          {/* Header Bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-black/40">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/[0.03] border border-white/5 rounded-md text-[11px] font-mono text-gray-light select-none">
              <Monitor size={10} className="text-gray" />
              <span>app.iskeletakip.com/{currentFeature.id}</span>
            </div>
            <div className="w-12" /> {/* Spacer to align address bar in center */}
          </div>

          {/* Description Box (Above image for clean read) */}
          <div className="p-6 pb-2 border-b border-white/5">
            <div className="space-y-2">
              <span className="inline-block px-2.5 py-0.5 text-[10px] font-mono font-semibold tracking-wider rounded bg-white/5 border border-white/10 text-white">
                {currentFeature.badge}
              </span>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                {currentFeature.title}
                <Sparkles size={14} className="text-white/40" />
              </h3>
              <p className="text-gray-text text-sm leading-relaxed max-w-3xl">
                {currentFeature.desc}
              </p>
            </div>
          </div>

          {/* Screenshot Render Container */}
          <div className="relative flex-1 min-h-[300px] w-full bg-black/20 p-4 flex items-center justify-center">
            <div className="relative w-full h-full aspect-[16/10] overflow-hidden rounded-lg border border-white/5 bg-black/10">
              <Image
                src={currentFeature.image}
                alt={currentFeature.title}
                fill
                className="object-contain p-2 hover:scale-[1.02] transition-transform duration-500"
                sizes="(max-width: 1024px) 80vw, 800px"
                quality={95}
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-Friendly Compact Viewport (Accordion style) */}
      <div className="md:hidden space-y-4">
        {currentCategory.features.map((feat) => {
          const isActive = activeFeature === feat.id;
          const Icon = feat.icon;

          return (
            <div 
              key={feat.id}
              className={cn(
                "border rounded-xl transition-all duration-300 overflow-hidden bg-dark-card",
                isActive ? "border-white/15 shadow-lg" : "border-white/5"
              )}
            >
              {/* Accordion Trigger */}
              <button
                onClick={() => setActiveFeature(isActive ? '' : feat.id)}
                className="w-full text-left p-4 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-lg border",
                    isActive ? "bg-white text-dark border-white/20" : "bg-dark-lighter border-white/5 text-gray-light"
                  )}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-mono text-gray font-semibold">
                        Step {feat.step}
                      </span>
                      <span className="px-1 py-0.5 rounded bg-white/5 text-[9px] font-mono text-gray-light">
                        {feat.badge}
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">
                      {feat.title}
                    </h4>
                  </div>
                </div>
                <span className={cn("text-xs transition-transform duration-300", isActive ? "rotate-90 text-white" : "text-gray")}>
                  →
                </span>
              </button>

              {/* Accordion Content */}
              {isActive && (
                <div className="p-4 pt-0 border-t border-white/5 space-y-4 bg-black/20">
                  <p className="text-gray-text text-xs leading-relaxed mt-4">
                    {feat.desc}
                  </p>
                  
                  {/* Mockup Frame */}
                  <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden border border-white/5 bg-black/40">
                    <Image
                      src={feat.image}
                      alt={feat.title}
                      fill
                      className="object-contain p-1"
                      sizes="100vw"
                      quality={90}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
