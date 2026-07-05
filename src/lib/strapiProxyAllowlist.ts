export type StrapiProxyMethod = "GET" | "HEAD" | "POST";

type ProxyDenyReason = { allowed: false; status: 404 | 405 };
type ProxyAllowResult = { allowed: true } | ProxyDenyReason;

const BLOCKED_METHODS = new Set(["PUT", "PATCH", "DELETE"]);

const GET_PATH_PATTERNS = [
  /^api\/projects$/,
  /^api\/projects\/[^/]+$/,
  /^api\/services$/,
  /^api\/services\/[^/]+$/,
] as const;

const POST_PATH_PATTERNS = [/^api\/messages$/] as const;

/**
 * Path segment'lerini güvenli Strapi REST path'ine dönüştürür.
 * Leading/trailing slash, çift slash ve .. injection girişimlerini reddeder.
 */
export function normalizeStrapiProxyPath(segments: string[]): string | null {
  if (segments.length === 0) {
    return null;
  }

  for (const segment of segments) {
    if (!segment || segment === "." || segment === "..") {
      return null;
    }
  }

  const path = segments.join("/").replace(/\/+/g, "/").replace(/^\/+|\/+$/g, "");
  return path || null;
}

export function checkStrapiProxyAllowlist(
  method: string,
  pathSegments: string[],
): ProxyAllowResult {
  const normalizedMethod = method.toUpperCase();

  if (BLOCKED_METHODS.has(normalizedMethod)) {
    return { allowed: false, status: 405 };
  }

  const path = normalizeStrapiProxyPath(pathSegments);
  if (!path) {
    return { allowed: false, status: 404 };
  }

  if (normalizedMethod === "GET" || normalizedMethod === "HEAD") {
    return GET_PATH_PATTERNS.some((pattern) => pattern.test(path))
      ? { allowed: true }
      : { allowed: false, status: 404 };
  }

  if (normalizedMethod === "POST") {
    return POST_PATH_PATTERNS.some((pattern) => pattern.test(path))
      ? { allowed: true }
      : { allowed: false, status: 404 };
  }

  return { allowed: false, status: 405 };
}
