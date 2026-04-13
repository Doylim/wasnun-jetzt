// ─────────────────────────────────────────────────────────
// lib/data.ts – Alle Inhalte & Rechtskonstanten
// Bei Gesetzesänderungen NUR HIER anpassen!
// Stand: Januar 2026
// ─────────────────────────────────────────────────────────

export const LEGAL = {
  alg1: {
    freibetrag:   165,
    maxStunden:   14,
    hotline:      '0800 4 5555 00',
    portal:       'arbeitsagentur.de',
    stand:        'Januar 2026',
  },
  buergergeld: {
    grundfreibetrag: 100,
    staffel1Max:     520,
    staffel1Rate:    0.20,
    staffel2Max:     1000,
    staffel2Rate:    0.30,
    portal:          'jobcenter.digital',
    stand:           'Januar 2026',
    regelsatz:       563,
  },
  minijob: {
    grenze:      603,
    mindestlohn: 13.90,
  },
  pauschalen: {
    uebungsleiter:    { jahr: 3300, monat: 275, paragraph: '§ 3 Nr. 26 EStG' },
    ehrenamt:         { jahr: 960,  monat: 80,  paragraph: '§ 3 Nr. 26a EStG' },
    kombiniert:       { jahr: 4260, monat: 355 },
  },
}

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

// ── Verdienst-Kategorien (das Herzstück des Portals) ──
export type Kategorie = {
  id:          string
  label:       string
  sublabel:    string
  max:         string
  timing:      string
  beschreibung: string
  rechtsbasis: string
  tipp:        string
  qualifikation?: Qualifikation
  optionen:    Option[]
}

export type Option = {
  titel:       string
  verdienst:   string
  timing:      string
  beschreibung: string
  link?:       string
  warnung?:    string
}

export type Qualifikation = {
  name:        string
  dauer:       string
  kosten:      string
  foerderung:  string
  link:        string
}

