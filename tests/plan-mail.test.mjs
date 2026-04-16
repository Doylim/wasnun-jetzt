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
    stunden: 10,
    aktivKarten: ["grundfreibetrag", "uebungsleiter"],
    gesamtFreibetrag: 440,
    exp: Date.now() + 1000,
  });
  assert.match(html, /Grundfreibetrag/);
  assert.match(html, /Übungsleiter/);
  assert.doesNotMatch(html, /\+80 EUR/);
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
  assert.match(html, /15/);
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
