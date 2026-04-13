'use client'

import { useState } from 'react'
import { SKILL_OPTIONS, PLAN_KARTEN } from '@/lib/data'

type Antworten = Record<string, string>

const FRAGEN = [
  { key: 'beruf',      text: 'Was hast du zuletzt hauptsächlich gemacht?',  hinweis: 'Keine falsche Antwort – wähle was am besten passt.' },
  { key: 'zeit',       text: 'Wie viel Zeit hast du pro Woche?',             hinweis: 'Wichtig: Bei ALG I darfst du maximal 14 Stunden 59 Minuten arbeiten!' },
  { key: 'mobilitaet', text: 'Wie ist deine Mobilität?',                     hinweis: 'Das bestimmt ob lokale oder digitale Optionen besser passen.' },
  { key: 'digital',    text: 'Wie fit bist du am Computer?',                 hinweis: 'Ehrlich antworten – wir passen die Optionen daran an.' },
  { key: 'ziel',       text: 'Was ist dir am wichtigsten?',                  hinweis: 'Damit zeigen wir dir die passendsten Optionen.' },
]

export default function SkillsCheck() {
  const [schritt, setSchritt]     = useState(0)
  const [antworten, setAntworten] = useState<Antworten>({})

  const waehlen = (key: string, val: string) =>
    setAntworten(a => ({ ...a, [key]: val }))

  const fortschritt = ((schritt + 1) / (FRAGEN.length + 1)) * 100

  // Passende Karten filtern
  const gefilterteKarten = PLAN_KARTEN.filter(k =>
    k.tags.some(t => Object.values(antworten).includes(t))
  ).slice(0, 4)
  const karten = gefilterteKarten.length >= 2 ? gefilterteKarten : PLAN_KARTEN.slice(0, 4)

  return (
    <section id="skills" className="py-20 px-6 max-w-5xl mx-auto">
      <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-teal/25 bg-teal/10 text-teal text-xs font-semibold tracking-widest uppercase">
        Schritt 2 & 3
      </div>
      <h2 className="font-serif mb-3">
        Dein persönlicher <em className="italic text-teal">Sofort-Plan</em>
      </h2>
      <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-12 max-w-xl font-light">
        5 kurze Fragen – du bekommst konkrete Optionen die zu dir passen. Kein Konto, keine Daten gespeichert.
      </p>

      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-10 shadow-xl border border-gray-100 dark:border-gray-800 max-w-2xl">
        {/* Fortschrittsbalken */}
        <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full mb-10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-teal to-teal-light rounded-full transition-all duration-500"
            style={{ width: `${fortschritt}%` }}
          />
        </div>

        {/* Fragen */}
        {schritt < FRAGEN.length && (() => {
          const f   = FRAGEN[schritt]
          const opts = SKILL_OPTIONS[f.key as keyof typeof SKILL_OPTIONS]
          return (
            <div>
              <div className="text-teal text-xs font-semibold tracking-widest uppercase mb-2">
                Frage {schritt + 1} von {FRAGEN.length}
              </div>
              <div className="font-serif text-2xl mb-2 leading-snug">{f.text}</div>
              <div className="text-gray-400 text-sm mb-8 leading-relaxed">{f.hinweis}</div>

              <div className="grid grid-cols-2 gap-3">
                {opts.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => waehlen(f.key, opt.value)}
                    className={`border-2 rounded-2xl p-4 text-left transition-all hover:border-teal ${
                      antworten[f.key] === opt.value
                        ? 'border-teal bg-teal/8 dark:bg-teal/10'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <span className="text-2xl block mb-1.5">{opt.emoji}</span>
                    <div className="text-sm font-semibold">{opt.label}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{opt.sub}</div>
                  </button>
                ))}
              </div>

              <div className="flex justify-between mt-8">
                {schritt > 0 ? (
                  <button
                    onClick={() => setSchritt(s => s - 1)}
                    className="border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-navy dark:hover:text-white px-6 py-3 rounded-full text-sm transition-all"
                  >
                    ← Zurück
                  </button>
                ) : <div />}
                <button
                  onClick={() => setSchritt(s => s + 1)}
                  className="bg-navy hover:bg-teal text-white px-8 py-3 rounded-full text-sm font-semibold transition-all"
                >
                  {schritt === FRAGEN.length - 1 ? '→ Meinen Plan zeigen' : 'Weiter →'}
                </button>
              </div>
            </div>
          )
        })()}

        {/* Ergebnis */}
        {schritt === FRAGEN.length && (
          <div>
            <div className="bg-gradient-to-br from-navy to-navy-mid rounded-2xl p-6 text-white mb-6">
              <h3 className="font-serif text-2xl mb-2">🎯 Dein persönlicher Sofort-Plan</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Basierend auf deinen Angaben – realistische Optionen. Alle Verdienstangaben sind Richtwerte.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {karten.map(k => (
                <div key={k.titel} className={`${k.bg} border border-gray-100 dark:border-gray-700 rounded-2xl p-5 hover:-translate-y-1 transition-transform`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl bg-white/70 dark:bg-gray-800">
                      {k.icon}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{k.titel}</div>
                      <div className="text-teal text-xs font-semibold">{k.verdienst}</div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{k.beschreibung}</p>
                  <span className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold ${k.startFarbe}`}>
                    {k.startLabel}
                  </span>
                </div>
              ))}
            </div>

            {/* Meldepflicht */}
            <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-2xl p-5 text-sm text-amber-800 dark:text-amber-300 leading-relaxed mb-4">
              <strong>📋 Meldepflicht – bitte nicht vergessen!</strong><br />
              Jede Nebentätigkeit muss <strong>spätestens am ersten Arbeitstag</strong> gemeldet werden.
              Verspätete Meldung kann zu <strong>Rückforderungen</strong> führen.<br /><br />
              👉 <strong>ALG I:</strong> 0800 4 5555 00 (kostenlos) · arbeitsagentur.de<br />
              👉 <strong>Bürgergeld:</strong> jobcenter.digital
            </div>

            <button
              onClick={() => { setSchritt(0); setAntworten({}) }}
              className="w-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 font-semibold py-3 rounded-full text-sm transition-all"
            >
              ↺ Neu starten
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
