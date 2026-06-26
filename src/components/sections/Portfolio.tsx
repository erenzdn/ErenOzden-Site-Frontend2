/**
 * Portfolio Server Component (ISR-Enabled)
 * Veriyi server-side'da çeker, PortfolioClient'a props olarak aktarır
 */

import { fetchProjectsServer } from "@/lib/strapiServer";
import {
  extractStrapiPlainText,
  pickStrapiImageUrl,
  type StrapiRichTextBlock,
} from "@/lib/strapi";
import { type Locale } from "@/i18n/routing";
import PortfolioClient, { type Project } from "./PortfolioClient";

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

function parseProject(item: StrapiProject, defaultTitle: string): Project {
  const a = item as unknown as Record<string, unknown>;
  const title = (a.title as string) || defaultTitle;
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

interface PortfolioProps {
  locale: Locale;
  isHome?: boolean;
}

/**
 * Server Component: Veriyi ISR ile çeker
 */
export default async function Portfolio({ locale, isHome = false }: PortfolioProps) {
  // Server-side data fetching (ISR enabled: 1 saat cache)
  const rawProjects = await fetchProjectsServer<StrapiProject>(locale, 3600);

  // Strapi verisini normalize et
  const projects: Project[] = rawProjects.map((item) =>
    parseProject(item, "Untitled Project")
  );

  return <PortfolioClient projects={projects} isHome={isHome} />;
}
