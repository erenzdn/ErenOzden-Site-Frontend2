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
  email: "info@erenozden.com",
  phone: "+90 555 123 45 67",
  location: "İstanbul, Türkiye",
} as const;

export const SOCIAL = {
  github: "https://github.com",
  linkedin: "https://linkedin.com",
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
