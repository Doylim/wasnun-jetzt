---
paths:
  - "content/**"
  - "src/lib/data.ts"
  - "**/*.mdx"
---

<!-- ERZEUGT aus _fundament/rules/webseiten-content.md - nicht hier bearbeiten.
     Aenderungen gehoeren in C:\Projekte\_fundament\rules\webseiten-content.md,
     danach: node C:\Projekte\_fundament\rules-verteilen.mjs -->

# Content-Strategie und Monetarisierung

Diese Regeln laden nur, wenn Claude eine passende Datei anfasst - sie standen
bis 2026-08-27 in webseiten/CLAUDE.md und wurden dadurch in jeder Session
mitgeladen, auch wenn gar keine Oberflaeche gebaut wurde.

## 8. Content-Strategie

### Wann `src/lib/data.ts`?

Für **statische, nicht-redaktionelle** Daten:
- Rechts-/Gesetzeskonstanten (z.B. `LEGAL = { ... }`)
- Produktlisten mit fester Struktur
- Feature-Flags, Navigations-Items, FAQ-Items
- Typ-Definitionen für Domain-Objekte

### Wann MDX in `content/`?

Für **redaktionelle Inhalte**:
- News, Blogposts, Artikel
- Analysen, Berichte
- Athleten-Profile, Portraits
- Alles was regelmäßig ergänzt wird ohne Code-Change

Parser via `gray-matter` für Frontmatter + `next-mdx-remote` für Rendering.
Referenz: `enhanced-games` nutzt dieses Pattern.

### Frontmatter-Template

```yaml
---
title: "Titel des Artikels"
slug: "titel-des-artikels"
date: "2026-04-14"
author: "Norbert Sommer"
tags: ["tag1", "tag2"]
seoTitle: "SEO-optimierter Titel"
description: "Meta-Description max 160 Zeichen"
coverImage: "/images/cover.webp"
readTime: 5
---
```

---

---

## 9. Monetarisierung / Affiliate-Layer

Wenn ein Projekt monetarisiert wird:

1. **Separates Modul:** `src/lib/partner.ts` mit Typen und Partner-Liste
2. **Status-Flag:** Jeder Partner hat `status: "aktiv" | "geplant"` – nur `aktiv` wird angezeigt
3. **Werbe-Kennzeichnung:** Sichtbare Badge `"Werbung"` neben jedem Affiliate-Block (§ 6 TMG)
4. **Link-Attribute:** `rel="sponsored noopener noreferrer"` und `target="_blank"`
5. **Trennung Info/Kommerz:** Rechtliche/redaktionelle Informationen dürfen nicht von Provisionen beeinflusst werden
6. **Datenschutz-Erklärung:** Affiliate-Hinweis in `src/app/datenschutz/page.tsx` erwähnen

Referenz-Implementation: `wasnun-jetzt/src/lib/partner.ts`.

---
