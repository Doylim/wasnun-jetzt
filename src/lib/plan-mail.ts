import type { NewsletterTokenPayload } from "./token";

type PauschaleInfo = {
  id: string;
  label: string;
  betrag: number;
  beschreibung: string;
  schritt: string;
};

const PAUSCHALEN: Record<string, PauschaleInfo> = {
  grundfreibetrag: {
    id: "grundfreibetrag",
    label: "Grundfreibetrag",
    betrag: 165,
    beschreibung: "Anrechnungsfrei aus Erwerbstätigkeit",
    schritt:
      "165 EUR Grundfreibetrag — melde dich bei einer Minijob-Plattform an (Zenjob, Coople, Clickworker). Ca. 11–12 Std./Monat sind sicher.",
  },
  uebungsleiter: {
    id: "uebungsleiter",
    label: "Übungsleiterpauschale",
    betrag: 275,
    beschreibung: "§ 3 Nr. 26 EStG — nebenberufliche Tätigkeit im Verein",
    schritt:
      "275 EUR Übungsleiterpauschale — suche einen gemeinnützigen Verein über BAGFA. Ohne Lizenz: C-Trainer-Kurs mit Bildungsgutschein beantragen.",
  },
  ehrenamt: {
    id: "ehrenamt",
    label: "Ehrenamtspauschale",
    betrag: 80,
    beschreibung: "§ 3 Nr. 26a EStG — gemeinnützige Funktionen",
    schritt:
      "80 EUR Ehrenamtspauschale — frag bei deiner lokalen Freiwilligenagentur nach administrativen Rollen (Vorstand, Kassenwart, Platzwart).",
  },
  passiv: {
    id: "passiv",
    label: "Passive Einkommen",
    betrag: 0,
    beschreibung: "Vermietung + Kapital — nicht anrechenbar",
    schritt:
      "Passive Einkommen — prüfe Vermietung (Zimmer via WG-Gesucht) und Tagesgeld-Vergleich. Beides wird bei ALG I NICHT angerechnet.",
  },
};

function formatEur(n: number): string {
  return new Intl.NumberFormat("de-DE").format(n) + " EUR";
}

