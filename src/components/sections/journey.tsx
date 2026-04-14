"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  JOURNEY_KARTEN,
  berechnePlan,
  type KartenId,
} from "@/lib/journey";
import { JourneyWarnung } from "./journey-warnung";
import { JourneyInput } from "./journey-input";
import { JourneyTotal } from "./journey-total";
import { JourneyCard } from "./journey-card";
import { JourneySummary } from "./journey-summary";

export function Journey() {
  const [algI, setAlgI] = useState(0);
  const [stunden, setStunden] = useState(12);
  const [aktivKarten, setAktivKarten] = useState<Set<string>>(
    () => new Set<string>(["grundfreibetrag"]),
  );

  const plan = useMemo(
    () => berechnePlan({ algI, stunden, aktivKarten }),
    [algI, stunden, aktivKarten],
  );

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
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-10 text-center">
          <Badge variant="teal" className="mb-4">
            Schritt 1 von 3
          </Badge>
          <h2 className="text-balance text-3xl font-black text-navy-900 md:text-5xl">
            Dein persönlicher Plan
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-balance text-lg text-navy-600">
            Trage dein ALG I ein, wähle die Pauschalen, die zu dir passen, und
            hol dir deinen Umsetzungs-Plan.
          </p>
        </div>

        <div className="mx-auto max-w-4xl space-y-6">
          <JourneyWarnung stunden={stunden} />
          <JourneyInput
            algI={algI}
            stunden={stunden}
            onAlgIChange={setAlgI}
            onStundenChange={setStunden}
          />

          <JourneyTotal algI={algI} plan={plan} />
        </div>

        <div className="mx-auto mt-16 max-w-6xl">
          <div className="mb-8 text-center">
            <Badge variant="teal" className="mb-4">
              Schritt 2 von 3
            </Badge>
            <h3 className="mb-2 text-balance text-2xl font-black text-navy-900 md:text-4xl">
              Welche Pauschalen passen zu dir?
            </h3>
            <p className="mx-auto max-w-2xl text-balance text-sm text-navy-600 md:text-base">
              Die 165 EUR Grundfreibetrag bekommst du immer. Aktiviere, was
              zusätzlich auf dich zutrifft – dein Plan aktualisiert sich live.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {JOURNEY_KARTEN.map((karte) => (
              <div
                key={karte.id}
                className={karte.id === "passiv" ? "md:col-span-2" : undefined}
              >
                <JourneyCard
                  karte={karte}
                  aktiv={aktivKarten.has(karte.id)}
                  onToggle={() => toggleKarte(karte.id)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-4xl">
          <JourneySummary algI={algI} plan={plan} aktivKarten={aktivKarten} />
        </div>
      </div>
    </section>
  );
}
