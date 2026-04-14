import { AlertTriangle, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { JourneyKarte, PlanErgebnis } from "@/lib/journey";
import { JOURNEY_KARTEN } from "@/lib/journey";
import { NewsletterForm } from "./newsletter-form";

type Props = {
  algI: number;
  plan: PlanErgebnis;
  aktivKarten: Set<string>;
};

function formatEur(n: number): string {
  return new Intl.NumberFormat("de-DE").format(n) + " EUR";
}

function schrittText(karte: JourneyKarte): string {
  switch (karte.id) {
    case "grundfreibetrag":
      return "165 EUR Grundfreibetrag – melde dich bei einer der Minijob-Plattformen oben an (Zenjob, Coople, Clickworker). Ca. 11–12 Std./Monat sind sicher.";
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

export function JourneySummary({ algI, plan, aktivKarten }: Props) {
  if (algI <= 0) return null;

  const aktiveSchritte = JOURNEY_KARTEN.filter((k) => aktivKarten.has(k.id));

  return (
    <div className="rounded-3xl border border-navy-100 bg-gradient-to-br from-navy-50 to-white p-6 md:p-10">
      <Badge variant="teal" className="mb-3">
        Schritt 3 von 3
      </Badge>
      <h3 className="text-3xl font-black text-navy-900 md:text-4xl">
        Dein Plan ist fertig
      </h3>
      <div className="mt-4 text-5xl font-black text-teal-600 md:text-6xl">
        +{formatEur(plan.gesamtFreibetrag)}
      </div>
      <div className="mt-1 text-navy-600">
        abzugsfrei zu deinem ALG I von{" "}
        <strong className="text-navy-900">{formatEur(algI)}</strong>
        {plan.hatPassiv && (
          <>
            {" "}
            + <strong className="text-teal-700">unbegrenzt aus Vermietung/Kapital</strong>
          </>
        )}
      </div>

      {plan.warnung15Stunden && (
        <div
          role="alert"
          className="mt-6 flex items-start gap-3 rounded-2xl border-2 border-red-300 bg-red-50 p-4 text-sm text-red-900"
        >
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" aria-hidden="true" />
          <div>
            <strong>Achtung:</strong> Bei 15 oder mehr Arbeitsstunden pro Woche
            verlierst du den ALG-I-Anspruch komplett. Sobald deine Stunden unter
            15 liegen, kannst du diesen Plan umsetzen.
          </div>
        </div>
      )}

      <div className="mt-8">
        <div className="mb-3 text-sm font-bold uppercase tracking-wide text-navy-500">
          So startest du
        </div>
        <ol className="space-y-3">
          {aktiveSchritte.map((karte, i) => (
            <li
              key={karte.id}
              className="flex items-start gap-3 rounded-2xl border border-navy-100 bg-white p-4"
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
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-2xl border-2 border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <Phone className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" />
        <div>
          <strong>Meldepflicht (Pflicht!):</strong> Jede Nebentätigkeit muss
          spätestens am ersten Arbeitstag bei der Agentur für Arbeit gemeldet
          werden. Hotline: <strong>0800 4 5555 00</strong>
        </div>
      </div>

      <div className="mt-8">
        <NewsletterForm />
      </div>
    </div>
  );
}
