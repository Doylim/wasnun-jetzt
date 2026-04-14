# Design-Spec: Unified Journey-Block für WasNun.jetzt

**Datum:** 2026-04-14
**Projekt:** `wasnun-jetzt`
**Status:** Entwurf – wartet auf User-Review

## 1. Ziel

Die Startseite von WasNun.jetzt klarer, ehrlicher und fokussierter machen. Der aktuelle Hero verspricht irreführend *"bis zu 603 EUR legal dazuverdienen"* – das ist die allgemeine Minijob-Grenze, aber bei ALG I wird alles über dem 165-EUR-Freibetrag 1:1 angerechnet. Die einzigen Wege, mehr als 165 EUR wirklich zu behalten, sind die Kombinations-Pauschalen: Übungsleiter (+275 EUR), Ehrenamt (+80 EUR), plus unbegrenzt Mieteinnahmen und Kapitalerträge.

**Kern-Message der neuen Seite:** *"Bis zu **520 EUR** abzugsfrei – wenn du die Pauschalen clever kombinierst."*

Die Seite fokussiert ausschließlich auf **ALG I**. Bürgergeld bekommt eine eigene Unterseite in einem späteren Sprint (andere Rechtslogik, andere Optimierungen).

## 2. Problem mit der aktuellen Seite

- **Hero** zeigt 603 EUR als zentrale Zahl → irreführend, da bei ALG I 438 EUR davon 1:1 angerechnet werden
- **Rechner** mischt ALG I und Bürgergeld in einem Tab-Widget → beide Rechtslogiken laufen parallel, Verwirrung
- **Drei Sections** (Rechner, Verdienst-Finder, Verdienstwege) decken ähnliche Aufgaben ab → User-Ermüdung, viel Scroll bis konkrete Action-Links
- **Affiliate-Links** liegen im `Verdienstwege`-Block ohne unmittelbaren Bezug zum Rechner-Output → niedrige Conversion
- **Bildungsgutschein** als eigene große Section → relevant ist sie nur als Unterabschnitt zur Übungsleiterpauschale
- **4 Kategorien** (Sofort/Clever/Aufbauen/Digital) sind eine willkürliche Einteilung, die nicht aus den Rechtsregeln folgt

## 3. Ziel-Architektur (Seitenaufbau)

### Route `/` – ALG-I-Journey (Haupt-Fokus)

```
<SiteHeader>
<Hero>
  Badge:  "Aktualisiert April 2026"
  H1:     "Du beziehst ALG I. Bis zu 520 EUR legal dazuverdienen – ohne Abzug."
  Sub:    "Der einzige Haken: max. 14 Std. 59 Min. pro Woche. Darüber = ALG I weg."
  CTA:    "In 60 Sekunden deinen Plan erstellen"
  Trust:  anonym · SGB III · Stand April 2026

<Journey id="rechner">
  1. JourneyWarnung      (immer sichtbar, 15-Stunden-Gate)
  2. JourneyInput        (ALG I + Wochenstunden)
  3. JourneyTotal        (sticky oben, Live-Running-Total)
  4. JourneyCardGrid     (2x2 Grid mit vier Karten)
       - Grundfreibetrag 165 EUR    (immer aktiv, nicht toggelbar)
       - + Übungsleiterpauschale 275 EUR (Toggle)
       - + Ehrenamtspauschale 80 EUR      (Toggle)
       - + Passive Einkommen (Mieten/Kapital, Toggle)
  5. JourneySummary      (nur sichtbar wenn algI > 0)
       - Nummerierte Schritte
       - Meldepflicht-Hinweis
       - Optionaler NewsletterForm

<FAQ>                    (bleibt, Content aktualisieren auf ALG-I-Fokus)
<Trust>                  (bleibt wie bisher)
<Rechtshinweis>          (bleibt wie bisher)
<SiteFooter>
```

### Route `/buergergeld` – Platzhalter

- Minimale Seite mit Titel *"Bürgergeld – kommt bald"*
- Erklärung warum die Logik anders ist als ALG I
- Link zurück zur Startseite
- Eigene Behandlung in späterem Sprint (gestaffelter Freibetrag, keine Stundengrenze, andere Pauschalen-Wirkung, andere Affiliate-Kandidaten)

### Was gelöscht wird

