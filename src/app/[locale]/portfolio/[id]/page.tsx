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
import { ExternalLink, Code2 } from 'lucide-react';

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

  const title = project.title || (locale === 'tr' ? 'Proje Detayı' : 'Project Detail');
  const description = extractStrapiPlainText(project.description);
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
  const { locale, id } = await params;
  setRequestLocale(locale);

  const [project, t] = await Promise.all([
    fetchStrapiProject<StrapiProject>(id, locale, REVALIDATE),
    getTranslations('common'),
  ]);
  
  if (!project) notFound();

  const slugMap = await getProjectSlugMap(project.documentId, locale);

  const title = project.title || (locale === 'tr' ? 'Proje Detayı' : 'Project Detail');
  const description = extractStrapiPlainText(project.description);
  const content =
    extractStrapiPlainText(project.content) || description;
  const imageUrl = pickStrapiImageUrl(project.thumbnail || project.image);

  let technologies: string[] = [];
  const tech = project.techStack || project.technologies;
  if (typeof tech === 'string') technologies = tech.split(',').map((t) => t.trim());
  else if (Array.isArray(tech)) technologies = tech;

  const projectUrl = project.liveUrl || project.projectUrl || '';
  const githubUrl = project.githubUrl || '';

  return (
    <>
      <SlugMapSetter slugMap={slugMap} basePath="/portfolio" />
      <Header />
      
      <main className="relative min-h-screen bg-dark">
        {/* Hero Section - Linear Style */}
        <section className="relative pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 px-4 sm:px-6 border-b border-dark-border">
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
            <div className="grid lg:grid-cols-[1fr_500px] gap-8 lg:gap-12 items-start mb-16 lg:mb-20">
              {/* Left: Title & Description */}
              <div className="space-y-6 lg:space-y-8">
                <div className="space-y-4 lg:space-y-5">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white tracking-tight leading-tight">
                    {title}
                  </h1>
                  
                  {description && (
                    <p className="text-base sm:text-lg md:text-xl text-gray-text leading-relaxed">
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
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-dark rounded-lg text-sm font-semibold hover:bg-gray-100 transition-all"
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
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-dark-lighter border border-dark-border text-white rounded-lg text-sm font-semibold hover:bg-dark-light hover:border-gray transition-all"
                    >
                      <Code2 size={16} />
                      <span>{t('sourceCode')}</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Right: Meta Info Card */}
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

                  {/* Divider */}
                  <div className="h-px bg-dark-border" />

                  {/* Supporters Section */}
                  <div className="space-y-4">
                    <div className="text-xs font-mono uppercase tracking-wider text-gray-light mb-2.5">
                      {locale === 'tr' ? 'Destekçiler' : 'Supporters'}
                    </div>
                    
                    {/* TÜBİTAK Logo */}
                    <div className="flex items-center justify-center p-6 bg-white/5 hover:bg-white/10 rounded-lg transition-all border border-dark-border hover:border-gray/30 group">
                      <div className="relative w-full max-w-[180px] h-auto">
                        <Image 
                          src="/tubitak-logo.svg" 
                          alt="TÜBİTAK Logo" 
                          width={180}
                          height={54}
                          className="w-full h-auto opacity-90 group-hover:opacity-100 transition-opacity"
                        />
                      </div>
                    </div>

                    {/* Quick Links */}
                    {(projectUrl && projectUrl !== '#') || (githubUrl && githubUrl !== '#') ? (
                      <>
                        <div className="h-px bg-dark-border my-4" />
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
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Image Section */}
        {imageUrl && (
          <section className="relative py-8 sm:py-12 lg:py-16 px-4 sm:px-6 border-b border-dark-border">
            <div className="max-w-[1400px] mx-auto">
              <div className="relative aspect-video rounded-xl lg:rounded-2xl overflow-hidden border border-dark-border bg-dark-card">
                <Image 
                  src={imageUrl} 
                  alt={title} 
                  fill 
                  className="object-cover" 
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1400px) 90vw, 1400px"
                />
              </div>
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
                {imageUrl && (
                  <div className="space-y-3">
                    <div className="text-sm font-mono text-gray-light">2.0</div>
                    <div className="text-xs font-mono text-gray uppercase tracking-wider">Gallery</div>
                  </div>
                )}
              </div>

              {/* Right: Content */}
              <div className="space-y-16 sm:space-y-20 lg:space-y-24">
                {/* 1.0 About Project */}
                <div className="space-y-5 sm:space-y-6">
                  <div className="flex items-baseline gap-4 lg:hidden mb-4">
                    <span className="text-sm font-mono text-gray-light">1.0</span>
                    <span className="text-xs font-mono text-gray uppercase tracking-wider">Overview</span>
                  </div>

                  <div className="space-y-4 sm:space-y-5">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-white">
                      {t('aboutProject')}
                    </h2>
                    <div className="prose prose-invert max-w-none">
                      <div className="text-gray-text leading-relaxed text-base sm:text-lg space-y-4 whitespace-pre-wrap">
                        {content}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2.0 Project Gallery */}
                {imageUrl && (
                  <div className="space-y-5 sm:space-y-6 border-t border-dark-border pt-12 sm:pt-16 lg:pt-20">
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
                )}
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
