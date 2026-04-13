'use client'
import { useState } from 'react'
import { SKILL_OPTIONS, PLAN_KARTEN } from '@/lib/data'

type Antworten = Record<string, string>

const FRAGEN = [
  { key: 'beruf',      text: 'Was hast du zuletzt gemacht?',        hinweis: 'Keine falsche Antwort — wähle was am besten passt.' },
  { key: 'zeit',       text: 'Wie viel Zeit hast du pro Woche?',    hinweis: 'Bei ALG I: max. 14 Stunden 59 Minuten erlaubt!' },
  { key: 'mobilitaet', text: 'Wie ist deine Mobilität?',            hinweis: 'Bestimmt ob lokale oder digitale Optionen besser passen.' },
  { key: 'digital',    text: 'Wie fit bist du am Computer?',        hinweis: 'Ehrlich antworten — wir passen die Empfehlungen an.' },
]

export default function SkillsCheck() {
  const [schritt, setSchritt]     = useState(0)
  const [antworten, setAntworten] = useState<Antworten>({})
  const fortschritt = Math.round((schritt / FRAGEN.length) * 100)

  const waehlen = (key: string, val: string) => setAntworten(a => ({ ...a, [key]: val }))

  const gefilterteKarten = PLAN_KARTEN.filter(k =>
    k.tags.some(t => Object.values(antworten).includes(t))
  ).slice(0, 4)
  const karten = gefilterteKarten.length >= 2 ? gefilterteKarten : PLAN_KARTEN.slice(0, 4)

  return (
    <section id="skills" className="py-24 px-6 bg-white border-t border-gray-100 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-rot" />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 items-start">

          {/* Links */}
          <div className="lg:w-5/12 reveal-left">
            <div className="inline-block bg-rot text-white font-black uppercase tracking-widest text-xs px-4 py-2 mb-6">
              Dein persönlicher Plan
            </div>
            <h2 className="font-condensed font-black uppercase text-big leading-none mb-6">
              Was passt<br />zu <span className="text-rot">dir?</span>
            </h2>
            <p className="text-grau-mid leading-relaxed mb-8">
              4 kurze Fragen — du bekommst konkrete Optionen die wirklich zu deiner Situation passen. Keine Daten gespeichert.
            </p>
            <div className="mb-3 flex justify-between text-xs font-black uppercase tracking-wider">
              <span>Fortschritt</span>
              <span className="text-rot">{fortschritt}%</span>
            </div>
            <div className="h-1 bg-grau-hell rounded-full overflow-hidden">
              <div className="h-full bg-rot transition-all duration-500 rounded-full" style={{ width: `${fortschritt}%` }} />
            </div>

            {/* Compliance Box */}
            <div className="mt-8 border-l-4 border-rot bg-rot-hell rounded-r-2xl p-5 text-sm leading-relaxed">
              <div className="font-black uppercase tracking-wider text-xs mb-2 text-rot">Meldepflicht</div>
              Jede Nebentätigkeit muss <strong>spätestens am ersten Arbeitstag</strong> bei der Agentur gemeldet werden. Sonst drohen Rückforderungen!<br /><br />
              <strong>ALG I:</strong> 0800 4 5555 00<br />
              <strong>Bürgergeld:</strong> jobcenter.digital
            </div>
          </div>

          {/* Rechts */}
          <div className="lg:w-7/12 reveal-right">
            {schritt < FRAGEN.length && (() => {
              const f = FRAGEN[schritt]
              const opts = SKILL_OPTIONS[f.key as keyof typeof SKILL_OPTIONS]
              return (
                <div className="bg-grau-hell rounded-3xl p-8">
                  <div className="text-rot text-xs font-black uppercase tracking-widest mb-3">
                    Frage {schritt + 1} / {FRAGEN.length}
                  </div>
                  <h3 className="font-condensed font-black uppercase text-3xl mb-2">{f.text}</h3>
                  <p className="text-grau-mid text-sm mb-8">{f.hinweis}</p>

                  <div className="grid grid-cols-2 gap-3 mb-8">
                    {opts.map(opt => (
                      <button key={opt.value} onClick={() => waehlen(f.key, opt.value)}
                        className={`border-2 rounded-2xl p-4 text-left transition-all ${
                          antworten[f.key] === opt.value
                            ? 'border-rot bg-white'
                            : 'border-gray-200 bg-white hover:border-rot'
                        }`}>
                        <div className="font-black text-sm uppercase tracking-wide text-schwarz mb-1">{opt.label}</div>
                        <div className="text-xs text-grau-mid">{opt.sub}</div>
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-between">
                    {schritt > 0 ? (
                      <button onClick={() => setSchritt(s => s-1)}
                        className="border-2 border-gray-200 hover:border-schwarz text-grau-mid hover:text-schwarz px-6 py-3 rounded-full text-sm font-black uppercase tracking-wider transition-all">
                        ← Zurück
                      </button>
                    ) : <div />}
                    <button onClick={() => setSchritt(s => s+1)}
                      className="bg-schwarz hover:bg-rot text-white px-8 py-4 rounded-full text-sm font-black uppercase tracking-wider transition-all">
                      {schritt === FRAGEN.length - 1 ? '→ Plan zeigen' : 'Weiter →'}
                    </button>
                  </div>
                </div>
              )
            })()}

            {schritt === FRAGEN.length && (
              <div>
                <div className="bg-schwarz text-white rounded-3xl p-7 mb-6">
                  <div className="text-rot text-xs font-black uppercase tracking-widest mb-2">Dein Ergebnis</div>
                  <h3 className="font-condensed font-black uppercase text-2xl">Dein persönlicher Sofort-Plan</h3>
                  <p className="text-white/50 mt-2 text-sm">Alle Verdienstangaben sind Richtwerte. Ohne Gewähr.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {karten.map(k => (
                    <div key={k.titel} className="bg-grau-hell rounded-2xl p-5 border-2 border-transparent hover:border-rot transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <span className="bg-schwarz text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full">
                          {k.kategorie}
                        </span>
                        <span className="text-grau-mid text-xs">{k.timing}</span>
                      </div>
                      <h4 className="font-black uppercase tracking-wide text-sm text-schwarz mb-1">{k.titel}</h4>
                      <div className="font-condensed font-black text-xl text-rot mb-2">{k.verdienst}</div>
                      <p className="text-xs text-grau-mid leading-relaxed mb-2">{k.beschreibung}</p>
                      <div className="text-xs font-mono text-gray-400">{k.rechtsBasis}</div>
                      {k.warnung && (
                        <div className="mt-3 bg-amber-50 border-l-2 border-amber-400 px-3 py-2 text-xs text-amber-800">
                          {k.warnung}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <button onClick={() => { setSchritt(0); setAntworten({}) }}
                  className="w-full border-2 border-schwarz hover:bg-schwarz hover:text-white font-black uppercase tracking-wider py-4 rounded-full text-sm transition-all">
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
