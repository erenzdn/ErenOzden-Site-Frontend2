import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { locales, type Locale } from '@/i18n/routing';
import HomeClient from '@/components/pages/HomeClient';
import { fetchProjectsServer } from '@/lib/strapiServer';
import {
  extractStrapiPlainText,
  pickStrapiImageUrl,
  type StrapiRichTextBlock,
} from '@/lib/strapi';
import type { Project } from '@/components/sections/PortfolioClient';

type Props = {
  params: Promise<{ locale: Locale }>;
};

interface StrapiProject {
  id: number;
  documentId?: string;
  slug?: string;
  title?: string;
  description?: string | StrapiRichTextBlock[];
  image?: { url?: string; formats?: { medium?: { url?: string }; small?: { url?: string } } };
  thumbnail?: { url?: string; formats?: { medium?: { url?: string }; small?: { url?: string } } };
  technologies?: string | string[];
  techStack?: string | string[] | null;
  projectUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
}

function parseProject(item: StrapiProject): Project {
  const a = item as unknown as Record<string, unknown>;
  const title = (a.title as string) || "Untitled Project";
  const documentId = (a.documentId as string) || String(a.id);

  const description = extractStrapiPlainText(a.description as string | StrapiRichTextBlock[]);
  const imageUrl = pickStrapiImageUrl((a.thumbnail || a.image) as StrapiProject["thumbnail"]);

  let technologies: string[] = [];
  const tech = a.techStack || a.technologies;
  if (typeof tech === "string") technologies = tech.split(",").map((t) => (t as string).trim());
  else if (Array.isArray(tech)) technologies = tech as string[];

  return {
    id: item.id,
    documentId,
    slug: a.slug as string | undefined,
    title,
    description,
    imageUrl,
    technologies,
    projectUrl: (a.liveUrl as string) || (a.projectUrl as string) || "#",
    githubUrl: (a.githubUrl as string) || "#",
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.home' });
  
  const baseUrl = 'https://erenozden.com';

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        'tr': `${baseUrl}/tr`,
        'en': `${baseUrl}/en`,
        'x-default': `${baseUrl}/tr`,
      },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${baseUrl}/${locale}`,
      siteName: 'Eren Özden',
      locale: locale === 'tr' ? 'tr_TR' : 'en_US',
      alternateLocale: locale === 'tr' ? 'en_US' : 'tr_TR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  
  // Statik rendering optimizasyonu için locale'i ayarla
  setRequestLocale(locale);

  // Portfolio verisini server-side çek (ISR: 1 saat)
  const rawProjects = await fetchProjectsServer<StrapiProject>(locale, 3600);
  const projects: Project[] = rawProjects.map(parseProject);

  return <HomeClient projects={projects} />;
}
