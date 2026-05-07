import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { IMPRESSUM } from "@/lib/data";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description:
    "Datenschutzerklärung von WasNun.jetzt – DSGVO-konform, datensparsam, ohne Tracking.",
  robots: { index: true, follow: true },
};

export default function DatenschutzPage() {
  return (
    <main id="main" className="min-h-screen bg-navy-50 py-20">
      <div className="mx-auto max-w-2xl px-4 md:px-6">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-teal-700 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Zurück zur Startseite
        </Link>
        <h1 className="mb-4 text-4xl font-black text-navy-900 md:text-5xl">
          Datenschutzerklärung
        </h1>
        <p className="mb-8 text-sm text-navy-500">
          Stand: Mai 2026
        </p>

        <div className="space-y-7 rounded-3xl border border-navy-100 bg-white p-8 text-sm leading-relaxed text-navy-700 shadow-sm">
          {/* 1. Verantwortlicher */}
          <section>
            <h2 className="mb-2 text-lg font-bold text-navy-900">
              1. Verantwortlicher
            </h2>
            <p>
              Verantwortlicher im Sinne von Art. 4 Nr. 7 DSGVO ist:
            </p>
            <p className="mt-2">
              {IMPRESSUM.name}
              <br />
              {IMPRESSUM.firma}
              <br />
              {IMPRESSUM.strasse}
              <br />
              {IMPRESSUM.ort}
              <br />
              {IMPRESSUM.land}
              <br />
              Telefon: {IMPRESSUM.tel}
              <br />
              E-Mail:{" "}
              <a
                href={`mailto:${IMPRESSUM.mail}`}
                className="text-teal-700 hover:underline"
              >
                {IMPRESSUM.mail}
              </a>
              <br />
              USt-IdNr.: {IMPRESSUM.ust}
            </p>
            <p className="mt-2 text-navy-500">
              Ein gesetzlich vorgeschriebener Datenschutzbeauftragter ist nicht
              bestellt.
            </p>
          </section>

          {/* 2. Grundsätze und Überblick */}
          <section>
            <h2 className="mb-2 text-lg font-bold text-navy-900">
              2. Grundsätze und Überblick
            </h2>
            <p>
              WasNun.jetzt ist eine rein informative, statische Webseite. Wir
              verarbeiten so wenig personenbezogene Daten wie technisch
              möglich. Konkret bedeutet das:
            </p>
            <ul className="ml-5 mt-2 list-disc space-y-1">
              <li>kein Nutzer-Konto, keine Registrierung, kein Login</li>
              <li>kein Newsletter und kein Versand von Plänen per E-Mail</li>
              <li>kein Analytics-, Tracking- oder Werbe-Cookie</li>
              <li>
                keine Einbindung externer Dienste wie Google Fonts, YouTube,
                Google Maps oder Social-Media-Widgets
              </li>
              <li>
                der Freibetrag-Rechner und der Verdienst-Finder laufen
                vollständig im Browser; deine Eingaben verlassen dein Gerät
                nicht
              </li>
            </ul>
            <p className="mt-2">
              Personenbezogene Daten werden nur dort verarbeitet, wo es
              technisch zwingend nötig ist (Server-Logs des Hosters) oder wo
              du uns aktiv kontaktierst.
            </p>
          </section>

          {/* 3. Rechtsgrundlagen */}
          <section>
            <h2 className="mb-2 text-lg font-bold text-navy-900">
              3. Rechtsgrundlagen der Verarbeitung
            </h2>
            <p>
              Wir verarbeiten personenbezogene Daten ausschließlich auf Basis
              der folgenden Rechtsgrundlagen:
            </p>
            <ul className="ml-5 mt-2 list-disc space-y-1">
              <li>
                <strong className="text-navy-900">
                  Art. 6 Abs. 1 lit. f DSGVO
                </strong>{" "}
                – berechtigtes Interesse am sicheren, stabilen Betrieb der
                Webseite (z. B. Server-Logs, IT-Sicherheit)
              </li>
              <li>
                <strong className="text-navy-900">
                  Art. 6 Abs. 1 lit. b DSGVO
                </strong>{" "}
                – Anbahnung oder Erfüllung vertraglicher Anliegen, falls du uns
                geschäftlich kontaktierst
              </li>
              <li>
                <strong className="text-navy-900">
                  Art. 6 Abs. 1 lit. a DSGVO
                </strong>{" "}
                – deine Einwilligung, falls du uns z. B. per E-Mail freiwillig
                Informationen schickst
              </li>
              <li>
                <strong className="text-navy-900">§ 25 Abs. 2 Nr. 2 TDDDG</strong>{" "}
                – Speichern von Informationen auf deinem Endgerät, soweit
                technisch unbedingt erforderlich (z. B. technische
                Sitzungs-Cookies)
              </li>
            </ul>
          </section>

          {/* 4. Hosting bei Vercel (Server-Logs, Drittland) */}
          <section>
            <h2 className="mb-2 text-lg font-bold text-navy-900">
              4. Hosting und Server-Logs (Vercel)
            </h2>
            <p>
              Diese Webseite wird gehostet bei{" "}
              <strong className="text-navy-900">Vercel Inc.</strong>, 340 Pine
              Street, Suite 500, San Francisco, CA 94104, USA („Vercel"). Beim
              Aufruf jeder Seite werden – wie bei jeder Webseite üblich –
              technische Verbindungsdaten in Server-Logs erfasst. Im Einzelnen
              sind das:
            </p>
            <ul className="ml-5 mt-2 list-disc space-y-1">
              <li>IP-Adresse des anfragenden Geräts (gekürzt, soweit möglich)</li>
              <li>Datum und Uhrzeit des Zugriffs</li>
              <li>Name und URL der abgerufenen Datei</li>
              <li>Referrer-URL (zuvor besuchte Seite)</li>
              <li>verwendeter Browser und Betriebssystem</li>
              <li>HTTP-Statuscode und übertragene Datenmenge</li>
            </ul>
            <p className="mt-2">
              <strong className="text-navy-900">Zweck:</strong> Auslieferung
              der Inhalte, Gewährleistung der IT-Sicherheit, Abwehr von
              Angriffen und Missbrauch.
              <br />
              <strong className="text-navy-900">Rechtsgrundlage:</strong> Art.
              6 Abs. 1 lit. f DSGVO (berechtigtes Interesse am stabilen,
              sicheren Betrieb).
              <br />
              <strong className="text-navy-900">Speicherdauer:</strong> Die
              Logs werden in der Regel nach maximal 30 Tagen automatisch
              gelöscht.
            </p>
            <p className="mt-2">
              <strong className="text-navy-900">
                Hinweis zur Drittlandübermittlung (USA):
              </strong>{" "}
              Vercel ist ein US-Anbieter, eine Datenübermittlung in die USA
              ist daher nicht ausgeschlossen. Vercel Inc. ist unter dem
              EU-U.S. Data Privacy Framework (Angemessenheitsbeschluss der
              EU-Kommission vom 10.07.2023) zertifiziert. Ergänzend hat
              Vercel EU-Standardvertragsklauseln nach Art. 46 Abs. 2 lit. c
              DSGVO mit zusätzlichen technischen und organisatorischen
              Garantien abgeschlossen. Weitere Informationen findest du in
              der{" "}
              <a
                href="https://vercel.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-700 hover:underline"
              >
                Datenschutzerklärung von Vercel
              </a>
              .
            </p>
          </section>

          {/* 5. Cookies */}
          <section>
            <h2 className="mb-2 text-lg font-bold text-navy-900">5. Cookies</h2>
            <p>
              Wir setzen{" "}
              <strong className="text-navy-900">
                aktuell keine Analyse-, Marketing- oder Tracking-Cookies
              </strong>
              . Es können ausschließlich technisch notwendige Cookies oder
              vergleichbare Speichertechniken verwendet werden, die für den
              Betrieb der Webseite zwingend erforderlich sind (z. B. zum
              Erhalt einer sicheren Verbindung). Eine Einwilligung ist hierfür
              nach <strong>§ 25 Abs. 2 Nr. 2 TDDDG</strong> nicht
              erforderlich.
            </p>
            <p className="mt-2">
              Sollten in Zukunft optionale Cookies (z. B. für
              reichweitenmessende Statistik oder externe Inhalte) hinzukommen,
              werden diese ausschließlich nach deiner aktiven Einwilligung
              über einen Cookie-Banner gesetzt. Diese Datenschutzerklärung
              wird in dem Fall entsprechend ergänzt.
            </p>
          </section>

          {/* 6. Schriftarten und CDN */}
          <section>
            <h2 className="mb-2 text-lg font-bold text-navy-900">
              6. Schriftarten (selbst gehostet)
            </h2>
            <p>
              Wir verwenden die Schriftart „Inter" über das Next.js-Modul
              <code className="mx-1 rounded bg-navy-50 px-1 py-0.5 text-xs">
                next/font/google
              </code>
              . Die Schriftdateien werden zur Build-Zeit heruntergeladen und{" "}
              <strong className="text-navy-900">
                vom selben Server wie die Webseite ausgeliefert
              </strong>
              . Es findet beim Seitenaufruf{" "}
              <strong className="text-navy-900">keine Verbindung</strong> zu
              Google-Servern oder anderen Drittanbietern statt. Eine
              IP-Übertragung an Google entfällt damit.
            </p>
          </section>

          {/* 7. Kontaktaufnahme per E-Mail */}
          <section>
            <h2 className="mb-2 text-lg font-bold text-navy-900">
              7. Kontaktaufnahme per E-Mail
            </h2>
            <p>
              Auf WasNun.jetzt gibt es{" "}
              <strong className="text-navy-900">
                kein Kontaktformular, keinen Newsletter und keinen
                Plan-Versand per E-Mail
              </strong>
              . Du musst nichts eingeben und keine Daten hinterlassen, um das
              Angebot zu nutzen.
            </p>
            <p className="mt-2">
              Wenn du uns direkt eine E-Mail an die im Impressum genannte
              Adresse schreibst, verarbeiten wir die in deiner Nachricht
              enthaltenen Daten (insbesondere E-Mail-Adresse, Name, Anliegen)
              ausschließlich zur Beantwortung deiner Anfrage.
            </p>
            <p className="mt-2">
              <strong className="text-navy-900">Rechtsgrundlage:</strong> Art.
              6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der
              Beantwortung von Anfragen) bzw. Art. 6 Abs. 1 lit. b DSGVO bei
              vertraglichen Anliegen.
              <br />
              <strong className="text-navy-900">Speicherdauer:</strong> Wir
              löschen deine Anfrage, sobald sie abschließend bearbeitet ist
              und keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
            </p>
          </section>

          {/* 8. Externe Links und Affiliate */}
          <section>
            <h2 className="mb-2 text-lg font-bold text-navy-900">
              8. Externe Links und Affiliate-Partner
            </h2>
            <p>
              WasNun.jetzt enthält Links zu externen Webseiten Dritter (z. B.
              Behörden, Bildungsanbieter, Job-Plattformen). Auf den Inhalt
              und die Datenverarbeitung dieser Webseiten haben wir keinen
              Einfluss; es gelten die Datenschutzerklärungen der jeweiligen
              Anbieter.
            </p>
            <p className="mt-2">
              <strong className="text-navy-900">
                Hinweis zu Affiliate-Links:
              </strong>{" "}
              Die technische Infrastruktur für Affiliate-Partnerprogramme ist
              vorbereitet,{" "}
              <strong className="text-navy-900">
                aktuell sind jedoch keine Affiliate-Partner aktiv geschaltet
              </strong>
              . Sobald wir mit Partnern zusammenarbeiten, werden die
              entsprechenden Links sichtbar als „Werbung" gekennzeichnet und
              mit den Attributen{" "}
              <code className="rounded bg-navy-50 px-1 py-0.5 text-xs">
                rel="sponsored noopener noreferrer"
              </code>{" "}
              versehen. Wenn du dich über einen solchen Link bei einem
              Anbieter registrierst oder etwas abschließt, erhalten wir ggf.
              eine Provision. Für dich entstehen dadurch{" "}
              <strong className="text-navy-900">keine Mehrkosten</strong>.
              Unsere rechtlichen Informationen, Berechnungen und
              Empfehlungen werden von Provisionen nicht beeinflusst (§ 6
              TMG).
            </p>
            <p className="mt-2">
              Bei einem Klick auf einen externen Link wird deine IP-Adresse
              automatisch an den Zielanbieter übertragen. Diese Verarbeitung
              liegt in der Verantwortung des jeweiligen Anbieters.
            </p>
          </section>

          {/* 9. Deine Rechte */}
          <section>
            <h2 className="mb-2 text-lg font-bold text-navy-900">
              9. Deine Rechte als betroffene Person
            </h2>
            <p>
              Dir stehen nach DSGVO folgende Rechte zu, die du jederzeit uns
              gegenüber geltend machen kannst:
            </p>
            <ul className="ml-5 mt-2 list-disc space-y-1">
              <li>
                <strong className="text-navy-900">
                  Auskunftsrecht (Art. 15 DSGVO)
                </strong>{" "}
                – Auskunft darüber, welche Daten wir über dich verarbeiten
              </li>
              <li>
                <strong className="text-navy-900">
                  Recht auf Berichtigung (Art. 16 DSGVO)
                </strong>{" "}
                – Korrektur unrichtiger Daten
              </li>
              <li>
                <strong className="text-navy-900">
                  Recht auf Löschung (Art. 17 DSGVO)
                </strong>{" "}
                – „Recht auf Vergessenwerden"
              </li>
              <li>
                <strong className="text-navy-900">
                  Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)
                </strong>
              </li>
              <li>
                <strong className="text-navy-900">
                  Recht auf Datenübertragbarkeit (Art. 20 DSGVO)
                </strong>
              </li>
              <li>
                <strong className="text-navy-900">
                  Widerspruchsrecht (Art. 21 DSGVO)
                </strong>{" "}
                – gegen Verarbeitungen auf Grundlage berechtigter Interessen
              </li>
              <li>
                <strong className="text-navy-900">
                  Recht auf Widerruf von Einwilligungen (Art. 7 Abs. 3 DSGVO)
                </strong>{" "}
                – mit Wirkung für die Zukunft
              </li>
            </ul>
            <p className="mt-2">
              Zur Geltendmachung genügt eine formlose E-Mail an{" "}
              <a
                href={`mailto:${IMPRESSUM.mail}`}
                className="text-teal-700 hover:underline"
              >
                {IMPRESSUM.mail}
              </a>
              .
            </p>
          </section>

          {/* 10. Beschwerderecht */}
          <section>
            <h2 className="mb-2 text-lg font-bold text-navy-900">
              10. Beschwerderecht bei der Aufsichtsbehörde
            </h2>
            <p>
              Du hast nach Art. 77 DSGVO das Recht, dich bei einer
              Datenschutz-Aufsichtsbehörde zu beschweren. Für uns zuständig
              ist:
            </p>
            <p className="mt-2">
              <strong className="text-navy-900">
                Der Landesbeauftragte für den Datenschutz und die
                Informationsfreiheit Baden-Württemberg (LfDI)
              </strong>
              <br />
              Lautenschlagerstraße 20
              <br />
              70173 Stuttgart
              <br />
              Telefon: 0711 / 615541-0
              <br />
              E-Mail:{" "}
              <a
                href="mailto:poststelle@lfdi.bwl.de"
                className="text-teal-700 hover:underline"
              >
                poststelle@lfdi.bwl.de
              </a>
              <br />
              Web:{" "}
              <a
                href="https://www.baden-wuerttemberg.datenschutz.de"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-700 hover:underline"
              >
                baden-wuerttemberg.datenschutz.de
              </a>
            </p>
          </section>

          {/* 11. Datensicherheit */}
          <section>
            <h2 className="mb-2 text-lg font-bold text-navy-900">
              11. Datensicherheit
            </h2>
            <p>
              Die Übertragung der Webseite erfolgt durchgängig
              TLS-verschlüsselt (HTTPS). Wir setzen technische und
              organisatorische Maßnahmen ein, um deine Daten gegen
              Manipulation, Verlust und unberechtigten Zugriff zu schützen.
              Diese Maßnahmen werden laufend an den Stand der Technik
              angepasst.
            </p>
          </section>

          {/* 12. Aktualität und Änderungen */}
          <section>
            <h2 className="mb-2 text-lg font-bold text-navy-900">
              12. Aktualität und Änderungen dieser Erklärung
            </h2>
            <p>
              Diese Datenschutzerklärung hat den Stand{" "}
              <strong className="text-navy-900">Mai 2026</strong>. Durch die
              Weiterentwicklung unseres Angebots oder geänderte gesetzliche
              Vorgaben kann es nötig werden, diese Erklärung anzupassen. Die
              jeweils aktuelle Version ist immer unter{" "}
              <Link
                href="/datenschutz"
                className="text-teal-700 hover:underline"
              >
                /datenschutz
              </Link>{" "}
              abrufbar.
            </p>
          </section>

          <p className="border-t border-navy-100 pt-4 text-xs text-navy-400">
            Bei Fragen zum Datenschutz wende dich an{" "}
            <a
              href={`mailto:${IMPRESSUM.mail}`}
              className="text-teal-700 hover:underline"
            >
              {IMPRESSUM.mail}
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
