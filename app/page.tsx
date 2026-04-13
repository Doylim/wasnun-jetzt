import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Rechner from '@/components/Rechner'
import SkillsCheck from '@/components/SkillsCheck'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />

      {/* Wie es funktioniert */}
      <section className="py-20 px-6 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-block bg-grau-hell text-schwarz text-xs font-bold px-3 py-1.5 rounded-full mb-5 tracking-widest uppercase">
              So einfach geht's
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-black mb-4">
              In <span className="text-rot italic">3 Minuten</span> zum Sofort-Plan
            </h2>
            <p className="text-grau-mittel max-w-lg mx-auto">
              Kein Konto. Kein Kleingedrucktes. Nur schnelle, ehrliche Hilfe.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { n: '01', icon: '🧮', titel: 'Freibetrag berechnen',    text: 'Wir zeigen dir sofort wie viel du legal dazuverdienen kannst.', zeit: '1 Minute' },
              { n: '02', icon: '🎯', titel: 'Skills-Check machen',     text: '5 kurze Fragen zu Fähigkeiten, Zeit und Region.', zeit: '2 Minuten' },
              { n: '03', icon: '🚀', titel: 'Sofort-Plan erhalten',    text: 'Konkrete Optionen mit realistischen Verdienstspannen.', zeit: 'Sofort' },
              { n: '04', icon: '📋', titel: 'Meldung nicht vergessen', text: 'Wir erinnern dich an alle Meldepflichten — kein Risiko.', zeit: '⚠️ Wichtig' },
            ].map(s => (
              <div key={s.n} className="relative bg-grau-hell rounded-2xl p-6 hover:shadow-md transition-all group">
                <div className="absolute top-4 right-5 font-display text-5xl font-black text-gray-200 select-none group-hover:text-rot/10 transition-colors">
                  {s.n}
                </div>
                <div className="text-3xl mb-4">{s.icon}</div>
                <h3 className="font-bold text-base mb-2">{s.titel}</h3>
                <p className="text-sm text-grau-mittel leading-relaxed mb-4">{s.text}</p>
                <span className="inline-block bg-rot text-white text-xs font-bold px-3 py-1 rounded-full">
                  {s.zeit}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Rechner />

      {/* Trennlinie */}
      <div className="h-px bg-gray-100" />

      <SkillsCheck />

      {/* Trust */}
      <section className="py-20 px-6 bg-schwarz text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl font-black mb-4">
              Warum du uns <span className="text-rot italic">vertrauen</span> kannst
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: '🔒', titel: 'Keine Daten gespeichert',  text: 'Deine Angaben bleiben lokal im Browser. Kein Konto, keine Registrierung.' },
              { icon: '📚', titel: 'Immer aktuell',            text: 'Wir aktualisieren Mindestlohn, Minijob-Grenze und Freibeträge regelmäßig.' },
              { icon: '⚠️', titel: 'Ehrliche Erwartungen',    text: 'Wir versprechen kein schnelles Geld — nur realistische Optionen.' },
              { icon: '🤝', titel: 'Kostenlos für dich',       text: 'Komplett kostenlos. Wir finanzieren uns über Partnerprovision.' },
            ].map(t => (
              <div key={t.titel} className="border border-white/10 rounded-2xl p-6 hover:border-rot/50 transition-colors">
                <div className="text-3xl mb-4">{t.icon}</div>
                <h4 className="font-bold text-sm mb-2">{t.titel}</h4>
                <p className="text-white/50 text-xs leading-relaxed">{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rechtlicher Hinweis */}
      <section className="py-16 px-6 bg-grau-hell border-t border-gray-200">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-3xl font-black mb-6">
            Rechtlicher <span className="text-rot italic">Hinweis</span>
          </h2>
          <div className="bg-white rounded-2xl p-8 border border-gray-200 text-sm text-grau-mittel leading-relaxed text-left space-y-4">
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-1.5 rounded-full text-xs font-bold">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse inline-block" />
              Zuletzt aktualisiert: Januar 2026
            </div>
            <h3 className="font-display text-lg font-bold text-schwarz">Kein Ersatz für Rechtsberatung</h3>
            <p>
              WasNun.jetzt ist ein <strong className="text-schwarz">kostenloses Informationsangebot</strong> ohne Rechtsberatung.
              Alle Inhalte wurden sorgfältig recherchiert und werden regelmäßig aktualisiert.
              Wir übernehmen <strong className="text-schwarz">keine Gewähr für Richtigkeit oder Aktualität</strong>.
            </p>
            <p>
              Gesetzliche Regelungen — insbesondere SGB II, SGB III, Mindestlohn und Minijob-Grenzen — können sich jederzeit ändern.
              Wir bemühen uns stets, Änderungen zeitnah einzupflegen.
            </p>
            <p className="font-semibold text-schwarz">
              Bitte prüfe alle wichtigen Entscheidungen mit deiner Agentur für Arbeit (0800 4 5555 00) oder deinem Jobcenter.
            </p>
            <p className="text-xs text-gray-400 border-t border-gray-100 pt-4">
              Grundlagen: § 155 SGB III · § 11b SGB II · Mindestlohngesetz 2026 · Stand: Januar 2026
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
