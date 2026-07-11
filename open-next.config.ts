import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

/**
 * Every route on this site is prerendered (SSG), so the incremental cache can
 * be served straight from Workers Static Assets — no R2 bucket or KV needed.
 * Without an incremental cache configured, the dynamic-segment pages
 * (/servicii/[slug], /preturi/[slug], /blog/[slug]) 404 in production because
 * their prerendered payloads are never uploaded.
 *
 * Deploy with `opennextjs-cloudflare deploy` (NOT bare `wrangler deploy`) —
 * it populates this cache before deploying.
 */
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});
