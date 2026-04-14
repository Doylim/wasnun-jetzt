import { CheckCircle2, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const SCHRITTE = [
  "Termin bei der Agentur fuer Arbeit vereinbaren",
  "Bildungsgutschein beantragen (§ 81 SGB III)",
  "AZAV-zertifizierten Kurs auswaehlen",
  "Qualifikation erwerben – der Staat zahlt",
  "Im Verein arbeiten: 275 EUR/Monat steuerfrei",
];

const ECKDATEN = [
  {
    label: "Kurskosten",
    wert: "0 EUR",
    sub: "Komplett ueber Bildungsgutschein",
    farbe: "text-teal-600",
  },
  {
    label: "Kursdauer",
    wert: "16 Wochen",
    sub: "Flexibel online absolvierbar",
    farbe: "text-navy-900",
  },
  {
    label: "Danach verdienen",
    wert: "275 EUR/Mo",
    sub: "Uebungsleiterpauschale",
    farbe: "text-teal-600",
  },
  {
    label: "Pro Jahr",
    wert: "3.300 EUR",
    sub: "Zusaetzlich zum Freibetrag",
    farbe: "text-teal-600",
  },
];

export function Bildungsgutschein() {
  return (
    <section className="relative overflow-hidden bg-navy-900 py-20 text-white md:py-28">
      <div className="absolute inset-0 bg-grid-navy opacity-10" />
      <div className="absolute -top-32 right-0 h-96 w-96 rounded-full bg-teal-500/20 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <Badge variant="teal" className="mb-6">
              Der unterschaetzte Weg
            </Badge>
            <h2 className="mb-6 text-balance text-4xl font-black leading-[1.05] md:text-5xl lg:text-6xl">
              Weiterbildung. <br />
              <span className="text-teal-400">Kostenlos.</span>
            </h2>
            <p className="mb-8 max-w-lg text-lg leading-relaxed text-navy-200">
              Als Arbeitsuchende*r hast du oft Anspruch auf einen{" "}
              <strong className="text-white">Bildungsgutschein</strong>. Der
              Staat zahlt deine Weiterbildung komplett – die meisten wissen es
              nicht.
            </p>
            <ul className="mb-8 space-y-3">
              {SCHRITTE.map((schritt, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal-400" />
                  <span className="text-navy-100">{schritt}</span>
                </li>
              ))}
            </ul>
            <Button variant="primary" size="lg" asChild>
              <a
                href="https://www.arbeitsagentur.de/bildungsgutschein"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GraduationCap className="h-5 w-5" />
                Zum Bildungsgutschein
              </a>
            </Button>
          </div>

          <div>
            <div className="mb-4 text-xs font-bold uppercase tracking-widest text-navy-300">
              Beispiel: C-Trainer Breitensport
            </div>
            <div className="space-y-3">
              {ECKDATEN.map((e) => (
                <Card
                  key={e.label}
                  className="border-white/10 bg-white/5 text-white backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between p-5">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-navy-300">
                        {e.label}
                      </div>
                      <div className="text-xs text-navy-400">{e.sub}</div>
                    </div>
                    <div className={`text-3xl font-black ${e.farbe}`}>
                      {e.wert}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
