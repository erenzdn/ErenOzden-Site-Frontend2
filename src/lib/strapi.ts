import {
  apiClient,
  buildStrapiApiUrl,
  normalizeStrapiData,
  resolveStrapiUrl,
} from "./apiClient";
import type { Locale } from "@/i18n/routing";

/** CMS'teki mevcut içerik locale'i (TR çevirileri eklenene kadar fallback) */
export const STRAPI_CONTENT_LOCALE = "en";

export type StrapiFetchInit = RequestInit & { next?: { revalidate?: number } };

export interface StrapiMedia {
  url?: string;
  formats?: {
    large?: { url?: string };
    medium?: { url?: string };
    small?: { url?: string };
    thumbnail?: { url?: string };
  };
}

export interface StrapiRichTextBlock {
  type: string;
  children?: { text?: string; type?: string }[];
}

export function strapiLocaleAttempts(locale: Locale): (Locale | null)[] {
  const attempts: (Locale | null)[] = [locale];
  if (locale !== STRAPI_CONTENT_LOCALE) {
    attempts.push(STRAPI_CONTENT_LOCALE as Locale);
  }
  attempts.push(null);
  return attempts;
}

export function pickStrapiImageUrl(media?: StrapiMedia | null): string {
  if (!media) return "";
  const path =
    media.formats?.large?.url ||
    media.formats?.medium?.url ||
    media.formats?.small?.url ||
    media.formats?.thumbnail?.url ||
    media.url ||
    "";
  return resolveStrapiUrl(path);
}

export function extractStrapiPlainText(
  value: string | StrapiRichTextBlock[] | null | undefined
): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (!Array.isArray(value)) return "";
  return value
    .map((block) => block.children?.map((c) => c.text ?? "").join("") ?? "")
    .filter(Boolean)
    .join("\n\n");
}

function withQuery(base: string, parts: string[]): string {
  const qs = parts.filter(Boolean).join("&");
  if (!qs) return base;
  return base.includes("?") ? `${base}&${qs}` : `${base}?${qs}`;
}

function localePart(locale: Locale | null): string {
  return locale ? `locale=${locale}` : "";
}

async function strapiFetch(url: string, init?: StrapiFetchInit): Promise<Response> {
  if (typeof window === "undefined") {
    const { serverStrapiFetch } = await import("./strapiUpstream");
    return serverStrapiFetch(url, init);
  }
  return fetch(url, init);
}

export async function loadStrapiCollection<T>(
  endpoint: string,
  locale: Locale,
  params: Record<string, string> = {}
): Promise<T[]> {
  for (const loc of strapiLocaleAttempts(locale)) {
    try {
      const query = { ...params };
      if (loc) query.locale = loc;
      const res = await apiClient.get(endpoint, { params: query });
      const data = normalizeStrapiData(res);
      if (Array.isArray(data) && data.length > 0) return data as T[];
    } catch {
      // Sonraki locale denemesine geç
    }
  }
  return [];
}

export async function fetchStrapiProjects<T>(
  locale: Locale,
  init?: StrapiFetchInit
): Promise<T[]> {
  for (const loc of strapiLocaleAttempts(locale)) {
    const url = withQuery(buildStrapiApiUrl("/api/projects"), [localePart(loc)]);
    try {
      const res = await strapiFetch(url, init);
      if (!res.ok) continue;
      const json = await res.json();
      if (Array.isArray(json.data) && json.data.length > 0) return json.data as T[];
    } catch {
      // Sonraki locale denemesine geç
    }
  }
  return [];
}

export async function fetchStrapiServices<T>(
  locale: Locale,
  init?: StrapiFetchInit
): Promise<T[]> {
  for (const loc of strapiLocaleAttempts(locale)) {
    const url = withQuery(buildStrapiApiUrl("/api/services"), [localePart(loc)]);
    try {
      const res = await strapiFetch(url, init);
      if (!res.ok) continue;
      const json = await res.json();
      if (Array.isArray(json.data) && json.data.length > 0) return json.data as T[];
    } catch {
      // Sonraki locale denemesine geç
    }
  }
  return [];
}

export async function fetchStrapiProject<T>(
  identifier: string,
  locale: Locale,
  init?: StrapiFetchInit
): Promise<T | null> {
  for (const loc of strapiLocaleAttempts(locale)) {
    const slugUrl = withQuery(
      `${buildStrapiApiUrl("/api/projects")}?filters[slug][$eq]=${encodeURIComponent(identifier)}&populate=*`,
      [localePart(loc)]
    );
    try {
      const res = await strapiFetch(slugUrl, init);
      if (res.ok) {
        const json = await res.json();
        if (json.data?.length > 0) return json.data[0] as T;
      }
    } catch {
      // documentId denemesine geç
    }
  }

  for (const loc of strapiLocaleAttempts(locale)) {
    const docUrl = withQuery(
      `${buildStrapiApiUrl(`/api/projects/${encodeURIComponent(identifier)}`)}`,
      ["populate=*", localePart(loc)]
    );
    try {
      const res = await strapiFetch(docUrl, init);
      if (res.ok) {
        const json = await res.json();
        if (json.data) return json.data as T;
      }
    } catch {
      // Sonraki locale denemesine geç
    }
  }

  return null;
}

export async function fetchStrapiService<T>(
  identifier: string,
  locale: Locale,
  init?: StrapiFetchInit
): Promise<T | null> {
  const localeAttempts = strapiLocaleAttempts(locale);
  
  for (const loc of localeAttempts) {
    const slugUrl = withQuery(
      `${buildStrapiApiUrl("/api/services")}?filters[slug][$eq]=${encodeURIComponent(identifier)}`,
      [localePart(loc)]
    );
    try {
      const res = await strapiFetch(slugUrl, init);
      if (res.ok) {
        const json = await res.json();
        if (json.data?.length > 0) return json.data[0] as T;
      }
    } catch {
      continue;
    }
  }

  for (const loc of localeAttempts) {
    const docUrl = withQuery(
      `${buildStrapiApiUrl(`/api/services/${encodeURIComponent(identifier)}`)}`,
      [localePart(loc)]
    );
    try {
      const res = await strapiFetch(docUrl, init);
      if (res.ok) {
        const json = await res.json();
        if (json.data) return json.data as T;
      }
    } catch {
      continue;
    }
  }

  return null;
}

export function strapiRouteKey(item: { slug?: string | null; documentId?: string }): string {
  return item.slug || item.documentId || "";
}
