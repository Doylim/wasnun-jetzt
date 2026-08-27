---
paths:
  - "**/*.tsx"
  - "**/*.css"
  - "**/*.mdx"
---

<!-- ERZEUGT aus _fundament/rules/webseiten-design.md - nicht hier bearbeiten.
     Aenderungen gehoeren in C:\Projekte\_fundament\rules\webseiten-design.md,
     danach: node C:\Projekte\_fundament\rules-verteilen.mjs -->

# Design-System und Accessibility

Diese Regeln laden nur, wenn Claude eine passende Datei anfasst - sie standen
bis 2026-08-27 in webseiten/CLAUDE.md und wurden dadurch in jeder Session
mitgeladen, auch wenn gar keine Oberflaeche gebaut wurde.

## 4. Design-System

### Farb-Philosophie

Jedes Projekt bekommt ein klares 3–4-Farben-System. Kein Regenbogen, keine
zufälligen Tailwind-Defaults. Immer via `@theme` in `globals.css` definieren.

**Beispiel aus wasnun-jetzt** (Finanz/Vertrauen):

```css
@theme {
  --color-navy-50: #f0f4f9;
  --color-navy-800: #0f1f3d;  /* Primär */
  --color-teal-500: #00b89f;  /* Akzent */
  --color-amber-brand: #f5a623; /* Warnungen */
  --color-cream: #faf8f4;
}
```

**Beispiel für andere Projekt-Typen:**
- Shop/E-Commerce: Schwarz + Goldgelb + Creme
- Verein/Kampfsport: Schwarz + Rot + Weiß
- Editorial/News: Dunkelgrau + Akzentfarbe + Sand
- B2B/Lean: Graublau + Orange + Weiß

**Regel:** Primärfarbe = Marken-Identität. Akzentfarbe = Call-to-Action. Warnfarbe = Alerts. Hintergründe neutral.

### Typo

- **Font:** Inter via `next/font/google` (Subset `latin`, `display: "swap"`)
- Ausnahme: Content-Projekte dürfen Serifen für Headlines nutzen (z.B. Playfair, Fraunces)
- **Font-Weights:** 400, 600, 800, 900 reichen. Keine dünnen Weights unter 400 für Fließtext.
- **Text-Größen:** Tailwind Defaults nutzen (`text-sm`, `text-base`, `text-xl`…)
- Große Headlines: `text-3xl md:text-5xl lg:text-6xl font-black` als Default-Pattern

### Radius/Spacing

- `rounded-xl` für Form-Inputs
- `rounded-2xl` für Cards
- `rounded-3xl` nur für Hero-/Highlight-Flächen
- `rounded-full` für Buttons und Badges
- Container `max-w-6xl` oder `max-w-7xl`, `px-4 md:px-6`
- Sections: `py-20 md:py-28` als Default, `py-16` für sekundäre Sections

### Buttons

Drei Varianten sind Pflicht in `components/ui/button.tsx`:

- `default` – Primärfarbe dunkel (z.B. `navy-800`)
- `primary` – Akzentfarbe mit Shadow (z.B. `teal-500`)
- `outline` – Transparent mit Border
- `ghost` – Hover-Background

Größen: `sm`, `default`, `lg`, `xl`, `icon`.

### Shadows

- `shadow-sm` für Cards
- `shadow-lg` für aktive Elemente
- `shadow-xl` nur für Hero-Highlights
- Immer mit Farbkomponente: `shadow-lg shadow-navy-800/20`

---

---

## 7. Accessibility (WCAG AA als Minimum)

- **`lang="de"`** im `<html>`-Tag des Root-Layouts
- **Skip-Link** zum Hauptinhalt als erstes Element im `body`
- **Semantisches HTML:** `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`
- **ARIA-Labels** für alle interaktiven Elemente ohne sichtbaren Text
- **Focus-Ring** immer sichtbar (`:focus-visible` mit `outline-2 outline-offset-2`)
- **Kontrast:** Text mindestens 4.5:1 gegen Hintergrund
- **Buttons vs Links:** `<button>` für Aktionen, `<a>` für Navigation
- **Form-Labels:** Jedes Input hat ein `<label>` (oder `aria-label`)
- **Tastatur-Navigation:** Jede Funktion muss ohne Maus bedienbar sein

---
