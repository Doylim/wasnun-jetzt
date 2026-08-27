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
- Titel max. 60 Zeichen, Meta-Beschreibung max. 160 Zeichen — darüber schneidet
  Google ab

### Core Web Vitals

Zielwerte, die Google seit 2024 in das Ranking einrechnet:

| Wert | Ziel | Was ihn kaputt macht |
|---|---|---|
| LCP (Largest Contentful Paint) | < 2,5 s | ungeladenes Hero-Bild, blockierende Schriften |
| CLS (Cumulative Layout Shift) | < 0,1 | Bilder ohne Maße, nachrutschende Banner |
| INP (Interaction to Next Paint) | < 200 ms | schwere Client-Komponenten, Polling |

Im Next-Stack heißt das konkret:

- Hero-Bild mit `next/image` und `priority` — **kein** manuelles
  `<link rel="preload">`, das macht `next/image` selbst.
- Jedes Bild hat `width`/`height` oder `fill` mit definiertem Container. Ohne
  Maße springt das Layout.
- Schriften über `next/font/google` mit `display: "swap"`.
- Cookie-Banner und Ähnliches über dem Fold: Platz reservieren, nicht
  einschieben.

Vor dem Optimieren **messen**, nicht raten: die Live-URL durch PageSpeed
Insights schicken. Lokale Werte sind systematisch zu pessimistisch.

**Budget je Seite**, das nicht überschritten wird:

- JavaScript: max. 150 KB komprimiert
- CSS: max. 50 KB komprimiert
- Einzelbild: max. 200 KB (WebP/AVIF)
- Startseite gesamt: unter 1 MB
- Ladezeit auf mobilem 4G: unter 3 s

---

## GEO — Optimierung für KI-Suche

Neben Google fragen Menschen inzwischen ChatGPT, Perplexity, Claude und Gemini
direkt: „Wo kann ich in Heidelberg Kampfsport lernen?". Diese Antworten
entstehen aus Trainingswissen oder aus einer Live-Suche. Die Seite muss so
gebaut sein, dass eine KI sie als Quelle zitieren kann.

**Fünf Hebel, in dieser Reihenfolge:**

1. **Fragen direkt beantworten.** Eine Frage als `h3`, direkt darunter die
   Antwort in ein bis drei Sätzen. Kein Vorgeplänkel, keine Überleitung. Dazu
   `faqSchema()` einbinden.
2. **Fakten statt Floskeln.** „Gegründet 2015, 147 Mitglieder, 3 zertifizierte
   Trainer, 12 Trainingszeiten pro Woche" ist zitierbar. „Langjährige Erfahrung
   und ein breites Spektrum" ist es nicht.
3. **Präzise benennen.** „Wir unterrichten BJJ, Boxen, MMA und
   Selbstverteidigung" schlägt „vielfältige sportliche Möglichkeiten".
4. **Themenführerschaft statt Einzelseite.** Je Leistung eine eigene Seite, dazu
   Beiträge zu echten Nutzerfragen. Fragenquelle: Googles „Auch gefragt".
5. **Erwähnungen aufbauen.** Google Business Profil (Pflicht, kostenlos), dann
   die zum Projekttyp passenden Verzeichnisse. KIs gewichten, wie oft eine
   Quelle unabhängig genannt wird.

**E-E-A-T:** Bei Ratgeber-Inhalten die Autorschaft zeigen — Name, Qualifikation,
seit wann. Ein Artikel ohne erkennbaren Urheber wird seltener zitiert.

**`llms.txt` und `llms-full.txt`** im `public/`-Ordner fassen Angebot, Preise und
Kernaussagen maschinenlesbar zusammen. Referenz: `webseiten\seivio`. Wenn sich
Preise ändern, müssen beide Dateien mit — sonst zitieren KIs veraltete Zahlen.

---