- `src/components/sections/verdienst-finder.tsx` – 2-Fragen-Entscheidungsbaum
- `src/components/sections/verdienstwege.tsx` – 4 Kategorien-Karten
- `src/components/sections/bildungsgutschein.tsx` – eigene Section (wird zum Sub-Block in Übungsleiter-Karte)
- `src/components/sections/rechner.tsx` – wird durch neue Journey ersetzt
- `KATEGORIEN`, `SKILL_OPTIONS`, `PLAN_KARTEN` aus `src/lib/data.ts`

### Was neu entsteht

- `src/lib/journey.ts` – Datenmodell, `JOURNEY_KARTEN`, `berechnePlan`
- `src/components/sections/journey.tsx` – Orchestrator mit State
- `src/components/sections/journey-warnung.tsx` – 15-Stunden-Gate
- `src/components/sections/journey-input.tsx` – Eingabefelder
- `src/components/sections/journey-total.tsx` – Sticky Running-Total
- `src/components/sections/journey-card.tsx` – wiederverwendbar für alle vier Karten
- `src/components/sections/journey-summary.tsx` – Ergebnis-Block mit Schritten
- `src/components/sections/newsletter-form.tsx` – E-Mail-Capture
- `src/app/api/newsletter/route.ts` – Placeholder-Endpoint
- `src/app/buergergeld/page.tsx` – Platzhalter-Seite

## 4. Daten-Layer

### JourneyKarte-Datenmodell

```typescript
// src/lib/journey.ts
export type JourneyKarte = {
  id: 'grundfreibetrag' | 'uebungsleiter' | 'ehrenamt' | 'passiv';
  titel: string;
  badge: string;                  // z.B. "Immer dein"
  immerAktiv: boolean;            // nur Karte 1 = true
  freibetragEur: number | null;   // null = unbegrenzt (nur Karte 4)
  paragraph: string;              // "§ 155 SGB III"
  erklaerung: string;
  tipp?: string;
  partnerIds: string[];           // referenziert partner.ts
  bildungsgutschein?: boolean;    // nur Karte 2
  unterabschnitte?: { titel: string; partnerIds: string[] }[]; // nur Karte 4
};

export const JOURNEY_KARTEN: JourneyKarte[] = [ /* 4 Eintraege, siehe unten */ ];

export function berechnePlan(state: {
  algI: number;
  stunden: number;
  aktivKarten: Set<string>;
}): {
  gesamtFreibetrag: number;     // Summe aktivierter Pauschalen
  hatPassiv: boolean;            // Karte 4 aktiv
  warnung15Stunden: boolean;     // stunden >= 15
};
```

### Inhalt der 4 Karten

**Karte 1 – Grundfreibetrag 165 EUR** (immer aktiv)
- Badge: *"Immer dein"*
- Titel: *"165 EUR Grundfreibetrag"*
- Zahl: *"+165 EUR/Monat"*
- Rechtsbasis: § 155 SGB III
- Erklärung: *"Der pauschale Freibetrag. Bis zu diesem Betrag darfst du neben deinem ALG I dazuverdienen – komplett ohne Abzug. Das sind ca. 12 Stunden Arbeit pro Monat zum Mindestlohn."*
- Tipp: *"Halte dich bei rund 11–12 Std./Monat. Dann liegst du bei ca. 153–168 EUR – knapp unter der Grenze und 100 % sicher."*
- Action-Links (Affiliate-Partner, Werbe-Kennzeichnung): Zenjob, Coople, Clickworker, AppJobber, Streetspotr

**Karte 2 – +275 EUR Übungsleiterpauschale** (Toggle)
- Badge: *"Zusätzlich anrechnungsfrei"*
- Titel: *"+275 EUR Übungsleiterpauschale"*
- Zahl: *"+275 EUR/Monat"*
- Rechtsbasis: § 3 Nr. 26 EStG
- Erklärung: *"Als Trainer, Chorleiter, Betreuer oder Ausbilder bei einem gemeinnützigen Verein. Kombinierbar mit dem Grundfreibetrag: 165 + 275 = 440 EUR/Monat."*
- Action-Links: BAGFA-Vereinssuche, C-Trainer-Kurs (Academy of Sports – Affiliate), DRK Erste-Hilfe-Ausbilder, VHS-Kursleitung
- **Sub-Modul "Qualifikation fehlt? Bildungsgutschein"** – ersetzt die alte eigene Section:
  - *"Keine Trainer-Lizenz? Mit dem Bildungsgutschein (§ 81 SGB III) holst du dir die C-Trainer-Lizenz kostenlos in 16 Wochen online."*
  - Link: arbeitsagentur.de/bildungsgutschein

