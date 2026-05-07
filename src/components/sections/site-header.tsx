"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [offen, setOffen] = useState(false);

  const links = [
    { href: "/#rechner", label: "Dein Plan" },
    { href: "/#faq", label: "FAQ" },
    { href: "/buergergeld", label: "Bürgergeld" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-navy-100 bg-white/90 backdrop-blur-md">
      {/* Feste Hoehe – mobile h-16 (64px), desktop h-20 (80px). Wichtig:
          niemals padding-basiert, weil sonst der Header zwischen Viewports
          driftet und das Anker-Sprung-Pattern (scroll-padding-top) bricht. */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:h-20 md:px-6">
        <Link href="/" className="flex h-11 items-center gap-2 font-bold">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy-800 text-white">
            <Calculator className="h-5 w-5 text-teal-400" aria-hidden="true" />
          </div>
          <span className="text-lg tracking-tight text-navy-900">
            WasNun<span className="text-teal-700">.jetzt</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Hauptnavigation">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-semibold text-navy-600 transition-colors hover:text-teal-600"
            >
              {l.label}
            </Link>
          ))}
          <Button variant="primary" size="sm" asChild>
            <a href="/#rechner">In 60 Sek. rechnen</a>
          </Button>
        </nav>

        <button
          className="-mr-2 flex h-11 w-11 items-center justify-center rounded-lg text-navy-800 hover:bg-navy-50 md:hidden"
          onClick={() => setOffen(!offen)}
          aria-label={offen ? "Menü schließen" : "Menü öffnen"}
          aria-expanded={offen}
        >
          {offen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile-Menue als absolutes Overlay UNTER dem Header.
          Verhindert, dass der Sticky-Header beim Auf-/Zuklappen seine Hoehe
          aendert und Anker-Spruenge dadurch auf falsche Positionen springen. */}
      {offen ? (
        <div
          className={cn(
            "absolute inset-x-0 top-full border-t border-navy-100 bg-white shadow-lg shadow-navy-900/5 md:hidden",
          )}
        >
          <div className="flex flex-col gap-1 p-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOffen(false)}
                className="rounded-lg px-4 py-3 text-base font-semibold text-navy-800 hover:bg-navy-50"
              >
                {l.label}
              </Link>
            ))}
            <Button variant="primary" className="mt-2" asChild>
              <a href="/#rechner" onClick={() => setOffen(false)}>
                In 60 Sek. rechnen
              </a>
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
