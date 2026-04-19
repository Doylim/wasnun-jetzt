"use client";

import { useState } from "react";
import { StufenTreppe } from "./stufen-treppe";
import { JourneyPlan } from "./journey-plan";
import type { KartenId } from "@/lib/journey";

export function Journey() {
  // Default: nur Grundfreibetrag aktiv — ehrliche 165 EUR als Einstieg
  const [aktivKarten, setAktivKarten] = useState<Set<string>>(
    () => new Set<string>(["grundfreibetrag"]),
  );

  const toggleKarte = (id: KartenId) => {
    if (id === "grundfreibetrag") return; // immer aktiv
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
            So viel darfst du neben ALG I verdienen
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-balance text-lg text-navy-600">
            Ohne Abzug — abhängig davon, was auf dich zutrifft.
          </p>
        </div>

        <div className="space-y-6">
          <StufenTreppe
            aktivKarten={aktivKarten}
            onToggle={toggleKarte}
          />

          <JourneyPlan aktivKarten={aktivKarten} />
        </div>
      </div>
    </section>
  );
}
