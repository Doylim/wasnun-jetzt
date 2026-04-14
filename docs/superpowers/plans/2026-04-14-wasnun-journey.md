# Unified Journey-Block Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Die Startseite von wasnun-jetzt auf einen fokussierten ALG-I-Journey umbauen: Hero mit 520 EUR als zentrale Zahl, ein einziger durchgängiger Block mit Rechner-Inputs + 4 Pauschalen-Karten + Summary, und eine Platzhalter-Seite `/buergergeld` für den späteren Sprint.

**Architecture:** Ein zentraler `<Journey>` Client-Component orchestriert State (`algI`, `stunden`, `aktivKarten`). Vier `<JourneyCard>` Instanzen (Grundfreibetrag, Übungsleiter, Ehrenamt, Passiv) teilen sich eine wiederverwendbare Komponente. Die reine Berechnungslogik liegt in `src/lib/journey.ts` (`berechnePlan`). Die Affiliate-Partner bleiben datengetrieben in `src/lib/partner.ts` mit neuer `partnerNachIds`-Helper-Funktion.

**Tech Stack:** Next.js 16 (App Router, Turbopack), React 19, TypeScript strict, Tailwind CSS 4, shadcn/ui Primitives (bereits vorhanden), lucide-react Icons.

**Spec Reference:** `docs/superpowers/specs/2026-04-14-wasnun-journey-design.md`

---

## File Structure

### Neu zu erstellen

| Datei | Verantwortung |
|---|---|
| `src/lib/journey.ts` | Datenmodell `JourneyKarte`, `JOURNEY_KARTEN` Array, `berechnePlan` reine Funktion |
| `src/components/sections/journey-warnung.tsx` | 15-Stunden-Gate, ARIA role="alert" |
| `src/components/sections/journey-input.tsx` | Zwei Eingabefelder (ALG I + Stunden) |
| `src/components/sections/journey-total.tsx` | Sticky Running-Total-Box |
| `src/components/sections/journey-card.tsx` | Wiederverwendbare Karte mit Toggle, Action-Links, Sub-Module |
| `src/components/sections/journey-summary.tsx` | Ergebnis-Block mit nummerierten Schritten |
| `src/components/sections/newsletter-form.tsx` | E-Mail-Capture mit API-Call |
| `src/components/sections/journey.tsx` | Orchestrator, State-Management |
| `src/app/api/newsletter/route.ts` | Placeholder-POST-Endpoint mit Rate-Limit |
| `src/app/buergergeld/page.tsx` | "Kommt bald"-Platzhalterseite |

### Zu aktualisieren

| Datei | Änderung |
|---|---|
| `src/lib/partner.ts` | Neue Kategorien (`typ`-Erweiterung), neue Partner-Einträge, `partnerNachIds` Helper |
| `src/lib/data.ts` | `KATEGORIEN`, `SKILL_OPTIONS`, `PLAN_KARTEN` löschen |
| `src/components/sections/hero.tsx` | Zahl 520 EUR, neue H1, 15-Stunden-Warnung |
| `src/components/sections/site-header.tsx` | Navigation-Links: "Dein Plan", "FAQ", "Bürgergeld" |
| `src/components/sections/faq.tsx` | Inhalt auf ALG-I-Fokus aktualisieren |
| `src/app/page.tsx` | Alte Sections raus, `<Journey />` rein |

### Zu löschen

- `src/components/sections/rechner.tsx`
- `src/components/sections/verdienst-finder.tsx`
- `src/components/sections/verdienstwege.tsx`
- `src/components/sections/bildungsgutschein.tsx`

---

## Task 1: Daten-Layer – journey.ts anlegen

**Files:**
- Create: `src/lib/journey.ts`

- [ ] **Step 1: Datei mit Typen, Daten und Berechnungsfunktion erstellen**

Inhalt von `src/lib/journey.ts`:

```typescript
// ─────────────────────────────────────────────────────────
// lib/journey.ts – Datenmodell für den Unified Journey-Block
// 4 Karten: Grundfreibetrag, Übungsleiter, Ehrenamt, Passiv
// ─────────────────────────────────────────────────────────

export type KartenId = "grundfreibetrag" | "uebungsleiter" | "ehrenamt" | "passiv";

export type Unterabschnitt = {
  titel: string;
  partnerIds: string[];
};

export type JourneyKarte = {
  id: KartenId;
  titel: string;
  badge: string;
  immerAktiv: boolean;
  freibetragEur: number | null; // null = unbegrenzt (nur Karte 4)
  paragraph: string;
  erklaerung: string;
  tipp?: string;
  partnerIds: string[];
  bildungsgutschein?: boolean;
  unterabschnitte?: Unterabschnitt[];
};

export const JOURNEY_KARTEN: JourneyKarte[] = [
  {
    id: "grundfreibetrag",
    titel: "165 EUR Grundfreibetrag",
    badge: "Immer dein",
    immerAktiv: true,
    freibetragEur: 165,
    paragraph: "§ 155 SGB III",
    erklaerung:
      "Der pauschale Freibetrag. Bis zu diesem Betrag darfst du neben deinem ALG I dazuverdienen – komplett ohne Abzug. Das sind ca. 12 Stunden Arbeit pro Monat zum Mindestlohn.",
    tipp: "Halte dich bei rund 11–12 Std./Monat. Dann liegst du bei ca. 153–168 EUR – knapp unter der Grenze und 100 % sicher.",
    partnerIds: ["zenjob", "coople", "clickworker", "appjobber", "streetspotr"],
  },
  {
    id: "uebungsleiter",
    titel: "+275 EUR Übungsleiterpauschale",
    badge: "Zusätzlich anrechnungsfrei",
    immerAktiv: false,
    freibetragEur: 275,
    paragraph: "§ 3 Nr. 26 EStG",
    erklaerung:
      "Als Trainer, Chorleiter, Betreuer oder Ausbilder bei einem gemeinnützigen Verein. Kombinierbar mit dem Grundfreibetrag: 165 + 275 = 440 EUR/Monat.",
    partnerIds: ["bagfa-vereine", "academy-of-sports", "drk-ausbilder", "vhs-kursleitung"],
    bildungsgutschein: true,
  },
  {
    id: "ehrenamt",
    titel: "+80 EUR Ehrenamtspauschale",
    badge: "Zusätzlich anrechnungsfrei",
    immerAktiv: false,
    freibetragEur: 80,
    paragraph: "§ 3 Nr. 26a EStG",
    erklaerung:
      "Als Vereinsvorstand, Kassenwart, Platzwart oder für administrative Aufgaben in gemeinnützigen Vereinen. Kombinierbar mit den anderen Pauschalen bis 520 EUR/Monat.",
    partnerIds: ["bagfa-ehrenamt", "drk-ehrenamt", "caritas"],
  },
  {
    id: "passiv",
    titel: "Mieten & Kapital",
    badge: "Unbegrenzt – nicht angerechnet",
    immerAktiv: false,
    freibetragEur: null,
    paragraph: "§ 155 SGB III",
    erklaerung:
      "Mieteinnahmen und Kapitalerträge (Zinsen, Dividenden) werden bei ALG I NICHT angerechnet – unbegrenzt. Achtung: Beim Bürgergeld gelten andere Regeln.",
    partnerIds: [],
    unterabschnitte: [
      {
        titel: "Vermietung",
        partnerIds: ["wg-gesucht", "immobilienscout", "kleinanzeigen"],
      },
      {
        titel: "Kapital",
        partnerIds: ["c24-tagesgeld", "trade-republic"],
      },
    ],
  },
];

export type PlanState = {
  algI: number;
  stunden: number;
  aktivKarten: Set<string>;
};

export type PlanErgebnis = {
  gesamtFreibetrag: number;
  hatPassiv: boolean;
  warnung15Stunden: boolean;
};

export function berechnePlan(state: PlanState): PlanErgebnis {
  const clampedStunden = Math.max(0, state.stunden);
  const warnung15Stunden = clampedStunden >= 15;
  const hatPassiv = state.aktivKarten.has("passiv");

  let gesamtFreibetrag = 0;
  for (const karte of JOURNEY_KARTEN) {
    if (karte.id === "passiv") continue;
    if (!state.aktivKarten.has(karte.id)) continue;
    if (karte.freibetragEur === null) continue;
    gesamtFreibetrag += karte.freibetragEur;
  }

  return { gesamtFreibetrag, hatPassiv, warnung15Stunden };
}
```

- [ ] **Step 2: TypeScript-Check**

