# Wo wir stehen — wasnun-jetzt Journey-Umbau + Mail-Fixes

**Stand: 17.04.2026 (nachmittags)**
**Aktueller Branch: `feat/journey-stufen-treppe`**

---

## Letzte Session (heute Vormittag–Nachmittag)

### Was fertig ist (bereits auf `main` deployed)

- **Plan-Mail-Flow komplett funktional** (Brevo eingerichtet, DSGVO-konformes Doppel-Opt-in läuft E2E grün)
  - Bestätigungs-Mail → Button-Klick → Plan-Mail mit personalisierten Zahlen
  - Brevo-Kontakt wird mit allen 4 Custom-Attributen angelegt (`ALG_I_BETRAG`, `STUNDEN_WOCHE`, `PAUSCHALEN`, `GESAMT_FREIBETRAG`)
  - Confirm-Route nutzt Path-Parameter statt Query (wegen Brevo-Click-Tracking)
  - Brevo-Sender aus Env-Vars gelesen (`office@doylim.com` aktuell)
- **Mail-Desktop-Rendering verbessert** (VML-Button + Shadow + Zentrierung)
  - Bestätigungs-Mail: Tabellen-Button mit `bgcolor`, VML-`<v:roundrect>`-Fallback, Badge, Text-Link-Fallback
  - Plan-Mail: Karte mittig + Shadow
  - **Norbert-Feedback:** Plan-Mail auf Desktop ok, Bestätigungs-Mail „immer noch kacke" — letzter Fix (`027387f7`) nicht nochmal getestet, weil wir ins UX-Brainstorming gewechselt sind
- **Feature-Branch `feat/wasnun-journey` gemerged** (alt, weg)
- **Main mit Production-Deploy synchron** — `wasnun-jetzt.vercel.app` zeigt den neuen Stand

### Was noch läuft (auf dem aktuellen Feature-Branch)

- **UX-Umbau Journey — Stufen-Treppe + Selbst-Check**
  - **Spec**: `docs/superpowers/specs/2026-04-17-journey-stufen-treppe-design.md` (final, commited)
  - **Plan**: `docs/superpowers/plans/2026-04-17-journey-stufen-treppe.md` (10 Tasks, commited)
  - **Designentscheidung**: Option B (mittel) + Stufen-Treppe mit Checkboxen; Ziel: ehrlicher Default +165 EUR, ALG-I + Vorname wandern ins Newsletter-Form
  - **Ausführungsmodus**: Subagent-Driven Development (fresh Subagent pro Task + 2-Stage-Review)

### Task-Stand (10 Tasks gesamt)

| # | Task                                                      | Status         |
|---|-----------------------------------------------------------|----------------|
| 1 | `journey.ts` aufräumen (stunden/warnung15Stunden raus)    | **committed** (Implementer done, Review noch offen) |
| 2 | `plan-mail.ts` Vornamen-Begrüßung + statische Warnbox     | offen          |
| 3 | Token-Payload `vorname` optional                          | offen          |
| 4 | Neue `StufenTreppe`-Komponente                            | offen          |
| 5 | `journey.tsx` umstellen                                   | offen          |
| 6 | Alte Komponenten löschen (journey-input/total/card/warnung) | offen        |
| 7 | `NewsletterForm` erweitern (Vorname + ALG-I)              | offen          |
| 8 | API POST: Vorname optional                                | offen          |
| 9 | Confirm-Route: VORNAME + ALG_I_BETRAG in Brevo            | offen          |
| 10| Lokaler E2E-Check + Push                                  | offen          |

### Wichtig für Task 1 Reviewer:

- Task 1 Implementer hat Code-Änderung gemacht + getestet (10/10 Tests grün) + committed (`5f5eea44`).
- **Build ist aber rot** — `src/components/sections/journey-total.tsx:16` referenziert noch `plan.warnung15Stunden`. Das ist **erwartet** (laut Plan wird diese Datei in Task 6 komplett gelöscht), aber bis Task 6 durch ist, scheitern Builds.
- Für den Subagent-Flow: **Die Review-Subagents müssen wissen, dass der Build scheitert** und das akzeptabel ist bis zum Task-6-Abschluss.

---

## Was noch OFFEN ist aus den vorherigen Arbeiten

### Bestätigungs-Mail Desktop-Design

Letzter Commit auf `main`: `027387f7 fix: Bestätigungs-Mail bulletproofer`. Norbert hat das noch nicht gegengeprüft — der Test wurde abgebrochen, weil wir ins Brainstorming gewechselt sind. **Bei Gelegenheit nochmal eine Test-Mail anfordern auf der Production-URL.**

### Teil 2 — Monetarisierung / Affiliate-Links (separate Session)

- **Partner-Programme registrieren** (Zenjob, Coople, Clickworker, WG-Gesucht, Academy of Sports)
- Links in `src/lib/partner.ts` eintragen, Status `geplant` → `aktiv`
- Plan-Mail-Schritte um Affiliate-Links erweitern
- Partner-Section auf der Startseite
- Datenschutz-Erklärung um Affiliate-Hinweis ergänzen

### DNS-Verifikation für `noreply@wasnun-jetzt.de`

- Aktuell Absender: `office@doylim.com` (verifiziert)
- Ziel: `noreply@wasnun-jetzt.de` (erfordert SPF/DKIM/DMARC bei DNS-Provider)
- Brevo-Setup: Senders → Add Domain → SPF/DKIM/DMARC aus Brevo ablesen und bei DNS-Provider eintragen

---

## So machst du weiter

### Wenn du mit Claude weitermachst

Sag einfach:

> „Lass uns bei wasnun-jetzt weitermachen — Journey-Umbau Tasks 2–10."

Claude soll:
1. Diese `WEITERMACHEN.md` lesen
2. Plan lesen: `docs/superpowers/plans/2026-04-17-journey-stufen-treppe.md`
3. Spec lesen: `docs/superpowers/specs/2026-04-17-journey-stufen-treppe-design.md`
4. Mit Task 2 weitermachen (Task 1 ist committed, Review optional nachholen oder skippen)
5. Ausführung via `superpowers:subagent-driven-development` fortsetzen

### Wenn Claude selbständig weitermachen soll

Die TaskList (`TaskList` Tool) hat alle 10 Tasks mit Status. Claude soll:
- Task 1: als `completed` markieren (Commit ist durch)
- Task 2: `in_progress` setzen, Implementer-Subagent dispatchen

---

## Branch-Situation

```
main                          → Production-Deploy (mit Plan-Mail-Flow + Desktop-Mail-Fixes)
  └─ feat/journey-stufen-treppe   → HIER, Task 1 committed (5f5eea44)
```

Alles lokal, NICHT gepusht. Bei Weitermachen: ggf. mit `git push -u origin feat/journey-stufen-treppe` pushen.

---

## Dateien, die dir beim Einstieg helfen

- `docs/superpowers/plans/2026-04-17-journey-stufen-treppe.md` — Plan mit allen 10 Tasks
- `docs/superpowers/specs/2026-04-17-journey-stufen-treppe-design.md` — Design-Spec
- `WEITERMACHEN.md` (diese Datei) — Stand + Einstieg
- `.superpowers/brainstorm/791-1776417378/content/treppe-mit-check.html` — Visual-Mockup (als Referenz)

Viel Erfolg beim Weitermachen!
