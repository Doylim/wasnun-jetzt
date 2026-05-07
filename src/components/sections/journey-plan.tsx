import { Phone } from "lucide-react";
import type { JourneyKarte } from "@/lib/journey";
import { JOURNEY_KARTEN } from "@/lib/journey";
import { partnerNachIds } from "@/lib/partner";
import { PartnerLink } from "@/components/partner-link";

type Props = {
  aktivKarten: Set<string>;
};

/**
 * Schrittbeschreibungen sind bewusst plattform-frei formuliert –
 * konkrete Anbieter werden ausschliesslich aus partner.ts (status="aktiv")
 * via <PartnerLink> ausgespielt. Damit ist der Werbe-Hinweis (§ 6 TMG)
 * automatisch gesetzt und ein "geplant"-Partner kann nicht versehentlich
 * im Klartext stehen bleiben.
 */
function schrittText(karte: JourneyKarte): string {
  switch (karte.id) {
    case "grundfreibetrag":
      return "165 EUR Grundfreibetrag – such dir 1–2 Mikrojob- oder Schicht-Plattformen aus den Empfehlungen unten. Ca. 11–12 Std./Monat sind sicher.";
    case "uebungsleiter":
      return "275 EUR Übungsleiterpauschale – such einen gemeinnützigen Verein in deiner Stadt über die Empfehlungen unten. Ohne Lizenz: C-Trainer-Kurs mit Bildungsgutschein beantragen.";
    case "ehrenamt":
      return "80 EUR Ehrenamtspauschale – frag bei deiner lokalen Freiwilligenagentur nach administrativen Rollen (Vorstand, Kassenwart, Platzwart).";
    case "passiv":
      return "Passive Einkommen – prüfe Vermietung (Zimmer) und Tagesgeld-Vergleich. Beides wird bei ALG I NICHT angerechnet.";
    default:
      return "";
  }
}

function partnerListeFuerKarte(karte: JourneyKarte) {
  // Bei "passiv" ggf. mehrere Unterabschnitte – ansonsten flach.
  if (karte.unterabschnitte && karte.unterabschnitte.length > 0) {
    return karte.unterabschnitte
      .map((u) => ({
        titel: u.titel,
        partner: partnerNachIds(u.partnerIds),
      }))
      .filter((g) => g.partner.length > 0);
  }
  const partner = partnerNachIds(karte.partnerIds);
  if (partner.length === 0) return [];
  return [{ titel: "", partner }];
}

export function JourneyPlan({ aktivKarten }: Props) {
  const aktiveSchritte = JOURNEY_KARTEN.filter((k) => aktivKarten.has(k.id));

  if (aktiveSchritte.length === 0) return null;

  return (
    <div className="rounded-3xl border border-navy-100 bg-white p-6 shadow-sm md:p-10">
      <div className="mb-3 text-sm font-bold uppercase tracking-wide text-navy-500">
        So startest du
      </div>
      <ol className="space-y-3">
        {aktiveSchritte.map((karte, i) => {
          const gruppen = partnerListeFuerKarte(karte);
          return (
            <li
              key={karte.id}
              className="flex items-start gap-3 rounded-2xl border border-navy-100 bg-navy-50/40 p-4"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-500 text-sm font-black text-white">
                {i + 1}
              </div>
              <div className="flex-1">
                <p className="text-sm leading-relaxed text-navy-700">
                  {schrittText(karte)}
                </p>
                {gruppen.length > 0 ? (
                  <div className="mt-3 space-y-2">
                    {gruppen.map((g, idx) => (
                      <div key={idx}>
                        {g.titel ? (
                          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-navy-500">
                            {g.titel}
                          </div>
                        ) : null}
                        <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                          {g.partner.map((p) => (
                            <PartnerLink
                              key={p.id}
                              partner={p}
                              variant="inline"
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </li>
          );
        })}
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
