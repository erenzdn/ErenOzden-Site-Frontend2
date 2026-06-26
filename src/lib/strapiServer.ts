/**
 * Server-Side Strapi Data Fetching Layer
 * ISR + Cache-First stratejisi ile optimize edilmiş
 */

import { buildStrapiApiUrl, normalizeStrapiData } from "./apiClient";
import { strapiLocaleAttempts } from "./strapi";
import { serverStrapiFetch } from "./strapiUpstream";
import type { Locale } from "@/i18n/routing";

/**
 * Projects koleksiyonunu server-side çeker (ISR enabled)
 */
export async function fetchProjectsServer<T>(
  locale: Locale,
  revalidate = 3600
): Promise<T[]> {
  for (const loc of strapiLocaleAttempts(locale)) {
    const localeParam = loc ? `?locale=${loc}&populate=*` : "?populate=*";
    const url = `${buildStrapiApiUrl("/api/projects")}${localeParam}`;

    try {
      const res = await serverStrapiFetch(url, { next: { revalidate } });
      if (!res.ok) continue;

      const json = await res.json();
      const normalized = normalizeStrapiData(json);

      if (Array.isArray(normalized) && normalized.length > 0) {
        return normalized as T[];
      }
    } catch (error) {
      console.error(`[Strapi Server] Failed to fetch projects (locale: ${loc})`, error);
      continue;
    }
  }

  return [];
}

/**
 * Services koleksiyonunu server-side çeker (ISR enabled)
 */
export async function fetchServicesServer<T>(
  locale: Locale,
  revalidate = 3600
): Promise<T[]> {
  for (const loc of strapiLocaleAttempts(locale)) {
    const localeParam = loc ? `?locale=${loc}&populate=*` : "?populate=*";
    const url = `${buildStrapiApiUrl("/api/services")}${localeParam}`;

    try {
      const res = await serverStrapiFetch(url, { next: { revalidate } });
      if (!res.ok) continue;

      const json = await res.json();
      const normalized = normalizeStrapiData(json);

      if (Array.isArray(normalized) && normalized.length > 0) {
        return normalized as T[];
      }
    } catch (error) {
      console.error(`[Strapi Server] Failed to fetch services (locale: ${loc})`, error);
      continue;
    }
  }

  return [];
}

/**
 * Tekil proje çeker (slug veya documentId ile)
 */
export async function fetchProjectServer<T>(
  identifier: string,
  locale: Locale,
  revalidate = 3600
): Promise<T | null> {
  for (const loc of strapiLocaleAttempts(locale)) {
    const localeParam = loc ? `&locale=${loc}` : "";
    const slugUrl = `${buildStrapiApiUrl("/api/projects")}?filters[slug][$eq]=${encodeURIComponent(identifier)}&populate=*${localeParam}`;

    try {
      const res = await serverStrapiFetch(slugUrl, { next: { revalidate } });
      if (res.ok) {
        const json = await res.json();
        const normalized = normalizeStrapiData(json);
        if (Array.isArray(normalized) && normalized.length > 0) {
          return normalized[0] as T;
        }
      }
    } catch {
      // documentId denemesine geç
    }
  }

  // Slug bulunamazsa documentId dene
  for (const loc of strapiLocaleAttempts(locale)) {
    const localeParam = loc ? `?locale=${loc}&populate=*` : "?populate=*";
    const docUrl = `${buildStrapiApiUrl(`/api/projects/${encodeURIComponent(identifier)}`)}${localeParam}`;

    try {
      const res = await serverStrapiFetch(docUrl, { next: { revalidate } });
      if (res.ok) {
        const json = await res.json();
        const normalized = normalizeStrapiData(json);
        if (normalized) return normalized as T;
      }
    } catch {
      continue;
    }
  }

  return null;
}
