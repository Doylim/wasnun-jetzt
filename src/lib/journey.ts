// ─────────────────────────────────────────────────────────
// lib/journey.ts – Datenmodell für den Unified Journey-Block
// 4 Karten: Grundfreibetrag, Übungsleiter, Ehrenamt, Passiv
// ─────────────────────────────────────────────────────────

export type KartenId = "grundfreibetrag" | "uebungsleiter" | "ehrenamt" | "passiv";

export type Unterabschnitt = {
  titel: string;
  partnerIds: string[];
};

export type JourneyKarte = {
  id: KartenId;
  titel: string;
  badge: string;
  immerAktiv: boolean;
  freibetragEur: number | null; // null = unbegrenzt (nur Karte 4)
  paragraph: string;
  erklaerung: string;
  tipp?: string;
  partnerIds: string[];
  bildungsgutschein?: boolean;
  unterabschnitte?: Unterabschnitt[];
};

export const JOURNEY_KARTEN: JourneyKarte[] = [
  {
    id: "grundfreibetrag",
    titel: "165 EUR Grundfreibetrag",
    badge: "Immer dein",
    immerAktiv: true,
    freibetragEur: 165,
    paragraph: "§ 155 SGB III",
    erklaerung:
      "Der pauschale Freibetrag. Bis zu diesem Betrag darfst du neben deinem ALG I dazuverdienen – komplett ohne Abzug. Das sind ca. 12 Stunden Arbeit pro Monat zum Mindestlohn.",
    tipp: "Halte dich bei rund 11–12 Std./Monat. Dann liegst du bei ca. 153–168 EUR – knapp unter der Grenze und 100 % sicher.",
    partnerIds: ["zenjob", "coople", "clickworker", "appjobber", "streetspotr"],
  },
  {
    id: "uebungsleiter",
    titel: "+275 EUR Übungsleiterpauschale",
    badge: "Zusätzlich anrechnungsfrei",
    immerAktiv: false,
    freibetragEur: 275,
    paragraph: "§ 3 Nr. 26 EStG",
    erklaerung:
      "Als Trainer, Chorleiter, Betreuer oder Ausbilder bei einem gemeinnützigen Verein, einer Schule oder öffentlichen Einrichtung. Kombinierbar mit dem Grundfreibetrag: 165 + 275 = 440 EUR/Monat komplett anrechnungsfrei.",
    tipp: "Keine Trainer-Lizenz? Als Betreuer oder Co-Trainer geht es meist auch ohne. Für die C-Trainer-Lizenz zahlt der Bildungsgutschein 100 % der Kosten.",
    partnerIds: ["bagfa-vereine", "academy-of-sports", "drk-ausbilder", "vhs-kursleitung"],
    bildungsgutschein: true,
  },
  {
    id: "ehrenamt",
    titel: "+80 EUR Ehrenamtspauschale",
    badge: "Zusätzlich anrechnungsfrei",
    immerAktiv: false,
    freibetragEur: 80,
    paragraph: "§ 3 Nr. 26a EStG",
    erklaerung:
      "Als Vereinsvorstand, Kassenwart, Platzwart oder für organisatorische Aufgaben in gemeinnützigen Vereinen. Kombinierbar mit dem Grundfreibetrag und der Übungsleiterpauschale bis 520 EUR/Monat anrechnungsfrei.",
    tipp: "Die 80 EUR gelten pro Person und Jahres-Engagement – nicht pro Verein. Wer in zwei Vereinen ehrenamtlich aktiv ist, bekommt trotzdem nur einmal 80 EUR/Monat pauschal.",
    partnerIds: ["bagfa-ehrenamt", "drk-ehrenamt", "caritas"],
  },
  {
    id: "passiv",
    titel: "Mieten & Kapital",
    badge: "Unbegrenzt – nicht angerechnet",
    immerAktiv: false,
    freibetragEur: null,
    paragraph: "§ 155 SGB III",
    erklaerung:
      "Mieteinnahmen und Kapitalerträge (Zinsen, Dividenden) werden bei ALG I NICHT angerechnet – unbegrenzt. Achtung: Beim Bürgergeld gelten andere Regeln.",
    partnerIds: [],
    unterabschnitte: [
      {
        titel: "Vermietung",
        partnerIds: ["wg-gesucht", "immobilienscout", "kleinanzeigen"],
      },
      {
        titel: "Kapital",
        partnerIds: ["c24-tagesgeld", "trade-republic"],
      },
    ],
  },
];

export type PlanState = {
  algI: number;
  stunden: number;
  aktivKarten: Set<string>;
};

export type PlanErgebnis = {
  gesamtFreibetrag: number;
  hatPassiv: boolean;
  warnung15Stunden: boolean;
};

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
