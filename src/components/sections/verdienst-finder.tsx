"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  Clock,
  ExternalLink,
  MapPin,
  Wrench,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PLAN_KARTEN, type PlanKarte } from "@/lib/data";
import { PARTNER, type Partner } from "@/lib/partner";

type Zeit = "wenig" | "mittel" | "viel";
type Ort = "zuhause" | "nah" | "auto";

const ZEIT_LABEL: Record<Zeit, { label: string; sub: string }> = {
  wenig: { label: "Wenig", sub: "1–5 Std. / Woche" },
  mittel: { label: "Mittel", sub: "6–14 Std. / Woche" },
  viel: { label: "Viel", sub: "15+ Std. (nur Buergergeld)" },
};

const ORT_LABEL: Record<Ort, { label: string; sub: string; icon: typeof MapPin }> = {
  zuhause: { label: "Zuhause", sub: "Laptop & Internet reichen", icon: Wrench },
  nah: { label: "In der Naehe", sub: "Rad, Bus oder zu Fuss", icon: MapPin },
  auto: { label: "Mobil mit Auto", sub: "Flexibel im Umkreis", icon: MapPin },
};

function karteZeitTag(zeit: Zeit): string[] {
  return zeit === "wenig"
    ? ["wenig", "flexibel"]
    : zeit === "mittel"
      ? ["mittel", "flexibel"]
      : ["viel"];
}

function karteOrtTag(ort: Ort): string[] {
  return ort === "zuhause"
    ? ["zuhause", "begrenzt"]
    : ort === "nah"
      ? ["nah"]
      : ["auto", "nah"];
}

function scoreKarte(karte: PlanKarte, tags: string[]): number {
  return karte.tags.filter((t) => tags.includes(t)).length;
}

