---
paths:
  - "src/components/**"
  - "src/app/**/*.tsx"
---

<!-- ERZEUGT aus _fundament/rules/webseiten-komponenten.md - nicht hier bearbeiten.
     Aenderungen gehoeren in C:\Projekte\_fundament\rules\webseiten-komponenten.md,
     danach: node C:\Projekte\_fundament\rules-verteilen.mjs -->

# Komponenten- und Section-Patterns

Diese Regeln laden nur, wenn Claude eine passende Datei anfasst - sie standen
bis 2026-08-27 in webseiten/CLAUDE.md und wurden dadurch in jeder Session
mitgeladen, auch wenn gar keine Oberflaeche gebaut wurde.

## 5. Komponenten-Patterns

### Section-Struktur

Jede Section ist eine **eigene Datei** in `src/components/sections/`.
`src/app/page.tsx` ruft sie nur auf – keine Inline-Komponenten auf der Startseite.

```tsx
// src/app/page.tsx – Beispiel
import { SiteHeader } from "@/components/sections/site-header";
import { Hero } from "@/components/sections/hero";
import { Rechner } from "@/components/sections/rechner";
// ...

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Rechner />
        {/* weitere Sections */}
      </main>
      <SiteFooter />
    </>
  );
}
```

### Section-Template

```tsx
import { Badge } from "@/components/ui/badge";

export function BeispielSection() {
  return (
    <section className="border-t border-navy-100 bg-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-12 text-center">
          <Badge variant="teal" className="mb-4">Kategorie-Badge</Badge>
          <h2 className="mb-4 text-balance text-3xl font-black text-navy-900 md:text-5xl">
            Headline hier
          </h2>
          <p className="mx-auto max-w-2xl text-balance text-lg text-navy-600">
            Sub-Headline
          </p>
        </div>
        {/* Content */}
      </div>
    </section>
  );
}
```

### Hero-Section Pattern

Jedes Projekt hat einen klaren Hero mit:
- **Value-Proposition in einem Satz**
- **Eine große Zahl oder ein Keyword als Blickfang** (z.B. `603 EUR`, `50 Athleten`, `24/7`)
- **Zwei Buttons:** primaer (Haupt-Aktion) + outline (sekundaer)
- **3–4 Trust-Indikatoren** (Icon + Label)
- Optional: Beispiel-Card rechts als visuelle Ankerung
- Hintergrund: dezenter Gradient + Grid-Muster + Blur-Blobs

### Navigation / SiteHeader (PFLICHT-PATTERN)

- `sticky top-0 z-50` mit `bg-white/90 backdrop-blur-md`
- **Feste Hoehe via `h-16 md:h-20` — niemals `py-X py-Y`.** Padding-basierte Header schwanken zwischen viewports und brechen das Anker-Sprung-Pattern. Höhe IMMER per `h-` deklarieren.
- **Header hat EINE Aufgabe:** Logo · Navigation · Haupt-CTA · (optional) genau EIN Trust-Signal (z.B. 4,9★-Badge). NIEMALS zweistöckig (Service-Strip, News-Banner, Trust-Listen als zweite Zeile). Solche Inhalte gehören ans Hero-Top, nicht in den Sticky-Header.
- Links + Logo links, Navigation + CTA rechts
- Mobile-Menü als `absolute inset-x-0 top-full` UNTER dem Header — niemals als `max-h`-Animation INNERHALB des Headers (sonst schwankt die Header-Höhe beim Öffnen und Anker brechen).
- Mobile: Burger-Menü mit ARIA (`aria-expanded`, `aria-label`)
- CTA-Button immer sichtbar (auch mobile, im Header-Slot)

### Anker-Sprung-Pattern (PFLICHT bei Sticky-Header)

Globaler `scroll-padding-top` in `globals.css` auf `html`, abgestimmt auf die Header-Höhe:

```css
html {
  scroll-padding-top: 5rem; /* mobile: header h-16 + Puffer */
}
@media (min-width: 768px) {
  html { scroll-padding-top: 7rem; } /* desktop: header h-20 + Puffer */
}
```

Funktioniert nur, wenn der Sticky-Header eine **vorhersagbare feste Höhe** hat (siehe oben). Belt-and-Suspenders: zusätzlich `scroll-mt-20 md:scroll-mt-28` auf jeder `<section id="...">` als Fallback für Browser, die `scroll-padding-top` nicht zuverlässig auflösen.

### Footer

Drei Spalten auf Desktop:
1. Logo + kurze Beschreibung
2. Tools/Features
3. Rechtliches (Impressum, Datenschutz, Kontakt)

Dunkler Hintergrund (Primärfarbe dunkel, z.B. `navy-900`), weiße Schrift, Akzent-Links.

---
