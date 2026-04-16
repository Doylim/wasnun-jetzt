"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  JOURNEY_KARTEN,
  berechnePlan,
  type KartenId,
} from "@/lib/journey";
import { JourneyWarnung } from "./journey-warnung";
import { JourneyInput } from "./journey-input";
import { JourneyTotal } from "./journey-total";
import { JourneyCard } from "./journey-card";
import { JourneyPlan } from "./journey-plan";
import { NewsletterForm } from "./newsletter-form";

const ALLE_KARTEN_IDS: KartenId[] = [
  "grundfreibetrag",
  "uebungsleiter",
  "ehrenamt",
  "passiv",
];

export function Journey() {
  const [algI, setAlgI] = useState(0);
  const [stunden, setStunden] = useState(12);
  const [aktivKarten, setAktivKarten] = useState<Set<string>>(
    () => new Set<string>(ALLE_KARTEN_IDS),
  );

  const plan = useMemo(
    () => berechnePlan({ algI, stunden, aktivKarten }),
    [algI, stunden, aktivKarten],
  );

  const alleKartenAktiv = aktivKarten.size === ALLE_KARTEN_IDS.length;

  const toggleKarte = (id: KartenId) => {
    if (id === "grundfreibetrag") return;
    setAktivKarten((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section
      id="rechner"
      className="scroll-mt-24 border-t border-navy-100 bg-navy-50/40 py-20 md:py-28"
    >
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <div className="mb-10 text-center">
          <h2 className="text-balance text-3xl font-black text-navy-900 md:text-5xl">
            Dein persönlicher Plan
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-balance text-lg text-navy-600">
            Trage dein ALG I ein — du siehst sofort, wie viel du zusätzlich
            abzugsfrei verdienen darfst.
          </p>
        </div>

        <div className="space-y-6">
          <JourneyWarnung stunden={stunden} />

          <JourneyInput
            algI={algI}
            stunden={stunden}
            onAlgIChange={setAlgI}
            onStundenChange={setStunden}
          />

          <JourneyTotal
            algI={algI}
            plan={plan}
            alleKartenAktiv={alleKartenAktiv}
          />

          {algI > 0 && (
            <NewsletterForm
              algI={algI}
              stunden={stunden}
              aktivKarten={aktivKarten}
              gesamtFreibetrag={plan.gesamtFreibetrag}
            />
          )}

          <details className="group rounded-3xl border border-navy-100 bg-white">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-5 md:p-6">
              <div>
                <div className="text-base font-bold text-navy-900 md:text-lg">
                  An meine Situation anpassen
                </div>
                <div className="text-sm text-navy-600">
                  Wähle aus, welche Pauschalen auf dich zutreffen
                </div>
              </div>
              <ChevronDown
                className="h-5 w-5 shrink-0 text-navy-500 transition-transform group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>
            <div className="grid gap-4 border-t border-navy-100 p-5 md:grid-cols-2 md:p-6">
              {JOURNEY_KARTEN.map((karte) => (
                <JourneyCard
                  key={karte.id}
                  karte={karte}
                  aktiv={aktivKarten.has(karte.id)}
                  onToggle={() => toggleKarte(karte.id as KartenId)}
                />
              ))}
            </div>
          </details>

          <JourneyPlan aktivKarten={aktivKarten} />
        </div>
      </div>
    </section>
  );
}
