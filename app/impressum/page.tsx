import Link from 'next/link'
import { IMPRESSUM } from '@/lib/data'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Impressum – WasNun.jetzt' }

export default function ImpressumPage() {
  return (
    <main className="min-h-screen bg-cream dark:bg-gray-950 py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-teal text-sm hover:underline mb-8 inline-block">← Zurück zur Startseite</Link>
        <h1 className="font-serif mb-8">Impressum</h1>
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 leading-relaxed space-y-4">
          <div>
            <strong className="text-navy dark:text-white">{IMPRESSUM.name}</strong><br />
            {IMPRESSUM.firma}<br />
            {IMPRESSUM.strasse}<br />
            {IMPRESSUM.ort}<br />
            {IMPRESSUM.land}
          </div>
          <div>
            <strong className="text-navy dark:text-white">Kontakt</strong><br />
            Telefon: {IMPRESSUM.tel}<br />
            E-Mail: <a href={`mailto:${IMPRESSUM.mail}`} className="text-teal hover:underline">{IMPRESSUM.mail}</a>
          </div>
          <div>
            <strong className="text-navy dark:text-white">Umsatzsteuer-Identifikationsnummer</strong><br />
            gemäß § 27a Umsatzsteuergesetz: {IMPRESSUM.ust}
          </div>
          <div>
            <strong className="text-navy dark:text-white">Verantwortlicher i.S.d. § 18 Abs. 2 MStV</strong><br />
            {IMPRESSUM.name}, {IMPRESSUM.strasse}, {IMPRESSUM.ort}
          </div>
          <div>
            <strong className="text-navy dark:text-white">Streitbeilegung</strong><br />
            Wir sind zur Teilnahme an einem Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle weder verpflichtet noch bereit.
          </div>
          <div>
            <strong className="text-navy dark:text-white">Haftungshinweis</strong><br />
            Dieses Portal ist ein kostenloses Informationsangebot ohne Rechtsberatung.
            Alle Angaben ohne Gewähr. Wir bemühen uns stets, die aktuellste Gesetzeslage abzubilden.
          </div>
        </div>
      </div>
    </main>
  )
}