**Karte 3 – +80 EUR Ehrenamtspauschale** (Toggle)
- Badge: *"Zusätzlich anrechnungsfrei"*
- Titel: *"+80 EUR Ehrenamtspauschale"*
- Zahl: *"+80 EUR/Monat"*
- Rechtsbasis: § 3 Nr. 26a EStG
- Erklärung: *"Als Vereinsvorstand, Kassenwart, Platzwart oder für administrative Aufgaben in gemeinnützigen Vereinen. Kombinierbar mit den anderen Pauschalen bis 520 EUR/Monat."*
- Action-Links: BAGFA-Freiwilligenagentur, DRK Ehrenamt, Caritas/Diakonie

**Karte 4 – Passive Einkommen** (Toggle)
- Badge: *"Unbegrenzt – nicht angerechnet"*
- Titel: *"Mieten & Kapital"*
- Zahl: *"Unbegrenzt"* (wird NICHT zur 520-Summe addiert)
- Rechtsbasis: § 155 SGB III (nur Erwerbseinkommen wird angerechnet)
- Erklärung: *"Mieteinnahmen und Kapitalerträge (Zinsen, Dividenden) werden bei ALG I NICHT angerechnet – unbegrenzt. Achtung: Beim Bürgergeld gelten andere Regeln."*
- Zwei Unterabschnitte:
  - **Vermietung:** WG-gesucht (Zimmer vermieten), ImmobilienScout24, eBay Kleinanzeigen
  - **Kapital:** Tagesgeld-Vergleich (C24 – Affiliate), ETF-Broker (Trade Republic – Affiliate)

### Partner-Updates in `src/lib/partner.ts`

- Kategorien werden um die vier Karten-Typen erweitert
- Neue Helper-Funktion: `partnerNachIds(ids: string[]): Partner[]`
- Alle Partner bleiben auf `status: "geplant"` bis echte Partnerprogramme registriert sind
- Werbe-Kennzeichnung mit sichtbarer *"Werbung"*-Badge bleibt Pflicht (§ 6 TMG)
- Link-Attribute: `rel="sponsored noopener noreferrer"`, `target="_blank"`

### Cleanup in `src/lib/data.ts`

- `KATEGORIEN` → gelöscht
- `SKILL_OPTIONS` → gelöscht
- `PLAN_KARTEN` → gelöscht
- `LEGAL` → bleibt unveraendert
- `IMPRESSUM` → bleibt unveraendert

## 5. Komponenten & State-Management

### Komponenten-Baum

```
<Journey>                     [client component, State-Orchestrator]
  ├── <JourneyWarnung />      [immer sichtbar, reagiert auf stunden]
  ├── <JourneyInput />        [zwei Eingabefelder, controlled]
  ├── <JourneyTotal />        [sticky oben, live-aktualisierte Summe]
  ├── <JourneyCardGrid>       [2x2 Grid der vier Karten]
  │     ├── <JourneyCard id="grundfreibetrag" immerAktiv />
  │     ├── <JourneyCard id="uebungsleiter" />
  │     ├── <JourneyCard id="ehrenamt" />
  │     └── <JourneyCard id="passiv" />
  └── <JourneySummary />      [nur sichtbar wenn algI > 0]
        └── <NewsletterForm /> [optional, nicht blockierend]
```

### State im Journey-Orchestrator

```typescript
"use client";

const [algI, setAlgI] = useState<number>(0);
const [stunden, setStunden] = useState<number>(12);
const [aktivKarten, setAktivKarten] = useState<Set<string>>(
  new Set(["grundfreibetrag"])  // immer aktiv
);

const plan = useMemo(
  () => berechnePlan({ algI, stunden, aktivKarten }),
  [algI, stunden, aktivKarten]
);

const togglekarte = (id: string) => {
  if (id === "grundfreibetrag") return;  // darf nicht deaktiviert werden
  setAktivKarten(prev => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });
};
```

### Einzelne Komponenten

**JourneyWarnung** – immer sichtbar, prominent über dem Input
- Default (amber): *"Wichtig: Ab 15 Std./Woche verlierst du den kompletten ALG-I-Anspruch. Halte dich strikt unter 14 Std. 59 Min."*
- Alert (stunden >= 15, rot): ältere Warnung plus *"Dein ALG I wäre komplett weg. Reduziere sofort."*
- `role="alert"` bei Wechsel, `aria-live="polite"` im Default

