"use client";

import { useState, type FormEvent } from "react";
import { Check, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  aktivKarten: Set<string>;
  gesamtFreibetrag: number;
};

type Status = "idle" | "loading" | "success" | "error";

export function NewsletterForm({ aktivKarten, gesamtFreibetrag }: Props) {
  const [email, setEmail] = useState("");
  const [vorname, setVorname] = useState("");
  const [algIInput, setAlgIInput] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [fehler, setFehler] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setFehler(null);

    const algINumber = algIInput ? parseFloat(algIInput) : 0;

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          vorname: vorname.trim() || undefined,
          algI: Number.isFinite(algINumber) ? algINumber : 0,
          stunden: 0,
          aktivKarten: Array.from(aktivKarten),
          gesamtFreibetrag,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "Etwas ist schiefgelaufen.");
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setFehler(
        err instanceof Error ? err.message : "Probiere es später nochmal.",
      );
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-start gap-3 rounded-3xl border-2 border-teal-300 bg-teal-50 p-6 text-teal-900">
        <Check className="mt-0.5 h-6 w-6 shrink-0 text-teal-600" aria-hidden="true" />
        <div>
          <div className="text-lg font-black">Check dein Postfach</div>
          <div className="mt-1 text-sm">
            Wir haben dir eine Bestätigungs-Mail geschickt. Klick den Link darin
            — dann kommt dein Plan. (Auch Spam-Ordner prüfen.)
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-navy-100 bg-white p-6"
      aria-label="Plan per E-Mail anfordern"
    >
      <div className="mb-1 flex items-center gap-2 text-base font-black text-navy-900">
        <Mail className="h-5 w-5 text-teal-600" aria-hidden="true" />
        Plan per E-Mail — kostenlos
      </div>
      <p className="mb-4 text-sm text-navy-600">
        Du bekommst deinen persönlichen Plan sofort nach Bestätigung + 1× im
        Monat neue Tipps. Abmeldung jederzeit mit einem Klick.
      </p>

      <div className="space-y-3">
        <Input
          type="text"
          placeholder="Vorname (optional)"
          value={vorname}
          onChange={(e) => setVorname(e.target.value)}
          disabled={status === "loading"}
          aria-label="Vorname (optional)"
          className="h-12 text-base"
          maxLength={50}
        />

        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            type="email"
            required
            placeholder="deine@email.de"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading"}
            aria-label="E-Mail-Adresse"
            className="h-12 flex-1 text-base"
          />
          <Button
            type="submit"
            variant="primary"
            disabled={status === "loading"}
            className="h-12"
          >
            {status === "loading" ? "Sende…" : "Plan zuschicken"}
          </Button>
        </div>
      </div>

      <div className="mt-4 border-t border-navy-100 pt-3">
        <label
          htmlFor="newsletter-algi"
          className="mb-1 block text-xs text-navy-500"
        >
          Optional: dein ALG-I-Betrag für eine persönliche Mail
        </label>
        <Input
          id="newsletter-algi"
          type="number"
          placeholder="z. B. 1.200"
          value={algIInput}
          onChange={(e) => setAlgIInput(e.target.value)}
          disabled={status === "loading"}
          className="h-9 max-w-[180px] text-sm"
          min={0}
          max={10000}
          inputMode="numeric"
        />
      </div>

      {fehler && (
        <div role="alert" className="mt-3 text-sm text-red-700">
          {fehler}
        </div>
      )}
      <p className="mt-3 text-xs text-navy-500">
        Freiwillig. Daten werden nur für Plan + Tipps genutzt
        (<a href="/datenschutz" className="underline">Datenschutz</a>).
      </p>
    </form>
  );
}
