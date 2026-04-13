'use client'
import { useState } from 'react'
import { SKILL_OPTIONS, PLAN_KARTEN } from '@/lib/data'

type Antworten = Record<string, string>

const FRAGEN = [
  { key: 'beruf',      text: 'Was hast du zuletzt gemacht?',        hinweis: 'Wähle was am besten passt — keine falsche Antwort.' },
  { key: 'zeit',       text: 'Wie viel Zeit hast du pro Woche?',    hinweis: 'Bei ALG I: max. 14 Stunden 59 Minuten erlaubt!' },
  { key: 'mobilitaet', text: 'Wie ist deine Mobilität?',            hinweis: 'Bestimmt ob lokale oder digitale Optionen passen.' },
  { key: 'digital',    text: 'Wie fit bist du am Computer?',        hinweis: 'Ehrlich antworten — wir passen die Optionen an.' },
  { key: 'ziel',       text: 'Was ist dir am wichtigsten?',         hinweis: 'Damit zeigen wir dir die passendsten Optionen.' },
]

export default function SkillsCheck() {
  const [schritt, setSchritt]     = useState(0)
  const [antworten, setAntworten] = useState<Antworten>({})

  const waehlen = (key: string, val: string) => setAntworten(a => ({ ...a, [key]: val }))
  const fortschritt = Math.round(((schritt) / FRAGEN.length) * 100)

  const gefilterteKarten = PLAN_KARTEN.filter(k =>
    k.tags.some(t => Object.values(antworten).includes(t))
  ).slice(0, 4)
  const karten = gefilterteKarten.length >= 2 ? gefilterteKarten : PLAN_KARTEN.slice(0, 4)

  return (
    <section id="skills" className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Left info */}
          <div className="lg:w-1/3">
            <div className="inline-block bg-schwarz text-white text-xs font-bold px-3 py-1.5 rounded-full mb-5 tracking-widest uppercase">
              Schritt 2 & 3
            </div>
            <h2 className="font-display text-4xl font-black mb-4 leading-tight">
              Dein persönlicher<br /><span className="text-rot italic">Sofort-Plan</span>
            </h2>
            <p className="text-grau-mittel leading-relaxed mb-6">
              5 kurze Fragen — du bekommst konkrete Optionen die zu dir passen. Kein Konto, keine Daten gespeichert.
            </p>
            {/* Progress */}
            <div className="mb-2 flex justify-between text-sm font-semibold">
              <span>Fortschritt</span>
              <span className="text-rot">{fortschritt}%</span>
            </div>
            <div className="h-2 bg-grau-hell rounded-full overflow-hidden">
              <div className="h-full bg-rot rounded-full transition-all duration-500"
                style={{ width: `${fortschritt}%` }} />
            </div>
          </div>

          {/* Right — Questions */}
          <div className="lg:w-2/3 w-full">
            {schritt < FRAGEN.length && (() => {
              const f = FRAGEN[schritt]
              const opts = SKILL_OPTIONS[f.key as keyof typeof SKILL_OPTIONS]
              return (
                <div className="bg-grau-hell rounded-3xl p-8">
                  <div className="text-rot text-xs font-bold tracking-widest uppercase mb-2">
                    Frage {schritt + 1} von {FRAGEN.length}
                  </div>
                  <div className="font-display text-2xl font-bold mb-2">{f.text}</div>
                  <div className="text-grau-mittel text-sm mb-8">{f.hinweis}</div>

                  <div className="grid grid-cols-2 gap-3 mb-8">
                    {opts.map(opt => (
                      <button key={opt.value} onClick={() => waehlen(f.key, opt.value)}
                        className={`border-2 rounded-2xl p-4 text-left transition-all ${
                          antworten[f.key] === opt.value
                            ? 'border-rot bg-rot-hell'
                            : 'border-gray-200 bg-white hover:border-rot'
                        }`}>
                        <span className="text-2xl block mb-2">{opt.emoji}</span>
                        <div className="text-sm font-bold text-schwarz">{opt.label}</div>
                        <div className="text-xs text-grau-mittel mt-0.5">{opt.sub}</div>
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-between">
                    {schritt > 0 ? (
                      <button onClick={() => setSchritt(s => s - 1)}
                        className="border-2 border-gray-200 text-grau-mittel hover:border-schwarz hover:text-schwarz px-6 py-3 rounded-full text-sm font-semibold transition-all">
                        ← Zurück
                      </button>
                    ) : <div />}
                    <button onClick={() => setSchritt(s => s + 1)}
                      className="bg-schwarz hover:bg-rot text-white px-8 py-3 rounded-full text-sm font-bold transition-all">
                      {schritt === FRAGEN.length - 1 ? '→ Meinen Plan zeigen' : 'Weiter →'}
                    </button>
                  </div>
                </div>
              )
            })()}

            {schritt === FRAGEN.length && (
              <div>
                <div className="bg-schwarz rounded-3xl p-7 text-white mb-6">
                  <div className="text-rot text-xs font-bold tracking-widest uppercase mb-2">Dein Ergebnis</div>
                  <h3 className="font-display text-2xl font-bold mb-2">🎯 Dein persönlicher Sofort-Plan</h3>
                  <p className="text-white/60 text-sm">Realistische Optionen basierend auf deinen Angaben. Verdienstangaben sind Richtwerte.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {karten.map(k => (
                    <div key={k.titel} className="bg-grau-hell rounded-2xl p-5 border-2 border-transparent hover:border-rot transition-all">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl shadow-sm">
                          {k.icon}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-schwarz">{k.titel}</div>
                          <div className="text-rot text-xs font-bold">{k.verdienst}</div>
                        </div>
                      </div>
                      <p className="text-xs text-grau-mittel leading-relaxed">{k.beschreibung}</p>
                      <span className="inline-block mt-3 bg-white text-schwarz px-3 py-1 rounded-full text-xs font-bold border border-gray-200">
                        {k.startLabel}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5 text-sm text-amber-800 leading-relaxed mb-4">
                  <strong>📋 Meldepflicht — nicht vergessen!</strong><br />
                  Jede Nebentätigkeit muss <strong>spätestens am ersten Arbeitstag</strong> gemeldet werden. Sonst drohen Rückforderungen.<br /><br />
                  👉 <strong>ALG I:</strong> 0800 4 5555 00 · arbeitsagentur.de<br />
                  👉 <strong>Bürgergeld:</strong> jobcenter.digital
                </div>

                <button onClick={() => { setSchritt(0); setAntworten({}) }}
                  className="w-full border-2 border-schwarz hover:bg-schwarz hover:text-white text-schwarz font-bold py-3 rounded-full text-sm transition-all">
                  ↺ Neu starten
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