**JourneyInput** – zwei Felder, groß
- Feld 1: *"Dein ALG I pro Monat"* – Zahl, Suffix EUR
- Feld 2: *"Deine Arbeitsstunden pro Woche"* – Zahl, `max="14"`, Suffix Std
- Labels groß, Inputs h-14, große Schrift

**JourneyTotal** – sticky Running-Total-Box
- Position: `sticky top-20` innerhalb des Journey-Containers (nur Desktop)
- Mobile: normal im Fluss
- Inhalt: große Zahl `+{plan.gesamtFreibetrag} EUR` in teal-600
- Darunter: *"abzugsfrei zu deinem ALG I von {algI} EUR"*
- Wenn `plan.hatPassiv`: Zusatzzeile *"+ unbegrenzt aus Vermietung/Kapital"*
- Wenn `algI === 0`: Call-to-Action *"Tippe oben dein ALG I ein"*

**JourneyCard** – wiederverwendbar
```typescript
type Props = {
  karte: JourneyKarte;
  aktiv: boolean;
  onToggle: () => void;
};
```
- Header: Badge + Titel + große Zahl (z.B. "+275 EUR")
- Body: Erklärung + Rechtsbasis + optionaler Tipp
- Action-Block: Liste von Partner-Links mit *"Werbung"*-Badge
- Karte 2: Sub-Block *"Qualifikation fehlt? Bildungsgutschein"*
- Karte 4: zwei Unterabschnitte *"Vermietung"* und *"Kapital"*
- Visueller Status:
  - `immerAktiv`: permanent-aktiv, Toggle visuell disabled, Check-Icon
  - `aktiv && !immerAktiv`: border teal-500 + teal-50 Background
  - `!aktiv`: Standard border navy-100, leicht ausgegraut
- Toggle-Button oben rechts, Label *"Gehoert zu meinem Plan"*
- `aria-pressed={aktiv}`

**JourneySummary** – Ergebnis-Block unter den Karten
- Nur sichtbar wenn `algI > 0`
- Headline: *"Dein Plan ist fertig"*
- Große Zahl: `{plan.gesamtFreibetrag} EUR + ALG I`
- Nummerierte Schritt-Liste basierend auf `aktivKarten`:
  1. Grundfreibetrag 165 EUR – Plattform-Empfehlung
  2. Übungsleiter 275 EUR – Vereinssuche (falls aktiv)
  3. Ehrenamt 80 EUR – Freiwilligenagentur (falls aktiv)
  4. Passive Einkommen – Vermietung/Tagesgeld (falls aktiv)
- Meldepflicht-Hinweis am Ende
- `<NewsletterForm />`

**NewsletterForm** – optional, minimal
- Ein Eingabefeld E-Mail + Submit-Button *"Plan per E-Mail + 1x/Monat Tipps"*
- POST auf `/api/newsletter`
- Erfolg: Formular wird durch *"Danke – schau in dein Postfach"* ersetzt
- Fehler: inline Fehlermeldung *"Probiere es später nochmal."*
- Button disabled während Request

### API-Route

`src/app/api/newsletter/route.ts`:
- Akzeptiert POST mit `email`
- Placeholder-Implementation: loggt E-Mail via `console.log`, returniert 200 OK
- Kommentar: *"TODO: echten Newsletter-Provider anbinden (Resend / Plunk / Mailchimp) vor Go-Live"*
- Rate-Limit: triviale In-Memory-Zaehler-Map (3 Requests pro Minute pro IP)

## 6. Interaktions-Zustände & Edge-Cases

### Initial-Zustand

- `algI = 0`, `stunden = 12`, `aktivKarten = {"grundfreibetrag"}`
- JourneyWarnung im amber-Zustand
- JourneyTotal zeigt Call-to-Action
- Alle 4 Karten sichtbar, Karte 1 als permanent-aktiv, 2–4 inaktiv
- JourneySummary nicht sichtbar

### Haupt-Flow

