"use client";

import { Check, ExternalLink, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { JourneyKarte } from "@/lib/journey";
import { partnerNachIds, type Partner } from "@/lib/partner";

type Props = {
  karte: JourneyKarte;
  aktiv: boolean;
  onToggle: () => void;
};

function PartnerLink({ partner }: { partner: Partner }) {
  return (
    <a
      href={partner.url}
      target="_blank"
      rel="sponsored noopener noreferrer"
      className="group flex items-start justify-between gap-3 rounded-xl border border-navy-100 bg-white p-3 transition-colors hover:border-teal-400"
    >
      <div className="min-w-0">
        <div className="text-sm font-bold text-navy-900 group-hover:text-teal-700">
          {partner.name}
        </div>
        <div className="text-xs leading-snug text-navy-500">
          {partner.beschreibung}
        </div>
        <div className="mt-0.5 text-xs font-bold text-teal-600">
          {partner.verdienst}
        </div>
      </div>
      <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-navy-400 group-hover:text-teal-500" />
    </a>
  );
}

export function JourneyCard({ karte, aktiv, onToggle }: Props) {
  const partner = partnerNachIds(karte.partnerIds);
  const kannToggeln = !karte.immerAktiv;

  return (
    <article
      aria-labelledby={`karte-${karte.id}-titel`}
      className={cn(
        "flex flex-col overflow-hidden rounded-3xl border-2 bg-white transition-all",
        aktiv
          ? "border-teal-500 shadow-lg shadow-teal-500/10"
          : "border-navy-100",
      )}
    >
      <div
        className={cn(
          "border-b p-6 transition-colors",
          aktiv ? "border-teal-200 bg-teal-50" : "border-navy-100 bg-navy-50/30",
        )}
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <Badge variant={karte.immerAktiv ? "teal" : aktiv ? "teal" : "outline"}>
            {karte.badge}
          </Badge>
          {kannToggeln ? (
            <button
              type="button"
              onClick={onToggle}
              aria-pressed={aktiv}
              aria-label={`${karte.titel} ${aktiv ? "entfernen" : "hinzufügen"}`}
              className={cn(
                "flex h-8 items-center gap-2 rounded-full border-2 px-3 text-xs font-bold transition-all",
                aktiv
                  ? "border-teal-500 bg-teal-500 text-white"
                  : "border-navy-200 bg-white text-navy-600 hover:border-teal-400",
              )}
            >
              {aktiv ? (
                <>
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  Im Plan
                </>
              ) : (
                "Zu meinem Plan"
              )}
            </button>
          ) : (
            <div
              aria-disabled="true"
              className="flex h-8 items-center gap-2 rounded-full border-2 border-teal-500 bg-teal-500 px-3 text-xs font-bold text-white"
            >
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
              Immer dabei
            </div>
          )}
        </div>
        <h3
          id={`karte-${karte.id}-titel`}
          className="text-xl font-black leading-tight text-navy-900"
        >
          {karte.titel}
        </h3>
        <div className="mt-1 font-mono text-xs text-navy-500">
          {karte.paragraph}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <p className="text-sm leading-relaxed text-navy-700">
          {karte.erklaerung}
        </p>

        {karte.tipp && (
          <div className="rounded-xl bg-teal-50 p-3 text-xs leading-relaxed text-teal-900">
            <strong>Tipp:</strong> {karte.tipp}
          </div>
        )}

        {partner.length > 0 && (
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="outline" className="text-[10px]">
                Werbung
              </Badge>
              <span className="text-xs font-bold uppercase tracking-wide text-navy-500">
                So fängst du an
              </span>
            </div>
            <div className="grid gap-2">
              {partner.map((p) => (
                <PartnerLink key={p.id} partner={p} />
              ))}
            </div>
          </div>
        )}

        {karte.bildungsgutschein && (
          <div className="rounded-2xl border-2 border-dashed border-teal-300 bg-teal-50/50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-teal-600" aria-hidden="true" />
              <div className="text-sm font-bold text-navy-900">
                Qualifikation fehlt? Bildungsgutschein nutzen
              </div>
            </div>
            <p className="text-xs leading-relaxed text-navy-600">
              Keine Trainer-Lizenz? Mit dem Bildungsgutschein (§ 81 SGB III)
              holst du dir die C-Trainer-Lizenz kostenlos in 16 Wochen online.
            </p>
            <a
              href="https://www.arbeitsagentur.de/bildungsgutschein"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:underline"
            >
              Mehr zum Bildungsgutschein
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        )}

        {karte.unterabschnitte && karte.unterabschnitte.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {karte.unterabschnitte.map((abschnitt) => {
              const abPartner = partnerNachIds(abschnitt.partnerIds);
              return (
                <div key={abschnitt.titel}>
                  <div className="mb-2 flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px]">
                      Werbung
                    </Badge>
                    <span className="text-xs font-bold uppercase tracking-wide text-navy-500">
                      {abschnitt.titel}
                    </span>
                  </div>
                  <div className="grid gap-2">
                    {abPartner.map((p) => (
                      <PartnerLink key={p.id} partner={p} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </article>
  );
}
