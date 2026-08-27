---
paths:
  - "src/app/**"
  - "src/lib/structured-data.ts"
---

<!-- ERZEUGT aus _fundament/rules/webseiten-seo.md - nicht hier bearbeiten.
     Aenderungen gehoeren in C:\Projekte\_fundament\rules\webseiten-seo.md,
     danach: node C:\Projekte\_fundament\rules-verteilen.mjs -->

# SEO-Pflichten

Diese Regeln laden nur, wenn Claude eine passende Datei anfasst - sie standen
bis 2026-08-27 in webseiten/CLAUDE.md und wurden dadurch in jeder Session
mitgeladen, auch wenn gar keine Oberflaeche gebaut wurde.

## 6. SEO (Pflicht bei jedem Projekt)

### Metadata-Template

`src/app/layout.tsx` muss haben:

```tsx
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} – ${HAUPT_CLAIM}`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [/* 5–8 Keywords */],
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true }, // vor Go-Live: false!
  alternates: { canonical: SITE_URL },
};
```

### Strukturierte Daten (JSON-LD)

`src/lib/structured-data.ts` liefert mindestens:
- `organizationSchema()` – Organization
- `websiteSchema()` – WebSite
- `faqSchema(items)` – wenn FAQ-Section vorhanden
- `articleSchema(article)` – wenn Content-Projekt

Einbindung im Layout oder den jeweiligen Page-Komponenten via `<Script type="application/ld+json" />`.

### Pflicht-Dateien

- `src/app/sitemap.ts` – Generator für `/sitemap.xml`
- `src/app/robots.ts` – Generator für `/robots.txt` mit Go-Live-Toggle
- `src/app/not-found.tsx` – 404-Seite

### Content-SEO

- `<h1>` nur einmal pro Seite
- Heading-Hierarchie sauber (`h1` → `h2` → `h3`, keine Sprünge)
- `alt`-Texte für jedes Bild (auch dekorative bekommen `alt=""`)
- Interne Verlinkung zwischen Sections/Pages
- URL-Slugs in Kebab-Case, deutsch, ohne Umlaute

---
