# Spec: Wasnun-jetzt UX-Umbau + personalisierte Plan-Mail

**Datum:** 2026-04-16
**Projekt:** `C:\Projekte\webseiten\wasnun-jetzt`
**Ziel:** Seite verständlicher machen (Antwort vor Details) und über personalisierten Mail-Plan eine Basis für Remarketing-Monetarisierung schaffen. Partner-Integration kommt in einem späteren Schritt.

## Kontext

Die Seite ist ein Rechner für ALG-I-Bezieher, der zeigt, wie viel zusätzliches Einkommen abzugsfrei ist (Grundfreibetrag + Übungsleiter- + Ehrenamtspauschale + passives Einkommen). Der Hero zeigt bereits „bis zu 520 EUR" prominent, aber die eigentliche Journey darunter ist dreistufig aufgebaut (Input → 4 Karten auswählen → Summary). Nutzer sehen das Ergebnis erst nach mehreren Klicks.

Status der Monetarisierung: In `src/lib/partner.ts` sind 13 Partner definiert, alle auf `status: "geplant"`. Es gibt aktuell keinen Revenue-Stream. Diese Spec bereitet die Monetarisierung vor, ohne sie selbst umzusetzen: Plan-Mail + Brevo-Kontaktliste sind die Voraussetzung für spätere Remarketing-Kampagnen.

## Ziele

1. **Verständlichkeit:** Nutzer sieht seinen Wert (Euro-Zahl) in unter 5 Sekunden — direkt nach ALG-I-Eingabe.
2. **Lead-Generierung:** E-Mail-Adresse wird mit konkreten Plan-Daten erfasst (Brevo-Custom-Attribute), DSGVO-konform per Doppel-Opt-in.
3. **Retention:** Persönliche Plan-Mail dient als referenzierbares Dokument, das Nutzer später wieder öffnen.

Nicht-Ziele (bewusst ausgeklammert):
- Keine Partner-Integration in dieser Iteration (eigene Spec später).
- Keine PDF-Generierung (HTML-Mail reicht, technisch robuster).
- Kein Authentifizierungssystem (anonyme Tools bleiben anonym).

## Abschnitt 1 — UX-Umbau Journey

### Ist-Zustand

`src/components/sections/journey.tsx` zeigt drei Sektionen mit „Schritt 1/2/3"-Badges:
1. Input (ALG I + Stunden)
2. Vier Pauschalen-Karten (default nur `grundfreibetrag` aktiv)
3. Summary mit großer Zahl + Schritten + Newsletter-Form

### Soll-Zustand

Einheitlicher Flow ohne Wizard-Badges. Struktur:

```
[Input: ALG I]
[Input: Stunden/Woche Slider]

── Ergebnis-Block (sichtbar sobald ALG I > 0) ──
  "+520 EUR abzugsfrei zu deinem ALG I"
  Kleintext: "Maximaler Freibetrag — passe ihn bei Bedarf an"
  Warnbox falls Stunden >= 15

[Button "An meine Situation anpassen"]
  ↓ (Details-Disclosure, default zu)
  ├─ Karte Grundfreibetrag (immer aktiv, kein Toggle)
  ├─ Karte Übungsleiter (default aktiv)
  ├─ Karte Ehrenamt (default aktiv)
  └─ Karte Passiv (default aktiv)

── Plan-Mail-Block ──
  (siehe Abschnitt 2)

── Umsetzungs-Schritte ──
  Nummerierte Liste (eine pro aktivierter Karte)

  Meldepflicht-Hinweis (wie bisher)
```

### Code-Änderungen

