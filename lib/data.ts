// ─────────────────────────────────────────────
// lib/data.ts – Inhalte & Rechtskonstanten
// Bei Gesetzesänderungen NUR HIER anpassen!
// ─────────────────────────────────────────────

export const LEGAL = {
  alg1: {
    freibetrag:   165,       // § 155 SGB III
    maxStunden:   14,        // < 15 h/Woche = arbeitslos
    hotline:      '0800 4 5555 00',
    portal:       'arbeitsagentur.de',
    stand:        'Januar 2026',
  },
  buergergeld: {
    grundfreibetrag: 100,   // § 11b SGB II
    staffel1Max:     520,
    staffel1Rate:    0.20,
    staffel2Max:     1000,
    staffel2Rate:    0.30,
    portal:          'jobcenter.digital',
    stand:           'Januar 2026',
  },
  minijob: {
    grenze:      603,        // ab 01.01.2026
    mindestlohn: 13.90,      // ab 01.01.2026
  },
}

// ── Impressum-Daten ──
export const IMPRESSUM = {
  name:    'Norbert Sommer',
  firma:   'Einzelunternehmen',
  strasse: 'Langgewann 18',
  ort:     '69121 Heidelberg',
  land:    'Deutschland',
  tel:     '06221 43125 08',
  mail:    'office@doylim.com',
  ust:     'DE320652316',
}

// ── Skill-Optionen für den 5-Fragen-Check ──
export const SKILL_OPTIONS = {
  beruf: [
    { value: 'handwerk', label: 'Handwerk / Technik',      emoji: '🔧', sub: 'Montage, Reparatur, Bauwesen' },
    { value: 'buero',    label: 'Büro / Verwaltung',       emoji: '💼', sub: 'Sachbearbeitung, Assistenz' },
    { value: 'digital',  label: 'Digital / IT',            emoji: '💻', sub: 'Programmierung, Design, Marketing' },
    { value: 'pflege',   label: 'Pflege / Soziales',       emoji: '❤️', sub: 'Betreuung, Erziehung, Gesundheit' },
    { value: 'logistik', label: 'Logistik / Fahrerei',     emoji: '🚚', sub: 'Transport, Lager, Kurierdienst' },
    { value: 'service',  label: 'Gastronomie / Service',   emoji: '🍽️', sub: 'Küche, Kellner, Hotel' },
  ],
  zeit: [
    { value: 'wenig',    label: 'Wenig Zeit',   emoji: '⏰', sub: '1–5 Stunden / Woche' },
    { value: 'mittel',   label: 'Etwas Zeit',   emoji: '🕐', sub: '6–14 Stunden / Woche (ALG-I-Grenze!)' },
    { value: 'viel',     label: 'Viel Zeit',    emoji: '📅', sub: 'Bürgergeld – keine 15h-Grenze' },
    { value: 'flexibel', label: 'Flexibel',     emoji: '🔄', sub: 'Je nach Woche unterschiedlich' },
  ],
  mobilitaet: [
    { value: 'auto',           label: 'Auto & Führerschein',       emoji: '🚗', sub: 'Ich bin mobil' },
    { value: 'nah',            label: 'Nahverkehr / Fahrrad',      emoji: '🚌', sub: 'Regional unterwegs' },
    { value: 'zuhause',        label: 'Hauptsächlich zuhause',     emoji: '🏠', sub: 'Laptop & Internet vorhanden' },
    { value: 'eingeschraenkt', label: 'Eingeschränkte Mobilität',  emoji: '♿', sub: 'Auf digitale Jobs angewiesen' },
  ],
  digital: [
    { value: 'profi',  label: 'Sehr fit',          emoji: '🧠', sub: 'Office, E-Mail, Social Media kein Problem' },
    { value: 'mittel', label: 'Smartphone-Nutzer', emoji: '📱', sub: 'Apps ja, aber kein PC-Profi' },
    { value: 'wenig',  label: 'Wenig digital',     emoji: '🖨️', sub: 'Lieber offline arbeiten' },
  ],
  ziel: [
    { value: 'sofort',  label: 'Sofort anfangen',         emoji: '⚡', sub: 'Ich will heute noch loslegen' },
    { value: 'sicher',  label: 'Sicherheit & Compliance', emoji: '🛡️', sub: 'Kein Risiko mit dem Jobcenter' },
    { value: 'zukunft', label: 'Perspektive aufbauen',    emoji: '📈', sub: 'Langfristig was aufbauen' },
    { value: 'lokal',   label: 'Lokale Jobs',             emoji: '📍', sub: 'In meiner Region arbeiten' },
  ],
}

