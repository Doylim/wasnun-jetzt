---
name: webseiten-neues-projekt
description: Ein neues Webseiten-Projekt unter C:\Projekte\webseiten aufsetzen: Scaffolding-Befehl, verbindliche Ordnerstruktur und die projekteigene CLAUDE.md. Nutze diesen Skill beim Anlegen eines neuen Projekts oder wenn die Ordnerstruktur eines bestehenden Projekts geprueft werden soll.
---

<!-- ERZEUGT aus _fundament/skills-master/webseiten-neues-projekt/SKILL.md - nicht hier bearbeiten.
     Aenderungen gehoeren nach C:\Projekte\_fundament\skills-master\webseiten-neues-projekt\SKILL.md,
     danach: node C:\Projekte\_fundament\rules-verteilen.mjs -->

# Neues Webseiten-Projekt aufsetzen

Ausgelagert aus webseiten/CLAUDE.md am 2026-08-27. Der Inhalt wird nur noch
geladen, wenn er gebraucht wird, statt in jeder Session.

## 2. Scaffolding eines neuen Projekts

```bash
cd C:\Projekte\webseiten
npx create-next-app@latest PROJEKT --typescript --tailwind --app --src-dir --import-alias "@/*" --turbopack
cd PROJEKT
npx shadcn@latest init -d
npm install lucide-react framer-motion clsx tailwind-merge class-variance-authority
# Nur bei redaktionellen Projekten (Blog, News, MDX-Inhalte):
npm install gray-matter next-mdx-remote @next/mdx @mdx-js/loader @mdx-js/react
```

<!-- Entscheidung 2026-08-27: Dies ist der einzige gueltige Scaffolding-Befehl.
     Die Root-CLAUDE.md enthielt bis dahin eine zweite, abweichende Fassung, die
     die MDX-Pakete in JEDES Projekt installierte - auch in solche ohne Blog.
     Beide Fassungen wurden immer gemeinsam geladen, die Wahl war Zufall.
     Regel jetzt: Grundpakete immer, MDX-Pakete nur bei redaktionellen Projekten.
     HTML-Kommentare werden vor dem Laden entfernt und kosten keinen Kontext. -->

Danach:
1. `src/lib/constants.ts` anlegen (`SITE_NAME`, `SITE_URL`, `SITE_DESCRIPTION`)
2. `src/lib/structured-data.ts` für JSON-LD Generatoren
3. `src/app/globals.css` mit `@theme` + CSS-Variablen für das Farbsystem
4. `src/app/layout.tsx` mit Inter-Font, Metadata-Template, Skip-Link, JSON-LD
5. `src/app/sitemap.ts` + `src/app/robots.ts`
6. `src/app/not-found.tsx` (Next 16 Pflicht)
7. Projekt-eigene `CLAUDE.md` anlegen (Projekt-Kontext)

---

---

## 3. Ordnerstruktur (verbindlich)

```
projekt/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root-Layout + Font + Metadata-Template + JSON-LD
│   │   ├── page.tsx            # Startseite (ruft sections/* auf)
│   │   ├── globals.css         # Tailwind 4 Import + @theme + shadcn CSS-Vars
│   │   ├── not-found.tsx       # 404-Seite (Pflicht in Next 16)
│   │   ├── robots.ts           # robots.txt Generator
│   │   ├── sitemap.ts          # sitemap.xml Generator
│   │   ├── impressum/page.tsx  # DSGVO-Pflicht
│   │   ├── datenschutz/page.tsx # DSGVO-Pflicht
│   │   └── [weitere Routen]/   # news/, athleten/, blog/, etc.
│   ├── components/
│   │   ├── ui/                 # shadcn Primitives (Button, Card, Tabs, …)
│   │   └── sections/           # Seitenspezifische Sections (Hero, Features, FAQ)
│   └── lib/
│       ├── utils.ts            # cn() Helper (clsx + twMerge)
│       ├── constants.ts        # SITE_NAME, SITE_URL, SITE_DESCRIPTION
│       ├── structured-data.ts  # JSON-LD Schemas (Organization, WebSite, FAQ, Article)
│       ├── data.ts             # Statische TypeScript-Konstanten (NUR nicht-redaktionell)
│       └── [weitere Domain-Logik]
├── content/                    # NUR falls redaktionell: MDX-Dateien
│   ├── news/
│   ├── analysen/
│   └── [weitere Kategorien]/
├── public/
│   ├── images/                 # Optimierte WebP/AVIF Bilder
│   └── favicon.ico
├── CLAUDE.md                   # Projekt-Kontext
├── README.md
├── components.json             # shadcn Konfig
├── next.config.ts              # TypeScript-Konfig
├── postcss.config.mjs          # { "@tailwindcss/postcss": {} }
├── tsconfig.json               # strict + paths "@/*": ["./src/*"]
└── package.json
```

**Namenskonvention:**
- Dateien: `kebab-case.tsx` (z.B. `site-header.tsx`, `verdienst-finder.tsx`)
- Komponenten-Exporte: `PascalCase` (`SiteHeader`, `VerdienstFinder`)
- Funktionen/Variablen: `camelCase`
- Konstanten: `SCREAMING_SNAKE_CASE` (nur globale Invarianten)

---

---

## 14. Projekt-spezifische CLAUDE.md

Jedes Projekt unter `webseiten/` hat **zusätzlich** eine eigene `CLAUDE.md` im
Projekt-Root mit:

- Projektname + Zweck + Zielgruppe
- Betreiber-Daten (meistens: Norbert Sommer / Invilus, Heidelberg)
- Besonderheiten / Abweichungen vom Standard
- Farbsystem des Projekts
- Wichtige Dateien
- Go-Live-Status
- Bekannte Fallstricke

Diese projektbezogene CLAUDE.md ergänzt diese hier – sie ersetzt sie nicht.

---
