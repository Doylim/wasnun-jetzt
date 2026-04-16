"use client";

import { useState, type FormEvent } from "react";
import { Check, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Status = "idle" | "loading" | "success" | "error";

type Props = {
  // Optionale Plan-Daten — werden in Task 8 (Plan-Mail) genutzt,
  // aktuell ignoriert. So bleibt Task 1 unabhängig kompilierbar.
  algI?: number;
  stunden?: number;
  aktivKarten?: Set<string>;
  gesamtFreibetrag?: number;
};

export function NewsletterForm(_props: Props = {}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [fehler, setFehler] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setFehler(null);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "Etwas ist schiefgelaufen.");
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setFehler(err instanceof Error ? err.message : "Probiere es später nochmal.");
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-center gap-3 rounded-2xl border-2 border-teal-300 bg-teal-50 p-5 text-teal-900">
        <Check className="h-6 w-6 text-teal-600" aria-hidden="true" />
        <div>
          <div className="font-bold">Danke!</div>
          <div className="text-sm">Schau in dein Postfach – dein Plan ist unterwegs.</div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-navy-100 bg-white p-5"
      aria-label="Newsletter-Anmeldung"
    >
      <div className="mb-3 flex items-center gap-2 text-sm font-bold text-navy-900">
        <Mail className="h-4 w-4 text-teal-600" aria-hidden="true" />
        Plan per E-Mail + 1× im Monat neue Tipps
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          type="email"
          required
          placeholder="deine@email.de"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading"}
          aria-label="E-Mail-Adresse"
          className="h-12 text-base"
        />
        <Button
          type="submit"
          variant="primary"
          disabled={status === "loading"}
          className="h-12"
        >
          {status === "loading" ? "Sende…" : "Eintragen"}
        </Button>
      </div>
      {fehler && (
        <div role="alert" className="mt-3 text-sm text-red-700">
          {fehler}
        </div>
      )}
      <p className="mt-3 text-xs text-navy-500">
        Freiwillig, kein Tracking. Abmeldung mit einem Klick.
      </p>
    </form>
  );
}
