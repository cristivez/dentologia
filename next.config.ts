import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { SECURITY_HEADERS } from "./src/lib/securityHeaders";

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
      /**
       * The generated metadata routes (sitemap.ts, robots.ts, manifest.ts) are
       * emitted with `max-age=0, must-revalidate`, which makes Cloudflare store
       * the entry but revalidate against the Worker on EVERY request — measured
       * as `cf-cache-status: EXPIRED` where ordinary pages return `HIT`. They
       * are prerendered and only change on deploy, so that revalidation boots
       * the Next.js server for nothing.
       *
       * `cloudflare-cdn-cache-control` is the right knob rather than overriding
       * `Cache-Control`: Cloudflare consumes it, gives it highest precedence,
       * and strips it before the response reaches the client — so crawlers and
       * browsers keep revalidating as Next intends while the edge serves hits.
       * Workers Cache keys on the Worker version, so a deploy invalidates these
       * regardless of the TTL.
       * The dots are escaped: unescaped they are regex wildcards, and the
       * compiled route regex would also match /sitemapXxml and friends.
       */
      source: "/:file(sitemap\\.xml|robots\\.txt|manifest\\.webmanifest)",
      headers: [
        {
          key: "cloudflare-cdn-cache-control",
          value: "public, s-maxage=3600",
        },
      ],
    },
    {
      source: "/(.*)",
      headers: SECURITY_HEADERS,
    },
  ],
};

export default withNextIntl(nextConfig);