Run: `cd C:/Projekte/webseiten/wasnun-jetzt && npx tsc --noEmit`
Expected: Keine Errors (es gibt bereits einen .next/dev Cache, Warnings sind OK)

- [ ] **Step 3: Commit**

```bash
cd C:/Projekte/webseiten/wasnun-jetzt
git add src/lib/journey.ts
git commit -m "feat: journey.ts mit 4 Karten-Datenmodell und berechnePlan"
```

---

## Task 2: Partner-Layer – partner.ts erweitern

**Files:**
- Modify: `src/lib/partner.ts`

- [ ] **Step 1: Typ `typ` erweitern und neue Partner hinzufügen**

Die bestehende Datei hat 9 Partner und den Typ-Union `"jobplattform" | "mikrojob" | "bildung" | "finanz" | "nachhilfe" | "fahrdienst"`. Wir erweitern beides. Ersetze den kompletten Inhalt von `src/lib/partner.ts` mit:

```typescript
// ─────────────────────────────────────────────────────────
// Affiliate-Partner für WasNun.jetzt
// WICHTIG: Jeder Eintrag wird als "Werbung" gekennzeichnet.
// Die rechtlichen Informationen der Seite werden von der
// Kommerzialisierung strikt getrennt (§ 6 TMG).
// ─────────────────────────────────────────────────────────

export type PartnerTyp =
  | "jobplattform"
  | "mikrojob"
  | "bildung"
  | "finanz"
  | "nachhilfe"
  | "fahrdienst"
  | "verein"
  | "ehrenamt"
  | "mieten"
  | "kapital";

export type Partner = {
  id: string;
  name: string;
  beschreibung: string;
  verdienst: string;
  url: string;
  typ: PartnerTyp;
  cpl: string;
  status: "aktiv" | "geplant"; // nur "aktiv" wird angezeigt
};

export const PARTNER: Partner[] = [
  // ── Karte 1: Grundfreibetrag 165 EUR ──
  {
    id: "zenjob",
    name: "Zenjob",
    beschreibung:
      "Kurzfristige Schichten in Gastro, Einzelhandel und Lager. Anmeldung in Minuten, erster Einsatz oft schon am nächsten Tag.",
    verdienst: "13,90–20 EUR/Std.",
    url: "https://www.zenjob.com",
    typ: "jobplattform",
    cpl: "5–25 EUR",
    status: "geplant",
  },
  {
    id: "coople",
    name: "Coople",
    beschreibung:
      "Flexible Jobs für Gastronomie, Events und Retail. Schichten selbst wählen, digitale Stundenzettel.",
    verdienst: "14–22 EUR/Std.",
    url: "https://www.coople.com/de",
    typ: "jobplattform",
    cpl: "5–25 EUR",
    status: "geplant",
  },
  {
    id: "clickworker",
    name: "Clickworker",
    beschreibung:
      "Mikrojobs am Rechner: Texte schreiben, Daten kategorisieren, Umfragen. Völlig ortsunabhängig.",
    verdienst: "50–300 EUR/Monat",
    url: "https://www.clickworker.de",
    typ: "mikrojob",
    cpl: "3–10 EUR",
    status: "geplant",
  },
  {
    id: "appjobber",
    name: "AppJobber",
    beschreibung:
      "Kleinaufträge per Smartphone in deiner Nähe: Fotos, Preischecks, kurze Recherchen. Heute anmelden, heute verdienen.",
    verdienst: "30–200 EUR/Monat",
    url: "https://www.appjobber.de",
    typ: "mikrojob",
    cpl: "3–10 EUR",
    status: "geplant",
  },
  {
    id: "streetspotr",
    name: "Streetspotr",
    beschreibung:
      "Mystery-Shopping und kleine Checks im Alltag. Perfekt als Nebeneinnahme bei Besorgungen.",
    verdienst: "30–150 EUR/Monat",
    url: "https://www.streetspotr.com",
    typ: "mikrojob",
    cpl: "3–10 EUR",
    status: "geplant",
  },

  // ── Karte 2: Übungsleiterpauschale 275 EUR ──
  {
    id: "bagfa-vereine",
    name: "BAGFA-Vereinssuche",
    beschreibung:
      "Bundesarbeitsgemeinschaft der Freiwilligenagenturen. Finde Vereine in deiner Stadt, die Trainer, Chorleiter oder Betreuer suchen.",
    verdienst: "Zugang zu 16.000+ Vereinen",
    url: "https://www.bagfa.de",
    typ: "verein",
    cpl: "0 EUR",
    status: "geplant",
  },
  {
    id: "academy-of-sports",
    name: "Academy of Sports – C-Trainer",
    beschreibung:
      "C-Trainer-Lizenz Breitensport in 16 Wochen online. Oft komplett über Bildungsgutschein förderbar.",
    verdienst: "Qualifikation für 275 EUR/Monat",
    url: "https://www.academyofsports.de/de/trainer-ausbildung/trainer-c-lizenz-breitensport/",
    typ: "bildung",
    cpl: "50–150 EUR",
    status: "geplant",
  },
  {
    id: "drk-ausbilder",
    name: "DRK Erste-Hilfe-Ausbilder",
    beschreibung:
      "Werde Erste-Hilfe-Ausbilder beim DRK. Kurse geben an Schulen, in Betrieben und für Privatpersonen.",
    verdienst: "20–50 EUR/Kurs",
    url: "https://www.drk.de/hilfe-in-deutschland/erste-hilfe/",
    typ: "verein",
    cpl: "0 EUR",
    status: "geplant",
  },
  {
    id: "vhs-kursleitung",
    name: "Volkshochschulen Deutschland",
    beschreibung:
      "Kursleitung an deiner örtlichen VHS. Fast jede Qualifikation oder Alltagskompetenz ist vermittelbar.",
    verdienst: "20–40 EUR/Kursstunde",
    url: "https://www.volkshochschule.de",
    typ: "verein",
    cpl: "0 EUR",
    status: "geplant",
  },

  // ── Karte 3: Ehrenamtspauschale 80 EUR ──
  {
    id: "bagfa-ehrenamt",
    name: "BAGFA-Freiwilligenagentur",
    beschreibung:
      "Passende Ehrenamts-Stellen in deiner Stadt. Von Vereinsvorstand bis Kassenwart – alle administrativen Rollen.",
    verdienst: "Zugang zu lokalen Stellen",
    url: "https://www.bagfa.de/freiwillige/freiwilligenagentur-finden/",
    typ: "ehrenamt",
    cpl: "0 EUR",
    status: "geplant",
  },
  {
    id: "drk-ehrenamt",
    name: "DRK Ehrenamt",
    beschreibung:
      "Das DRK sucht laufend Ehrenamtliche für Vorstandsarbeit, Organisation und Betreuung.",
    verdienst: "80 EUR/Monat pauschal",
    url: "https://www.drk.de/ehrenamt/",
    typ: "ehrenamt",
    cpl: "0 EUR",
    status: "geplant",
  },
  {
    id: "caritas",
    name: "Caritas & Diakonie",
    beschreibung:
      "Die großen Wohlfahrtsverbände mit tausenden Ehrenamts-Stellen in administrativen und organisatorischen Rollen.",
    verdienst: "80 EUR/Monat pauschal",
    url: "https://www.caritas.de/hilfeundberatung/onlineberatung/ehrenamt",
    typ: "ehrenamt",
    cpl: "0 EUR",
    status: "geplant",
  },

  // ── Karte 4: Passive Einkommen ──
  {
    id: "wg-gesucht",
    name: "WG-Gesucht",
    beschreibung:
      "Zimmer in deiner Wohnung zwischen- oder dauerhaft vermieten. Bei ALG I komplett anrechnungsfrei.",
    verdienst: "300–600 EUR/Monat je Zimmer",
    url: "https://www.wg-gesucht.de",
    typ: "mieten",
    cpl: "10–30 EUR",
    status: "geplant",
  },
  {
    id: "immobilienscout",
    name: "ImmobilienScout24",
    beschreibung:
      "Deutschlands größtes Immobilienportal für Vermietung und Verkauf. Deine Anzeigen erreichen Millionen Suchende.",
    verdienst: "abhängig von Objekt",
    url: "https://www.immobilienscout24.de",
    typ: "mieten",
    cpl: "0 EUR",
    status: "geplant",
  },
  {
    id: "kleinanzeigen",
    name: "eBay Kleinanzeigen",
    beschreibung:
      "Kostenlose Mietanzeigen für Zimmer, Stellplätze, Garagen. Ideal für kleinere Vermietungen ohne Makler.",
    verdienst: "variabel",
    url: "https://www.kleinanzeigen.de/s-immobilien/c195",
    typ: "mieten",
    cpl: "0 EUR",
    status: "geplant",
  },
  {
    id: "c24-tagesgeld",
    name: "Check24 Tagesgeld-Vergleich",
    beschreibung:
      "Vergleiche aktuelle Tagesgeld-Zinsen aller deutschen Banken. Zinsen sind bei ALG I nicht anrechenbar.",
    verdienst: "bis 3,5 % p.a.",
    url: "https://www.check24.de/tagesgeld/",
    typ: "kapital",
    cpl: "20–50 EUR",
    status: "geplant",
  },
  {
    id: "trade-republic",
    name: "Trade Republic",
    beschreibung:
      "Kostengünstiger Broker für ETFs und Aktien. Sparpläne ab 1 EUR. Dividenden bei ALG I nicht anrechenbar.",
    verdienst: "marktabhängig",
    url: "https://www.traderepublic.com",
    typ: "kapital",
    cpl: "20–40 EUR",
    status: "geplant",
  },
];

export function aktivePartner(): Partner[] {
  return PARTNER.filter((p) => p.status === "aktiv");
}

export function partnerNachIds(ids: string[]): Partner[] {
  const byId = new Map(PARTNER.map((p) => [p.id, p]));
  return ids
    .map((id) => byId.get(id))
    .filter((p): p is Partner => p !== undefined);
}

export function partnerNachTyp(typ: PartnerTyp): Partner[] {
  return PARTNER.filter((p) => p.typ === typ);
}
```

