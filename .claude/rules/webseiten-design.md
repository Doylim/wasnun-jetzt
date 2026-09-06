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

### Fluid Typography für Headlines

Für Hero- und Section-Headlines darf statt der Breakpoint-Staffel eine fließende
Größe stehen. Das master-template liefert dafür `.text-fluid-xl`, `-lg`, `-md`
und `-base` in `globals.css` mit:

```css
.text-fluid-xl { font-size: clamp(2rem, 5vw + 1rem, 4rem); line-height: 1.1; }
```

Beides ist erlaubt. Fließend nimmt Zwischengrößen sauber mit, die Staffel ist
leichter vorherzusagen. **Nicht mischen innerhalb einer Seite.**

### Dark Mode (Pflicht)

Jedes Projekt kann dunkel. Umgesetzt über die Klasse `dark` am `<html>`, nicht
über `prefers-color-scheme` allein — sonst kann der Nutzer nicht umschalten.

- Farben **ausschließlich** über CSS-Variablen, nie hart im Markup. `:root` ist
  hell, `.dark` überschreibt dieselben Variablen dunkel.
- `@custom-variant dark (&:is(.dark *));` in `globals.css`, damit Tailwinds
  `dark:`-Präfix auf die Klasse hört.
- **Gegen das Aufblitzen des hellen Modus:** ein `<script>` mit
  `strategy="beforeInteractive"` im Root-Layout setzt die Klasse aus
  `localStorage` bzw. der System-Präferenz, BEVOR gerendert wird.
- Der Umschalter liest den Zustand über `useSyncExternalStore` direkt von der
  `dark`-Klasse — nicht per `useState` + `useEffect` spiegeln, das meldet
  `react-hooks/set-state-in-effect` zu Recht.
- Dunkel ist nicht „hell invertiert": Kontraste einzeln prüfen, die Akzentfarbe
  braucht auf dunklem Grund meist einen helleren Ton.

Referenz-Implementierung: `webseiten\master-template` (`globals.css`,
`layout.tsx`, `components/dark-mode-toggle.tsx`).

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

### Admin-UI: Texte ohne Gedankenstriche

In Admin-Bereichen (Oberfläche, Fehlertexte, Mails, PDFs, Hilfetexte) steht
**kein Gedankenstrich** („—" U+2014, „–" U+2013) in sichtbarem Text. Statt
„Meldung gespeichert — du kannst sie noch ändern" heißt es „Meldung gespeichert.
Du kannst sie noch ändern." Ersatz je nach Satz: Punkt, Komma, Doppelpunkt,
Klammer oder zwei Sätze. Ein leeres Tabellenfeld bleibt leer oder trägt „keine",
nicht „—".

**Warum (Norbert, 2026-09-06, fight-evolution S102):** Der Admin-Bereich war
über hundert Sessions konsequent ohne Gedankenstriche geschrieben; die Neubauten
eines einzigen Tages (`/admin/stunden`, Zugänge, Neuigkeiten, Stunden-Mails und
-PDFs) brachten sie dutzendfach zurück. Gehäufte Gedankenstriche lesen sich
als KI-generiert und brechen den Ton, den die Bestandsseiten haben. Der
Bis-Strich in Zeitspannen bleibt davon unberührt, wenn das Projekt ihn schon
verwendet („18:00–19:30 Uhr"); im Zweifel „bis".

Prüfung vor dem Commit: `grep -rn "—\|–" src/app/admin src/components/admin src/lib/email`
über die geänderten Dateien; jede Fundstelle in sichtbarem Text wird ersetzt.

### Shadows

- `shadow-sm` für Cards
- `shadow-lg` für aktive Elemente
- `shadow-xl` nur für Hero-Highlights
- Immer mit Farbkomponente: `shadow-lg shadow-navy-800/20`

### Container Queries statt Media Queries für Komponenten

Media Queries fragen den Bildschirm, Container Queries den Platz, den die
Komponente tatsächlich hat. Eine Karte in der Sidebar ist schmal, obwohl der
Bildschirm breit ist — nur die Container Query merkt das.

```css
.karten-raster { container-type: inline-size; container-name: karte; }

@container karte (min-width: 400px) {
  .karte-inhalt { display: flex; gap: 1rem; }
}
```

**Faustregel:** Seitenlayout → Media Query. Wiederverwendbare Komponente, die an
mehreren Stellen unterschiedlich breit steht → Container Query.

### View Transitions für Seitenwechsel (optional)

```css
::view-transition-old(root) { animation: 300ms ease-out fade-out; }
::view-transition-new(root) { animation: 300ms ease-in fade-in; }
```

Nur einsetzen, wenn der Übergang etwas erklärt (Liste → Detail). Ein Fade auf
jedem Klick ist Selbstzweck und verlangsamt gefühlt. `prefers-reduced-motion`
respektieren.

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
- **Klickfläche:** mindestens 44 × 44 px auf Touch-Geräten (`min-w-[44px] min-h-[44px]`)
- **Bewegung:** `@media (prefers-reduced-motion: reduce)` deaktiviert Animationen
  und `scroll-behavior: smooth`

---
