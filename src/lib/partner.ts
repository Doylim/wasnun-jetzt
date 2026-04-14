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
