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
  algI?: unknown;
  stunden?: unknown;
  aktivKarten?: unknown;
  gesamtFreibetrag?: unknown;
};

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

  // Token mit Plan-Daten signieren (7 Tage gueltig)
  const token = createToken({
    email: body.email,
    algI: body.algI,
    stunden: body.stunden,
    aktivKarten,
    gesamtFreibetrag: body.gesamtFreibetrag,
  });

  const confirmUrl = `${BASE_URL}/api/newsletter/confirm?token=${encodeURIComponent(token)}`;

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
<html lang="de"><body style="margin:0;padding:0;background:#faf8f4;font-family:-apple-system,BlinkMacSystemFont,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#faf8f4;">
<tr><td align="center" style="padding:32px 16px;">
<table width="500" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;padding:32px;max-width:500px;">
  <tr><td>
    <h1 style="color:#0f1f3d;font-size:22px;margin:0 0 16px;">Bestätige deine Anmeldung</h1>
    <p style="color:#334258;font-size:15px;line-height:1.6;margin:0 0 24px;">
      Du hast deinen persönlichen ALG-I-Plan angefordert. Klick einmal hier, dann bekommst du ihn per Mail:
    </p>
    <p style="margin:24px 0;">
      <a href="${confirmUrl}" style="display:inline-block;background:#00b89f;color:#fff;text-decoration:none;padding:14px 28px;border-radius:10px;font-weight:700;">Plan jetzt zuschicken</a>
    </p>
    <p style="color:#6b7a94;font-size:12px;line-height:1.5;margin:24px 0 0;">
      Wenn du diese Anmeldung nicht angefragt hast, ignoriere die Mail einfach — es passiert nichts. Der Link ist 7 Tage gültig.
    </p>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>`;

  const brevoRes = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": brevoKey,
    },
    body: JSON.stringify({
      sender: { name: "Wasnun-jetzt", email: "noreply@wasnun-jetzt.de" },
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
