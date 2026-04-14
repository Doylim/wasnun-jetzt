import Script from "next/script";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqSchema, type FaqItem } from "@/lib/structured-data";

const FAQ: FaqItem[] = [
  {
    frage: "Wie viel darf ich als ALG-I-Empfänger wirklich dazuverdienen ohne Abzug?",
    antwort:
      "Der pauschale Freibetrag liegt bei 165 EUR pro Monat (§ 155 SGB III). Zusätzlich kannst du die Übungsleiterpauschale (275 EUR) und die Ehrenamtspauschale (80 EUR) kombinieren – macht maximal 520 EUR komplett anrechnungsfrei pro Monat. Mieteinnahmen und Kapitalerträge werden bei ALG I gar nicht angerechnet.",
  },
  {
    frage: "Warum zeigen andere Seiten 603 EUR? Stimmt das nicht?",
    antwort:
      "603 EUR ist die allgemeine Minijob-Grenze 2026. Sie gilt aber nicht als Freibetrag beim ALG I. Wer mehr als 165 EUR verdient, bekommt alles darüber 1:1 vom ALG I abgezogen. Erst die Kombination mit Übungsleiter- und Ehrenamtspauschale bringt wirklich mehr Geld in die Tasche.",
  },
  {
    frage: "Was passiert wenn ich über 15 Stunden pro Woche arbeite?",
    antwort:
      "Dann verlierst du den ALG-I-Anspruch komplett – egal wie viel du verdienst. Die 15-Stunden-Grenze ist wichtiger als jede Freibetrag-Regel. Halte dich strikt unter 14 Std. 59 Min. pro Woche. Meldepflicht: Nebentätigkeit spätestens am ersten Arbeitstag bei der Agentur anzeigen.",
  },
  {
    frage: "Was ist die Übungsleiterpauschale und wer bekommt sie?",
    antwort:
      "Die Übungsleiterpauschale nach § 3 Nr. 26 EStG erlaubt 275 EUR pro Monat (3.300 EUR pro Jahr) steuerfrei zu verdienen. Voraussetzung: Tätigkeit als Trainer, Chorleiter, Betreuer oder Ausbilder bei einem gemeinnützigen Verein oder einer öffentlichen Einrichtung. Sie wird bei ALG I komplett nicht angerechnet – zusätzlich zum Grundfreibetrag.",
  },
  {
    frage: "Kann ich Übungsleiter- und Ehrenamtspauschale gleichzeitig nutzen?",
    antwort:
      "Ja, für verschiedene Tätigkeiten. Bist du gleichzeitig Trainer (275 EUR Übungsleiterpauschale) UND Kassenwart (80 EUR Ehrenamtspauschale) bei demselben Verein, kannst du beide kombinieren – zusammen mit dem Grundfreibetrag kommst du auf 520 EUR im Monat komplett anrechnungsfrei.",
  },
  {
    frage: "Ich habe keine Trainer-Lizenz. Wie bekomme ich trotzdem die Übungsleiterpauschale?",
    antwort:
      "Über den Bildungsgutschein (§ 81 SGB III) der Agentur für Arbeit. Er finanziert AZAV-zertifizierte Weiterbildungen zu 100 %. Die C-Trainer-Lizenz Breitensport ist in 16 Wochen online zu schaffen. Einfach beim nächsten Beratungsgespräch aktiv nachfragen.",
  },
  {
    frage: "Werden Mieteinnahmen auf mein ALG I angerechnet?",
    antwort:
      "Nein. Beim ALG I werden nur Erwerbseinkommen angerechnet – Mieteinnahmen und Kapitalerträge (Zinsen, Dividenden) fallen nicht darunter. Du kannst also unbegrenzt aus Vermietung und Geldanlagen dazuverdienen ohne dein ALG I zu verlieren. Wichtig: Beim Bürgergeld gelten andere Regeln.",
  },
  {
    frage: "Muss ich meinen Nebenjob bei der Agentur melden?",
    antwort:
      "Ja, unbedingt. Jede Nebentätigkeit muss spätestens am ersten Arbeitstag bei der Agentur für Arbeit gemeldet werden. Verspätete Meldung führt zu Rückforderungen. Meldung über arbeitsagentur.de oder per Telefon: 0800 4 5555 00.",
  },
  {
    frage: "Sind die Angaben auf WasNun.jetzt rechtsverbindlich?",
    antwort:
      "Nein. WasNun.jetzt ist ein kostenloses Informationsangebot ohne Rechtsberatung. Alle Inhalte sind sorgfältig recherchiert und basieren auf dem aktuellen SGB III und EStG, aber Gesetze können sich ändern und individuelle Fälle sind unterschiedlich. Prüfe wichtige Entscheidungen immer mit deiner Agentur für Arbeit (0800 4 5555 00).",
  },
];

export function Faq() {
  return (
    <section
      id="faq"
      className="scroll-mt-24 border-t border-navy-100 bg-navy-50 py-20 md:py-28"
    >
      <Script
        id="ld-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema(FAQ)),
        }}
      />
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <div className="mb-10 text-center">
          <Badge variant="teal" className="mb-4">
            Häufige Fragen
          </Badge>
          <h2 className="mb-4 text-balance text-3xl font-black text-navy-900 md:text-5xl">
            Die wichtigsten Fragen zum Hinzuverdienst
          </h2>
          <p className="text-balance text-navy-600">
            Alle Angaben basieren auf SGB III und EStG, Stand{" "}
            <strong>April 2026</strong>.
          </p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm md:p-10">
          <Accordion type="single" collapsible className="w-full">
            {FAQ.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{item.frage}</AccordionTrigger>
                <AccordionContent>{item.antwort}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
