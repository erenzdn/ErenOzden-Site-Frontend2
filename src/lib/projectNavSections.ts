import type { Locale } from '@/i18n/routing';
import type { ProjectNavSection } from '@/components/ui/ProjectSectionNav';

interface BuildProjectNavSectionsOptions {
  locale: Locale;
  isErpProject: boolean;
  isEarthquakeCheck: boolean;
  hasPreview: boolean;
  hasDefaultGallery: boolean;
}

export function buildProjectNavSections({
  locale,
  isErpProject,
  isEarthquakeCheck,
  hasPreview,
  hasDefaultGallery,
}: BuildProjectNavSectionsOptions): ProjectNavSection[] {
  const tr = locale === 'tr';
  const sections: ProjectNavSection[] = [];

  sections.push({
    id: 'project-hero',
    number: '—',
    title: tr ? 'Giriş' : 'Intro',
  });

  if (hasPreview) {
    sections.push({
      id: 'project-preview',
      number: '—',
      title: tr ? 'Önizleme' : 'Preview',
    });
  }

  sections.push({
    id: 'project-overview',
    number: '1.0',
    title: tr ? 'Genel Bakış' : 'Overview',
  });

  if (isErpProject || isEarthquakeCheck) {
    sections.push({
      id: 'project-engineering',
      number: '1.1',
      title: tr ? 'Mühendislik' : 'Engineering',
    });
  }

  if (isEarthquakeCheck) {
    sections.push({
      id: 'project-modules',
      number: '2.0',
      title: tr ? 'Analiz Akışı' : 'Analysis Flow',
    });
    sections.push({
      id: 'project-gallery',
      number: '3.0',
      title: tr ? 'Arayüz Galerisi' : 'Interface Gallery',
    });
    sections.push({
      id: 'project-technical',
      number: '4.0',
      title: tr ? 'Teknik Özellikler' : 'Technical Specs',
    });
  } else if (isErpProject) {
    sections.push({
      id: 'project-modules',
      number: '2.0',
      title: tr ? 'Sistem Modülleri' : 'System Modules',
    });
    sections.push({
      id: 'project-gallery',
      number: '3.0',
      title: tr ? 'Arayüz Galerisi' : 'Interface Gallery',
    });
    sections.push({
      id: 'project-technical',
      number: '4.0',
      title: tr ? 'Teknik Özellikler' : 'Technical Specs',
    });
  } else if (hasDefaultGallery) {
    sections.push({
      id: 'project-gallery',
      number: '2.0',
      title: tr ? 'Galeri' : 'Gallery',
    });
  }

  return sections;
}
