import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { cache } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CTA from '@/components/sections/CTA';
import Button from '@/components/ui/Button';
import { SlugMapSetter } from '@/components/SlugMapSetter';
import {
  fetchStrapiService,
  fetchStrapiServices,
  strapiRouteKey,
} from '@/lib/strapi';
import { locales, type Locale } from '@/i18n/routing';
import { type SlugMap } from '@/contexts/SlugMapContext';
import { 
  Smartphone, 
  Globe, 
  Bot, 
  Layers, 
  Code, 
  LucideIcon,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Target,
  Zap,
  Shield
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Smartphone: Smartphone,
  Globe: Globe,
  auto: Bot,
  process: Layers,
};

interface StrapiService {
  documentId: string;
  slug?: string | null;
  title: string;
  description: string;
  iconName: string;
  order: number;
  features: string[];
}

type Props = {
  params: Promise<{ locale: Locale; slug: string }>;
};

const REVALIDATE = { next: { revalidate: 3600 } } as const;

const getCachedService = cache(async (slug: string, locale: Locale) => {
  return fetchStrapiService<StrapiService>(slug, locale, REVALIDATE);
});

const getCachedServices = cache(async (locale: Locale) => {
  return fetchStrapiServices<StrapiService>(locale, REVALIDATE);
});

async function getServiceSlugMap(documentId: string): Promise<SlugMap> {
  const slugMap: SlugMap = {};
  
  const allServices = await Promise.all(
    locales.map(async (locale) => {
      const services = await getCachedServices(locale);
      return { locale, services };
    })
  );
  
  for (const { locale, services } of allServices) {
    const service = services.find(s => s.documentId === documentId);
    if (service) {
      const key = strapiRouteKey(service);
      if (key) slugMap[locale] = key;
    }
  }

  return slugMap;
}

