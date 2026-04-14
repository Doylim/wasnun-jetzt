"use client";

import { useState, useMemo } from "react";
import { AlertTriangle, Check, Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { LEGAL } from "@/lib/data";
import { berechneAlg1, berechneBuergergeld, euro } from "@/lib/calc";

type PauschaleId = "uebungsleiter" | "ehrenamt";

function Balken({
  label,
  wert,
  max,
  farbe,
  subLabel,
}: {
  label: string;
  wert: number;
  max: number;
  farbe: "teal" | "amber" | "navy";
  subLabel?: string;
}) {
  const prozent = Math.max(0, Math.min(100, max > 0 ? (wert / max) * 100 : 0));
  const farben = {
    teal: "bg-teal-500",
    amber: "bg-amber-400",
    navy: "bg-navy-800",
  };
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between text-sm">
        <span className="font-semibold text-navy-700">{label}</span>
        <span className="text-lg font-black text-navy-900">
          {euro(wert)}
        </span>
      </div>
      {subLabel && (
        <div className="mb-1.5 text-xs text-navy-500">{subLabel}</div>
      )}
      <div className="h-2.5 overflow-hidden rounded-full bg-navy-100">
        <div
          className={`h-full ${farben[farbe]} transition-all duration-500`}
          style={{ width: `${prozent}%` }}
        />
      </div>
    </div>
  );
}

