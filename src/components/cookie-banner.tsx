"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Shield,
  BarChart3,
  Megaphone,
  Settings2,
  ChevronDown,
} from "lucide-react";
import { useConsent } from "@/lib/consent";
import { SITE_NAME } from "@/lib/constants";

/**
 * Cookie-Banner – DSGVO-konform und visuell konsistent zum WasNun.jetzt-Design.
 *
 * Mobile-Layout:
 *  - Bottom-Sheet (flush am unteren Rand, oben abgerundet, mit safe-area-inset)
 *  - Reject + Accept SIDE-BY-SIDE
 *  - "Einstellungen" / "Auswahl speichern" als separater Text-Button OBEN
 *
 * Desktop-Layout:
 *  - Schwebende Card mit max-width
 *  - Drei Buttons in einer Reihe (Reject · Settings/Save · Accept)
 *
 * DSGVO:
 *  - "Alle akzeptieren" und "Nur notwendige" sind visuell gleichwertig
 *    (beide solid, gleiche Groesse, gleiche Prominenz)
 *  - Einwilligung wird in localStorage gespeichert (Key: wasnun-consent-v1)
 */
export function CookieBanner() {
  const { decision, hydrated, categories, acceptAll, rejectAll, save } =
    useConsent();

  const [details, setDetails] = useState(false);
  const [auswahl, setAuswahl] = useState({
    analytics: categories.analytics,
    marketing: categories.marketing,
  });

  if (!hydrated) return null;
  if (decision !== "pending") return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie-Einstellungen"
      aria-modal="false"
      className="fixed inset-x-0 bottom-0 z-[90] sm:px-6 sm:pb-6"
      style={{
        animation: "wnj-cookie-slide 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <style>{`
        @keyframes wnj-cookie-slide {
          from { transform: translateY(110%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes wnj-cookie-fade {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="relative mx-auto max-h-[88vh] max-w-3xl overflow-y-auto overflow-x-hidden rounded-t-3xl border border-b-0 border-navy-100 bg-white/95 shadow-2xl shadow-navy-900/15 ring-1 ring-navy-900/5 backdrop-blur-md sm:max-h-[85vh] sm:rounded-3xl sm:border-b">
        {/* Brand-Akzent oben + dezenter Glow rechts */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-[var(--brand)] to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[var(--brand)]/10 blur-3xl"
        />

        {/* Header mit Logo + Markenkontext */}
        <div className="relative px-5 pt-5 sm:px-8 sm:pt-7">
          <div className="flex items-start gap-3 sm:gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/logo-submark.svg"
              alt={`${SITE_NAME} Logo`}
              width={44}
              height={44}
              className="h-10 w-10 shrink-0 rounded-xl shadow-sm ring-1 ring-navy-900/5 sm:h-11 sm:w-11 sm:rounded-[14px]"
            />
            <div className="min-w-0 flex-1">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-navy-100 bg-white px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-navy-600">
                <span
                  aria-hidden
                  className="h-1 w-1 rounded-full bg-[var(--brand)]"
                />
                Cookie-Hinweis
              </span>
              <h2 className="mt-1.5 text-[15px] font-bold leading-tight tracking-tight text-navy-900 sm:text-lg">
                Du entscheidest, was geladen wird.
              </h2>
              <p className="mt-1 hidden text-sm text-navy-500 sm:block">
                Wir laden nur das Notwendigste – und nichts ohne deine Zustimmung.
              </p>
            </div>
          </div>
        </div>

        {/* Body Text */}
        <div className="relative px-5 pb-4 pt-3 sm:px-8 sm:pb-5 sm:pt-4">
          <p className="text-[13px] leading-relaxed text-navy-600 sm:text-sm">
            Wir nutzen{" "}
            <strong className="font-semibold text-navy-900">notwendige</strong>{" "}
            Speichervorgänge für die Grundfunktion des Rechners.{" "}
            <span className="hidden sm:inline">
              Mit deiner Einwilligung können wir{" "}
              <strong className="font-semibold text-navy-900">Analyse</strong>
              -Dienste und{" "}
              <strong className="font-semibold text-navy-900">Marketing</strong>
              -Inhalte (z. B. Affiliate-Tracking) aktivieren.
            </span>
            <span className="sm:hidden">
              {" "}
              Mit Einwilligung auch{" "}
              <strong className="font-semibold text-navy-900">Analyse</strong>{" "}
              und{" "}
              <strong className="font-semibold text-navy-900">Marketing</strong>
              .
            </span>{" "}
            Mehr in der{" "}
            <Link
              href="/datenschutz"
              className="font-semibold text-[var(--brand)] underline-offset-2 hover:underline"
            >
              Datenschutzerklärung
            </Link>
            .
          </p>
        </div>

        {/* Details-Panel (Kategorien) */}
        {details ? (
          <div
            className="relative border-t border-navy-50 bg-navy-50/40 px-5 py-4 sm:px-8 sm:py-5"
            style={{ animation: "wnj-cookie-fade 0.3s ease-out" }}
          >
            <div className="space-y-2">
              <CategoryRow
                icon={<Shield className="h-4 w-4" />}
                title="Notwendig"
                description="Für Grundfunktionen erforderlich. Immer aktiv."
                checked
                locked
              />
              <CategoryRow
                icon={<BarChart3 className="h-4 w-4" />}
                title="Analyse"
                description="Anonyme Reichweitenmessung. Keine Profile."
                checked={auswahl.analytics}
                onChange={(v) =>
                  setAuswahl((prev) => ({ ...prev, analytics: v }))
                }
              />
              <CategoryRow
                icon={<Megaphone className="h-4 w-4" />}
                title="Marketing & externe Inhalte"
                description="Affiliate-Tracking und eingebettete Drittanbieter-Vorschauen."
                checked={auswahl.marketing}
                onChange={(v) =>
                  setAuswahl((prev) => ({ ...prev, marketing: v }))
                }
              />
            </div>
          </div>
        ) : null}

        {/* Footer-Buttons */}
        <div
          className="relative border-t border-navy-50 bg-white px-5 pt-3 sm:px-8 sm:pt-5"
          style={{
            paddingBottom:
              "max(env(safe-area-inset-bottom, 0.75rem), 0.75rem)",
          }}
        >
          <div className="space-y-2 sm:space-y-0">
            {/* Mobile: Settings/Save oben als separater Button (volle Breite) */}
            <div className="sm:hidden">
              {!details ? (
                <button
                  type="button"
                  onClick={() => setDetails(true)}
                  aria-expanded={false}
                  className="group inline-flex w-full items-center justify-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-navy-500 transition-colors hover:text-navy-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900"
                >
                  <Settings2
                    className="h-3.5 w-3.5 transition-transform group-hover:rotate-45"
                    aria-hidden
                  />
                  Einstellungen anpassen
                  <ChevronDown
                    className="h-3 w-3 opacity-60 transition-transform group-hover:translate-y-0.5"
                    aria-hidden
                  />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => save(auswahl)}
                  className="inline-flex w-full items-center justify-center rounded-full border border-navy-200 bg-white px-5 py-2.5 text-sm font-semibold text-navy-900 transition-colors hover:border-navy-900 hover:bg-navy-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900"
                >
                  Auswahl speichern
                </button>
              )}
            </div>

            {/* Reject + Accept (Desktop hat zusätzlich Settings/Save in der Mitte) */}
            <div className="grid grid-cols-2 gap-2 pb-3 sm:flex sm:items-center sm:gap-2 sm:pb-5">
              <button
                type="button"
                onClick={rejectAll}
                className="inline-flex items-center justify-center rounded-full bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-navy-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900 sm:flex-1 sm:px-5"
              >
                Nur notwendige
              </button>

              {/* Desktop-only Settings/Save in der Mitte */}
              {!details ? (
                <button
                  type="button"
                  onClick={() => setDetails(true)}
                  aria-expanded={false}
                  className="group hidden flex-1 items-center justify-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold text-navy-600 transition-colors hover:text-navy-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900 sm:inline-flex"
                >
                  <Settings2
                    className="h-4 w-4 transition-transform group-hover:rotate-45"
                    aria-hidden
                  />
                  Einstellungen
                  <ChevronDown
                    className="h-3.5 w-3.5 -rotate-90 opacity-60"
                    aria-hidden
                  />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => save(auswahl)}
                  className="hidden flex-1 items-center justify-center rounded-full border border-navy-200 bg-white px-5 py-2.5 text-sm font-semibold text-navy-900 transition-colors hover:border-navy-900 hover:bg-navy-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900 sm:inline-flex"
                >
                  Auswahl speichern
                </button>
              )}

              <button
                type="button"
                onClick={acceptAll}
                className="inline-flex items-center justify-center rounded-full bg-[var(--brand)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-[var(--brand)]/25 transition-all hover:bg-[var(--brand-hover)] hover:shadow-md hover:shadow-[var(--brand)]/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand)] sm:flex-1 sm:px-5"
              >
                Alle akzeptieren
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Wiederverwendbare Sub-Komponenten                                   */
/* ------------------------------------------------------------------ */

type CategoryRowProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  locked?: boolean;
  onChange?: (next: boolean) => void;
};

function CategoryRow({
  icon,
  title,
  description,
  checked,
  locked,
  onChange,
}: CategoryRowProps) {
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border bg-white p-3 transition-colors sm:p-3.5 ${
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
        <p className="mt-0.5 text-[11px] leading-snug text-navy-500 sm:text-xs sm:leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

type ToggleSwitchProps = {
  checked: boolean;
  locked?: boolean;
  onChange?: (next: boolean) => void;
  ariaLabel: string;
};

export function ToggleSwitch({
  checked,
  locked,
  onChange,
  ariaLabel,
}: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={locked}
      onClick={() => onChange?.(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand)] ${
        locked
          ? "cursor-not-allowed bg-[var(--brand)]/40"
          : checked
            ? "bg-[var(--brand)] hover:bg-[var(--brand-hover)]"
            : "bg-navy-200 hover:bg-navy-300"
      }`}
    >
      <span
        aria-hidden
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? "translate-x-[18px]" : "translate-x-[3px]"
        }`}
      />
    </button>
  );
}