- [ ] **Step 2: TypeScript-Check**

Run: `cd C:/Projekte/webseiten/wasnun-jetzt && npx tsc --noEmit`
Expected: Keine Errors im partner.ts. Andere Dateien (verdienstwege.tsx, verdienst-finder.tsx) werden noch Errors haben, da sie `tier` benutzen – das beheben wir, indem wir die Dateien in Task 14 löschen. Für jetzt prüfen wir nur, dass partner.ts und journey.ts keine Errors werfen.

- [ ] **Step 3: Commit**

```bash
cd C:/Projekte/webseiten/wasnun-jetzt
git add src/lib/partner.ts
git commit -m "feat: partner.ts für 4 Journey-Karten erweitert + partnerNachIds Helper"
```

---

## Task 3: JourneyWarnung Komponente

**Files:**
- Create: `src/components/sections/journey-warnung.tsx`

- [ ] **Step 1: Warnungs-Komponente erstellen**

```tsx
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  stunden: number;
};

export function JourneyWarnung({ stunden }: Props) {
  const alert = stunden >= 15;

  return (
    <div
      role={alert ? "alert" : undefined}
      aria-live={alert ? "assertive" : "polite"}
      className={cn(
        "flex items-start gap-3 rounded-2xl border-2 p-5 transition-colors",
        alert
          ? "border-red-300 bg-red-50 text-red-900"
          : "border-amber-200 bg-amber-50 text-amber-900",
      )}
    >
      <AlertTriangle
        className={cn(
          "mt-0.5 h-6 w-6 shrink-0",
          alert ? "text-red-600" : "text-amber-600",
        )}
        aria-hidden="true"
      />
      <div className="space-y-1 text-sm leading-relaxed">
        <div className="font-bold uppercase tracking-wide">
          {alert ? "Stop! ALG I weg" : "Wichtig: 15-Stunden-Grenze"}
        </div>
        <p>
          {alert
            ? "Bei 15 Stunden/Woche verlierst du den kompletten ALG-I-Anspruch – unabhängig vom Verdienst. Reduziere sofort."
            : "Ab 15 Std./Woche verlierst du den kompletten ALG-I-Anspruch. Halte dich strikt unter 14 Std. 59 Min."}
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd C:/Projekte/webseiten/wasnun-jetzt
git add src/components/sections/journey-warnung.tsx
git commit -m "feat: JourneyWarnung mit 15-Stunden-Gate"
```

---

## Task 4: JourneyInput Komponente

**Files:**
- Create: `src/components/sections/journey-input.tsx`

- [ ] **Step 1: Input-Komponente erstellen**

```tsx
"use client";

import { Input } from "@/components/ui/input";

type Props = {
  algI: number;
  stunden: number;
  onAlgIChange: (v: number) => void;
  onStundenChange: (v: number) => void;
};

export function JourneyInput({
  algI,
  stunden,
  onAlgIChange,
  onStundenChange,
}: Props) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div>
        <label
          htmlFor="journey-alg"
          className="mb-2 block text-sm font-bold text-navy-800"
        >
          Dein ALG I pro Monat
        </label>
        <div className="relative">
          <Input
            id="journey-alg"
            type="number"
            min={0}
            inputMode="numeric"
            placeholder="1.200"
            value={algI || ""}
            onChange={(e) => onAlgIChange(parseFloat(e.target.value) || 0)}
            aria-describedby="journey-alg-hint"
          />
          <span className="absolute right-5 top-1/2 -translate-y-1/2 text-2xl font-bold text-navy-400">
            EUR
          </span>
        </div>
        <p id="journey-alg-hint" className="mt-2 text-xs text-navy-500">
          Trage deinen monatlichen Auszahlungsbetrag ein.
        </p>
      </div>

      <div>
        <label
          htmlFor="journey-stunden"
          className="mb-2 block text-sm font-bold text-navy-800"
        >
          Deine Arbeitsstunden pro Woche
        </label>
        <div className="relative">
          <Input
            id="journey-stunden"
            type="number"
            min={0}
            max={14}
            inputMode="numeric"
            placeholder="12"
            value={stunden || ""}
            onChange={(e) => onStundenChange(parseFloat(e.target.value) || 0)}
            aria-describedby="journey-stunden-hint"
          />
          <span className="absolute right-5 top-1/2 -translate-y-1/2 text-2xl font-bold text-navy-400">
            Std
          </span>
        </div>
        <p id="journey-stunden-hint" className="mt-2 text-xs text-navy-500">
          Maximal 14 Std. 59 Min. – darüber verlierst du ALG I komplett.
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd C:/Projekte/webseiten/wasnun-jetzt
git add src/components/sections/journey-input.tsx
git commit -m "feat: JourneyInput mit ALG I + Wochenstunden"
```

---

## Task 5: JourneyTotal Komponente

**Files:**
- Create: `src/components/sections/journey-total.tsx`

- [ ] **Step 1: Running-Total-Box erstellen**

```tsx
import { cn } from "@/lib/utils";
import type { PlanErgebnis } from "@/lib/journey";

type Props = {
  algI: number;
  plan: PlanErgebnis;
};

function formatEur(n: number): string {
  return new Intl.NumberFormat("de-DE").format(n) + " EUR";
}

export function JourneyTotal({ algI, plan }: Props) {
  const hasInput = algI > 0;
  const warnung = plan.warnung15Stunden;

  return (
    <div
      className={cn(
        "rounded-3xl border-2 p-6 shadow-lg transition-all md:sticky md:top-20",
        warnung
          ? "border-red-300 bg-red-50"
          : "border-teal-200 bg-gradient-to-br from-teal-50 to-white",
      )}
    >
      <div className="text-xs font-bold uppercase tracking-widest text-navy-500">
        Dein Plan
      </div>

      {hasInput ? (
        <>
          <div className="mt-2 text-5xl font-black text-teal-600 md:text-6xl">
            +{formatEur(plan.gesamtFreibetrag)}
          </div>
          <div className="mt-1 text-sm text-navy-600">
            abzugsfrei zu deinem ALG I von{" "}
            <strong className="text-navy-900">{formatEur(algI)}</strong>
          </div>
          {plan.hatPassiv && (
            <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-bold text-teal-700">
              + unbegrenzt aus Vermietung/Kapital
            </div>
          )}
          {warnung && (
            <div className="mt-4 rounded-xl bg-red-100 p-3 text-xs font-bold text-red-900">
              Achtung: Deine Stunden-Angabe überschreitet die 15-Std.-Grenze.
              Reduziere sofort, sonst gilt dieser Plan nicht.
            </div>
          )}
        </>
      ) : (
        <div className="mt-2 text-navy-600">
          Tippe oben dein ALG I ein und wähle unten die Pauschalen, die zu dir
          passen.
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd C:/Projekte/webseiten/wasnun-jetzt
git add src/components/sections/journey-total.tsx
git commit -m "feat: JourneyTotal mit Sticky Running-Total und Warn-State"
```

---

## Task 6: JourneyCard Komponente

**Files:**
- Create: `src/components/sections/journey-card.tsx`

