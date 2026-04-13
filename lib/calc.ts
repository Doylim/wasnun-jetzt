import { LEGAL } from './data'

export type Alg1Ergebnis = {
  freibetrag:   number
  anrechenbar:  number
  algNeu:       number
  gesamt:       number
  stundenOk:    boolean
}

export function berechneAlg1(alg: number, neben: number, stunden: number): Alg1Ergebnis {
  const stundenOk  = stunden <= LEGAL.alg1.maxStunden
  const freibetrag = LEGAL.alg1.freibetrag
  const anrechenbar = stundenOk ? Math.max(0, neben - freibetrag) : 0
  const algNeu      = Math.max(0, alg - anrechenbar)
  const gesamt      = algNeu + neben
  return { freibetrag, anrechenbar, algNeu, gesamt, stundenOk }
}

export type BgErgebnis = {
  frei:       number
  anrechnung: number
  bgNeu:      number
  gesamt:     number
}

export function berechneBuergergeld(bg: number, neben: number): BgErgebnis {
  const { grundfreibetrag, staffel1Max, staffel1Rate, staffel2Max, staffel2Rate } = LEGAL.buergergeld
  let frei = 0

  if (neben <= grundfreibetrag) {
    frei = neben
  } else if (neben <= staffel1Max) {
    frei = grundfreibetrag + (neben - grundfreibetrag) * staffel1Rate
  } else if (neben <= staffel2Max) {
    frei = grundfreibetrag + (staffel1Max - grundfreibetrag) * staffel1Rate
          + (neben - staffel1Max) * staffel2Rate
  } else {
    frei = grundfreibetrag + (staffel1Max - grundfreibetrag) * staffel1Rate
          + (staffel2Max - staffel1Max) * staffel2Rate
  }

  const anrechnung = Math.max(0, neben - frei)
  const bgNeu      = Math.max(0, bg - anrechnung)
  const gesamt     = bgNeu + neben
  return { frei, anrechnung, bgNeu, gesamt }
}

export function euro(n: number): string {
  return n.toFixed(0) + ' €'
}