| Event | Auswirkung |
|---|---|
| User tippt `algI = 1200` | Total → `+165 EUR`, Summary erscheint |
| User toggelt Übungsleiter | Total → `+440 EUR`, Card 2 teal-Border, Schritt 2 in Summary |
| User toggelt Ehrenamt | Total → `+520 EUR`, Card 3 aktiv, Schritt 3 in Summary |
| User toggelt Passiv | Total Zusatzzeile *"unbegrenzt"*, Schritt 4 in Summary |
| User tippt `stunden = 15` | Warnung wird rot, Summary bekommt Warn-Banner |
| User klickt Grundfreibetrag-Toggle | Nichts passiert (disabled) |
| User klickt Partner-Link | Neues Tab mit `rel="sponsored noopener noreferrer"` |
| User submittet Newsletter | Success-Check, Formular durch Danke-Text ersetzt |

### Input-Validierung

- `algI` leer / non-numeric → `parseFloat() || 0`, Total zeigt Default-CTA
- `algI` negativ → `min="0"` und Clamping
- `stunden` leer → Default 12
- `stunden` negativ → Clamping auf 0
- `stunden > 14` → rote Warnung sofort
- Komma-Zahlen werden akzeptiert (parseFloat)

### 15-Stunden-Fall (detailliert)

- `stunden < 15`: alles normal
- `stunden >= 15`:
  - JourneyWarnung rot, `role="alert"`, Text *"Stop! Bei 15 Stunden/Woche verlierst du den kompletten ALG-I-Anspruch."*
  - JourneyTotal normale Zahl mit rotem Warn-Rand + *"Achtung: Deine Stunden-Angabe überschreitet die Grenze. Reduziere sofort."*
  - JourneySummary rote Warn-Box als erstes Element, darunter die Schritte *"Sobald deine Stunden < 15 sind, kannst du diesen Plan umsetzen."*
  - Toggles funktionieren weiterhin – nicht blockieren, nur informieren

### Mobile

- 2x2 Grid wird zu 1x4 (1 Karte pro Zeile) unter `md`-Breakpoint
- JourneyTotal NICHT sticky auf Mobile (stattdessen fest im Fluss)
- JourneyInput: Felder stapeln vertikal
- Touch-Targets min. 44×44 px

### Accessibility

- JourneyWarnung: `role="alert"` bei Alert-Wechsel, `aria-live="polite"` im Default
- Karten: `<article>` mit `aria-labelledby` auf den Titel
- Toggle-Button: `aria-pressed={aktiv}`, `aria-label` für Screenreader
- Immer-aktiv-Karte: `aria-disabled="true"`
- Inputs: `<label htmlFor>`-Verbindung
- Skip-Link auf `#rechner` bleibt im Hero
- Keyboard-Navigation komplett, Focus-Visible-Ring sichtbar

### Performance

- Alles client-side, kein Fetch während Interaktion
- `berechnePlan` ist reine Funktion mit `useMemo`
- Keine neuen Libraries, nur Custom-Komponenten
- Native CSS-Transitions statt framer-motion für diese UI

## 7. Build & Testing

### Build-Validation

1. `npm run build` – Next 16 Production Build ohne TypeScript-Fehler
2. `npm run lint` – ESLint ohne Fehler
3. Manuelle Visual-Prüfung auf `localhost` (Desktop + Mobile-Viewport) vor Commit

### Automatisierte Tests (optional)

Nur `berechnePlan`-Unit-Test in `src/lib/journey.test.ts`:
- `{algI: 0, stunden: 0, aktivKarten: new Set(['grundfreibetrag'])}` → `gesamtFreibetrag: 165`
- `{..., aktivKarten: new Set(['grundfreibetrag', 'uebungsleiter'])}` → `gesamtFreibetrag: 440`
- `{..., aktivKarten: new Set(['grundfreibetrag', 'uebungsleiter', 'ehrenamt'])}` → `gesamtFreibetrag: 520`
- `{stunden: 15, ...}` → `warnung15Stunden: true`
- `{..., aktivKarten: new Set(['grundfreibetrag', 'passiv'])}` → `hatPassiv: true`, `gesamtFreibetrag: 165`

### Manuelle Test-Checkliste

