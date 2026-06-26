/**
 * Strapi Upstream Fetch (Server-Side)
 * ISR-compatible fetch wrapper
 * Development SSL bypass for self-signed certificates
 */

export async function serverStrapiFetch(
  url: string,
  init?: RequestInit & { next?: { revalidate?: number } }
): Promise<Response> {
  const fetchOptions: RequestInit = {
    ...init,
    next: {
      revalidate: init?.next?.revalidate ?? 3600,
    },
  };

  // Development ortamında SSL certificate validation'ı bypass et
  if (process.env.NODE_ENV === "development") {
    // @ts-ignore - Node.js specific option
    if (typeof process !== "undefined" && process.env) {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    }
  }

  return fetch(url, fetchOptions);
}
