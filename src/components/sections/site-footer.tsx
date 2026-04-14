import Link from "next/link";
import { Calculator } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-navy-100 bg-navy-900 py-16 text-white">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <Link href="/" className="mb-4 flex items-center gap-2 font-bold">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                <Calculator className="h-5 w-5 text-teal-400" />
              </div>
              <span className="text-lg tracking-tight">
                WasNun<span className="text-teal-400">.jetzt</span>
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-navy-300">
              Kostenloser Sofort-Helfer für arbeitslose Menschen in
              Deutschland. Ohne Anmeldung, ohne Kosten.
            </p>
          </div>

          <div>
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-navy-400">
              Tools
            </div>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#rechner" className="text-navy-200 hover:text-teal-400">
                  Freibetrag-Rechner
                </a>
              </li>
              <li>
                <a
                  href="#entscheiden"
                  className="text-navy-200 hover:text-teal-400"
                >
                  Verdienst-Finder
                </a>
              </li>
              <li>
                <a href="#faq" className="text-navy-200 hover:text-teal-400">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-navy-400">
              Rechtliches
            </div>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/impressum" className="text-navy-200 hover:text-teal-400">
                  Impressum
                </Link>
              </li>
              <li>
                <Link href="/datenschutz" className="text-navy-200 hover:text-teal-400">
                  Datenschutz
                </Link>
              </li>
              <li>
                <a
                  href="mailto:office@doylim.com"
                  className="text-navy-200 hover:text-teal-400"
                >
                  Kontakt
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col justify-between gap-3 border-t border-white/10 pt-6 text-xs text-navy-400 sm:flex-row">
          <span>© 2026 WasNun.jetzt · Norbert Sommer · Heidelberg</span>
          <span>SGB II/III · Minijob 603 EUR · Stand April 2026 · Ohne Gewähr</span>
        </div>
      </div>
    </footer>
  );
}
