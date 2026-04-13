'use client'

import { LEGAL } from '@/lib/data'

export default function Hero() {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-20 flex-1 relative z-5">
      <div className="inline-block mb-7 px-5 py-2 rounded-full border border-teal/30 bg-teal/15 text-teal-light text-xs font-semibold tracking-widest uppercase">
        ✦ Dein Sofort-Helfer
      </div>

      <h1 className="font-serif text-white leading-tight max-w-3xl mb-5">
        Du bist arbeitslos.<br />
        <em className="italic text-teal-light">Was jetzt?</em>
      </h1>

      <p className="text-white/70 text-base md:text-lg max-w-xl leading-relaxed mb-12 font-light">
        In 3 Minuten weißt du, was du legal dazuverdienen darfst — und wie du
        noch heute anfangen kannst. Klar. Sicher. Ohne Behörden-Stress.
      </p>

      <div className="flex gap-4 flex-wrap justify-center mb-16">
        <button
          onClick={() => scrollTo('rechner')}
          className="bg-teal hover:bg-teal-light transition-all text-white font-semibold px-8 py-4 rounded-full shadow-lg shadow-teal/40 text-base"
        >
          → Freibetrag berechnen
        </button>
        <button
          onClick={() => scrollTo('skills')}
          className="border border-white/25 hover:border-white/60 text-white/80 hover:text-white transition-all px-7 py-4 rounded-full text-base"
        >
          Skills-Check starten
        </button>
      </div>

      {/* Kennzahlen */}
      <div className="flex gap-8 md:gap-14 flex-wrap justify-center">
        {[
          { zahl: '3 Mio.',                label: 'Registrierte Arbeitslose (März 2026)' },
          { zahl: `${LEGAL.alg1.freibetrag} €`,   label: 'Freibetrag ALG I / Monat' },
          { zahl: `${LEGAL.minijob.grenze} €`,    label: 'Minijob-Grenze 2026' },
        ].map(s => (
          <div key={s.zahl} className="text-center">
            <span className="font-serif text-3xl text-teal-light block">{s.zahl}</span>
            <span className="text-white/50 text-xs tracking-wide">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
