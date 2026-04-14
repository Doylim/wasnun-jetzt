// ─────────────────────────────────────────────────────────
// Affiliate-Partner fuer WasNun.jetzt
// WICHTIG: Jeder Eintrag wird als "Werbung" gekennzeichnet.
// Die rechtlichen Informationen der Seite werden von der
// Kommerzialisierung strikt getrennt (§ 6 TMG).
// ─────────────────────────────────────────────────────────

export type Partner = {
  id: string;
  name: string;
  beschreibung: string;
  verdienst: string;
  url: string;
  tier: 1 | 2 | 3;
  typ:
    | "jobplattform"
    | "mikrojob"
    | "bildung"
    | "finanz"
    | "nachhilfe"
    | "fahrdienst";
  cpl: string;
  status: "aktiv" | "geplant"; // nur "aktiv" wird angezeigt
  tags: string[];
};

export const PARTNER: Partner[] = [
  // ── TIER 1: Direkte Verdienst-Partner ──
  {
    id: "zenjob",
    name: "Zenjob",
    beschreibung: "Kurzfristige Schichten in Gastro, Einzelhandel und Lager. Anmeldung in Minuten, erster Einsatz oft schon am naechsten Tag.",
    verdienst: "13,90-20 EUR/Std.",
    url: "https://www.zenjob.com",
    tier: 1,
    typ: "jobplattform",
    cpl: "5-25 EUR",
    status: "geplant",
    tags: ["sofort", "flexibel", "nah", "auto"],
  },
  {
    id: "coople",
    name: "Coople",
    beschreibung: "Flexible Jobs fuer Gastronomie, Events und Retail. Schichten selbst waehlen, digitale Stundenzettel.",
    verdienst: "14-22 EUR/Std.",
    url: "https://www.coople.com/de",
    tier: 1,
    typ: "jobplattform",
    cpl: "5-25 EUR",
    status: "geplant",
    tags: ["sofort", "flexibel", "nah"],
  },
  {
    id: "clickworker",
    name: "Clickworker",
    beschreibung: "Mikrojobs am Rechner: Texte schreiben, Daten kategorisieren, Umfragen. Voellig ortsunabhaengig.",
    verdienst: "50-300 EUR/Monat",
    url: "https://www.clickworker.de",
    tier: 1,
    typ: "mikrojob",
    cpl: "3-10 EUR",
    status: "geplant",
    tags: ["zuhause", "digital", "wenig", "flexibel"],
  },
  {
    id: "appjobber",
    name: "AppJobber",
    beschreibung: "Kleinauftraege per Smartphone in deiner Naehe: Fotos, Preischecks, kurze Recherchen. Heute anmelden, heute verdienen.",
    verdienst: "30-200 EUR/Monat",
    url: "https://www.appjobber.de",
    tier: 1,
    typ: "mikrojob",
    cpl: "3-10 EUR",
    status: "geplant",
    tags: ["sofort", "nah", "flexibel"],
  },
  {
    id: "streetspotr",
    name: "Streetspotr",
    beschreibung: "Mystery-Shopping und kleine Checks im Alltag. Perfekt als Nebeneinnahme bei Besorgungen.",
    verdienst: "30-150 EUR/Monat",
    url: "https://www.streetspotr.com",
    tier: 1,
    typ: "mikrojob",
    cpl: "3-10 EUR",
    status: "geplant",
    tags: ["sofort", "nah", "flexibel"],
  },
  {
    id: "preply",
    name: "Preply",
    beschreibung: "Online-Nachhilfe in Faechern die du beherrschst. Stundensatz selbst waehlen, feste Stammkundschaft aufbauen.",
    verdienst: "15-40 EUR/Std.",
    url: "https://preply.com/de",
    tier: 1,
    typ: "nachhilfe",
    cpl: "15-40 EUR",
    status: "geplant",
    tags: ["zuhause", "profi", "flexibel"],
  },

  // ── TIER 2: Bildung & Foerderung ──
  {
    id: "iu",
    name: "IU Fernstudium",
    beschreibung: "Staatlich anerkannte Abschluesse, oft ueber Bildungsgutschein (§ 81 SGB III) komplett foerderbar. AZAV-zertifiziert.",
    verdienst: "Qualifikation fuer bessere Jobs",
    url: "https://www.iu-fernstudium.de",
    tier: 2,
    typ: "bildung",
    cpl: "50-200 EUR",
    status: "geplant",
    tags: ["bildung", "foerderung", "zuhause"],
  },
  {
    id: "sgd",
    name: "SGD Fernschule",
    beschreibung: "Traditionsreiche Fernschule mit ueber 200 Kursen. Viele Angebote sind ueber Bildungsgutschein foerderfaehig.",
    verdienst: "Qualifikation fuer bessere Jobs",
    url: "https://www.sgd.de",
    tier: 2,
    typ: "bildung",
    cpl: "50-200 EUR",
    status: "geplant",
    tags: ["bildung", "foerderung", "zuhause"],
  },

  // ── TIER 3: Finanz-Tools ──
  {
    id: "taxfix",
    name: "Taxfix",
    beschreibung: "Steuererklaerung per App in unter einer Stunde. Gerade bei Nebenverdienst oft mehrere hundert Euro Rueckerstattung moeglich.",
    verdienst: "Rueckerstattung sichern",
    url: "https://taxfix.de",
    tier: 3,
    typ: "finanz",
    cpl: "10-20 EUR",
    status: "geplant",
    tags: ["finanz", "steuer"],
  },
];

export function aktivePartner(): Partner[] {
  return PARTNER.filter((p) => p.status === "aktiv");
}

export function partnerNachTags(tags: string[], tier?: 1 | 2 | 3): Partner[] {
  return PARTNER.filter(
    (p) =>
      (tier ? p.tier === tier : true) &&
      p.tags.some((t) => tags.includes(t)),
  );
}
