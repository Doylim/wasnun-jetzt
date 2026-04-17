# Journey Stufen-Treppe Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Die Journey-Section wird radikal vereinfacht — keine freie Eingabe auf der Seite, stattdessen eine Stufen-Treppe (Grundfreibetrag fix + Übungsleiter/Ehrenamt als Checkboxen) mit ehrlicher Default-Anzeige von +165 EUR. ALG-I und Vorname wandern ins Newsletter-Formular (beide optional).

**Architecture:** Eine neue Client-Komponente `stufen-treppe.tsx` ersetzt die bisherigen `journey-input.tsx` / `journey-total.tsx` / `journey-card.tsx` / `journey-warnung.tsx`. Das Datenmodell in `lib/journey.ts` verliert das Stunden-Feld. Backend-APIs akzeptieren Vorname und ALG-I optional. Die Plan-Mail begrüßt persönlich (falls Vorname übertragen) und zeigt die tatsächlich aktivierte Summe im Header.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, Tailwind 4, node --test für Tests.

**Spec-Referenz:** `docs/superpowers/specs/2026-04-17-journey-stufen-treppe-design.md`

---

## File Structure

| Datei                                                    | Aktion      | Zweck                                                            |
|----------------------------------------------------------|-------------|------------------------------------------------------------------|
| `src/lib/journey.ts`                                     | modify      | `PlanState.stunden` + `PlanErgebnis.warnung15Stunden` entfernen  |
| `src/lib/token.ts`                                       | modify      | Payload um optional `vorname` erweitern                          |
| `src/lib/plan-mail.ts`                                   | modify      | Vornamen-Begrüßung, statische 15-Std-Info, ALG-I optional        |
| `src/components/sections/stufen-treppe.tsx`              | **create**  | Neue Hauptkomponente: 3 Stufen + Summe + Passiv + Warnbox        |
| `src/components/sections/journey.tsx`                    | modify      | Vereinfacht: nutzt `StufenTreppe` + `NewsletterForm` + `JourneyPlan` |
| `src/components/sections/journey-input.tsx`              | **delete**  | Freie Eingabe nicht mehr auf der Seite                           |
| `src/components/sections/journey-total.tsx`              | **delete**  | Ersetzt durch `stufen-treppe.tsx`                                |
| `src/components/sections/journey-card.tsx`               | **delete**  | Toggle-Logik jetzt in Stufen-Treppe                              |
| `src/components/sections/journey-warnung.tsx`            | **delete**  | Dynamische Warnung entfällt, statische in Stufen-Treppe          |
| `src/components/sections/journey-plan.tsx`               | unchanged   | Schritte-Liste bleibt (zeigt aktive Pauschalen)                  |
| `src/components/sections/newsletter-form.tsx`            | modify      | + Vorname-Feld, + ALG-I-Feld (beide optional)                    |
| `src/app/api/newsletter/route.ts`                        | modify      | `vorname` + `algI` optional entgegennehmen, Defaults bauen       |
| `src/app/api/newsletter/confirm/[token]/route.ts`        | modify      | `VORNAME` + `ALG_I_BETRAG` beim Contact-Upsert setzen            |
| `tests/plan-mail.test.mjs`                               | modify      | Stunden-Warnbox-Test umbauen, Vorname/ALG-I-optional-Tests       |
| `tests/token.test.mjs`                                   | modify      | Test für Token mit Vorname ergänzen                              |

---

## Task 1: Datenmodell `journey.ts` aufräumen

**Files:**
- Modify: `src/lib/journey.ts`

**Ziel:** `stunden` und `warnung15Stunden` aus Zustand/Ergebnis entfernen, da die Stunden-Eingabe wegfällt. Alles andere bleibt.

- [ ] **Step 1: Modify `src/lib/journey.ts` — Type `PlanState` vereinfachen**

Finde:
```ts
export type PlanState = {
  algI: number;
  stunden: number;
  aktivKarten: Set<string>;
};
```

Ersetze durch:
```ts
export type PlanState = {
  aktivKarten: Set<string>;
};
```

- [ ] **Step 2: `PlanErgebnis` vereinfachen**

Finde:
```ts
export type PlanErgebnis = {
  gesamtFreibetrag: number;
  hatPassiv: boolean;
  warnung15Stunden: boolean;
};
```

Ersetze durch:
```ts
export type PlanErgebnis = {
  gesamtFreibetrag: number;
  hatPassiv: boolean;
};
```

- [ ] **Step 3: `berechnePlan()` an die neuen Typen anpassen**

