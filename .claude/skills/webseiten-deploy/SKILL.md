---
name: webseiten-deploy
description: Git-Workflow, Hosting und Deploy ueber GitHub und Vercel, Performance-Vorgaben und die Go-Live-Checkliste fuer Webseiten-Projekte. Nutze diesen Skill beim Deployen, beim Einrichten eines neuen Repos oder Vercel-Projekts und vor jedem Go-Live.
---

<!-- ERZEUGT aus _fundament/skills-master/webseiten-deploy/SKILL.md - nicht hier bearbeiten.
     Aenderungen gehoeren nach C:\Projekte\_fundament\skills-master\webseiten-deploy\SKILL.md,
     danach: node C:\Projekte\_fundament\rules-verteilen.mjs -->

# Deploy, Hosting und Go-Live

Ausgelagert aus webseiten/CLAUDE.md am 2026-08-27. Der Inhalt wird nur noch
geladen, wenn er gebraucht wird, statt in jeder Session.

Der allgemeine Git-Workflow (Commit-Praefixe, .gitignore) steht weiterhin in
webseiten/CLAUDE.md — hier geht es um Hosting, Deploy und Go-Live.

## 11a. Hosting & Deploy (Pflicht-Workflow)

**Goldene Regel:** Jedes Webseiten-Projekt geht über GitHub auf Vercel.
Niemals direkt via `vercel deploy` aus der lokalen Umgebung pushen – das
umgeht die Versions-Historie und macht Rollbacks unmöglich.

### Der Standard-Fluss

```
Lokale Änderung
   ↓ git commit
   ↓ git push
GitHub (master/main)
   ↓ automatisch via Vercel GitHub-Integration
Vercel Production
```

Zusätzlich für Features:

```
Feature-Branch → git push → GitHub → Vercel Preview-URL (automatisch)
```

### Warum GitHub als Zwischenebene Pflicht ist

- **Rückschau:** Jede Änderung ist in der Commit-History nachvollziehbar
- **Rollback:** `git revert` oder Vercel-Dashboard-Rollback jederzeit möglich
- **Preview-Deploys:** Jeder Feature-Branch bekommt eine eigene URL zum Teilen/Testen
- **Zusammenarbeit:** PR-Reviews, Issues, Diskussionen an einem Ort
- **Backup:** GitHub ist die Source of Truth, nicht die lokale Festplatte
- **Kein CLI-Chaos:** `vercel deploy` kann zu divergenten States führen, wenn
  lokale Änderungen nicht committed sind

### Setup bei neuen Projekten (Reihenfolge ist wichtig)

```bash
# 1. Lokal initialisieren (nach dem Scaffolding)
cd C:\Projekte\webseiten\PROJEKT
git init
git add .
git commit -m "feat: initiales Scaffolding"

# 2. GitHub-Repo erzeugen + pushen (gh CLI)
gh repo create PROJEKT --private --source . --push

# 3. Vercel-Projekt mit GitHub-Repo verknüpfen
# Im Vercel-Dashboard: "Add New Project" → Import from GitHub → PROJEKT auswählen
# Framework wird automatisch erkannt (Next.js)
# Settings:
#   - Production Branch: master oder main (je nach Repo-Default)
#   - Install Command: npm install
#   - Build Command: npm run build
#   - Output: .next
```

Ab jetzt pushen die Deploys automatisch bei jedem `git push`.

### Wenn ein Projekt schon existiert und der Workflow fehlt

Das Setup nachträglich:

```bash
cd C:\Projekte\webseiten\PROJEKT
gh repo create PROJEKT --private --source . --push
```

Danach im Vercel-Dashboard:
1. Project → Settings → Git → "Connect Git Repository"
2. GitHub-Repo auswählen
3. Production Branch festlegen
4. Save

Danach ist `vercel deploy` aus der CLI nicht mehr nötig.

### CLI-Deploy nur als Notfall

`vercel deploy --prod` ist nur zulässig wenn:
- GitHub/Vercel-Integration temporär kaputt ist
- Ein schneller Hotfix nötig ist und GitHub down
- Debugging des Deploys

In jedem anderen Fall: `git push`.

### .gitignore