export async function generateStaticParams() {
  const params: { locale: Locale; slug: string }[] = [];
  const seen = new Set<string>();

  const results = await Promise.all(
    locales.map(async (locale) => {
      const services = await getCachedServices(locale);
      return { locale, services };
    })
  );

  for (const { locale, services } of results) {
    services.forEach((service) => {
      const routeSlug = strapiRouteKey(service);
      const dedupeKey = `${locale}:${routeSlug}`;
      if (routeSlug && !seen.has(dedupeKey)) {
        seen.add(dedupeKey);
        params.push({ locale, slug: routeSlug });
      }
    });
  }

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = await getCachedService(slug, locale);

  if (!service) {
    return {
      title: locale === 'tr' ? 'Hizmet Bulunamadı' : 'Service Not Found',
    };
  }

  const baseUrl = 'https://erenozden.com';
  const slugMap = await getServiceSlugMap(service.documentId);

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
  setRequestLocale(locale);

  const service = await getCachedService(slug, locale);
  if (!service) notFound();

  const [t, slugMap] = await Promise.all([
    getTranslations('serviceDetail'),
    getServiceSlugMap(service.documentId),
  ]);

  const Icon = iconMap[service.iconName] || Code;

  const processSteps = [
    {
      number: '01',
      title: t('process.step1.title'),
      description: t('process.step1.description'),
    },
    {
      number: '02',
      title: t('process.step2.title'),
      description: t('process.step2.description'),
    },
    {
      number: '03',
      title: t('process.step3.title'),
      description: t('process.step3.description'),
    },
    {
      number: '04',
      title: t('process.step4.title'),
      description: t('process.step4.description'),
    },
    {
      number: '05',
      title: t('process.step5.title'),
      description: t('process.step5.description'),
    },
    {
      number: '06',
      title: t('process.step6.title'),
      description: t('process.step6.description'),
    },
  ];

  const whyChoose = [
    {
      icon: Target,
      title: t('whyChoose.reason1.title'),
      description: t('whyChoose.reason1.description'),
    },
    {
      icon: Zap,
      title: t('whyChoose.reason2.title'),
      description: t('whyChoose.reason2.description'),
    },
    {
      icon: Sparkles,
      title: t('whyChoose.reason3.title'),
      description: t('whyChoose.reason3.description'),
    },
    {
      icon: Shield,
      title: t('whyChoose.reason4.title'),
      description: t('whyChoose.reason4.description'),
    },
  ];

  const faqs = [
    {
      question: t('faq.q1.question'),
      answer: t('faq.q1.answer'),
    },
    {
      question: t('faq.q2.question'),
      answer: t('faq.q2.answer'),
    },
    {
      question: t('faq.q3.question'),
      answer: t('faq.q3.answer'),
    },
    {
      question: t('faq.q4.question'),
      answer: t('faq.q4.answer'),
    },
  ];

  return (
    <>
      <SlugMapSetter slugMap={slugMap} basePath="/services" />
      <Header />
      
      <main className="pt-24 min-h-screen relative overflow-hidden">
        <div className="glow-blob top-[-100px] right-[-200px]" />
        
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="pt-8 pb-16">
            <Button href="/services" variant="ghost" className="mb-8" showArrow={false}>
              &larr; {t('backToServices')}
            </Button>

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20">
              <div>
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                  <Icon size={18} className="text-white" />
                  <span className="text-sm text-white/80">{t('overview')}</span>
                </div>
                
                <h1 className="text-5xl lg:text-6xl font-heading font-bold text-white mb-6 leading-tight">
                  {service.title}
                </h1>
                
                <p className="text-gray-text text-lg leading-relaxed mb-8">
                  {service.description}
                </p>

                <div className="flex flex-wrap gap-3 mb-8">
                  {service.features?.map((feature) => (
                    <span
                      key={feature}
                      className="px-4 py-2 bg-dark-card border border-dark-border rounded-full text-white text-sm hover:border-white/30 transition-colors"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <Button href="/contact" variant="primary" className="group">
                  {t('startProject')}
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              <div className="relative">
                <div className="card p-8 lg:p-12 relative">
                  <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent rounded-2xl" />
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-6">
                      <Icon size={40} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-heading font-bold text-white mb-4">
                      {t('whatWeProvide')}
                    </h3>
                    <ul className="space-y-3">
                      {[
                        t('benefits.analysis'),
                        t('benefits.architecture'),
                        t('benefits.performance'),
                        t('benefits.support'),
                      ].map((benefit, index) => (
                        <li key={index} className="flex items-start gap-3 text-gray-text">
                          <CheckCircle2 size={20} className="text-white shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-24">
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-heading font-bold text-white mb-4">
                  {t('process.title')}
                </h2>
                <p className="text-gray-text text-lg">
                  {t('process.description')}
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {processSteps.map((step, index) => (
                  <div
                    key={index}
                    className="card p-6 hover:border-white/30 transition-all group cursor-default"
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-4xl font-heading font-bold text-white/20 group-hover:text-white/40 transition-colors">
                        {step.number}
                      </span>
                      <div className="flex-1">
                        <h3 className="text-xl font-heading font-bold text-white mb-2">
                          {step.title}
                        </h3>
                        <p className="text-gray-text text-sm leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-24">
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-heading font-bold text-white mb-4">
                  {t('whyChoose.title')}
                </h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {whyChoose.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <div
                      key={index}
                      className="card p-6 text-center hover:border-white/30 transition-all group cursor-default"
                    >
                      <div className="w-14 h-14 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <IconComponent size={24} className="text-white" />
                      </div>
                      <h3 className="text-lg font-heading font-bold text-white mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-text text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mb-24">
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-heading font-bold text-white mb-4">
                  {t('faq.title')}
                </h2>
              </div>

              <div className="max-w-3xl mx-auto space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="card p-6">
                    <h3 className="text-lg font-heading font-bold text-white mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-gray-text leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <CTA />
        </div>
      </main>
      
      <Footer />
    </>
  );
}
