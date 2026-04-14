import { NextResponse } from "next/server";

// In-Memory-Rate-Limit: max. 3 Requests pro IP pro Minute.
// Reicht für MVP; vor Go-Live durch echten Provider ersetzen.
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

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Ungültige Anfrage." },
      { status: 400 },
    );
  }

  const email = (body as { email?: unknown })?.email;
  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "Bitte gültige E-Mail-Adresse eintragen." },
      { status: 400 },
    );
  }

  // TODO: echten Newsletter-Provider anbinden
  // (Resend / Plunk / Mailchimp) vor Go-Live.
  // Für jetzt nur loggen.
  console.log("[newsletter] Neue Eintragung:", email);

  return NextResponse.json({ ok: true });
}
