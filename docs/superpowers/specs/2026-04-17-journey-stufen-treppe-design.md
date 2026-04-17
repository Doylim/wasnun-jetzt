# Spec — Journey als Stufen-Treppe + Selbst-Check

**Datum:** 2026-04-17
**Projekt:** wasnun-jetzt
**Autor:** Norbert Sommer (Entscheidungen) + Claude (Dokumentation)
**Status:** Design abgestimmt, bereit für Implementierungsplan

---

## Kontext

Die aktuelle Journey-Section hat zwei Eingabefelder (ALG-I-Betrag, Arbeitsstunden/Woche) und berechnet daraus eine Freibetrag-Summe. Drei Probleme:

1. **Der ALG-I-Betrag beeinflusst die Berechnung gar nicht.** Der Freibetrag ist pauschal (165/275/80 EUR). Die Eingabe wirkt unnötig — der Nutzer rechnet und sieht "immer 520 EUR" egal was er eingibt.
2. **Die Stunden-Eingabe verwirrt** die Zielgruppe (arbeitslose Menschen, oft keine Rechner-Affinität). Ihr einziger Zweck: die 15-Stunden-Regel als Warnung anstoßen.
3. **"+520 EUR" als Default-Ergebnis ist unehrlich.** Das Maximum erreicht nur, wer einen gemeinnützigen Verein + ggf. Qualifikation hat. Der durchschnittliche Nutzer bekommt erst einmal nur die 165 EUR (Grundfreibetrag, sofort verfügbar). Die 275 (Übungsleiter) und 80 (Ehrenamt) brauchen Aufwand.

Ziel: Die Journey-Section **radikal vereinfachen** und **ehrlicher kommunizieren**, ohne die 15-Stunden-Regel zu verstecken oder den interaktiven Charakter der Seite komplett zu verlieren.

---

## Design-Entscheidungen

### 1. Keine freie Eingabe mehr auf der Journey-Section

- **ALG-I-Betrag oben raus.** Die Personalisierung verschiebt sich ins Newsletter-Formular (da ist sie sinnvoll, weil die Plan-Mail den Betrag im Header zeigt).
- **Stunden-Input raus.** Stattdessen wird die 15-Stunden-Regel als **statische Warnbox** unterhalb der Ergebnis-Karte ausgespielt — ohne Input, ohne dynamische Überschreit-Warnung. Der Nutzer liest und versteht selbst.

### 2. Stufen-Treppe mit Selbst-Check (B+C-Mix)

Drei visuell gestaffelte Kacheln, übereinander:

| Stufe | Betrag  | Default   | Badge           | Abwählbar |
|-------|---------|-----------|------------------|-----------|
| 1     | +165 €  | **aktiv** | `SOFORT` (teal) | Nein      |
| 2     | +275 €  | inaktiv   | `VEREIN` (amber) | Ja |
| 3     | +80 €   | inaktiv   | `ROLLE` (amber) | Ja |

**Badges-Design-Prinzip:** Kurz, konsistent, sechs Zeichen oder weniger, jeweils selbsterklärend im Kontext der Kachel (die dahinter stehende Erklärung trägt die Details).

**Interaktion:**
- Stufe 1 ist permanent aktiv (der Grundfreibetrag gilt für jeden).
- Stufe 2 + 3 sind Checkbox-Kacheln, die der Nutzer ankreuzt, wenn er die Voraussetzungen hat.
- Unter den Stufen liegt eine **Summen-Karte** mit der aktuellen Freibetrag-Summe (startet bei 165 EUR, geht hoch auf max. 520 EUR).

**Jede Stufe zeigt:**
- Betrag (groß, farbig wenn aktiv)
- Name (fett)
- Ein-Satz-Erklärung (was sie bedeutet, Beispiel-Tätigkeit)
- Status-Badge

**Default-Zustand beim ersten Seitenbesuch:** `+165 EUR` in der Summen-Karte. Ehrlich, realistisch, erreichbar.

### 3. Passive Einkommen als statischer Hinweis