Finde:
```ts
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

Ersetze durch:
```ts
export function berechnePlan(state: PlanState): PlanErgebnis {
  const hatPassiv = state.aktivKarten.has("passiv");

  let gesamtFreibetrag = 0;
  for (const karte of JOURNEY_KARTEN) {
    if (karte.id === "passiv") continue;
    if (!state.aktivKarten.has(karte.id)) continue;
    if (karte.freibetragEur === null) continue;
    gesamtFreibetrag += karte.freibetragEur;
  }

  return { gesamtFreibetrag, hatPassiv };
}
```

- [ ] **Step 4: Tests laufen lassen — sicherstellen, dass nichts gebrochen ist**

```bash
npm test
```

Erwartet: 10 Tests grün (Token + Plan-Mail unverändert). Falls ein Test in `plan-mail.test.mjs` scheitert, ignorier das — wir passen ihn in Task 2 an.

- [ ] **Step 5: Commit**

```bash
git add src/lib/journey.ts
git commit -m "refactor: PlanState/PlanErgebnis ohne stunden/warnung15Stunden"
```

---

## Task 2: `plan-mail.ts` — statische 15-Std-Warnbox, Vornamen-Begrüßung, optional ALG-I

**Files:**
- Modify: `src/lib/plan-mail.ts`
- Modify: `tests/plan-mail.test.mjs`

**Ziel:** Die Plan-Mail (a) grüßt persönlich, wenn Vorname übermittelt wurde, (b) zeigt den ALG-I-Header nur, wenn ALG-I > 0, (c) zeigt immer die statische 15-Std-Info — nie mehr die dynamische „du liegst bei X Stunden"-Warnung.

- [ ] **Step 1: Tests zuerst anpassen — `tests/plan-mail.test.mjs`**

Ersetze den kompletten Inhalt der Datei `tests/plan-mail.test.mjs` durch:

```javascript
import { test } from "node:test";
import assert from "node:assert/strict";

const { buildPlanMailHtml } = await import("../src/lib/plan-mail.ts");

test("buildPlanMailHtml: enthaelt die konkrete Euro-Zahl", () => {
  const html = buildPlanMailHtml({
    email: "test@example.com",
    algI: 1200,
    stunden: 12,
    aktivKarten: ["grundfreibetrag", "uebungsleiter", "ehrenamt"],
    gesamtFreibetrag: 520,
    exp: Date.now() + 1000,
  });
  assert.match(html, /\+520 EUR/);
  assert.match(html, /1\.200 EUR/);
});

test("buildPlanMailHtml: listet nur aktive Pauschalen", () => {
  const html = buildPlanMailHtml({
    email: "test@example.com",
    algI: 1000,
    stunden: 0,
    aktivKarten: ["grundfreibetrag", "uebungsleiter"],
    gesamtFreibetrag: 440,
    exp: Date.now() + 1000,
  });
  assert.match(html, /Grundfreibetrag/);
  assert.match(html, /Übungsleiter/);
  assert.doesNotMatch(html, /\+80 EUR/);
});

test("buildPlanMailHtml: statische 15-Stunden-Info ist immer enthalten", () => {
  const html = buildPlanMailHtml({
    email: "test@example.com",
    algI: 1000,
    stunden: 0,
    aktivKarten: ["grundfreibetrag"],
    gesamtFreibetrag: 165,
    exp: Date.now() + 1000,
  });
  assert.match(html, /15-Stunden-Regel/);
  assert.match(html, /14 Std\. 59 Min\./);
});

test("buildPlanMailHtml: Passiv-Hinweis erscheint bei aktivierter Passiv-Karte", () => {
  const html = buildPlanMailHtml({
    email: "test@example.com",
    algI: 1000,
    stunden: 0,
    aktivKarten: ["grundfreibetrag", "passiv"],
    gesamtFreibetrag: 165,
    exp: Date.now() + 1000,
  });
  assert.match(html, /unbegrenzt aus Vermietung/i);
});

test("buildPlanMailHtml: Impressum- und Abmelde-Link im Footer", () => {
  const html = buildPlanMailHtml({
    email: "test@example.com",
    algI: 1000,
    stunden: 0,
    aktivKarten: ["grundfreibetrag"],
    gesamtFreibetrag: 165,
    exp: Date.now() + 1000,
  });
  assert.match(html, /abmelden/i);
  assert.match(html, /Impressum/);
});

test("buildPlanMailHtml: persönliche Begrüßung bei Vornamen", () => {
  const html = buildPlanMailHtml({
    email: "test@example.com",
    vorname: "Norbert",
    algI: 1200,
    stunden: 0,
    aktivKarten: ["grundfreibetrag"],
    gesamtFreibetrag: 165,
    exp: Date.now() + 1000,
  });
  assert.match(html, /Hallo Norbert/);
});

test("buildPlanMailHtml: ohne Vorname keine persönliche Begrüßung", () => {
  const html = buildPlanMailHtml({
    email: "test@example.com",
    algI: 1200,
    stunden: 0,
    aktivKarten: ["grundfreibetrag"],
    gesamtFreibetrag: 165,
    exp: Date.now() + 1000,
  });
  assert.doesNotMatch(html, /Hallo [A-ZÄÖÜ]/);
});

test("buildPlanMailHtml: ohne ALG-I-Betrag keine personalisierte Zahl im Header", () => {
  const html = buildPlanMailHtml({
    email: "test@example.com",
    algI: 0,
    stunden: 0,
    aktivKarten: ["grundfreibetrag"],
    gesamtFreibetrag: 165,
    exp: Date.now() + 1000,
  });
  // Header zeigt nur die Freibetrag-Summe, keine Referenz auf "1.200 EUR"
  assert.doesNotMatch(html, /zu deinem ALG I von/);
});