**`src/components/sections/journey.tsx`:**
- Drei „Schritt X von 3"-Badges entfernen.
- `aktivKarten`-Default auf alle vier IDs setzen: `new Set(["grundfreibetrag", "uebungsleiter", "ehrenamt", "passiv"])`.
- Neuer State `detailsOffen: boolean` (default `false`).
- Karten-Sektion in ein `<details>`-Element (native, kein JS nötig) oder per `detailsOffen`-State togglebar. Empfehlung: `<details>` nativ für beste Progressive Enhancement.
- Die bisherige `JourneySummary` aufteilen in `JourneyErgebnis` (die Zahl + Warnung, direkt unter Inputs) und `JourneyPlan` (die Schritte-Liste + Meldepflicht, weiter unten).

**`src/components/sections/journey-summary.tsx`:**
- Wird aufgeteilt in zwei klare Einheiten (und die Datei danach gelöscht):
  - **Ergebnis-Zahl + Warnbox** wandert in die bestehende `journey-total.tsx` (diese enthält bereits die Total-Anzeige, wird nur visuell aufgewertet: grössere Typo, zentrierter Kleintext darunter, Warnbox bei ≥15 h integriert).
  - **Umsetzungs-Schritte + Meldepflicht** wandert in eine neue Komponente `journey-plan.tsx`.

**`src/components/sections/journey-total.tsx`:**
- Bereits vorhanden und wird in `journey.tsx` direkt unter den Inputs aufgerufen. Visuell aufwerten: Zahl mit 48–60 px Grösse, Teal, `font-black`. Kleintext darunter: „Maximaler Freibetrag — passe ihn bei Bedarf an". Warnbox bei ≥15 h direkt hier rendern (vorher in `JourneySummary`).

**Akzeptanzkriterien:**
- Sobald ALG I > 0 eingegeben ist, sieht man die Euro-Zahl direkt unter den Inputs ohne Klick.
- Default: alle vier Pauschalen aktiv → Maximal-Zahl wird angezeigt.
- Klick auf „An meine Situation anpassen" öffnet Karten-Sektion, Abwählen einer Karte verringert die Zahl live.
- Mobile: Layout bleibt einspaltig, keine Horizontal-Scrollbar.

## Abschnitt 2 — Personalisierte Plan-Mail (Doppel-Opt-in)

### Architektur

```
Form-Submit auf Seite
  ↓
POST /api/newsletter
  - validiert E-Mail + Plan-Daten
  - erzeugt HMAC-signierten Token (Payload: email + Plan-Daten + Ablaufzeit)
  - sendet Brevo Confirm-Mail ("Klick zum Bestätigen und Plan erhalten")
  - Response: { ok: true } → Frontend zeigt "Check dein Postfach"

User klickt Confirm-Link in der Mail
  ↓
GET /api/newsletter/confirm?token=…
  - verifiziert Token (HMAC + Ablauf)
  - extrahiert Plan-Daten aus Payload
  - Brevo Contact anlegen/aktualisieren mit Custom-Attributen (ALG_I, PAUSCHALEN, GESAMT)
  - Brevo Plan-Mail senden (HTML mit konkreten Zahlen)
  - Redirect: /danke-plan-versendet
```

### Neue Dateien

**`src/lib/token.ts`** — HMAC-signierter Token, 1:1 aus `enhanced-games/src/lib/token.ts` adaptiert. Payload-Struktur:

```ts
type NewsletterTokenPayload = {
  email: string;
  algI: number;
  stunden: number;
  aktivKarten: string[];
  gesamtFreibetrag: number;
  exp: number; // ms-Timestamp
};
```

Token-Ablauf: **7 Tage**. HMAC-Secret: `TOKEN_SECRET` (Env).

**`src/lib/plan-mail.ts`** — generiert HTML der Plan-Mail. Input: `NewsletterTokenPayload` + aufgelöste Karten-Details aus `journey.ts`. Output: HTML-String.

Struktur des HTML (siehe Abschnitt 3 für Details):
- Header mit Datum
- Ergebnis-Zahl (gross, teal, zentriert)
- Tabellarische Zusammensetzung
- Warnbox Meldepflicht + 15-h-Regel
- Nummerierte Umsetzungs-Schritte (Texte aus der jetzigen `schrittText()`-Funktion)
- Footer mit Abmelde-Link + Rechtshinweis

