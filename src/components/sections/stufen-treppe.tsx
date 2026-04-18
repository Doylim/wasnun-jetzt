"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { KartenId } from "@/lib/journey";

type StufenProps = {
  aktivKarten: Set<string>;
  onToggle: (id: KartenId) => void;
};

type Stufe = {
  id: KartenId;
  betrag: number;
  titel: string;
  beschreibung: string;
  badge: string;
  badgeVariante: "teal" | "amber";
  immerAktiv: boolean;
};

const STUFEN: Stufe[] = [
  {
    id: "grundfreibetrag",
    betrag: 165,
    titel: "Grundfreibetrag",
    beschreibung: "Minijob, Zenjob, Clickworker — morgen loslegbar",
    badge: "SOFORT",
    badgeVariante: "teal",
    immerAktiv: true,
  },
  {
    id: "uebungsleiter",
    betrag: 275,
    titel: "Übungsleiterpauschale",
    beschreibung: "Trainer, Co-Trainer, Betreuer — Lizenz nicht immer nötig",
    badge: "VEREIN",
    badgeVariante: "amber",
    immerAktiv: false,
  },
  {
    id: "ehrenamt",
    betrag: 80,
    titel: "Ehrenamtspauschale",
    beschreibung: "Kassenwart, Vorstand, Platzwart — organisatorische Rolle",
    badge: "ROLLE",
    badgeVariante: "amber",
    immerAktiv: false,
  },
];

function formatEur(n: number): string {
  return new Intl.NumberFormat("de-DE").format(n) + " EUR";
}

export function StufenTreppe({ aktivKarten, onToggle }: StufenProps) {
  const summe = STUFEN.filter((s) => aktivKarten.has(s.id)).reduce(
    (acc, s) => acc + s.betrag,
    0,
  );

  return (
    <div className="mx-auto max-w-xl">
      <div className="rounded-3xl border-2 border-navy-100 bg-white p-6 md:p-8">
        <div className="mb-5 text-center text-xs font-bold uppercase tracking-widest text-navy-500">
          Dein Freibetrag — zusammenstellen
        </div>

        <div className="space-y-3">
          {STUFEN.map((stufe) => {
            const aktiv = aktivKarten.has(stufe.id);
            const badgeClass =
              stufe.badgeVariante === "teal"
                ? "bg-white text-teal-700"
                : "bg-amber-100 text-amber-900";

            return (
              <button
                key={stufe.id}
                type="button"
                onClick={() => !stufe.immerAktiv && onToggle(stufe.id)}
                disabled={stufe.immerAktiv}
                aria-pressed={aktiv}
                className={cn(
                  "flex w-full items-start gap-3 rounded-2xl border-2 p-4 text-left transition-colors",
                  aktiv
                    ? "border-teal-500 bg-teal-50"
                    : "border-navy-100 bg-white hover:border-navy-300",
                  stufe.immerAktiv && "cursor-default",
                )}
              >
                <div
                  className={cn(
                    "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2",
                    aktiv
                      ? "border-teal-500 bg-teal-500 text-white"
                      : "border-navy-200 bg-white",
                  )}
                >
                  {aktiv && <Check className="h-4 w-4" aria-hidden="true" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <div
                      className={cn(
                        "text-lg font-black",
                        aktiv ? "text-teal-700" : "text-navy-700",
                      )}
                    >
                      +{formatEur(stufe.betrag)}
                    </div>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-black tracking-wider",
                        badgeClass,
                      )}
                    >
                      {stufe.badge}
                    </span>
                  </div>
                  <div className="mt-0.5 text-sm font-bold text-navy-900">
                    {stufe.titel}
                  </div>
                  <div className="mt-1 text-xs text-navy-600">
                    {stufe.beschreibung}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 rounded-2xl bg-gradient-to-br from-teal-50 to-white p-5 text-center">
          <div className="text-xs font-bold uppercase tracking-widest text-navy-500">
            Dein aktueller Freibetrag
          </div>
          <div className="mt-1 text-4xl font-black text-teal-700 md:text-5xl">
            +{formatEur(summe)}
          </div>
          <div className="mt-1 text-sm text-navy-600">
            pro Monat, anrechnungsfrei zu deinem ALG I
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-navy-50 p-4 text-sm text-navy-700">
          <strong className="text-navy-900">Zusätzlich unbegrenzt:</strong>{" "}
          Mieteinnahmen + Kapitalerträge (Zinsen, Dividenden) werden bei ALG I
          nicht angerechnet.
        </div>

        <div className="mt-3 rounded-xl border-2 border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <strong>15-Stunden-Regel:</strong> Du darfst max. 14 Std. 59 Min. pro
          Woche arbeiten. Ab 15 Stunden verlierst du ALG I komplett.
        </div>
      </div>
    </div>
  );
}
