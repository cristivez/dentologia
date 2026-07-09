"use client";

import { useState, useEffect, useCallback } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const CONSENT_KEY = "dentologia-cookie-consent";

export function getConsentStatus(): "accepted" | "declined" | null {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(CONSENT_KEY);
  if (value === "accepted" || value === "declined") return value;
  return null;
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    const status = getConsentStatus();
    if (status) return;
    const timer = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleChoice = useCallback((choice: "accepted" | "declined") => {
    localStorage.setItem(CONSENT_KEY, choice);
    window.dispatchEvent(
      new StorageEvent("storage", { key: CONSENT_KEY, newValue: choice }),
    );
    setVisible(false);
  }, []);

  const content = (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6">
      <div className="mx-auto max-w-lg rounded-2xl bg-surface border border-border p-5 shadow-xl">
        <p className="text-sm text-foreground mb-4 leading-relaxed">
          Folosim cookie-uri pentru a îmbunătăți experiența dvs. pe site.
          Consultați{" "}
          <Link
            href="/confidentialitate"
            className="text-primary underline underline-offset-2"
          >
            politica de confidențialitate
          </Link>
          .
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => handleChoice("accepted")}
            className="flex-1 rounded-full bg-primary text-primary-foreground py-2.5 text-sm font-semibold min-h-[44px] cursor-pointer [@media(hover:hover)]:hover:opacity-90 transition-opacity"
          >
            Accept
          </button>
          <button
            onClick={() => handleChoice("declined")}
            className="flex-1 rounded-full border border-border text-foreground py-2.5 text-sm font-semibold min-h-[44px] cursor-pointer [@media(hover:hover)]:hover:bg-surface-elevated transition-colors"
          >
            Refuz
          </button>
        </div>
      </div>
    </div>
  );

  if (prefersReduced) {
    return visible ? content : null;
  }

  return (
    <AnimatePresence>
      {visible && (
        <m.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {content}
        </m.div>
      )}
    </AnimatePresence>
  );
}
