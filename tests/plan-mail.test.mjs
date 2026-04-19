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
