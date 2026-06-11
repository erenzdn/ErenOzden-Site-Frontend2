import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CTA from '@/components/sections/CTA';
import Button from '@/components/ui/Button';
import { SlugMapSetter } from '@/components/SlugMapSetter';
import { STRAPI_URL } from '@/lib/constants';
import { resolveStrapiUrl } from '@/lib/apiClient';
import { locales, type Locale } from '@/i18n/routing';
import { type SlugMap } from '@/contexts/SlugMapContext';
import { ExternalLink, Code2 } from 'lucide-react';

interface StrapiRichText {
  type: string;
  children: { text: string }[];
}

interface StrapiProject {
  id: number;
  documentId: string;
  slug?: string;
  title?: string;
  description?: string | StrapiRichText[];
  image?: { url?: string; formats?: { large?: { url?: string }; medium?: { url?: string } } };
  thumbnail?: { url?: string; formats?: { large?: { url?: string }; medium?: { url?: string } } };
  technologies?: string | string[];
  techStack?: string | string[];
  projectUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  content?: string | StrapiRichText[];
}

type Props = {
  params: Promise<{ locale: Locale; id: string }>;
};

function extractPlainText(rt: StrapiRichText[]): string {
  return rt.map((b) => b.children?.map((c) => c.text).join('') || '').join('\n\n');
}

/**
 * Slug ile proje çek (lokalize edilmiş slug desteği)
 */
async function getProjectBySlug(slug: string, locale: Locale): Promise<StrapiProject | null> {
  try {
    const res = await fetch(
      `${STRAPI_URL}/api/projects?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*&locale=${locale}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const json = await res.json();
    const projects = json.data as StrapiProject[];
    return projects.length > 0 ? projects[0] : null;
  } catch {
    return null;
  }
}

/**
 * DocumentId ile belirli bir locale'deki projeyi çek
 */
async function getProjectByDocumentId(documentId: string, locale: Locale): Promise<StrapiProject | null> {
  try {
    const res = await fetch(
      `${STRAPI_URL}/api/projects/${documentId}?populate=*&locale=${locale}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json.data as StrapiProject | null;
  } catch {
    return null;
  }
}

/**
 * Bir projenin tüm dillerdeki slug'larını çek
 */
async function getProjectSlugMap(documentId: string): Promise<SlugMap> {
  const slugMap: SlugMap = {};

  await Promise.all(
    locales.map(async (locale) => {
      const project = await getProjectByDocumentId(documentId, locale);
      if (project?.slug) {
        slugMap[locale] = project.slug;
      }
    })
  );

  return slugMap;
}

/**
 * Build zamanında tüm proje sayfalarını oluştur
 */
export async function generateStaticParams() {
  const params: { locale: Locale; id: string }[] = [];

  for (const locale of locales) {
    try {
      const res = await fetch(`${STRAPI_URL}/api/projects?locale=${locale}`);
      if (res.ok) {
        const json = await res.json();
        const projects = json.data as StrapiProject[];
        projects.forEach((project) => {
          const slug = project.slug || project.documentId;
          if (slug) {
            params.push({ locale, id: slug });
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
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const project = await getProjectBySlug(id, locale);

  if (!project) {
    return {
      title: locale === 'tr' ? 'Proje Bulunamadı' : 'Project Not Found',
    };
  }

  const title = project.title || (locale === 'tr' ? 'Proje Detayı' : 'Project Detail');
  let description = '';
  if (typeof project.description === 'string') {
    description = project.description;
  } else if (Array.isArray(project.description)) {
    description = extractPlainText(project.description);
  }

  const baseUrl = 'https://erenozden.com';

  // Tüm dillerdeki slug'ları çek (hreflang için)
  const slugMap = await getProjectSlugMap(project.documentId);

  // Dinamik alternates oluştur
  const languages: Record<string, string> = {};
  for (const l of locales) {
    if (slugMap[l]) {
      languages[l] = `${baseUrl}/${l}/portfolio/${slugMap[l]}`;
    }
  }
  languages['x-default'] = languages['tr'] || `${baseUrl}/tr/portfolio/${id}`;

  return {
    title: `${title} | Eren Özden`,
    description: description || undefined,
    alternates: {
      canonical: `${baseUrl}/${locale}/portfolio/${id}`,
      languages,
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

  // Statik rendering için locale ayarla
  setRequestLocale(locale);

  const project = await getProjectBySlug(id, locale);

  if (!project) {
    notFound();
  }

  // Paralel olarak çevirileri ve slug haritasını çek
  const [t, slugMap] = await Promise.all([
    getTranslations('common'),
    getProjectSlugMap(project.documentId),
  ]);

  const p = project as unknown as Record<string, unknown>;
  const title = (p.title as string) || (locale === 'tr' ? 'Proje Detayı' : 'Project Detail');

  let description = '';
  if (typeof p.description === 'string') description = p.description;
  else if (Array.isArray(p.description)) description = extractPlainText(p.description as StrapiRichText[]);

  let content = '';
  if (typeof p.content === 'string') content = p.content;
  else if (Array.isArray(p.content)) content = extractPlainText(p.content as StrapiRichText[]);

  let imageUrl = '';
  const img = (p.thumbnail || p.image) as StrapiProject['image'];
  imageUrl = resolveStrapiUrl(img?.formats?.large?.url || img?.formats?.medium?.url || img?.url);

  let technologies: string[] = [];
  const tech = p.techStack || p.technologies;
  if (typeof tech === 'string') technologies = tech.split(',').map((t) => (t as string).trim());
  else if (Array.isArray(tech)) technologies = tech as string[];

  const projectUrl = (p.liveUrl as string) || (p.projectUrl as string) || '';
  const githubUrl = (p.githubUrl as string) || '';

  return (
    <>
      {/* Slug haritasını client-side context'e aktar */}
      <SlugMapSetter slugMap={slugMap} basePath="/portfolio" />

      <Header />
      <main className="pt-32 pb-10 min-h-screen">
        <div className="max-w-[1000px] mx-auto px-6">
          <Button href="/portfolio" variant="ghost" className="mb-8" showArrow={false}>
            &larr; {t('allProjects')}
          </Button>

          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white tracking-tight mb-6">
            {title}
          </h1>

          <div className="flex flex-wrap gap-2 mb-8">
            {technologies.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 bg-dark-card border border-dark-border rounded-full text-white text-sm"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 mb-10">
            {projectUrl && projectUrl !== '#' && (
              <a
                href={projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-colors"
              >
                {t('liveProject')} <ExternalLink size={18} />
              </a>
            )}
            {githubUrl && githubUrl !== '#' && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-dark-lighter border border-dark-border text-white rounded-full font-medium hover:bg-white hover:text-dark transition-colors"
              >
                {t('sourceCode')} <Code2 size={18} />
              </a>
            )}
          </div>

          {imageUrl && (
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-12 border border-dark-border">
              <Image src={imageUrl} alt={title} fill className="object-cover" priority />
            </div>
          )}

          <div className="prose prose-invert prose-lg max-w-none">
            <h2 className="text-2xl font-heading font-bold text-white mb-4">
              {t('aboutProject')}
            </h2>
            <div className="text-gray-text leading-relaxed space-y-4 whitespace-pre-wrap">
              {content || description}
            </div>
          </div>
        </div>

        <div className="mt-24">
          <CTA />
        </div>
      </main>
      <Footer />
    </>
  );
}
