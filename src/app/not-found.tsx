import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-navy-50 px-4">
      <div className="max-w-md text-center">
        <div className="mb-4 text-7xl font-black text-teal-500">404</div>
        <h1 className="mb-3 text-3xl font-black text-navy-900">
          Seite nicht gefunden
        </h1>
        <p className="mb-8 text-navy-600">
          Diese Seite existiert nicht (mehr). Vielleicht hilft dir unser
          Freibetrag-Rechner auf der Startseite weiter.
        </p>
        <Button variant="primary" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Zur Startseite
          </Link>
        </Button>
      </div>
    </main>
  );
}
