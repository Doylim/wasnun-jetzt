import { NextResponse } from "next/server";
import { createToken } from "@/lib/token";

// In-Memory-Rate-Limit: max. 3 Requests pro IP pro Minute.
const buckets = new Map<string, { count: number; reset: number }>();
const LIMIT = 3;
const WINDOW_MS = 60_000;

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const bucket = buckets.get(ip);
  if (!bucket || bucket.reset < now) {
    buckets.set(ip, { count: 1, reset: now + WINDOW_MS });
    return true;
  }
  if (bucket.count >= LIMIT) return false;
  bucket.count += 1;
  return true;
}

function isValidEmail(email: unknown): email is string {
  return (
    typeof email === "string" &&
    email.length > 3 &&
    email.length < 255 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  );
}

const BEKANNTE_KARTEN = new Set([
  "grundfreibetrag",
  "uebungsleiter",
  "ehrenamt",
  "passiv",
]);

function normalizeAktivKarten(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  return input.filter(
    (x): x is string => typeof x === "string" && BEKANNTE_KARTEN.has(x),
  );
}

function isSafeNumber(n: unknown, max: number): n is number {
  return typeof n === "number" && Number.isFinite(n) && n >= 0 && n <= max;
}

type Payload = {
  email?: unknown;
  vorname?: unknown;
  algI?: unknown;
  stunden?: unknown;
  aktivKarten?: unknown;
  gesamtFreibetrag?: unknown;
};

function normalizeVorname(input: unknown): string | undefined {
  if (typeof input !== "string") return undefined;
  const trimmed = input.trim().slice(0, 50);
  return trimmed.length > 0 ? trimmed : undefined;
}

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://wasnun-jetzt.de";

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (!rateLimit(ip)) {
    return NextResponse.json(
      { error: "Zu viele Anfragen. Bitte warte eine Minute." },
      { status: 429 },
    );
  }

  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  if (!isValidEmail(body.email)) {
    return NextResponse.json(
      { error: "Bitte gültige E-Mail-Adresse eintragen." },
      { status: 400 },
    );
  }
  if (!isSafeNumber(body.algI, 10_000)) {
    return NextResponse.json({ error: "Ungültiger ALG-I-Betrag." }, { status: 400 });
  }
  if (!isSafeNumber(body.stunden, 50)) {
    return NextResponse.json({ error: "Ungültige Stunden-Angabe." }, { status: 400 });
  }
  if (!isSafeNumber(body.gesamtFreibetrag, 5_000)) {
    return NextResponse.json({ error: "Ungültiger Freibetrag." }, { status: 400 });
  }
  const aktivKarten = normalizeAktivKarten(body.aktivKarten);
  if (aktivKarten.length === 0) {
    return NextResponse.json(
      { error: "Mindestens eine Pauschale muss aktiv sein." },
      { status: 400 },
    );
  }

  const vorname = normalizeVorname(body.vorname);

  // Token mit Plan-Daten signieren (7 Tage gueltig)
  const token = createToken({
    email: body.email,
    vorname,
    algI: body.algI,
    stunden: body.stunden,
    aktivKarten,
    gesamtFreibetrag: body.gesamtFreibetrag,
  });

  // Token als Path-Segment statt Query-Parameter:
  // Brevo's Click-Tracking zerstoert sonst den ?token=... Query-String.
  const confirmUrl = `${BASE_URL}/api/newsletter/confirm/${encodeURIComponent(token)}`;

  // Brevo Confirm-Mail senden (kurz und funktional)
  const brevoKey = process.env.BREVO_API_KEY;
  if (!brevoKey) {
    console.error("[newsletter] BREVO_API_KEY fehlt");
    return NextResponse.json(
      { error: "Mail-Service nicht konfiguriert." },
      { status: 500 },
    );
  }

  const confirmHtml = `<!DOCTYPE html>
<html lang="de" xmlns:v="urn:schemas-microsoft-com:vml"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
<title>Bestätige deine Anmeldung</title>
</head>
<body style="margin:0;padding:0;background:#faf8f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#faf8f4;">
<tr><td align="center" style="padding:32px 16px;">
<table width="500" align="center" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;max-width:500px;margin:0 auto;box-shadow:0 4px 24px rgba(15,31,61,0.08);">
  <tr><td style="padding:40px 32px;text-align:center;">
    <div style="display:inline-block;background:#e6f7f3;color:#00867a;padding:6px 14px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:20px;">Bestätigung</div>
    <h1 style="color:#0f1f3d;font-size:26px;font-weight:900;margin:0 0 16px;line-height:1.2;">Nur noch ein Klick.</h1>
    <p style="color:#334258;font-size:16px;line-height:1.6;margin:0 0 32px;">
      Du hast deinen persönlichen ALG-I-Plan angefordert. Bestätige kurz deine E-Mail — dann kommt er sofort zu dir:
    </p>
    <!-- Bulletproof Button: table + bgcolor + <a> display:block -->
    <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto;">
      <tr><td align="center" bgcolor="#00b89f" style="background:#00b89f;border-radius:10px;">
        <!--[if mso]>
        <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${confirmUrl}" style="height:52px;v-text-anchor:middle;width:280px;" arcsize="20%" stroke="f" fillcolor="#00b89f">
          <w:anchorlock/>
          <center style="color:#ffffff;font-family:'Segoe UI',sans-serif;font-size:16px;font-weight:700;">Plan jetzt zuschicken →</center>
        </v:roundrect>
        <![endif]-->
        <!--[if !mso]><!-- -->
        <a href="${confirmUrl}" style="display:inline-block;padding:16px 36px;color:#ffffff !important;text-decoration:none;font-weight:700;font-size:16px;line-height:20px;mso-hide:all;">Plan jetzt zuschicken →</a>
        <!--<![endif]-->
      </td></tr>
    </table>
    <p style="color:#6b7a94;font-size:13px;line-height:1.6;margin:32px 0 0;">
      Falls der Button nicht geht, kopiere diesen Link:<br>
      <a href="${confirmUrl}" style="color:#00867a;word-break:break-all;">${confirmUrl}</a>
    </p>
    <p style="color:#8a95a8;font-size:12px;line-height:1.5;margin:24px 0 0;">
      Der Link ist 7 Tage gültig. Wenn du die Anmeldung nicht angefragt hast, ignoriere die Mail einfach.
    </p>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>`;

  const senderEmail =
    process.env.BREVO_SENDER_EMAIL || "noreply@wasnun-jetzt.de";
  const senderName = process.env.BREVO_SENDER_NAME || "Wasnun-Jetzt";

  const brevoRes = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": brevoKey,
    },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: [{ email: body.email }],
      subject: "Bestätige deine Anmeldung — dein Plan wartet",
      htmlContent: confirmHtml,
    }),
  });

  if (!brevoRes.ok) {
    const errText = await brevoRes.text();
    console.error("[newsletter] Brevo-Fehler:", brevoRes.status, errText);
    return NextResponse.json(
      { error: "Mail konnte nicht gesendet werden." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