function formatDate(): string {
  return new Date().toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function buildPlanMailHtml(payload: NewsletterTokenPayload): string {
  const aktive = payload.aktivKarten
    .map((id) => PAUSCHALEN[id])
    .filter((p): p is PauschaleInfo => Boolean(p));

  const mitBetrag = aktive.filter((p) => p.betrag > 0);
  const hatPassiv = aktive.some((p) => p.id === "passiv");

  const zusammensetzungRows = mitBetrag
    .map(
      (p) => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #e6eaf0;color:#0f1f3d;">${p.label}</td>
      <td style="padding:8px 0;border-bottom:1px solid #e6eaf0;text-align:right;color:#00867a;font-weight:700;">+${formatEur(p.betrag)}</td>
    </tr>`,
    )
    .join("");

  const schritteList = aktive
    .map(
      (p, i) => `
    <tr><td style="padding:8px 0;">
      <table cellpadding="0" cellspacing="0" style="width:100%;">
        <tr>
          <td style="width:32px;vertical-align:top;">
            <div style="background:#00b89f;color:#fff;border-radius:16px;width:28px;height:28px;text-align:center;font-weight:800;line-height:28px;font-size:13px;">${i + 1}</div>
          </td>
          <td style="color:#334258;font-size:14px;line-height:1.5;padding-left:12px;">
            ${p.schritt}
          </td>
        </tr>
      </table>
    </td></tr>`,
    )
    .join("");

  const warnbox15h =
    payload.stunden >= 15
      ? `
    <div style="background:#fee2e2;border:2px solid #fca5a5;border-radius:12px;padding:16px;margin:24px 0;color:#7f1d1d;font-size:14px;">
      <strong>Stunden-Warnung:</strong> Du darfst max. 14 Std. 59 Min. pro Woche arbeiten. Ab 15 Stunden verlierst du ALG I komplett. Aktuell liegst du bei ${payload.stunden} Stunden — reduziere zuerst, dann setze den Plan um.
    </div>`
      : `
    <div style="background:#fef3c7;border:2px solid #fde68a;border-radius:12px;padding:16px;margin:24px 0;color:#78350f;font-size:14px;">
      <strong>Die 15-Stunden-Regel:</strong> Du darfst max. 14 Std. 59 Min. pro Woche arbeiten. Ab 15 Stunden verlierst du ALG I komplett.
    </div>`;

  const passivHinweis = hatPassiv
    ? `<p style="color:#334258;font-size:14px;margin:12px 0 0;">+ <strong>unbegrenzt aus Vermietung und Kapital</strong> — diese Einkünfte sind nicht anrechenbar.</p>`
    : "";

  return `<!DOCTYPE html>
<html lang="de"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Dein Plan</title>
</head>
<body style="margin:0;padding:0;background:#faf8f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0f1f3d;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#faf8f4;">
<tr><td align="center" style="padding:24px 12px;">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;padding:32px;">

  <tr><td style="padding-bottom:8px;color:#6b7a94;font-size:12px;text-transform:uppercase;letter-spacing:1.5px;">
    Dein Plan für ALG I + Nebeneinkommen · ${formatDate()}
  </td></tr>

  <tr><td align="center" style="padding:16px 0 8px;">
    <div style="font-size:48px;font-weight:900;color:#00867a;line-height:1.1;">+${formatEur(payload.gesamtFreibetrag)}</div>
    <div style="margin-top:8px;font-size:16px;color:#334258;">monatlich — abzugsfrei zu deinem ALG I von <strong>${formatEur(payload.algI)}</strong></div>
  </td></tr>

  <tr><td style="padding-top:24px;">
    <div style="font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:#6b7a94;margin-bottom:12px;">Deine Zusammensetzung</div>
    <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
      ${zusammensetzungRows}
      <tr>
        <td style="padding:12px 0;font-weight:800;color:#0f1f3d;">Gesamt monatlich</td>
        <td style="padding:12px 0;text-align:right;font-weight:800;color:#00867a;">+${formatEur(payload.gesamtFreibetrag)}</td>
      </tr>
    </table>
    ${passivHinweis}
  </td></tr>

  <tr><td>${warnbox15h}</td></tr>

  <tr><td style="padding-top:16px;">
    <div style="font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:#6b7a94;margin-bottom:12px;">So startest du</div>
    <table width="100%" cellpadding="0" cellspacing="0">
      ${schritteList}
    </table>
  </td></tr>

  <tr><td style="padding:24px 0 8px;">
    <div style="background:#fef3c7;border-radius:12px;padding:16px;color:#78350f;font-size:13px;">
      <strong>Meldepflicht (Pflicht!):</strong> Jede Nebentätigkeit muss spätestens am ersten Arbeitstag bei der Agentur für Arbeit gemeldet werden. Hotline: <strong>0800 4 5555 00</strong>
    </div>
  </td></tr>

  <tr><td style="padding-top:24px;color:#8a95a8;font-size:11px;line-height:1.5;">
    Dies ist keine Rechtsberatung. Stand: April 2026. Für verbindliche Auskünfte: Agentur für Arbeit.
  </td></tr>

  <tr><td style="padding-top:24px;border-top:1px solid #e6eaf0;color:#8a95a8;font-size:11px;text-align:center;">
    <a href="https://wasnun-jetzt.de" style="color:#00867a;text-decoration:none;">wasnun-jetzt.de</a> ·
    <a href="https://wasnun-jetzt.de/impressum" style="color:#00867a;text-decoration:none;">Impressum</a> ·
    <a href="{{params.unsubscribe}}" style="color:#00867a;text-decoration:none;">Newsletter abmelden</a>
  </td></tr>

</table>
</td></tr>
</table>
</body></html>`;
}
