import Script from "next/script";

const CF_BEACON_TOKEN = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;

/**
 * Cloudflare Web Analytics — cookieless, privacy-first traffic stats.
 *
 * The beacon sets no cookies and collects no personal data, so the site needs
 * no cookie-consent banner. It only renders when the site token is configured,
 * so local dev and preview builds without the token ship nothing. `spa: true`
 * reports client-side route changes, which this next-intl app navigates with.
 *
 * The token is a public site identifier (it appears in the page HTML), not a
 * secret. Set NEXT_PUBLIC_CF_BEACON_TOKEN at build time to the value from the
 * Cloudflare dashboard: Web Analytics → your site → the token in the JS snippet.
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
