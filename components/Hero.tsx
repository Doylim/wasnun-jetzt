'use client'
import { useEffect, useRef } from 'react'
import { LEGAL } from '@/lib/data'

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Scroll reveal
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible')
      }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
      .forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="min-h-screen bg-white flex flex-col justify-center pt-24 pb-16 px-6 overflow-hidden relative">

      {/* Roter Akzent-Block oben rechts */}
      <div className="absolute top-0 right-0 w-1/3 h-2 bg-rot" />

      {/* Disclaimer */}
      <div className="max-w-7xl mx-auto w-full mb-8 reveal">
        <div className="inline-flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 text-xs text-grau-mid font-bold uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Kostenlos · Anonym · Kein Ersatz für Rechtsberatung
        </div>
      </div>

      {/* MEGA Headline */}
      <div className="max-w-7xl mx-auto w-full">
        <div className="reveal">
          <h1 className="font-condensed font-black uppercase leading-none text-huge text-schwarz">
            Du bist<br />
            <span className="text-rot">arbeitslos.</span><br />
            Was jetzt?
          </h1>
        </div>

        {/* Unterstrich-Linie */}
        <div className="reveal delay-1 h-1 w-32 bg-rot mt-8 mb-8" />

        {/* Sub + CTA nebeneinander */}
        <div className="reveal delay-2 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <p className="text-grau-mid text-xl font-normal max-w-lg leading-relaxed">
            In <strong className="text-schwarz font-bold">3 Minuten</strong> weißt du was du legal dazuverdienen darfst — und wie du noch heute anfangen kannst.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a href="#rechner"
              className="bg-rot hover:bg-rot-dunkel text-white font-black uppercase tracking-wider px-8 py-4 rounded-full text-base transition-all shadow-lg shadow-rot/20 text-center">
              → Freibetrag berechnen
            </a>
            <a href="#skills"
              className="border-2 border-schwarz hover:bg-schwarz hover:text-white text-schwarz font-black uppercase tracking-wider px-8 py-4 rounded-full text-base transition-all text-center">
              Skills-Check
            </a>
          </div>
        </div>

        {/* Stat-Leiste */}
        <div className="reveal delay-3 mt-16 grid grid-cols-1 sm:grid-cols-3 gap-px bg-gray-200">
          {[
            { zahl: '3 Mio.', label: 'Arbeitslose in DE', sub: 'Stand März 2026' },
            { zahl: `${LEGAL.alg1.freibetrag} €`,  label: 'Freibetrag ALG I', sub: 'Pro Monat anrechnungsfrei' },
            { zahl: `${LEGAL.minijob.grenze} €`, label: 'Minijob-Grenze', sub: 'Ab Januar 2026' },
          ].map(s => (
            <div key={s.zahl} className="bg-white p-8 hover:bg-rot-hell transition-colors group">
              <div className="font-condensed font-black text-5xl text-schwarz group-hover:text-rot transition-colors">{s.zahl}</div>
              <div className="font-bold text-sm uppercase tracking-wider mt-1">{s.label}</div>
              <div className="text-grau-mid text-xs mt-1">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
