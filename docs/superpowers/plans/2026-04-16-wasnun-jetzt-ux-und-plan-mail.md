# Wasnun-jetzt UX-Umbau + personalisierte Plan-Mail — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Seite verständlicher machen (Ergebnis-Zahl sofort sichtbar, Details per Disclosure) und über personalisierte Plan-Mail mit Doppel-Opt-in eine DSGVO-konforme Basis für spätere Remarketing-Monetarisierung schaffen.

**Architecture:** Drei Schichten. (1) Frontend: `journey.tsx` mit Smart-Default (alle Pauschalen aktiv) und `<details>`-Disclosure für die Karten. (2) Server-API: `POST /api/newsletter` erzeugt HMAC-signierten Token mit Plan-Payload und sendet Brevo-Confirm-Mail, `GET /api/newsletter/confirm?token=` verifiziert und löst Plan-Mail + Brevo-Kontakt-Upsert aus. (3) Mail-Layer: HTML-Generator in `src/lib/plan-mail.ts` rendert die persönliche Plan-Mail aus dem Token-Payload.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, Tailwind 4, Brevo Transactional + Contact API, Node 24 `node:crypto` für HMAC, `node --test` (built-in) für Unit-Tests.

**Spec-Referenz:** `docs/superpowers/specs/2026-04-16-wasnun-jetzt-ux-und-plan-mail.md`

---

## File-Struktur-Überblick

**Neu:**
- `src/lib/token.ts` — HMAC-Token-Helper (`createToken`, `verifyToken`)
- `src/lib/plan-mail.ts` — HTML-Generator der Plan-Mail
- `src/app/api/newsletter/confirm/route.ts` — GET-Route für Opt-in-Klick
- `src/app/danke-plan-versendet/page.tsx` — Landing nach Confirm
- `src/components/sections/journey-plan.tsx` — Umsetzungs-Schritte + Meldepflicht (aus alter `journey-summary.tsx` migriert)
- `tests/token.test.mjs` — Unit-Tests Token-Helper
- `tests/plan-mail.test.mjs` — Struktur-Tests HTML-Generator

**Geändert:**
- `src/components/sections/journey.tsx` — Default alle Karten aktiv, `<details>`-Disclosure, neuer Kompositions-Ablauf
- `src/components/sections/journey-total.tsx` — Visuell aufwerten, Warnbox integriert, Kleintext ergänzt
- `src/components/sections/newsletter-form.tsx` — nimmt Plan-Daten als Props entgegen, sendet sie mit
- `src/app/api/newsletter/route.ts` — Doppel-Opt-in statt direktem Log
- `src/app/datenschutz/page.tsx` — Absatz zu Newsletter/Plan-Versand ergänzen
- `package.json` — Scripts `test` und `test:watch` für `node --test`

**Gelöscht:**
- `src/components/sections/journey-summary.tsx`

---

## Task 1: UX-Umbau Journey — Defaults + Disclosure

**Files:**
- Modify: `src/components/sections/journey.tsx`
- Modify: `src/components/sections/journey-total.tsx`
- Create: `src/components/sections/journey-plan.tsx`
- Delete: `src/components/sections/journey-summary.tsx`

- [ ] **Step 1.1: `journey-plan.tsx` neu anlegen**

Die Umsetzungs-Schritte-Liste und den Meldepflicht-Hinweis aus der alten `journey-summary.tsx` in eine eigene Komponente extrahieren. Kein Newsletter-Form hier drin (der rutscht an eine andere Stelle).

Inhalt von `src/components/sections/journey-plan.tsx`:

```tsx
import { Phone } from "lucide-react";
import type { JourneyKarte } from "@/lib/journey";
import { JOURNEY_KARTEN } from "@/lib/journey";

type Props = {
  aktivKarten: Set<string>;
};

function schrittText(karte: JourneyKarte): string {
  switch (karte.id) {
    case "grundfreibetrag":
      return "165 EUR Grundfreibetrag – melde dich bei einer der Minijob-Plattformen an (Zenjob, Coople, Clickworker). Ca. 11–12 Std./Monat sind sicher.";
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

export function JourneyPlan({ aktivKarten }: Props) {
  const aktiveSchritte = JOURNEY_KARTEN.filter((k) => aktivKarten.has(k.id));

  if (aktiveSchritte.length === 0) return null;

  return (
    <div className="rounded-3xl border border-navy-100 bg-white p-6 md:p-10">
      <div className="mb-3 text-sm font-bold uppercase tracking-wide text-navy-500">
        So startest du
      </div>
      <ol className="space-y-3">
        {aktiveSchritte.map((karte, i) => (
          <li
            key={karte.id}
            className="flex items-start gap-3 rounded-2xl border border-navy-100 bg-navy-50/40 p-4"
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

      <div className="mt-6 flex items-start gap-3 rounded-2xl border-2 border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <Phone className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" />
        <div>
          <strong>Meldepflicht (Pflicht!):</strong> Jede Nebentätigkeit muss
          spätestens am ersten Arbeitstag bei der Agentur für Arbeit gemeldet
          werden. Hotline: <strong>0800 4 5555 00</strong>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 1.2: `journey-total.tsx` visuell aufwerten**

Kleintext „Maximaler Freibetrag — passe ihn bei Bedarf an" wenn alle Karten an sind, sonst „Nach deiner Auswahl". Warnbox verbleibt. Sticky-Verhalten auf Desktop bleibt erhalten (`md:sticky md:top-20`).

Ersetze den gesamten Inhalt mit:

```tsx
import { cn } from "@/lib/utils";
import type { PlanErgebnis } from "@/lib/journey";

type Props = {
  algI: number;
  plan: PlanErgebnis;
  alleKartenAktiv: boolean;
};

function formatEur(n: number): string {
  return new Intl.NumberFormat("de-DE").format(n) + " EUR";
}

