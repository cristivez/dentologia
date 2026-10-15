import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ro", "en"],
  defaultLocale: "ro",
  localePrefix: "as-needed",
  localeDetection: false,
  /**
   * Not redundant with localeDetection above — next-intl 4 split the two.
   * Under v3, localeDetection: false also suppressed the cookie; v4 made
   * localeCookie a separate option, so this app was shipping
   * `Set-Cookie: NEXT_LOCALE=ro` on every HTML response without meaning to.
   *
   * That one header is why the site cannot be edge-cached: Cloudflare
   * bypasses the cache for any response carrying Set-Cookie, so every page
   * view booted the Next.js server inside the Worker (CPU p50 21.7 ms
   * against a 10 ms free-tier ceiling). Nothing reads the cookie — every
   * page resolves its locale from the URL via setRequestLocale, and there
   * is no locale switcher — so it buys nothing and costs caching entirely.
   */
  localeCookie: false,
});
