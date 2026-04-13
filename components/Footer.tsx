import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-schwarz text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-10 pb-10 border-b border-white/10">
          <div>
            <div className="font-condensed font-black uppercase text-3xl mb-2">
              Was<span className="text-rot">Nun</span>.jetzt
            </div>
            <p className="text-white/40 text-sm max-w-xs leading-relaxed">
              Kostenloser Sofort-Helfer für arbeitslose Menschen in Deutschland. Ohne Anmeldung, ohne Kosten.
            </p>
          </div>
          <div className="flex gap-10">
            <div>
              <div className="text-xs font-black uppercase tracking-widest text-white/30 mb-3">Rechtliches</div>
              <div className="flex flex-col gap-2">
                <Link href="/impressum"   className="text-sm text-white/60 hover:text-rot transition-colors font-bold">Impressum</Link>
                <Link href="/datenschutz" className="text-sm text-white/60 hover:text-rot transition-colors font-bold">Datenschutz</Link>
                <a href="mailto:office@doylim.com" className="text-sm text-white/60 hover:text-rot transition-colors font-bold">Kontakt</a>
              </div>
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-widest text-white/30 mb-3">Tools</div>
              <div className="flex flex-col gap-2">
                <a href="#rechner" className="text-sm text-white/60 hover:text-rot transition-colors font-bold">Freibetrag-Rechner</a>
                <a href="#skills"  className="text-sm text-white/60 hover:text-rot transition-colors font-bold">Skills-Check</a>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-white/30 text-xs">
          <span>© 2026 WasNun.jetzt · Norbert Sommer · Heidelberg</span>
          <span>SGB II/III · Minijob-Grenze 603 €/Monat · Stand Januar 2026 · Ohne Gewähr</span>
        </div>
      </div>
    </footer>
  )
}
