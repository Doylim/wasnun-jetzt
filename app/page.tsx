import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Kategorien from '@/components/Kategorien'
import Rechner from '@/components/Rechner'
import SkillsCheck from '@/components/SkillsCheck'
import Bildungsgutschein from '@/components/Bildungsgutschein'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />

      {/* Wie es funktioniert */}
      <section className="py-24 px-6 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="reveal mb-16">
            <div className="inline-block bg-grau-hell text-schwarz font-black uppercase tracking-widest text-xs px-4 py-2 mb-6">
              So funktioniert's
            </div>
            <h2 className="font-condensed font-black uppercase text-big leading-none">
              In <span className="text-rot">3 Minuten</span><br />zum Sofort-Plan
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-100">
            {[
              { n: '01', titel: 'Freibetrag berechnen',    text: 'Sofort sehen wie viel du legal dazuverdienen kannst.', zeit: '1 Min.' },
              { n: '02', titel: 'Kategorien entdecken',    text: 'Sofort-, Clever-, Aufbau- und Digital-Optionen — alle erklärt.', zeit: '5 Min.' },
              { n: '03', titel: 'Skills-Check machen',     text: '5 Fragen — dann bekommst du deinen persönlichen Plan.', zeit: '2 Min.' },
              { n: '04', titel: 'Meldung nicht verpassen', text: 'Jede Nebentätigkeit spätestens am ersten Arbeitstag melden!', zeit: 'Pflicht' },
            ].map((s, i) => (
              <div key={s.n} className={`reveal delay-${i+1} bg-white p-8 group hover:bg-rot transition-all duration-300 cursor-default`}>
                <div className="font-condensed font-black text-6xl text-gray-100 group-hover:text-white/20 transition-colors leading-none mb-6">{s.n}</div>
                <h3 className="font-black uppercase tracking-wide text-sm mb-3 group-hover:text-white transition-colors">{s.titel}</h3>
                <p className="text-sm text-grau-mid leading-relaxed group-hover:text-white/70 transition-colors mb-4">{s.text}</p>
                <span className="inline-block border border-gray-200 group-hover:border-white/30 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full group-hover:text-white transition-all">{s.zeit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Rechner />
      <Kategorien />
      <Bildungsgutschein />
      <SkillsCheck />

      {/* Trust */}
      <section className="py-24 px-6 bg-schwarz">
        <div className="max-w-7xl mx-auto">
          <div className="reveal mb-16">
            <h2 className="font-condensed font-black uppercase text-big text-white leading-none">
              Warum du uns<br /><span className="text-rot">vertrauen</span> kannst
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
            {[
              { n: '01', titel: 'Keine Daten',    text: 'Alles bleibt lokal in deinem Browser. Kein Konto, keine Registrierung, keine Weitergabe.' },
              { n: '02', titel: 'Immer aktuell',  text: 'Mindestlohn, Minijob-Grenze, Übungsleiterpauschale — wir aktualisieren bei Gesetzesänderungen.' },
              { n: '03', titel: 'Nur Ehrliches',  text: 'Kein schnelles Geld versprochen. Realistische Spannen, klare Warnungen vor dubiosen Angeboten.' },
              { n: '04', titel: '100% Kostenlos', text: 'Komplett kostenlos für dich. Finanziert über Partnerprovision von seriösen Plattformen.' },
            ].map((t, i) => (
              <div key={t.n} className={`reveal delay-${i+1} bg-schwarz p-8 border border-white/5 hover:border-rot/50 transition-all group`}>
                <div className="font-condensed font-black text-5xl text-white/5 group-hover:text-rot/20 transition-colors leading-none mb-6">{t.n}</div>
                <h4 className="font-black uppercase tracking-wider text-sm text-white mb-3 group-hover:text-rot transition-colors">{t.titel}</h4>
                <p className="text-white/40 text-sm leading-relaxed">{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rechtlicher Hinweis */}
      <section className="py-16 px-6 bg-grau-hell border-t border-gray-200">
        <div className="max-w-3xl mx-auto reveal">
          <div className="inline-block bg-rot text-white font-black uppercase tracking-widest text-xs px-4 py-2 mb-8">Rechtlicher Hinweis</div>
          <div className="bg-white rounded-3xl p-8 border border-gray-100 text-sm text-grau-mid leading-relaxed space-y-4">
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Zuletzt aktualisiert: Januar 2026
            </div>
            <h3 className="font-black uppercase tracking-wide text-base text-schwarz">Kein Ersatz für Rechtsberatung</h3>
            <p>WasNun.jetzt ist ein <strong className="text-schwarz">kostenloses Informationsangebot</strong> ohne Rechtsberatung. Alle Inhalte sorgfältig recherchiert, regelmäßig aktualisiert. Wir übernehmen <strong className="text-schwarz">keine Gewähr für Richtigkeit oder Aktualität</strong>. Gesetzliche Regelungen können sich jederzeit ändern.</p>
            <p><strong className="text-schwarz">Bitte prüfe alle wichtigen Entscheidungen mit deiner Agentur für Arbeit (0800 4 5555 00) oder deinem Jobcenter.</strong></p>
            <p className="text-xs text-gray-400 border-t border-gray-100 pt-4 font-mono">§ 155 SGB III · § 11b SGB II · § 3 Nr. 26 EStG · § 81 SGB III · Mindestlohngesetz 2026 · Stand: Januar 2026</p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
