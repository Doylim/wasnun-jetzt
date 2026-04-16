import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Plan unterwegs",
  description:
    "Dein persönlicher ALG-I-Plan wurde per E-Mail versendet. Bitte prüfe auch den Spam-Ordner.",
  robots: { index: false, follow: false },
};

export default function DankePlanVersendetPage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-navy-50/40 px-4 py-20">
      <div className="mx-auto max-w-lg rounded-3xl border border-navy-100 bg-white p-8 text-center shadow-lg md:p-12">
        <CheckCircle
          className="mx-auto h-16 w-16 text-teal-500"
          aria-hidden="true"
        />
        <h1 className="mt-6 text-3xl font-black text-navy-900 md:text-4xl">
          Dein Plan ist unterwegs
        </h1>
        <p className="mt-4 text-navy-600">
          Wir haben deinen persönlichen Plan soeben an dein Postfach geschickt.
          Falls er nicht in den nächsten Minuten ankommt, schau bitte auch im
          Spam-Ordner nach.
        </p>
        <div className="mt-8">
          <Button variant="outline" size="lg" asChild>
            <Link href="/">Zurück zur Startseite</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
