import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-schwarz text-white/40 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="font-display text-xl font-bold text-white">
          Was<span className="text-rot">Nun</span>.jetzt
        </div>
        <div className="text-xs text-center leading-relaxed">
          Kostenloses Informationsangebot · Kein Ersatz für Rechtsberatung · Alle Angaben ohne Gewähr<br />
          Stand: Januar 2026 · SGB II / SGB III · Minijob-Grenze: 603 €/Monat
        </div>
        <div className="flex gap-5 text-xs">
          <Link href="/impressum"   className="hover:text-rot transition-colors">Impressum</Link>
          <Link href="/datenschutz" className="hover:text-rot transition-colors">Datenschutz</Link>
          <a href="mailto:office@doylim.com" className="hover:text-rot transition-colors">Kontakt</a>
        </div>
      </div>
    </footer>
  )
}
