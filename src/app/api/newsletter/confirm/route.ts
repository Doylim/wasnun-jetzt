import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/token";
import { buildPlanMailHtml } from "@/lib/plan-mail";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://wasnun-jetzt.de";

function errorHtml(message: string): string {
  return `<!DOCTYPE html><html lang="de"><head><meta charset="utf-8"><title>Fehler</title>
<style>body{font-family:-apple-system,sans-serif;text-align:center;padding:60px 20px;background:#faf8f4;color:#0f1f3d;}h1{color:#dc2626;}a{color:#00867a;}</style>
</head><body><h1>Das hat nicht geklappt</h1><p>${message}</p><p><a href="${BASE_URL}">Zurück zur Startseite</a></p></body></html>`;
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) {
    return new NextResponse(errorHtml("Kein Bestätigungs-Token angegeben."), {
      status: 400,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return new NextResponse(
      errorHtml("Dieser Bestätigungs-Link ist ungültig oder abgelaufen (7 Tage)."),
      { status: 410, headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }

  const brevoKey = process.env.BREVO_API_KEY;
  const listId = process.env.BREVO_LIST_ID
    ? Number(process.env.BREVO_LIST_ID)
    : null;

  if (!brevoKey) {
    console.error("[confirm] BREVO_API_KEY fehlt");
    return new NextResponse(errorHtml("Mail-Service nicht konfiguriert."), {
      status: 500,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  // 1. Brevo-Kontakt anlegen/updaten mit Custom-Attributen
  // Brevo tut nichts, wenn Kontakt schon existiert und updateEnabled=true ist.
  await fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": brevoKey,
    },
    body: JSON.stringify({
      email: payload.email,
      listIds: listId ? [listId] : undefined,
      updateEnabled: true,
      attributes: {
        ALG_I_BETRAG: payload.algI,
        STUNDEN_WOCHE: payload.stunden,
        PAUSCHALEN: payload.aktivKarten.join(","),
        GESAMT_FREIBETRAG: payload.gesamtFreibetrag,
      },
    }),
  }).catch((e) => {
    console.error("[confirm] Brevo Contact-Upsert Fehler (nicht blockierend):", e);
  });

  // 2. Plan-Mail senden
  const planMailHtml = buildPlanMailHtml(payload);
  const mailRes = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": brevoKey,
    },
    body: JSON.stringify({
      sender: { name: "Wasnun-jetzt", email: "noreply@wasnun-jetzt.de" },
      to: [{ email: payload.email }],
      subject: "Dein persönlicher ALG-I-Plan",
      htmlContent: planMailHtml,
    }),
  });

  if (!mailRes.ok) {
    const errText = await mailRes.text();
    console.error("[confirm] Brevo-Plan-Mail Fehler:", mailRes.status, errText);
    return new NextResponse(errorHtml("Die Plan-Mail konnte nicht gesendet werden. Bitte versuche es später nochmal."), {
      status: 502,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  // 3. Redirect auf Thank-You-Seite
  return NextResponse.redirect(
    new URL("/danke-plan-versendet", request.url),
    303,
  );
}
