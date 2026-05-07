"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
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

function readStored():
  | { decision: "decided"; categories: ConsentCategories }
  | { decision: "pending"; categories: ConsentCategories } {
  if (typeof window === "undefined") {
    return { decision: "pending", categories: DEFAULT_CATEGORIES };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { decision: "pending", categories: DEFAULT_CATEGORIES };
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
    return { decision: "pending", categories: DEFAULT_CATEGORIES };
  }
}

function writeStored(categories: ConsentCategories) {
  if (typeof window === "undefined") return;
  try {
    const payload = {
      analytics: categories.analytics,
      marketing: categories.marketing,
      ts: Date.now(),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // localStorage evtl. deaktiviert (Privatmodus) – Banner erscheint dann jedes Mal neu
  }
}

function clearStored() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [decision, setDecision] = useState<Decision>("pending");
  const [categories, setCategories] =
    useState<ConsentCategories>(DEFAULT_CATEGORIES);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const next = readStored();
    setDecision(next.decision);
    setCategories(next.categories);
    setHydrated(true);
  }, []);

  // Synchronisation zwischen Tabs
  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.key !== STORAGE_KEY) return;
      const next = readStored();
      setDecision(next.decision);
      setCategories(next.categories);
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const acceptAll = useCallback(() => {
    const next: ConsentCategories = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    writeStored(next);
    setCategories(next);
    setDecision("decided");
  }, []);

  const rejectAll = useCallback(() => {
    const next: ConsentCategories = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    writeStored(next);
    setCategories(next);
    setDecision("decided");
  }, []);

  const save = useCallback(
    (partial: Partial<Omit<ConsentCategories, "necessary">>) => {
      const next: ConsentCategories = {
        necessary: true,
        analytics: partial.analytics ?? categories.analytics,
        marketing: partial.marketing ?? categories.marketing,
      };
      writeStored(next);
      setCategories(next);
      setDecision("decided");
    },
    [categories.analytics, categories.marketing],
  );

  const reset = useCallback(() => {
    clearStored();
    setCategories(DEFAULT_CATEGORIES);
    setDecision("pending");
  }, []);

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
