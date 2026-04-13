# CLAUDE.md – WasNun.jetzt

## Projekt-Übersicht
- **Name:** WasNun.jetzt
- **Zweck:** Kostenloser Sofort-Helfer für arbeitslose Menschen in Deutschland
- **Betreiber:** Norbert Sommer / Invilus
- **Lokaler Pfad:** `C:\Projekte\webseiten\wasnun-jetzt\`
- **Vercel-URL:** wasnun-jetzt.vercel.app (später: wasnun.jetzt)

## Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Kein Backend, kein CMS, kein Auth

## Grundregeln (aus WISSENSBASIS-NORBERT.md)
1. Immer Deutsch
2. Tailwind CSS bevorzugen
3. Mobile-first
4. Umlaute immer korrekt (ä, ö, ü, ß) – niemals ae/oe/ue
5. Keine unnötigen neuen Dateien
6. Git nach jeder wichtigen Änderung: `git add . && git commit -m "typ: Beschreibung"`
7. Keine F12/DevTools-Anweisungen an Norbert
8. Max. 2 Rückfragen pro Problem

## Wichtige Dateien
- `lib/data.ts` – alle Inhalte, Rechtsgrundlagen, Plan-Karten (hier zuerst anpassen)
- `lib/calc.ts` – Berechnungslogik ALG I + Bürgergeld
- `components/Rechner.tsx` – Freibetrag-Rechner
- `components/SkillsCheck.tsx` – 5-Fragen-Flow + Ergebnis-Plan

## Rechtliche Pflicht
- Alle Rechenwerte basieren auf SGB II / SGB III
- Bei Gesetzesänderungen: `lib/data.ts` → LEGAL-Objekt anpassen
- Disclaimer immer sichtbar halten
- Impressum + Datenschutz sind DSGVO-Pflicht

## Farben
- Navy: #0f1f3d
- Teal: #00b89f
- Amber: #f5a623
- Cream: #faf8f4

## Bekannte Fallstricke
- Hydration Mismatch: dynamische Werte erst im useEffect setzen
- Vercel-Cache: force-dynamic falls nötig
- Tailwind globale @apply können Layout brechen
