import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  /**
   * Correct, not a leftover — do not "fix" this by writing a custom loader.
   *
   * Next's default optimiser is sharp-based and cannot run on Workers. The
   * obvious Cloudflare replacement is a loader pointing at /cdn-cgi/image/,
   * but image resizing is a paid feature and is not enabled on this zone:
   * https://dentologia.ro/cdn-cgi/image/width=200/logo.webp returns 404.
   * A loader would therefore break every image on the site.
   *
   * Consequence: Next emits no srcset (verified — zero across the built
   * output) and drops `sizes` too, so the `sizes` props still on the <Image>
   * calls are inert. They are kept, not deleted, because they encode real
   * breakpoint decisions and go live unchanged the day resizing is enabled.
   * Until then the cost is data usage, not LCP: the .webp files are pre-sized
   * and every photo but the /contact storefront is lazy and below the fold.
   */
  images: {
    unoptimized: true,
  },
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        // Tells browsers to reach this host over HTTPS only, which kills the
        // http:// -> https:// redirect hop as a downgrade opportunity. Safe
        // here because dentologia.ro and www are Worker custom domains and
        // have always been HTTPS-only. No `preload`: that needs a submission
        // to the browser preload list and is far harder to undo. Note the
        // max-age is a real commitment — a browser that sees this refuses
        // plain HTTP for this host for a year, even if the header is removed.
        {
          key: "Strict-Transport-Security",
          value: "max-age=31536000; includeSubDomains",
        },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        {
          key: "Referrer-Policy",
          value: "strict-origin-when-cross-origin",
        },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()",
        },
      ],
    },
  ],
};

export default withNextIntl(nextConfig);
