# Wo wir stehen — wasnun-jetzt

**Stand: 19.04.2026**
**Branch: `main`**

---

## Aktueller Zustand

- Site ist **stabil und statisch**: Rechner + Plan auf einer Seite (kein Newsletter mehr)
- Newsletter-Feature wurde am 19.04. komplett entfernt (Commit `0aed4fdd`, -971 Zeilen)
- Brevo-ENV-Vars in Vercel sind ungenutzt, bleiben aber stehen (tote Konfig stehen lassen)
- Tests gruen, Build sauber, HTTP 200 lokal + Production

---

## Offen fuer naechste Session

### 1. Domain-Entscheidung (BLOCKER fuer Go-Live)

Zwei Optionen:
- **A)** `wasnun.jetzt` kaufen (z.B. via INWX oder Hetzner) → DNS auf Vercel
  zeigen → in `src/lib/constants.ts` `SITE_URL` umstellen
- **B)** `wasnun-jetzt.vercel.app` als finale URL akzeptieren → kein DNS-Setup,
  aber weniger praegnant

Sobald die Entscheidung steht, ist Go-Live ~5 Min Arbeit.

### 2. Go-Live (sobald Domain klar)

```
src/app/robots.ts        → goLive = true
src/app/layout.tsx       → robots: { index: true, follow: true }
```

Dann `git push`. Vercel deployed automatisch. Search Console eintragen.

### 3. Affiliate-Links (separate Session)

- Partner-Programme registrieren (Zenjob, Coople, Clickworker, WG-Gesucht, Academy of Sports)
- Links in `src/lib/partner.ts` eintragen, Status `geplant` → `aktiv`
- Datenschutz-Erklaerung um Affiliate-Hinweis ergaenzen

---

## Wichtige Files

- `src/lib/constants.ts` — `SITE_URL` (aktuell `wasnun-jetzt.vercel.app`)
- `src/app/robots.ts` — `goLive`-Flag
- `src/app/layout.tsx` — robots-metadata
- `src/lib/data.ts` — Rechtskonstanten (bei Gesetzesaenderungen anpassen)
- `src/components/sections/journey.tsx` — Orchestrator fuer Stufen-Treppe + Plan

---

## Hinweis fuer Claude

Lies vorher das Session-Protokoll vom 19.04.:
`C:\Projekte\_fundament\protokolle\2026-04-19-wasnun-jetzt-newsletter-removal.md`

Darin steht warum der Newsletter raus ist und welche externen Setup-Luecken
das Feature blockiert haben.