- [ ] **Step 1: Wiederverwendbare Karten-Komponente erstellen**

```tsx
"use client";

import { Check, ExternalLink, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { JourneyKarte } from "@/lib/journey";
import { partnerNachIds, type Partner } from "@/lib/partner";

type Props = {
  karte: JourneyKarte;
  aktiv: boolean;
  onToggle: () => void;
};

function PartnerLink({ partner }: { partner: Partner }) {
  return (
    <a
      href={partner.url}
      target="_blank"
      rel="sponsored noopener noreferrer"
      className="group flex items-start justify-between gap-3 rounded-xl border border-navy-100 bg-white p-3 transition-colors hover:border-teal-400"
    >
      <div className="min-w-0">
        <div className="text-sm font-bold text-navy-900 group-hover:text-teal-700">
          {partner.name}
        </div>
        <div className="truncate text-xs text-navy-500">
          {partner.beschreibung}
        </div>
        <div className="mt-0.5 text-xs font-bold text-teal-600">
          {partner.verdienst}
        </div>
      </div>
      <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-navy-400 group-hover:text-teal-500" />
    </a>
  );
}

export function JourneyCard({ karte, aktiv, onToggle }: Props) {
  const partner = partnerNachIds(karte.partnerIds);
  const kannToggeln = !karte.immerAktiv;

  return (
    <article
      aria-labelledby={`karte-${karte.id}-titel`}
      className={cn(
        "flex flex-col overflow-hidden rounded-3xl border-2 bg-white transition-all",
        aktiv
          ? "border-teal-500 shadow-lg shadow-teal-500/10"
          : "border-navy-100",
      )}
    >
      <div
        className={cn(
          "border-b p-6 transition-colors",
          aktiv ? "border-teal-200 bg-teal-50" : "border-navy-100 bg-navy-50/30",
        )}
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <Badge variant={karte.immerAktiv ? "teal" : aktiv ? "teal" : "outline"}>
            {karte.badge}
          </Badge>
          {kannToggeln ? (
            <button
              type="button"
              onClick={onToggle}
              aria-pressed={aktiv}
              aria-label={`${karte.titel} ${aktiv ? "entfernen" : "hinzufügen"}`}
              className={cn(
                "flex h-8 items-center gap-2 rounded-full border-2 px-3 text-xs font-bold transition-all",
                aktiv
                  ? "border-teal-500 bg-teal-500 text-white"
                  : "border-navy-200 bg-white text-navy-600 hover:border-teal-400",
              )}
            >
              {aktiv ? (
                <>
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  Im Plan
                </>
              ) : (
                "Zu meinem Plan"
              )}
            </button>
          ) : (
            <div
              aria-disabled="true"
              className="flex h-8 items-center gap-2 rounded-full border-2 border-teal-500 bg-teal-500 px-3 text-xs font-bold text-white"
            >
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
              Immer dabei
            </div>
          )}
        </div>
        <h3
          id={`karte-${karte.id}-titel`}
          className="text-xl font-black leading-tight text-navy-900"
        >
          {karte.titel}
        </h3>
        <div className="mt-1 font-mono text-xs text-navy-500">
          {karte.paragraph}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <p className="text-sm leading-relaxed text-navy-700">
          {karte.erklaerung}
        </p>

        {karte.tipp && (
          <div className="rounded-xl bg-teal-50 p-3 text-xs leading-relaxed text-teal-900">
            <strong>Tipp:</strong> {karte.tipp}
          </div>
        )}

        {partner.length > 0 && (
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="outline" className="text-[10px]">
                Werbung
              </Badge>
              <span className="text-xs font-bold uppercase tracking-wide text-navy-500">
                So fängst du an
              </span>
            </div>
            <div className="grid gap-2">
              {partner.map((p) => (
                <PartnerLink key={p.id} partner={p} />
              ))}
            </div>
          </div>
        )}

        {karte.bildungsgutschein && (
          <div className="rounded-2xl border-2 border-dashed border-teal-300 bg-teal-50/50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-teal-600" aria-hidden="true" />
              <div className="text-sm font-bold text-navy-900">
                Qualifikation fehlt? Bildungsgutschein nutzen
              </div>
            </div>
            <p className="text-xs leading-relaxed text-navy-600">
              Keine Trainer-Lizenz? Mit dem Bildungsgutschein (§ 81 SGB III)
              holst du dir die C-Trainer-Lizenz kostenlos in 16 Wochen online.
            </p>
            <a
              href="https://www.arbeitsagentur.de/bildungsgutschein"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:underline"
            >
              Mehr zum Bildungsgutschein
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        )}

        {karte.unterabschnitte && karte.unterabschnitte.length > 0 && (
          <div className="space-y-4">
            {karte.unterabschnitte.map((abschnitt) => {
              const abPartner = partnerNachIds(abschnitt.partnerIds);
              return (
                <div key={abschnitt.titel}>
                  <div className="mb-2 flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px]">
                      Werbung
                    </Badge>
                    <span className="text-xs font-bold uppercase tracking-wide text-navy-500">
                      {abschnitt.titel}
                    </span>
                  </div>
                  <div className="grid gap-2">
                    {abPartner.map((p) => (
                      <PartnerLink key={p.id} partner={p} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </article>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd C:/Projekte/webseiten/wasnun-jetzt
git add src/components/sections/journey-card.tsx
git commit -m "feat: JourneyCard mit Toggle, Werbe-Kennzeichnung und Sub-Module"
```

---

## Task 7: NewsletterForm Komponente + API-Route

**Files:**
- Create: `src/components/sections/newsletter-form.tsx`
- Create: `src/app/api/newsletter/route.ts`

- [ ] **Step 1: API-Route mit In-Memory Rate-Limit erstellen**

```typescript
// src/app/api/newsletter/route.ts
import { NextResponse } from "next/server";

// In-Memory-Rate-Limit: max. 3 Requests pro IP pro Minute.
// Reicht für MVP; vor Go-Live durch echten Provider ersetzen.
const buckets = new Map<string, { count: number; reset: number }>();
const LIMIT = 3;
const WINDOW_MS = 60_000;

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const bucket = buckets.get(ip);
  if (!bucket || bucket.reset < now) {
    buckets.set(ip, { count: 1, reset: now + WINDOW_MS });
    return true;
  }
  if (bucket.count >= LIMIT) return false;
  bucket.count += 1;
  return true;
}

function isValidEmail(email: unknown): email is string {
  return (
    typeof email === "string" &&
    email.length > 3 &&
    email.length < 255 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  );
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (!rateLimit(ip)) {
    return NextResponse.json(
      { error: "Zu viele Anfragen. Bitte warte eine Minute." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Ungültige Anfrage." },
      { status: 400 },
    );
  }

  const email = (body as { email?: unknown })?.email;
  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "Bitte gültige E-Mail-Adresse eintragen." },
      { status: 400 },
    );
  }

  // TODO: echten Newsletter-Provider anbinden
  // (Resend / Plunk / Mailchimp) vor Go-Live.
  // Für jetzt nur loggen.
  console.log("[newsletter] Neue Eintragung:", email);

  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 2: NewsletterForm-Komponente erstellen**

```tsx
// src/components/sections/newsletter-form.tsx
"use client";

