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
    ? berechneAlg1(+alg1Betrag||0, +alg1Neben||0, alg1Stunden) : null
  const bg = (bgBetrag || bgNeben)
    ? berechneBuergergeld(+bgBetrag||0, +bgNeben||0) : null

  const inp = 'w-full border-2 border-gray-200 focus:border-rot rounded-xl px-4 py-4 text-base outline-none transition-colors font-sans bg-white'

  return (
    <section id="rechner" className="py-24 px-6 bg-grau-hell relative overflow-hidden">
      {/* Roter Akzent-Streifen links */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-rot" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="reveal mb-16">
          <div className="inline-block bg-rot text-white font-black uppercase tracking-widest text-xs px-4 py-2 mb-6">
            SCHRITT 01
          </div>
          <h2 className="font-condensed font-black uppercase text-big leading-none">
            Wie viel darfst<br />
            du <span className="text-rot">verdienen?</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Info links */}
          <div className="lg:col-span-2 reveal-left">
            <p className="text-lg text-grau-mid leading-relaxed mb-8">
              Berechne deinen persönlichen Freibetrag — ohne dass dein ALG I oder Bürgergeld gekürzt wird.
            </p>
            <div className="bg-schwarz text-white rounded-2xl p-6 space-y-4">
              <div className="font-black uppercase tracking-wider text-xs text-rot mb-4">Aktuelle Grenzen 2026</div>
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <span className="text-white/60 text-sm">Minijob-Grenze</span>
                <span className="font-condensed font-black text-2xl text-white">{LEGAL.minijob.grenze} €</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <span className="text-white/60 text-sm">Mindestlohn</span>
                <span className="font-condensed font-black text-2xl text-white">{LEGAL.minijob.mindestlohn} €</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-sm">ALG I Freibetrag</span>
                <span className="font-condensed font-black text-2xl text-rot">{LEGAL.alg1.freibetrag} €</span>
              </div>
            </div>
          </div>

          {/* Rechner rechts */}
          <div className="lg:col-span-3 reveal-right">
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              {/* Tabs */}
              <div className="flex gap-2 mb-8">
                {(['alg1', 'bg'] as Tab[]).map(id => (
                  <button key={id} onClick={() => setTab(id)}
                    className={`flex-1 py-3 font-black uppercase tracking-wider text-sm rounded-xl transition-all ${
                      tab === id ? 'bg-rot text-white' : 'bg-grau-hell text-grau-mid hover:text-schwarz'
                    }`}>
                    {id === 'alg1' ? 'ALG I' : 'Bürgergeld'}
                  </button>
                ))}
              </div>

              {tab === 'alg1' && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider mb-2 text-grau-mid">
                      Mein ALG I / Monat
                    </label>
                    <input type="number" placeholder="z.B. 1200 €" value={alg1Betrag}
                      onChange={e => setAlg1Betrag(e.target.value)} className={inp} />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider mb-2 text-grau-mid">
                      Geplanter Nebenverdienst / Monat
                    </label>
                    <input type="number" placeholder="z.B. 300 €" value={alg1Neben}
                      onChange={e => setAlg1Neben(e.target.value)} className={inp} />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider mb-3 text-grau-mid">
                      Stunden / Woche:{' '}
                      <span className={`font-black text-base ${alg1Stunden >= 15 ? 'text-rot' : 'text-schwarz'}`}>
                        {alg1Stunden} Std.
                      </span>
                    </label>
                    <input type="range" min={1} max={20} value={alg1Stunden}
                      onChange={e => setAlg1Stunden(+e.target.value)} />
                    <div className="flex justify-between text-xs text-grau-mid mt-1 font-bold">
                      <span>1 Std.</span><span>20 Std.</span>
                    </div>
                  </div>

                  {alg1Stunden >= 15 && (
                    <div className="bg-rot text-white rounded-xl p-4 text-sm font-bold">
                      🚨 STOPP! Ab 15 Std./Woche verlierst du deinen ALG-I-Anspruch!
                    </div>
                  )}

                  {alg1 && alg1.stundenOk && (
                    <>
                      <div className="bg-green-50 border-l-4 border-green-500 rounded-xl p-4 text-sm font-bold text-green-700">
                        ✅ Alles OK — trotzdem Nebentätigkeit melden!
                      </div>
                      <div className="bg-schwarz rounded-2xl p-6 grid grid-cols-2 gap-5">
                        <div className="col-span-2 text-white/40 text-xs uppercase tracking-widest font-black mb-2">Deine Berechnung</div>
                        {[
                          { l: 'Freibetrag',    v: euro(alg1.freibetrag),  c: 'text-rot' },
                          { l: 'Gesamteink.',   v: euro(alg1.gesamt),      c: 'text-white' },
                          { l: 'Verblieb. ALG', v: euro(alg1.algNeu),      c: 'text-white' },
                          { l: 'Kürzung',       v: euro(alg1.anrechenbar), c: 'text-yellow-400' },
                        ].map(r => (
                          <div key={r.l}>
                            <div className="text-white/40 text-xs uppercase tracking-wider font-bold">{r.l}</div>
                            <div className={`font-condensed font-black text-3xl ${r.c}`}>{r.v}</div>
                          </div>
                        ))}
                        <div className="col-span-2 border-t border-white/10 pt-4 text-white/30 text-xs">
                          § 155 SGB III · Stand {LEGAL.alg1.stand} · Ohne Gewähr · Hotline: {LEGAL.alg1.hotline}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {tab === 'bg' && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider mb-2 text-grau-mid">Mein Bürgergeld / Monat</label>
                    <input type="number" placeholder="z.B. 563 €" value={bgBetrag}
                      onChange={e => setBgBetrag(e.target.value)} className={inp} />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider mb-2 text-grau-mid">Geplanter Verdienst / Monat</label>
                    <input type="number" placeholder="z.B. 400 €" value={bgNeben}
                      onChange={e => setBgNeben(e.target.value)} className={inp} />
                  </div>
                  {bg && (
                    <div className="bg-schwarz rounded-2xl p-6 grid grid-cols-2 gap-5">
                      <div className="col-span-2 text-white/40 text-xs uppercase tracking-widest font-black mb-2">Deine Berechnung</div>
                      {[
                        { l: 'Freibetrag',    v: euro(bg.frei),        c: 'text-rot' },
                        { l: 'Anrechnung',    v: euro(bg.anrechnung),  c: 'text-yellow-400' },
                        { l: 'Verblieb. BG',  v: euro(bg.bgNeu),       c: 'text-white' },
                        { l: 'Gesamteink.',   v: euro(bg.gesamt),      c: 'text-white' },
                      ].map(r => (
                        <div key={r.l}>
                          <div className="text-white/40 text-xs uppercase tracking-wider font-bold">{r.l}</div>
                          <div className={`font-condensed font-black text-3xl ${r.c}`}>{r.v}</div>
                        </div>
                      ))}
                      <div className="col-span-2 border-t border-white/10 pt-4 text-white/30 text-xs">
                        § 11b SGB II · Stand {LEGAL.buergergeld.stand} · Ohne Gewähr
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
