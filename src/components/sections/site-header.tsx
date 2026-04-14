"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [offen, setOffen] = useState(false);

  const links = [
    { href: "#rechner", label: "Rechner" },
    { href: "#entscheiden", label: "Verdienst-Finder" },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-navy-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy-800 text-white">
            <Calculator className="h-5 w-5 text-teal-400" aria-hidden="true" />
          </div>
          <span className="text-lg tracking-tight text-navy-900">
            WasNun<span className="text-teal-500">.jetzt</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Hauptnavigation">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-semibold text-navy-600 transition-colors hover:text-teal-600"
            >
              {l.label}
            </a>
          ))}
          <Button variant="primary" size="sm" asChild>
            <a href="#rechner">In 60 Sek. rechnen</a>
          </Button>
        </nav>

        <button
          className="md:hidden"
          onClick={() => setOffen(!offen)}
          aria-label={offen ? "Menü schließen" : "Menü öffnen"}
          aria-expanded={offen}
        >
          {offen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-navy-100 bg-white transition-all md:hidden",
          offen ? "max-h-96" : "max-h-0",
        )}
      >
        <div className="flex flex-col gap-1 p-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOffen(false)}
              className="rounded-lg px-4 py-3 text-base font-semibold text-navy-800 hover:bg-navy-50"
            >
              {l.label}
            </a>
          ))}
          <Button variant="primary" className="mt-2" asChild>
            <a href="#rechner" onClick={() => setOffen(false)}>
              In 60 Sek. rechnen
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
