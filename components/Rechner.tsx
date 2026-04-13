'use client'

import { useState } from 'react'
import { berechneAlg1, berechneBuergergeld, euro } from '@/lib/calc'
import { LEGAL } from '@/lib/data'

type Tab = 'alg1' | 'bg'

export default function Rechner() {
  const [tab, setTab]               = useState<Tab>('alg1')
  const [alg1Betrag, setAlg1Betrag] = useState('')
  const [alg1Neben, setAlg1Neben]   = useState('')
  const [alg1Stunden, setAlg1Stunden] = useState(8)
  const [bgBetrag, setBgBetrag]     = useState('')
  const [bgNeben, setBgNeben]       = useState('')

  const alg1 = (alg1Betrag || alg1Neben)
    ? berechneAlg1(+alg1Betrag || 0, +alg1Neben || 0, alg1Stunden)
    : null

  const bg = (bgBetrag || bgNeben)
    ? berechneBuergergeld(+bgBetrag || 0, +bgNeben || 0)
    : null

  const inputKlasse =
    'w-full border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-teal rounded-xl px-4 py-3.5 text-base outline-none transition-colors'

  return (
    <section id="rechner" className="py-20 px-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-teal/25 bg-teal/10 text-teal text-xs font-semibold tracking-widest uppercase">
        Schritt 1
      </div>
      <h2 className="font-serif mb-3">
        <em className="italic text-teal">Freibetrag-Rechner</em>
      </h2>
      <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-6 max-w-xl font-light">
        Wie viel darfst du legal dazuverdienen — ohne dass dein ALG I oder Bürgergeld gekürzt wird?
      </p>

      {/* Minijob-Grenze */}
      <div className="inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-semibold mb-10">
        📌 Minijob-Grenze {new Date().getFullYear()}: <strong>{LEGAL.minijob.grenze} €/Monat</strong>
        &nbsp;|&nbsp; Mindestlohn: <strong>{LEGAL.minijob.mindestlohn} €/Std.</strong>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-10 shadow-xl border border-gray-100 dark:border-gray-800 max-w-2xl">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-gray-100 dark:bg-gray-800 p-1.5 rounded-xl w-fit">
          {(['alg1', 'bg'] as Tab[]).map(id => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                tab === id
                  ? 'bg-white dark:bg-gray-700 text-navy dark:text-white shadow-sm'
                  : 'text-gray-500 hover:text-navy dark:hover:text-white'
              }`}
            >
              {id === 'alg1' ? 'ALG I' : 'Bürgergeld'}
            </button>
          ))}
        </div>

        {/* ── ALG I ── */}
        {tab === 'alg1' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Mein monatliches ALG I{' '}
                <span className="font-light text-gray-400 text-xs">(brutto, ca.)</span>
              </label>
              <input type="number" placeholder="z.B. 1200" value={alg1Betrag}
                onChange={e => setAlg1Betrag(e.target.value)} className={inputKlasse} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">
                Geplanter Nebenverdienst pro Monat{' '}
                <span className="font-light text-gray-400 text-xs">(brutto)</span>
              </label>
              <input type="number" placeholder="z.B. 300" value={alg1Neben}
                onChange={e => setAlg1Neben(e.target.value)} className={inputKlasse} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-3">
                Stunden pro Woche:{' '}
                <span className={`font-bold ${alg1Stunden >= 15 ? 'text-red-500' : 'text-teal'}`}>
                  {alg1Stunden} Std.
                </span>
                {alg1Stunden >= 15 && <span className="ml-2 text-red-500 text-xs">⚠️ Zu viel!</span>}
              </label>
              <input type="range" min={1} max={20} value={alg1Stunden}
                onChange={e => setAlg1Stunden(+e.target.value)} />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>1 Std.</span><span>20 Std.</span>
              </div>
            </div>

            {/* 15h-Warnung */}
            {alg1Stunden >= 15 && (
              <div className="flex gap-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl p-4 text-sm text-red-700 dark:text-red-300 leading-relaxed">
                🚨 <div>
                  <strong>Achtung: 15-Stunden-Grenze!</strong><br />
                  Ab 15 Stunden/Woche giltst du nicht mehr als arbeitslos und verlierst deinen ALG-I-Anspruch!
                </div>
              </div>
            )}

            {/* Ergebnis */}
            {alg1 && alg1.stundenOk && (
              <>
                <div className="flex gap-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-xl p-4 text-sm text-green-700 dark:text-green-300">
                  ✅ <div><strong>Im grünen Bereich!</strong> Vergiss nicht, die Nebentätigkeit zu melden.</div>
                </div>
                <div className="bg-gradient-to-br from-navy to-navy-mid rounded-2xl p-6 text-white">
                  <div className="text-white/50 text-xs mb-4 uppercase tracking-wider">Deine Berechnung</div>
                  <div className="grid grid-cols-2 gap-5">
                    {[
                      { label: 'Anrechnungsfreier Betrag', wert: euro(alg1.freibetrag),  farbe: 'text-teal-light' },
                      { label: 'Verbleibendes ALG I',      wert: euro(alg1.algNeu),      farbe: 'text-teal-light' },
                      { label: 'Gesamteinkommen',          wert: euro(alg1.gesamt),      farbe: 'text-teal-light' },
                      { label: 'Kürzung ALG I',            wert: euro(alg1.anrechenbar), farbe: 'text-amber' },
                    ].map(r => (
                      <div key={r.label}>
                        <div className="text-white/50 text-xs mb-1">{r.label}</div>
                        <div className={`font-serif text-2xl ${r.farbe}`}>{r.wert}</div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-white/10 mt-5 pt-4 text-white/40 text-xs leading-relaxed">
                    Richtwerte · § 155 SGB III · Stand: {LEGAL.alg1.stand} · Ohne Gewähr ·
                    Meldung spätestens am ersten Arbeitstag · Hotline: {LEGAL.alg1.hotline}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── Bürgergeld ── */}
        {tab === 'bg' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Mein monatliches Bürgergeld{' '}
                <span className="font-light text-gray-400 text-xs">(Regelleistung)</span>
              </label>
              <input type="number" placeholder="z.B. 563" value={bgBetrag}
                onChange={e => setBgBetrag(e.target.value)} className={inputKlasse} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">
                Geplanter Brutto-Verdienst pro Monat
              </label>
              <input type="number" placeholder="z.B. 400" value={bgNeben}
                onChange={e => setBgNeben(e.target.value)} className={inputKlasse} />
            </div>

            {bg && (
              <div className="bg-gradient-to-br from-navy to-navy-mid rounded-2xl p-6 text-white">
                <div className="text-white/50 text-xs mb-4 uppercase tracking-wider">Deine Berechnung</div>
                <div className="grid grid-cols-2 gap-5">
                  {[
                    { label: 'Freibetrag (anrechnungsfrei)', wert: euro(bg.frei),       farbe: 'text-teal-light' },
                    { label: 'Anrechnung aufs Bürgergeld',   wert: euro(bg.anrechnung), farbe: 'text-amber' },
                    { label: 'Verbleibendes Bürgergeld',     wert: euro(bg.bgNeu),      farbe: 'text-teal-light' },
                    { label: 'Gesamteinkommen',              wert: euro(bg.gesamt),     farbe: 'text-teal-light' },
                  ].map(r => (
                    <div key={r.label}>
                      <div className="text-white/50 text-xs mb-1">{r.label}</div>
                      <div className={`font-serif text-2xl ${r.farbe}`}>{r.wert}</div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/10 mt-5 pt-4 text-white/40 text-xs leading-relaxed">
                  Staffel: 0–100 € = 100% frei · 100–520 € = 20% frei · 520–1.000 € = 30% frei ·
                  § 11b SGB II · Stand: {LEGAL.buergergeld.stand} · Ohne Gewähr
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