export const KATEGORIEN: Kategorie[] = [
  {
    id:       'sofort',
    label:    'Sofort',
    sublabel: 'Heute noch loslegen',
    max:      'bis 603 €/Monat',
    timing:   'In 24–48 Stunden',
    beschreibung: 'Optionen bei denen du innerhalb von 24–48 Stunden dein erstes Geld verdienen kannst. Kein Vorwissen, keine langen Bewerbungsprozesse.',
    rechtsbasis: 'Minijob-Grenze 603 €/Monat · ALG I Freibetrag 165 € · 15h/Woche max.',
    tipp: 'Beim ALG I gilt: Das Nettoeinkommen über 165 € wird angerechnet. Trotzdem lohnt es sich — jeder Euro über dem Freibetrag bleibt dir zur Hälfte.',
    optionen: [
      {
        titel: 'Kurzfristige Schichten',
        verdienst: '13,90–20 €/Std.',
        timing: '24–48h',
        beschreibung: 'Zenjob, Coople, InStaff — Gastro, Event, Lager. Anmeldung in Minuten, erster Einsatz oft am nächsten Tag.',
      },
      {
        titel: 'Mikrojobs per App',
        verdienst: '50–200 €/Monat',
        timing: 'Heute',
        beschreibung: 'Clickworker, AppJobber, Streetspotr — kleine Aufgaben am Smartphone. Realistisch: Nebenverdienst, keine Haupteinnahme.',
        warnung: 'Manche Anbieter werben mit unrealistischen Summen. Seriöse Plattformen zahlen 5–15 €/Stunde.',
      },
      {
        titel: 'Liefer- & Fahrdienste',
        verdienst: '300–600 €/Monat',
        timing: '2–3 Tage',
        beschreibung: 'Lieferando, Uber Eats, Bolt — Führerschein und Fahrzeug nötig. Flexibel einteilbar, körperlich anspruchsvoll.',
      },
      {
        titel: 'Lokale Kleinaufträge',
        verdienst: '15–50 €/Auftrag',
        timing: '2–5 Tage',
        beschreibung: 'MyHammer, Kleinanzeigen — Handwerk, Umzug, Garten. Als Selbstständiger andere Freibetrag-Regeln beachten!',
        warnung: 'Als Selbstständiger: Gewerbeanmeldung + Einnahmen korrekt melden!',
      },
    ],
  },
  {
    id:       'clever',
    label:    'Clever',
    sublabel: 'Die unterschätzten Freibeträge',
    max:      'bis 4.260 €/Jahr steuerfrei',
    timing:   'Dauerhaft & legal',
    beschreibung: 'Freibeträge die kaum jemand kennt — aber vollständig legal sind. Besonders wertvoll: Sie gelten zusätzlich zum normalen Freibetrag.',
    rechtsbasis: '§ 3 Nr. 26 EStG (Übungsleiter) · § 3 Nr. 26a EStG (Ehrenamt) · § 155 SGB III',
    tipp: 'Übungsleiter- und Ehrenamtspauschale können KOMBINIERT werden — für verschiedene Tätigkeiten beim selben Verein. Trainer + Kassenwart = 4.260 €/Jahr!',
    optionen: [
      {
        titel: 'Übungsleiterpauschale',
        verdienst: '275 €/Monat (3.300 €/Jahr)',
        timing: 'Dauerhaft',
        beschreibung: 'Als Trainer, Chorleiter, Betreuer, Ausbilder oder Referent bei einem gemeinnützigen Verein oder öffentlicher Einrichtung. Vollständig anrechnungsfrei — auch bei ALG I!',
      },
      {
        titel: 'Ehrenamtspauschale',
        verdienst: '80 €/Monat (960 €/Jahr)',
        timing: 'Dauerhaft',
        beschreibung: 'Als Vereinsvorstand, Kassenwart, Platzwart oder für andere organisatorische Aufgaben in gemeinnützigen Vereinen. Breiter anwendbar als die Übungsleiterpauschale.',
      },
      {
        titel: 'Mieteinnahmen (ALG I)',
        verdienst: 'Unbegrenzt',
        timing: 'Sofort',
        beschreibung: 'Mieteinnahmen werden beim ALG I NICHT angerechnet! Wer ein Zimmer untervermietet oder eine Wohnung besitzt, kann unbegrenzt dazuverdienen.',
        warnung: 'Nur bei ALG I! Beim Bürgergeld gelten andere Regeln.',
      },
      {
        titel: 'Zinsen & Kapitalerträge (ALG I)',
        verdienst: 'Unbegrenzt',
        timing: 'Sofort',
        beschreibung: 'Zinsen, Dividenden und andere Kapitalerträge werden beim ALG I nicht angerechnet. Beim Bürgergeld wird Vermögen oberhalb des Schonvermögens berücksichtigt.',
        warnung: 'Nur bei ALG I! Beim Bürgergeld gelten Vermögensgrenzen.',
      },
    ],
  },
  {
    id:       'aufbauen',
    label:    'Aufbauen',
    sublabel: 'Mit Qualifikation mehr verdienen',
    max:      'bis 800 €/Monat',
    timing:   '4–16 Wochen',
    beschreibung: 'Mit einem Bildungsgutschein der Bundesagentur für Arbeit kannst du Qualifikationen kostenlos erwerben — und danach deutlich mehr verdienen.',
    rechtsbasis: '§ 81 SGB III (Bildungsgutschein) · AZAV-Zertifizierung',
    tipp: 'Der Bildungsgutschein ist kostenlos und deckt Lehrgang + Prüfungsgebühren ab. Einfach bei der Agentur für Arbeit anfragen — viele wissen nicht, dass sie Anspruch haben!',
    qualifikation: {
      name:       'Bildungsgutschein beantragen',
      dauer:      'Beratungsgespräch ~1 Stunde',
      kosten:     'Kostenlos',
      foerderung: '100% über Bundesagentur für Arbeit',
      link:       'https://www.arbeitsagentur.de/bildungsgutschein',
    },
    optionen: [
      {
        titel: 'C-Trainer Breitensport',
        verdienst: '275 €/Monat steuerfrei (Übungsleiterpauschale)',
        timing: '16 Wochen online',
        beschreibung: 'Die ideale Kombination: Lizenz holen → im Sportverein trainieren → 275 €/Monat komplett steuerfrei über die Übungsleiterpauschale. Mit Bildungsgutschein komplett kostenlos!',
        link: 'https://www.academyofsports.de/de/trainer-ausbildung/trainer-c-lizenz-breitensport/',
      },
      {
        titel: 'Ersthelfer / Erste-Hilfe-Trainer',
        verdienst: '20–50 €/Kurs als Kursleiter',
        timing: '2–3 Tage',
        beschreibung: 'Als zertifizierter Erste-Hilfe-Trainer Kurse geben — für Schulen, Betriebe, Vereine. Kurse werden regelmäßig nachgefragt.',
      },
      {
        titel: 'Gabelstapler-Schein',
        verdienst: '15–20 €/Std. in Logistik',
        timing: '1 Woche',
        beschreibung: 'DGUV V3-Schein öffnet Türen in Lager und Logistik. Oft mit Bildungsgutschein förderbar. Sehr hohe Nachfrage bei Zeitarbeit.',
      },
      {
        titel: 'Online-Kurs: Freelancing',
        verdienst: '200–800 €/Monat',
        timing: '4–8 Wochen',
        beschreibung: 'Texten, Grafikdesign, Social Media, virtuelle Assistenz — alles was du online anbieten kannst. Fiverr, Upwork, direkte Kundenakquise.',
      },
    ],
  },
  {
    id:       'digital',
    label:    'Digital',
    sublabel: 'Von zuhause aus',
    max:      'bis 500 €/Monat',
    timing: 'Sofort bis 4 Wochen',
    beschreibung: 'Für alle die mobil eingeschränkt sind oder lieber von zuhause arbeiten. Laptop und Internet reichen.',
    rechtsbasis: 'ALG I: 165 € Freibetrag · Bürgergeld: gestaffelte Freibeträge',
    tipp: 'Online-Umfragen und Mikrojobs sind ein guter Einstieg — aber keine Haupteinnahmequelle. Freelancing hat deutlich höheres Potenzial.',
    optionen: [
      {
        titel: 'Online-Umfragen',
        verdienst: '20–60 €/Monat',
        timing: 'Sofort',
        beschreibung: 'Meinungsstudie, Swagbucks, GFK — geringer Aufwand, geringer Verdienst. Gut als Ergänzung, nur bei seriösen Anbietern!',
        warnung: 'Vorsicht vor Scam-Portalen. Nie Gebühren zahlen um teilzunehmen!',
      },
      {
        titel: 'KI-Training / Datenlabeling',
        verdienst: '100–300 €/Monat',
        timing: 'Sofort',
        beschreibung: 'Scale AI, Appen, Remotasks — KI-Systeme mit Daten trainieren. Wachsende Nachfrage, flexibel einteilbar.',
      },
      {
        titel: 'Virtuelle Assistenz',
        verdienst: '15–25 €/Std.',
        timing: '1–2 Wochen',
        beschreibung: 'E-Mail-Management, Terminkoordination, Recherche für Unternehmen. Ideal für Büro-Erfahrene. Über Upwork oder direkte Akquise.',
      },
      {
        titel: 'Content Creation',
        verdienst: '0–500 €/Monat',
        timing: '4–12 Wochen',
        beschreibung: 'TikTok, Instagram, YouTube — langsamer Aufbau, aber skalierbar. Ehrlich: Die ersten Monate oft ohne Einnahmen.',
        warnung: 'Nicht als Soforteinkommen planen. Eher als langfristige Perspektive.',
      },
    ],
  },
]

