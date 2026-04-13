'use client'
import { useState } from 'react'
import { LEGAL } from '@/lib/data'
import { euro } from '@/lib/calc'

type Tab = 'alg1' | 'bg'

// Passende Plattformen für ~165 € / Monat
const LINKS_165 = [
  { name: 'Clickworker',  url: 'https://www.clickworker.de',      was: 'Mikrojobs online' },
  { name: 'AppJobber',    url: 'https://www.appjobber.de',         was: 'Aufgaben vor Ort' },
  { name: 'Streetspotr',  url: 'https://www.streetspotr.com',      was: 'Fotos & Checks' },
  { name: 'Testbirds',    url: 'https://www.testbirds.com',        was: 'Apps & Websites testen' },
  { name: 'Volkshochschule', url: 'https://www.vhs.de',           was: 'Kursleiter / Ehrenamt' },
]

const LINKS_UEBUNGSLEITER = [
  { name: 'Sportverein in meiner Nähe', url: 'https://www.vereinssuche.de',    was: 'Als Trainer einsteigen' },
  { name: 'C-Trainer Breitensport',     url: 'https://www.academyofsports.de/de/trainer-ausbildung/trainer-c-lizenz-breitensport/', was: 'Lizenz online (16 Wochen)' },
  { name: 'DRK Ehrenamt',              url: 'https://www.drk.de/ehrenamt/',    was: 'Soziales Ehrenamt' },
  { name: 'Freiwilligenagentur',        url: 'https://www.bagfa.de',           was: 'Ehrenamt finden' },
]

