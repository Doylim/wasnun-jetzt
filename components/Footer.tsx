import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-navy text-white/40 text-center py-10 px-6 text-xs leading-relaxed">
      <div className="font-serif text-lg text-white/75 mb-2">WasNun.jetzt</div>
      <p>Kostenloses Informationsangebot · Kein Ersatz für Rechtsberatung · Alle Angaben ohne Gewähr</p>
      <div className="flex gap-5 justify-center mt-4 flex-wrap">
        <Link href="/impressum"    className="hover:text-teal transition-colors">Impressum</Link>
        <Link href="/datenschutz"  className="hover:text-teal transition-colors">Datenschutz</Link>
        <a href="mailto:office@doylim.com" className="hover:text-teal transition-colors">Kontakt</a>
      </div>
      <div className="mt-5 text-white/25 text-[10px]">
        Stand: Januar 2026 · Grundlage: SGB II, SGB III, Mindestlohngesetz · Minijob-Grenze: 603 €/Monat
      </div>
    </footer>
  )
}
