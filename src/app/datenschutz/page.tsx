import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { IMPRESSUM } from "@/lib/data";

export const metadata: Metadata = {
  title: "Datenschutz",
  robots: { index: true, follow: true },
};

export default function DatenschutzPage() {
  return (
    <main className="min-h-screen bg-navy-50 py-20">
      <div className="mx-auto max-w-2xl px-4 md:px-6">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-teal-600 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Zurück zur Startseite
        </Link>
        <h1 className="mb-8 text-4xl font-black text-navy-900">
          Datenschutzerklärung
        </h1>
        <div className="space-y-6 rounded-3xl border border-navy-100 bg-white p-8 text-sm leading-relaxed text-navy-700 shadow-sm">
          <section>
            <h2 className="mb-2 text-lg font-bold text-navy-900">
              1. Verantwortlicher
            </h2>
            <p>
              {IMPRESSUM.name}, {IMPRESSUM.strasse}, {IMPRESSUM.ort}
              <br />
              E-Mail:{" "}
              <a
                href={`mailto:${IMPRESSUM.mail}`}
                className="text-teal-600 hover:underline"
              >
                {IMPRESSUM.mail}
              </a>
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-navy-900">
              2. Grundsätze
            </h2>
            <p>
              WasNun.jetzt verarbeitet so wenig personenbezogene Daten wie
              möglich. Der Rechner und der Verdienst-Finder funktionieren
              vollständig{" "}
              <strong className="text-navy-900">
                ohne Konto und ohne Datenspeicherung
              </strong>
              . Alle Eingaben bleiben lokal in deinem Browser und werden nicht
              an uns übertragen.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-navy-900">
              3. Server-Logs
            </h2>
            <p>
              Beim Aufruf dieser Website speichert der Hosting-Anbieter (Vercel
              Inc., 340 Pine Street, San Francisco, CA 94104, USA) automatisch
              Server-Logs. Diese enthalten IP-Adresse, Browsertyp,
              Betriebssystem, Referrer-URL, Datum und Uhrzeit des Zugriffs.
              Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes
              Interesse an Betrieb und Sicherheit). Speicherdauer: max. 30
              Tage.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-navy-900">4. Cookies</h2>
            <p>
              Wir setzen keine Tracking-Cookies. Es werden ausschließlich
              technisch notwendige Cookies verwendet, die für den Betrieb der
              Website erforderlich sind. Eine Einwilligung ist dafür nicht
              erforderlich (§ 25 Abs. 2 TTDSG).
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-navy-900">
              5. Newsletter und Plan-Versand
            </h2>
            <p>
              Wenn du deinen persönlichen Plan per E-Mail anforderst, speichern
              wir zusätzlich zur E-Mail-Adresse die freiwillig eingegebenen
              Rechner-Daten (ALG-I-Betrag, Stunden pro Woche, aktivierte
              Pauschalen, errechneter Freibetrag) als Kontaktattribute bei
              unserem Mail-Dienstleister Brevo (Sendinblue SAS, 106 boulevard
              Haussmann, 75008 Paris, Frankreich). Das erlaubt uns, dir deinen
              persönlichen Plan zuzusenden und gelegentlich thematisch passende
              Tipps zu schicken.
            </p>
            <p className="mt-3">
              Wir nutzen ein Double-Opt-in-Verfahren: Nach deiner Anforderung
              bekommst du eine Bestätigungs-Mail mit einem Link. Erst nach
              Klick darauf wird deine Adresse in unseren Verteiler aufgenommen
              und der Plan verschickt.
            </p>
            <p className="mt-3">
              <strong className="text-navy-900">Rechtsgrundlage:</strong>{" "}
              Art. 6 Abs. 1 lit. a DSGVO (Einwilligung). Du kannst die
              Einwilligung jederzeit widerrufen, indem du auf den Abmelde-Link
              in jeder Mail klickst. Nach Widerruf werden sowohl deine Adresse
              als auch die gespeicherten Rechner-Daten aus Brevo gelöscht.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-navy-900">
              6. Externe Links &amp; Affiliate
            </h2>
            <p>
              WasNun.jetzt enthält Links zu externen Plattformen. Einige dieser
              Links sind{" "}
              <strong className="text-navy-900">Affiliate-Links</strong>: Wenn
              du dich über einen solchen Link bei einem Anbieter registrierst,
              bekommen wir ggf. eine kleine Provision. Für dich entstehen
              dabei <strong className="text-navy-900">keine Kosten</strong>.
              Unsere rechtlichen Informationen und Empfehlungen werden von
              Provisionen nicht beeinflusst. Für den Datenschutz der
              verlinkten Seiten sind die jeweiligen Anbieter verantwortlich.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-navy-900">
              7. Deine Rechte
            </h2>
            <p>
              Du hast das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung
              (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung
              (Art. 18), Datenübertragbarkeit (Art. 20) und Widerspruch (Art.
              21). Beschwerden können bei der zuständigen
              Datenschutzaufsichtsbehörde (Landesbeauftragter für
              Datenschutz Baden-Württemberg) eingereicht werden.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-navy-900">
              8. Kontakt
            </h2>
            <p>
              Bei Fragen zum Datenschutz wende dich an:
              <br />
              <a
                href={`mailto:${IMPRESSUM.mail}`}
                className="text-teal-600 hover:underline"
              >
                {IMPRESSUM.mail}
              </a>
            </p>
          </section>

          <p className="border-t border-navy-100 pt-4 text-xs text-navy-400">
            Stand: April 2026 · Diese Datenschutzerklärung wird bei
            Änderungen aktualisiert.
          </p>
        </div>
      </div>
    </main>
  );
}
