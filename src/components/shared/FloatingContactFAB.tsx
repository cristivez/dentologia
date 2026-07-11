"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Phone, MessageCircle, X } from "lucide-react";
import { CLINIC } from "@/lib/constants";

export function FloatingContactFAB() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, handleClose]);

  if (!isVisible) return null;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {isOpen && (
            <>
              <m.a
                href={`tel:${CLINIC.phone}`}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-primary-foreground font-semibold shadow-lg active:scale-95 transition-transform"
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 10 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                aria-label="Sună acum"
              >
                <Phone size={18} aria-hidden="true" />
                <span className="text-sm">Sună</span>
              </m.a>
              <m.a
                href={CLINIC.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-full bg-whatsapp px-4 py-2 text-white font-semibold shadow-lg active:scale-95 transition-transform"
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 10 }}
                transition={{ duration: 0.2, delay: 0.05 }}
                aria-label="WhatsApp"
              >
                <MessageCircle size={18} aria-hidden="true" />
                <span className="text-sm">WhatsApp</span>
              </m.a>
            </>
          )}
        </AnimatePresence>

        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl active:scale-95 transition-transform"
          aria-label={isOpen ? "Închide meniul de contact" : "Contact rapid"}
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <X size={24} aria-hidden="true" />
          ) : (
            <Phone size={24} aria-hidden="true" />
          )}
        </button>
      </div>
    </>
  );
}
