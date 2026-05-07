import { LEGAL } from "./data";

/**
 * Schutz gegen NaN, Infinity und negative Werte aus Form-Inputs.
 *
 * Hintergrund: Die Rechner-Inputs liefern bei leerem Feld oder
 * unvollstaendiger Zahl (z.B. "1.") `NaN` zurueck. Ohne Clamping
 * propagiert das durch `Math.max`, `*`, `+` und am Ende stehen
 * `NaN €` im UI – schlecht fuer Vertrauen und Lighthouse.
 *
 * Negative Werte ergeben rechtlich keinen Sinn (Verdienst kleiner 0
 * gibt es nicht), also auf 0 clampen.
 */
function safe(n: number): number {
  if (!Number.isFinite(n)) return 0;
  if (n < 0) return 0;
  return n;
}

export type Alg1Ergebnis = {
  freibetrag: number;
  anrechenbar: number;
  algNeu: number;
  gesamt: number;
  stundenOk: boolean;
};

export function berechneAlg1(
  alg: number,
  neben: number,
  stunden: number,
): Alg1Ergebnis {
  const algSafe = safe(alg);
  const nebenSafe = safe(neben);
  const stundenSafe = safe(stunden);

  // § 141 Abs. 1 SGB III: "weniger als 15 Stunden". 14.5 oder 14.99
  // sind also noch zulaessig. LEGAL.alg1.maxStunden bleibt = 14
  // (Anzeige fuer den Nutzer), die Rechen-Grenze ist strikt < 15.
  const stundenOk = stundenSafe < 15;
  const freibetrag = LEGAL.alg1.freibetrag;
  const anrechenbar = stundenOk ? Math.max(0, nebenSafe - freibetrag) : 0;
  const algNeu = Math.max(0, algSafe - anrechenbar);
  const gesamt = algNeu + nebenSafe;
  return { freibetrag, anrechenbar, algNeu, gesamt, stundenOk };
}

export type BgErgebnis = {
  frei: number;
  anrechnung: number;
  bgNeu: number;
  gesamt: number;
};

export function berechneBuergergeld(bg: number, neben: number): BgErgebnis {
  const bgSafe = safe(bg);
  const nebenSafe = safe(neben);

  const {
    grundfreibetrag,
    staffel1Max,
    staffel1Rate,
    staffel2Max,
    staffel2Rate,
  } = LEGAL.buergergeld;

  let frei = 0;

  if (nebenSafe <= grundfreibetrag) {
    frei = nebenSafe;
  } else if (nebenSafe <= staffel1Max) {
    frei = grundfreibetrag + (nebenSafe - grundfreibetrag) * staffel1Rate;
  } else if (nebenSafe <= staffel2Max) {
    frei =
      grundfreibetrag +
      (staffel1Max - grundfreibetrag) * staffel1Rate +
      (nebenSafe - staffel1Max) * staffel2Rate;
  } else {
    frei =
      grundfreibetrag +
      (staffel1Max - grundfreibetrag) * staffel1Rate +
      (staffel2Max - staffel1Max) * staffel2Rate;
  }

  const anrechnung = Math.max(0, nebenSafe - frei);
  const bgNeu = Math.max(0, bgSafe - anrechnung);
  const gesamt = bgNeu + nebenSafe;
  return { frei, anrechnung, bgNeu, gesamt };
}

export function euro(n: number): string {
  return safe(n).toFixed(0) + " €";
}