// ── Skills-Check Optionen ──
export const SKILL_OPTIONS = {
  beruf: [
    { value: 'handwerk', label: 'Handwerk / Technik',    sub: '🔧 Montage, Reparatur, Bauwesen' },
    { value: 'buero',    label: 'Büro / Verwaltung',     sub: '💼 Sachbearbeitung, Assistenz' },
    { value: 'digital',  label: 'Digital / IT',          sub: '💻 Programmierung, Design, Marketing' },
    { value: 'pflege',   label: 'Pflege / Soziales',     sub: '❤️ Betreuung, Erziehung, Gesundheit' },
    { value: 'logistik', label: 'Logistik / Transport',  sub: '🚚 Lager, Fahrerei, Kurierdienst' },
    { value: 'sport',    label: 'Sport / Pädagogik',     sub: '⚽ Training, Bildung, Betreuung' },
  ],
  zeit: [
    { value: 'wenig',    label: 'Sehr wenig',   sub: '1–5 Stunden / Woche' },
    { value: 'mittel',   label: 'Etwas Zeit',   sub: '6–14 Stunden / Woche (ALG-I-Grenze!)' },
    { value: 'viel',     label: 'Viel Zeit',    sub: 'Bürgergeld-Bezug, keine 15h-Grenze' },
    { value: 'flexibel', label: 'Flexibel',     sub: 'Je nach Woche unterschiedlich' },
  ],
  mobilitaet: [
    { value: 'auto',      label: 'Auto & Führerschein',    sub: 'Bin mobil unterwegs' },
    { value: 'nah',       label: 'Nahverkehr / Fahrrad',   sub: 'Regional unterwegs' },
    { value: 'zuhause',   label: 'Hauptsächlich zuhause',  sub: 'Laptop & Internet vorhanden' },
    { value: 'begrenzt',  label: 'Eingeschränkt',          sub: 'Auf digitale Jobs angewiesen' },
  ],
  digital: [
    { value: 'profi',    label: 'Sehr fit',           sub: 'Office, E-Mail, Social Media kein Problem' },
    { value: 'mittel',   label: 'Smartphone-Nutzer',  sub: 'Apps ja, PC weniger' },
    { value: 'wenig',    label: 'Lieber offline',     sub: 'Bevorzuge persönlichen Kontakt' },
  ],
}