export function VerdienstFinder() {
  const [zeit, setZeit] = useState<Zeit | null>(null);
  const [ort, setOrt] = useState<Ort | null>(null);

  const ergebnis = useMemo(() => {
    if (!zeit || !ort) return null;
    const tags = [...karteZeitTag(zeit), ...karteOrtTag(ort)];
    const sortiert = [...PLAN_KARTEN]
      .map((k) => ({ karte: k, score: scoreKarte(k, tags) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((x) => x.karte);
    const partner = PARTNER.filter((p) =>
      p.tags.some((t) => tags.includes(t)),
    ).slice(0, 3);
    return { karten: sortiert, partner };
  }, [zeit, ort]);

  const reset = () => {
    setZeit(null);
    setOrt(null);
  };

  return (
    <section
      id="entscheiden"
      className="border-t border-navy-100 bg-white py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-12 text-center">
          <Badge variant="teal" className="mb-4">
            Schritt 2 von 3
          </Badge>
          <h2 className="mb-4 text-balance text-3xl font-black text-navy-900 md:text-5xl">
            Was passt zu dir?
          </h2>
          <p className="mx-auto max-w-2xl text-balance text-lg text-navy-600">
            Zwei Fragen – und du bekommst die drei passendsten
            Verdienstmoeglichkeiten mit konkretem Euro-Bereich pro Monat.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-8">
            <div className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-navy-500">
              <Clock className="h-4 w-4 text-teal-500" />
              Frage 1 – Wie viel Zeit hast du?
            </div>
            <div className="space-y-2">
              {(Object.keys(ZEIT_LABEL) as Zeit[]).map((key) => {
                const z = ZEIT_LABEL[key];
                const aktiv = zeit === key;
                return (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={aktiv}
                    onClick={() => setZeit(key)}
                    className={`flex w-full items-center justify-between rounded-xl border-2 p-4 text-left transition-all ${
                      aktiv
                        ? "border-teal-500 bg-teal-50"
                        : "border-navy-100 bg-white hover:border-teal-300"
                    }`}
                  >
                    <div>
                      <div className="font-bold text-navy-900">{z.label}</div>
                      <div className="text-xs text-navy-500">{z.sub}</div>
                    </div>
                    {aktiv && (
                      <ArrowRight className="h-5 w-5 text-teal-600" />
                    )}
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="p-8">
            <div className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-navy-500">
              <MapPin className="h-4 w-4 text-teal-500" />
              Frage 2 – Wo willst du arbeiten?
            </div>
            <div className="space-y-2">
              {(Object.keys(ORT_LABEL) as Ort[]).map((key) => {
                const o = ORT_LABEL[key];
                const Icon = o.icon;
                const aktiv = ort === key;
                return (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={aktiv}
                    onClick={() => setOrt(key)}
                    className={`flex w-full items-center gap-3 rounded-xl border-2 p-4 text-left transition-all ${
                      aktiv
                        ? "border-teal-500 bg-teal-50"
                        : "border-navy-100 bg-white hover:border-teal-300"
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        aktiv ? "bg-teal-500 text-white" : "bg-navy-50 text-navy-600"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-navy-900">{o.label}</div>
                      <div className="text-xs text-navy-500">{o.sub}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {ergebnis && (
          <div className="mt-12 scroll-mt-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-2xl font-black text-navy-900 md:text-3xl">
                Deine Top 3 Optionen
              </h3>
              <Button variant="ghost" size="sm" onClick={reset}>
                Neu starten
              </Button>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {ergebnis.karten.map((k, i) => (
                <Card
                  key={k.titel}
                  className="relative flex flex-col overflow-hidden p-0"
                >
                  <div className="absolute right-4 top-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-900 text-lg font-black text-teal-400">
                      {i + 1}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-navy-50 to-teal-50 p-6 pb-4">
                    <Badge variant="navy" className="mb-3">
                      {k.kategorie}
                    </Badge>
                    <h4 className="mb-2 text-lg font-black text-navy-900">
                      {k.titel}
                    </h4>
                    <div className="text-3xl font-black text-teal-600">
                      {k.verdienst}
                    </div>
                    <div className="text-xs text-navy-500">{k.timing}</div>
                  </div>
                  <div className="flex-1 p-6 pt-4">
                    <p className="mb-3 text-sm leading-relaxed text-navy-600">
                      {k.beschreibung}
                    </p>
                    <div className="text-xs font-mono text-navy-400">
                      {k.rechtsBasis}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {ergebnis.partner.length > 0 && <PartnerListe partner={ergebnis.partner} />}
          </div>
        )}
      </div>
    </section>
  );
}

function PartnerListe({ partner }: { partner: Partner[] }) {
  return (
    <div className="mt-10">
      <div className="mb-4 flex items-center gap-3">
        <Badge variant="outline">Werbung</Badge>
        <h4 className="text-lg font-bold text-navy-900">
          Passende Plattformen fuer dich
        </h4>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {partner.map((p) => (
          <a
            key={p.id}
            href={p.url}
            target="_blank"
            rel="sponsored noopener noreferrer"
            className="group rounded-2xl border-2 border-navy-100 bg-white p-5 transition-all hover:border-teal-400 hover:shadow-lg"
          >
            <div className="mb-2 flex items-start justify-between">
              <div className="font-bold text-navy-900 group-hover:text-teal-600">
                {p.name}
              </div>
              <ExternalLink className="h-4 w-4 text-navy-400 group-hover:text-teal-500" />
            </div>
            <p className="mb-3 text-xs leading-relaxed text-navy-600">
              {p.beschreibung}
            </p>
            <div className="text-sm font-bold text-teal-600">{p.verdienst}</div>
          </a>
        ))}
      </div>
      <p className="mt-3 text-xs text-navy-400">
        Affiliate-Links. Wir bekommen ggf. eine Provision, wenn du dich ueber
        diese Links anmeldest. Fuer dich entstehen keine Kosten.
      </p>
    </div>
  );
}
