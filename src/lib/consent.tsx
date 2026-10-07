"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

/**
 * Consent-Verwaltung fuer WasNun.jetzt – DSGVO-konform.
 *
 * Drei Kategorien:
 *  - necessary  = immer true (technisch erforderlich, keine Einwilligung noetig)
 *  - analytics  = anonyme Reichweiten-/Nutzungsanalyse (z.B. Plausible, Vercel Analytics)
 *  - marketing  = eingebettete Drittanbieter-Inhalte, Affiliate-Tracking-Pixel,
 *                 externe Vorschauen
 *
 * Aktuell werden auf wasnun.jetzt noch keine Analyse- oder Marketing-Dienste
 * geladen. Die Kategorien sind vorbereitet, damit bei spaeterem Einbau
 * (z.B. Plausible oder Affiliate-Tracking) keine Anpassung an der
 * Consent-Architektur mehr noetig ist.
 */

export type ConsentCategories = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
};

type Decision = "pending" | "decided";

type ConsentContextValue = {
  decision: Decision;
  categories: ConsentCategories;
  hydrated: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  save: (partial: Partial<Omit<ConsentCategories, "necessary">>) => void;
  reset: () => void;
};

const STORAGE_KEY = "wasnun-consent-v1";

const DEFAULT_CATEGORIES: ConsentCategories = {
  necessary: true,
  analytics: false,
  marketing: false,
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

type StoredShape = {
  analytics?: unknown;
  marketing?: unknown;
};

type Gespeichert = {
  decision: Decision;
  categories: ConsentCategories;
};

const NICHT_ENTSCHIEDEN: Gespeichert = {
  decision: "pending",
  categories: DEFAULT_CATEGORIES,
};

/** Rohwert aus localStorage (null = nichts gespeichert oder nicht lesbar). */
function readRaw(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

/** Rohwert -> Entscheidung. Alles Unlesbare = nicht entschieden, nichts eingewilligt. */
function parseStored(raw: string | null): Gespeichert {
  if (!raw) return NICHT_ENTSCHIEDEN;
  try {
    const parsed = JSON.parse(raw) as StoredShape;
    return {
      decision: "decided",
      categories: {
        necessary: true,
        analytics: parsed.analytics === true,
        marketing: parsed.marketing === true,
      },
    };
  } catch {
    return NICHT_ENTSCHIEDEN;
  }
}

function toRaw(categories: ConsentCategories): string {
  return JSON.stringify({
    analytics: categories.analytics,
    marketing: categories.marketing,
    ts: Date.now(),
  });
}

/**
 * Kleiner Speicher fuer `useSyncExternalStore`: liest localStorage und haelt
 * einen Merker im Arbeitsspeicher, falls Schreiben/Loeschen scheitert
 * (Privatmodus) – dann gilt die Entscheidung trotzdem fuer diese Sitzung,
 * der Banner erscheint beim naechsten Laden wieder.
 */
function createConsentStore() {
  const listeners = new Set<() => void>();
  // undefined = kein Merker, localStorage ist massgeblich
  let merker: { raw: string | null } | undefined;

  function melden() {
    listeners.forEach((l) => l());
  }

  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      // Synchronisation zwischen Tabs
      function onStorage(event: StorageEvent) {
        if (event.key !== STORAGE_KEY) return;
        merker = undefined;
        listener();
      }
      window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", onStorage);
      };
    },
    getSnapshot(): string | null {
      return merker ? merker.raw : readRaw();
    },
    schreiben(categories: ConsentCategories) {
      const raw = toRaw(categories);
      try {
        window.localStorage.setItem(STORAGE_KEY, raw);
        merker = undefined;
      } catch {
        // localStorage evtl. deaktiviert (Privatmodus) – Banner erscheint dann jedes Mal neu
        merker = { raw };
      }
      melden();
    },
    loeschen() {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
        merker = undefined;
      } catch {
        merker = { raw: null };
      }
      melden();
    },
  };
}

const nichtsAbonnieren = () => () => {};
const istHydriert = () => true;
const nochNichtHydriert = () => false;

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState(createConsentStore);

  // Server-Snapshot = sicherer Standard (nicht entschieden, nichts eingewilligt).
  // Im Browser liefert React nach der Hydration den echten localStorage-Wert.
  const raw = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    () => null,
  );
  const { decision, categories } = useMemo(() => parseStored(raw), [raw]);

  // true erst nach Hydration (Server und Hydration-Durchlauf: false)
  const hydrated = useSyncExternalStore(
    nichtsAbonnieren,
    istHydriert,
    nochNichtHydriert,
  );

  const acceptAll = useCallback(() => {
    store.schreiben({ necessary: true, analytics: true, marketing: true });
  }, [store]);

  const rejectAll = useCallback(() => {
    store.schreiben({ necessary: true, analytics: false, marketing: false });
  }, [store]);

  const save = useCallback(
    (partial: Partial<Omit<ConsentCategories, "necessary">>) => {
      store.schreiben({
        necessary: true,
        analytics: partial.analytics ?? categories.analytics,
        marketing: partial.marketing ?? categories.marketing,
      });
    },
    [store, categories.analytics, categories.marketing],
  );

  const reset = useCallback(() => {
    store.loeschen();
  }, [store]);

  const value = useMemo<ConsentContextValue>(
    () => ({
      decision,
      categories,
      hydrated,
      acceptAll,
      rejectAll,
      save,
      reset,
    }),
    [decision, categories, hydrated, acceptAll, rejectAll, save, reset],
  );

  return (
    <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>
  );
}

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) {
    throw new Error("useConsent muss innerhalb von <ConsentProvider> verwendet werden.");
  }
  return ctx;
}
