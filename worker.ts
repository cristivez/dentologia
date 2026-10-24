/**
 * Custom Worker entry wrapping the one `opennextjs-cloudflare build` generates.
 * It answers bot probes with a bare 404 and every other path outside the
 * build's route list with the prerendered 404 page, both before Next.js boots;
 * real pages go to the generated handler unchanged. See src/lib/botProbe.ts
 * and src/lib/knownRoute.ts.
 */
// The import resolves only after `opennextjs-cloudflare build`, so the type
// error comes and goes; @ts-expect-error would fail whenever the build exists.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { default as handler } from "./.open-next/worker.js";
// Build output too, same reason. Wrangler bundles .html as a text module.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import notFoundHtml from "./.next/server/app/_not-found.html";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import prerenderManifest from "./.next/prerender-manifest.json";
import { isBotProbe } from "./src/lib/botProbe";
import { isKnownRoute } from "./src/lib/knownRoute";
import { SECURITY_HEADERS } from "./src/lib/securityHeaders";

const PAGES: ReadonlySet<string> = new Set(
  Object.keys(prerenderManifest.routes),
);

// The headers Next.js sends on this same page, minus its own bookkeeping.
const NOT_FOUND_HEADERS: HeadersInit = [
  ["content-type", "text/html; charset=utf-8"],
  ["cache-control", "private, no-cache, no-store, max-age=0, must-revalidate"],
  ...SECURITY_HEADERS.map(({ key, value }): [string, string] => [key, value]),
];

const worker = {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    const { pathname } = new URL(request.url);
    if (isBotProbe(pathname)) {
      return new Response("Not Found", {
        status: 404,
        headers: { "content-type": "text/plain; charset=utf-8" },
      });
    }
    if (!isKnownRoute(pathname, PAGES)) {
      return new Response(notFoundHtml, {
        status: 404,
        headers: NOT_FOUND_HEADERS,
      });
    }
    return handler.fetch(request, env, ctx);
  },
};

export default worker;

// Kept as in OpenNext's custom-worker template, so binding one of these
// Durable Objects later does not fail the deploy on a missing export.
// One line on purpose: @ts-ignore covers only the next line, and the error
// lands on the module path.
// prettier-ignore
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore same generated module as above
export { DOQueueHandler, DOShardedTagCache, BucketCachePurge } from "./.open-next/worker.js";