test("buildPlanMailHtml: mit ALG-I-Betrag wird der Header personalisiert", () => {
  const html = buildPlanMailHtml({
    email: "test@example.com",
    algI: 1200,
    stunden: 0,
    aktivKarten: ["grundfreibetrag"],
    gesamtFreibetrag: 165,
    exp: Date.now() + 1000,
  });
  assert.match(html, /zu deinem ALG I von <strong>1\.200 EUR<\/strong>/);
});
```

- [ ] **Step 2: Tests ausführen — sollten jetzt alle scheitern, da `plan-mail.ts` noch nicht angepasst ist**

```bash
npm test
```

Erwartet: mind. die neuen Tests (Begrüßung, ALG-I-optional) scheitern. Okay so.

- [ ] **Step 3: `src/lib/plan-mail.ts` — Vorname im Token-Typ**

Ganz oben in der Datei, nach den Imports, ergänze in `NewsletterTokenPayload` (Typ liegt in `src/lib/token.ts` — Änderung dort in Task 3). Für jetzt reicht der Cast — wir lesen `payload.vorname` optional.

- [ ] **Step 4: `src/lib/plan-mail.ts` — `buildPlanMailHtml` Begrüßung + ALG-I-Header + statische Warnbox**

Finde:
```ts
  const warnbox15h =
    payload.stunden >= 15
      ? `
    <div style="background:#fee2e2;border:2px solid #fca5a5;border-radius:12px;padding:16px;margin:24px 0;color:#7f1d1d;font-size:14px;">
      <strong>Stunden-Warnung:</strong> Du darfst max. 14 Std. 59 Min. pro Woche arbeiten. Ab 15 Stunden verlierst du ALG I komplett. Aktuell liegst du bei ${payload.stunden} Stunden — reduziere zuerst, dann setze den Plan um.
    </div>`
      : `
    <div style="background:#fef3c7;border:2px solid #fde68a;border-radius:12px;padding:16px;margin:24px 0;color:#78350f;font-size:14px;">
      <strong>Die 15-Stunden-Regel:</strong> Du darfst max. 14 Std. 59 Min. pro Woche arbeiten. Ab 15 Stunden verlierst du ALG I komplett.
    </div>`;
```

Ersetze durch:
```ts
  const warnbox15h = `
    <div style="background:#fef3c7;border:2px solid #fde68a;border-radius:12px;padding:16px;margin:24px 0;color:#78350f;font-size:14px;">
      <strong>Die 15-Stunden-Regel:</strong> Du darfst max. 14 Std. 59 Min. pro Woche arbeiten. Ab 15 Stunden verlierst du ALG I komplett.
    </div>`;
```

- [ ] **Step 5: `src/lib/plan-mail.ts` — Header dynamisch, Begrüßung optional**

Finde den Header-Block:
```ts
  <tr><td align="center" style="padding:16px 0 8px;">
    <div style="font-size:48px;font-weight:900;color:#00867a;line-height:1.1;">+${formatEur(payload.gesamtFreibetrag)}</div>
    <div style="margin-top:8px;font-size:16px;color:#334258;">monatlich — abzugsfrei zu deinem ALG I von <strong>${formatEur(payload.algI)}</strong></div>
  </td></tr>
```

Ersetze durch:
```ts
  const vornameBegruessung = payload.vorname
    ? `<tr><td style="padding:0 0 16px;color:#0f1f3d;font-size:16px;"><strong>Hallo ${escapeHtml(payload.vorname)},</strong> hier ist dein Plan:</td></tr>`
    : "";

  const algIZeile = payload.algI && payload.algI > 0
    ? `monatlich — abzugsfrei zu deinem ALG I von <strong>${formatEur(payload.algI)}</strong>`
    : `monatlich — abzugsfrei neben deinem ALG I`;
```

Und fügt als neue Zeile an passender Stelle ein (direkt nach dem ersten `<tr><td style="padding-bottom:8px..."` Block und vor dem Zahl-Header):
```ts
  ${vornameBegruessung}

  <tr><td align="center" style="padding:16px 0 8px;">
    <div style="font-size:48px;font-weight:900;color:#00867a;line-height:1.1;">+${formatEur(payload.gesamtFreibetrag)}</div>
    <div style="margin-top:8px;font-size:16px;color:#334258;">${algIZeile}</div>
  </td></tr>
