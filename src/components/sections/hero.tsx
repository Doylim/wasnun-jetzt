import { ArrowRight, ShieldCheck, Lock, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LEGAL } from "@/lib/data";

export function Hero() {
  return (
    <section
      id="haupt"
      className="relative overflow-hidden border-b border-navy-100 bg-gradient-to-br from-navy-50 via-white to-teal-50"
    >
      <div className="absolute inset-0 bg-grid-navy opacity-60" aria-hidden="true" />
      <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-teal-200/30 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-navy-200/30 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Badge variant="success" className="mb-6 gap-2">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-500" />
              Aktualisiert fuer April 2026
            </Badge>

            <h1 className="mb-6 text-balance text-4xl font-black leading-[1.05] tracking-tight text-navy-900 md:text-6xl lg:text-7xl">
              Bis zu{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-teal-600">603 EUR</span>
                <span
                  className="absolute -bottom-1 left-0 right-0 h-3 bg-teal-200/70"
                  aria-hidden="true"
                />
              </span>{" "}
              legal dazuverdienen.
            </h1>

            <p className="mb-8 max-w-xl text-balance text-lg leading-relaxed text-navy-600 md:text-xl">
              Du bist arbeitslos und willst wissen, was du{" "}
              <strong className="text-navy-900">ohne Leistungskuerzung</strong>{" "}
              dazuverdienen darfst? In 60 Sekunden hast du dein Ergebnis –
              kostenlos, anonym, rechtssicher.
            </p>

            <div className="mb-10 flex flex-col gap-3 sm:flex-row">
              <Button variant="primary" size="xl" asChild>
                <a href="#rechner">
                  In 60 Sek. berechnen
                  <ArrowRight className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <a href="#entscheiden">Verdienst-Finder starten</a>
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-navy-600">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-teal-600" aria-hidden="true" />
                <span>Anonym – keine Anmeldung</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-teal-600" aria-hidden="true" />
                <span>Nach SGB II &amp; SGB III</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-teal-600" aria-hidden="true" />
                <span>Stand {LEGAL.alg1.stand}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-teal-400/40 to-navy-400/20 blur-2xl" />
              <div className="relative rounded-3xl border border-navy-100 bg-white p-8 shadow-2xl shadow-navy-900/10">
                <div className="mb-5 text-xs font-bold uppercase tracking-widest text-navy-500">
                  Beispiel ALG I
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-navy-600">
                      Dein ALG&nbsp;I
                    </span>
                    <span className="text-2xl font-bold text-navy-900">
                      1.200 EUR
                    </span>
                  </div>
                  <div className="h-px bg-navy-100" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-navy-600">
                      Freibetrag
                    </span>
                    <span className="text-2xl font-bold text-teal-600">
                      + {LEGAL.alg1.freibetrag} EUR
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-navy-600">
                      Uebungsleiter*in
                    </span>
                    <span className="text-2xl font-bold text-teal-600">
                      + {LEGAL.pauschalen.uebungsleiter.monat} EUR
                    </span>
                  </div>
                  <div className="h-px bg-navy-100" />
                  <div className="rounded-2xl bg-navy-900 p-5 text-white">
                    <div className="text-xs font-bold uppercase tracking-widest text-teal-400">
                      Gesamt pro Monat
                    </div>
                    <div className="mt-1 text-4xl font-black">1.640 EUR</div>
                    <div className="mt-1 text-xs text-navy-200">
                      Ohne Abzug, legal, steuerfrei
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
