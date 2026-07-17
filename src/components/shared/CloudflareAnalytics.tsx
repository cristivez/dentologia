import Script from "next/script";

/**
 * The Cloudflare Web Analytics site token for dentologia.ro.
 *
 * Hardcoded on purpose. It is a NEXT_PUBLIC_ value — inlined into the client
 * bundle and visible in the page HTML — so it is public, not a secret, and
 * keeping it here makes every deploy self-contained instead of depending on a
 * CI secret that, when unset, silently ships no analytics. A
 * `NEXT_PUBLIC_CF_BEACON_TOKEN` env var still overrides it (`||`, so an empty
 * value falls back rather than blanking the token).
 *
 * This renders in every build, dev included — a build-time dev gate would rely
 * on `process.env.NODE_ENV`, which this Turbopack/OpenNext dev server inlines
 * as "production", and a runtime host check would force dynamic rendering and
 * break the site's full static generation. The odd localhost hit from a dev
 * session is negligible against real traffic. Value: Cloudflare dashboard →
 * Web Analytics → dentologia.ro → the token in the JS snippet.
 */
const CF_BEACON_TOKEN =
  process.env.NEXT_PUBLIC_CF_BEACON_TOKEN || "00139fff55144a8e8b1fa5b95963c538";

/**
 * Cloudflare Web Analytics — cookieless, privacy-first traffic stats.
 *
 * The beacon sets no cookies and collects no personal data, so the site needs
 * no cookie-consent banner. `spa: true` reports client-side route changes,
 * which this next-intl app navigates with.
 */
export function CloudflareAnalytics() {
  if (!CF_BEACON_TOKEN) return null;

  return (
    <Script
      src="https://static.cloudflareinsights.com/beacon.min.js"
      strategy="afterInteractive"
      data-cf-beacon={`{"token": "${CF_BEACON_TOKEN}", "spa": true}`}
    />
  );
}