```

- [ ] **Step 6: `escapeHtml`-Helper ergänzen**

Am Anfang der Datei, nach `formatDate()`, ergänze:
```ts
function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[c] ?? c);
}
```

- [ ] **Step 7: Tests ausführen — alle grün?**

```bash
npm test
```

Erwartet: 12 Tests grün (5 alte + 4 neue Plan-Mail + 4 Token).

Falls der Test `ohne ALG-I-Betrag keine personalisierte Zahl im Header` scheitert, prüf dass `algIZeile` wirklich verwendet wird im HTML-Output (nicht versehentlich doppelt drin).

- [ ] **Step 8: Commit**

```bash
git add src/lib/plan-mail.ts tests/plan-mail.test.mjs
git commit -m "feat: Plan-Mail mit Vornamen-Begruessung, optionalem ALG-I, statischer 15-Std-Info"
```

---

## Task 3: Token-Payload um Vornamen erweitern

**Files:**
- Modify: `src/lib/token.ts`
- Modify: `tests/token.test.mjs`

- [ ] **Step 1: `tests/token.test.mjs` — neuer Test für Vornamen-Roundtrip**

Am Ende der Datei, vor dem letzten schließenden Bracket, füge hinzu:

```javascript
test("createToken + verifyToken: Vorname bleibt erhalten", () => {
  const token = createToken({
    email: "test@example.com",
    vorname: "Norbert",
    algI: 1200,
    stunden: 0,
    aktivKarten: ["grundfreibetrag"],
    gesamtFreibetrag: 165,
  });
  const payload = verifyToken(token);
  assert.equal(payload?.vorname, "Norbert");
});

test("createToken: ohne Vorname ist payload.vorname undefined", () => {
  const token = createToken({
    email: "test@example.com",
    algI: 0,
    stunden: 0,
    aktivKarten: ["grundfreibetrag"],
    gesamtFreibetrag: 165,
  });
  const payload = verifyToken(token);
  assert.equal(payload?.vorname, undefined);
});
```

- [ ] **Step 2: Test ausführen — Typ-Fehler / Test-Failure erwartet**

```bash
npm test
```

Erwartet: die zwei neuen Tests scheitern, weil `vorname` noch kein Teil des Typs ist.

- [ ] **Step 3: `src/lib/token.ts` — Typ erweitern**

Finde:
```ts
export type NewsletterTokenPayload = {
  email: string;
  algI: number;
  stunden: number;
  aktivKarten: string[];
  gesamtFreibetrag: number;
  exp: number; // Unix-Millis
};
```

Ersetze durch:
```ts
export type NewsletterTokenPayload = {
  email: string;
  vorname?: string;
  algI: number;
  stunden: number;
  aktivKarten: string[];
  gesamtFreibetrag: number;
  exp: number; // Unix-Millis
};
```

- [ ] **Step 4: Tests ausführen — alle grün?**

```bash
npm test
```

Erwartet: 14 Tests grün (12 aus Task 2 + 2 neue Token-Tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/token.ts tests/token.test.mjs
git commit -m "feat: Token-Payload um optionalen Vornamen erweitert"
```

---

## Task 4: Neue `StufenTreppe`-Komponente

**Files:**
- Create: `src/components/sections/stufen-treppe.tsx`

**Ziel:** Die neue Hauptkomponente der Journey-Section. Rendert drei Stufen-Kacheln, eine Summen-Karte, den Passive-Hinweis und die 15-Stunden-Warnbox. Gibt den `aktivKarten`-Set als Prop nach oben (damit `JourneyPlan` die aktiven Schritte kennt).

- [ ] **Step 1: Datei anlegen — `src/components/sections/stufen-treppe.tsx`**

