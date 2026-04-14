import { ExternalLink, Euro, Zap, Lightbulb, TrendingUp, Monitor } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { KATEGORIEN } from "@/lib/data";
import { PARTNER, type Partner } from "@/lib/partner";

const ICONS = {
  sofort: Zap,
  clever: Lightbulb,
  aufbauen: TrendingUp,
  digital: Monitor,
} as const;

function partnerFuerKategorie(id: string): Partner[] {
  const mapping: Record<string, string[]> = {
    sofort: ["jobplattform", "mikrojob", "fahrdienst"],
    clever: [],
    aufbauen: ["bildung"],
    digital: ["mikrojob", "nachhilfe"],
  };
  const typen = mapping[id] ?? [];
  return PARTNER.filter((p) => typen.includes(p.typ)).slice(0, 3);
}

export function Verdienstwege() {
  return (
    <section
      id="wege"
      className="border-t border-navy-100 bg-white py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-12 text-center">
          <Badge variant="navy" className="mb-4">
            Alle Verdienstwege
          </Badge>
          <h2 className="mb-4 text-balance text-3xl font-black text-navy-900 md:text-5xl">
            Vier Wege. Vier Strategien.
          </h2>
          <p className="mx-auto max-w-2xl text-balance text-lg text-navy-600">
            Von &bdquo;heute noch loslegen&ldquo; bis zu cleveren Freibeträgen,
            die kaum jemand kennt.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {KATEGORIEN.map((k) => {
            const Icon = ICONS[k.id as keyof typeof ICONS] ?? Euro;
            const partner = partnerFuerKategorie(k.id);
            return (
              <Card key={k.id} className="overflow-hidden p-0">
                <div className="bg-gradient-to-br from-navy-800 to-navy-900 p-6 text-white">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-500/20 text-teal-400">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold uppercase tracking-wider text-teal-400">
                          {k.label}
                        </div>
                        <div className="text-xs text-navy-200">
                          {k.sublabel}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-navy-300">Verdienst</div>
                      <div className="text-lg font-black text-white">
                        {k.max}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-navy-100">
                    {k.beschreibung}
                  </p>
                </div>

                <div className="p-6">
                  <div className="mb-4 text-xs font-bold uppercase tracking-wider text-navy-500">
                    Beispiele
                  </div>
                  <ul className="mb-5 space-y-3">
                    {k.optionen.slice(0, 3).map((opt) => (
                      <li
                        key={opt.titel}
                        className="flex items-start justify-between gap-3 border-b border-navy-50 pb-3 last:border-0"
                      >
                        <div>
                          <div className="text-sm font-bold text-navy-900">
                            {opt.titel}
                          </div>
                          <div className="text-xs text-navy-500">
                            {opt.timing}
                          </div>
                        </div>
                        <div className="shrink-0 text-sm font-black text-teal-600">
                          {opt.verdienst}
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="rounded-xl bg-teal-50 p-4 text-xs text-teal-900">
                    <strong>Profi-Tipp:</strong> {k.tipp}
                  </div>

                  {partner.length > 0 && (
                    <div className="mt-5 border-t border-navy-100 pt-4">
                      <div className="mb-2 flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px]">
                          Werbung
                        </Badge>
                        <span className="text-xs font-bold text-navy-500">
                          Passende Plattformen
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {partner.map((p) => (
                          <a
                            key={p.id}
                            href={p.url}
                            target="_blank"
                            rel="sponsored noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-full border border-navy-100 bg-white px-3 py-1.5 text-xs font-semibold text-navy-700 transition-colors hover:border-teal-400 hover:text-teal-600"
                          >
                            {p.name}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 font-mono text-[10px] text-navy-400">
                    {k.rechtsbasis}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
