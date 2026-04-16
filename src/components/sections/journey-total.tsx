import { cn } from "@/lib/utils";
import type { PlanErgebnis } from "@/lib/journey";

type Props = {
  algI: number;
  plan: PlanErgebnis;
  alleKartenAktiv: boolean;
};

function formatEur(n: number): string {
  return new Intl.NumberFormat("de-DE").format(n) + " EUR";
}

export function JourneyTotal({ algI, plan, alleKartenAktiv }: Props) {
  const hasInput = algI > 0;
  const warnung = plan.warnung15Stunden;

  return (
    <div
      className={cn(
        "rounded-3xl border-2 p-6 md:p-8 shadow-lg transition-all",
        warnung
          ? "border-red-300 bg-red-50"
          : "border-teal-200 bg-gradient-to-br from-teal-50 to-white",
      )}
    >
      <div className="text-xs font-bold uppercase tracking-widest text-navy-500">
        Dein abzugsfreies Plus
      </div>

      {hasInput ? (
        <>
          <div className="mt-3 text-6xl font-black text-teal-600 md:text-7xl">
            +{formatEur(plan.gesamtFreibetrag)}
          </div>
          <div className="mt-2 text-base text-navy-600">
            abzugsfrei zu deinem ALG I von{" "}
            <strong className="text-navy-900">{formatEur(algI)}</strong>
          </div>
          <div className="mt-1 text-sm text-navy-500">
            {alleKartenAktiv
              ? "Maximaler Freibetrag — passe ihn bei Bedarf an"
              : "Basierend auf deiner Auswahl"}
          </div>
          {plan.hatPassiv && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-bold text-teal-700">
              + unbegrenzt aus Vermietung/Kapital
            </div>
          )}
          {warnung && (
            <div className="mt-4 rounded-xl bg-red-100 p-4 text-sm font-bold text-red-900">
              Achtung: Deine Stunden-Angabe überschreitet die 15-Std.-Grenze.
              Reduziere sofort, sonst gilt dieser Plan nicht.
            </div>
          )}
        </>
      ) : (
        <div className="mt-3 text-navy-600">
          Tippe oben dein ALG I ein, um dein persönliches Plus zu sehen.
        </div>
      )}
    </div>
  );
}