export function JourneyTotal({ algI, plan, alleKartenAktiv }: Props) {
  const hasInput = algI > 0;
  const warnung = plan.warnung15Stunden;

  return (
    <div
      className={cn(
        "rounded-3xl border-2 p-6 md:p-8 shadow-lg transition-all",
        warnung
          ? "border-red-300 bg-red-50"
          : "border-teal-200 bg-gradient-to-br from-teal-50 to-white",
      )}
    >
      <div className="text-xs font-bold uppercase tracking-widest text-navy-500">
        Dein abzugsfreies Plus
      </div>

      {hasInput ? (
        <>
          <div className="mt-3 text-6xl font-black text-teal-600 md:text-7xl">
            +{formatEur(plan.gesamtFreibetrag)}
          </div>
          <div className="mt-2 text-base text-navy-600">
            abzugsfrei zu deinem ALG I von{" "}
            <strong className="text-navy-900">{formatEur(algI)}</strong>
          </div>
          <div className="mt-1 text-sm text-navy-500">
            {alleKartenAktiv
              ? "Maximaler Freibetrag — passe ihn bei Bedarf an"
              : "Basierend auf deiner Auswahl"}
          </div>
          {plan.hatPassiv && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-bold text-teal-700">
              + unbegrenzt aus Vermietung/Kapital
            </div>
          )}
          {warnung && (
            <div className="mt-4 rounded-xl bg-red-100 p-4 text-sm font-bold text-red-900">
              Achtung: Deine Stunden-Angabe überschreitet die 15-Std.-Grenze.
              Reduziere sofort, sonst gilt dieser Plan nicht.
            </div>
          )}
        </>
      ) : (
        <div className="mt-3 text-navy-600">
          Tippe oben dein ALG I ein, um dein persönliches Plus zu sehen.
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 1.3: `journey.tsx` umbauen — Defaults, Disclosure, Komposition**

Ersetze den Inhalt komplett mit:

```tsx
"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  JOURNEY_KARTEN,
  berechnePlan,
  type KartenId,
} from "@/lib/journey";
import { JourneyWarnung } from "./journey-warnung";
import { JourneyInput } from "./journey-input";
import { JourneyTotal } from "./journey-total";
import { JourneyCard } from "./journey-card";
import { JourneyPlan } from "./journey-plan";
import { NewsletterForm } from "./newsletter-form";

const ALLE_KARTEN_IDS: KartenId[] = [
  "grundfreibetrag",
  "uebungsleiter",
  "ehrenamt",
  "passiv",
];

export function Journey() {
  const [algI, setAlgI] = useState(0);
  const [stunden, setStunden] = useState(12);
  const [aktivKarten, setAktivKarten] = useState<Set<string>>(
    () => new Set<string>(ALLE_KARTEN_IDS),
  );

  const plan = useMemo(
    () => berechnePlan({ algI, stunden, aktivKarten }),
    [algI, stunden, aktivKarten],
  );

  const alleKartenAktiv = aktivKarten.size === ALLE_KARTEN_IDS.length;

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
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <div className="mb-10 text-center">
          <h2 className="text-balance text-3xl font-black text-navy-900 md:text-5xl">
            Dein persönlicher Plan
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-balance text-lg text-navy-600">
            Trage dein ALG I ein — du siehst sofort, wie viel du zusätzlich
            abzugsfrei verdienen darfst.
          </p>
        </div>

        <div className="space-y-6">
          <JourneyWarnung stunden={stunden} />

          <JourneyInput
            algI={algI}
            stunden={stunden}
            onAlgIChange={setAlgI}
            onStundenChange={setStunden}
          />

          <JourneyTotal
            algI={algI}
            plan={plan}
            alleKartenAktiv={alleKartenAktiv}
          />

          {algI > 0 && (
            <NewsletterForm
              algI={algI}
              stunden={stunden}
              aktivKarten={aktivKarten}
              gesamtFreibetrag={plan.gesamtFreibetrag}
            />
          )}

          <details className="group rounded-3xl border border-navy-100 bg-white">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-5 md:p-6">
              <div>
                <div className="text-base font-bold text-navy-900 md:text-lg">
                  An meine Situation anpassen
                </div>
                <div className="text-sm text-navy-600">
                  Wähle aus, welche Pauschalen auf dich zutreffen
                </div>
              </div>
              <ChevronDown
                className="h-5 w-5 shrink-0 text-navy-500 transition-transform group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>
            <div className="grid gap-4 border-t border-navy-100 p-5 md:grid-cols-2 md:p-6">
              {JOURNEY_KARTEN.map((karte) => (
                <JourneyCard
                  key={karte.id}
                  karte={karte}
                  aktiv={aktivKarten.has(karte.id)}
                  onToggle={() => toggleKarte(karte.id as KartenId)}
                />
              ))}
            </div>
          </details>

          <JourneyPlan aktivKarten={aktivKarten} />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 1.4: Alte `journey-summary.tsx` löschen**

Run:
```bash
cd "C:\Projekte\webseiten\wasnun-jetzt"
rm src/components/sections/journey-summary.tsx
```

- [ ] **Step 1.5: Dev-Server starten und manuell prüfen**

Run:
```bash
cd "C:\Projekte\webseiten\wasnun-jetzt"
npm run dev
```

Öffne `http://localhost:3000/` und prüfe:
- ALG I eingeben → Ergebnis-Zahl erscheint sofort (ohne Karten zu klicken)
- Default: alle 4 Pauschalen sind aktiv → Maximal-Zahl
- Klick auf „An meine Situation anpassen" → Karten erscheinen
- Abwählen einer Karte → Ergebnis-Zahl sinkt live
- Stunden auf 15 → Warnbox wird rot
- Mobile (DevTools → iPhone-Profil) → einspaltig, keine Overflows

- [ ] **Step 1.6: Commit**

```bash
cd "C:\Projekte\webseiten\wasnun-jetzt"
git add src/components/sections/journey.tsx src/components/sections/journey-total.tsx src/components/sections/journey-plan.tsx
git rm src/components/sections/journey-summary.tsx
git commit -m "refactor: UX-Umbau Journey — Ergebnis vor Details, Smart-Default

- Default: alle 4 Pauschalen aktiv (Maximum statt Minimum)
- Ergebnis-Zahl direkt unter Inputs, ohne vorherige Klicks
- Details-Sektion (Karten) in <details>-Disclosure, default zu
- Schritte-Liste aus journey-summary.tsx in neue journey-plan.tsx
- Wizard-Badges entfernt, einheitlicher Flow"
```

---

## Task 2: Test-Setup mit `node --test`

**Files:**
- Modify: `package.json`

- [ ] **Step 2.1: Scripts in `package.json` ergänzen**

Füge unter `"scripts"` hinzu:

```json
"test": "node --experimental-strip-types --test tests/",
"test:watch": "node --experimental-strip-types --test --watch tests/"
```

Komplettes scripts-Feld sieht danach so aus:

```json
"scripts": {
  "dev": "next dev --turbopack",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "test": "node --experimental-strip-types --test tests/",
  "test:watch": "node --experimental-strip-types --test --watch tests/"
}
```

**Hinweis zu `--experimental-strip-types`:** Node 22.6+ kann TypeScript direkt ausführen (Type-Annotations werden beim Laden entfernt). In Node 24 ist das Flag noch experimentell, funktioniert aber stabil für einfache Type-Annotations (keine Enums, keine `namespace`, keine Decorators). Unser `src/lib/token.ts` ist kompatibel. Falls Node <22.6 installiert: `node --version` prüfen, ggf. `nvm install 22` oder `nvm install 24`.

- [ ] **Step 2.2: Tests-Ordner anlegen mit Smoke-Test**

Erstelle `tests/smoke.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";

test("test runner funktioniert", () => {
  assert.equal(1 + 1, 2);
});
```

- [ ] **Step 2.3: Tests ausführen**

Run:
```bash
cd "C:\Projekte\webseiten\wasnun-jetzt"
npm test
```

Expected: 1 test pass.

- [ ] **Step 2.4: Commit**

```bash
git add package.json tests/smoke.test.mjs
git commit -m "chore: Test-Runner einrichten (node --test)"
```

---

## Task 3: Token-Helper (HMAC)

**Files:**
- Create: `src/lib/token.ts`
- Test: `tests/token.test.mjs`

- [ ] **Step 3.1: Failing Test schreiben**

Erstelle `tests/token.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { createToken, verifyToken } from "../src/lib/token.ts";

// Test-Secret nur für diese Tests
process.env.TOKEN_SECRET = "test-secret-mindestens-32-bytes-lang-aaaa";

test("createToken + verifyToken: Roundtrip", () => {
  const payload = {
    email: "test@example.com",
    algI: 1200,
    stunden: 12,
    aktivKarten: ["grundfreibetrag", "uebungsleiter"],
    gesamtFreibetrag: 440,
  };
  const token = createToken(payload);
  const decoded = verifyToken(token);
  assert.equal(decoded?.email, payload.email);
  assert.equal(decoded?.algI, payload.algI);
  assert.deepEqual(decoded?.aktivKarten, payload.aktivKarten);
  assert.equal(decoded?.gesamtFreibetrag, payload.gesamtFreibetrag);
});

test("verifyToken: ungueltige Signatur → null", () => {
  const payload = { email: "a@b.de", algI: 0, stunden: 0, aktivKarten: [], gesamtFreibetrag: 0 };
  const token = createToken(payload);
  // Signatur kaputt machen: letzten Char aendern
  const tampered = token.slice(0, -1) + (token.slice(-1) === "A" ? "B" : "A");
  assert.equal(verifyToken(tampered), null);
});

test("verifyToken: abgelaufener Token → null", () => {
  const payload = { email: "a@b.de", algI: 0, stunden: 0, aktivKarten: [], gesamtFreibetrag: 0 };
  // Kurze Gueltigkeit (-1 s) fuer Test
  const token = createToken(payload, -1000);
  assert.equal(verifyToken(token), null);
});

test("verifyToken: kaputter Token-Format → null", () => {
  assert.equal(verifyToken("not-a-token"), null);
  assert.equal(verifyToken(""), null);
  assert.equal(verifyToken("a.b.c.d"), null);
});
```

**Hinweis:** Next.js-Projekte mit `strict: true` können direkt `.ts`-Imports in `node --test` nutzen (Node 24 + TypeScript-Type-Stripping). Falls Fehler: `--experimental-strip-types` Flag im Script ergänzen.

- [ ] **Step 3.2: Tests ausführen (müssen fehlschlagen)**

Run:
```bash
cd "C:\Projekte\webseiten\wasnun-jetzt"
npm test
```

Expected: FAIL — "Cannot find module '../src/lib/token.ts'".

- [ ] **Step 3.3: `src/lib/token.ts` implementieren**

```ts
import crypto from "node:crypto";

export type NewsletterTokenPayload = {
  email: string;
  algI: number;
  stunden: number;
  aktivKarten: string[];
  gesamtFreibetrag: number;
  exp: number; // Unix-Millis
};

type CreateInput = Omit<NewsletterTokenPayload, "exp">;

const DEFAULT_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 Tage

function getSecret(): string {
  const secret = process.env.TOKEN_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("TOKEN_SECRET fehlt oder zu kurz (mindestens 32 Zeichen).");
  }
  return secret;
}

export function createToken(payload: CreateInput, ttlMs = DEFAULT_TTL_MS): string {
  const withExp: NewsletterTokenPayload = {
    ...payload,
    exp: Date.now() + ttlMs,
  };
  const payloadB64 = Buffer.from(JSON.stringify(withExp)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", getSecret())
    .update(payloadB64)
    .digest("base64url");
  return `${payloadB64}.${signature}`;
}

export function verifyToken(token: string): NewsletterTokenPayload | null {
  if (typeof token !== "string" || !token.includes(".")) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [payloadB64, signature] = parts;
  const expectedSignature = crypto
    .createHmac("sha256", getSecret())
    .update(payloadB64)
    .digest("base64url");

  // Constant-Time-Compare gegen Timing-Angriffe
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expectedSignature);
  if (sigBuf.length !== expBuf.length) return null;
  if (!crypto.timingSafeEqual(sigBuf, expBuf)) return null;

  let decoded: NewsletterTokenPayload;
  try {
    decoded = JSON.parse(
      Buffer.from(payloadB64, "base64url").toString("utf-8"),
    ) as NewsletterTokenPayload;
  } catch {
    return null;
  }

  if (typeof decoded.exp !== "number" || decoded.exp < Date.now()) return null;
  return decoded;
}
```

- [ ] **Step 3.4: Tests ausführen (müssen grün sein)**

Run:
```bash
npm test
```

Expected: 4 tests pass (inkl. Smoke-Test: 5 total).

- [ ] **Step 3.5: Commit**

```bash
git add src/lib/token.ts tests/token.test.mjs
git commit -m "feat: HMAC-Token-Helper fuer Newsletter-Payload

- createToken(payload, ttl) / verifyToken(token)
- Default-TTL 7 Tage, Constant-Time-Compare gegen Timing-Angriffe
- Payload enthaelt email + Plan-Daten (algI, stunden, aktivKarten, gesamtFreibetrag)
- 4 Unit-Tests (Roundtrip, Tampered, Expired, Malformed)"
```

---

## Task 4: Plan-Mail HTML-Generator

**Files:**
- Create: `src/lib/plan-mail.ts`
- Test: `tests/plan-mail.test.mjs`

- [ ] **Step 4.1: Failing Test schreiben**

Erstelle `tests/plan-mail.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildPlanMailHtml } from "../src/lib/plan-mail.ts";

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
  assert.match(html, /1\.200 EUR/); // ALG-I-Betrag
});

test("buildPlanMailHtml: listet nur aktive Pauschalen", () => {
  const html = buildPlanMailHtml({
    email: "test@example.com",
    algI: 1000,
    stunden: 10,
    aktivKarten: ["grundfreibetrag", "uebungsleiter"],
    gesamtFreibetrag: 440,
    exp: Date.now() + 1000,
  });
  assert.match(html, /Grundfreibetrag/);
  assert.match(html, /Übungsleiter/);
  assert.doesNotMatch(html, /\+80 EUR/); // Ehrenamt nicht drin
});

test("buildPlanMailHtml: Warnbox bei stunden >= 15", () => {
  const html = buildPlanMailHtml({
    email: "test@example.com",
    algI: 1000,
    stunden: 18,
    aktivKarten: ["grundfreibetrag"],
    gesamtFreibetrag: 165,
    exp: Date.now() + 1000,
  });
  assert.match(html, /15/); // referenziert die 15-h-Grenze
  assert.match(html, /Aktuell liegst du bei 18 Stunden/);
});

test("buildPlanMailHtml: Passiv-Hinweis erscheint bei aktivierter Passiv-Karte", () => {
  const html = buildPlanMailHtml({
    email: "test@example.com",
    algI: 1000,
    stunden: 10,
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
    stunden: 10,
    aktivKarten: ["grundfreibetrag"],
    gesamtFreibetrag: 165,
    exp: Date.now() + 1000,
  });
  assert.match(html, /abmelden/i);
  assert.match(html, /Impressum/);
});
```

- [ ] **Step 4.2: Tests ausführen (müssen fehlschlagen)**

Run: `npm test`
Expected: FAIL — "Cannot find module '../src/lib/plan-mail.ts'".

- [ ] **Step 4.3: `src/lib/plan-mail.ts` implementieren**

```ts
import type { NewsletterTokenPayload } from "./token";

type PauschaleInfo = {
  id: string;
  label: string;
  betrag: number;
  beschreibung: string;
  schritt: string;
};

const PAUSCHALEN: Record<string, PauschaleInfo> = {
  grundfreibetrag: {
    id: "grundfreibetrag",
    label: "Grundfreibetrag",
    betrag: 165,
    beschreibung: "Anrechnungsfrei aus Erwerbstätigkeit",
    schritt:
      "165 EUR Grundfreibetrag — melde dich bei einer Minijob-Plattform an (Zenjob, Coople, Clickworker). Ca. 11–12 Std./Monat sind sicher.",
  },
  uebungsleiter: {
    id: "uebungsleiter",
    label: "Übungsleiterpauschale",
    betrag: 275,
    beschreibung: "§ 3 Nr. 26 EStG — nebenberufliche Tätigkeit im Verein",
    schritt:
      "275 EUR Übungsleiterpauschale — suche einen gemeinnützigen Verein über BAGFA. Ohne Lizenz: C-Trainer-Kurs mit Bildungsgutschein beantragen.",
  },
  ehrenamt: {
    id: "ehrenamt",
    label: "Ehrenamtspauschale",
    betrag: 80,
    beschreibung: "§ 3 Nr. 26a EStG — gemeinnützige Funktionen",
    schritt:
      "80 EUR Ehrenamtspauschale — frag bei deiner lokalen Freiwilligenagentur nach administrativen Rollen (Vorstand, Kassenwart, Platzwart).",
  },
  passiv: {
    id: "passiv",
    label: "Passive Einkommen",
    betrag: 0, // zeigt nur Hinweis-Text, keinen Betrag in der Tabelle
    beschreibung: "Vermietung + Kapital — nicht anrechenbar",
    schritt:
      "Passive Einkommen — prüfe Vermietung (Zimmer via WG-Gesucht) und Tagesgeld-Vergleich. Beides wird bei ALG I NICHT angerechnet.",
  },
};

function formatEur(n: number): string {
  return new Intl.NumberFormat("de-DE").format(n) + " EUR";
}

function formatDate(): string {
  return new Date().toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function buildPlanMailHtml(payload: NewsletterTokenPayload): string {
  const aktive = payload.aktivKarten
    .map((id) => PAUSCHALEN[id])
    .filter((p): p is PauschaleInfo => Boolean(p));

  const mitBetrag = aktive.filter((p) => p.betrag > 0);
  const hatPassiv = aktive.some((p) => p.id === "passiv");

  const zusammensetzungRows = mitBetrag
    .map(
      (p) => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #e6eaf0;color:#0f1f3d;">${p.label}</td>
      <td style="padding:8px 0;border-bottom:1px solid #e6eaf0;text-align:right;color:#00867a;font-weight:700;">+${formatEur(p.betrag)}</td>
    </tr>`,
    )
    .join("");

  const schritteList = aktive
    .map(
      (p, i) => `
    <tr><td style="padding:8px 0;">
      <table cellpadding="0" cellspacing="0" style="width:100%;">
        <tr>
          <td style="width:32px;vertical-align:top;">
            <div style="background:#00b89f;color:#fff;border-radius:16px;width:28px;height:28px;text-align:center;font-weight:800;line-height:28px;font-size:13px;">${i + 1}</div>
          </td>
          <td style="color:#334258;font-size:14px;line-height:1.5;padding-left:12px;">
            ${p.schritt}
          </td>
        </tr>
      </table>
    </td></tr>`,
    )
    .join("");

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

  const passivHinweis = hatPassiv
    ? `<p style="color:#334258;font-size:14px;margin:12px 0 0;">+ <strong>unbegrenzt aus Vermietung und Kapital</strong> — diese Einkünfte sind nicht anrechenbar.</p>`
    : "";

  return `<!DOCTYPE html>
<html lang="de"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Dein Plan</title>
</head>
<body style="margin:0;padding:0;background:#faf8f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0f1f3d;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#faf8f4;">
<tr><td align="center" style="padding:24px 12px;">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;padding:32px;">

  <tr><td style="padding-bottom:8px;color:#6b7a94;font-size:12px;text-transform:uppercase;letter-spacing:1.5px;">
    Dein Plan für ALG I + Nebeneinkommen · ${formatDate()}
  </td></tr>

  <tr><td align="center" style="padding:16px 0 8px;">
    <div style="font-size:48px;font-weight:900;color:#00867a;line-height:1.1;">+${formatEur(payload.gesamtFreibetrag)}</div>
    <div style="margin-top:8px;font-size:16px;color:#334258;">monatlich — abzugsfrei zu deinem ALG I von <strong>${formatEur(payload.algI)}</strong></div>
  </td></tr>

  <tr><td style="padding-top:24px;">
    <div style="font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:#6b7a94;margin-bottom:12px;">Deine Zusammensetzung</div>
    <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
      ${zusammensetzungRows}
      <tr>
        <td style="padding:12px 0;font-weight:800;color:#0f1f3d;">Gesamt monatlich</td>
        <td style="padding:12px 0;text-align:right;font-weight:800;color:#00867a;">+${formatEur(payload.gesamtFreibetrag)}</td>
      </tr>
    </table>
    ${passivHinweis}
  </td></tr>

  <tr><td>${warnbox15h}</td></tr>

  <tr><td style="padding-top:16px;">
    <div style="font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:#6b7a94;margin-bottom:12px;">So startest du</div>
    <table width="100%" cellpadding="0" cellspacing="0">
      ${schritteList}
    </table>
  </td></tr>

  <tr><td style="padding:24px 0 8px;">
    <div style="background:#fef3c7;border-radius:12px;padding:16px;color:#78350f;font-size:13px;">
      <strong>Meldepflicht (Pflicht!):</strong> Jede Nebentätigkeit muss spätestens am ersten Arbeitstag bei der Agentur für Arbeit gemeldet werden. Hotline: <strong>0800 4 5555 00</strong>
    </div>
  </td></tr>

  <tr><td style="padding-top:24px;color:#8a95a8;font-size:11px;line-height:1.5;">
    Dies ist keine Rechtsberatung. Stand: April 2026. Für verbindliche Auskünfte: Agentur für Arbeit.
  </td></tr>

  <tr><td style="padding-top:24px;border-top:1px solid #e6eaf0;color:#8a95a8;font-size:11px;text-align:center;">
    <a href="https://wasnun-jetzt.de" style="color:#00867a;text-decoration:none;">wasnun-jetzt.de</a> ·
    <a href="https://wasnun-jetzt.de/impressum" style="color:#00867a;text-decoration:none;">Impressum</a> ·
    <a href="{{params.unsubscribe}}" style="color:#00867a;text-decoration:none;">Newsletter abmelden</a>
  </td></tr>

</table>
</td></tr>
</table>
</body></html>`;
}
```

**Hinweis:** `{{params.unsubscribe}}` ist ein Brevo-Template-Platzhalter, den Brevo beim Versand automatisch mit einem funktionierenden Abmelde-Link ersetzt, sofern die Kontaktliste in Brevo mit Double-Opt-in konfiguriert ist. Falls nicht: vorübergehend durch `https://wasnun-jetzt.de/impressum#newsletter-abmeldung` ersetzen und später austauschen.

- [ ] **Step 4.4: Tests ausführen (müssen grün sein)**

Run: `npm test`
Expected: 5 tests pass.

- [ ] **Step 4.5: Commit**

```bash
git add src/lib/plan-mail.ts tests/plan-mail.test.mjs
git commit -m "feat: HTML-Generator fuer persoenliche Plan-Mail

- buildPlanMailHtml(payload) erzeugt responsive Mail
- Zusammensetzung tabellarisch, Umsetzungs-Schritte nummeriert
- 15-h-Warnbox faerbt rot bei stunden>=15
- Passiv-Hinweis nur bei aktivierter Passiv-Karte
- 5 Unit-Tests auf Struktur und Conditional-Rendering"
```

---

## Task 5: API-Route `POST /api/newsletter` auf Doppel-Opt-in umbauen

**Files:**
- Modify: `src/app/api/newsletter/route.ts`

- [ ] **Step 5.1: Route umschreiben**

Ersetze den Inhalt komplett mit:

```ts
import { NextResponse } from "next/server";
import { createToken } from "@/lib/token";

// In-Memory-Rate-Limit: max. 3 Requests pro IP pro Minute.
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

const BEKANNTE_KARTEN = new Set([
  "grundfreibetrag",
  "uebungsleiter",
  "ehrenamt",
  "passiv",
]);

function normalizeAktivKarten(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  return input.filter(
    (x): x is string => typeof x === "string" && BEKANNTE_KARTEN.has(x),
  );
}

function isSafeNumber(n: unknown, max: number): n is number {
  return typeof n === "number" && Number.isFinite(n) && n >= 0 && n <= max;
}

type Payload = {
  email?: unknown;
  algI?: unknown;
  stunden?: unknown;
  aktivKarten?: unknown;
  gesamtFreibetrag?: unknown;
};

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://wasnun-jetzt.de";

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

  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  if (!isValidEmail(body.email)) {
    return NextResponse.json(
      { error: "Bitte gültige E-Mail-Adresse eintragen." },
      { status: 400 },
    );
  }
  if (!isSafeNumber(body.algI, 10_000)) {
    return NextResponse.json({ error: "Ungültiger ALG-I-Betrag." }, { status: 400 });
  }
  if (!isSafeNumber(body.stunden, 50)) {
    return NextResponse.json({ error: "Ungültige Stunden-Angabe." }, { status: 400 });
  }
  if (!isSafeNumber(body.gesamtFreibetrag, 5_000)) {
    return NextResponse.json({ error: "Ungültiger Freibetrag." }, { status: 400 });
  }
  const aktivKarten = normalizeAktivKarten(body.aktivKarten);
  if (aktivKarten.length === 0) {
    return NextResponse.json(
      { error: "Mindestens eine Pauschale muss aktiv sein." },
      { status: 400 },
    );
  }

  // Token mit Plan-Daten signieren (7 Tage gueltig)
  const token = createToken({
    email: body.email,
    algI: body.algI,
    stunden: body.stunden,
    aktivKarten,
    gesamtFreibetrag: body.gesamtFreibetrag,
  });

  const confirmUrl = `${BASE_URL}/api/newsletter/confirm?token=${encodeURIComponent(token)}`;

  // Brevo Confirm-Mail senden (kurz und funktional)
  const brevoKey = process.env.BREVO_API_KEY;
  if (!brevoKey) {
    console.error("[newsletter] BREVO_API_KEY fehlt");
    return NextResponse.json(
      { error: "Mail-Service nicht konfiguriert." },
      { status: 500 },
    );
  }

  const confirmHtml = `<!DOCTYPE html>
<html lang="de"><body style="margin:0;padding:0;background:#faf8f4;font-family:-apple-system,BlinkMacSystemFont,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#faf8f4;">
<tr><td align="center" style="padding:32px 16px;">
<table width="500" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;padding:32px;max-width:500px;">
  <tr><td>
    <h1 style="color:#0f1f3d;font-size:22px;margin:0 0 16px;">Bestätige deine Anmeldung</h1>
    <p style="color:#334258;font-size:15px;line-height:1.6;margin:0 0 24px;">
      Du hast deinen persönlichen ALG-I-Plan angefordert. Klick einmal hier, dann bekommst du ihn per Mail:
    </p>
    <p style="margin:24px 0;">
      <a href="${confirmUrl}" style="display:inline-block;background:#00b89f;color:#fff;text-decoration:none;padding:14px 28px;border-radius:10px;font-weight:700;">Plan jetzt zuschicken</a>
    </p>
    <p style="color:#6b7a94;font-size:12px;line-height:1.5;margin:24px 0 0;">
      Wenn du diese Anmeldung nicht angefragt hast, ignoriere die Mail einfach — es passiert nichts. Der Link ist 7 Tage gültig.
    </p>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>`;

  const brevoRes = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": brevoKey,
    },
    body: JSON.stringify({
      sender: { name: "Wasnun-jetzt", email: "noreply@wasnun-jetzt.de" },
      to: [{ email: body.email }],
      subject: "Bestätige deine Anmeldung — dein Plan wartet",
      htmlContent: confirmHtml,
    }),
  });

  if (!brevoRes.ok) {
    const errText = await brevoRes.text();
    console.error("[newsletter] Brevo-Fehler:", brevoRes.status, errText);
    return NextResponse.json(
      { error: "Mail konnte nicht gesendet werden." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 5.2: Lokaler Test via curl (ohne Brevo, erwartet 500)**

Run (in anderem Terminal, während `npm run dev` läuft):
```bash
curl -s -X POST http://localhost:3000/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","algI":1200,"stunden":12,"aktivKarten":["grundfreibetrag"],"gesamtFreibetrag":165}'
```
Expected: `{"error":"Mail-Service nicht konfiguriert."}` (500) — weil `BREVO_API_KEY` in `.env.local` noch nicht gesetzt ist. Validierung hat gegriffen. 

Run mit ungültiger E-Mail:
```bash
curl -s -X POST http://localhost:3000/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{"email":"keine-mail","algI":1200,"stunden":12,"aktivKarten":["grundfreibetrag"],"gesamtFreibetrag":165}'
```
Expected: `{"error":"Bitte gültige E-Mail-Adresse eintragen."}` (400).

- [ ] **Step 5.3: Commit**

```bash
git add src/app/api/newsletter/route.ts
git commit -m "feat: POST /api/newsletter auf Doppel-Opt-in

- Validiert email + Plan-Daten, rate-limited (3/min/IP)
- Erzeugt signierten Token mit Plan-Payload (7 Tage TTL)
- Sendet Brevo Confirm-Mail mit CTA-Button auf /api/newsletter/confirm"
```

---

## Task 6: API-Route `GET /api/newsletter/confirm`

**Files:**
- Create: `src/app/api/newsletter/confirm/route.ts`

- [ ] **Step 6.1: Route neu anlegen**

Erstelle `src/app/api/newsletter/confirm/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/token";
import { buildPlanMailHtml } from "@/lib/plan-mail";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://wasnun-jetzt.de";

function errorHtml(message: string): string {
  return `<!DOCTYPE html><html lang="de"><head><meta charset="utf-8"><title>Fehler</title>
<style>body{font-family:-apple-system,sans-serif;text-align:center;padding:60px 20px;background:#faf8f4;color:#0f1f3d;}h1{color:#dc2626;}a{color:#00867a;}</style>
</head><body><h1>Das hat nicht geklappt</h1><p>${message}</p><p><a href="${BASE_URL}">Zurück zur Startseite</a></p></body></html>`;
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) {
    return new NextResponse(errorHtml("Kein Bestätigungs-Token angegeben."), {
      status: 400,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return new NextResponse(
      errorHtml("Dieser Bestätigungs-Link ist ungültig oder abgelaufen (7 Tage)."),
      { status: 410, headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }

  const brevoKey = process.env.BREVO_API_KEY;
  const listId = process.env.BREVO_LIST_ID
    ? Number(process.env.BREVO_LIST_ID)
    : null;

  if (!brevoKey) {
    console.error("[confirm] BREVO_API_KEY fehlt");
    return new NextResponse(errorHtml("Mail-Service nicht konfiguriert."), {
      status: 500,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

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

  // 2. Plan-Mail senden
  const planMailHtml = buildPlanMailHtml(payload);
  const mailRes = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": brevoKey,
    },
    body: JSON.stringify({
      sender: { name: "Wasnun-jetzt", email: "noreply@wasnun-jetzt.de" },
      to: [{ email: payload.email }],
      subject: "Dein persönlicher ALG-I-Plan",
      htmlContent: planMailHtml,
    }),
  });

  if (!mailRes.ok) {
    const errText = await mailRes.text();
    console.error("[confirm] Brevo-Plan-Mail Fehler:", mailRes.status, errText);
    return new NextResponse(errorHtml("Die Plan-Mail konnte nicht gesendet werden. Bitte versuche es später nochmal."), {
      status: 502,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  // 3. Redirect auf Thank-You-Seite
  return NextResponse.redirect(
    new URL("/danke-plan-versendet", request.url),
    303,
  );
}
```

- [ ] **Step 6.2: Lokaler Test mit gefälschtem Token**

Run:
```bash
curl -s -i "http://localhost:3000/api/newsletter/confirm?token=kaputt" | head -5
```
Expected: HTTP 410, HTML mit „ungültig oder abgelaufen".

- [ ] **Step 6.3: Commit**

```bash
git add src/app/api/newsletter/confirm/route.ts
git commit -m "feat: GET /api/newsletter/confirm — Opt-in-Bestaetigung

- Verifiziert Token, extrahiert Plan-Payload
- Brevo Contact-Upsert mit Custom-Attributen (fuer Remarketing)
- Sendet persoenliche Plan-Mail via Brevo
- Redirect auf /danke-plan-versendet (303)
- HTML-Fehlerseiten fuer ungueltige/abgelaufene Tokens"
```

---

## Task 7: Thank-you-Seite `/danke-plan-versendet`

**Files:**
- Create: `src/app/danke-plan-versendet/page.tsx`

- [ ] **Step 7.1: Seite anlegen**

Erstelle `src/app/danke-plan-versendet/page.tsx`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Plan unterwegs",
  description:
    "Dein persönlicher ALG-I-Plan wurde per E-Mail versendet. Bitte prüfe auch den Spam-Ordner.",
  robots: { index: false, follow: false },
};

export default function DankePlanVersendetPage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-navy-50/40 px-4 py-20">
      <div className="mx-auto max-w-lg rounded-3xl border border-navy-100 bg-white p-8 text-center shadow-lg md:p-12">
        <CheckCircle
          className="mx-auto h-16 w-16 text-teal-500"
          aria-hidden="true"
        />
        <h1 className="mt-6 text-3xl font-black text-navy-900 md:text-4xl">
          Dein Plan ist unterwegs
        </h1>
        <p className="mt-4 text-navy-600">
          Wir haben deinen persönlichen Plan soeben an dein Postfach geschickt.
          Falls er nicht in den nächsten Minuten ankommt, schau bitte auch im
          Spam-Ordner nach.
        </p>
        <div className="mt-8">
          <Button variant="outline" size="lg" asChild>
            <Link href="/">Zurück zur Startseite</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 7.2: Lokaler Test**

Öffne `http://localhost:3000/danke-plan-versendet` — Seite muss erscheinen mit Haken-Icon, Überschrift, Zurück-Button.

- [ ] **Step 7.3: Commit**

```bash
git add src/app/danke-plan-versendet/page.tsx
git commit -m "feat: Thank-you-Seite /danke-plan-versendet

- noindex, nofollow (DSGVO: persoenliche URLs nicht indexieren)
- Haken-Icon, freundliche Microcopy mit Spam-Hinweis
- Zurueck-Link zur Startseite"
```

---

## Task 8: Newsletter-Form erweitern (Plan-Daten als Props)

**Files:**
- Modify: `src/components/sections/newsletter-form.tsx`

- [ ] **Step 8.1: Komponente umschreiben**

Ersetze den Inhalt komplett:

```tsx
"use client";

import { useState, type FormEvent } from "react";
import { Check, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  algI: number;
  stunden: number;
  aktivKarten: Set<string>;
  gesamtFreibetrag: number;
};

type Status = "idle" | "loading" | "success" | "error";

export function NewsletterForm({
  algI,
  stunden,
  aktivKarten,
  gesamtFreibetrag,
}: Props) {
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
        body: JSON.stringify({
          email,
          algI,
          stunden,
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
            Wir haben dir eine Bestätigungs-Mail geschickt. Klick den Link
            darin — dann kommt dein Plan. (Auch Spam-Ordner prüfen.)
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

- [ ] **Step 8.2: Manuelle Verifikation im Dev-Server**

Öffne `http://localhost:3000/` → ALG I eingeben → Newsletter-Form erscheint direkt unter der Ergebnis-Zahl → Layout passt, keine Überlappung.

Hinweis: `journey.tsx` aus Task 1 ruft `NewsletterForm` bereits mit den neuen Props auf. Kein weiterer Aufruf-Schritt nötig.

- [ ] **Step 8.3: Commit**

```bash
git add src/components/sections/newsletter-form.tsx
git commit -m "feat: Newsletter-Form sendet Plan-Daten mit

- Props: algI, stunden, aktivKarten, gesamtFreibetrag
- Payload an /api/newsletter: email + Plan-Daten komplett
- Success-State: 'Check dein Postfach' mit Spam-Hinweis
- Copy erneuert: 'Plan zuschicken' statt generisch 'Eintragen'"
```

---

## Task 9: Datenschutz-Seite ergänzen

**Files:**
- Modify: `src/app/datenschutz/page.tsx`

- [ ] **Step 9.1: Bestehende Seite lesen**

Run:
```bash
cat "C:\Projekte\webseiten\wasnun-jetzt\src\app\datenschutz\page.tsx" | head -80
```

Identifiziere, wo bestehende Abschnitte zu Newsletter/externen Diensten stehen (vermutlich im mittleren Drittel).

- [ ] **Step 9.2: Abschnitt „Newsletter + Plan-Versand" einfügen**

Füge **vor** dem bestehenden Abschnitt zu externen Diensten (oder nach dem Abschnitt zu „Kontaktaufnahme") folgenden Block ein:

```tsx
<section className="mt-10">
  <h2 className="text-2xl font-black text-navy-900">
    Newsletter und Plan-Versand
  </h2>
  <p className="mt-4 text-navy-700">
    Wenn du deinen persönlichen Plan per E-Mail anforderst, speichern wir
    zusätzlich zur E-Mail-Adresse die freiwillig eingegebenen Rechner-Daten
    (ALG-I-Betrag, Stunden pro Woche, aktivierte Pauschalen, errechneter
    Freibetrag) als Kontaktattribute bei unserem Mail-Dienstleister Brevo
    (Sendinblue SAS, 106 boulevard Haussmann, 75008 Paris, Frankreich). Das
    erlaubt uns, dir deinen persönlichen Plan zuzusenden und gelegentlich
    thematisch passende Tipps zu schicken.
  </p>
  <p className="mt-4 text-navy-700">
    Wir nutzen ein Double-Opt-in-Verfahren: Nach deiner Anforderung bekommst
    du eine Bestätigungs-Mail mit einem Link. Erst nach Klick darauf wird
    deine Adresse in unseren Verteiler aufgenommen und der Plan verschickt.
  </p>
  <p className="mt-4 text-navy-700">
    <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO
    (Einwilligung). Du kannst die Einwilligung jederzeit widerrufen, indem
    du auf den Abmelde-Link in jeder Mail klickst. Nach Widerruf werden
    sowohl deine Adresse als auch die gespeicherten Rechner-Daten aus Brevo
    gelöscht.
  </p>
</section>
```

Falls die bestehende Datei andere JSX-Strukturen nutzt (z.B. Markdown-Import, MDX, Prose-Container), den Inhalt anpassen — aber die inhaltlichen Aussagen beibehalten.

- [ ] **Step 9.3: Lokale Prüfung**

Öffne `http://localhost:3000/datenschutz`, suche nach „Newsletter und Plan-Versand" → Abschnitt sichtbar, Formulierung korrekt, passt ins Layout.

- [ ] **Step 9.4: Commit**

```bash
git add src/app/datenschutz/page.tsx
git commit -m "docs: Datenschutz um Newsletter/Plan-Versand ergaenzt

- Erklaerung zu Brevo als Auftragsverarbeiter
- Hinweis auf gespeicherte Custom-Attribute (Plan-Daten)
- Double-Opt-in Erklaerung, Widerrufsweg
- Rechtsgrundlage Art. 6 Abs. 1 lit. a DSGVO"
```

---

## Task 10: Env-Konfiguration + Brevo-Setup (manuelle Schritte)

**Keine Code-Änderung, aber ohne diese Schritte funktioniert Task 5–6 nicht in Produktion.**

- [ ] **Step 10.1: Brevo-Kontaktliste anlegen**

Browser → https://app.brevo.com/ → Contacts → Lists → „Create a list"
- Name: `wasnun-jetzt`
- Nach dem Anlegen die numerische **List-ID** notieren (steht in der URL oder in der Detail-Ansicht).

- [ ] **Step 10.2: Brevo Custom-Attribute anlegen**

Browser → Contacts → Settings → „Contact attributes" → Add four attributes:
- `ALG_I_BETRAG` (Type: Number)
- `STUNDEN_WOCHE` (Type: Number)
- `PAUSCHALEN` (Type: Text)
- `GESAMT_FREIBETRAG` (Type: Number)

- [ ] **Step 10.3: Brevo Double-Opt-in aktivieren (optional, empfohlen)**

Contacts → Settings → Opt-in configuration → Double opt-in für Liste `wasnun-jetzt` aktivieren, damit der Abmelde-Link-Platzhalter `{{params.unsubscribe}}` funktioniert.

- [ ] **Step 10.4: `.env.local` lokal erweitern**

Öffne `C:\Projekte\webseiten\wasnun-jetzt\.env.local` (falls nicht da: neu erstellen) und füge hinzu:

```env
TOKEN_SECRET=<32+-Zeichen-Zufalls-String — am einfachsten: powershell -c "[Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(32))">
BREVO_API_KEY=<aus Brevo: SMTP & API → API Keys>
BREVO_LIST_ID=<numerische ID aus Step 10.1>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

- [ ] **Step 10.5: Vercel-Env-Variablen setzen (Preview + Production)**

Im Vercel-Dashboard → Projekt `wasnun-jetzt` → Settings → Environment Variables:

Für **Preview** und **Production** jeweils:
- `TOKEN_SECRET` — **derselbe** Wert wie lokal (aber sicher neu generiert, nicht aus `.env.local` kopieren falls du lokale und Prod-Tokens trennen willst — Empfehlung: trennen)
- `BREVO_API_KEY` — derselbe Key
- `BREVO_LIST_ID` — dieselbe List-ID
- `NEXT_PUBLIC_SITE_URL` — Preview: Preview-URL; Production: `https://wasnun-jetzt.de`

Alternative über Vercel-CLI (schneller):
```bash
cd "C:\Projekte\webseiten\wasnun-jetzt"
vercel env add TOKEN_SECRET preview
# ... für jede Variable, dann production wiederholen
```

- [ ] **Step 10.6: Preview-Deploy triggern**

Run:
```bash
cd "C:\Projekte\webseiten\wasnun-jetzt"
git push
```

(Push des letzten Commits aus Task 9 löst Vercel-Preview-Build aus.)

---

## Task 11: End-to-End-Test auf Preview-URL

**Keine Code-Änderung — reiner Verifikations-Lauf.**

- [ ] **Step 11.1: Preview-URL öffnen**

Browser → `https://wasnun-jetzt-git-feat-wasnun-journey-doylims-projects.vercel.app`

- [ ] **Step 11.2: UX-Checkliste**

- [ ] ALG I eingeben (z.B. 1200) → Ergebnis-Zahl erscheint direkt darunter, ohne Karten zu klicken
- [ ] Default: alle 4 Pauschalen aktiv (Details-Sektion zugeklappt, aber alle Karten im Hintergrund aktiv)
- [ ] Kleintext unter Ergebnis-Zahl: „Maximaler Freibetrag — passe ihn bei Bedarf an"
- [ ] Details-Button „An meine Situation anpassen" öffnet → alle 4 Karten sichtbar, Grundfreibetrag nicht abwählbar
- [ ] Eine Karte abwählen → Ergebnis-Zahl sinkt live + Kleintext wird zu „Basierend auf deiner Auswahl"
- [ ] Stunden auf 15 → Warnbox wird rot, Ergebnis-Block rötlich
- [ ] Mobile-Ansicht (DevTools iPhone) → einspaltig, keine Horizontal-Scroll

- [ ] **Step 11.3: Newsletter-Flow E2E**

- [ ] Newsletter-Form ist sichtbar (sobald ALG I > 0)
- [ ] Eigene E-Mail eingeben → „Plan zuschicken" klicken → Success-State „Check dein Postfach" erscheint
- [ ] Im Postfach: Confirm-Mail angekommen (ggf. Spam prüfen), Betreff „Bestätige deine Anmeldung"
- [ ] Button „Plan jetzt zuschicken" klicken → Redirect auf `/danke-plan-versendet` mit Haken-Icon
- [ ] Kurz warten → Zweite Mail „Dein persönlicher ALG-I-Plan" im Postfach
- [ ] Plan-Mail inhaltlich prüfen:
  - [ ] Die korrekte Euro-Zahl oben (z.B. +520 EUR)
  - [ ] Dein ALG-I-Betrag darunter (z.B. 1.200 EUR)
  - [ ] Tabelle nur mit aktivierten Pauschalen
  - [ ] Umsetzungs-Schritte einmal pro aktivierter Pauschale
  - [ ] Warnbox korrekt (amber bei <15h, rot bei ≥15h)
  - [ ] Footer mit Impressum + Abmelde-Link
- [ ] Abmelde-Link klicken → Brevo-Abmelde-Bestätigung sichtbar

- [ ] **Step 11.4: Edge-Cases**

- [ ] Zweite Anmeldung mit **selben** E-Mail → funktioniert (Brevo Contact-Upsert)
- [ ] Alter/manipulierter Token → Fehlerseite „ungültig oder abgelaufen" (410)
- [ ] 4 Submits in 30 Sekunden von selber IP → vierter bekommt 429

- [ ] **Step 11.5: Brevo-Dashboard-Check**

Brevo → Contacts → Liste `wasnun-jetzt` → dein Test-Kontakt enthält die Custom-Attribute `ALG_I_BETRAG`, `STUNDEN_WOCHE`, `PAUSCHALEN`, `GESAMT_FREIBETRAG` mit korrekten Werten.

- [ ] **Step 11.6: Wenn alle Checks grün: Merge vorbereiten**

```bash
cd "C:\Projekte\webseiten\wasnun-jetzt"
git checkout main
git pull
git merge feat/wasnun-journey --no-ff -m "feat: UX-Umbau Journey + personalisierte Plan-Mail (Doppel-Opt-in)

Siehe docs/superpowers/plans/2026-04-16-wasnun-jetzt-ux-und-plan-mail.md"
git push
```

**Stop und Rücksprache vor dem Merge.** Der Merge auf `main` löst den Production-Deploy auf `wasnun-jetzt.de` aus. Norbert sollte das letzte „Go" geben.

---

## Offene Punkte / Known-Issues

- **Brevo-Sender `noreply@wasnun-jetzt.de`:** Diese Absenderadresse muss in Brevo als verifizierter Sender angelegt sein, sonst scheitert der Versand. Falls nicht vorhanden: Brevo → Senders & IP → Senders → „Add a sender" mit DNS-Eintrag (DKIM/SPF). Bei Domain-Problemen vorübergehend eine verifizierte Brevo-Test-Adresse nutzen.
- **In-Memory-Rate-Limit:** Auf Vercel Fluid Compute überlebt die Map zwischen Requests in derselben Function-Instance, aber nicht zwischen Instances. Für MVP OK, bei Missbrauch auf Upstash Redis umstellen.
- **`{{params.unsubscribe}}`-Platzhalter:** Funktioniert nur wenn Brevo-Liste mit Double-Opt-in-Template verbunden ist. Bei Problemen: durch direkten Brevo-Unsubscribe-Link ersetzen (Brevo liefert pro-Kontakt-URL in der Contact-API).
- **Tests für API-Routen:** Nicht im Scope (braucht Next.js-Test-Setup mit `next test` oder Playwright). End-to-End-Lauf in Task 11 deckt das funktional ab.
