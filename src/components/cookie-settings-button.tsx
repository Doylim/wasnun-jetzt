"use client";

import {
  Shield,
  BarChart3,
  Megaphone,
  RotateCcw,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { useConsent } from "@/lib/consent";
import { ToggleSwitch } from "@/components/cookie-banner";

type Props = {
  /** "default" = Karten-Darstellung auf /datenschutz. "footer" = schlichter Link. */
  variant?: "default" | "footer";
};

export function CookieSettingsButton({ variant = "default" }: Props) {
  const { decision, categories, hydrated, acceptAll, rejectAll, save, reset } =
    useConsent();

  if (!hydrated) {
    if (variant === "footer") {
      return (
        <span className="text-sm text-navy-300">Cookie-Einstellungen</span>
      );
    }
    return null;
  }

  if (variant === "footer") {
    return (
      <button
        type="button"
        onClick={reset}
        className="text-left text-sm text-navy-200 transition-colors hover:text-teal-400"
      >
        Cookie-Einstellungen
      </button>
    );
  }

  const decided = decision === "decided";

  return (
    <div className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-sm">
      {/* Status-Header */}
      <div className="flex items-center justify-between gap-3 border-b border-navy-50 bg-navy-50/40 px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
              decided
                ? "bg-[var(--brand-soft)] text-[var(--brand)]"
                : "bg-navy-100 text-navy-500"
            }`}
          >
            {decided ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <Clock className="h-4 w-4" />
            )}
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-navy-500">
              Aktueller Status
            </p>
            <p className="text-sm font-bold text-navy-900">
              {decided ? "Entscheidung gespeichert" : "Noch nicht entschieden"}
            </p>
          </div>
        </div>

        {decided ? (
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 rounded-full border border-navy-100 bg-white px-3 py-1.5 text-xs font-semibold text-navy-600 transition-colors hover:border-navy-200 hover:text-navy-900"
          >
            <RotateCcw className="h-3 w-3" aria-hidden />
            Zurücksetzen
          </button>
        ) : null}
      </div>

      {/* Kategorien */}
      <div className="space-y-2.5 p-5">
        <CategoryRowDS
          icon={<Shield className="h-4 w-4" />}
          title="Notwendig"
          description="Für Grundfunktionen der Webseite erforderlich. Immer aktiv."
          checked
          locked
        />
        <CategoryRowDS
          icon={<BarChart3 className="h-4 w-4" />}
          title="Analyse"
          description="Anonyme Reichweitenmessung. Keine personenbezogenen Profile."
          checked={categories.analytics}
          onChange={(v) => save({ analytics: v })}
        />
        <CategoryRowDS
          icon={<Megaphone className="h-4 w-4" />}
          title="Marketing & externe Inhalte"
          description="Affiliate-Tracking-Pixel und eingebettete Drittanbieter-Vorschauen."
          checked={categories.marketing}
          onChange={(v) => save({ marketing: v })}
        />
      </div>

      {/* Aktionen */}
      <div className="grid grid-cols-2 gap-2 border-t border-navy-50 bg-navy-50/30 px-4 py-4 sm:px-5">
        <button
          type="button"
          onClick={rejectAll}
          className="inline-flex items-center justify-center rounded-full bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900 sm:px-5"
        >
          Nur notwendige
        </button>
        <button
          type="button"
          onClick={acceptAll}
          className="inline-flex items-center justify-center rounded-full bg-[var(--brand)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-[var(--brand)]/25 transition-colors hover:bg-[var(--brand-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand)] sm:px-5"
        >
          Alle akzeptieren
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Lokale Kategorie-Zeile fuer den Datenschutz-Block                   */
/* ------------------------------------------------------------------ */

type CategoryRowDSProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  locked?: boolean;
  onChange?: (next: boolean) => void;
};

function CategoryRowDS({
  icon,
  title,
  description,
  checked,
  locked,
  onChange,
}: CategoryRowDSProps) {
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border bg-white p-3.5 transition-colors ${
        locked
          ? "border-navy-100"
          : "border-navy-100 hover:border-navy-200"
      }`}
    >
      <span
        aria-hidden
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
          checked
            ? "bg-[var(--brand-soft)] text-[var(--brand)]"
            : "bg-navy-50 text-navy-400"
        }`}
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-navy-900">
            {title}
          </span>
          <ToggleSwitch
            checked={checked}
            locked={locked}
            onChange={onChange}
            ariaLabel={title}
          />
        </div>
        <p className="mt-0.5 text-xs leading-relaxed text-navy-500">
          {description}
        </p>
      </div>
    </div>
  );
}
