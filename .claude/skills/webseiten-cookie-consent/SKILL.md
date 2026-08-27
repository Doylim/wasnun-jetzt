---
name: webseiten-cookie-consent
description: Cookie-Banner und Consent-Management fuer Webseiten-Projekte: Pflichtanforderungen, Referenz-Implementation und was beim Uebernehmen in ein neues Projekt angepasst werden muss. Nutze diesen Skill bei Cookie-Banner, Consent, Tracking-Einwilligung oder DSGVO-Bannerfragen.
---

<!-- ERZEUGT aus _fundament/skills-master/webseiten-cookie-consent/SKILL.md - nicht hier bearbeiten.
     Aenderungen gehoeren nach C:\Projekte\_fundament\skills-master\webseiten-cookie-consent\SKILL.md,
     danach: node C:\Projekte\_fundament\rules-verteilen.mjs -->

# Cookie-Banner und Consent

Ausgelagert aus webseiten/CLAUDE.md am 2026-08-27. Der Inhalt wird nur noch
geladen, wenn er gebraucht wird, statt in jeder Session.

## 7a. Cookie-Banner & Consent (Pflicht bei jedem Projekt)

**Jedes Webseiten-Projekt braucht einen DSGVO-konformen Cookie-Banner –
auch dann, wenn (noch) kein Tracking eingebaut ist.** Grund: Sobald später
Analyse- oder Marketing-Dienste dazukommen (Plausible, Vercel Analytics,
Meta Pixel, externe iframes, YouTube-Embeds, Google Fonts als CDN, …),
ist die Consent-Architektur bereits da und muss nicht mehr nachträglich
durchs ganze Projekt gezogen werden.

### Pflicht-Anforderungen

1. **Drei Kategorien** – immer, auch wenn manche aktuell ungenutzt sind:
   - `necessary` – immer aktiv, keine Einwilligung nötig
   - `analytics` – anonyme Reichweitenmessung (Plausible, Vercel Analytics, …)
   - `marketing` – externe Inhalte (iframes, YouTube, Meta Pixel, Remarketing, …)
2. **„Alle akzeptieren" und „Nur notwendige" müssen visuell gleichwertig sein**
   (gleiche Größe, gleiche Prominenz). Kein Dark-Pattern.
3. **Drei Hauptbuttons** im Banner: `Nur notwendige` · `Einstellungen` · `Alle akzeptieren`.
   Der Einstellungen-Button klappt ein Detail-Panel mit Checkboxen auf und
   wird dort durch `Auswahl speichern` ersetzt.
4. **Im Design der jeweiligen Webseite** umsetzen – gleiche Farb-Variablen,
   gleiche Radien, gleiche Schrift. Kein fremdes Template, keine Cookiebot-/
   Usercentrics-Einbettung, solange wir es selbst abbilden können.
5. **Storage** in `localStorage` unter Projekt-spezifischem Key
   (z. B. `seivio-consent-v2`, `eg-consent-v1`). JSON-Shape mit
   `{ analytics: bool, marketing: bool, ts: number }`.
   Key-Version hochziehen, wenn sich das Schema ändert.
6. **Widerruf jederzeit möglich** über:
   - Footer-Link „Cookie-Einstellungen"
   - Eine Sektion auf `/datenschutz` mit Live-Status + Toggles
7. **Keine Tracker vor Consent laden.** Scripts erst mounten, wenn
   `useConsent().categories.analytics === true` bzw. `.marketing === true`.
   Für iframes/Embeds Placeholder anzeigen, iframe-Tag erst nach Consent
   rendern.
8. **Datenschutzerklärung passt dazu** – Kategorien erklären, Storage-Key
   benennen, pro Dienst die Kategorie nennen, Rechtsgrundlage
   § 25 Abs. 1 TDDDG + Art. 6 Abs. 1 lit. a DSGVO für Analyse/Marketing,
   § 25 Abs. 2 Nr. 2 TDDDG + Art. 6 Abs. 1 lit. f DSGVO für Notwendig.

### Referenz-Implementation

- `C:\Projekte\webseiten\seivio` – aktuelle Vorlage (mit Logo-Submark im Header)
  - `src/lib/consent.tsx` – Context mit granularer API
    (`categories`, `decision`, `acceptAll`, `rejectAll`, `save`, `reset`)
  - `src/components/cookie-banner.tsx` – Banner mit Logo, Pill-Badge,
    Detail-Panel und Bottom-Sheet-Layout auf Mobile
  - `src/components/cookie-settings-button.tsx` – Footer-Link + Karten-Ansicht
    für `/datenschutz` (re-importiert `ToggleSwitch` aus dem Banner)
  - `src/app/datenschutz/page.tsx` Sektionen 2, 10, 11 – Kategorien-Doku
  - `public/brand/logo-submark.svg` – das Logo, das der Banner-Header laedt
- `C:\Projekte\webseiten\enhanced-games\src\components\cookie-banner.tsx` –
  aeltere kompaktere Variante (kann auf das neue Layout angehoben werden)

### Was beim Uebernehmen in ein neues Projekt angepasst werden muss

Strukturell ist das Banner portabel. Pro Projekt nur diese 5 Punkte:

1. **CSS-Variablen** in `globals.css`: `--brand`, `--brand-hover`, `--brand-soft`
   – das Banner zieht alle Akzente (Pill-Dot, Toggle-Aktiv, Brand-Glow,
   Akzeptieren-Button) automatisch aus diesen Variablen.
2. **Storage-Key** in `src/lib/consent.tsx`: `seivio-consent-v2` →
   `<projekt>-consent-v1`. Bei Schema-Aenderungen Version hochziehen.
3. **`SITE_NAME`** in `src/lib/constants.ts` – das Banner liest ihn
   fuer das `alt`-Attribut des Logos.
4. **Logo-Submark** unter `public/brand/logo-submark.svg` ablegen.
   Format: quadratisch, vorzugsweise mit eingebetteter Hintergrundflaeche
   (kein transparenter Hintergrund, sonst wirkt es im weissen Banner verloren).
   Der Banner laedt diesen festen Pfad – nur die Datei austauschen.
5. **Texte** im Banner-Body und in den Kategorie-Beschreibungen
   (vor allem die Erklaerung zum Marketing-Cookie verweist aktuell auf
   die Referenzen-Sektion mit `fight-evolution.de` – das ist seivio-spezifisch).

Farben, Layout, Animationen, Toggles, Mobile-Bottom-Sheet und alle Buttons
bleiben unveraendert. Nicht komplett neu bauen.

---
