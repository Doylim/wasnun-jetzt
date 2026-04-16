# Wo wir stehen — wasnun-jetzt UX-Umbau + Plan-Mail

**Stand: 16.04.2026**
**Aktueller Branch: `feat/wasnun-journey`** (noch NICHT auf `main` gemerged)

---

## Was fertig ist

- **9 Commits** auf Branch `feat/wasnun-journey`, alle bereits zu GitHub gepusht
- **UX-Umbau komplett**: Ergebnis ist sofort sichtbar, alle Karten standardmäßig aktiv, Details nur bei Bedarf per `<details>`-Aufklapp ausklappbar
- **Personalisierte Plan-Mail** mit DSGVO-konformem Doppel-Opt-in komplett implementiert:
  - HMAC-Token-Helper (4 Tests grün)
  - HTML-Generator für die Plan-Mail (5 Tests grün)
  - API-Route `POST /api/newsletter` (verschickt Bestätigungs-Mail)
  - API-Route `GET /api/newsletter/confirm` (verifiziert Token, sendet Plan-Mail, trägt bei Brevo ein)
  - Thank-you-Seite `/danke-plan-versendet`
  - Newsletter-Formular sendet die Plan-Daten automatisch mit
  - Datenschutzerklärung um Newsletter/Plan-Versand ergänzt