export type PlanKarte = {
  kategorie:   string
  titel:       string
  verdienst:   string
  timing:      string
  beschreibung: string
  rechtsBasis: string
  warnung?:    string
  tags:        string[]
}

export const PLAN_KARTEN: PlanKarte[] = [
  {
    kategorie: 'SOFORT',
    titel: 'Kurzfristige Schichten',
    verdienst: '13,90–20 €/Std.',
    timing: 'In 24–48 Stunden',
    beschreibung: 'Zenjob, Coople, InStaff — Gastro, Event, Lager. Anmeldung dauert Minuten.',
    rechtsBasis: 'Minijob bis 603 €/Monat · ALG I: 165 € Freibetrag',
    tags: ['logistik', 'auto', 'nah', 'mittel', 'viel'],
  },
  {
    kategorie: 'CLEVER',
    titel: 'Übungsleiterpauschale nutzen',
    verdienst: '275 €/Monat steuerfrei',
    timing: 'Dauerhaft & legal',
    beschreibung: 'Als Trainer, Chorleiter oder Betreuer im Verein — komplett anrechnungsfrei, auch bei ALG I. Der unterschätzteste Freibetrag Deutschlands.',
    rechtsBasis: '§ 3 Nr. 26 EStG · § 155 SGB III · anrechnungsfrei ALG I',
    tags: ['sport', 'pflege', 'buero', 'wenig', 'zuhause', 'begrenzt'],
  },
  {
    kategorie: 'AUFBAUEN',
    titel: 'C-Trainer Lizenz (kostenlos)',
    verdienst: '275 €/Monat dauerhaft',
    timing: '16 Wochen online',
    beschreibung: 'Mit Bildungsgutschein komplett kostenlos. Danach: Übungsleiterpauschale = 275 €/Monat steuerfrei. Der clevere Weg.',
    rechtsBasis: '§ 81 SGB III Bildungsgutschein · AZAV-zertifiziert',
    tags: ['sport', 'pflege', 'viel', 'mittel', 'flexibel'],
  },
  {
    kategorie: 'DIGITAL',
    titel: 'KI-Training / Datenlabeling',
    verdienst: '100–300 €/Monat',
    timing: 'Sofort',
    beschreibung: 'Scale AI, Appen, Remotasks — Wachsende Nachfrage. Flexible Zeiteinteilung von zuhause.',
    rechtsBasis: 'Minijob oder Selbstständigkeit · ALG I: 165 € Freibetrag',
    tags: ['digital', 'buero', 'zuhause', 'begrenzt', 'wenig'],
  },
  {
    kategorie: 'SOFORT',
    titel: 'Liefer- & Fahrdienste',
    verdienst: '300–600 €/Monat',
    timing: 'In 2–3 Tagen',
    beschreibung: 'Lieferando, Uber Eats, Bolt — Führerschein nötig. Sehr flexibel einteilbar.',
    rechtsBasis: 'Minijob bis 603 €/Monat · Selbstständigkeit möglich',
    tags: ['auto', 'logistik', 'viel', 'mittel'],
  },
  {
    kategorie: 'DIGITAL',
    titel: 'Virtuelle Assistenz',
    verdienst: '15–25 €/Std.',
    timing: '1–2 Wochen',
    beschreibung: 'E-Mail, Termine, Recherche für Unternehmen. Ideal für Büro-Erfahrene. Über Upwork oder direkte Akquise.',
    rechtsBasis: 'Freiberuflich oder Minijob · ALG I: 165 € Freibetrag',
    tags: ['buero', 'digital', 'zuhause', 'profi'],
  },
]