export default function Rechner() {
  const [tab, setTab]               = useState<Tab>('alg1')
  const [alg, setAlg]               = useState('')
  const [hatUebungsleiter, setHatUebungsleiter] = useState(false)
  const [hatEhrenamt, setHatEhrenamt]           = useState(false)
  const [bgBetrag, setBgBetrag]     = useState('')
  const [bgNeben, setBgNeben]       = useState('')

  const algNum = parseFloat(alg) || 0

  // ALG I Gesamtrechnung
  const freibetrag  = LEGAL.alg1.freibetrag   // 165 €
  const ueLeiter    = hatUebungsleiter ? LEGAL.pauschalen.uebungsleiter.monat : 0  // 275 €
  const ehrenamt    = hatEhrenamt ? LEGAL.pauschalen.ehrenamt.monat : 0             // 80 €
  const gesamtFrei  = freibetrag + ueLeiter + ehrenamt
  const gesamtEink  = algNum + gesamtFrei

  // Bürgergeld
  const bgNum   = parseFloat(bgBetrag) || 0
  const bgNebNum = parseFloat(bgNeben) || 0
  let bgFrei = 0
  if (bgNebNum <= 100) bgFrei = bgNebNum
  else if (bgNebNum <= 520) bgFrei = 100 + (bgNebNum - 100) * 0.20
  else if (bgNebNum <= 1000) bgFrei = 100 + 84 + (bgNebNum - 520) * 0.30
  else bgFrei = 100 + 84 + 144
  const bgAnrechnung = Math.max(0, bgNebNum - bgFrei)
  const bgNeu        = Math.max(0, bgNum - bgAnrechnung)

  return (
    <section id="rechner" className="py-24 px-6 bg-grau-hell relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-rot" />

      <div className="max-w-7xl mx-auto">
        <div className="reveal mb-12">
          <div className="inline-block bg-rot text-white font-black uppercase tracking-widest text-xs px-4 py-2 mb-6">
            Schritt 01
          </div>
          <h2 className="font-condensed font-black uppercase text-big leading-none">
            Was kannst du<br /><span className="text-rot">verdienen?</span>
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-10 w-fit">
          {(['alg1', 'bg'] as Tab[]).map(id => (
            <button key={id} onClick={() => setTab(id)}
              className={`px-8 py-3 font-black uppercase tracking-wider text-sm rounded-full transition-all border-2 ${
                tab === id ? 'bg-rot border-rot text-white' : 'border-gray-300 text-grau-mid hover:border-schwarz bg-white'
              }`}>
              {id === 'alg1' ? 'ALG I' : 'Bürgergeld'}
            </button>
          ))}
        </div>

        {/* ── ALG I ── */}
        {tab === 'alg1' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Linke Spalte — Eingabe + Erklärung */}
            <div className="space-y-6">

              {/* Eingabe ALG I */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <label className="block text-xs font-black uppercase tracking-widest text-grau-mid mb-3">
                  Mein ALG I pro Monat
                </label>
                <input
                  type="number"
                  placeholder="z.B. 1.200 €"
                  value={alg}
                  onChange={e => setAlg(e.target.value)}
                  className="w-full border-2 border-gray-200 focus:border-rot rounded-xl px-4 py-4 text-2xl font-condensed font-black outline-none transition-colors"
                />
              </div>

              {/* Block 1: Freibetrag */}
              <div className="bg-white rounded-2xl border-2 border-rot overflow-hidden">
                <div className="bg-rot px-6 py-3 flex justify-between items-center">
                  <span className="text-white font-black uppercase tracking-wider text-xs">Freibetrag (immer)</span>
                  <span className="text-white font-condensed font-black text-2xl">+ {freibetrag} €</span>
                </div>
                <div className="p-5">
                  <p className="text-sm text-grau-mid leading-relaxed mb-4">
                    <strong className="text-schwarz">Dieser Betrag ist immer sicher</strong> — egal wie viel du verdienst.
                    Zum Mindestlohn (13,90 €) entspricht das ca. <strong className="text-schwarz">11–12 Stunden im Monat</strong>.
                  </p>
                  <div className="text-xs font-black uppercase tracking-wider text-grau-mid mb-3">Passende Plattformen:</div>
                  <div className="space-y-2">
                    {LINKS_165.map(l => (
                      <a key={l.name} href={l.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 bg-grau-hell rounded-xl hover:bg-rot-hell hover:border-rot border border-transparent transition-all group">
                        <div>
                          <span className="font-black text-sm text-schwarz group-hover:text-rot transition-colors">{l.name}</span>
                          <span className="text-xs text-grau-mid ml-2">— {l.was}</span>
                        </div>
                        <span className="text-rot font-black text-xs">→</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Block 2: Übungsleiterpauschale */}
              <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
                <div className="px-6 py-3 flex justify-between items-center bg-grau-hell">
                  <div>
                    <span className="font-black uppercase tracking-wider text-xs text-schwarz">Übungsleiterpauschale</span>
                    <span className="text-xs text-grau-mid ml-2">§ 3 Nr. 26 EStG</span>
                  </div>
                  <span className="font-condensed font-black text-2xl text-schwarz">+ 275 €</span>
                </div>
                <div className="p-5">
                  <p className="text-sm text-grau-mid leading-relaxed mb-4">
                    Als Trainer, Chorleiter, Betreuer oder Ausbilder bei einem gemeinnützigen Verein.
                    <strong className="text-schwarz"> Komplett anrechnungsfrei — auch bei ALG I!</strong>
                    Kein Cent wird abgezogen.
                  </p>

                  {/* Toggle */}
                  <button
                    onClick={() => setHatUebungsleiter(!hatUebungsleiter)}
                    className={`w-full py-3 px-5 rounded-xl font-black uppercase tracking-wider text-sm transition-all border-2 mb-4 ${
                      hatUebungsleiter
                        ? 'bg-schwarz text-white border-schwarz'
                        : 'border-gray-200 text-grau-mid hover:border-schwarz'
                    }`}>
                    {hatUebungsleiter ? '✓ Ich nutze die Übungsleiterpauschale' : 'Ich nutze diese Pauschale'}
                  </button>

                  <div className="text-xs font-black uppercase tracking-wider text-grau-mid mb-3">Qualifikation & Stellen:</div>
                  <div className="space-y-2">
                    {LINKS_UEBUNGSLEITER.map(l => (
                      <a key={l.name} href={l.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 bg-grau-hell rounded-xl hover:bg-rot-hell border border-transparent hover:border-rot transition-all group">
                        <div>
                          <span className="font-black text-sm text-schwarz group-hover:text-rot transition-colors">{l.name}</span>
                          <span className="text-xs text-grau-mid ml-2">— {l.was}</span>
                        </div>
                        <span className="text-rot font-black text-xs">→</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Block 3: Ehrenamtspauschale */}
              <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
                <div className="px-6 py-3 flex justify-between items-center bg-grau-hell">
                  <div>
                    <span className="font-black uppercase tracking-wider text-xs text-schwarz">Ehrenamtspauschale</span>
                    <span className="text-xs text-grau-mid ml-2">§ 3 Nr. 26a EStG</span>
                  </div>
                  <span className="font-condensed font-black text-2xl text-schwarz">+ 80 €</span>
                </div>
                <div className="p-5">
                  <p className="text-sm text-grau-mid leading-relaxed mb-4">
                    Als Vereinsvorstand, Kassenwart oder für andere organisatorische Aufgaben.
                    <strong className="text-schwarz"> 960 €/Jahr — steuerfrei.</strong>
                    Kombinierbar mit der Übungsleiterpauschale!
                  </p>
                  <button
                    onClick={() => setHatEhrenamt(!hatEhrenamt)}
                    className={`w-full py-3 px-5 rounded-xl font-black uppercase tracking-wider text-sm transition-all border-2 ${
                      hatEhrenamt
                        ? 'bg-schwarz text-white border-schwarz'
                        : 'border-gray-200 text-grau-mid hover:border-schwarz'
                    }`}>
                    {hatEhrenamt ? '✓ Ich nutze die Ehrenamtspauschale' : 'Ich nutze diese Pauschale'}
                  </button>
                </div>
              </div>
            </div>

            {/* Rechte Spalte — Ergebnis */}
            <div className="lg:sticky lg:top-28 h-fit space-y-4">

              {/* Gesamt-Box */}
              <div className="bg-schwarz text-white rounded-3xl p-8">
                <div className="text-white/40 text-xs font-black uppercase tracking-widest mb-6">Deine Gesamtübersicht</div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center py-3 border-b border-white/10">
                    <span className="text-white/60 text-sm">Dein ALG I</span>
                    <span className="font-condensed font-black text-2xl">{algNum > 0 ? euro(algNum) : '—'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-white/10">
                    <div>
                      <span className="text-white/60 text-sm">Freibetrag Nebenjob</span>
                      <span className="text-white/30 text-xs ml-2">§ 155 SGB III</span>
                    </div>
                    <span className="font-condensed font-black text-2xl text-rot">+ {freibetrag} €</span>
                  </div>
                  {hatUebungsleiter && (
                    <div className="flex justify-between items-center py-3 border-b border-white/10">
                      <div>
                        <span className="text-white/60 text-sm">Übungsleiterpauschale</span>
                        <span className="text-white/30 text-xs ml-2">§ 3 Nr. 26</span>
                      </div>
                      <span className="font-condensed font-black text-2xl text-rot">+ {LEGAL.pauschalen.uebungsleiter.monat} €</span>
                    </div>
                  )}
                  {hatEhrenamt && (
                    <div className="flex justify-between items-center py-3 border-b border-white/10">
                      <div>
                        <span className="text-white/60 text-sm">Ehrenamtspauschale</span>
                        <span className="text-white/30 text-xs ml-2">§ 3 Nr. 26a</span>
                      </div>
                      <span className="font-condensed font-black text-2xl text-rot">+ {LEGAL.pauschalen.ehrenamt.monat} €</span>
                    </div>
                  )}
                </div>

                {/* Ergebnis */}
                <div className="bg-rot rounded-2xl p-5">
                  <div className="text-white/70 text-xs font-black uppercase tracking-widest mb-2">
                    Dein Gesamteinkommen ohne Abzüge
                  </div>
                  <div className="font-condensed font-black text-5xl text-white">
                    {algNum > 0 ? euro(gesamtEink) : `ALG I + ${euro(gesamtFrei)}`}
                  </div>
                  {algNum === 0 && (
                    <div className="text-white/60 text-xs mt-2">Gib dein ALG I oben ein für die genaue Summe</div>
                  )}
                </div>

                <div className="mt-5 text-white/30 text-xs leading-relaxed">
                  Alle Beträge ohne Abzüge · Stand: Januar 2026 · Ohne Gewähr ·
                  Meldepflicht beachten · Hotline: {LEGAL.alg1.hotline}
                </div>
              </div>

              {/* Meldepflicht-Box */}
              <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5">
                <div className="font-black uppercase tracking-wider text-xs text-amber-800 mb-2">
                  Meldepflicht — Pflicht!
                </div>
                <p className="text-sm text-amber-800 leading-relaxed">
                  Jede Nebentätigkeit muss <strong>spätestens am ersten Arbeitstag</strong> bei der Agentur für Arbeit gemeldet werden.
                  Verspätung = Rückforderung!
                </p>
                <a href="https://www.arbeitsagentur.de" target="_blank" rel="noopener noreferrer"
                  className="inline-block mt-3 bg-amber-800 text-white font-black uppercase tracking-wider text-xs px-4 py-2 rounded-full">
                  Jetzt online melden →
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ── Bürgergeld ── */}
        {tab === 'bg' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <label className="block text-xs font-black uppercase tracking-widest text-grau-mid mb-3">Mein Bürgergeld pro Monat</label>
                <input type="number" placeholder="z.B. 563 €" value={bgBetrag}
                  onChange={e => setBgBetrag(e.target.value)}
                  className="w-full border-2 border-gray-200 focus:border-rot rounded-xl px-4 py-4 text-2xl font-condensed font-black outline-none transition-colors" />
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <label className="block text-xs font-black uppercase tracking-widest text-grau-mid mb-3">Geplanter Verdienst pro Monat</label>
                <input type="number" placeholder="z.B. 400 €" value={bgNeben}
                  onChange={e => setBgNeben(e.target.value)}
                  className="w-full border-2 border-gray-200 focus:border-rot rounded-xl px-4 py-4 text-2xl font-condensed font-black outline-none transition-colors" />
                <div className="mt-4 text-xs text-grau-mid leading-relaxed">
                  Staffel: <strong>0–100 € = 100% frei</strong> · 100–520 € = 20% frei · 520–1.000 € = 30% frei
                </div>
              </div>
            </div>

            <div className="bg-schwarz text-white rounded-3xl p-8">
              <div className="text-white/40 text-xs font-black uppercase tracking-widest mb-6">Deine Berechnung</div>
              <div className="space-y-3">
                {[
                  { l: 'Bürgergeld', v: euro(bgNum), c: 'text-white' },
                  { l: 'Freibetrag', v: euro(bgFrei), c: 'text-rot' },
                  { l: 'Anrechnung', v: euro(bgAnrechnung), c: 'text-amber-400' },
                  { l: 'Verblieb. Bürgergeld', v: euro(bgNeu), c: 'text-white' },
                ].map(r => (
                  <div key={r.l} className="flex justify-between items-center py-3 border-b border-white/10">
                    <span className="text-white/60 text-sm">{r.l}</span>
                    <span className={`font-condensed font-black text-2xl ${r.c}`}>{r.v}</span>
                  </div>
                ))}
              </div>
              <div className="bg-rot rounded-2xl p-5 mt-6">
                <div className="text-white/70 text-xs font-black uppercase tracking-widest mb-1">Gesamteinkommen</div>
                <div className="font-condensed font-black text-5xl text-white">{euro(bgNeu + bgNebNum)}</div>
              </div>
              <div className="mt-4 text-white/30 text-xs">§ 11b SGB II · Stand: Januar 2026 · Ohne Gewähr</div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