**`src/app/api/newsletter/confirm/route.ts`** — GET-Route. Schritte:
1. Token aus Query-String holen, via `verifyToken()` prüfen.
2. Bei Fehler: HTML-Fehlerseite (Token ungültig/abgelaufen).
3. Brevo Contact upsert (`POST https://api.brevo.com/v3/contacts`) mit Listen-ID + Custom-Attributen.
4. Brevo Plan-Mail senden (`POST https://api.brevo.com/v3/smtp/email`) mit `htmlContent` aus `plan-mail.ts`.
5. Redirect auf `/danke-plan-versendet`.

**`src/app/danke-plan-versendet/page.tsx`** — statische Thank-you-Seite. „Dein Plan ist unterwegs. Check dein Postfach (auch Spam)." Plus Link zurück zur Startseite.

### Geänderte Dateien

**`src/app/api/newsletter/route.ts`** — komplett umgebaut:
- Akzeptiert Payload `{ email, algI, stunden, aktivKarten, gesamtFreibetrag }`.
- Validiert (E-Mail-Format, Zahlen sind Zahlen, aktivKarten ist Array bekannter IDs).
- Rate-Limit: 1 Anfrage pro IP pro Minute (einfaches In-Memory-Map, für MVP OK).
- Erzeugt Token via `createToken(payload)`.
- Brevo Confirm-Mail senden: kurze Mail mit Betreff „Bestätige deine Anmeldung — dein Plan wartet" + Button-Link auf `/api/newsletter/confirm?token=…`.
- Response: `{ ok: true }` auf Erfolg.

**`src/components/sections/newsletter-form.tsx`** — nimmt neue Props entgegen:

```ts
type Props = {
  algI: number;
  stunden: number;
  aktivKarten: Set<string>;
  gesamtFreibetrag: number;
};
```

- Wird in `journey.tsx` aufgerufen **direkt unter dem Ergebnis-Block** (statt wie bisher am Ende der Summary).
- Sendet Plan-Daten zusätzlich zur E-Mail im Request-Body.
- Success-State-Text ändert sich auf: „Check dein Postfach — klick den Link, dann kommt dein Plan."
- Wird nur gerendert, wenn `algI > 0`.

**`src/app/datenschutz/page.tsx`** — ein Absatz ergänzen:

> „Newsletter und Plan-Versand: Wenn du deinen Plan per E-Mail anforderst, speichern wir zusätzlich die freiwillig eingegebenen Rechner-Daten (ALG-I-Betrag, aktivierte Pauschalen, errechneter Freibetrag) als Custom-Attribute im Brevo-Kontakt, um dir deinen persönlichen Plan zuzusenden und gelegentlich passende Tipps zu schicken. Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung). Widerruf jederzeit per Klick auf den Abmelde-Link in jeder Mail."

### Env-Variablen

Neu in `.env.local` und Vercel-Project:
- `TOKEN_SECRET` — zufälliger 32-Byte-String (wie in enhanced-games).
- `BREVO_API_KEY` — API-Schlüssel für Brevo.
- `BREVO_LIST_ID` — numerische ID der Brevo-Kontaktliste für wasnun-jetzt (neu anlegen falls nicht vorhanden).

### Sicherheit

- HMAC-Signatur verhindert Token-Manipulation.
- Ablauf 7 Tage (kurz genug für Phishing-Schutz, lang genug dass Nutzer ihren Bestätigungsklick nicht verpasst).
- Rate-Limit schützt vor Spam-Submits.
- Keine Plan-Daten als Klartext in Query-Strings — alles im signierten Token-Payload.

## Abschnitt 3 — Aufbau der Plan-Mail

### Inhalt (HTML-Mail, responsive, ein-spaltig, max 600 px Breite)

Farbschema passt zur Seite: Navy (`#0f1f3d`) für Text, Teal (`#00b89f`) für Akzente, Cream (`#faf8f4`) für Hintergrund.

