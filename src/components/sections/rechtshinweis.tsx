import { Info } from "lucide-react";
import { LEGAL } from "@/lib/data";

export function Rechtshinweis() {
  return (
    <section className="bg-navy-50 py-16">
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <div className="rounded-3xl border border-navy-100 bg-white p-8 shadow-sm">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-teal-700">
            <Info className="h-3.5 w-3.5" />
            Rechtlicher Hinweis
          </div>
          <h3 className="mb-3 text-xl font-black text-navy-900">
            Kein Ersatz fuer Rechtsberatung
          </h3>
          <div className="space-y-3 text-sm leading-relaxed text-navy-600">
            <p>
              WasNun.jetzt ist ein{" "}
              <strong className="text-navy-900">
                kostenloses Informationsangebot
              </strong>{" "}
              ohne Rechtsberatung. Alle Inhalte sind sorgfaeltig recherchiert und
              werden regelmaessig aktualisiert. Wir uebernehmen{" "}
              <strong className="text-navy-900">
                keine Gewaehr fuer Richtigkeit oder Aktualitaet
              </strong>
              . Gesetzliche Regelungen koennen sich jederzeit aendern.
            </p>
            <p>
              <strong className="text-navy-900">
                Bitte pruefe alle wichtigen Entscheidungen mit deiner Agentur
                fuer Arbeit ({LEGAL.alg1.hotline}) oder deinem Jobcenter.
              </strong>
            </p>
          </div>
          <div className="mt-5 border-t border-navy-100 pt-5 font-mono text-xs text-navy-400">
            § 155 SGB III · § 11b SGB II · § 3 Nr. 26 EStG · § 81 SGB III ·
            Mindestlohngesetz 2026 · Stand: April 2026
          </div>
        </div>
      </div>
    </section>
  );
}
