import { ShieldCheck, Scale, Lock, HeartHandshake } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const PUNKTE = [
  {
    icon: Scale,
    titel: "Rechtlich fundiert",
    text: "Jede Zahl basiert auf SGB II/III, EStG und Mindestlohngesetz – mit Paragraphen-Referenz.",
  },
  {
    icon: Lock,
    titel: "Anonym & lokal",
    text: "Alle Berechnungen laufen in deinem Browser. Kein Konto, kein Tracking, keine Datenweitergabe.",
  },
  {
    icon: ShieldCheck,
    titel: "Immer aktuell",
    text: "Bei Änderungen von Mindestlohn, Minijob-Grenze oder Regelsätzen wird die Seite sofort angepasst.",
  },
  {
    icon: HeartHandshake,
    titel: "Klare Trennung",
    text: "Rechtliche Info und Affiliate-Empfehlungen sind streng getrennt. Werbung ist immer als solche gekennzeichnet.",
  },
];

export function Trust() {
  return (
    <section className="border-t border-navy-100 bg-white py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-12 text-center">
          <Badge variant="navy" className="mb-4">
            Warum du uns vertrauen kannst
          </Badge>
          <h2 className="text-balance text-3xl font-black text-navy-900 md:text-4xl">
            Klar. Rechtssicher. Kostenlos.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {PUNKTE.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.titel}
                className="rounded-2xl border border-navy-100 bg-navy-50/40 p-6 transition-colors hover:border-teal-200 hover:bg-teal-50/40"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-navy-800 text-teal-400">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-black text-navy-900">
                  {p.titel}
                </h3>
                <p className="text-sm leading-relaxed text-navy-600">
                  {p.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