export function Rechner() {
  const [alg1Betrag, setAlg1Betrag] = useState("1200");
  const [alg1Neben, setAlg1Neben] = useState("300");
  const [alg1Stunden, setAlg1Stunden] = useState("12");
  const [pauschalen, setPauschalen] = useState<PauschaleId[]>([]);

  const [bgBetrag, setBgBetrag] = useState("563");
  const [bgNeben, setBgNeben] = useState("400");

  const algNum = parseFloat(alg1Betrag) || 0;
  const nebenNum = parseFloat(alg1Neben) || 0;
  const stundenNum = parseFloat(alg1Stunden) || 0;

  const alg1Result = useMemo(() => {
    const base = berechneAlg1(algNum, nebenNum, stundenNum);
    const uebungsleiter = pauschalen.includes("uebungsleiter")
      ? LEGAL.pauschalen.uebungsleiter.monat
      : 0;
    const ehrenamt = pauschalen.includes("ehrenamt")
      ? LEGAL.pauschalen.ehrenamt.monat
      : 0;
    const extraFrei = uebungsleiter + ehrenamt;
    return {
      ...base,
      gesamt: base.gesamt + extraFrei,
      uebungsleiter,
      ehrenamt,
    };
  }, [algNum, nebenNum, stundenNum, pauschalen]);

  const bgNum = parseFloat(bgBetrag) || 0;
  const bgNebNum = parseFloat(bgNeben) || 0;
  const bgResult = useMemo(
    () => berechneBuergergeld(bgNum, bgNebNum),
    [bgNum, bgNebNum],
  );

  const togglePauschale = (id: PauschaleId) => {
    setPauschalen((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  return (
    <section
      id="rechner"
      className="border-t border-navy-100 bg-navy-50 py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-12 text-center">
          <Badge variant="teal" className="mb-4">
            Schritt 1 von 3
          </Badge>
          <h2 className="mb-4 text-balance text-3xl font-black text-navy-900 md:text-5xl">
            Was darfst du behalten?
          </h2>
          <p className="mx-auto max-w-2xl text-balance text-lg text-navy-600">
            Waehle deine Leistung, trage dein Einkommen ein – du siehst sofort,
            wie viel du legal dazuverdienen darfst.
          </p>
        </div>

        <Card className="overflow-hidden p-6 md:p-10">
          <Tabs defaultValue="alg1" className="w-full">
            <div className="flex justify-center">
              <TabsList>
                <TabsTrigger value="alg1">ALG I</TabsTrigger>
                <TabsTrigger value="bg">Buergergeld</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="alg1" className="mt-10">
              <div className="grid gap-10 lg:grid-cols-2">
                <div className="space-y-6">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-navy-800">
                      Dein ALG I pro Monat
                    </label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={alg1Betrag}
                        onChange={(e) => setAlg1Betrag(e.target.value)}
                        placeholder="1200"
                      />
                      <span className="absolute right-5 top-1/2 -translate-y-1/2 text-2xl font-bold text-navy-400">
                        EUR
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-navy-800">
                      Geplanter Nebenverdienst
                    </label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={alg1Neben}
                        onChange={(e) => setAlg1Neben(e.target.value)}
                        placeholder="300"
                      />
                      <span className="absolute right-5 top-1/2 -translate-y-1/2 text-2xl font-bold text-navy-400">
                        EUR
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-navy-800">
                      Arbeitsstunden pro Woche
                    </label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={alg1Stunden}
                        onChange={(e) => setAlg1Stunden(e.target.value)}
                        placeholder="12"
                        max={15}
                      />
                      <span className="absolute right-5 top-1/2 -translate-y-1/2 text-2xl font-bold text-navy-400">
                        Std
                      </span>
                    </div>
                    <p className="mt-2 flex items-start gap-1.5 text-xs text-navy-500">
                      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-600" />
                      Ab 15 Stunden/Woche verlierst du den ALG-I-Anspruch komplett.
                    </p>
                  </div>

                  <div>
                    <div className="mb-3 text-sm font-bold text-navy-800">
                      Zusaetzliche Pauschalen (steuerfrei, komplett anrechnungsfrei)
                    </div>
                    <div className="space-y-2">
                      {[
                        {
                          id: "uebungsleiter" as const,
                          name: "Uebungsleiterpauschale",
                          monat: LEGAL.pauschalen.uebungsleiter.monat,
                          para: LEGAL.pauschalen.uebungsleiter.paragraph,
                        },
                        {
                          id: "ehrenamt" as const,
                          name: "Ehrenamtspauschale",
                          monat: LEGAL.pauschalen.ehrenamt.monat,
                          para: LEGAL.pauschalen.ehrenamt.paragraph,
                        },
                      ].map((p) => {
                        const aktiv = pauschalen.includes(p.id);
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => togglePauschale(p.id)}
                            aria-pressed={aktiv}
                            className={`flex w-full items-center justify-between rounded-xl border-2 p-4 text-left transition-all ${
                              aktiv
                                ? "border-teal-500 bg-teal-50"
                                : "border-navy-100 bg-white hover:border-teal-300"
                            }`}
                          >
                            <div>
                              <div className="font-bold text-navy-900">
                                {p.name}
                              </div>
                              <div className="text-xs text-navy-500">
                                {p.para}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-lg font-bold text-teal-600">
                                +{p.monat} EUR
                              </span>
                              <div
                                className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all ${
                                  aktiv
                                    ? "border-teal-500 bg-teal-500 text-white"
                                    : "border-navy-200"
                                }`}
                              >
                                {aktiv && <Check className="h-4 w-4" />}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  {!alg1Result.stundenOk && (
                    <div className="flex items-start gap-3 rounded-xl border-2 border-red-200 bg-red-50 p-4 text-sm text-red-900">
                      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                      <div>
                        <strong>Stop!</strong> Ab 15 Stunden pro Woche verlierst
                        du den ALG-I-Anspruch komplett – unabhaengig vom Verdienst.
                      </div>
                    </div>
                  )}

                  <div className="rounded-2xl bg-gradient-to-br from-navy-800 to-navy-900 p-7 text-white shadow-xl">
                    <div className="mb-1 text-xs font-bold uppercase tracking-widest text-teal-400">
                      Dein Gesamteinkommen
                    </div>
                    <div className="mb-6 text-5xl font-black">
                      {euro(alg1Result.gesamt)}
                    </div>

                    <div className="space-y-4">
                      <Balken
                        label="Dein ALG I"
                        wert={alg1Result.algNeu}
                        max={alg1Result.gesamt}
                        farbe="navy"
                      />
                      <Balken
                        label="Nebenverdienst (davon behaelst du)"
                        wert={
                          alg1Result.stundenOk
                            ? Math.min(nebenNum, LEGAL.alg1.freibetrag)
                            : 0
                        }
                        max={alg1Result.gesamt}
                        farbe="teal"
                        subLabel={`${LEGAL.alg1.freibetrag} EUR Freibetrag § 155 SGB III`}
                      />
                      {alg1Result.anrechenbar > 0 && (
                        <Balken
                          label="Davon wird angerechnet"
                          wert={alg1Result.anrechenbar}
                          max={alg1Result.gesamt}
                          farbe="amber"
                          subLabel="Wird vom ALG I abgezogen"
                        />
                      )}
                      {alg1Result.uebungsleiter > 0 && (
                        <Balken
                          label="Uebungsleiterpauschale"
                          wert={alg1Result.uebungsleiter}
                          max={alg1Result.gesamt}
                          farbe="teal"
                          subLabel="100% anrechnungsfrei"
                        />
                      )}
                      {alg1Result.ehrenamt > 0 && (
                        <Balken
                          label="Ehrenamtspauschale"
                          wert={alg1Result.ehrenamt}
                          max={alg1Result.gesamt}
                          farbe="teal"
                          subLabel="100% anrechnungsfrei"
                        />
                      )}
                    </div>
                  </div>

                  <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                    <div className="mb-1 flex items-center gap-2 font-bold">
                      <AlertTriangle className="h-4 w-4" />
                      Meldepflicht (Pflicht!)
                    </div>
                    Jede Nebentaetigkeit muss{" "}
                    <strong>spaetestens am ersten Arbeitstag</strong> bei der
                    Agentur fuer Arbeit gemeldet werden. Verspaetung fuehrt zu
                    Rueckforderungen.
                    <div className="mt-2 text-xs">
                      Hotline: <strong>{LEGAL.alg1.hotline}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="bg" className="mt-10">
              <div className="grid gap-10 lg:grid-cols-2">
                <div className="space-y-6">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-navy-800">
                      Dein Buergergeld pro Monat
                    </label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={bgBetrag}
                        onChange={(e) => setBgBetrag(e.target.value)}
                      />
                      <span className="absolute right-5 top-1/2 -translate-y-1/2 text-2xl font-bold text-navy-400">
                        EUR
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-navy-500">
                      Regelsatz 2026: {LEGAL.buergergeld.regelsatz} EUR (Alleinstehende)
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-navy-800">
                      Geplanter Nebenverdienst
                    </label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={bgNeben}
                        onChange={(e) => setBgNeben(e.target.value)}
                      />
                      <span className="absolute right-5 top-1/2 -translate-y-1/2 text-2xl font-bold text-navy-400">
                        EUR
                      </span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-navy-100 bg-white p-4 text-xs leading-relaxed text-navy-600">
                    <div className="mb-2 font-bold uppercase tracking-wider text-navy-800">
                      Freibetrag-Staffel § 11b SGB II
                    </div>
                    <ul className="space-y-1">
                      <li>
                        <strong className="text-teal-600">0–100 EUR:</strong>{" "}
                        100 % frei (Grundfreibetrag)
                      </li>
                      <li>
                        <strong className="text-teal-600">100–520 EUR:</strong>{" "}
                        20 % frei
                      </li>
                      <li>
                        <strong className="text-teal-600">520–1.000 EUR:</strong>{" "}
                        30 % frei
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="rounded-2xl bg-gradient-to-br from-navy-800 to-navy-900 p-7 text-white shadow-xl">
                    <div className="mb-1 text-xs font-bold uppercase tracking-widest text-teal-400">
                      Dein Gesamteinkommen
                    </div>
                    <div className="mb-6 text-5xl font-black">
                      {euro(bgResult.gesamt)}
                    </div>

                    <div className="space-y-4">
                      <Balken
                        label="Verbleibendes Buergergeld"
                        wert={bgResult.bgNeu}
                        max={bgResult.gesamt}
                        farbe="navy"
                      />
                      <Balken
                        label="Freier Teil Nebenverdienst"
                        wert={bgResult.frei}
                        max={bgResult.gesamt}
                        farbe="teal"
                        subLabel="Bleibt dir komplett"
                      />
                      {bgResult.anrechnung > 0 && (
                        <Balken
                          label="Anrechnung aufs Buergergeld"
                          wert={bgResult.anrechnung}
                          max={bgResult.gesamt}
                          farbe="amber"
                        />
                      )}
                    </div>
                  </div>

                  <div className="rounded-xl border-2 border-teal-200 bg-teal-50 p-4 text-sm text-teal-900">
                    <div className="mb-1 font-bold">Kein Stundenlimit</div>
                    Beim Buergergeld gibt es keine 15-Stunden-Grenze. Du darfst
                    so viel arbeiten, wie du willst – nur das Einkommen wird
                    gestaffelt angerechnet.
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </section>
  );
}
