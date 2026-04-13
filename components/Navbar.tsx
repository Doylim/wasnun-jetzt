'use client'

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-6 md:px-12 py-5 relative z-10 max-w-6xl mx-auto w-full">
      <div className="font-serif text-2xl text-white tracking-tight">
        Was<span className="text-teal-light">Nun</span>.jetzt
      </div>
      <div className="text-xs font-medium px-4 py-2 rounded-full border border-teal/40 text-teal-light bg-teal/10 hidden sm:block">
        🔒 Kostenlos & ohne Anmeldung
      </div>
    </nav>
  )
}