Muss `.vercel` enthalten (das lokale Link-Verzeichnis), aber **nicht**
die `.github/` Ordner – Workflows können später dazukommen.

### Vercel-Hobby-Limits: Deployments kosten Speicher (Pflicht)

Alle Projekte teilen sich **ein** Hobby-Team. Jedes gespeicherte Deployment
belegt „Functions Storage" (10 GB frei, teamweit). Am 15.09.2026 war das
Limit voll: fight-evolution-web hielt 138 Deployments (6,8 GB), enhanced-games
packte 115 MB Bilder in jede Seiten-Funktion. Deshalb gilt für **jedes**
Vercel-Projekt:

1. **Ignored Build Step setzen.** Vorlage
   `_fundament/templates/vercel/vercel-build-noetig.sh` nach `scripts/`
   kopieren und in `vercel.json` eintragen:
   ```json
   "ignoreCommand": "bash scripts/vercel-build-noetig.sh protokolle docs"
   ```
   Überspringt Dependabot-Branches und Pushes, die seit dem letzten
   Deployment nur die genannten Pfade ändern. `'*.md'` nur ergänzen, wenn das
   Projekt zur Laufzeit garantiert keine `.md` liest (Content-Loader prüfen!).
2. **Dependabot-PRs in GitHub Actions prüfen** (`ci.yml` mit `tsc`, Tests,
   Build), nicht über Vercel-Vorschauen.
3. **Dateien, die per `process.cwd()` gelesen werden, ziehen beim Tracing
   gern das halbe Projekt mit.** Nach dem ersten Build die Größe prüfen:
   `.next/server/app/**/page.js.nft.json`. Liegt eine Seite über ~20 MB,
   `outputFileTracingExcludes` für `public/`, Testberichte und Doku setzen.
4. **Aufbewahrung kurz halten:** Team Settings → Security & Privacy →
   Deployment Retention Policy (Vorschau 3 Tage, Production 7 Tage,
   Abgebrochen/Fehler 1 Tag). Die letzten 20 Production-Deployments bleiben
   trotzdem für Rollbacks erhalten.
5. **Offene Pull-Requests nicht liegen lassen** — die neueste Vorschau jedes
   offenen PRs löscht Vercel nie.

Der Wartungslauf (`_fundament/projekt-check.mjs`) prüft Punkt 1 und 3.

---

---

## 12. Performance

- **Bilder:** Immer `next/image`, Format WebP/AVIF, `alt`-Text Pflicht
- **Fonts:** `next/font/google` mit `display: "swap"` + Subset
- **Icons:** Nur genutzte lucide-Icons importieren (Tree-Shaking)
- **Bundle-Größe:** Keine Libraries unter 20kb gzipped ohne Grund (framer-motion nur wenn wirklich nötig)
- **Dynamic Imports:** Für große Client-Komponenten unterhalb des Folds
- **Rendering:** Server-Komponenten bevorzugen, `"use client"` nur wenn nötig

---

---

## 13. Go-Live Checkliste (jedes Projekt)

- [ ] `src/app/robots.ts` → `goLive = true`
- [ ] `src/app/layout.tsx` → `robots: { index: true, follow: true }`
- [ ] Alle Umlaute korrekt (kein `ae/oe/ue` in Texten)
- [ ] Lighthouse-Audit: Performance, SEO, A11y, Best Practices jeweils > 90
- [ ] Mobile-Test auf echtem Geraet
- [ ] Alle Links funktional (intern + extern)
- [ ] Impressum + Datenschutz aktuell
- [ ] **Cookie-Banner (3 Kategorien, analysefähig, im Projekt-Design) aktiv** – siehe Abschnitt 7a
- [ ] Favicon + Social-OG-Bild vorhanden
- [ ] Sitemap erreichbar unter `/sitemap.xml`
- [ ] `/robots.txt` erlaubt Indexing
- [ ] GitHub-Repo verbunden und `git push` löst Deploy aus
- [ ] Custom Domain in Vercel hinterlegt + SSL aktiv
- [ ] Google Search Console eingerichtet
- [ ] Analytics (nur cookielos, z.B. Plausible oder Vercel Analytics)
- [ ] Affiliate-Partner auf `"aktiv"` umgestellt (wenn vorhanden)

---
