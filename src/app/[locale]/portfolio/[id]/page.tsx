import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CTA from '@/components/sections/CTA';
import Button from '@/components/ui/Button';
import { SlugMapSetter } from '@/components/SlugMapSetter';
import ErpModuleShowcase from '@/components/sections/ErpModuleShowcase';
import ErpTechnicalShowcase from '@/components/sections/ErpTechnicalShowcase';
import EarthquakeModuleShowcase from '@/components/sections/EarthquakeModuleShowcase';
import EarthquakeTechnicalShowcase from '@/components/sections/EarthquakeTechnicalShowcase';
import ProjectSectionNav from '@/components/ui/ProjectSectionNav';
import { buildProjectNavSections } from '@/lib/projectNavSections';
import {
  extractStrapiPlainText,
  fetchStrapiProject,
  fetchStrapiProjects,
  pickStrapiImageUrl,
  strapiRouteKey,
  type StrapiMedia,
  type StrapiRichTextBlock,
} from '@/lib/strapi';
import { locales, type Locale } from '@/i18n/routing';
import { type SlugMap } from '@/contexts/SlugMapContext';
import { ExternalLink, Code2, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StrapiProject {
  id: number;
  documentId: string;
  slug?: string;
  title?: string;
  description?: string | StrapiRichTextBlock[];
  image?: StrapiMedia;
  thumbnail?: StrapiMedia;
  technologies?: string | string[];
  techStack?: string | string[] | null;
  projectUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  content?: string | StrapiRichTextBlock[];
}

type Props = {
  params: Promise<{ locale: Locale; id: string }>;
};

const REVALIDATE = { next: { revalidate: 3600 } } as const;

async function getProjectSlugMap(documentId: string, currentLocale: Locale): Promise<SlugMap> {
  const slugMap: SlugMap = {};
  
  try {
    const results = await Promise.allSettled(
      locales.map(async (locale) => {
        const project = await fetchStrapiProject<StrapiProject>(documentId, locale, REVALIDATE);
        return { locale, key: project ? strapiRouteKey(project) : '' };
      })
    );

    results.forEach((result) => {
      if (result.status === 'fulfilled' && result.value.key) {
        slugMap[result.value.locale] = result.value.key;
      }
    });
    
    if (!slugMap[currentLocale]) {
      slugMap[currentLocale] = documentId;
    }
  } catch (error) {
    slugMap[currentLocale] = documentId;
  }

  return slugMap;
}

export async function generateStaticParams() {
  const params: { locale: Locale; id: string }[] = [];
  const seen = new Set<string>();

  for (const locale of locales) {
    const projects = await fetchStrapiProjects<StrapiProject>(locale, REVALIDATE);
    projects.forEach((project) => {
      const routeId = strapiRouteKey(project);
      const dedupeKey = `${locale}:${routeId}`;
      if (routeId && !seen.has(dedupeKey)) {
        seen.add(dedupeKey);
        params.push({ locale, id: routeId });
      }
    });
  }

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const project = await fetchStrapiProject<StrapiProject>(id, locale, REVALIDATE);

  if (!project) {
    return {
      title: locale === 'tr' ? 'Proje Bulunamadı' : 'Project Not Found',
    };
  }

  const isErpProject = id === 'kurumsal-erp-ve-takip-sistemi' || 
    id === 'scalable-enterprise-erp-system' ||
    project.slug === 'kurumsal-erp-ve-takip-sistemi' ||
    project.slug === 'scalable-enterprise-erp-system';
  const title = isErpProject 
    ? (locale === 'tr' ? 'İskeleTakip — Bulut Tabanlı Şantiye & ERP Platformu' : 'İskeleTakip — Cloud-Native Scaffolding & ERP Platform')
    : (project.title || (locale === 'tr' ? 'Proje Detayı' : 'Project Detail'));
  const description = isErpProject
    ? (locale === 'tr' 
        ? 'İskele kiralama ve şantiye envanter yönetimindeki kayıpları sıfırlayan; çoklu depo takipli ve akıllı kiralama teklif motorlu kurumsal B2B SaaS platformu.' 
        : 'An enterprise-grade B2B SaaS platform designed to eliminate scaffolding rental leakages; featuring multi-warehouse tracking and automated quote builders.')
    : extractStrapiPlainText(project.description);
  const baseUrl = 'https://erenozden.com';

  return {
    title: `${title} | Eren Özden`,
    description: description || undefined,
    alternates: {
      canonical: `${baseUrl}/${locale}/portfolio/${id}`,
    },
    openGraph: {
      title: `${title} | Eren Özden`,
      description: description || undefined,
      url: `${baseUrl}/${locale}/portfolio/${id}`,
      locale: locale === 'tr' ? 'tr_TR' : 'en_US',
      alternateLocale: locale === 'tr' ? 'en_US' : 'tr_TR',
      type: 'website',
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const fs = require('node:fs');
  const log = (msg: string) => {
    try {
      fs.appendFileSync('c:/Users/msi-nb/Desktop/ERENOZDEN-FRONTEND-2/debug.log', msg + '\n');
    } catch (e) {}
  };

  const { locale, id } = await params;
  log(`[ProjectDetailPage] params locale: "${locale}", id: "${id}"`);
  setRequestLocale(locale);

  log(`[ProjectDetailPage] fetching project...`);
  let project: any = null;
  let t: any = null;
  try {
    const res = await Promise.all([
      fetchStrapiProject<StrapiProject>(id, locale, REVALIDATE),
      getTranslations('common'),
    ]);
    project = res[0];
    t = res[1];
    log(`[ProjectDetailPage] project fetched: ${project ? 'SUCCESS' : 'FAILED'}`);
  } catch (err: any) {
    log(`[ProjectDetailPage] fetch error: ${err.message || err}`);
  }
  
  if (!project) {
    log(`[ProjectDetailPage] project is null/undefined, triggering notFound()`);
    notFound();
  }

  const slugMap = await getProjectSlugMap(project.documentId, locale);

  const isEarthquakeCheck = id === 'earthquake-check' || project.slug === 'earthquake-check';
  const isErpProject = id === 'kurumsal-erp-ve-takip-sistemi' || 
    id === 'scalable-enterprise-erp-system' ||
    project.slug === 'kurumsal-erp-ve-takip-sistemi' ||
    project.slug === 'scalable-enterprise-erp-system';

  const title = isErpProject 
    ? (locale === 'tr' ? 'İskeleTakip — Bulut Tabanlı Şantiye & ERP Platformu' : 'İskeleTakip — Cloud-Native Scaffolding & ERP Platform')
    : (project.title || (locale === 'tr' ? 'Proje Detayı' : 'Project Detail'));

  const description = isErpProject
    ? (locale === 'tr' 
        ? 'İskele kiralama ve şantiye envanter yönetimindeki kayıpları sıfırlamak üzere tasarlanmış; çoklu depo takipli, akıllı teklif motorlu ve veritabanı seviyesinde işlem loglama altyapısına sahip kurumsal B2B SaaS çözümü.' 
        : 'An enterprise-grade B2B SaaS startup designed to eliminate inventory losses in scaffolding rentals; featuring multi-warehouse tracking, smart quoting, and db-level audit logging.')
    : extractStrapiPlainText(project.description);

  const content = isErpProject
    ? (locale === 'tr'
        ? 'İskeleTakip, şantiyeler ve iskele kiralama firmaları için operasyonel kayıpları ve kiralama hesaplama hatalarını ortadan kaldırmak amacıyla sıfırdan geliştirilmiş bulut tabanlı bir ERP sistemidir. Klasik ERP sistemlerinin aksine şantiyelerin dinamik doğasına (günlük kiralama bedelleri, parça parça ekipman iadeleri, depo lojistik hareketleri) göre optimize edilmiş özel algoritmalara sahiptir.\n\nSistem; her bir şantiye ve depo arasındaki ürün dağılımlarını anlık izleyen envanter motoru, döviz bazlı kasa ve banka bakiye hareketlerini takip eden finans ünitesi ve müşteriye dakikalar içinde PDF formatında resmi kiralama teklifleri hazırlayan akıllı bir teklif motoru sunar.'
        : 'İskeleTakip is a cloud-native ERP platform built from the ground up to eradicate operational losses and rental computation errors for construction sites and equipment rental firms. Unlike generic ERP platforms, it features custom algorithms tailored specifically to the dynamic nature of jobsites—including daily interest calculations, partial scaffolding unit returns, and cross-warehouse transfers.\n\nThe system integrates a real-time inventory engine tracking equipment distributions across jobsites, a finance terminal managing cash and bank balances in multiple currencies, and a smart proposal manager compiling formal PDF rental quotes in seconds.')
    : (extractStrapiPlainText(project.content) || description);

  const imageUrl = pickStrapiImageUrl(project.thumbnail || project.image);

  let technologies: string[] = [];
  const tech = project.techStack || project.technologies;
  if (typeof tech === 'string') technologies = tech.split(',').map((t) => t.trim());
  else if (Array.isArray(tech)) technologies = tech;

  const projectUrl = project.liveUrl || project.projectUrl || '';
  const githubUrl = project.githubUrl || '';

  const hasSidebar = (technologies && technologies.length > 0) || 
    (projectUrl && projectUrl !== '#' && projectUrl !== '') || 
    (githubUrl && githubUrl !== '#' && githubUrl !== '');

  const erpSteps = [
    {
      step: '01',
      title: locale === 'tr' ? 'Merkezi Kimlik Doğrulama & Yetkilendirme' : 'Centralized Authentication & Role Management',
      desc: locale === 'tr' 
        ? 'Sisteme yetkisiz erişimleri engelleyen, modern şifreleme algoritmaları ile güçlendirilmiş güvenli giriş ekranı. Kullanıcı rolüne göre dinamik menü ve yetki sınırlandırması uygular.'
        : 'Secure gateway designed to block unauthorized access using advanced encryption. Enforces dynamic menu visibility and operational limits based on user role.',
      image: '/projects/iskele-takip/login-mockup.png',
      badge: locale === 'tr' ? 'Güvenli Giriş' : 'Secure Auth',
    },
    {
      step: '02',
      title: locale === 'tr' ? 'Müşteri ve Sözleşme Portföy Yönetimi' : 'Client & Contract Lifecycle Management',
      desc: locale === 'tr'
        ? 'Cari hesapların, vergi detaylarının, iletişim bilgilerinin ve aktif sözleşmelerin tek ekrandan yönetimi. Hızlı filtreleme ve dışa/içe veri aktarım desteğiyle operasyonel hızı artırır.'
        : 'Unified console to manage clients, tax profiles, contact info, and active contracts. Features rapid filtering and bulk data import/export to accelerate workflow.',
      image: '/projects/iskele-takip/customers-mockup.png',
      badge: locale === 'tr' ? 'Müşteri İlişkileri' : 'CRM Engine',
    },
    {
      step: '03',
      title: locale === 'tr' ? 'Gerçek Zamanlı Akıllı Envanter Takibi' : 'Real-time Smart Inventory Ledger',
      desc: locale === 'tr'
        ? 'İskele ve ekipmanların ağırlık, birim fiyat ve döviz bazlı maliyetlerinin (TL, USD, EUR) takibi. Stok durumunu ("Stok Yok", "Kritik", "Düşük") otomatik analiz ederek uyarılar üretir.'
        : 'Tracking of scaffolding units with weight metrics, unit costs, and multi-currency ledgers (TRY, USD, EUR). Generates automatic warnings for low or critical stock levels.',
      image: '/projects/iskele-takip/inventory-mockup.png',
      badge: locale === 'tr' ? 'Stok Kontrolü' : 'Stock Control',
    },
    {
      step: '04',
      title: locale === 'tr' ? 'Çoklu Depo ve Kiralama Sevkiyat Takibi' : 'Multi-Warehouse & Rental Tracking',
      desc: locale === 'tr'
        ? 'Ana depo ve şubeler arasındaki ürün dağılımlarının, aktif kiradaki malzemelerin ve depo doluluk oranlarının anlık izlenmesi. Depolar arası sevkiyat planlamasını kolaylaştırır.'
        : 'Instant monitoring of product distribution, rented equipment, and utilization rates across multiple warehouses. Facilitates seamless logistics planning.',
      image: '/projects/iskele-takip/warehouses-mockup.png',
      badge: locale === 'tr' ? 'Lojistik & Depolama' : 'Logistics & Warehousing',
    },
    {
      step: '05',
      title: locale === 'tr' ? 'Detaylı Aktivite İzleme ve Audit Günlükleri' : 'Comprehensive User Activity & Audit Trails',
      desc: locale === 'tr'
        ? 'Sistem üzerindeki tüm ekleme, güncelleme ve silme işlemlerinin veri tabanı seviyesinde loglanması. Geriye dönük güvenlik denetimleri ve veri tutarlılığı takibi sağlar.'
        : 'Database-level logging of every insert, update, and delete operation across all tables. Ensures total data traceability, security compliance, and recovery audit trails.',
      image: '/projects/iskele-takip/audit-mockup.png',
      badge: locale === 'tr' ? 'Denetim & Güvenlik' : 'Audit & Compliance',
    },
    {
      step: '06',
      title: locale === 'tr' ? 'Kasa, Banka ve Nakit Akışı Yönetimi' : 'Cash, Bank & Cash Flow Registry',
      desc: locale === 'tr'
        ? 'Şirket kasalarının ve banka hesaplarının TL, USD, EUR bazlı bakiye takipleri. Tahsilat, ödeme ve fatura işlemlerinin mali hareketlerini tek bir finans panelinden yönetir.'
        : 'Real-time balance tracking across cash registers and bank accounts in multi-currency ledger. Streamlines collections, disbursements, and financial operations.',
      image: '/projects/iskele-takip/cash-bank-mockup.png',
      badge: locale === 'tr' ? 'Finansal Takip' : 'Treasury Management',
    },
    {
      step: '07',
      title: locale === 'tr' ? 'Kullanıcı Rolü ve Detaylı İzin Yönetimi' : 'Granular User Permission & Role Controls',
      desc: locale === 'tr'
        ? 'Sistem yöneticilerinin yeni kullanıcılar eklemesini ve bunlara modül bazlı (Kasa, Depolar, Fatura vb.) ekleme, silme, güncelleme veya görüntüleme yetkileri atamasını sağlayan modal panel.'
        : 'Modular administrative panel enabling system operators to provision new users and map explicit CRUD operations to separate database registers.',
      image: '/projects/iskele-takip/new-user-mockup.png',
      badge: locale === 'tr' ? 'Gelişmiş İzinler' : 'Role-Based Access',
    },
    {
      step: '08',
      title: locale === 'tr' ? 'Hızlı Alış Faturası ve Girdi Girişi' : 'Accelerated Purchase Invoice Logging',
      desc: locale === 'tr'
        ? 'Tedarikçi bilgileri, vergi oranları, iskonto oranları ve depo konumlarının girildiği fatura formu. Malzeme girişlerini otomatik olarak envanter stok miktarlarıyla senkronize eder.'
        : 'Invoice registry for logging supplier profiles, tax details, and destination warehouses. Automatically feeds and synchronizes physical inventory quantities.',
      image: '/projects/iskele-takip/purchase-invoice-mockup.png',
      badge: locale === 'tr' ? 'Fatura Kaydı' : 'Billing Ledger',
    },
    {
      step: '09',
      title: locale === 'tr' ? 'Kiralama Teklifi ve Fiyatlandırma Modülü' : 'Customizable Rental Proposals & Quoting',
      desc: locale === 'tr'
        ? 'Süre, para birimi, dil ve iskonto seçenekleriyle kiralama teklifi oluşturma formu. Sistem şablonları ve hazır paketler sayesinde teklif hazırlama süresini dakikalara indirir.'
        : 'Proposal manager allowing quick compilation of client quotes. Combines pre-configured templates and kit packages to reduce quoting lifecycle to minutes.',
      image: '/projects/iskele-takip/rental-quote-mockup.png',
      badge: locale === 'tr' ? 'Teklif Hazırlama' : 'Rental Proposals',
    },
    {
      step: '10',
      title: locale === 'tr' ? 'Satış Teklifleri ve Durum Takip Paneli' : 'Sales Pipeline & Proposal Analytics',
      desc: locale === 'tr'
        ? 'Oluşturulan tüm satış ve kiralama tekliflerinin, onay durumlarının (Beklemede, Onaylandı, İptal Edildi) ve geçerlilik tarihlerinin kronolojik ve aranabilir listesi.'
        : 'Centralized registry displaying all generated commercial proposals, along with real-time status indicators (Pending, Approved, Canceled) and audit meta.',
      image: '/projects/iskele-takip/sales-quotes-mockup.png',
      badge: locale === 'tr' ? 'Teklif Portföyü' : 'Sales Pipeline',
    },
    {
      step: '11',
      title: locale === 'tr' ? 'Teklif Şablonları ve Kategori Yönetimi' : 'Proposal Templates & Category Management',
      desc: locale === 'tr'
        ? 'Kategori, alt kategori, teklif şablonu ve hazır teklif paketi işlemlerinin tek merkezden yönetilmesi. Şablon kopyalama, düzenleme ve silme süreçleriyle teklif işlemlerini standartlaştırır.'
        : 'Centralized control panel for managing categories, subcategories, proposal templates, and pre-packaged offers. Standardizes workflows with quick duplicate, edit, and delete tools.',
      image: '/projects/iskele-takip/quote-templates-mockup.png',
      badge: locale === 'tr' ? 'Şablon Kütüphanesi' : 'Template Library',
    },
    {
      step: '12',
      title: locale === 'tr' ? 'Zengin İçerikli Dinamik Teklif Editörü' : 'Dynamic Rich-Text Proposal Editor',
      desc: locale === 'tr'
        ? 'Müşteri, şantiye, çek ve teklif detayları gibi dinamik değişkenlerin ve malzeme tablolarının tek tıkla eklenebildiği gelişmiş WYSIWYG şablon tasarım editörü.'
        : 'An advanced WYSIWYG template editor allowing on-the-fly injection of dynamic client profiles, payment terms, site info, and multi-currency equipment lists.',
      image: '/projects/iskele-takip/quote-editor-mockup.png',
      badge: locale === 'tr' ? 'Şablon Editörü' : 'Template Editor',
    },
  ];

  const earthquakeSteps = [
    {
      step: '01',
      title: locale === 'tr' ? 'Coğrafi Konum Belirleme' : 'GIS Location Pinpointing',
      desc: locale === 'tr' 
        ? 'Binanın deprem riskini ölçmek için ilk adımda interaktif harita üzerinden nokta atışı konum belirlenir. Sistem, seçilen koordinatların enlem ve boylam verilerini milimetrik olarak okur.'
        : 'To measure the seismic risk of the building, the exact coordinates are pinned on an interactive map. The system reads latitude and longitude parameters with millimetric accuracy.',
      image: '/projects/earthquake-check/form-step1-address.png',
      badge: locale === 'tr' ? 'Adres & Konum' : 'Address & Location',
    },
    {
      step: '02',
      title: locale === 'tr' ? 'Yapısal Parametrelerin Girişi' : 'Structural Parameter Input',
      desc: locale === 'tr'
        ? 'Binanın yapım yılı ve kat sayısı girilir. Bu veriler, Türkiye Bina Deprem Yönetmeliği (TBDY) standartlarına göre binanın yapısal rezonans katsayılarını hesaplamak için kullanılır.'
        : 'The construction year and number of stories are specified. These inputs are processed to calculate structural resonance coefficients in compliance with Turkish Building Earthquake Code standards.',
      image: '/projects/earthquake-check/form-step2-details.png',
      badge: locale === 'tr' ? 'Yapı Verileri' : 'Structural Data',
    },
    {
      step: '03',
      title: locale === 'tr' ? 'Sismik Simülasyon Motoru' : 'Seismic Simulation Engine',
      desc: locale === 'tr'
        ? 'Koordinat verileri aktif fay hattı mesafeleriyle karşılaştırılır. Zemin spektrumu ve sismik PGA ivmeleri taranarak binanın deprem yükü kapasitesi simüle edilir.'
        : 'Geographic coordinates are cross-verified with active fault lines. Soil spectrum and peak ground acceleration (PGA) metrics are analyzed to simulate the building\'s load-bearing capacity.',
      image: '/projects/earthquake-check/form-step3-loading.png',
      badge: locale === 'tr' ? 'Simülasyon' : 'Simulation',
    },
    {
      step: '04',
      title: locale === 'tr' ? 'Ön Analiz Raporu ve Skorlama' : 'Preliminary Safety Report',
      desc: locale === 'tr'
        ? 'Analiz sonunda yapısal güvenlik indeksi ve detaylı uzman tavsiyeleri içeren bir rapor üretilir. Binaya A\'dan F\'ye kadar bir güvenlik derecesi atanır.'
        : 'Upon completion, a comprehensive safety report with expert recommendations and a safety score ranging from A to F is generated, outlining the structure\'s vulnerability index.',
      image: '/projects/earthquake-check/form-step4-result.png',
      badge: locale === 'tr' ? 'Rapor & Skor' : 'Report & Score',
    },
  ];

  const hasPreviewSection = !!(imageUrl || isEarthquakeCheck || isErpProject);
  const hasDefaultGallery = !isEarthquakeCheck && !isErpProject && !!imageUrl;

  const navSections = buildProjectNavSections({
    locale,
    isErpProject,
    isEarthquakeCheck,
    hasPreview: hasPreviewSection,
    hasDefaultGallery,
  });

  return (
    <>
      <SlugMapSetter slugMap={slugMap} basePath="/portfolio" />
      <Header />
      <ProjectSectionNav sections={navSections} locale={locale} />
      
      <main className="relative min-h-screen bg-dark">
        {/* Hero Section - Linear Style */}
        <section id="project-hero" className="relative pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 px-4 sm:px-6 border-b border-dark-border scroll-mt-32">
          <div className="max-w-[1400px] mx-auto">
            {/* Back Button */}
            <Link 
              href={`/${locale}/portfolio`}
              className="group mb-8 sm:mb-10 lg:mb-12 inline-flex items-center gap-2 text-gray-light hover:text-white transition-colors text-sm font-medium"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span>
              <span>{t('allProjects')}</span>
            </Link>

            {/* Hero Grid */}
            <div className={cn(
              "grid gap-8 lg:gap-12 items-start mb-16 lg:mb-20 relative",
              hasSidebar ? "lg:grid-cols-[1fr_500px]" : "grid-cols-1"
            )}>
              {(isErpProject || isEarthquakeCheck) && (
                <div className="absolute -top-16 -left-12 w-72 h-72 rounded-full bg-blue-500/10 blur-[80px] pointer-events-none select-none" />
              )}
              {/* Left: Title & Description */}
              <div className="space-y-6 lg:space-y-8 z-10">
                {isErpProject && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/90 font-mono tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] animate-pulse" />
                    {locale === 'tr' ? 'KURUMSAL B2B SAAS GİRİŞİMİ' : 'ENTERPRISE B2B SAAS STARTUP'}
                  </span>
                )}
                {isEarthquakeCheck && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/90 font-mono tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] animate-pulse" />
                    {locale === 'tr' ? 'COĞRAFİ BİLGİ SİSTEMLERİ (CBS) DESTEKLİ DEPREM RİSK ANALİZİ' : 'GIS-BASED SEISMIC RISK ANALYSIS PLATFORM'}
                  </span>
                )}
                <div className="space-y-4 lg:space-y-5">
                  <h1 className={cn(
                    "text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold tracking-tight leading-tight",
                    isErpProject || isEarthquakeCheck
                      ? "bg-gradient-to-r from-white via-white to-gray bg-clip-text text-transparent"
                      : "text-white"
                  )}>
                    {title}
                  </h1>
                  
                  {description && (
                    <p className="text-base sm:text-lg md:text-xl text-gray-text leading-relaxed font-body">
                      {description}
                    </p>
                  )}
                </div>

                {/* Action Buttons - Linear style */}
                <div className="flex flex-wrap gap-3 pt-4">
                  {projectUrl && projectUrl !== '#' && (
                    <a
                      href={projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-dark rounded-lg text-sm font-semibold hover:bg-gray-100 transition-all cursor-pointer shadow-lg shadow-white/5"
                    >
                      <span>{t('liveProject')}</span>
                      <ExternalLink size={16} />
                    </a>
                  )}
                  {githubUrl && githubUrl !== '#' && (
                    <a
                      href={githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-dark-lighter border border-dark-border text-white rounded-lg text-sm font-semibold hover:bg-dark-light hover:border-gray transition-all cursor-pointer"
                    >
                      <Code2 size={16} />
                      <span>{t('sourceCode')}</span>
                    </a>
                  )}
                </div>

                {/* Statistics Grid for ERP Startup pitch */}
                {isErpProject && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-8 border-t border-white/5 max-w-2xl">
                    <div>
                      <div className="text-3xl font-bold text-white font-heading">10x</div>
                      <div className="text-xs text-gray-light font-mono mt-1">
                        {locale === 'tr' ? 'Hızlı Teklif Hazırlama' : 'Faster Proposals'}
                      </div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-white font-heading">%100</div>
                      <div className="text-xs text-gray-light font-mono mt-1">
                        {locale === 'tr' ? 'Stok Takip Garantisi' : 'Inventory Accuracy'}
                      </div>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <div className="text-3xl font-bold text-white font-heading">3+</div>
                      <div className="text-xs text-gray-light font-mono mt-1">
                        {locale === 'tr' ? 'Çoklu Para Birimi (TL/USD/EUR)' : 'Multi-Currency Flow'}
                      </div>
                    </div>
                  </div>
                )}

                {/* Statistics Grid for EarthquakeCheck */}
                {isEarthquakeCheck && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-8 border-t border-white/5 max-w-2xl">
                    <div>
                      <div className="text-3xl font-bold text-white font-heading">3+</div>
                      <div className="text-xs text-gray-light font-mono mt-1">
                        {locale === 'tr' ? 'Sismik Veri Kaynağı' : 'Seismic Data Feeds'}
                      </div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-white font-heading">&lt; 60sn</div>
                      <div className="text-xs text-gray-light font-mono mt-1">
                        {locale === 'tr' ? 'Hızlı Ön Analiz Süresi' : 'Instant Analysis Speed'}
                      </div>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <div className="text-3xl font-bold text-white font-heading">%100</div>
                      <div className="text-xs text-gray-light font-mono mt-1">
                        {locale === 'tr' ? 'Açık Kaynak & Ücretsiz' : 'Open Source & Free'}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Meta Info Card */}
              {hasSidebar && (
                <div className="bg-dark-card border border-dark-border rounded-xl lg:rounded-2xl p-5 sm:p-6 lg:p-8 space-y-5 lg:space-y-6">
                  <div className="space-y-4">

                    {/* Technologies */}
                    {technologies.length > 0 && (
                      <div className="space-y-2.5">
                        <div className="text-xs font-mono uppercase tracking-wider text-gray-light">
                          Tech Stack
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {technologies.map((tech) => (
                            <span
                              key={tech}
                              className="px-2.5 py-1.5 bg-dark-lighter border border-dark-border text-white text-xs sm:text-sm rounded-md font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quick Links */}
                    {((projectUrl && projectUrl !== '#') || (githubUrl && githubUrl !== '#')) && (
                      <div className="space-y-4">
                        <div className="h-px bg-dark-border" />
                        <div className="space-y-2">
                          <div className="text-xs font-mono uppercase tracking-wider text-gray-light mb-2.5">
                            Links
                          </div>
                          {projectUrl && projectUrl !== '#' && (
                            <a
                              href={projectUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-3 hover:bg-dark-lighter rounded-lg transition-colors group"
                            >
                              <span className="text-white text-sm font-medium">
                                {locale === 'tr' ? 'Canlı Siteyi Ziyaret Et' : 'View Live Site'}
                              </span>
                              <ExternalLink size={16} className="text-gray-light group-hover:text-white transition-colors" />
                            </a>
                          )}
                          {githubUrl && githubUrl !== '#' && (
                            <a
                              href={githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-3 hover:bg-dark-lighter rounded-lg transition-colors group"
                            >
                              <span className="text-white text-sm font-medium">
                                {locale === 'tr' ? 'Kaynak Kodunu İncele' : 'View Source Code'}
                              </span>
                              <Code2 size={16} className="text-gray-light group-hover:text-white transition-colors" />
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Main Image Section */}
        {(imageUrl || isEarthquakeCheck || isErpProject) && (
          <section id="project-preview" className="relative py-8 sm:py-12 lg:py-16 px-4 sm:px-6 border-b border-dark-border scroll-mt-32">
            <div className="max-w-[1400px] mx-auto">
              {isErpProject || isEarthquakeCheck ? (
                /* Premium Startup Browser Wrap */
                <div className="max-w-[1088px] mx-auto bg-dark-card border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] relative group transition-all duration-500 hover:border-white/20 hover:shadow-[0_0_60px_rgba(59,130,246,0.1)]">
                  {/* Browser Bar */}
                  <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 bg-black/40">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                      <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                      <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                    </div>
                    <div className="flex items-center gap-1.5 px-4 py-1.5 bg-white/[0.03] border border-white/5 rounded-md text-xs font-mono text-gray-light select-none w-full max-w-md justify-center">
                      <span>{isEarthquakeCheck ? "https://earthquakecheck.mehmeterenozden.com" : "https://app.iskeletakip.com/dashboard"}</span>
                    </div>
                    <div className="w-16" />
                  </div>
                  {/* Main Image */}
                  <div className="relative aspect-[16/10] w-full bg-black/20">
                    <Image
                      src={isEarthquakeCheck ? "/projects/earthquake-check/hero-mockup.png" : "/projects/iskele-takip/dashboard-mockup.png"}
                      alt={title}
                      fill
                      className="object-contain p-2 group-hover:scale-[1.005] transition-transform duration-700"
                      priority
                      sizes="(max-width: 1024px) 100vw, 1400px"
                    />
                  </div>
                </div>
              ) : (
                /* Standard layout for others */
                <div className="relative aspect-video border border-dark-border bg-dark-card rounded-xl lg:rounded-2xl overflow-hidden transition-all duration-700">
                  {imageUrl && (
                    <Image 
                      src={imageUrl} 
                      alt={title} 
                      fill 
                      className="object-cover" 
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1400px) 90vw, 1400px"
                    />
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Content Section - Numbered Linear Style */}
        <section className="relative py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
          <div className="max-w-[1400px] mx-auto">
            <div className="grid lg:grid-cols-[180px_1fr] gap-8 lg:gap-12">
              {/* Left: Section Numbers */}
              <div className="hidden lg:block space-y-12 sticky top-32 self-start">
                <div className="space-y-3">
                  <div className="text-sm font-mono text-gray-light">1.0</div>
                  <div className="text-xs font-mono text-gray uppercase tracking-wider">Overview</div>
                </div>
                {(imageUrl || isEarthquakeCheck || isErpProject) && (
                  <div className="space-y-3">
                    <div className="text-sm font-mono text-gray-light">2.0</div>
                    <div className="text-xs font-mono text-gray uppercase tracking-wider">
                      {isEarthquakeCheck 
                        ? (locale === 'tr' ? 'Analiz Akışı' : 'Analysis Flow') 
                        : isErpProject 
                          ? (locale === 'tr' ? 'Sistem Modülleri' : 'System Modules') 
                          : 'Gallery'}
                    </div>
                  </div>
                )}
                {(isEarthquakeCheck || isErpProject) && (
                  <>
                    <div className="space-y-3">
                      <div className="text-sm font-mono text-gray-light">3.0</div>
                      <div className="text-xs font-mono text-gray uppercase tracking-wider">
                        {locale === 'tr' ? 'Arayüz Galerisi' : 'Interface Gallery'}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="text-sm font-mono text-gray-light">4.0</div>
                      <div className="text-xs font-mono text-gray uppercase tracking-wider">
                        {locale === 'tr' ? 'Teknik Özellikler' : 'Technical Specs'}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Right: Content */}
              <div className="space-y-16 sm:space-y-20 lg:space-y-24">
                {/* 1.0 About Project */}
                <div id="project-overview" className="space-y-5 sm:space-y-6 scroll-mt-32">
                  <div className="flex items-baseline gap-4 lg:hidden mb-4">
                    <span className="text-sm font-mono text-gray-light">1.0</span>
                    <span className="text-xs font-mono text-gray uppercase tracking-wider">Overview</span>
                  </div>

                  <div className="space-y-4 sm:space-y-5">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-white">
                      {t('aboutProject')}
                    </h2>
                    <div className="prose prose-invert max-w-none">
                      <div className="text-gray-text leading-relaxed text-base sm:text-lg space-y-4 whitespace-pre-wrap font-body">
                        {content}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Technical Architecture & Challenges (ERP or EarthquakeCheck) */}
                {(isErpProject || isEarthquakeCheck) && (
                  <div id="project-engineering" className="space-y-8 border-t border-white/5 pt-12 sm:pt-16 scroll-mt-32">
                    <div className="space-y-3">
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-gray uppercase tracking-wider font-semibold">
                        <Code2 size={12} />
                        {locale === 'tr' ? 'Mühendislik & Çözümler' : 'Engineering & Architecture'}
                      </span>
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-white">
                        {locale === 'tr' ? 'Teknik Zorluklar ve Çözüm Kümesi' : 'Technical Challenges & Architecture'}
                      </h2>
                      <p className="text-gray-text text-sm sm:text-base max-w-3xl">
                        {isEarthquakeCheck
                          ? (locale === 'tr'
                            ? 'Deprem risk analizini CBS entegrasyonuyla tarayıcı tarafına taşıyan yüksek performanslı mühendislik detayları.'
                            : 'High-performance engineering details that bring GIS-based earthquake risk analysis directly to the browser.')
                          : (locale === 'tr'
                            ? 'Geleneksel ERP\'lerin yetersiz kaldığı şantiye operasyonları için geliştirilen yüksek performanslı mimari detayları.'
                            : 'High-performance architectural details built specifically for construction jobsite dynamics where classic ERPs fall short.')}
                      </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      {isEarthquakeCheck ? (
                        <>
                          <div className="p-6 rounded-xl border border-white/5 bg-white/[0.01] hover:border-white/10 transition-colors space-y-3">
                            <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center font-bold font-mono">
                              1
                            </div>
                            <h4 className="text-base font-bold text-white">
                              {locale === 'tr' ? 'Coğrafi Bilgi Sistemleri (CBS) Entegrasyonu' : 'Geographic Information Systems (GIS) Sync'}
                            </h4>
                            <p className="text-gray-text text-sm leading-relaxed font-body">
                              {locale === 'tr'
                                ? 'Harita tabanlı interaktif koordinat seçimiyle parsel sınırlarını bulup, enlem/boylam bazlı zemin sınıfı ve PGA sismik ivme harita verilerini milimetrik olarak okuyan CBS altyapısı entegre edilmiştir.'
                                : 'Integrated dynamic mapping tools that resolve pinned coordinates into structural parcel limits, fetching local soil category and spectral acceleration map grids.'}
                            </p>
                          </div>

                          <div className="p-6 rounded-xl border border-white/5 bg-white/[0.01] hover:border-white/10 transition-colors space-y-3">
                            <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center font-bold font-mono">
                              2
                            </div>
                            <h4 className="text-base font-bold text-white">
                              {locale === 'tr' ? 'AFAD & Kandilli Canlı Sismik API Entegrasyonu' : 'Real-time Seismic API Pipelines'}
                            </h4>
                            <p className="text-gray-text text-sm leading-relaxed font-body">
                              {locale === 'tr'
                                ? 'Türkiye\'deki tüm diri fay hatları veritabanı ile entegre, sismik hareketliliği ve fay hatlarına olan mesafeyi gerçek zamanlı sorgulayan asenkron sorgu hatları (pipeline) tasarlanmıştır.'
                                : 'Engineered high-throughput asynchronous pipelines that cross-reference user location markers against official tectonic fault databases in real-time.'}
                            </p>
                          </div>

                          <div className="p-6 rounded-xl border border-white/5 bg-white/[0.01] hover:border-white/10 transition-colors space-y-3">
                            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold font-mono">
                              3
                            </div>
                            <h4 className="text-base font-bold text-white">
                              {locale === 'tr' ? 'TBDY-2018 Spektral Hesaplama Motoru' : 'TBDY-2018 Regulation Engine'}
                            </h4>
                            <p className="text-gray-text text-sm leading-relaxed font-body">
                              {locale === 'tr'
                                ? 'Yapı yaşı, kat adedi, taşıyıcı sistem türü ve CBS verilerini Türkiye Bina Deprem Yönetmeliği (2018) standartlarındaki formüllerle harmanlayan, sismik simülasyon motoru.'
                                : 'Developed a client-side calculator utilizing formulas defined in the 2018 Turkish Building Earthquake Code to compute structural resonance patterns based on building metadata.'}
                            </p>
                          </div>

                          <div className="p-6 rounded-xl border border-white/5 bg-white/[0.01] hover:border-white/10 transition-colors space-y-3">
                            <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center font-bold font-mono">
                              4
                            </div>
                            <h4 className="text-base font-bold text-white">
                              {locale === 'tr' ? 'İstemci Tarafında Güvenli PDF Motoru' : 'Privacy-First Client PDF Compiler'}
                            </h4>
                            <p className="text-gray-text text-sm leading-relaxed font-body">
                              {locale === 'tr'
                                ? 'Kullanıcıların adres ve kişisel bina verilerini sunuculara göndermeden, tamamen tarayıcı üzerinde çalışan kütüphanelerle saniyeler içinde dinamik ve resmi formatta PDF risk raporu üreten güvenlik öncelikli altyapı.'
                                : 'Built a custom client-side compiler generating detailed PDF risk reports instantly on the user device, keeping building telemetry completely private and minimizing server load.'}
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="p-6 rounded-xl border border-white/5 bg-white/[0.01] hover:border-white/10 transition-colors space-y-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold font-mono">
                              1
                            </div>
                            <h4 className="text-base font-bold text-white">
                              {locale === 'tr' ? 'Dinamik Stok & Parçalı İade Algoritması' : 'Dynamic Scaffolding Returns Algorithm'}
                            </h4>
                            <p className="text-gray-text text-sm leading-relaxed font-body">
                              {locale === 'tr'
                                ? 'Şantiyeye teslim edilen binlerce parça iskelenin, gün aşırı parça parça iade edilmesi durumunda günlük kiralama ücretlerini geriye dönük hesaplayan ve maliyet kaçaklarını sıfırlayan özel envanter formülleri tasarlanmıştır.'
                                : 'Developed custom back-calculating formulas that handle partial equipment returns over varying periods (e.g. returns of 10 units after 15 days, 50 after 30 days) to prevent commercial leakages.'}
                            </p>
                          </div>

                          <div className="p-6 rounded-xl border border-white/5 bg-white/[0.01] hover:border-white/10 transition-colors space-y-3">
                            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold font-mono">
                              2
                            </div>
                            <h4 className="text-base font-bold text-white">
                              {locale === 'tr' ? 'Hassas Finans & Çoklu Döviz Entegrasyonu' : 'Multi-Currency Financial Ledger'}
                            </h4>
                            <p className="text-gray-text text-sm leading-relaxed font-body">
                              {locale === 'tr'
                                ? 'TL, USD ve EUR kasalarının nakit akışını takip eden, işlem bazlı döviz kurunu kaydederek geriye dönük finans raporlarındaki kur dalgalanmalarını doğru şekilde simüle eden ve veri tutarlılığı sağlayan defter mimarisi.'
                                : 'Engineered a multi-currency ledger that stores transaction-time exchange rates, letting operators compute exact historic profit/loss and cash flow statements regardless of currency fluctuation.'}
                            </p>
                          </div>

                          <div className="p-6 rounded-xl border border-white/5 bg-white/[0.01] hover:border-white/10 transition-colors space-y-3">
                            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold font-mono">
                              3
                            </div>
                            <h4 className="text-base font-bold text-white">
                              {locale === 'tr' ? 'Veritabanı Seviyesinde Audit Log Denetimi' : 'Granular Audit Logging'}
                            </h4>
                            <p className="text-gray-text text-sm leading-relaxed font-body">
                              {locale === 'tr'
                                ? 'Sistem üzerindeki en hassas hareketleri (teklif silme, kasa bakiyesi güncelleme) veritabanı düzeyinde otomatik olarak kimlik, zaman ve eski/yeni değer kırılımında günlükleyerek geriye dönük tam izlenebilirlik sağlar.'
                                : 'Integrated auto-logging hooks at the database level that record all high-impact actions (updating client balances, deleting quotes) containing operator ID, timestamp, and pre/post values.'}
                            </p>
                          </div>

                          <div className="p-6 rounded-xl border border-white/5 bg-white/[0.01] hover:border-white/10 transition-colors space-y-3">
                            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold font-mono">
                              4
                            </div>
                            <h4 className="text-base font-bold text-white">
                              {locale === 'tr' ? 'Next.js Server Components ile Hız & SEO' : 'Next.js Optimized Render Performance'}
                            </h4>
                            <p className="text-gray-text text-sm leading-relaxed font-body">
                              {locale === 'tr'
                                ? 'Yüksek veri yoğunluğuna sahip sayfaları Next.js Sunucu Bileşenleri kullanarak sunucuda oluşturduk. Client bundle boyutunu azaltarak yavaş hücresel ağlarda bile anında yüklenen bir performans elde ettik.'
                                : 'Utilized Next.js Server Components for heavy static data layouts. Kept client bundle sizes light, ensuring instant startup page speeds and perfect SEO scores.'}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* 2.0 Project Gallery / System Modules */}
                {isEarthquakeCheck && (
                  <div id="project-modules" className="space-y-12 sm:space-y-16 border-t border-dark-border pt-12 sm:pt-16 lg:pt-20 scroll-mt-32">
                    <div className="flex items-baseline gap-4 lg:hidden mb-4">
                      <span className="text-sm font-mono text-gray-light">2.0</span>
                      <span className="text-xs font-mono text-gray uppercase tracking-wider">
                        {locale === 'tr' ? 'Analiz Akışı' : 'Analysis Flow'}
                      </span>
                    </div>

                    <div className="space-y-8 sm:space-y-12">
                      <div className="space-y-3 sm:space-y-4">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-white">
                          {locale === 'tr' ? 'Deprem Konsolu Analiz Adımları' : 'Seismic Analysis Console Flow'}
                        </h2>
                        <p className="text-gray-text max-w-3xl text-sm sm:text-base leading-relaxed font-body">
                          {locale === 'tr'
                            ? 'EarthquakeCheck, karmaşık sismik analiz hesaplamalarını kullanıcı dostu, adım adım ilerleyen modern bir konsol arayüzü ile gerçekleştirir.'
                            : 'EarthquakeCheck performs complex seismic analysis calculations through a user-friendly, step-by-step modern console interface.'}
                        </p>
                      </div>

                      {/* Interactive Client-Side Component */}
                      <div className="mt-8">
                        <EarthquakeModuleShowcase locale={locale} />
                      </div>
                    </div>
                  </div>
                )}

                {/* 3.0 System Gallery (Only for EarthquakeCheck) */}
                {isEarthquakeCheck && (
                  <div id="project-gallery" className="space-y-12 sm:space-y-16 border-t border-dark-border pt-12 sm:pt-16 lg:pt-20 scroll-mt-32">
                    <div className="flex items-baseline gap-4 lg:hidden mb-4">
                      <span className="text-sm font-mono text-gray-light">3.0</span>
                      <span className="text-xs font-mono text-gray uppercase tracking-wider">
                        {locale === 'tr' ? 'Tüm Ekranlar' : 'All Previews'}
                      </span>
                    </div>

                    <div className="space-y-8 sm:space-y-12">
                      <div className="space-y-3 sm:space-y-4">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-white">
                          {locale === 'tr' ? 'Deprem Konsolu Arayüz Galerisi' : 'Console Interface Gallery'}
                        </h2>
                        <p className="text-gray-text max-w-3xl text-sm sm:text-base leading-relaxed font-body">
                          {locale === 'tr'
                            ? 'Analiz konsolunun tüm aşamalarına ait detaylı ekran görüntülerinin toplu listesi. Her bir ekran, modern tarayıcı mockup formatında sunulmuştur.'
                            : 'A complete collection of all analysis console interfaces in the platform, presented in a clean browser frame mockup format.'}
                        </p>
                      </div>

                      {/* Grid of 4 mockups */}
                      <div className="grid sm:grid-cols-2 gap-6">
                        {earthquakeSteps.map((step) => (
                          <div 
                            key={step.step}
                            className="bg-dark-card border border-white/5 rounded-xl overflow-hidden hover:border-white/10 hover:shadow-lg hover:shadow-black/40 transition-all duration-300 flex flex-col group"
                          >
                            {/* Browser Mockup Header */}
                            <div className="flex items-center justify-between px-4 py-2 bg-black/40 border-b border-white/5">
                              <div className="flex gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-[#ff5f56]" />
                                <div className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
                                <div className="w-2 h-2 rounded-full bg-[#27c93f]" />
                              </div>
                              <span className="text-[10px] font-mono text-gray-light">{step.badge}</span>
                            </div>
                            
                            {/* Image */}
                            <div className="relative aspect-[16/10] bg-black/20 overflow-hidden border-b border-white/5">
                              <Image 
                                src={step.image} 
                                alt={step.title}
                                fill
                                className="object-contain p-2 group-hover:scale-[1.03] transition-transform duration-500"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              />
                            </div>

                            {/* Content */}
                            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                              <div className="space-y-1.5">
                                <span className="text-[9px] font-mono text-gray font-bold uppercase tracking-wider">
                                  Step {step.step}
                                </span>
                                <h4 className="text-sm font-bold text-white leading-tight">
                                  {step.title}
                                </h4>
                                <p className="text-xs text-gray-text leading-relaxed font-body">
                                  {step.desc}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 4.0 Technical Specs (EarthquakeCheck) */}
                {isEarthquakeCheck && (
                  <div id="project-technical" className="space-y-12 sm:space-y-16 border-t border-dark-border pt-12 sm:pt-16 lg:pt-20 scroll-mt-32">
                    <div className="flex items-baseline gap-4 lg:hidden mb-4">
                      <span className="text-sm font-mono text-gray-light">4.0</span>
                      <span className="text-xs font-mono text-gray uppercase tracking-wider">
                        {locale === 'tr' ? 'Teknik Özellikler' : 'Technical Specs'}
                      </span>
                    </div>

                    <div className="space-y-8 sm:space-y-12">
                      <div className="space-y-3 sm:space-y-4">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-white">
                          {locale === 'tr'
                            ? 'Teknik Özellikler & Kullanılan Teknolojiler'
                            : 'Technical Specifications & Technology Stack'}
                        </h2>
                        <p className="text-gray-text max-w-3xl text-sm sm:text-base leading-relaxed font-body">
                          {locale === 'tr'
                            ? 'EarthquakeCheck platformunun React SPA istemci ve Spring Boot REST API katmanlarının mimari yapısı, deprem değerlendirme algoritmaları ve kullanılan teknolojiler.'
                            : 'Architectural structure, earthquake evaluation algorithms, and technologies of the EarthquakeCheck platform across React SPA client and Spring Boot REST API layers.'}
                        </p>
                      </div>

                      <div className="mt-8">
                        <EarthquakeTechnicalShowcase locale={locale} />
                      </div>
                    </div>
                  </div>
                )}

                {isErpProject && (
                  <div id="project-modules" className="space-y-12 sm:space-y-16 border-t border-dark-border pt-12 sm:pt-16 lg:pt-20 scroll-mt-32">
                    <div className="flex items-baseline gap-4 lg:hidden mb-4">
                      <span className="text-sm font-mono text-gray-light">2.0</span>
                      <span className="text-xs font-mono text-gray uppercase tracking-wider">
                        {locale === 'tr' ? 'Sistem Modülleri' : 'System Modules'}
                      </span>
                    </div>

                    <div className="space-y-8 sm:space-y-12">
                      <div className="space-y-3 sm:space-y-4">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-white">
                          {locale === 'tr' ? 'İskeleTakip Modülleri ve Ekranları' : 'İskeleTakip Modules & Interface Panels'}
                        </h2>
                        <p className="text-gray-text max-w-3xl text-sm sm:text-base leading-relaxed font-body">
                          {locale === 'tr'
                            ? 'İskeleTakip, şantiyelerinizdeki iskele ve ekipman envanterini, depo hareketlerini, kiralama tekliflerini ve denetim kayıtlarını entegre ve dinamik bir yapıyla yönetir.'
                            : 'İskeleTakip provides an integrated ecosystem to manage scaffolding and equipment inventory, warehouse operations, rental quotes, and security audit logs.'}
                        </p>
                      </div>

                      {/* Interactive Client-Side Component */}
                      <div className="mt-8">
                        <ErpModuleShowcase locale={locale} />
                      </div>
                    </div>
                  </div>
                )}

                {/* 3.0 System Gallery (Only for ERP Project) */}
                {isErpProject && (
                  <div id="project-gallery" className="space-y-12 sm:space-y-16 border-t border-dark-border pt-12 sm:pt-16 lg:pt-20 scroll-mt-32">
                    <div className="flex items-baseline gap-4 lg:hidden mb-4">
                      <span className="text-sm font-mono text-gray-light">3.0</span>
                      <span className="text-xs font-mono text-gray uppercase tracking-wider">
                        {locale === 'tr' ? 'Arayüz Galerisi' : 'Interface Gallery'}
                      </span>
                    </div>

                    <div className="space-y-8 sm:space-y-12">
                      <div className="space-y-3 sm:space-y-4">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-white">
                          {locale === 'tr' ? 'Sistem Arayüz Galerisi' : 'System Interface Gallery'}
                        </h2>
                        <p className="text-gray-text max-w-3xl text-sm sm:text-base leading-relaxed font-body">
                          {locale === 'tr'
                            ? 'Platformun tüm modüllerine ait detaylı ekran görüntülerinin toplu listesi. Her bir ekran, işletim sisteminden bağımsız, modern bir tarayıcı mockup formatında sunulmuştur.'
                            : 'A complete collection of all module interfaces in the platform, presented in a clean browser frame mockup format.'}
                        </p>
                      </div>

                      {/* Grid of 10 mockups */}
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {erpSteps.map((step) => (
                          <div 
                            key={step.step}
                            className="bg-dark-card border border-white/5 rounded-xl overflow-hidden hover:border-white/10 hover:shadow-lg hover:shadow-black/40 transition-all duration-300 flex flex-col group"
                          >
                            {/* Browser Mockup Header */}
                            <div className="flex items-center justify-between px-4 py-2 bg-black/40 border-b border-white/5">
                              <div className="flex gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-[#ff5f56]" />
                                <div className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
                                <div className="w-2 h-2 rounded-full bg-[#27c93f]" />
                              </div>
                              <span className="text-[10px] font-mono text-gray-light">{step.badge}</span>
                            </div>
                            
                            {/* Image */}
                            <div className="relative aspect-[16/10] bg-black/20 overflow-hidden border-b border-white/5">
                              <Image 
                                src={step.image} 
                                alt={step.title}
                                fill
                                className="object-contain p-2 group-hover:scale-[1.03] transition-transform duration-500"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              />
                            </div>

                            {/* Content */}
                            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                              <div className="space-y-1.5">
                                <span className="text-[9px] font-mono text-gray font-bold uppercase tracking-wider">
                                  Step {step.step}
                                </span>
                                <h4 className="text-sm font-bold text-white leading-tight">
                                  {step.title}
                                </h4>
                                <p className="text-xs text-gray-text leading-relaxed font-body">
                                  {step.desc}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 4.0 Technical Specs (Only for ERP Project) */}
                {isErpProject && (
                  <div id="project-technical" className="space-y-12 sm:space-y-16 border-t border-dark-border pt-12 sm:pt-16 lg:pt-20 scroll-mt-32">
                    <div className="flex items-baseline gap-4 lg:hidden mb-4">
                      <span className="text-sm font-mono text-gray-light">4.0</span>
                      <span className="text-xs font-mono text-gray uppercase tracking-wider">
                        {locale === 'tr' ? 'Teknik Özellikler' : 'Technical Specs'}
                      </span>
                    </div>

                    <div className="space-y-8 sm:space-y-12">
                      <div className="space-y-3 sm:space-y-4">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-white">
                          {locale === 'tr'
                            ? 'Teknik Özellikler & Kullanılan Teknolojiler'
                            : 'Technical Specifications & Technology Stack'}
                        </h2>
                        <p className="text-gray-text max-w-3xl text-sm sm:text-base leading-relaxed font-body">
                          {locale === 'tr'
                            ? 'İskeleTakip platformunun masaüstü istemci (Electron) ve backend API (Node.js) katmanlarının mimari yapısı, kullanılan teknolojiler ve yazılımsal desenler.'
                            : 'Architectural structure, technologies, and software patterns of the İskeleTakip platform across desktop client (Electron) and backend API (Node.js) layers.'}
                        </p>
                      </div>

                      <div className="mt-8">
                        <ErpTechnicalShowcase locale={locale} />
                      </div>
                    </div>
                  </div>
                )}

                {!isEarthquakeCheck && !isErpProject && imageUrl ? (
                  // Default Gallery for other projects
                  <div id="project-gallery" className="space-y-5 sm:space-y-6 border-t border-dark-border pt-12 sm:pt-16 lg:pt-20 scroll-mt-32">
                    <div className="flex items-baseline gap-4 lg:hidden mb-4">
                      <span className="text-sm font-mono text-gray-light">2.0</span>
                      <span className="text-xs font-mono text-gray uppercase tracking-wider">Gallery</span>
                    </div>

                    <div className="space-y-4 sm:space-y-5">
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-white">
                        {locale === 'tr' ? 'Proje Görselleri' : 'Project Gallery'}
                      </h2>
                      
                      <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
                        <div className="relative aspect-video rounded-lg sm:rounded-xl overflow-hidden border border-dark-border bg-dark-card">
                          <Image 
                            src={imageUrl} 
                            alt={`${title} screenshot 1`} 
                            fill 
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, 50vw"
                          />
                        </div>
                        <div className="relative aspect-video rounded-lg sm:rounded-xl overflow-hidden border border-dark-border bg-dark-card flex items-center justify-center">
                          <div className="text-center space-y-1.5 px-4">
                            <div className="text-gray-light text-sm">
                              {locale === 'tr' ? 'Daha fazla görsel' : 'More screenshots'}
                            </div>
                            <div className="text-gray text-xs">
                              {locale === 'tr' ? 'yakında eklenecek' : 'coming soon'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t border-dark-border">
          <CTA />
        </section>
      </main>

      <Footer />
    </>
  );
}
