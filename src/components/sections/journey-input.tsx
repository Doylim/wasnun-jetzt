"use client";

import { Input } from "@/components/ui/input";

type Props = {
  algI: number;
  stunden: number;
  onAlgIChange: (v: number) => void;
  onStundenChange: (v: number) => void;
};

export function JourneyInput({
  algI,
  stunden,
  onAlgIChange,
  onStundenChange,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <div>
        <label
          htmlFor="journey-alg"
          className="mb-2 block text-sm font-bold text-navy-800"
        >
          Dein ALG I pro Monat
        </label>
        <div className="relative">
          <Input
            id="journey-alg"
            type="number"
            min={0}
            inputMode="numeric"
            placeholder="1.200"
            value={algI || ""}
            onChange={(e) => onAlgIChange(parseFloat(e.target.value) || 0)}
            aria-describedby="journey-alg-hint"
          />
          <span className="absolute right-5 top-1/2 -translate-y-1/2 text-2xl font-bold text-navy-400">
            EUR
          </span>
        </div>
        <p id="journey-alg-hint" className="mt-2 text-xs text-navy-500">
          Trage deinen monatlichen Auszahlungsbetrag ein.
        </p>
      </div>

      <div>
        <label
          htmlFor="journey-stunden"
          className="mb-2 block text-sm font-bold text-navy-800"
        >
          Deine Arbeitsstunden pro Woche
        </label>
        <div className="relative">
          <Input
            id="journey-stunden"
            type="number"
            min={0}
            max={14}
            inputMode="numeric"
            placeholder="12"
            value={stunden || ""}
            onChange={(e) => onStundenChange(parseFloat(e.target.value) || 0)}
            aria-describedby="journey-stunden-hint"
          />
          <span className="absolute right-5 top-1/2 -translate-y-1/2 text-2xl font-bold text-navy-400">
            Std
          </span>
        </div>
        <p id="journey-stunden-hint" className="mt-2 text-xs text-navy-500">
          Maximal 14 Std. 59 Min. – darüber verlierst du ALG I komplett.
        </p>
      </div>
    </div>
  );
}
