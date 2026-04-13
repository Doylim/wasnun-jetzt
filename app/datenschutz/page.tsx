import Link from 'next/link'
import { IMPRESSUM } from '@/lib/data'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Datenschutz – WasNun.jetzt' }

export default function DatenschutzPage() {
  return (
    <main className="min-h-screen bg-cream dark:bg-gray-950 py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-teal text-sm hover:underline mb-8 inline-block">← Zurück zur Startseite</Link>
        <h1 className="font-serif mb-8">Datenschutzerklärung</h1>
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 leading-relaxed space-y-6">

          <section>
            <h2 className="font-serif text-xl text-navy dark:text-white mb-3">1. Verantwortlicher</h2>
            <p>{IMPRESSUM.name}, {IMPRESSUM.strasse}, {IMPRESSUM.ort}<br />
            E-Mail: <a href={`mailto:${IMPRESSUM.mail}`} className="text-teal hover:underline">{IMPRESSUM.mail}</a></p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-navy dark:text-white mb-3">2. Grundsätze</h2>
            <p>
              WasNun.jetzt verarbeitet so wenig personenbezogene Daten wie möglich.
              Der Skills-Check und der Freibetrag-Rechner funktionieren vollständig
              <strong className="text-navy dark:text-white"> ohne Konto und ohne Datenspeicherung</strong>.
              Alle Eingaben bleiben lokal in deinem Browser und werden nicht an uns übertragen.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-navy dark:text-white mb-3">3. Server-Logs</h2>
            <p>
              Beim Aufruf dieser Website speichert der Hosting-Anbieter (Vercel Inc., 340 Pine Street,
              San Francisco, CA 94104, USA) automatisch Server-Logs. Diese enthalten IP-Adresse,
              Browsertyp, Betriebssystem, Referrer-URL, Datum und Uhrzeit des Zugriffs.
              Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an Betrieb
              und Sicherheit). Speicherdauer: max. 30 Tage.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-navy dark:text-white mb-3">4. Cookies</h2>
            <p>
              Wir setzen keine Tracking-Cookies. Es werden ausschließlich technisch notwendige
              Cookies verwendet, die für den Betrieb der Website erforderlich sind.
              Eine Einwilligung ist dafür nicht erforderlich (§ 25 Abs. 2 TTDSG).
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-navy dark:text-white mb-3">5. Externe Links</h2>
            <p>
              WasNun.jetzt enthält Links zu externen Plattformen (z.B. Clickworker, Zenjob,
              arbeitsagentur.de). Für deren Datenschutz sind die jeweiligen Anbieter
              verantwortlich. Einige Links können Affiliate-Parameter enthalten – für dich
              entstehen dabei keine zusätzlichen Kosten.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-navy dark:text-white mb-3">6. Deine Rechte</h2>
            <p>
              Du hast das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16),
              Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18),
              Datenübertragbarkeit (Art. 20) und Widerspruch (Art. 21).
              Beschwerden können bei der zuständigen Datenschutzaufsichtsbehörde
              (Landesbeauftragter für Datenschutz Baden-Württemberg) eingereicht werden.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-navy dark:text-white mb-3">7. Kontakt</h2>
            <p>
              Bei Fragen zum Datenschutz wende dich an:<br />
              <a href={`mailto:${IMPRESSUM.mail}`} className="text-teal hover:underline">{IMPRESSUM.mail}</a>
            </p>
          </section>

          <p className="text-xs text-gray-400 border-t border-gray-100 dark:border-gray-800 pt-4">
            Stand: April 2026 · Diese Datenschutzerklärung wird bei Änderungen aktualisiert.
          </p>
        </div>
      </div>
    </main>
  )
}
