'use client'
import { useState } from 'react'
import { SKILL_OPTIONS, PLAN_KARTEN } from '@/lib/data'

type Antworten = Record<string, string>

const FRAGEN = [
  { key: 'beruf',      text: 'Was hast du zuletzt gemacht?',        hinweis: 'Keine falsche Antwort — wähle was passt.' },
  { key: 'zeit',       text: 'Wie viel Zeit hast du pro Woche?',    hinweis: 'Bei ALG I: max. 14 Stunden 59 Minuten!' },
  { key: 'mobilitaet', text: 'Wie ist deine Mobilität?',            hinweis: 'Bestimmt ob lokale oder digitale Jobs passen.' },
  { key: 'digital',    text: 'Wie fit bist du am Computer?',        hinweis: 'Ehrlich — wir passen die Empfehlungen an.' },
  { key: 'ziel',       text: 'Was ist dir am wichtigsten?',         hinweis: 'Zeigt uns die passendsten Optionen.' },
]

export default function SkillsCheck() {
  const [schritt, setSchritt]     = useState(0)
  const [antworten, setAntworten] = useState<Antworten>({})

  const waehlen = (key: string, val: string) => setAntworten(a => ({ ...a, [key]: val }))
  const fortschritt = Math.round((schritt / FRAGEN.length) * 100)

  const gefilterteKarten = PLAN_KARTEN.filter(k =>
    k.tags.some(t => Object.values(antworten).includes(t))
  ).slice(0, 4)
  const karten = gefilterteKarten.length >= 2 ? gefilterteKarten : PLAN_KARTEN.slice(0, 4)

  return (
    <section id="skills" className="py-24 px-6 bg-white relative overflow-hidden">
      {/* Roter Akzent-Block */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-rot" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="reveal mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="inline-block bg-schwarz text-white font-black uppercase tracking-widest text-xs px-4 py-2 mb-6">
              SCHRITT 02 & 03
            </div>
            <h2 className="font-condensed font-black uppercase text-big leading-none">
              Dein persönlicher<br />
              <span className="text-rot">Sofort-Plan</span>
            </h2>
          </div>
          {/* Progress */}
          <div className="lg:w-64">
            <div className="flex justify-between text-xs font-black uppercase tracking-wider mb-2">
              <span>Fortschritt</span>
              <span className="text-rot">{fortschritt}%</span>
            </div>
            <div className="h-1.5 bg-grau-hell rounded-full overflow-hidden">
              <div className="h-full bg-rot transition-all duration-500 rounded-full"
                style={{ width: `${fortschritt}%` }} />
            </div>
          </div>
        </div>

        {/* Fragen */}
        {schritt < FRAGEN.length && (() => {
          const f = FRAGEN[schritt]
          const opts = SKILL_OPTIONS[f.key as keyof typeof SKILL_OPTIONS]
          return (
            <div className="reveal">
              <div className="mb-8">
                <div className="text-rot text-xs font-black uppercase tracking-widest mb-3">
                  Frage {schritt + 1} / {FRAGEN.length}
                </div>
                <h3 className="font-condensed font-black uppercase text-3xl md:text-4xl mb-2">{f.text}</h3>
                <p className="text-grau-mid">{f.hinweis}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-10">
                {opts.map(opt => (
                  <button key={opt.value} onClick={() => waehlen(f.key, opt.value)}
                    className={`border-2 rounded-2xl p-5 text-left transition-all hover-card ${
                      antworten[f.key] === opt.value
                        ? 'border-rot bg-rot-hell'
                        : 'border-gray-200 hover:border-rot'
                    }`}>
                    <span className="text-3xl block mb-3">{opt.emoji}</span>
                    <div className="font-black text-sm uppercase tracking-wide">{opt.label}</div>
                    <div className="text-xs text-grau-mid mt-1 font-normal">{opt.sub}</div>
                  </button>
                ))}
              </div>

              <div className="flex justify-between items-center">
                {schritt > 0 ? (
                  <button onClick={() => setSchritt(s => s - 1)}
                    className="border-2 border-gray-200 hover:border-schwarz text-grau-mid hover:text-schwarz px-6 py-3 rounded-full text-sm font-black uppercase tracking-wider transition-all">
                    ← Zurück
                  </button>
                ) : <div />}
                <button onClick={() => setSchritt(s => s + 1)}
                  className="bg-schwarz hover:bg-rot text-white px-8 py-4 rounded-full text-sm font-black uppercase tracking-wider transition-all">
                  {schritt === FRAGEN.length - 1 ? '→ Meinen Plan' : 'Weiter →'}
                </button>
              </div>
            </div>
          )
        })()}

        {/* Ergebnis */}
        {schritt === FRAGEN.length && (
          <div className="reveal">
            <div className="bg-schwarz text-white rounded-3xl p-8 mb-8">
              <div className="text-rot text-xs font-black uppercase tracking-widest mb-3">Dein Ergebnis</div>
              <h3 className="font-condensed font-black uppercase text-3xl">🎯 Dein persönlicher Sofort-Plan</h3>
              <p className="text-white/50 mt-2 text-sm">Realistische Optionen — Verdienstangaben sind Richtwerte.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {karten.map(k => (
                <div key={k.titel} className="border-2 border-gray-100 hover:border-rot rounded-2xl p-6 transition-all hover-card">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-grau-hell flex items-center justify-center text-3xl shrink-0">
                      {k.icon}
                    </div>
                    <div>
                      <div className="font-black uppercase tracking-wide text-sm">{k.titel}</div>
                      <div className="text-rot font-black text-lg font-condensed">{k.verdienst}</div>
                    </div>
                  </div>
                  <p className="text-sm text-grau-mid leading-relaxed">{k.beschreibung}</p>
                  <div className="mt-4 inline-block bg-schwarz text-white text-xs font-black uppercase tracking-wider px-4 py-2 rounded-full">
                    {k.startLabel}
                  </div>
                </div>
              ))}
            </div>

            {/* Meldepflicht */}
            <div className="border-l-4 border-rot bg-rot-hell rounded-r-2xl p-6 text-sm leading-relaxed mb-6">
              <div className="font-black uppercase tracking-wider mb-2">📋 Meldepflicht — nicht vergessen!</div>
              Jede Nebentätigkeit muss <strong>spätestens am ersten Arbeitstag</strong> gemeldet werden.
              Verspätete Meldung = Rückforderungen!<br /><br />
              <strong>ALG I:</strong> 0800 4 5555 00 · arbeitsagentur.de &nbsp;|&nbsp;
              <strong>Bürgergeld:</strong> jobcenter.digital
            </div>

            <button onClick={() => { setSchritt(0); setAntworten({}) }}
              className="border-2 border-schwarz hover:bg-schwarz hover:text-white font-black uppercase tracking-wider px-8 py-4 rounded-full text-sm transition-all">
              ↺ Neu starten
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