```tsx
"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { KartenId } from "@/lib/journey";

type StufenProps = {
  aktivKarten: Set<string>;
  onToggle: (id: KartenId) => void;
};

type Stufe = {
  id: KartenId;
  betrag: number;
  titel: string;
  beschreibung: string;
  badge: string;
  badgeVariante: "teal" | "amber";
  immerAktiv: boolean;
};

const STUFEN: Stufe[] = [
  {
    id: "grundfreibetrag",
    betrag: 165,
    titel: "Grundfreibetrag",
    beschreibung: "Minijob, Zenjob, Clickworker — morgen loslegbar",
    badge: "SOFORT",
    badgeVariante: "teal",
    immerAktiv: true,
  },
  {
    id: "uebungsleiter",
    betrag: 275,
    titel: "Übungsleiterpauschale",
    beschreibung: "Trainer, Co-Trainer, Betreuer — Lizenz nicht immer nötig",
    badge: "VEREIN",
    badgeVariante: "amber",
    immerAktiv: false,
  },
  {
    id: "ehrenamt",
    betrag: 80,
    titel: "Ehrenamtspauschale",
    beschreibung: "Kassenwart, Vorstand, Platzwart — organisatorische Rolle",
    badge: "ROLLE",
    badgeVariante: "amber",
    immerAktiv: false,
  },
];

function formatEur(n: number): string {
  return new Intl.NumberFormat("de-DE").format(n) + " EUR";
}

export function StufenTreppe({ aktivKarten, onToggle }: StufenProps) {
  const summe = STUFEN.filter((s) => aktivKarten.has(s.id)).reduce(
    (acc, s) => acc + s.betrag,
    0,
  );

  return (
    <div className="mx-auto max-w-xl">
      <div className="rounded-3xl border-2 border-navy-100 bg-white p-6 md:p-8">
        <div className="mb-5 text-center text-xs font-bold uppercase tracking-widest text-navy-500">
          Dein Freibetrag — zusammenstellen
        </div>

        <div className="space-y-3">
          {STUFEN.map((stufe) => {
            const aktiv = aktivKarten.has(stufe.id);
            const badgeClass =
              stufe.badgeVariante === "teal"
                ? "bg-white text-teal-700"
                : "bg-amber-100 text-amber-900";

            return (
              <button
                key={stufe.id}
                type="button"
                onClick={() => !stufe.immerAktiv && onToggle(stufe.id)}
                disabled={stufe.immerAktiv}
                aria-pressed={aktiv}
                className={cn(
                  "flex w-full items-start gap-3 rounded-2xl border-2 p-4 text-left transition-colors",
                  aktiv
                    ? "border-teal-500 bg-teal-50"
                    : "border-navy-100 bg-white hover:border-navy-300",
                  stufe.immerAktiv && "cursor-default",
                )}
              >
                <div
                  className={cn(
                    "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2",
                    aktiv
                      ? "border-teal-500 bg-teal-500 text-white"
                      : "border-navy-200 bg-white",
                  )}
                >
                  {aktiv && <Check className="h-4 w-4" aria-hidden="true" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <div
                      className={cn(
                        "text-lg font-black",
                        aktiv ? "text-teal-700" : "text-navy-700",
                      )}
                    >
                      +{formatEur(stufe.betrag)}
                    </div>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-black tracking-wider",
                        badgeClass,
                      )}
                    >
                      {stufe.badge}
                    </span>
                  </div>
                  <div className="mt-0.5 text-sm font-bold text-navy-900">
                    {stufe.titel}
                  </div>
                  <div className="mt-1 text-xs text-navy-600">
                    {stufe.beschreibung}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 rounded-2xl bg-gradient-to-br from-teal-50 to-white p-5 text-center">
          <div className="text-xs font-bold uppercase tracking-widest text-navy-500">
            Dein aktueller Freibetrag
          </div>
          <div className="mt-1 text-4xl font-black text-teal-700 md:text-5xl">
            +{formatEur(summe)}
          </div>
          <div className="mt-1 text-sm text-navy-600">
            pro Monat, anrechnungsfrei zu deinem ALG I
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-navy-50 p-4 text-sm text-navy-700">
          <strong className="text-navy-900">Zusätzlich unbegrenzt:</strong>{" "}
          Mieteinnahmen + Kapitalerträge (Zinsen, Dividenden) werden bei ALG I
          nicht angerechnet.
        </div>

        <div className="mt-3 rounded-xl border-2 border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <strong>15-Stunden-Regel:</strong> Du darfst max. 14 Std. 59 Min. pro
          Woche arbeiten. Ab 15 Stunden verlierst du ALG I komplett.
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Lint/Build-Check**

```bash
npm run build
```

Erwartet: Build grün. Falls ein Typ-Fehler: Meldung genau lesen, meistens fehlt ein Import oder ein Type-Export in `lib/journey.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/stufen-treppe.tsx
git commit -m "feat: neue StufenTreppe-Komponente (165 fix + 275/80 Checkbox)"
```

---

## Task 5: `journey.tsx` auf neue Komponente umstellen

**Files:**
- Modify: `src/components/sections/journey.tsx`

**Ziel:** Die Journey-Section nutzt jetzt `StufenTreppe`, übergibt `aktivKarten` auch an `JourneyPlan` und `NewsletterForm`. Keine freien Eingabefelder mehr auf der Seite.

- [ ] **Step 1: `src/components/sections/journey.tsx` komplett ersetzen**

```tsx
"use client";

import { useState } from "react";
import { StufenTreppe } from "./stufen-treppe";
import { JourneyPlan } from "./journey-plan";
import { NewsletterForm } from "./newsletter-form";
import type { KartenId } from "@/lib/journey";

const STUFEN_BETRAEGE: Record<KartenId, number> = {
  grundfreibetrag: 165,
  uebungsleiter: 275,
  ehrenamt: 80,
  passiv: 0,
};

