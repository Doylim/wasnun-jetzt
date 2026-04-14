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
    frage: "Was darf ich als ALG-I-Empfänger dazuverdienen, ohne dass mein ALG I gekürzt wird?",
    antwort:
      "Beim ALG I hast du einen monatlichen Freibetrag von 165 EUR (§ 155 SGB III). Bis zu diesem Betrag darfst du dazuverdienen, ohne dass dein ALG I gekürzt wird. Wichtig: Du darfst maximal 14 Stunden 59 Minuten pro Woche arbeiten, sonst verlierst du den ALG-I-Anspruch komplett.",
  },
  {
    frage: "Was ist der Unterschied zwischen ALG I und Bürgergeld beim Hinzuverdienst?",
    antwort:
      "Beim ALG I gilt ein fester Freibetrag von 165 EUR plus die 15-Stunden-Grenze. Beim Bürgergeld gibt es einen gestaffelten Freibetrag (0–100 EUR = 100 % frei, 100–520 EUR = 20 % frei, 520–1.000 EUR = 30 % frei) und KEINE Stundengrenze. Beim Bürgergeld kannst du also beliebig viel arbeiten, nur das Einkommen wird angerechnet.",
  },
  {
    frage: "Was bringt die Übungsleiterpauschale?",
    antwort:
      "Bis zu 275 EUR pro Monat (3.300 EUR/Jahr) sind komplett steuerfrei und werden bei ALG I und Bürgergeld NICHT angerechnet. Voraussetzung: Tätigkeit als Trainer, Chorleiter, Betreuer oder Ausbilder bei einem gemeinnützigen Verein oder einer öffentlichen Einrichtung. Gesetzliche Grundlage: § 3 Nr. 26 EStG.",
  },
  {
    frage: "Kann ich Übungsleiter- und Ehrenamtspauschale gleichzeitig nutzen?",
    antwort:
      "Ja, für verschiedene Tätigkeiten. Bist du z.B. gleichzeitig Trainer (Übungsleiterpauschale 275 EUR/Monat) UND Kassenwart (Ehrenamtspauschale 80 EUR/Monat) bei demselben Verein, kannst du beide kombinieren – insgesamt bis zu 4.260 EUR im Jahr steuerfrei.",
  },
  {
    frage: "Muss ich meinen Nebenjob bei der Agentur melden?",
    antwort:
      "Ja, unbedingt. Jede Nebentätigkeit muss spätestens am ersten Arbeitstag bei der Agentur für Arbeit gemeldet werden. Verspätete Meldung führt zu Rückforderungen und im schlimmsten Fall zu einem Sperrzeitbescheid. Meldung über arbeitsagentur.de oder per Telefon: 0800 4 5555 00.",
  },
  {
    frage: "Was ist der Bildungsgutschein und wer bekommt ihn?",
    antwort:
      "Der Bildungsgutschein (§ 81 SGB III) ist eine Förderung der Agentur für Arbeit für berufliche Weiterbildungen. Er deckt Lehrgangs- und Prüfungskosten zu 100 %. Arbeitslose und von Arbeitslosigkeit Bedrohte haben oft Anspruch – der Kurs muss nur AZAV-zertifiziert sein. Einfach im nächsten Beratungsgespräch aktiv nachfragen.",
  },
  {
    frage: "Wie hoch ist die Minijob-Grenze 2026?",
    antwort:
      "Die Minijob-Grenze liegt ab Januar 2026 bei 603 EUR pro Monat. Sie ist an den Mindestlohn (13,90 EUR/Std.) gekoppelt und steigt automatisch mit diesem. Bei ALG I gilt aber trotzdem der Freibetrag von 165 EUR sowie die 15-Stunden-Grenze.",
  },
  {
    frage: "Sind die Angaben auf WasNun.jetzt rechtsverbindlich?",
    antwort:
      "Nein. WasNun.jetzt ist ein kostenloses Informationsangebot ohne Rechtsberatung. Alle Inhalte sind sorgfältig recherchiert und basieren auf dem aktuellen SGB II/III, aber Gesetze können sich ändern und individuelle Fälle sind unterschiedlich. Prüfe wichtige Entscheidungen immer mit deiner Agentur für Arbeit (0800 4 5555 00) oder deinem Jobcenter.",
  },
];

export function Faq() {
  return (
    <section
      id="faq"
      className="border-t border-navy-100 bg-navy-50 py-20 md:py-28"
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
            Alle Angaben basieren auf SGB II / SGB III, Stand {" "}
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
