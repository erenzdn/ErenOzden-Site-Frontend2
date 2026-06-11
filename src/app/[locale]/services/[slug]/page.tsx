import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CTA from '@/components/sections/CTA';
import Button from '@/components/ui/Button';
import { SlugMapSetter } from '@/components/SlugMapSetter';
import { STRAPI_URL } from '@/lib/constants';
import { locales, type Locale } from '@/i18n/routing';
import { type SlugMap } from '@/contexts/SlugMapContext';
import { Smartphone, Globe, Bot, Layers, Code, LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Smartphone: Smartphone,
  Globe: Globe,
  auto: Bot,
  process: Layers,
};

interface StrapiService {
  documentId: string;
  slug: string;
  title: string;
  description: string;
  iconName: string;
  order: number;
  features: string[];
}

type Props = {
  params: Promise<{ locale: Locale; slug: string }>;
};

/**
 * Slug ile hizmet çek (lokalize edilmiş slug desteği)
 */
async function getServiceBySlug(slug: string, locale: Locale): Promise<StrapiService | null> {
  try {
    const res = await fetch(
      `${STRAPI_URL}/api/services?filters[slug][$eq]=${encodeURIComponent(slug)}&locale=${locale}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const json = await res.json();
    const services = json.data as StrapiService[];
    return services.length > 0 ? services[0] : null;
  } catch {
    return null;
  }
}

/**
 * DocumentId ile belirli bir locale'deki hizmeti çek
 */
async function getServiceByDocumentId(documentId: string, locale: Locale): Promise<StrapiService | null> {
  try {
    const res = await fetch(
      `${STRAPI_URL}/api/services/${documentId}?locale=${locale}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json.data as StrapiService | null;
  } catch {
    return null;
  }
}

/**
 * Bir hizmetin tüm dillerdeki slug'larını çek
 * Strapi v5 Document Model: Aynı documentId, farklı locale'lerde farklı slug'lara sahip olabilir
 */
async function getServiceSlugMap(documentId: string): Promise<SlugMap> {
  const slugMap: SlugMap = {};

  await Promise.all(
    locales.map(async (locale) => {
      const service = await getServiceByDocumentId(documentId, locale);
      if (service?.slug) {
        slugMap[locale] = service.slug;
      }
    })
  );

  return slugMap;
}

/**
 * Build zamanında tüm hizmet sayfalarını oluştur
 * Her locale için o dildeki slug'ları kullan
 */
export async function generateStaticParams() {
  const params: { locale: Locale; slug: string }[] = [];

  for (const locale of locales) {
    try {
      const res = await fetch(`${STRAPI_URL}/api/services?locale=${locale}`);
      if (res.ok) {
        const json = await res.json();
        const services = json.data as StrapiService[];
        services.forEach((service) => {
          if (service.slug) {
            params.push({ locale, slug: service.slug });
          }
        });
      }
    } catch {
      // Skip locale if fetch fails
    }
  }

  return params;
}

/**
 * Dinamik SEO metadata
 * hreflang etiketleri için her dilin kendi slug'ını kullan
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = await getServiceBySlug(slug, locale);

  if (!service) {
    return {
      title: locale === 'tr' ? 'Hizmet Bulunamadı' : 'Service Not Found',
    };
  }

  const baseUrl = 'https://erenozden.com';
  
  // Tüm dillerdeki slug'ları çek (hreflang için)
  const slugMap = await getServiceSlugMap(service.documentId);

  // Dinamik alternates oluştur
  const languages: Record<string, string> = {};
  for (const l of locales) {
    if (slugMap[l]) {
      languages[l] = `${baseUrl}/${l}/services/${slugMap[l]}`;
    }
  }
  languages['x-default'] = languages['tr'] || `${baseUrl}/tr/services/${slug}`;

  return {
    title: `${service.title} | Eren Özden`,
    description: service.description,
    alternates: {
      canonical: `${baseUrl}/${locale}/services/${slug}`,
      languages,
    },
    openGraph: {
      title: `${service.title} | Eren Özden`,
      description: service.description,
      url: `${baseUrl}/${locale}/services/${slug}`,
      locale: locale === 'tr' ? 'tr_TR' : 'en_US',
      alternateLocale: locale === 'tr' ? 'en_US' : 'tr_TR',
      type: 'website',
    },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { locale, slug } = await params;

  // Statik rendering için locale ayarla
  setRequestLocale(locale);

  const service = await getServiceBySlug(slug, locale);

  if (!service) {
    notFound();
  }

  // Paralel olarak çevirileri ve slug haritasını çek
  const [t, slugMap] = await Promise.all([
    getTranslations('serviceDetail'),
    getServiceSlugMap(service.documentId),
  ]);

  const Icon = iconMap[service.iconName] || Code;
  const benefits = [
    t('benefits.analysis'),
    t('benefits.architecture'),
    t('benefits.performance'),
    t('benefits.support'),
  ];

  return (
    <>
      {/* Slug haritasını client-side context'e aktar */}
      <SlugMapSetter slugMap={slugMap} basePath="/services" />
      
      <Header />
      <main className="pt-32 pb-10 min-h-screen">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="mb-10">
            <Button href="/services" variant="ghost" className="mb-8" showArrow={false}>
              &larr; {t('backToServices')}
            </Button>

            <div className="flex items-center gap-6 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
                <Icon size={32} className="text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-white tracking-tight">
                {service.title}
              </h1>
            </div>

            <p className="text-gray-text text-xl max-w-3xl leading-relaxed mb-10">
              {service.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-16">
              {service.features?.map((f) => (
                <span
                  key={f}
                  className="px-4 py-2 bg-dark-card border border-dark-border rounded-full text-white text-sm"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-dark-border pt-16">
            <div className="space-y-6">
              <h3 className="text-2xl font-heading font-bold text-white">
                {t('howWeWork')}
              </h3>
              <p className="text-gray-text leading-relaxed">
                {t('howWeWorkDesc')}
              </p>
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-heading font-bold text-white">
                {t('whatWeProvide')}
              </h3>
              <ul className="space-y-4">
                {benefits.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-text">
                    <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <CTA />
        </div>
      </main>
      <Footer />
    </>
  );
}
