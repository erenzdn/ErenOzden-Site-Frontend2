/* ─────────────────────────────────────────────
   Constants — Merkezi sabit değerler
   ───────────────────────────────────────────── */

export const SITE = {
  name: "Eren Özden",
  title: "Eren Özden | Bilgisayar Mühendisi & Full Stack Geliştirici",
  description:
    "Modern web, mobil ve backend çözümleri sunan bilgisayar mühendisi.",
  logo: { main: "EREN", accent: "." },
} as const;

export const CONTACT = {
  email: "mehmeteren850@gmail.com",
  phone: "+90 507 027 63 00",
  location: "İstanbul, Türkiye",
} as const;

export const SOCIAL = {
  github: "https://github.com/erenzdn",
  linkedin: "https://www.linkedin.com/in/mehmet-eren-özden",
  twitter: "https://twitter.com",
  instagram: "https://instagram.com",
} as const;

export const STRAPI_URL = (
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://127.0.0.1:1337"
).replace(/\/$/, "");

export const NAV_LINKS = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Hakkımda", href: "/about" },
  { label: "Hizmetler", href: "/services" },
  { label: "Projeler", href: "/portfolio" },
  { label: "İletişim", href: "/contact" },
] as const;

/** Footer "Hizmetlerim" bölümündeki link anahtarları */
export const FOOTER_SERVICE_KEYS = [
  "webDev",
  "mobileDev",
  "backend",
  "database",
  "devops",
] as const;

export type FooterServiceKey = (typeof FOOTER_SERVICE_KEYS)[number];

/**
 * Footer hizmet linklerini Strapi servisleriyle eşleştirmek için iconName haritası.
 * Eşleşme yoksa /services sayfasına yönlendirilir.
 */
export const FOOTER_SERVICE_ICON_MAP: Record<FooterServiceKey, string | null> = {
  webDev: "Globe",
  mobileDev: "Smartphone",
  backend: "process",
  database: null,
  devops: "auto",
};
