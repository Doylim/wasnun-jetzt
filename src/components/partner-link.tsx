import { ArrowUpRight } from "lucide-react";
import type { Partner } from "@/lib/partner";

/**
 * Zentrale Komponente fuer ALLE Affiliate-Links auf wasnun.jetzt.
 *
 * Erzwingt drei Dinge an einer Stelle, statt sie an jeder Aufrufstelle
 * neu zu schreiben (und zu vergessen):
 *
 *  1. `rel="sponsored noopener noreferrer"` – Pflicht fuer bezahlte Links
 *     (Google-Webmaster-Guidelines + Sicherheits-Hardening).
 *  2. `target="_blank"` – Affiliate-Linkziel oeffnet in neuem Tab,
 *     Nutzer verliert seinen Fortschritt auf wasnun.jetzt nicht.
 *  3. Sichtbare Werbe-Kennzeichnung als Badge/Hinweistext (§ 6 TMG,
 *     UWG, Medienstaatsvertrag).
 *
 * Zusaetzlich: filtert defensiv noch einmal auf `status === "aktiv"`,
 * falls jemand der Komponente direkt einen `Partner` mit Status "geplant"
 * uebergibt. In dem Fall wird der Link NICHT gerendert.
 */

type Props = {
  partner: Partner;
  /** Wie der Hinweis dargestellt wird. */
  variant?: "card" | "inline" | "button";
  /** Sichtbarer Linktext. Fallback = partner.name. */
  children?: React.ReactNode;
  /** Zusaetzliche Tailwind-Klassen. */
  className?: string;
};

const REL = "sponsored noopener noreferrer";

export function PartnerLink({
  partner,
  variant = "card",
  children,
  className = "",
}: Props) {
  if (partner.status !== "aktiv") return null;

  const label = children ?? partner.name;

  if (variant === "inline") {
    return (
      <span className={`inline-flex items-center gap-1.5 ${className}`}>
        <a
          href={partner.url}
          target="_blank"
          rel={REL}
          className="inline-flex items-center gap-1 font-semibold text-teal-700 underline-offset-2 hover:underline"
        >
          {label}
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
        </a>
        <span
          aria-label="Werbung – Affiliate-Link"
          className="inline-flex shrink-0 items-center rounded-full border border-amber-brand/40 bg-amber-brand/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-brand"
        >
          Werbung
        </span>
      </span>
    );
  }

  if (variant === "button") {
    return (
      <span className={`inline-flex flex-col items-start gap-1 ${className}`}>
        <a
          href={partner.url}
          target="_blank"
          rel={REL}
          className="group inline-flex items-center justify-center gap-2 rounded-full bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-teal-700/25 transition-colors hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
        >
          <span>{label}</span>
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
        </a>
        <span
          aria-label="Werbung – Affiliate-Link"
          className="inline-flex items-center rounded-full border border-amber-brand/40 bg-amber-brand/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-brand"
        >
          Werbung
        </span>
      </span>
    );
  }

  // variant === "card"
  return (
    <a
      href={partner.url}
      target="_blank"
      rel={REL}
      className={`group flex flex-col gap-2 rounded-2xl border border-navy-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-base font-bold text-navy-900 group-hover:text-teal-700">
          {label}
        </span>
        <span
          className="inline-flex shrink-0 items-center rounded-full border border-amber-brand/40 bg-amber-brand/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-brand"
          aria-label="Werbung – Affiliate-Link"
        >
          Werbung
        </span>
      </div>
      {partner.beschreibung ? (
        <p className="text-sm leading-relaxed text-navy-600">
          {partner.beschreibung}
        </p>
      ) : null}
      {partner.verdienst ? (
        <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-teal-700">
          {partner.verdienst}
        </p>
      ) : null}
      <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-teal-700">
        Zum Anbieter
        <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
      </span>
    </a>
  );
}
