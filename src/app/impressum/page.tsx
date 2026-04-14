import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { IMPRESSUM } from "@/lib/data";

export const metadata: Metadata = {
  title: "Impressum",
  robots: { index: true, follow: true },
};

export default function ImpressumPage() {
  return (
    <main className="min-h-screen bg-navy-50 py-20">
      <div className="mx-auto max-w-2xl px-4 md:px-6">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-teal-600 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Zurueck zur Startseite
        </Link>
        <h1 className="mb-8 text-4xl font-black text-navy-900">Impressum</h1>
        <div className="space-y-5 rounded-3xl border border-navy-100 bg-white p-8 text-sm leading-relaxed text-navy-700 shadow-sm">
          <section>
            <strong className="text-navy-900">{IMPRESSUM.name}</strong>
            <br />
            {IMPRESSUM.firma}
            <br />
            {IMPRESSUM.strasse}
            <br />
            {IMPRESSUM.ort}
            <br />
            {IMPRESSUM.land}
          </section>
          <section>
            <strong className="text-navy-900">Kontakt</strong>
            <br />
            Telefon: {IMPRESSUM.tel}
            <br />
            E-Mail:{" "}
            <a
              href={`mailto:${IMPRESSUM.mail}`}
              className="text-teal-600 hover:underline"
            >
              {IMPRESSUM.mail}
            </a>
          </section>
          <section>
            <strong className="text-navy-900">
              Umsatzsteuer-Identifikationsnummer
            </strong>
            <br />
            gemaess § 27a Umsatzsteuergesetz: {IMPRESSUM.ust}
          </section>
          <section>
            <strong className="text-navy-900">
              Verantwortlicher i.S.d. § 18 Abs. 2 MStV
            </strong>
            <br />
            {IMPRESSUM.name}, {IMPRESSUM.strasse}, {IMPRESSUM.ort}
          </section>
          <section>
            <strong className="text-navy-900">Streitbeilegung</strong>
            <br />
            Wir sind zur Teilnahme an einem Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle weder verpflichtet noch bereit.
          </section>
          <section>
            <strong className="text-navy-900">Haftungshinweis</strong>
            <br />
            Dieses Portal ist ein kostenloses Informationsangebot ohne
            Rechtsberatung. Alle Angaben ohne Gewaehr. Wir bemuehen uns stets,
            die aktuellste Gesetzeslage abzubilden.
          </section>
        </div>
      </div>
    </main>
  );
}