// ── Plan-Karten (Ergebnis des Skills-Checks) ──
export type PlanKarte = {
  icon:       string
  bg:         string
  titel:      string
  verdienst:  string
  beschreibung: string
  startLabel: string
  startFarbe: string
  tags:       string[]
}

export const PLAN_KARTEN: PlanKarte[] = [
  {
    icon: '⚡', bg: 'bg-emerald-50 dark:bg-emerald-950',
    titel: 'Mikrojobs über Apps',
    verdienst: '50–200 €/Monat',
    beschreibung: 'Clickworker, AppJobber oder Streetspotr – kleine Aufgaben am Smartphone, sofort startbereit. Realistische Erwartung: kein großes Geld, aber schneller Einstieg ohne lange Bewerbung.',
    startLabel: '⏱ Heute startbar', startFarbe: 'text-emerald-700 bg-emerald-50',
    tags: ['digital', 'buero', 'wenig', 'mittel', 'zuhause', 'eingeschraenkt'],
  },
  {
    icon: '🚀', bg: 'bg-blue-50 dark:bg-blue-950',
    titel: 'Kurzfristige Schichten',
    verdienst: '13,90–20 €/Std.',
    beschreibung: 'Zenjob, Coople oder InStaff vermitteln Gastro-, Event- und Lagerschichten – Einsatz oft in 24–48 Stunden möglich. Gut für mobile Nutzer mit Gastro- oder Lager-Erfahrung.',
    startLabel: '⏱ In 1–2 Tagen', startFarbe: 'text-blue-700 bg-blue-50',
    tags: ['auto', 'nah', 'service', 'logistik', 'sofort'],
  },
  {
    icon: '🔧', bg: 'bg-amber-50 dark:bg-amber-950',
    titel: 'Lokale Kleinaufträge',
    verdienst: '15–40 €/Auftrag',
    beschreibung: 'MyHammer oder Kleinanzeigen für Handwerker, Umzugshilfe, Gartenpflege. Als Selbstständiger gelten andere Freibetrag-Regeln – vorher Gewerbe prüfen!',
    startLabel: '📋 Gewerbe prüfen', startFarbe: 'text-amber-700 bg-amber-50',
    tags: ['handwerk', 'auto', 'lokal', 'nah'],
  },
  {
    icon: '💻', bg: 'bg-purple-50 dark:bg-purple-950',
    titel: 'Freelancing / Remote',
    verdienst: '200–800 €/Monat',
    beschreibung: 'Fiverr, Upwork oder direkte Kunden – für digitale Skills wie Texten, Design, Social Media. Höheres Potenzial, aber 2–4 Wochen Aufbauzeit einplanen.',
    startLabel: '📈 Aufbau: 2–4 Wochen', startFarbe: 'text-purple-700 bg-purple-50',
    tags: ['digital', 'buero', 'zukunft', 'zuhause', 'profi'],
  },
  {
    icon: '🚗', bg: 'bg-orange-50 dark:bg-orange-950',
    titel: 'Liefer- & Fahrdienste',
    verdienst: '300–600 €/Monat',
    beschreibung: 'Lieferando, Uber Eats oder Bolt – Führerschein und Fahrzeug vorausgesetzt. Flexibel einteilbar, aber körperlich anspruchsvoll. Km-Abrechnung beachten.',
    startLabel: '⏱ In 2–3 Tagen', startFarbe: 'text-orange-700 bg-orange-50',
    tags: ['auto', 'logistik', 'sofort', 'viel'],
  },
  {
    icon: '📝', bg: 'bg-gray-50 dark:bg-gray-900',
    titel: 'Online-Umfragen',
    verdienst: '20–80 €/Monat',
    beschreibung: 'Meinungsstudie oder Swagbucks – geringer Aufwand, aber auch geringer Verdienst. Gut als Ergänzung, nicht als Hauptquelle. Nur seriöse Anbieter nutzen!',
    startLabel: '⏱ Sofort', startFarbe: 'text-gray-600 bg-gray-100',
    tags: ['wenig', 'zuhause', 'eingeschraenkt', 'mittel'],
  },
]
