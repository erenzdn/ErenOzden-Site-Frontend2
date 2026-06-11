import { notFound } from "next/navigation";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CTA from "@/components/sections/CTA";
import Button from "@/components/ui/Button";
import { STRAPI_URL } from "@/lib/constants";
import { resolveStrapiUrl } from "@/lib/apiClient";
import { ExternalLink, Code2 } from "lucide-react";

interface StrapiRichText { type: string; children: { text: string }[] }
interface StrapiProject {
  id: number;
  documentId?: string;
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

function extractPlainText(rt: StrapiRichText[]): string {
  return rt.map((b) => b.children?.map((c) => c.text).join("") || "").join("\n\n");
}

async function getProject(id: string) {
  try {
    const res = await fetch(`${STRAPI_URL}/api/projects/${id}?populate=*`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data as StrapiProject | null;
  } catch (error) {
    return null;
  }
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const projectData = await getProject(resolvedParams.id);

  if (!projectData) {
    notFound();
  }

  const p = projectData as unknown as Record<string, unknown>;
  const title = (p.title as string) || "Proje Detayı";
  
  let description = "";
  if (typeof p.description === "string") description = p.description;
  else if (Array.isArray(p.description)) description = extractPlainText(p.description as StrapiRichText[]);

  let content = "";
  if (typeof p.content === "string") content = p.content;
  else if (Array.isArray(p.content)) content = extractPlainText(p.content as StrapiRichText[]);

  let imageUrl = "";
  const img = (p.thumbnail || p.image) as StrapiProject["image"];
  imageUrl = resolveStrapiUrl(img?.formats?.large?.url || img?.formats?.medium?.url || img?.url);

  let technologies: string[] = [];
  const tech = p.techStack || p.technologies;
  if (typeof tech === "string") technologies = tech.split(",").map((t) => (t as string).trim());
  else if (Array.isArray(tech)) technologies = tech as string[];

  const projectUrl = (p.liveUrl as string) || (p.projectUrl as string) || "";
  const githubUrl = (p.githubUrl as string) || "";

  return (
    <>
      <Header />
      <main className="pt-32 pb-10 min-h-screen">
        <div className="max-w-[1000px] mx-auto px-6">
          <Button href="/portfolio" variant="ghost" className="mb-8" showArrow={false}>
            &larr; Tüm Projeler
          </Button>

          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white tracking-tight mb-6">{title}</h1>
          
          <div className="flex flex-wrap gap-2 mb-8">
            {technologies.map((t) => (
              <span key={t} className="px-3 py-1.5 bg-dark-card border border-dark-border rounded-full text-white text-sm">
                {t}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 mb-10">
            {projectUrl && projectUrl !== "#" && (
              <a href={projectUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-colors">
                Canlı Projeyi Gör <ExternalLink size={18} />
              </a>
            )}
            {githubUrl && githubUrl !== "#" && (
              <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-dark-lighter border border-dark-border text-white rounded-full font-medium hover:bg-white hover:text-dark transition-colors">
                Kaynak Kodları <Code2 size={18} />
              </a>
            )}
          </div>

          {imageUrl && (
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-12 border border-dark-border">
              <Image src={imageUrl} alt={title} fill className="object-cover" priority />
            </div>
          )}

          <div className="prose prose-invert prose-lg max-w-none">
            <h2 className="text-2xl font-heading font-bold text-white mb-4">Proje Hakkında</h2>
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