import { useState, type FormEvent } from "react";
import { Check, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Status = "idle" | "loading" | "success" | "error";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [fehler, setFehler] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setFehler(null);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "Etwas ist schiefgelaufen.");
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setFehler(err instanceof Error ? err.message : "Probiere es später nochmal.");
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-center gap-3 rounded-2xl border-2 border-teal-300 bg-teal-50 p-5 text-teal-900">
        <Check className="h-6 w-6 text-teal-600" aria-hidden="true" />
        <div>
          <div className="font-bold">Danke!</div>
          <div className="text-sm">Schau in dein Postfach – dein Plan ist unterwegs.</div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-navy-100 bg-white p-5"
      aria-label="Newsletter-Anmeldung"
    >
      <div className="mb-3 flex items-center gap-2 text-sm font-bold text-navy-900">
        <Mail className="h-4 w-4 text-teal-600" aria-hidden="true" />
        Plan per E-Mail + 1× im Monat neue Tipps
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          type="email"
          required
          placeholder="deine@email.de"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading"}
          aria-label="E-Mail-Adresse"
          className="h-12 text-base"
        />
        <Button
          type="submit"
          variant="primary"
          disabled={status === "loading"}
          className="h-12"
        >
          {status === "loading" ? "Sende…" : "Eintragen"}
        </Button>
      </div>
      {fehler && (
        <div role="alert" className="mt-3 text-sm text-red-700">
          {fehler}
        </div>
      )}
      <p className="mt-3 text-xs text-navy-500">
        Freiwillig, kein Tracking. Abmeldung mit einem Klick.
      </p>
    </form>
  );
}
```

- [ ] **Step 3: Commit**

```bash
cd C:/Projekte/webseiten/wasnun-jetzt
git add src/components/sections/newsletter-form.tsx src/app/api/newsletter/route.ts
git commit -m "feat: NewsletterForm + Placeholder-API mit Rate-Limit"
```

---

## Task 8: JourneySummary Komponente

**Files:**
- Create: `src/components/sections/journey-summary.tsx`

- [ ] **Step 1: Summary-Block mit nummerierten Schritten erstellen**

```tsx
import { AlertTriangle, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { JourneyKarte, PlanErgebnis } from "@/lib/journey";
import { JOURNEY_KARTEN } from "@/lib/journey";
import { NewsletterForm } from "./newsletter-form";

type Props = {
  algI: number;
  plan: PlanErgebnis;
  aktivKarten: Set<string>;
};

function formatEur(n: number): string {
  return new Intl.NumberFormat("de-DE").format(n) + " EUR";
}

function schrittText(karte: JourneyKarte): string {
  switch (karte.id) {
    case "grundfreibetrag":
      return "165 EUR Grundfreibetrag – melde dich bei einer der Minijob-Plattformen oben an (Zenjob, Coople, Clickworker). Ca. 11–12 Std./Monat sind sicher.";
    case "uebungsleiter":
      return "275 EUR Übungsleiterpauschale – suche einen gemeinnützigen Verein in deiner Stadt über BAGFA. Ohne Lizenz: C-Trainer-Kurs mit Bildungsgutschein beantragen.";
    case "ehrenamt":
      return "80 EUR Ehrenamtspauschale – frag bei deiner lokalen Freiwilligenagentur nach administrativen Rollen (Vorstand, Kassenwart, Platzwart).";
    case "passiv":
      return "Passive Einkommen – prüfe Vermietung (Zimmer via WG-Gesucht) und Tagesgeld-Vergleich. Beides wird bei ALG I NICHT angerechnet.";
    default:
      return "";
  }
}

export function JourneySummary({ algI, plan, aktivKarten }: Props) {
  if (algI <= 0) return null;

  const aktiveSchritte = JOURNEY_KARTEN.filter((k) => aktivKarten.has(k.id));

  return (
    <div className="rounded-3xl border border-navy-100 bg-gradient-to-br from-navy-50 to-white p-6 md:p-10">
      <Badge variant="teal" className="mb-3">
        Schritt 3 von 3
      </Badge>
      <h3 className="text-3xl font-black text-navy-900 md:text-4xl">
        Dein Plan ist fertig
      </h3>
      <div className="mt-4 text-5xl font-black text-teal-600 md:text-6xl">
        +{formatEur(plan.gesamtFreibetrag)}
      </div>
      <div className="mt-1 text-navy-600">
        abzugsfrei zu deinem ALG I von{" "}
        <strong className="text-navy-900">{formatEur(algI)}</strong>
        {plan.hatPassiv && (
          <>
            {" "}
            + <strong className="text-teal-700">unbegrenzt aus Vermietung/Kapital</strong>
          </>
        )}
      </div>

      {plan.warnung15Stunden && (
        <div
          role="alert"
          className="mt-6 flex items-start gap-3 rounded-2xl border-2 border-red-300 bg-red-50 p-4 text-sm text-red-900"
        >
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" aria-hidden="true" />
          <div>
            <strong>Achtung:</strong> Bei 15 oder mehr Arbeitsstunden pro Woche
            verlierst du den ALG-I-Anspruch komplett. Sobald deine Stunden unter
            15 liegen, kannst du diesen Plan umsetzen.
          </div>
        </div>
      )}

      <div className="mt-8">
        <div className="mb-3 text-sm font-bold uppercase tracking-wide text-navy-500">
          So startest du
        </div>
        <ol className="space-y-3">
          {aktiveSchritte.map((karte, i) => (
            <li
              key={karte.id}
              className="flex items-start gap-3 rounded-2xl border border-navy-100 bg-white p-4"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-500 text-sm font-black text-white">
                {i + 1}
              </div>
              <div className="text-sm leading-relaxed text-navy-700">
                {schrittText(karte)}
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-2xl border-2 border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <Phone className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" />
        <div>
          <strong>Meldepflicht (Pflicht!):</strong> Jede Nebentätigkeit muss
          spätestens am ersten Arbeitstag bei der Agentur für Arbeit gemeldet
          werden. Hotline: <strong>0800 4 5555 00</strong>
        </div>
      </div>

      <div className="mt-8">
        <NewsletterForm />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd C:/Projekte/webseiten/wasnun-jetzt
git add src/components/sections/journey-summary.tsx
git commit -m "feat: JourneySummary mit nummerierten Schritten und Newsletter"
```

---

## Task 9: Journey Orchestrator

**Files:**
- Create: `src/components/sections/journey.tsx`

- [ ] **Step 1: Orchestrator-Komponente mit State erstellen**

```tsx
"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  JOURNEY_KARTEN,
  berechnePlan,
  type KartenId,
} from "@/lib/journey";
import { JourneyWarnung } from "./journey-warnung";
import { JourneyInput } from "./journey-input";
import { JourneyTotal } from "./journey-total";
import { JourneyCard } from "./journey-card";
import { JourneySummary } from "./journey-summary";

export function Journey() {
  const [algI, setAlgI] = useState(0);
  const [stunden, setStunden] = useState(12);
  const [aktivKarten, setAktivKarten] = useState<Set<string>>(
    () => new Set<string>(["grundfreibetrag"]),
  );

  const plan = useMemo(
    () => berechnePlan({ algI, stunden, aktivKarten }),
    [algI, stunden, aktivKarten],
  );

  const toggleKarte = (id: KartenId) => {
    if (id === "grundfreibetrag") return;
    setAktivKarten((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section
      id="rechner"
      className="scroll-mt-24 border-t border-navy-100 bg-navy-50/40 py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-10 text-center">
          <Badge variant="teal" className="mb-4">
            Schritt 1 von 3
          </Badge>
          <h2 className="text-balance text-3xl font-black text-navy-900 md:text-5xl">
            Dein persönlicher Plan
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-balance text-lg text-navy-600">
            Trage dein ALG I ein, wähle die Pauschalen, die zu dir passen, und
            hol dir deinen Umsetzungs-Plan.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
          <div className="space-y-6">
            <JourneyWarnung stunden={stunden} />
            <JourneyInput
              algI={algI}
              stunden={stunden}
              onAlgIChange={setAlgI}
              onStundenChange={setStunden}
            />

            <div className="md:hidden">
              <JourneyTotal algI={algI} plan={plan} />
            </div>

            <div>
              <Badge variant="teal" className="mb-4">
                Schritt 2 von 3
              </Badge>
              <h3 className="mb-2 text-2xl font-black text-navy-900 md:text-3xl">
                Welche Pauschalen passen zu dir?
              </h3>
              <p className="text-sm text-navy-600">
                Die 165 EUR Grundfreibetrag bekommst du immer. Aktiviere, was
                zusätzlich auf dich zutrifft – dein Plan aktualisiert sich live.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {JOURNEY_KARTEN.map((karte) => (
                <JourneyCard
                  key={karte.id}
                  karte={karte}
                  aktiv={aktivKarten.has(karte.id)}
                  onToggle={() => toggleKarte(karte.id)}
                />
              ))}
            </div>

            <JourneySummary algI={algI} plan={plan} aktivKarten={aktivKarten} />
          </div>

          <aside className="hidden lg:block">
            <JourneyTotal algI={algI} plan={plan} />
          </aside>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd C:/Projekte/webseiten/wasnun-jetzt
git add src/components/sections/journey.tsx
git commit -m "feat: Journey Orchestrator mit State-Management"
```

---

## Task 10: Bürgergeld-Platzhalterseite

**Files:**
- Create: `src/app/buergergeld/page.tsx`

- [ ] **Step 1: Platzhalter-Seite erstellen**

```tsx
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Bürgergeld – kommt bald",
  robots: { index: false, follow: true },
};

export default function BuergergeldPage() {
  return (
    <main className="min-h-screen bg-navy-50/40 py-20">
      <div className="mx-auto max-w-2xl px-4 md:px-6">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-teal-600 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Zurück zur Startseite
        </Link>

        <Badge variant="amber" className="mb-4">
          <Clock className="mr-1 h-3 w-3" aria-hidden="true" />
          In Arbeit
        </Badge>

        <h1 className="mb-4 text-4xl font-black text-navy-900 md:text-5xl">
          Bürgergeld – kommt bald
        </h1>

        <p className="mb-6 text-lg leading-relaxed text-navy-700">
          Wir bauen gerade einen eigenen Journey speziell für Bürgergeld-
          Bezieher. Die Regeln sind ganz anders als bei ALG I:
        </p>

        <ul className="mb-8 space-y-3 text-navy-600">
          <li>
            <strong className="text-navy-900">Gestaffelter Freibetrag</strong>{" "}
            nach § 11b SGB II: 0–100 EUR komplett frei, 100–520 EUR zu 20 %
            frei, 520–1.000 EUR zu 30 % frei
          </li>
          <li>
            <strong className="text-navy-900">Keine Stundengrenze</strong> – du
            darfst so viel arbeiten, wie du willst
          </li>
          <li>
            <strong className="text-navy-900">Andere Pauschalen-Wirkung</strong>{" "}
            und andere passende Plattformen
          </li>
        </ul>

        <p className="mb-8 text-navy-600">
          Bis dahin: Auf der Startseite zeigen wir den ALG-I-Journey mit allen
          Pauschalen-Tricks.
        </p>

        <Button variant="primary" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Zum ALG-I-Journey
          </Link>
        </Button>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd C:/Projekte/webseiten/wasnun-jetzt
git add src/app/buergergeld/page.tsx
git commit -m "feat: /buergergeld Platzhalter-Seite"
```

---

## Task 11: Hero aktualisieren – 520 EUR + 15-Stunden-Hinweis

**Files:**
- Modify: `src/components/sections/hero.tsx`

- [ ] **Step 1: Hero komplett ersetzen**

Ersetze den gesamten Inhalt von `src/components/sections/hero.tsx` mit:

```tsx
import { ArrowRight, AlertTriangle, Lock, ShieldCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LEGAL } from "@/lib/data";

export function Hero() {
  return (
    <section
      id="haupt"
      className="relative overflow-hidden border-b border-navy-100 bg-gradient-to-br from-navy-50 via-white to-teal-50"
    >
      <div className="absolute inset-0 bg-grid-navy opacity-60" aria-hidden="true" />
      <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-teal-200/30 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-navy-200/30 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Badge variant="success" className="mb-6 gap-2">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-500" />
              Aktualisiert für April 2026 · Nur ALG I
            </Badge>

            <h1 className="mb-6 text-balance text-4xl font-black leading-[1.05] tracking-tight text-navy-900 md:text-6xl lg:text-7xl">
              Du beziehst ALG I. Bis zu{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-teal-600">520 EUR</span>
                <span
                  className="absolute -bottom-1 left-0 right-0 h-3 bg-teal-200/70"
                  aria-hidden="true"
                />
              </span>{" "}
              legal dazuverdienen – ohne Abzug.
            </h1>

            <p className="mb-6 max-w-xl text-balance text-lg leading-relaxed text-navy-600 md:text-xl">
              Kombiniere den Grundfreibetrag mit Übungsleiter- und
              Ehrenamtspauschale. Plus unbegrenzt aus Vermietung und Kapital.{" "}
              <strong className="text-navy-900">
                Kennen die wenigsten – ist aber alles völlig legal.
              </strong>
            </p>

            <div
              role="note"
              className="mb-8 flex items-start gap-3 rounded-2xl border-2 border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
            >
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" />
              <div>
                <strong>Der einzige Haken:</strong> maximal 14 Std. 59 Min. pro
                Woche arbeiten. Bei 15 Stunden oder mehr verlierst du den
                kompletten ALG-I-Anspruch.
              </div>
            </div>

            <div className="mb-10 flex flex-col gap-3 sm:flex-row">
              <Button variant="primary" size="xl" asChild>
                <a href="#rechner">
                  In 60 Sek. deinen Plan erstellen
                  <ArrowRight className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <a href="#faq">Häufige Fragen</a>
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-navy-600">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-teal-600" aria-hidden="true" />
                <span>Anonym – keine Anmeldung</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-teal-600" aria-hidden="true" />
                <span>SGB III &amp; EStG als Grundlage</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-teal-600" aria-hidden="true" />
                <span>Stand {LEGAL.alg1.stand}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-teal-400/40 to-navy-400/20 blur-2xl" />
              <div className="relative rounded-3xl border border-navy-100 bg-white p-8 shadow-2xl shadow-navy-900/10">
                <div className="mb-5 text-xs font-bold uppercase tracking-widest text-navy-500">
                  Beispielrechnung ALG I
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-navy-600">Grundfreibetrag</span>
                    <span className="text-2xl font-bold text-teal-600">+165 EUR</span>
                  </div>
                  <div className="h-px bg-navy-100" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-navy-600">Übungsleiter</span>
                    <span className="text-2xl font-bold text-teal-600">+275 EUR</span>
                  </div>
                  <div className="h-px bg-navy-100" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-navy-600">Ehrenamt</span>
                    <span className="text-2xl font-bold text-teal-600">+80 EUR</span>
                  </div>
                  <div className="h-px bg-navy-100" />
                  <div className="rounded-2xl bg-navy-900 p-5 text-white">
                    <div className="text-xs font-bold uppercase tracking-widest text-teal-400">
                      Zusätzlich pro Monat
                    </div>
                    <div className="mt-1 text-4xl font-black">520 EUR</div>
                    <div className="mt-1 text-xs text-navy-200">
                      Komplett anrechnungsfrei
                    </div>
                  </div>
                  <div className="text-center text-xs text-navy-500">
                    + unbegrenzt Mieten &amp; Kapital
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd C:/Projekte/webseiten/wasnun-jetzt
git add src/components/sections/hero.tsx
git commit -m "feat: Hero auf 520 EUR mit 15-Stunden-Warnung umgestellt"
```

---

## Task 12: SiteHeader Navigation anpassen

**Files:**
- Modify: `src/components/sections/site-header.tsx`

- [ ] **Step 1: Navigation-Links austauschen**

Ersetze den gesamten Inhalt von `src/components/sections/site-header.tsx` mit:

```tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [offen, setOffen] = useState(false);

  const links = [
    { href: "/#rechner", label: "Dein Plan" },
    { href: "/#faq", label: "FAQ" },
    { href: "/buergergeld", label: "Bürgergeld" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-navy-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy-800 text-white">
            <Calculator className="h-5 w-5 text-teal-400" aria-hidden="true" />
          </div>
          <span className="text-lg tracking-tight text-navy-900">
            WasNun<span className="text-teal-500">.jetzt</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Hauptnavigation">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-semibold text-navy-600 transition-colors hover:text-teal-600"
            >
              {l.label}
            </Link>
          ))}
          <Button variant="primary" size="sm" asChild>
            <a href="/#rechner">In 60 Sek. rechnen</a>
          </Button>
        </nav>

        <button
          className="md:hidden"
          onClick={() => setOffen(!offen)}
          aria-label={offen ? "Menü schließen" : "Menü öffnen"}
          aria-expanded={offen}
        >
          {offen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-navy-100 bg-white transition-all md:hidden",
          offen ? "max-h-96" : "max-h-0",
        )}
      >
        <div className="flex flex-col gap-1 p-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOffen(false)}
              className="rounded-lg px-4 py-3 text-base font-semibold text-navy-800 hover:bg-navy-50"
            >
              {l.label}
            </Link>
          ))}
          <Button variant="primary" className="mt-2" asChild>
            <a href="/#rechner" onClick={() => setOffen(false)}>
              In 60 Sek. rechnen
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd C:/Projekte/webseiten/wasnun-jetzt
git add src/components/sections/site-header.tsx
git commit -m "feat: SiteHeader Navigation auf Dein Plan/FAQ/Bürgergeld"
```

---

## Task 13: FAQ auf ALG-I-Fokus aktualisieren

**Files:**
- Modify: `src/components/sections/faq.tsx`

- [ ] **Step 1: FAQ-Content austauschen**

Ersetze den gesamten Inhalt von `src/components/sections/faq.tsx` mit:

```tsx
import Script from "next/script";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqSchema, type FaqItem } from "@/lib/structured-data";

const FAQ: FaqItem[] = [
  {
    frage: "Wie viel darf ich als ALG-I-Empfänger wirklich dazuverdienen ohne Abzug?",
    antwort:
      "Der pauschale Freibetrag liegt bei 165 EUR pro Monat (§ 155 SGB III). Zusätzlich kannst du die Übungsleiterpauschale (275 EUR) und die Ehrenamtspauschale (80 EUR) kombinieren – macht maximal 520 EUR komplett anrechnungsfrei pro Monat. Mieteinnahmen und Kapitalerträge werden bei ALG I gar nicht angerechnet.",
  },
  {
    frage: "Warum zeigen andere Seiten 603 EUR? Stimmt das nicht?",
    antwort:
      "603 EUR ist die allgemeine Minijob-Grenze 2026. Sie gilt aber nicht als Freibetrag beim ALG I. Wer mehr als 165 EUR verdient, bekommt alles darüber 1:1 vom ALG I abgezogen. Erst die Kombination mit Übungsleiter- und Ehrenamtspauschale bringt wirklich mehr Geld in die Tasche.",
  },
  {
    frage: "Was passiert wenn ich über 15 Stunden pro Woche arbeite?",
    antwort:
      "Dann verlierst du den ALG-I-Anspruch komplett – egal wie viel du verdienst. Die 15-Stunden-Grenze ist wichtiger als jede Freibetrag-Regel. Halte dich strikt unter 14 Std. 59 Min. pro Woche. Meldepflicht: Nebentätigkeit spätestens am ersten Arbeitstag bei der Agentur anzeigen.",
  },
  {
    frage: "Was ist die Übungsleiterpauschale und wer bekommt sie?",
    antwort:
      "Die Übungsleiterpauschale nach § 3 Nr. 26 EStG erlaubt 275 EUR pro Monat (3.300 EUR pro Jahr) steuerfrei zu verdienen. Voraussetzung: Tätigkeit als Trainer, Chorleiter, Betreuer oder Ausbilder bei einem gemeinnützigen Verein oder einer öffentlichen Einrichtung. Sie wird bei ALG I komplett nicht angerechnet – zusätzlich zum Grundfreibetrag.",
  },
  {
    frage: "Kann ich Übungsleiter- und Ehrenamtspauschale gleichzeitig nutzen?",
    antwort:
      "Ja, für verschiedene Tätigkeiten. Bist du gleichzeitig Trainer (275 EUR Übungsleiterpauschale) UND Kassenwart (80 EUR Ehrenamtspauschale) bei demselben Verein, kannst du beide kombinieren – zusammen mit dem Grundfreibetrag kommst du auf 520 EUR im Monat komplett anrechnungsfrei.",
  },
  {
    frage: "Ich habe keine Trainer-Lizenz. Wie bekomme ich trotzdem die Übungsleiterpauschale?",
    antwort:
      "Über den Bildungsgutschein (§ 81 SGB III) der Agentur für Arbeit. Er finanziert AZAV-zertifizierte Weiterbildungen zu 100 %. Die C-Trainer-Lizenz Breitensport ist in 16 Wochen online zu schaffen. Einfach beim nächsten Beratungsgespräch aktiv nachfragen.",
  },
  {
    frage: "Werden Mieteinnahmen auf mein ALG I angerechnet?",
    antwort:
      "Nein. Beim ALG I werden nur Erwerbseinkommen angerechnet – Mieteinnahmen und Kapitalerträge (Zinsen, Dividenden) fallen nicht darunter. Du kannst also unbegrenzt aus Vermietung und Geldanlagen dazuverdienen ohne dein ALG I zu verlieren. Wichtig: Beim Bürgergeld gelten andere Regeln.",
  },
  {
    frage: "Muss ich meinen Nebenjob bei der Agentur melden?",
    antwort:
      "Ja, unbedingt. Jede Nebentätigkeit muss spätestens am ersten Arbeitstag bei der Agentur für Arbeit gemeldet werden. Verspätete Meldung führt zu Rückforderungen. Meldung über arbeitsagentur.de oder per Telefon: 0800 4 5555 00.",
  },
  {
    frage: "Sind die Angaben auf WasNun.jetzt rechtsverbindlich?",
    antwort:
      "Nein. WasNun.jetzt ist ein kostenloses Informationsangebot ohne Rechtsberatung. Alle Inhalte sind sorgfältig recherchiert und basieren auf dem aktuellen SGB III und EStG, aber Gesetze können sich ändern und individuelle Fälle sind unterschiedlich. Prüfe wichtige Entscheidungen immer mit deiner Agentur für Arbeit (0800 4 5555 00).",
  },
];

export function Faq() {
  return (
    <section
      id="faq"
      className="scroll-mt-24 border-t border-navy-100 bg-navy-50 py-20 md:py-28"
    >
      <Script
        id="ld-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema(FAQ)),
        }}
      />
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <div className="mb-10 text-center">
          <Badge variant="teal" className="mb-4">
            Häufige Fragen
          </Badge>
          <h2 className="mb-4 text-balance text-3xl font-black text-navy-900 md:text-5xl">
            Die wichtigsten Fragen zum Hinzuverdienst
          </h2>
          <p className="text-balance text-navy-600">
            Alle Angaben basieren auf SGB III und EStG, Stand{" "}
            <strong>April 2026</strong>.
          </p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm md:p-10">
          <Accordion type="single" collapsible className="w-full">
            {FAQ.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{item.frage}</AccordionTrigger>
                <AccordionContent>{item.antwort}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd C:/Projekte/webseiten/wasnun-jetzt
git add src/components/sections/faq.tsx
git commit -m "feat: FAQ auf ALG-I-Fokus aktualisiert"
```

---

## Task 14: Alte Sections löschen + page.tsx verdrahten + data.ts cleanup

**Files:**
- Delete: `src/components/sections/rechner.tsx`
- Delete: `src/components/sections/verdienst-finder.tsx`
- Delete: `src/components/sections/verdienstwege.tsx`
- Delete: `src/components/sections/bildungsgutschein.tsx`
- Modify: `src/lib/data.ts`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Alte Komponenten löschen**

```bash
cd C:/Projekte/webseiten/wasnun-jetzt
rm src/components/sections/rechner.tsx
rm src/components/sections/verdienst-finder.tsx
rm src/components/sections/verdienstwege.tsx
rm src/components/sections/bildungsgutschein.tsx
```

- [ ] **Step 2: data.ts aufräumen**

Ersetze den gesamten Inhalt von `src/lib/data.ts` mit:

```typescript
// ─────────────────────────────────────────────────────────
// lib/data.ts – Rechtskonstanten und Impressum-Daten
// Bei Gesetzesänderungen NUR HIER anpassen!
// Stand: April 2026
// ─────────────────────────────────────────────────────────

export const LEGAL = {
  alg1: {
    freibetrag: 165,
    maxStunden: 14,
    hotline: "0800 4 5555 00",
    portal: "arbeitsagentur.de",
    stand: "April 2026",
  },
  buergergeld: {
    grundfreibetrag: 100,
    staffel1Max: 520,
    staffel1Rate: 0.2,
    staffel2Max: 1000,
    staffel2Rate: 0.3,
    portal: "jobcenter.digital",
    stand: "April 2026",
    regelsatz: 563,
  },
  minijob: {
    grenze: 603,
    mindestlohn: 13.9,
  },
  pauschalen: {
    uebungsleiter: { jahr: 3300, monat: 275, paragraph: "§ 3 Nr. 26 EStG" },
    ehrenamt: { jahr: 960, monat: 80, paragraph: "§ 3 Nr. 26a EStG" },
    kombiniert: { jahr: 4260, monat: 355 },
  },
};

export const IMPRESSUM = {
  name: "Norbert Sommer",
  firma: "Einzelunternehmen",
  strasse: "Langgewann 18",
  ort: "69121 Heidelberg",
  land: "Deutschland",
  tel: "06221 43125 08",
  mail: "office@doylim.com",
  ust: "DE320652316",
};
```

- [ ] **Step 3: page.tsx auf neue Journey umbauen**

Ersetze den gesamten Inhalt von `src/app/page.tsx` mit:

```tsx
import { SiteHeader } from "@/components/sections/site-header";
import { Hero } from "@/components/sections/hero";
import { Journey } from "@/components/sections/journey";
import { Faq } from "@/components/sections/faq";
import { Trust } from "@/components/sections/trust";
import { Rechtshinweis } from "@/components/sections/rechtshinweis";
import { SiteFooter } from "@/components/sections/site-footer";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Journey />
        <Faq />
        <Trust />
        <Rechtshinweis />
      </main>
      <SiteFooter />
    </>
  );
}
```

- [ ] **Step 4: Commit**

```bash
cd C:/Projekte/webseiten/wasnun-jetzt
git add -A
git commit -m "refactor: alte Sections gelöscht, page.tsx auf Journey umgestellt, data.ts aufgeräumt"
```

---

## Task 15: Build-Validation

**Files:** keine Änderungen, nur Verifikation

- [ ] **Step 1: Production Build ausführen**

Run: `cd C:/Projekte/webseiten/wasnun-jetzt && npm run build`
Expected:
- `Compiled successfully`
- `Running TypeScript ...` ohne Errors
- `Generating static pages using 3 workers (8/8)` (acht Routes: `/`, `/_not-found`, `/datenschutz`, `/impressum`, `/buergergeld`, `/robots.txt`, `/sitemap.xml`, plus die neue `/api/newsletter`)
- Keine Warning über fehlende not-found

Bei Fehler: Lies die Fehlermeldung, fixe den Code, run erneut. Typische Fehler: vergessener Import, falsch geschriebener Type-Name, fehlendes `"use client"`.

- [ ] **Step 2: Lint-Check**

Run: `cd C:/Projekte/webseiten/wasnun-jetzt && npm run lint`
Expected: Keine ESLint-Errors

- [ ] **Step 3: Dev-Server starten**

Run: `cd C:/Projekte/webseiten/wasnun-jetzt && npm run dev` (im Hintergrund)
Expected: `✓ Ready in <2s`, Port 3000 oder 3001

---

## Task 16: Manuelle Test-Checkliste

**Files:** keine Änderungen, nur Verifikation im Browser

- [ ] **Step 1: Startseite laden und Hero prüfen**

Öffne `http://localhost:3000/` im Browser.
Expected:
- Hero zeigt "520 EUR" als zentrale Zahl
- Amber-Warnbox mit 15-Std.-Hinweis sichtbar
- Beispielrechnung-Card rechts zeigt 165 + 275 + 80 = 520 EUR
- Keine Console-Errors in DevTools

- [ ] **Step 2: Journey-Interaktion durchspielen**

- Input "ALG I" = 1200 eintippen → JourneyTotal zeigt `+165 EUR` in teal
- Karte "Übungsleiter" togglen → Total wechselt auf `+440 EUR`, Card bekommt teal-Border
- Karte "Ehrenamt" togglen → Total auf `+520 EUR`
- Karte "Passiv" togglen → Total zeigt Zusatzzeile "unbegrenzt aus Vermietung/Kapital"
- Klick auf Grundfreibetrag-"Immer dabei"-Pill → nichts passiert (korrekt)
- JourneySummary unten zeigt 4 nummerierte Schritte

- [ ] **Step 3: 15-Stunden-Warnung auslösen**

- Stunden = 15 eintippen
- JourneyWarnung wird rot, Text "Stop! ALG I weg"
- JourneyTotal bekommt roten Warn-Rand + Erklärungsbox
- JourneySummary zeigt zusätzlich rote Warn-Box
- Role-Alert wird bei screen reader ausgelöst (falls NVDA/VoiceOver verfügbar)

- [ ] **Step 4: Affiliate-Links prüfen**

- Klick auf "Zenjob" → neues Tab öffnet sich
- Im DevTools Inspector: `rel="sponsored noopener noreferrer"` und `target="_blank"` vorhanden
- Sichtbares "Werbung"-Badge über den Link-Listen

- [ ] **Step 5: Mobile-Viewport prüfen**

- DevTools → Device Toolbar → iPhone 12 Pro oder 375×667
- Alle Karten sind 1-spaltig untereinander
- Burger-Menü funktioniert (öffnen, schließen, Links anklickbar)
- JourneyTotal ist NICHT sticky auf Mobile, sondern im Fluss zwischen Input und Karten
- Touch-Targets alle mindestens 44×44 px (gut sichtbar)

- [ ] **Step 6: Tastatur-Navigation**

- Seite mit Tab durchklicken
- Jeder Input, jeder Toggle, jeder Link ist erreichbar
- Focus-Ring ist sichtbar (teal outline)
- Enter/Space aktivieren die Toggles
- Skip-Link erscheint bei erstem Tab

- [ ] **Step 7: `/buergergeld` prüfen**

- Navigiere zu `http://localhost:3000/buergergeld`
- Platzhalter-Seite erscheint mit "Kommt bald"
- Link "Zurück zur Startseite" funktioniert

- [ ] **Step 8: FAQ prüfen**

- Scroll zur FAQ-Section (via Nav-Link "FAQ")
- Erste Frage lautet "Wie viel darf ich als ALG-I-Empfänger wirklich dazuverdienen ohne Abzug?"
- Antworten aufklappen funktioniert (Accordion)
- Alle Antworten drehen sich um ALG I, nicht mehr um Bürgergeld

- [ ] **Step 9: Newsletter-Formular testen**

- Unten im Summary-Block: E-Mail "test@example.com" eintragen, Submit
- Erfolgs-Meldung erscheint
- Im Terminal (Dev-Server-Output) siehst du `[newsletter] Neue Eintragung: test@example.com`
- Zweiter Submit innerhalb einer Minute von gleicher IP: Rate-Limit-Fehler erwartet (ab 4. Versuch)

- [ ] **Step 10: Umlaute-Check**

Run:
```bash
cd C:/Projekte/webseiten/wasnun-jetzt
grep -rn -E '\b(fuer|ueber|Uebung|Buerger|koennen|moeglich|naechst|spaet|pruefen|erklaer|gemaess|naemlich|taetig|waehrend|gross[^e]|schliess|aendern|Aenderung|Pruef|Foerder|muessen|Taetig|Faell)\w*' src/components/sections/journey*.tsx src/components/sections/hero.tsx src/components/sections/faq.tsx src/components/sections/site-header.tsx src/components/sections/newsletter-form.tsx src/app/buergergeld/page.tsx src/lib/journey.ts src/lib/partner.ts || echo "OK - keine falschen Umlaute gefunden"
```

Expected: `OK - keine falschen Umlaute gefunden`. Falls Treffer: in der entsprechenden Datei korrigieren (ae → ä, oe → ö, ue → ü, ss → ß bei deutschen Wörtern), aber **nicht** bei TypeScript-Identifiern wie `uebungsleiter` (Tag-Strings, Object-Keys, Variablen).

- [ ] **Step 11: Dev-Server stoppen**

Falls im Hintergrund gestartet: TaskStop auf die passende task_id.

---

## Task 17: Finaler Commit + Git-Log-Check

**Files:** keine Änderungen

- [ ] **Step 1: Git-Log prüfen**

Run: `cd C:/Projekte/webseiten/wasnun-jetzt && git log --oneline -20`

Expected: Alle vorherigen Commits sind da, vom ältesten (Rollback-Punkt) bis zum neuesten (FAQ/Journey-Features). Jeder Task-Commit ist eine eigene Zeile.

- [ ] **Step 2: Status prüfen**

Run: `cd C:/Projekte/webseiten/wasnun-jetzt && git status --short`
Expected: `nothing to commit, working tree clean`

- [ ] **Step 3: Falls Working-Tree nicht clean**

Prüfen was liegt: `git status`. Falls vergessene Änderungen, in den passenden Commit aufnehmen oder als `chore:`-Commit nachschieben:

```bash
git add .
git commit -m "chore: Kleinere Anpassungen nach manueller Prüfung"
```

- [ ] **Step 4: Fertig-Meldung**

Schreibe dem User:
- Was gebaut wurde (Unified Journey mit 4 Karten, 520 EUR-Fokus, 15-Std.-Warnung, Newsletter, Bürgergeld-Platzhalter)
- Wie viele Commits entstanden sind
- URL des Dev-Servers (`http://localhost:3000` oder der aktuell freie Port)
- Was als Nächstes ansteht: Partner-Programme wirklich registrieren, `status: "aktiv"` schalten, robots-Toggle für Go-Live umlegen

---

## Notes for Implementer

- **Immer das Build und Dev-Server manuell testen** – wir haben keine Component-Tests, nur TypeScript und Lint als automatische Gates
- **Umlaute strikt** – ä/ö/ü/ß in sichtbaren Texten, ASCII nur in Identifiern und URL-Slugs
- **Affiliate-Links NIE ohne `rel="sponsored noopener noreferrer"`** und NIE ohne sichtbares "Werbung"-Badge
- **Bei Turbopack-Errors**: Cache mit `rm -rf .next` löschen und Dev-Server neu starten
- **Bei Port-Konflikten**: `taskkill //PID <id> //F` auf die alte Node-Instanz
- **Windows-Hinweis**: Bash-Flags mit Slashes (`//PID` statt `/PID`), LF/CRLF-Warnings von Git ignorieren
