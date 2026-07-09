"use client";

import Script from "next/script";
import { useSyncExternalStore } from "react";
import { getConsentStatus } from "./CookieConsent";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
}

const getSnapshot = () => getConsentStatus() === "accepted";

// localStorage is unavailable during SSR, so assume no consent until hydrated.
const getServerSnapshot = () => false;

export function Analytics() {
  const consented = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  if (!GA_ID || !consented) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}
