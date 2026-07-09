# GDPR Cookie Consent

## Architecture

```
User visits site
  → CookieConsent banner appears (1.5s delay)
  → User clicks Accept or Decline
  → localStorage updated ("accepted" or "declined")
  → StorageEvent dispatched (same-page notification)
  → Analytics component listens → loads/blocks GA accordingly
  → Banner hidden, stays hidden on return visits
```

## CookieConsent Component

```tsx
"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";

const STORAGE_KEY = "your-clinic-cookie-consent";

export function getConsentStatus(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEY) === "accepted";
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  function handleConsent(value: "accepted" | "declined") {
    localStorage.setItem(STORAGE_KEY, value);
    setVisible(false);
    // Dispatch StorageEvent for same-page listeners (Analytics component)
    window.dispatchEvent(
      new StorageEvent("storage", { key: STORAGE_KEY, newValue: value }),
    );
  }

  return (
    <AnimatePresence>
      {visible && (
        <m.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 z-50"
        >
          <div className="mx-auto max-w-3xl rounded-2xl bg-surface border border-border shadow-xl p-6 flex flex-col sm:flex-row items-center gap-4">
            <p className="text-sm text-muted flex-1">
              {/* Use translation key */}
              This site uses cookies for analytics.
            </p>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => handleConsent("declined")} className="...">
                Decline
              </button>
              <button onClick={() => handleConsent("accepted")} className="...">
                Accept
              </button>
            </div>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
```

## Analytics Component (Consent-Gated)

```tsx
"use client";
import { useEffect, useState } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import { getConsentStatus } from "./CookieConsent";

export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    setConsented(getConsentStatus());

    const handler = (e: StorageEvent) => {
      if (e.key === "your-clinic-cookie-consent") {
        setConsented(e.newValue === "accepted");
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  if (!gaId || !consented) return null;
  return <GoogleAnalytics gaId={gaId} />;
}
```

## Key Design Decisions

1. **No polling** — Uses `StorageEvent` for instant notification when consent changes. Previous implementation used `setInterval` which is wasteful.

2. **Same-page StorageEvent** — `localStorage.setItem()` only fires `StorageEvent` in other tabs. To notify components in the same page, we manually dispatch: `window.dispatchEvent(new StorageEvent(...))`.

3. **1.5s delay** — Banner appears after content loads, not immediately. Prevents layout shift and gives user time to see the page.

4. **No third-party consent manager** — Simple accept/decline is sufficient for a dental clinic site. No need for OneTrust or CookieBot.

5. **Exported `getConsentStatus()`** — Testable pure function, no component rendering needed for unit tests.

## Testing

### Unit Test (consent logic)

```typescript
it("returns false when no consent stored", () => {
  expect(getConsentStatus()).toBe(false);
});

it("returns true when accepted", () => {
  localStorage.setItem(STORAGE_KEY, "accepted");
  expect(getConsentStatus()).toBe(true);
});
```

### E2E Test (banner flow)

```typescript
test("hides banner after accepting and sets localStorage", async ({ page }) => {
  await page.goto("/");
  await page.waitForTimeout(2000);

  await page
    .locator("button", { hasText: /accept/i })
    .first()
    .click();
  await expect(page.locator("text=cookie").first()).toBeHidden();

  const consent = await page.evaluate(() =>
    localStorage.getItem("your-clinic-cookie-consent"),
  );
  expect(consent).toBe("accepted");
});

test("does not show banner on return visit", async ({ page }) => {
  await page.goto("/");
  await page.waitForTimeout(2000);
  await page
    .locator("button", { hasText: /accept/i })
    .first()
    .click();

  await page.reload();
  await page.waitForTimeout(2000);
  await expect(page.locator("text=cookie")).toBeHidden();
});
```

## Privacy Policy Page

Every GDPR-compliant site needs a privacy policy page (`/confidentialitate`). Include:

- What data is collected (analytics cookies, localStorage)
- Why (traffic analysis, UX improvement)
- How to opt out (decline button, browser settings)
- Data retention period
- Contact info for data requests
