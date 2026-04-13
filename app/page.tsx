import Navbar     from '@/components/Navbar'
import Hero       from '@/components/Hero'
import Rechner    from '@/components/Rechner'
import SkillsCheck from '@/components/SkillsCheck'
import Footer     from '@/components/Footer'

export default function Home() {
  return (
    <main>
      {/* Hero-Bereich mit Hintergrund */}
      <div className="bg-gradient-to-br from-navy via-navy-mid to-[#1e4a7a] min-h-[90vh] flex flex-col">
        {/* Disclaimer-Banner */}
        <div className="w-full border-b border-amber/30 bg-amber-500/10 py-3 px-6 text-center text-xs text-white/70">
          <span className="text-amber font-semibold">⚠️ Hinweis:</span>{' '}
          Kostenloses Informationsangebot ohne Rechtsberatung. Alle Angaben ohne Gewähr.
          Bitte wichtige Entscheidungen immer mit der Agentur für Arbeit oder einem Berater prüfen.
        </div>
        <Navbar />
        <Hero />
      </div>

      {/* Trennlinie */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />

      {/* Wie es funktioniert */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-teal/25 bg-teal/10 text-teal text-xs font-semibold tracking-widest uppercase">
          Schritt für Schritt
        </div>
        <h2 className="font-serif mb-3">
          In <em className="italic text-teal">3 Schritten</em> zum Sofort-Plan
        </h2>
        <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-12 max-w-xl font-light">
          Kein langer Fragebogen. Kein Konto. Kein Kleingedrucktes. Du brauchst nur 3 Minuten.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { n: '1', icon: '🧮', titel: 'Freibetrag berechnen',   text: 'Wir zeigen dir sofort wie viel du legal dazuverdienen kannst — ohne Abzüge.',              zeit: '⏱ 1 Minute' },
            { n: '2', icon: '🎯', titel: 'Skills-Check machen',    text: '5 kurze Fragen zu deinen Fähigkeiten und Verfügbarkeit. Kein Profil nötig.',              zeit: '⏱ 2 Minuten' },
            { n: '3', icon: '🚀', titel: 'Sofort-Plan erhalten',   text: 'Konkrete Optionen die zu dir passen — mit realistischen Verdienstspannen.',              zeit: '⏱ Sofort' },
            { n: '4', icon: '📋', titel: 'Meldung nicht vergessen', text: 'Wir erinnern dich an alle Meldepflichten — damit du keine Rückforderungen riskierst.', zeit: '⚠️ Wichtig' },
          ].map(s => (
            <div key={s.n} className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-md border border-gray-100 dark:border-gray-800 relative hover:-translate-y-1 transition-transform">
              <span className="absolute top-4 right-6 font-serif text-5xl text-teal/10 select-none">{s.n}</span>
              <div className="text-3xl mb-4">{s.icon}</div>
              <h3 className="font-semibold text-base mb-2">{s.titel}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{s.text}</p>
              <span className="inline-block mt-4 bg-teal/10 text-teal text-xs font-semibold px-3 py-1 rounded-full">{s.zeit}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />
      <Rechner />
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />
      <SkillsCheck />

      {/* Trust-Bereich */}
      <section className="bg-navy py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-white mb-12">
            Warum du uns <em className="italic text-teal-light">vertrauen</em> kannst
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: '🔒', titel: 'Keine Daten gespeichert',  text: 'Deine Angaben werden nicht gespeichert oder weitergegeben. Kein Konto nötig.' },
              { icon: '📚', titel: 'Immer aktuell',            text: 'Wir aktualisieren alle Rechenwerte regelmäßig – Mindestlohn, Minijob-Grenze, Freibeträge.' },
              { icon: '⚠️', titel: 'Ehrliche Erwartungen',    text: 'Wir versprechen kein schnelles Geld. Realistische Spannen – und Warnungen vor dubiosen Angeboten.' },
              { icon: '🤝', titel: 'Kostenlos für dich',       text: 'Dieses Portal ist komplett kostenlos. Wir finanzieren uns über Partnerprovision von seriösen Plattformen.' },
            ].map(t => (
              <div key={t.titel} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-colors">
                <div className="text-3xl mb-4">{t.icon}</div>
                <h4 className="text-white font-semibold text-sm mb-2">{t.titel}</h4>
                <p className="text-white/50 text-xs leading-relaxed">{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rechtlicher Hinweis */}
      <section className="bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 py-16 px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif mb-8">Rechtlicher <em className="italic text-teal">Hinweis</em></h2>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 leading-relaxed space-y-4">
            <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-1.5 rounded-full text-xs font-semibold">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse inline-block" />
              Zuletzt aktualisiert: Januar 2026
            </div>
            <h3 className="font-serif text-lg text-navy dark:text-white">Kein Ersatz für Rechtsberatung</h3>
            <p>
              WasNun.jetzt ist ein <strong className="text-navy dark:text-white">kostenloses Informationsangebot</strong>.
              Alle Inhalte wurden sorgfältig recherchiert und werden regelmäßig aktualisiert.
              Sie ersetzen jedoch <strong className="text-navy dark:text-white">keine individuelle Rechts- oder Steuerberatung</strong>.
            </p>
            <p>
              Wir übernehmen <strong className="text-navy dark:text-white">keine Gewähr für die Richtigkeit, Vollständigkeit oder Aktualität</strong>.
              Gesetzliche Regelungen – insbesondere im SGB II, SGB III sowie zu Mindestlohn und Minijob-Grenzen –
              können sich jederzeit ändern. Wir bemühen uns stets, Änderungen zeitnah einzupflegen.
            </p>
            <p>
              <strong className="text-navy dark:text-white">
                Bitte prüfe alle wichtigen Entscheidungen mit deiner Agentur für Arbeit (0800 4 5555 00),
                deinem Jobcenter oder einem zertifizierten Sozialrechtsberater.
              </strong>
            </p>
            <p className="text-xs text-gray-400 border-t border-gray-100 dark:border-gray-800 pt-4">
              Grundlagen: § 155 SGB III · § 11b SGB II · Mindestlohngesetz 2026 · Minijob-Zentrale · Stand: Januar 2026
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
