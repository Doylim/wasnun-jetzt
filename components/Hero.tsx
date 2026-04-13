'use client'
import { LEGAL } from '@/lib/data'

export default function Hero() {
  return (
    <section className="bg-white pt-16 pb-20 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">

        {/* Disclaimer */}
        <div className="mb-10 inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 px-4 py-2 rounded-full text-xs font-semibold">
          ⚠️ Kostenloses Informationsangebot · Alle Angaben ohne Gewähr · Kein Ersatz für Rechtsberatung
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <div className="inline-block bg-rot text-white text-xs font-bold px-3 py-1.5 rounded-full mb-6 tracking-widest uppercase">
              ✦ Dein Sofort-Helfer
            </div>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] mb-6 text-schwarz">
              Du bist<br />
              arbeitslos.<br />
              <span className="text-rot italic">Was jetzt?</span>
            </h1>
            <p className="text-grau-mittel text-lg leading-relaxed mb-10 max-w-md font-light">
              In 3 Minuten weißt du, was du <strong className="text-schwarz font-semibold">legal dazuverdienen</strong> darfst — und wie du noch heute anfangen kannst.
            </p>
            <div className="flex gap-3 flex-wrap">
              <a
                href="#rechner"
                className="bg-rot hover:bg-rot-dunkel text-white font-bold px-8 py-4 rounded-full transition-all shadow-lg shadow-rot/20 text-base"
              >
                → Freibetrag berechnen
              </a>
              <a
                href="#skills"
                className="border-2 border-schwarz hover:bg-schwarz hover:text-white text-schwarz font-bold px-8 py-4 rounded-full transition-all text-base"
              >
                Skills-Check
              </a>
            </div>
          </div>

          {/* Right — Stat Cards */}
          <div className="grid grid-cols-1 gap-4">
            {[
              { zahl: '3 Mio.', label: 'Registrierte Arbeitslose in Deutschland', icon: '👥', bg: 'bg-grau-hell' },
              { zahl: `${LEGAL.alg1.freibetrag} €`, label: 'Freibetrag ALG I pro Monat — anrechnungsfrei', icon: '💶', bg: 'bg-rot-hell' },
              { zahl: `${LEGAL.minijob.grenze} €`, label: 'Minijob-Grenze 2026 — legal dazuverdienen', icon: '✅', bg: 'bg-grau-hell' },
            ].map(s => (
              <div key={s.zahl} className={`${s.bg} rounded-2xl p-6 flex items-center gap-5 shadow-sm`}>
                <div className="text-4xl">{s.icon}</div>
                <div>
                  <div className="font-display text-3xl font-black text-schwarz">{s.zahl}</div>
                  <div className="text-grau-mittel text-sm mt-0.5">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