Unterhalb der Treppe ein dezenter Info-Block:

> **Zusätzlich unbegrenzt:** Mieteinnahmen + Kapitalerträge (Zinsen, Dividenden) werden bei ALG I nicht angerechnet.

Kein Toggle, kein Input — reine Information. Wer das nutzt, sieht's und denkt nach.

### 4. 15-Stunden-Regel als prominente Warnbox

Am Ende der Section, vor dem Newsletter-CTA:

> **⚠ 15-Stunden-Regel:** Du darfst max. 14 Std. 59 Min. pro Woche arbeiten. Ab 15 Stunden verlierst du ALG I komplett.

Amber-Hintergrund, Pflicht-Lesung.

### 5. Newsletter-Formular bekommt ALG-I- und Vornamen-Feld

Weil wir den ALG-I-Input oben rauswerfen, wandert die Eingabe ins Newsletter-Formular. Zusätzlich kommt ein optionales Vornamen-Feld dazu, damit die Plan-Mail den Nutzer persönlich begrüßen kann und die Brevo-Standard-Attribute (`VORNAME`) sinnvoll gefüllt werden.

| Feld       | Pflicht  | Platzhalter                | Nutzung                                                                 |
|------------|----------|----------------------------|-------------------------------------------------------------------------|
| Vorname    | optional | `z. B. Norbert`            | Plan-Mail-Begrüßung („Hallo Norbert, hier ist dein Plan..."). Leer → generische Begrüßung. Wird in Brevo als `VORNAME` gespeichert. |
| ALG I      | optional | `z. B. 1.200`              | Plan-Mail-Header („abzugsfrei zu deinem ALG I von 1.200 EUR"). Leer → „+165 EUR/Monat neben ALG I". |
| E-Mail     | Pflicht  | `deine@email.de`           | Standard-Newsletter-Feld.                                              |
| Datenschutz| Pflicht  | Checkbox                   | DSGVO-Consent.                                                         |

### 6. Section-Headline umbenannt

Aktuell: „Dein persönlicher Plan" — irreführend, weil das Ergebnis bisher nicht wirklich persönlich war.

Neu: **„So viel darfst du neben ALG I verdienen"** (Sub: „Ohne Abzug — abhängig davon, was auf dich zutrifft.")

---

## Architektur-Änderungen

### Komponenten

| Datei                                   | Aktion            | Grund                                    |
|-----------------------------------------|-------------------|------------------------------------------|
| `src/components/sections/journey.tsx`   | umbauen           | State vereinfacht, keine Stunden mehr, Ergebnis-Komponente getauscht |
| `src/components/sections/journey-input.tsx` | löschen       | ALG-I- und Stunden-Input nicht mehr auf Seite |
| `src/components/sections/journey-total.tsx` | löschen → ersetzt durch `stufen-treppe.tsx` | Neue Darstellungs-Logik |
| `src/components/sections/stufen-treppe.tsx` | **NEU** | Enthält die drei Stufen-Kacheln + Summen-Karte + Passiv-Hinweis |
| `src/components/sections/journey-card.tsx` | löschen | Toggle-Karten ersetzt durch Stufen-Kacheln in der Treppe |
| `src/components/sections/journey-plan.tsx` | behalten | Die Schritte-Liste unterhalb bleibt nützlich |
| `src/components/sections/journey-warnung.tsx` | löschen | Dynamische Warnung entfällt, statische Warnung direkt im JSX der Journey |
| `src/components/sections/newsletter-form.tsx` | erweitern | ALG-I-Feld + Vorname-Feld? (TBD — siehe Open Questions) |

### Datenmodell (`src/lib/journey.ts`)

- `JOURNEY_KARTEN` bleibt inhaltlich (die Pauschalen-Beschreibungen bleiben).
- Feld `immerAktiv` wird für Stufe 1 wichtig (Stufe 1 = true, Rest = false).
- `PlanState` verliert das Feld `stunden` — nicht mehr Teil des Zustands.
- `berechnePlan` entfernt das Feld `warnung15Stunden` aus dem Ergebnis.
- Die Funktion wird einfacher: nur noch Summierung der aktiven Karten.

### API (`src/app/api/newsletter/route.ts` + `.../confirm/[token]/route.ts`)

- Request-Body: `stunden` wird **optional**, Default 0 (Abwärtskompatibilität zu bestehenden offenen Confirm-Links).
- Validation: `stunden` darf weg sein.
- Token-Payload: `stunden` bleibt im Typ, Default 0.
- Brevo-Contact-Attributes: `STUNDEN_WOCHE` bleibt, wird aber mit `0` gefüllt wenn nicht übertragen (wir zerstören die bestehenden Brevo-Attribut-Definitionen nicht).

### Plan-Mail (`src/lib/plan-mail.ts`)

- Die Mail-Headline bleibt dynamisch: `+{gesamtFreibetrag} EUR`. Wenn der Nutzer nur Stufe 1 aktiv hat, steht dort eben `+165 EUR` — ehrlich.
- Die Schritte-Liste passt sich entsprechend an (nur aktive Pauschalen).
- 15-Stunden-Regel-Warnbox: Die dynamische Warn-Variante (`stunden >= 15`) kann raus — nur die statische Info-Variante bleibt, da wir keine Stunden-Eingabe mehr haben.

---

## Entschiedene Detail-Fragen (alle geklärt)

1. **Vorname-Feld im Newsletter-Form** — **ja**, als zusätzliches optionales Feld. Dient Plan-Mail-Begrüßung und Brevo-`VORNAME`-Attribut.
2. **Section-Headline** — „So viel darfst du neben ALG I verdienen" mit Sub „Ohne Abzug — abhängig davon, was auf dich zutrifft." bleibt so.
3. **Badge-Wording** — kurz & konsistent: `SOFORT` (6) / `VEREIN` (6) / `ROLLE` (5).

---

## Out of Scope (bewusst ausgeklammert)

- **Affiliate-Links (Teil 2 / Monetarisierung):** Die Partner (Zenjob, Coople, Clickworker, WG-Gesucht, Academy of Sports) kommen **später** in einer separaten Session, sobald Norbert Affiliate-Accounts eingerichtet hat. Der aktuelle Umbau bereitet den Boden nur strukturell vor.
- **Mobile-Layout-Feintuning:** Das Treppen-Pattern funktioniert out-of-the-box vertikal auf Mobile. Feinanpassungen wenn nötig im Implementierungsplan.
- **Desktop-Mail-Rendering:** Wird parallel gefixt — nicht Teil dieses Specs.

---

## Akzeptanzkriterien

Die Umsetzung gilt als fertig, wenn:

- [ ] Die Journey-Section zeigt beim ersten Besuch `+165 EUR` als Default-Summe.
- [ ] Die Stufen 2 und 3 sind Checkboxen, bei Aktivierung rechnet die Summe live auf 440 bzw. 520 EUR hoch.
- [ ] Stufe 1 ist nicht abwählbar (kein Klick-Effekt).
- [ ] Die ALG-I- und Stunden-Eingabefelder sind **von der Journey-Section entfernt**.
- [ ] Die 15-Stunden-Regel erscheint als statische Warnbox am Ende der Section.
- [ ] Das Newsletter-Formular hat ein neues **optionales ALG-I-Feld**.
- [ ] Die Plan-Mail zeigt im Header die Summe der tatsächlich aktivierten Stufen (165/440/520), nicht pauschal 520.
- [ ] Die bestehenden Tests (`npm test`) laufen weiter grün.
- [ ] Mobile-View sieht sauber aus (Treppe vertikal, Badges sichtbar, Summen-Karte prominent).
- [ ] Keine toten Imports, keine veralteten Komponenten im Code.

---

## Visueller Referenz-Mockup

Siehe `.superpowers/brainstorm/791-1776417378/content/treppe-mit-check.html` — zeigt beide Zustände (Default mit nur Stufe 1 und alles angekreuzt mit 520 EUR).
