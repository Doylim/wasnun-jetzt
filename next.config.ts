import path from "node:path";
import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/**
 * Content-Security-Policy fuer wasnun.jetzt.
 *
 * Aktuelle Anforderungen:
 *  - JSON-LD via <Script type="application/ld+json"> (Inline) → 'unsafe-inline' fuer scripts
 *  - Tailwind/Next.js injizieren Inline-Styles + der Cookie-Banner nutzt <style> → 'unsafe-inline' fuer styles
 *  - next/font wird selbst gehostet → 'self' reicht fuer fonts
 *  - Dev-Mode (Turbopack HMR) braucht 'unsafe-eval' → nur in Development gesetzt
 *
 * Wenn spaeter Affiliate-Tracking-Pixel oder externe Vorschauen dazukommen,
 * werden sie pro Domain in img-src / connect-src / frame-src ergaenzt.
 * Stand: noch keine externen Tracking-Domains aktiv, daher Whitelist leer.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  // Next 16 / Turbopack waehlt sonst den Eltern-Ordner als Workspace-Root,
  // wenn dort mehrere Geschwister-Projekte liegen (C:\projekte\webseiten\*).
  // Folge: CSS-Module wie tailwindcss werden aus dem Eltern-node_modules
  // gesucht und der Build bricht ab. Siehe webseiten/CLAUDE.md Abschnitt 15.
  turbopack: {
    root: path.resolve(__dirname),
  },
  outputFileTracingRoot: path.resolve(__dirname),
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