1. Seite laedt auf `http://localhost:3000` – keine Console-Errors, Hero mit *"520 EUR"* sichtbar
2. Eingabe `algI = 1200` – Total wechselt zu `+165 EUR`, Summary erscheint
3. Toggle Übungsleiter – Total `+440 EUR`, Card 2 teal-Border
4. Toggle Ehrenamt – Total `+520 EUR`, Schritt 3 in Summary
5. Toggle Passiv – Total Zusatzzeile *"unbegrenzt"*, Schritt 4 erscheint
6. Klick Grundfreibetrag-Toggle – nichts passiert
7. Eingabe `stunden = 15` – Warnung rot, Summary-Warn-Banner
8. Klick Zenjob-Link – neues Tab mit `rel="sponsored"`
9. Mobile-Viewport (375 px) – 1-spaltige Anordnung, Touch-Targets > 44 px
10. Tab-Navigation – alle Inputs/Toggles erreichbar, Focus-Ring sichtbar
11. `/buergergeld` – Platzhalter mit Link zurück
12. FAQ aktualisiert auf ALG-I-Fokus
13. Newsletter-Submit – Erfolgs-Meldung, Button disabled
14. Umlaute-Check – keine `ae|oe|ue` in UI-Texten

### Lighthouse-Ziele

- Performance > 95
- SEO > 95
- Accessibility > 95
- Best Practices > 95

## 8. Implementation-Reihenfolge

Empfohlene Reihenfolge (wird vom Implementation-Plan noch verfeinert):

1. `src/lib/journey.ts` – Datenmodell + `berechnePlan` + `JOURNEY_KARTEN`
2. `src/lib/partner.ts` – neue Kategorien, `partnerNachIds`-Helper
3. `src/lib/data.ts` – Cleanup (`KATEGORIEN`, `SKILL_OPTIONS`, `PLAN_KARTEN` entfernen)
4. Neue Komponenten in `src/components/sections/`:
   - `journey-warnung.tsx`
   - `journey-input.tsx`
   - `journey-total.tsx`
   - `journey-card.tsx`
   - `journey-summary.tsx`
   - `newsletter-form.tsx`
   - `journey.tsx` (Orchestrator)
5. `src/app/api/newsletter/route.ts` – Placeholder-Endpoint
6. `src/app/buergergeld/page.tsx` – Platzhalter-Seite
7. `src/components/sections/hero.tsx` – Update (520 EUR, 15-Stunden-Warnung)
8. `src/components/sections/site-header.tsx` – Navigation-Links anpassen
9. `src/components/sections/faq.tsx` – Content auf ALG-I-Fokus aktualisieren
10. Alte Dateien loeschen: `rechner.tsx`, `verdienst-finder.tsx`, `verdienstwege.tsx`, `bildungsgutschein.tsx`
11. `src/app/page.tsx` – alte Sections entfernen, Journey einbauen
12. Optional: `src/lib/journey.test.ts`
13. `npm run build` → `npm run dev` → Test-Checkliste
14. Commit

## 9. Git-Workflow

Ein Commit mit deutscher Commit-Message:

```
feat: Unified Journey-Block – ALG-I-Fokus mit 4 Pauschalen-Karten

- Hero auf 520 EUR abzugsfreies Maximum umgestellt
- Rechner + Verdienst-Finder + Verdienstwege durch Journey ersetzt
- 4 Karten: Grundfreibetrag (165), Übungsleiter (275), Ehrenamt (80), Passiv
- Live-Running-Total, Toggle-Mechanik, personalisierter Summary-Block
- Newsletter-Capture (optional), /buergergeld Platzhalter
- FAQ auf ALG-I-Fokus, Bildungsgutschein integriert in Übungsleiter-Karte
```

## 10. Offene Punkte für später

- Bürgergeld-Unterseite als eigener Sprint (andere Rechtslogik, andere Pauschalen-Wirkung, andere Affiliate-Kandidaten)
- Echten Newsletter-Provider anbinden (Resend / Plunk / Mailchimp) vor Go-Live
- Tracking/Analytics (cookielos – Plausible oder Vercel Analytics) nach Go-Live
- Reale Affiliate-Partnerprogramme registrieren, `status: "aktiv"` schalten
- C-Trainer-Kurs-Partner: Academy of Sports hat ein Affiliate-Programm – prüfen ob beitreten möglich

## 11. Was NICHT im Scope ist

- Bürgergeld-Journey (bleibt bei Platzhalter-Seite)
- User-Accounts, Login, Speicher-Funktion für Pläne
- PDF-Export des Plans (möglicher späterer Schritt)
- Mehrsprachigkeit
- Theme-Switcher / Dark-Mode
- Kommentare, Forum, Community-Features
- Echte Datenbank (alles statisch/client-side)