- **Env-Vars bereits in Vercel gesetzt**: `TOKEN_SECRET` (Production, Preview, Development) und `NEXT_PUBLIC_SITE_URL` (Production, Preview)
- **Tests**: `npm test` → alle grün (9 Tests)
- **Preview-Deploy läuft** (die URL findest du im Vercel-Dashboard unter „Deployments")

**Was noch fehlt, bevor der Flow wirklich Mails verschickt:**
Brevo muss eingerichtet sein und 4 weitere Env-Vars müssen in Vercel gesetzt sein.
Dafür sind die 5 Schritte unten.

---

## Was du als Nächstes machen musst (5 Schritte, ca. 10 Minuten)

### Schritt 1 — Brevo-Liste anlegen

1. Öffne https://app.brevo.com und logge dich ein
2. Links im Menü: **Contacts** → **Lists** → **+ Create a new list**
3. Name: `Wasnun-Jetzt Plan-Abonnenten`
4. **List ID merken** (die erscheint nach dem Anlegen in der URL oder Listenübersicht, z. B. `12`)

---

### Schritt 2 — Custom-Attribute anlegen

Diese brauchen wir, damit Brevo die Personalisierungs-Daten speichern kann.

1. Im Brevo-Dashboard: **Contacts** → **Settings** → **Contact attributes**
2. Klicke **+ Create a new attribute** und lege nacheinander diese 4 Attribute an:

| Name (exakt so schreiben!) | Typ    |
|----------------------------|--------|
| `VORNAME`                  | Text   |
| `BUNDESLAND`               | Text   |
| `PLAN_SUMME`               | Zahl   |
| `PLAN_JSON`                | Text   |

**Wichtig:** Alle Namen in GROSSBUCHSTABEN — Brevo macht bei Attributen einen Unterschied zwischen `vorname` und `VORNAME`.

---

### Schritt 3 — API-Key abrufen

1. Im Brevo-Dashboard oben rechts auf dein Profil klicken → **SMTP & API**
2. Tab **API Keys** → **+ Generate a new API key**
3. Name: `wasnun-jetzt`
4. Den generierten Key sofort kopieren (Brevo zeigt ihn nur EINMAL an)

---

### Schritt 4 — Env-Vars in Vercel setzen

Öffne ein Terminal im Projektordner (`C:\Projekte\webseiten\wasnun-jetzt`) und führe diese 4 Befehle aus. Ersetze die Platzhalter `<...>` mit deinen echten Werten aus Schritt 1–3.

```bash
# 1. Brevo API-Key (für alle drei Umgebungen)
vercel env add BREVO_API_KEY production
# → bei Nachfrage den API-Key aus Schritt 3 eingeben

vercel env add BREVO_API_KEY preview
vercel env add BREVO_API_KEY development

# 2. Brevo Listen-ID (für alle drei Umgebungen)
vercel env add BREVO_LIST_ID production
# → bei Nachfrage die List-ID aus Schritt 1 eingeben (nur die Zahl, z. B. 12)

vercel env add BREVO_LIST_ID preview
vercel env add BREVO_LIST_ID development

# 3. Absender-Adresse (für alle drei Umgebungen)
vercel env add BREVO_SENDER_EMAIL production
# → noreply@wasnun-jetzt.de

vercel env add BREVO_SENDER_EMAIL preview
vercel env add BREVO_SENDER_EMAIL development

# 4. Absender-Name (für alle drei Umgebungen)
vercel env add BREVO_SENDER_NAME production
# → Wasnun-Jetzt

vercel env add BREVO_SENDER_NAME preview
vercel env add BREVO_SENDER_NAME development
```

**Hinweis zu `vercel env add preview`:** Bei `preview` kann die CLI nachfragen, für welchen Git-Branch die Variable gelten soll. Wähle „All Preview Deployments" oder gib den Branch `feat/wasnun-journey` an.

---

### Schritt 5 — Absender-Adresse in Brevo verifizieren (DNS)

Damit Brevo Mails von `noreply@wasnun-jetzt.de` versenden darf, muss die Absender-Domain verifiziert sein.

1. Im Brevo-Dashboard: **Senders, Domains & Dedicated IPs** → Tab **Domains**
2. **+ Add a domain** → `wasnun-jetzt.de` eintragen
3. Brevo zeigt dir 3 DNS-Einträge (SPF, DKIM, DMARC) mit konkreten Werten
4. Diese 3 DNS-Einträge bei deinem DNS-Provider (wahrscheinlich STRATO / INWX / Porkbun, je nachdem wo du die Domain hast) eintragen
5. Zurück im Brevo-Dashboard → **Verify** klicken. Kann bis zu 24 h dauern, meistens aber in 10–30 Minuten durch.

**Alternativ (nur zum Testen):** Statt eine neue Domain zu verifizieren, kannst du als Absender auch eine Adresse nutzen, die du schon in Brevo verifiziert hast (z. B. `office@doylim.com`). Dann in Schritt 4 als `BREVO_SENDER_EMAIL` diese Adresse eintragen und Schritt 5 überspringen. Für den Livegang später auf `noreply@wasnun-jetzt.de` umstellen.

---

## Danach: Neu deployen

Damit Vercel die neuen Env-Vars in den Build mitnimmt, brauchen wir einen neuen Deploy. Der einfachste Weg ist ein leerer Commit, der den Auto-Deploy auslöst:

```bash
cd C:\Projekte\webseiten\wasnun-jetzt
git commit --allow-empty -m "chore: Redeploy mit Brevo-Env-Vars"
git push
```

Warte ca. 1–2 Minuten, bis Vercel im Dashboard „Ready" zeigt.

---

## Dann: E2E-Test (End-to-End)

1. Im Vercel-Dashboard unter „Deployments" die Preview-URL deines Feature-Branches öffnen (sieht aus wie `wasnun-jetzt-git-feat-wasnun-journey-...vercel.app`).
2. Scroll runter zum Newsletter-Formular.
3. **Checkliste beim Ausfüllen:**
   - [ ] Vorname eintragen
   - [ ] Bundesland auswählen
   - [ ] Mindestens eine Einnahmequelle in der Journey aktivieren (oben auf der Seite)
   - [ ] Echte E-Mail-Adresse (deine eigene) eingeben
   - [ ] Checkbox „Datenschutz akzeptieren" setzen
   - [ ] Absenden klicken
4. **Weiterleitung auf `/danke-plan-versendet`** sollte erfolgen.
5. **Bestätigungs-Mail im Posteingang prüfen** (auch Spam-Ordner!). Auf den Bestätigungs-Link klicken.
6. **Plan-Mail sollte jetzt ankommen** mit deinen personalisierten Zahlen.
7. **Im Brevo-Dashboard prüfen**: Contacts → Lists → deine Liste → dein Kontakt sollte mit allen 4 Custom-Attributen (VORNAME, BUNDESLAND, PLAN_SUMME, PLAN_JSON) eingetragen sein.

**Wenn irgendein Schritt scheitert:** Notier dir genau WO (z. B. „keine Bestätigungs-Mail"), dann kann Claude im nächsten Session-Termin gezielt debuggen.

---

## Wenn alles grün: Merge auf main

Sobald der E2E-Test einmal komplett durchgelaufen ist, kann der Feature-Branch auf `main` gemerged werden:

```bash
cd C:\Projekte\webseiten\wasnun-jetzt
git checkout main
git pull
git merge feat/wasnun-journey --no-ff -m "feat: UX-Umbau Journey + personalisierte Plan-Mail"
git push origin main
```

Damit geht der Stand auf die Produktiv-URL. Danach kannst du den Feature-Branch löschen:

```bash
git branch -d feat/wasnun-journey
git push origin --delete feat/wasnun-journey
```

---

## Wenn du mit Claude weitermachst

Sag einfach:

> „Lass uns bei wasnun-jetzt weitermachen."

Claude soll zuerst diese **`WEITERMACHEN.md`** lesen und dich dann fragen, bis zu welchem der 5 Schritte du gekommen bist. Ab dort machen wir gemeinsam weiter.

---

## Spec + Plan zum Nachlesen

- `docs/superpowers/specs/2026-04-16-wasnun-jetzt-ux-und-plan-mail.md` — Was wir bauen wollten
- `docs/superpowers/plans/2026-04-16-wasnun-jetzt-ux-und-plan-mail.md` — Wie es umgesetzt wurde (11 Tasks)

---

## Nach diesem Projekt: Teil 2 (Partner / Monetarisierung)

Bewusst ausgeklammert, kommt als separate Session.
Ziel: Affiliate-Links (Zenjob, Coople, WG-Gesucht, Academy of Sports) in die Plan-Mail einbauen und prominent auf der Seite platzieren. Dafür brauchen wir:

1. Affiliate-Accounts bei allen 4 Partnern (Zugangsdaten, Partner-IDs)
2. Partner-Liste in `src/lib/partner.ts` erweitern (Status `geplant` → `aktiv`)
3. Partner-Blöcke in der Plan-Mail-HTML einbauen (mit Werbe-Kennzeichnung „Anzeige")
4. Partner-Section auf der Startseite bauen (sichtbare Badge „Werbung", `rel="sponsored"`)
5. Datenschutzerklärung um Affiliate-Hinweis ergänzen (steht teilweise schon drin)

Das ist Stoff für eine eigene Session von ca. 1–2 Stunden.
