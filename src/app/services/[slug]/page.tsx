import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CTA from "@/components/sections/CTA";
import Button from "@/components/ui/Button";
import { STRAPI_URL } from "@/lib/constants";
import { Smartphone, Globe, Bot, Layers, Code, LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Smartphone: Smartphone,
  Globe: Globe,
  auto: Bot,
  process: Layers,
};

interface StrapiService {
  documentId: string;
  title: string;
  description: string;
  iconName: string;
  order: number;
  features: string[];
}

async function getService(documentId: string) {
  try {
    const res = await fetch(`${STRAPI_URL}/api/services/${documentId}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data as StrapiService | null;
  } catch (error) {
    return null;
  }
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const service = await getService(resolvedParams.slug);

  if (!service) {
    notFound();
  }

  const Icon = iconMap[service.iconName] || Code;

  return (
    <>
      <Header />
      <main className="pt-32 pb-10 min-h-screen">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="mb-10">
            <Button href="/services" variant="ghost" className="mb-8" showArrow={false}>
              &larr; Tüm Hizmetler
            </Button>
            
            <div className="flex items-center gap-6 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
                <Icon size={32} className="text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-white tracking-tight">{service.title}</h1>
            </div>
            
            <p className="text-gray-text text-xl max-w-3xl leading-relaxed mb-10">
              {service.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-16">
              {service.features?.map((f) => (
                <span key={f} className="px-4 py-2 bg-dark-card border border-dark-border rounded-full text-white text-sm">
                  {f}
                </span>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-dark-border pt-16">
            <div className="space-y-6">
              <h3 className="text-2xl font-heading font-bold text-white">Nasıl Çalışıyoruz?</h3>
              <p className="text-gray-text leading-relaxed">
                İhtiyaçlarınızı analiz edip, en uygun teknolojileri seçerek projeye başlıyoruz. Süreç boyunca şeffaf iletişim ve çevik (agile) yöntemler kullanarak beklentilerinizin üzerinde bir sonuç ortaya çıkarıyoruz.
              </p>
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-heading font-bold text-white">Neler Sağlıyoruz?</h3>
              <ul className="space-y-4">
                {["Kapsamlı Analiz ve Planlama", "Modern ve Ölçeklenebilir Mimari", "Performans ve Güvenlik Optimizasyonu", "Sürekli Destek ve Bakım"].map((item, i) => (
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
