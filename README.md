# WasNun.jetzt

Kostenloser Sofort-Helfer für arbeitslose Menschen in Deutschland.

## Lokaler Start

```bash
# 1. In den Projektordner wechseln
cd C:\Projekte\webseiten\wasnun-jetzt

# 2. Abhängigkeiten installieren
npm install

# 3. Entwicklungsserver starten
npm run dev

# 4. Browser öffnen
# http://localhost:3000
```

## Auf Vercel deployen

1. Projekt auf GitHub pushen:
```bash
git init
git add .
git commit -m "feat: Initialer Commit WasNun.jetzt"
git remote add origin https://github.com/DEIN-USERNAME/wasnun-jetzt.git
git push -u origin main
```

2. Auf vercel.com einloggen → "New Project" → GitHub-Repo auswählen → Deploy

## Inhalte anpassen

**Rechtsgrundlagen (z.B. bei Gesetzesänderungen):**
→ `lib/data.ts` → LEGAL-Objekt

**Plan-Karten (neue Verdienstmöglichkeiten):**
→ `lib/data.ts` → PLAN_KARTEN

**Impressum / Kontakt:**
→ `lib/data.ts` → IMPRESSUM

## Go-Live Checkliste

- [ ] `robots.txt` in `public/` öffnen (Disallow entfernen)
- [ ] `app/layout.tsx` → robots auf `{ index: true, follow: true }` setzen
- [ ] Domain in Vercel hinterlegen
- [ ] Impressum prüfen
- [ ] Datenschutz prüfen
- [ ] Auf Mobilgerät testen

## Projektstruktur

```
wasnun-jetzt/
├── app/
│   ├── layout.tsx          # Root-Layout + Metadaten
│   ├── page.tsx            # Startseite
│   ├── globals.css         # Globale Styles + Dark Mode
│   ├── impressum/page.tsx  # Impressum (DSGVO-Pflicht)
│   └── datenschutz/page.tsx
├── components/
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── Rechner.tsx         # ALG I + Bürgergeld Rechner
│   ├── SkillsCheck.tsx     # 5-Fragen-Flow
│   └── Footer.tsx
├── lib/
│   ├── data.ts             # Alle Inhalte & Rechtskonstanten
│   └── calc.ts             # Berechnungslogik
├── public/
│   └── robots.txt
├── CLAUDE.md               # Kontext für Claude Code
└── package.json
```
