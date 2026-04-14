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