1. **Header**
   - Klein, grau: „Dein Plan für ALG I + Nebeneinkommen · 16.04.2026"

2. **Die große Zahl** (zentriert)
   - `+520 EUR` in riesig (48 px, Teal, font-black)
   - Darunter: „monatlich — abzugsfrei zu deinem ALG I von 1.240 EUR"

3. **Zusammensetzung** (Tabelle)
   - Eine Zeile pro aktivierter Pauschale
   - Rechts der Euro-Betrag
   - Trennlinie vor der Summe
   - Footer: „+ unbegrenzt aus Vermietung und Kapital"

4. **Wichtigste Regel** (Warnbox, Amber)
   - „Du darfst max. 14 Std. 59 Min. pro Woche arbeiten. Ab 15 Stunden verlierst du ALG I komplett."

5. **Umsetzungs-Schritte** (nummerierte Liste)
   - Exakt die Texte aus der bestehenden `schrittText()`-Funktion in `journey-summary.tsx`.
   - Eine Box pro Schritt mit Nummer im Kreis links.

6. **Meldepflicht-Hinweis** (Info-Box)
   - „Jede Nebentätigkeit muss spätestens am ersten Arbeitstag gemeldet werden. Hotline: 0800 4 5555 00"

7. **Rechtshinweis** (klein, grau)
   - „Dies ist keine Rechtsberatung. Stand: April 2026. Für verbindliche Auskünfte: Agentur für Arbeit."

8. **Footer**
   - Link zur Webseite
   - **Abmelde-Link (Pflicht!)** — Brevo-Platzhalter `{{params.unsubscribe}}` oder Template-Link.
   - Impressum-Link.

### Fallback-Logik

- Wenn Nutzer Pauschalen abgewählt hat → nur aktivierte erscheinen in Tabelle **und** Schritten.
- Wenn `stunden >= 15` → Warnbox 4 wird mit rotem Rahmen statt Amber dargestellt und um den Satz erweitert: „Aktuell liegst du bei X Stunden. Reduziere zuerst, dann setze den Plan um."
- Wenn Passiv-Karte aktiv ist → zusätzliche Info unter der Tabelle („Mieten und Kapitalerträge sind bei ALG I nicht anrechenbar — beliebig erweiterbar."). Passiv taucht nicht als Schritt mit Euro-Betrag auf, sondern nur als Hinweis-Zeile.

## Implementierungsreihenfolge (für Plan)

1. UX-Umbau Journey (reine Frontend-Änderung, low-risk, sofort testbar)
2. `src/lib/token.ts` + Unit-Tests (isolierte Helfer)
3. `src/lib/plan-mail.ts` + visueller Test (HTML-Datei lokal öffnen)
4. `POST /api/newsletter` auf neuen Flow umbauen
5. `GET /api/newsletter/confirm` neu schreiben
6. `newsletter-form.tsx` anpassen, neue Props konsumieren
7. `/danke-plan-versendet` Seite anlegen
8. Datenschutz-Seite ergänzen
9. End-to-End-Test mit echter E-Mail-Adresse im Preview-Deploy

## Offene Punkte / Annahmen

- **Brevo-Kontaktliste:** Ich gehe davon aus, dass noch keine eigene Liste für wasnun-jetzt existiert. Anlegen ist Teil der Implementation (Brevo-Dashboard, manuell).
- **Rate-Limit-Strategie:** In-Memory-Map reicht für MVP. Wenn die Seite skaliert, sollte auf Vercel-KV oder Upstash umgestellt werden — kein Blocker für jetzt.
- **Bestehende Newsletter-Abonnenten:** Sofern bereits welche in der Brevo-Liste sind, behalten sie ihren Status. Der neue Flow legt sie einfach neu an oder updated das Custom-Attribut-Set.
- **Print-View der Plan-Mail:** Ausdrucken aus dem Mail-Client funktioniert nativ. Kein extra Print-CSS nötig für MVP.
