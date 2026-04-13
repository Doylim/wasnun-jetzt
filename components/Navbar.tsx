'use client'
import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="font-display text-2xl font-bold tracking-tight">
          Was<span className="text-rot">Nun</span>.jetzt
        </Link>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline-block text-xs font-semibold bg-rot-hell text-rot px-3 py-1.5 rounded-full">
            🔒 Kostenlos & anonym
          </span>
          <a
            href="#rechner"
            className="bg-rot hover:bg-rot-dunkel text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all shadow-sm"
          >
            Jetzt starten →
          </a>
        </div>
      </div>
    </nav>
  )
}
