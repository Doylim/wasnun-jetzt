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
