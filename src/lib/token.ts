import crypto from "node:crypto";

export type NewsletterTokenPayload = {
  email: string;
  algI: number;
  stunden: number;
  aktivKarten: string[];
  gesamtFreibetrag: number;
  exp: number; // Unix-Millis
};

type CreateInput = Omit<NewsletterTokenPayload, "exp">;

const DEFAULT_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 Tage

function getSecret(): string {
  const secret = process.env.TOKEN_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("TOKEN_SECRET fehlt oder zu kurz (mindestens 32 Zeichen).");
  }
  return secret;
}

export function createToken(payload: CreateInput, ttlMs = DEFAULT_TTL_MS): string {
  const withExp: NewsletterTokenPayload = {
    ...payload,
    exp: Date.now() + ttlMs,
  };
  const payloadB64 = Buffer.from(JSON.stringify(withExp)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", getSecret())
    .update(payloadB64)
    .digest("base64url");
  return `${payloadB64}.${signature}`;
}

export function verifyToken(token: string): NewsletterTokenPayload | null {
  if (typeof token !== "string" || !token.includes(".")) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [payloadB64, signature] = parts;
  const expectedSignature = crypto
    .createHmac("sha256", getSecret())
    .update(payloadB64)
    .digest("base64url");

  // Constant-Time-Compare gegen Timing-Angriffe
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expectedSignature);
  if (sigBuf.length !== expBuf.length) return null;
  if (!crypto.timingSafeEqual(sigBuf, expBuf)) return null;

  let decoded: NewsletterTokenPayload;
  try {
    decoded = JSON.parse(
      Buffer.from(payloadB64, "base64url").toString("utf-8"),
    ) as NewsletterTokenPayload;
  } catch {
    return null;
  }

  if (typeof decoded.exp !== "number" || decoded.exp < Date.now()) return null;
  return decoded;
}
