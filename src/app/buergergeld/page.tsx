import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Bürgergeld – kommt bald",
  robots: { index: false, follow: true },
};

export default function BuergergeldPage() {
  return (
    <main className="min-h-screen bg-navy-50/40 py-20">
      <div className="mx-auto max-w-2xl px-4 md:px-6">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-teal-600 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Zurück zur Startseite
        </Link>

        <Badge variant="amber" className="mb-4">
          <Clock className="mr-1 h-3 w-3" aria-hidden="true" />
          In Arbeit
        </Badge>

        <h1 className="mb-4 text-4xl font-black text-navy-900 md:text-5xl">
          Bürgergeld – kommt bald
        </h1>

        <p className="mb-6 text-lg leading-relaxed text-navy-700">
          Wir bauen gerade einen eigenen Journey speziell für Bürgergeld-
          Bezieher. Die Regeln sind ganz anders als bei ALG I:
        </p>

        <ul className="mb-8 space-y-3 text-navy-600">
          <li>
            <strong className="text-navy-900">Gestaffelter Freibetrag</strong>{" "}
            nach § 11b SGB II: 0–100 EUR komplett frei, 100–520 EUR zu 20 %
            frei, 520–1.000 EUR zu 30 % frei
          </li>
          <li>
            <strong className="text-navy-900">Keine Stundengrenze</strong> – du
            darfst so viel arbeiten, wie du willst
          </li>
          <li>
            <strong className="text-navy-900">Andere Pauschalen-Wirkung</strong>{" "}
            und andere passende Plattformen
          </li>
        </ul>

        <p className="mb-8 text-navy-600">
          Bis dahin: Auf der Startseite zeigen wir den ALG-I-Journey mit allen
          Pauschalen-Tricks.
        </p>

        <Button variant="primary" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Zum ALG-I-Journey
          </Link>
        </Button>
      </div>
    </main>
  );
}
