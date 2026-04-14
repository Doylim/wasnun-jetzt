# WasNun.jetzt

Kostenloser Sofort-Helfer fuer arbeitslose Menschen in Deutschland.

## Stack

- Next.js 16 (App Router, Turbopack)
- React 19 + TypeScript strict
- Tailwind CSS 4 + shadcn/ui + lucide-react

## Lokaler Start

```bash
cd C:\Projekte\webseiten\wasnun-jetzt
npm install
npm run dev
```

App laeuft auf http://localhost:3000

## Projektstruktur

```
wasnun-jetzt/
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Root-Layout + Inter Font + JSON-LD
│   │   ├── page.tsx              # Startseite
│   │   ├── globals.css           # Tailwind 4 + Theme-Tokens
│   │   ├── robots.ts
│   │   ├── sitemap.ts
│   │   ├── impressum/page.tsx
│   │   └── datenschutz/page.tsx
│   ├── components/
│   │   ├── ui/                   # shadcn Primitives (Button, Card, Tabs…)
│   │   └── sections/             # Seitensektionen (Hero, Rechner, FAQ…)
│   └── lib/
│       ├── data.ts               # Rechtskonstanten + Kategorien + Plan-Karten
│       ├── calc.ts               # ALG I / Buergergeld Berechnung
│       ├── partner.ts            # Affiliate-Partner Tier 1–3
│       ├── structured-data.ts    # JSON-LD Generatoren
│       ├── constants.ts          # SITE_NAME, SITE_URL
│       └── utils.ts              # cn() Helper
├── public/
├── CLAUDE.md
└── package.json
```

## Inhalte anpassen

- **Rechtsgrundlagen:** `src/lib/data.ts` → `LEGAL`-Objekt
- **Kategorien/Plan-Karten:** `src/lib/data.ts` → `KATEGORIEN`, `PLAN_KARTEN`
- **FAQ:** `src/components/sections/faq.tsx`
- **Affiliate-Partner:** `src/lib/partner.ts` (Status `"geplant"` → `"aktiv"` schalten)
- **Impressum:** `src/lib/data.ts` → `IMPRESSUM`

## Go-Live Checkliste

- [ ] `src/app/robots.ts` → `goLive = true`
- [ ] `src/app/layout.tsx` → `robots: { index: true, follow: true }`
- [ ] Domain in Vercel hinterlegen
- [ ] Partner-Accounts aktivieren
- [ ] Mobile + Desktop testen
