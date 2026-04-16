import { test } from "node:test";
import assert from "node:assert/strict";

// Test-Secret nur fuer diese Tests - muss VOR dem Import gesetzt werden
process.env.TOKEN_SECRET = "test-secret-mindestens-32-bytes-lang-aaaa";

const { createToken, verifyToken } = await import("../src/lib/token.ts");

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

test("verifyToken: ungueltige Signatur -> null", () => {
  const payload = { email: "a@b.de", algI: 0, stunden: 0, aktivKarten: [], gesamtFreibetrag: 0 };
  const token = createToken(payload);
  // Signatur kaputt machen: letzten Char aendern
  const tampered = token.slice(0, -1) + (token.slice(-1) === "A" ? "B" : "A");
  assert.equal(verifyToken(tampered), null);
});

test("verifyToken: abgelaufener Token -> null", () => {
  const payload = { email: "a@b.de", algI: 0, stunden: 0, aktivKarten: [], gesamtFreibetrag: 0 };
  // Kurze Gueltigkeit (-1 s) fuer Test
  const token = createToken(payload, -1000);
  assert.equal(verifyToken(token), null);
});

test("verifyToken: kaputter Token-Format -> null", () => {
  assert.equal(verifyToken("not-a-token"), null);
  assert.equal(verifyToken(""), null);
  assert.equal(verifyToken("a.b.c.d"), null);
});
