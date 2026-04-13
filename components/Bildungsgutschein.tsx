export default function Bildungsgutschein() {
  return (
    <section className="py-24 px-6 bg-schwarz relative overflow-hidden">
      {/* Roter Akzent-Streifen */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-rot" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Links — Text */}
          <div className="reveal-left">
            <div className="inline-block bg-rot text-white font-black uppercase tracking-widest text-xs px-4 py-2 mb-8">
              Der unterschätzte Weg
            </div>
            <h2 className="font-condensed font-black uppercase leading-none text-white mb-6" style={{fontSize:'clamp(2.5rem,6vw,5rem)'}}>
              Bildungs-<br />gutschein.<br />
              <span className="text-rot">Kostenlos.</span>
            </h2>
            <p className="text-white/60 text-lg leading-relaxed mb-8">
              Als Arbeitssuchende/r hast du oft Anspruch auf einen <strong className="text-white">Bildungsgutschein</strong> — der Staat zahlt deine Weiterbildung. Komplett. Die meisten wissen das nicht.
            </p>
            <div className="space-y-4 mb-10">
              {[
                { step: '01', text: 'Beratungsgespräch bei der Agentur für Arbeit anfragen' },
                { step: '02', text: 'Bildungsgutschein beantragen — kostenlos und einfach' },
                { step: '03', text: 'AZAV-zertifizierten Kurs aussuchen (z.B. C-Trainer online)' },
                { step: '04', text: 'Qualifikation erwerben — Staat zahlt alles' },
                { step: '05', text: 'Im Verein trainieren → 275 €/Monat steuerfrei verdienen' },
              ].map(s => (
                <div key={s.step} className="flex items-start gap-4">
                  <div className="font-condensed font-black text-2xl text-rot shrink-0 w-10">{s.step}</div>
                  <p className="text-white/70 text-sm leading-relaxed pt-1">{s.text}</p>
                </div>
              ))}
            </div>
            <a
              href="https://www.arbeitsagentur.de/bildungsgutschein"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-rot hover:bg-rot-dunkel text-white font-black uppercase tracking-wider px-8 py-4 rounded-full transition-all"
            >
              Mehr zum Bildungsgutschein →
            </a>
          </div>

          {/* Rechts — Karten */}
          <div className="reveal-right space-y-4">
            <div className="text-white/30 text-xs font-black uppercase tracking-widest mb-6">
              Beispiel: C-Trainer Breitensport
            </div>

            {[
              { label: 'Kurskosten', wert: '0 €', sub: 'Bildungsgutschein deckt alles ab', farbe: 'text-green-400' },
              { label: 'Kursdauer', wert: '16 Wochen', sub: 'Komplett online, flexibel einteilbar', farbe: 'text-white' },
              { label: 'Danach verdienen', wert: '275 €/Monat', sub: 'Übungsleiterpauschale, steuerfrei', farbe: 'text-rot' },
              { label: 'Pro Jahr steuerfrei', wert: '3.300 €', sub: 'Zusätzlich zum normalen Freibetrag', farbe: 'text-rot' },
            ].map(k => (
              <div key={k.label} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex justify-between items-center hover:border-rot/30 transition-all">
                <div>
                  <div className="text-white/40 text-xs uppercase tracking-wider font-black">{k.label}</div>
                  <div className="text-white/60 text-xs mt-0.5">{k.sub}</div>
                </div>
                <div className={`font-condensed font-black text-3xl ${k.farbe}`}>{k.wert}</div>
              </div>
            ))}

            <div className="bg-rot/10 border border-rot/20 rounded-2xl p-5 mt-6">
              <div className="text-rot text-xs font-black uppercase tracking-widest mb-2">Wichtiger Hinweis</div>
              <p className="text-white/60 text-xs leading-relaxed">
                Der Bildungsgutschein wird nicht automatisch gewährt — du musst ihn aktiv beantragen.
                Der Kurs muss AZAV-zertifiziert sein. Sprich beim nächsten Termin in der Agentur direkt darauf an.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
