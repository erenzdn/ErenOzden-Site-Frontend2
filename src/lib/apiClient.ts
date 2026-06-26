import { STRAPI_URL } from "./constants";

// API URL artık tek bir ortam değişkeni (NEXT_PUBLIC_STRAPI_URL) üzerinden yönetiliyor.
// Geliştirmede local URL (örn. http://localhost:1337), production'da https://api.mehmeterenozden.com
export const STRAPI_BASE_URL = STRAPI_URL;

// draftAndPublish Uyarısı/Bilgilendirmesi:
// ⚠️ ÖNEMLİ: Strapi'de draftAndPublish özelliği aktifse, geliştirme aşamasında içeriklerin
// API üzerinden gelebilmesi için Strapi Admin panelinde "Published" durumunda olduğundan emin olun.
// "Draft" durumundaki içerikler varsayılan (Public okuma) isteklerinde dönmeyecektir.

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

/**
 * Medya URL düzeltme yardımcısı
 * Eğer url '/' ile başlıyorsa (relatif ise) backend origin'ini ekler.
 */
export function resolveStrapiUrl(url: string | null | undefined): string {
  if (!url) return "";
  if (url.startsWith("/")) {
    return `${STRAPI_BASE_URL}${url}`;
  }
  return url;
}

/**
 * Strapi v4/v5 veri yapısını normalize eden akıllı fonksiyon.
 * 
 * Desteklenen pattern'ler:
 * - { data: { data: X } }
 * - { data: X }
 * - { data: { id, attributes } } -> attributes'i düzleştirir ve id'yi korur.
 */
export function normalizeStrapiData(response: any): any {
  if (!response) return null;

  // Pattern: { data: { data: X } }
  if (response.data && response.data.data !== undefined) {
    return normalizeStrapiData(response.data);
  }

  // Pattern: { data: X }
  if (response.data !== undefined) {
    const dataObj = response.data;

    // Eğer liste ise (Array) her elemanı normalize et
    if (Array.isArray(dataObj)) {
      return dataObj.map((item) => normalizeStrapiItem(item));
    }

    // Tekil obje ise normalize et
    return normalizeStrapiItem(dataObj);
  }

  // Doğrudan veri nesnesi ise
  if (Array.isArray(response)) {
    return response.map((item) => normalizeStrapiItem(item));
  }

  return normalizeStrapiItem(response);
}

/**
 * Tek bir Strapi öğesini normalize eder (id + attributes flatting).
 */
function normalizeStrapiItem(item: any): any {
  if (!item) return null;

  // { id, attributes: { ... } } v4 pattern'i düzleştirme
  if (item.id !== undefined && item.attributes !== undefined) {
    const attributes = item.attributes;
    const normalizedAttributes: any = {};

    // Attributes içindeki alt nesneleri de normalize et (örn: ilişkiler, resimler vb.)
    for (const key in attributes) {
      if (Object.prototype.hasOwnProperty.call(attributes, key)) {
        normalizedAttributes[key] = normalizeStrapiData(attributes[key]);
      }
    }

    return {
      id: item.id,
      ...normalizedAttributes,
    };
  }

  // Eğer id ve diğer düz alanları varsa
  if (typeof item === "object") {
    const normalizedObj: any = {};
    for (const key in item) {
      if (Object.prototype.hasOwnProperty.call(item, key)) {
        normalizedObj[key] = normalizeStrapiData(item[key]);
      }
    }
    return normalizedObj;
  }

  return item;
}

/**
 * Strapi REST path'ini normalize eder (/services → /api/services).
 */
function toStrapiApiPath(endpoint: string): string {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return cleanEndpoint.startsWith("/api/") ? cleanEndpoint : `/api${cleanEndpoint}`;
}

/**
 * Tarayıcıda same-origin proxy (/strapi), sunucuda doğrudan Strapi URL'i kullanır.
 * Sunucu istekleri strapiUpstream üzerinden gider (SSL + port uyumsuzluğu önlenir).
 */
export function buildStrapiApiUrl(endpoint: string): string {
  const apiPath = toStrapiApiPath(endpoint);
  if (typeof window !== "undefined") {
    return `/strapi${apiPath}`;
  }
  return `${STRAPI_BASE_URL}${apiPath}`;
}

/**
 * Güvenli URL birleştirme ve trailing slash tutarlılığı sağlayan helper.
 */
function buildApiUrl(endpoint: string): string {
  return buildStrapiApiUrl(endpoint);
}

/**
 * apiClient - fetch tabanlı esnek API istemcisi (Absolute URL - Public & Token Desteği)
 */
async function request(endpoint: string, options: FetchOptions = {}) {
  const { params, headers, ...customConfig } = options;

  // Güvenli URL oluşturma (Örn: https://mehmeterenozden.com/api/services veya http://127.0.0.1:1337/api/services)
  let url = buildApiUrl(endpoint);
  if (params) {
    const query = new URLSearchParams(params).toString();
    url = `${url}?${query}`;
  }

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Strapi API Token / Auth Desteği İçin Yer Ayrıldı (Gelecekte ihtiyaç olursa)
  // Strapi Users & Permissions / API Token kullanımı gerekirse .env içine STRAPI_API_TOKEN tanımlanabilir.
  const apiToken = process.env.STRAPI_API_TOKEN || process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  if (apiToken) {
    defaultHeaders["Authorization"] = `Bearer ${apiToken}`;
  }

  const config: RequestInit = {
    method: customConfig.method || "GET",
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    ...customConfig,
  };

  try {
    const response = await fetch(url, config);

    const contentType = response.headers.get("content-type");
    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const errorMessage =
        data?.error?.message || data?.message || `API Hatası (Kod: ${response.status})`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error: any) {
    console.error("API İsteği Hatası:", error);
    throw new Error(error.message || "Ağ hatası veya sunucuya ulaşılamıyor.");
  }
}

export const apiClient = {
  get: (endpoint: string, options?: FetchOptions) =>
    request(endpoint, { ...options, method: "GET" }),
};