export function Journey() {
  // Default: nur Grundfreibetrag aktiv — ehrliche 165 EUR als Einstieg
  const [aktivKarten, setAktivKarten] = useState<Set<string>>(
    () => new Set<string>(["grundfreibetrag"]),
  );

  const toggleKarte = (id: KartenId) => {
    if (id === "grundfreibetrag") return; // immer aktiv
    setAktivKarten((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const gesamtFreibetrag = Array.from(aktivKarten).reduce(
    (sum, id) => sum + (STUFEN_BETRAEGE[id] ?? 0),
    0,
  );

  return (
    <section
      id="rechner"
      className="scroll-mt-24 border-t border-navy-100 bg-navy-50/40 py-20 md:py-28"
    >
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <div className="mb-10 text-center">
          <h2 className="text-balance text-3xl font-black text-navy-900 md:text-5xl">
            So viel darfst du neben ALG I verdienen
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-balance text-lg text-navy-600">
            Ohne Abzug — abhängig davon, was auf dich zutrifft.
          </p>
        </div>

        <div className="space-y-6">
          <StufenTreppe
            aktivKarten={aktivKarten}
            onToggle={toggleKarte}
          />

          <div className="mx-auto max-w-xl">
            <NewsletterForm
              aktivKarten={aktivKarten}
              gesamtFreibetrag={gesamtFreibetrag}
            />
          </div>

          <JourneyPlan aktivKarten={aktivKarten} />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Build-Check**

```bash
npm run build
```

Erwartet: Build scheitert mit TypeScript-Fehlern bei `NewsletterForm` — die Props-Struktur weicht ab (erwartet `algI`, `stunden`). Okay — wir passen die Form in Task 7 an. Wenn du den Build trotzdem durchbekommen willst, kommentiere die `<NewsletterForm>`-Zeile temporär aus.

Wenn der Build scheitert, kommentiere `<NewsletterForm … />` aus, baue erneut, bestätige dass der Rest grün ist.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/journey.tsx
git commit -m "refactor: Journey-Section auf StufenTreppe umgestellt"
```

---

## Task 6: Alte Komponenten löschen

**Files:**
- Delete: `src/components/sections/journey-input.tsx`
- Delete: `src/components/sections/journey-total.tsx`
- Delete: `src/components/sections/journey-card.tsx`
- Delete: `src/components/sections/journey-warnung.tsx`

- [ ] **Step 1: Dateien löschen**

```bash
rm src/components/sections/journey-input.tsx
rm src/components/sections/journey-total.tsx
rm src/components/sections/journey-card.tsx
rm src/components/sections/journey-warnung.tsx
```

- [ ] **Step 2: Grep nach verwaisten Imports**

```bash
grep -rn "journey-input\|journey-total\|journey-card\|journey-warnung" src/ tests/
```

Erwartet: Keine Treffer. Falls doch, die jeweilige Datei öffnen und den Import entfernen.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "refactor: alte Journey-Subkomponenten entfernt (ersetzt durch StufenTreppe)"
```

---

## Task 7: `NewsletterForm` um Vorname + ALG-I erweitern

**Files:**
- Modify: `src/components/sections/newsletter-form.tsx`

**Ziel:** Das Newsletter-Formular bekommt zwei neue Felder — `vorname` und `algI` — beide optional. Die POST-Body wird entsprechend erweitert. Props-Signatur ändert sich: `algI` und `stunden` fliegen als *Props* raus (werden ja intern durch Inputs erfasst), dafür kommen `aktivKarten` + `gesamtFreibetrag` als Props rein (werden von `Journey` hereingereicht).

- [ ] **Step 1: `src/components/sections/newsletter-form.tsx` komplett ersetzen**

```tsx
"use client";

import { useState, type FormEvent } from "react";
import { Check, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  aktivKarten: Set<string>;
  gesamtFreibetrag: number;
};

type Status = "idle" | "loading" | "success" | "error";

export function NewsletterForm({ aktivKarten, gesamtFreibetrag }: Props) {
  const [email, setEmail] = useState("");
  const [vorname, setVorname] = useState("");
  const [algIInput, setAlgIInput] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [fehler, setFehler] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setFehler(null);

    const algINumber = algIInput ? parseFloat(algIInput) : 0;

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          vorname: vorname.trim() || undefined,
          algI: Number.isFinite(algINumber) ? algINumber : 0,
          stunden: 0,
          aktivKarten: Array.from(aktivKarten),
          gesamtFreibetrag,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "Etwas ist schiefgelaufen.");
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setFehler(
        err instanceof Error ? err.message : "Probiere es später nochmal.",
      );
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-start gap-3 rounded-3xl border-2 border-teal-300 bg-teal-50 p-6 text-teal-900">
        <Check className="mt-0.5 h-6 w-6 shrink-0 text-teal-600" aria-hidden="true" />
        <div>
          <div className="text-lg font-black">Check dein Postfach</div>
          <div className="mt-1 text-sm">
            Wir haben dir eine Bestätigungs-Mail geschickt. Klick den Link darin
            — dann kommt dein Plan. (Auch Spam-Ordner prüfen.)
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-navy-100 bg-white p-6"
      aria-label="Plan per E-Mail anfordern"
    >
      <div className="mb-1 flex items-center gap-2 text-base font-black text-navy-900">
        <Mail className="h-5 w-5 text-teal-600" aria-hidden="true" />
        Plan per E-Mail — kostenlos
      </div>
      <p className="mb-4 text-sm text-navy-600">
        Du bekommst deinen persönlichen Plan sofort nach Bestätigung + 1× im
        Monat neue Tipps. Abmeldung jederzeit mit einem Klick.
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Input
          type="text"
          placeholder="Vorname (optional)"
          value={vorname}
          onChange={(e) => setVorname(e.target.value)}
          disabled={status === "loading"}
          aria-label="Vorname (optional)"
          className="h-12 text-base"
          maxLength={50}
        />
        <Input
          type="number"
          placeholder="Dein ALG I (optional)"
          value={algIInput}
          onChange={(e) => setAlgIInput(e.target.value)}
          disabled={status === "loading"}
          aria-label="Dein ALG I pro Monat (optional)"
          className="h-12 text-base"
          min={0}
          max={10000}
          inputMode="numeric"
        />
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
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
          {status === "loading" ? "Sende…" : "Plan zuschicken"}
        </Button>
      </div>

      {fehler && (
        <div role="alert" className="mt-3 text-sm text-red-700">
          {fehler}
        </div>
      )}
      <p className="mt-3 text-xs text-navy-500">
        Freiwillig. Daten werden nur für Plan + Tipps genutzt
        (<a href="/datenschutz" className="underline">Datenschutz</a>).
      </p>
    </form>
  );
}
```

- [ ] **Step 2: In `journey.tsx` die auskommentierte `<NewsletterForm>`-Zeile wieder aktivieren (falls Task 5 auskommentiert wurde)**

- [ ] **Step 3: Build-Check**

```bash
npm run build
```

Erwartet: Build grün.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/newsletter-form.tsx src/components/sections/journey.tsx
git commit -m "feat: NewsletterForm um Vorname + ALG-I (beide optional) erweitert"
```

---

## Task 8: API POST `/api/newsletter` — Vorname + ALG-I optional

**Files:**
- Modify: `src/app/api/newsletter/route.ts`

**Ziel:** Die POST-Route akzeptiert jetzt optionalen `vorname`-String und erlaubt `algI = 0`. Die bestehende Validation muss gelockert werden (algI darf 0 sein), und `vorname` wird gelesen, validiert und ins Token geschrieben.

- [ ] **Step 1: `src/app/api/newsletter/route.ts` — Payload-Typ um Vorname erweitern**

Finde:
```ts
type Payload = {
  email?: unknown;
  algI?: unknown;
  stunden?: unknown;
  aktivKarten?: unknown;
  gesamtFreibetrag?: unknown;
};
```

Ersetze durch:
```ts
type Payload = {
  email?: unknown;
  vorname?: unknown;
  algI?: unknown;
  stunden?: unknown;
  aktivKarten?: unknown;
  gesamtFreibetrag?: unknown;
};

function normalizeVorname(input: unknown): string | undefined {
  if (typeof input !== "string") return undefined;
  const trimmed = input.trim().slice(0, 50);
  return trimmed.length > 0 ? trimmed : undefined;
}
```

- [ ] **Step 2: Validation-Block — `algI` darf 0 sein**

Finde:
```ts
  if (!isSafeNumber(body.algI, 10_000)) {
    return NextResponse.json({ error: "Ungültiger ALG-I-Betrag." }, { status: 400 });
  }
```

Lass das so — `isSafeNumber` erlaubt schon 0 (Bedingung `n >= 0`).

- [ ] **Step 3: Token-Erzeugung um Vorname erweitern**

Finde:
```ts
  const token = createToken({
    email: body.email,
    algI: body.algI,
    stunden: body.stunden,
    aktivKarten,
    gesamtFreibetrag: body.gesamtFreibetrag,
  });
```

Ersetze durch:
```ts
  const vorname = normalizeVorname(body.vorname);

  const token = createToken({
    email: body.email,
    vorname,
    algI: body.algI,
    stunden: body.stunden,
    aktivKarten,
    gesamtFreibetrag: body.gesamtFreibetrag,
  });
```

- [ ] **Step 4: Build + Tests**

```bash
npm run build && npm test
```

Erwartet: Build grün, 14 Tests grün.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/newsletter/route.ts
git commit -m "feat: POST /api/newsletter akzeptiert optionalen Vorname"
```

---

## Task 9: API GET `/api/newsletter/confirm/[token]` — Vorname + ALG-I ins Brevo-Profil

**Files:**
- Modify: `src/app/api/newsletter/confirm/[token]/route.ts`

**Ziel:** Beim Contact-Upsert in Brevo werden jetzt auch `VORNAME` und `ALG_I_BETRAG` (falls vorhanden) gesetzt.

- [ ] **Step 1: Brevo-Contact-Upsert erweitern**

Finde:
```ts
  // 1. Brevo-Kontakt anlegen/updaten mit Custom-Attributen
  // Brevo tut nichts, wenn Kontakt schon existiert und updateEnabled=true ist.
  await fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": brevoKey,
    },
    body: JSON.stringify({
      email: payload.email,
      listIds: listId ? [listId] : undefined,
      updateEnabled: true,
      attributes: {
        ALG_I_BETRAG: payload.algI,
        STUNDEN_WOCHE: payload.stunden,
        PAUSCHALEN: payload.aktivKarten.join(","),
        GESAMT_FREIBETRAG: payload.gesamtFreibetrag,
      },
    }),
  }).catch((e) => {
    console.error("[confirm] Brevo Contact-Upsert Fehler (nicht blockierend):", e);
  });
```

Ersetze durch:
```ts
  // 1. Brevo-Kontakt anlegen/updaten mit Custom-Attributen
  // Brevo tut nichts, wenn Kontakt schon existiert und updateEnabled=true ist.
  const attributes: Record<string, string | number> = {
    STUNDEN_WOCHE: payload.stunden,
    PAUSCHALEN: payload.aktivKarten.join(","),
    GESAMT_FREIBETRAG: payload.gesamtFreibetrag,
  };
  if (payload.vorname) {
    attributes.VORNAME = payload.vorname;
  }
  if (payload.algI && payload.algI > 0) {
    attributes.ALG_I_BETRAG = payload.algI;
  }

  await fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": brevoKey,
    },
    body: JSON.stringify({
      email: payload.email,
      listIds: listId ? [listId] : undefined,
      updateEnabled: true,
      attributes,
    }),
  }).catch((e) => {
    console.error("[confirm] Brevo Contact-Upsert Fehler (nicht blockierend):", e);
  });
```

- [ ] **Step 2: Build**

```bash
npm run build
```

Erwartet: Build grün.

- [ ] **Step 3: Commit**

```bash
git add "src/app/api/newsletter/confirm/[token]/route.ts"
git commit -m "feat: Confirm-Route schreibt VORNAME + ALG_I_BETRAG bei Brevo"
```

---

## Task 10: Integrations-Test lokal + Push

**Files:**
- keine neuen Änderungen

**Ziel:** Einmal den gesamten Flow lokal ansehen, bevor gepusht wird.

- [ ] **Step 1: Dev-Server starten**

```bash
npm run dev
```

Im Browser `http://localhost:3000` öffnen.

- [ ] **Step 2: Visuelle Checks auf der Startseite**

Prüfen:
- [ ] Journey-Section heißt jetzt „So viel darfst du neben ALG I verdienen"
- [ ] Default-Anzeige: +165 EUR (nicht 520!)
- [ ] Stufe 1 hat teal-Border, Badge „SOFORT"
- [ ] Stufe 2 + 3 haben Haken, Badge „VEREIN" / „ROLLE"
- [ ] Klick auf Stufe 2 → Summe wird +440 EUR
- [ ] Klick auf Stufe 3 → Summe wird +520 EUR
- [ ] Klick auf Stufe 1 → passiert nichts (immer aktiv)
- [ ] 15-Stunden-Warnbox ist sichtbar
- [ ] Passive-Hinweis ist sichtbar
- [ ] Newsletter-Form hat Felder: Vorname, ALG I, E-Mail
- [ ] Mobile-View: Stufen stapeln, Summen-Karte prominent

- [ ] **Step 3: Tests final**

```bash
npm test
```

Erwartet: alle Tests grün.

- [ ] **Step 4: Build final**

```bash
npm run build
```

Erwartet: Build grün, keine Type-Errors.

- [ ] **Step 5: Push**

```bash
git push
```

Vercel deployed automatisch. Nach ~2 Min auf der Production-URL (`wasnun-jetzt.vercel.app`) nachprüfen.

- [ ] **Step 6: Optional — End-to-End Mail-Test**

Auf der Production-URL:
1. Stufen 1, 2, 3 aktivieren (Summe = 520 EUR)
2. Newsletter-Form ausfüllen: Vorname = „Norbert", ALG I = 1500, E-Mail
3. Absenden
4. Bestätigungs-Mail abwarten, Link klicken
5. Plan-Mail prüfen: Begrüßung „Hallo Norbert, hier ist dein Plan:", Header „+520 EUR monatlich — abzugsfrei zu deinem ALG I von 1.500 EUR"
6. In Brevo prüfen: Kontakt hat `VORNAME=Norbert`, `ALG_I_BETRAG=1500`, `PAUSCHALEN=grundfreibetrag,uebungsleiter,ehrenamt`

---

## Spec-Coverage-Check

| Spec-Punkt | Task |
|------------|------|
| ALG-I-Input + Stunden-Input raus | 5, 6 |
| Stufen-Treppe mit 165 fix | 4 |
| +275 / +80 als Checkboxen | 4 |
| Summe live | 4, 5 |
| Default +165 EUR | 4, 5 |
| Passive-Hinweis statisch | 4 |
| 15-Std-Warnbox statisch | 4 (Komponente) + 2 (Plan-Mail) |
| Newsletter-Form: Vorname + ALG-I optional | 7 |
| Headline neu | 5 |
| Badges SOFORT/VEREIN/ROLLE | 4 |
| Plan-Mail zeigt tatsächliche Summe | 2 (implizit: algI optional, Header dynamisch) |
| Plan-Mail Begrüßung bei Vorname | 2 |
| API akzeptiert optionale Felder | 8 |
| Brevo-Upsert speichert VORNAME | 9 |
| `stunden` bleibt im Token für Abwärtskompatibilität | 1 (PlanState vereinfacht, aber Token-Feld bleibt) |

Alle Spec-Punkte haben einen Task.
