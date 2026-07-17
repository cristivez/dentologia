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
 * Gated to production builds: `next dev` renders no beacon at all, so local
 * sessions never pollute the real visitor stats. (`next build` sets NODE_ENV
 * to "production"; `next dev` sets "development" — this is a build-time
 * constant, so the gate costs nothing at runtime and keeps the site fully
 * static.) Value: Cloudflare dashboard → Web Analytics → dentologia.ro.
 */
const CF_BEACON_TOKEN =
  process.env.NEXT_PUBLIC_CF_BEACON_TOKEN ||
  (process.env.NODE_ENV === "production"
    ? "00139fff55144a8e8b1fa5b95963c538"
    : undefined);

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
