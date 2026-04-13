'use client'
import { useState } from 'react'
import { berechneAlg1, berechneBuergergeld, euro } from '@/lib/calc'
import { LEGAL } from '@/lib/data'

type Tab = 'alg1' | 'bg'

export default function Rechner() {
  const [tab, setTab] = useState<Tab>('alg1')
  const [alg1Betrag, setAlg1Betrag] = useState('')
  const [alg1Neben, setAlg1Neben]   = useState('')
  const [alg1Stunden, setAlg1Stunden] = useState(8)
  const [bgBetrag, setBgBetrag]     = useState('')
  const [bgNeben, setBgNeben]       = useState('')

  const alg1 = (alg1Betrag || alg1Neben)
    ? berechneAlg1(+alg1Betrag || 0, +alg1Neben || 0, alg1Stunden) : null
  const bg = (bgBetrag || bgNeben)
    ? berechneBuergergeld(+bgBetrag || 0, +bgNeben || 0) : null

  const input = 'w-full border-2 border-gray-200 focus:border-rot rounded-xl px-4 py-3.5 text-base outline-none transition-colors font-sans'

  return (
    <section id="rechner" className="py-20 px-6 bg-grau-hell">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Left info */}
          <div className="lg:w-1/3">
            <div className="inline-block bg-rot text-white text-xs font-bold px-3 py-1.5 rounded-full mb-5 tracking-widest uppercase">
              Schritt 1
            </div>
            <h2 className="font-display text-4xl font-black mb-4 leading-tight">
              Wie viel darfst du<br /><span className="text-rot italic">verdienen?</span>
            </h2>
            <p className="text-grau-mittel leading-relaxed mb-6">
              Berechne deinen persönlichen Freibetrag — ohne dass dein ALG I oder Bürgergeld gekürzt wird.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800 leading-relaxed">
              📌 <strong>Minijob-Grenze 2026:</strong> {LEGAL.minijob.grenze} €/Monat<br />
              📌 <strong>Mindestlohn 2026:</strong> {LEGAL.minijob.mindestlohn} €/Std.
            </div>
          </div>

          {/* Right — Calculator */}
          <div className="lg:w-2/3 bg-white rounded-3xl p-8 shadow-lg border border-gray-100 w-full">
            {/* Tabs */}
            <div className="flex gap-2 mb-8 bg-grau-hell p-1.5 rounded-xl w-fit">
              {(['alg1', 'bg'] as Tab[]).map(id => (
                <button key={id} onClick={() => setTab(id)}
                  className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    tab === id ? 'bg-rot text-white shadow-sm' : 'text-grau-mittel hover:text-schwarz'
                  }`}>
                  {id === 'alg1' ? 'ALG I' : 'Bürgergeld'}
                </button>
              ))}
            </div>

            {tab === 'alg1' && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold mb-2 text-schwarz">
                    Mein ALG I pro Monat <span className="font-normal text-grau-mittel text-xs">(brutto, ca.)</span>
                  </label>
                  <input type="number" placeholder="z.B. 1200" value={alg1Betrag}
                    onChange={e => setAlg1Betrag(e.target.value)} className={input} />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-schwarz">
                    Geplanter Nebenverdienst <span className="font-normal text-grau-mittel text-xs">(brutto/Monat)</span>
                  </label>
                  <input type="number" placeholder="z.B. 300" value={alg1Neben}
                    onChange={e => setAlg1Neben(e.target.value)} className={input} />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-3 text-schwarz">
                    Stunden pro Woche:{' '}
                    <span className={`font-black ${alg1Stunden >= 15 ? 'text-rot' : 'text-schwarz'}`}>
                      {alg1Stunden} Std.
                    </span>
                  </label>
                  <input type="range" min={1} max={20} value={alg1Stunden}
                    onChange={e => setAlg1Stunden(+e.target.value)} />
                  <div className="flex justify-between text-xs text-grau-mittel mt-1">
                    <span>1 Std.</span><span>20 Std.</span>
                  </div>
                </div>

                {alg1Stunden >= 15 && (
                  <div className="flex gap-3 bg-red-50 border-2 border-rot rounded-xl p-4 text-sm text-rot font-semibold">
                    🚨 Achtung! Ab 15 Std./Woche verlierst du deinen ALG-I-Anspruch!
                  </div>
                )}

                {alg1 && alg1.stundenOk && (
                  <>
                    <div className="flex gap-3 bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-700 font-semibold">
                      ✅ Alles im grünen Bereich — Nebentätigkeit trotzdem melden!
                    </div>
                    <div className="bg-schwarz rounded-2xl p-6 text-white">
                      <div className="text-white/50 text-xs uppercase tracking-widest mb-4">Deine Berechnung</div>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { l: 'Freibetrag',        v: euro(alg1.freibetrag),   c: 'text-rot' },
                          { l: 'Verbleibendes ALG', v: euro(alg1.algNeu),       c: 'text-white' },
                          { l: 'Gesamteinkommen',   v: euro(alg1.gesamt),       c: 'text-white' },
                          { l: 'Kürzung ALG I',     v: euro(alg1.anrechenbar),  c: 'text-amber-400' },
                        ].map(r => (
                          <div key={r.l}>
                            <div className="text-white/40 text-xs mb-1">{r.l}</div>
                            <div className={`font-display text-2xl font-bold ${r.c}`}>{r.v}</div>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-white/10 mt-5 pt-4 text-white/35 text-xs leading-relaxed">
                        Richtwerte · § 155 SGB III · Stand: {LEGAL.alg1.stand} · Ohne Gewähr · Hotline: {LEGAL.alg1.hotline}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {tab === 'bg' && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold mb-2 text-schwarz">
                    Mein Bürgergeld pro Monat <span className="font-normal text-grau-mittel text-xs">(Regelleistung)</span>
                  </label>
                  <input type="number" placeholder="z.B. 563" value={bgBetrag}
                    onChange={e => setBgBetrag(e.target.value)} className={input} />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-schwarz">Geplanter Brutto-Verdienst pro Monat</label>
                  <input type="number" placeholder="z.B. 400" value={bgNeben}
                    onChange={e => setBgNeben(e.target.value)} className={input} />
                </div>
                {bg && (
                  <div className="bg-schwarz rounded-2xl p-6 text-white">
                    <div className="text-white/50 text-xs uppercase tracking-widest mb-4">Deine Berechnung</div>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { l: 'Freibetrag',         v: euro(bg.frei),        c: 'text-rot' },
                        { l: 'Anrechnung',         v: euro(bg.anrechnung),  c: 'text-amber-400' },
                        { l: 'Verbl. Bürgergeld',  v: euro(bg.bgNeu),       c: 'text-white' },
                        { l: 'Gesamteinkommen',    v: euro(bg.gesamt),      c: 'text-white' },
                      ].map(r => (
                        <div key={r.l}>
                          <div className="text-white/40 text-xs mb-1">{r.l}</div>
                          <div className={`font-display text-2xl font-bold ${r.c}`}>{r.v}</div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-white/10 mt-5 pt-4 text-white/35 text-xs">
                      § 11b SGB II · Stand: {LEGAL.buergergeld.stand} · Ohne Gewähr
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
