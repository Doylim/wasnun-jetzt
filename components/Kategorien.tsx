'use client'
import { useState } from 'react'
import { KATEGORIEN } from '@/lib/data'

export default function Kategorien() {
  const [aktiv, setAktiv] = useState('sofort')
  const kat = KATEGORIEN.find(k => k.id === aktiv)!

  return (
    <section id="kategorien" className="py-24 px-6 bg-grau-hell relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-rot" />
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="reveal mb-12">
          <div className="inline-block bg-schwarz text-white font-black uppercase tracking-widest text-xs px-4 py-2 mb-6">
            Alle Möglichkeiten
          </div>
          <h2 className="font-condensed font-black uppercase text-big leading-none mb-4">
            Was kannst du<br /><span className="text-rot">verdienen?</span>
          </h2>
          <p className="text-grau-mid max-w-xl leading-relaxed">
            Vier Kategorien — von sofort bis strategisch. Viele kennen nur die erste. Die anderen drei sind der echte Unterschied.
          </p>
        </div>

        {/* Kategorie-Tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {KATEGORIEN.map(k => (
            <button
              key={k.id}
              onClick={() => setAktiv(k.id)}
              className={`px-6 py-3 rounded-full font-black uppercase tracking-wider text-sm transition-all border-2 ${
                aktiv === k.id
                  ? 'bg-rot border-rot text-white'
                  : 'border-gray-300 text-grau-mid hover:border-schwarz hover:text-schwarz bg-white'
              }`}
            >
              {k.label}
              <span className="ml-2 font-normal normal-case text-xs opacity-70">{k.sublabel}</span>
            </button>
          ))}
        </div>

        {/* Aktive Kategorie */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Info-Panel */}
          <div className="lg:col-span-1">
            <div className="bg-schwarz text-white rounded-3xl p-7 h-full">
              <div className="text-rot text-xs font-black uppercase tracking-widest mb-4">
                {kat.label}
              </div>
              <div className="font-condensed font-black text-4xl text-white mb-2 leading-none">
                {kat.max}
              </div>
              <div className="text-white/50 text-sm mb-6">{kat.timing}</div>
              <p className="text-white/70 text-sm leading-relaxed mb-6">{kat.beschreibung}</p>

              <div className="border-t border-white/10 pt-5">
                <div className="text-xs font-black uppercase tracking-widest text-white/30 mb-2">Rechtsbasis</div>
                <div className="text-white/50 text-xs font-mono leading-relaxed">{kat.rechtsbasis}</div>
              </div>

              {kat.tipp && (
                <div className="mt-5 bg-rot/20 border border-rot/30 rounded-xl p-4">
                  <div className="text-rot text-xs font-black uppercase tracking-wider mb-1">Profi-Tipp</div>
                  <p className="text-white/80 text-xs leading-relaxed">{kat.tipp}</p>
                </div>
              )}

              {kat.qualifikation && (
                <div className="mt-5 bg-white/5 rounded-xl p-4">
                  <div className="text-xs font-black uppercase tracking-wider text-white/30 mb-2">Förderung</div>
                  <div className="text-white font-bold text-sm mb-1">{kat.qualifikation.name}</div>
                  <div className="text-green-400 font-black text-sm">{kat.qualifikation.kosten}</div>
                  <div className="text-white/40 text-xs mt-1">{kat.qualifikation.foerderung}</div>
                </div>
              )}
            </div>
          </div>

          {/* Optionen */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {kat.optionen.map((opt, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border-2 border-transparent hover:border-rot transition-all group">
                <div className="flex items-start justify-between mb-3">
                  <div className="font-condensed font-black text-4xl text-gray-100 group-hover:text-rot/10 transition-colors leading-none">
                    {String(i+1).padStart(2,'0')}
                  </div>
                  <span className="bg-rot text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full">
                    {opt.timing}
                  </span>
                </div>
                <h3 className="font-black uppercase tracking-wide text-sm mb-1 text-schwarz">{opt.titel}</h3>
                <div className="font-condensed font-black text-xl text-rot mb-3">{opt.verdienst}</div>
                <p className="text-xs text-grau-mid leading-relaxed mb-3">{opt.beschreibung}</p>
                {opt.warnung && (
                  <div className="bg-amber-50 border-l-2 border-amber-400 px-3 py-2 text-xs text-amber-800 leading-relaxed">
                    {opt.warnung}
                  </div>
                )}
                {opt.link && (
                  <a href={opt.link} target="_blank" rel="noopener noreferrer"
                    className="inline-block mt-3 text-xs font-black uppercase tracking-wider text-rot hover:underline">
                    Mehr erfahren →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
