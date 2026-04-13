'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [offen, setOffen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="font-condensed text-2xl font-black tracking-tight uppercase">
          Was<span className="text-rot">Nun</span>.jetzt
        </Link>
        <div className="hidden sm:flex items-center gap-6">
          <a href="#rechner" className="text-sm font-bold uppercase tracking-wider text-grau-mid hover:text-schwarz transition-colors">Rechner</a>
          <a href="#skills" className="text-sm font-bold uppercase tracking-wider text-grau-mid hover:text-schwarz transition-colors">Skills-Check</a>
          <a href="#rechner" className="bg-rot hover:bg-rot-dunkel text-white text-sm font-black uppercase tracking-wider px-6 py-3 rounded-full transition-all">
            Jetzt starten →
          </a>
        </div>
        {/* Mobile Menu Button */}
        <button onClick={() => setOffen(!offen)} className="sm:hidden flex flex-col gap-1.5 p-2">
          <span className={`w-6 h-0.5 bg-schwarz transition-all ${offen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`w-6 h-0.5 bg-schwarz transition-all ${offen ? 'opacity-0' : ''}`} />
          <span className={`w-6 h-0.5 bg-schwarz transition-all ${offen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>
      {/* Mobile Menu */}
      {offen && (
        <div className="sm:hidden bg-white border-t border-gray-100 px-6 py-6 flex flex-col gap-4">
          <a href="#rechner" onClick={() => setOffen(false)} className="text-lg font-black uppercase tracking-wider">Rechner</a>
          <a href="#skills" onClick={() => setOffen(false)} className="text-lg font-black uppercase tracking-wider">Skills-Check</a>
          <a href="#rechner" onClick={() => setOffen(false)} className="bg-rot text-white text-center font-black uppercase tracking-wider px-6 py-4 rounded-full">
            Jetzt starten →
          </a>
        </div>
      )}
    </nav>
  )
}
