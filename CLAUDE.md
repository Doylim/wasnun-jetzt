# CLAUDE.md – WasNun.jetzt

## Projekt-Übersicht
- **Name:** WasNun.jetzt
- **Zweck:** Kostenloser Sofort-Helfer für arbeitslose Menschen in Deutschland
- **Betreiber:** Norbert Sommer / Invilus
- **Lokaler Pfad:** `C:\Projekte\webseiten\wasnun-jetzt\`
- **Vercel-URL:** wasnun-jetzt.vercel.app (später: wasnun.jetzt)

## Stack (aktualisiert April 2026)
- Next.js 16 (App Router, Turbopack)
- React 19
- TypeScript strict
- Tailwind CSS 4 mit `@theme` in CSS
- shadcn/ui (new-york Style)
- lucide-react Icons
- Struktur: `src/app`, `src/components/ui`, `src/components/sections`, `src/lib`
- Kein Backend, kein CMS, kein Auth – alle Daten als TypeScript-Konstanten

## Grundregeln
1. Immer Deutsch
2. Umlaute immer korrekt (ae, oe, ue nur wenn Datei bewusst ohne UTF-8)
3. Mobile-first (breakpoints: md, lg)
4. Keine unnötigen neuen Dateien
5. Git nach jeder wichtigen Änderung: `git add . && git commit -m "typ: Beschreibung"`
6. Max. 2 Rückfragen pro Problem

## Wichtige Dateien
- `src/lib/data.ts` – alle Rechtskonstanten, Kategorien, Plan-Karten (bei Gesetzesänderungen HIER anpassen)
- `src/lib/calc.ts` – Berechnungslogik ALG I + Bürgergeld
- `src/lib/partner.ts` – Affiliate-Partner (Tier 1–3, Status aktiv/geplant)
- `src/lib/structured-data.ts` – JSON-LD Schema-Generatoren
- `src/components/sections/rechner.tsx` – Freibetrag-Rechner mit Balken
- `src/components/sections/verdienst-finder.tsx` – 2-Fragen Entscheidungsbaum
- `src/components/sections/faq.tsx` – FAQ mit FAQPage-Schema

## Farbsystem (Navy / Teal / Amber / Cream)
Definiert in `src/app/globals.css` im `@theme`-Block:
- **navy-800 (#0f1f3d)** – Primaer, Headlines
- **teal-500 (#00b89f)** – Akzent, CTAs, positive Werte
- **amber-brand (#f5a623)** – Warnungen, Anrechnungen
- **cream (#faf8f4)** – Alternative Hintergruende

## Monetarisierung
Affiliate-Partner werden nur angezeigt wenn `status: "aktiv"` in `src/lib/partner.ts`.
Aktuell sind alle auf `"geplant"` – erst echte Partner-Programme registrieren, dann umschalten.
Jeder Affiliate-Link wird mit `rel="sponsored noopener noreferrer"` und einer
sichtbaren "Werbung"-Kennzeichnung ausgeliefert.

## Go-Live Checkliste
- [ ] `src/app/robots.ts` → `goLive = true` setzen
- [ ] `src/app/layout.tsx` → `robots: { index: true, follow: true }` setzen
- [ ] Domain in Vercel hinterlegen
- [ ] Partner-Accounts registrieren + in `partner.ts` auf `"aktiv"` schalten
- [ ] FAQ auf aktuelle Gesetzeslage prüfen
- [ ] Impressum + Datenschutz final durchlesen
- [ ] Mobile testen

## Bekannte Fallstricke
- Hydration Mismatch: dynamische Werte erst im `useEffect` setzen
- Tailwind 4: Farben im `@theme` statt in `tailwind.config.js`
- Vercel-Cache: `force-dynamic` falls nötig
