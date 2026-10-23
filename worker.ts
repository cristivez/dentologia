/**
 * Custom Worker entry wrapping the one `opennextjs-cloudflare build` generates.
 * It answers bot probes with a bare 404 before Next.js boots; everything else
 * goes to the generated handler unchanged. See src/lib/botProbe.ts.
 */
// The import resolves only after `opennextjs-cloudflare build`, so the type
// error comes and goes; @ts-expect-error would fail whenever the build exists.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { default as handler } from "./.open-next/worker.js";
import { isBotProbe } from "./src/lib/botProbe";

const worker = {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    if (isBotProbe(new URL(request.url).pathname)) {
      return new Response("Not Found", {
        status: 404,
        headers: { "content-type": "text/plain; charset=utf-8" },
      });
    }
    return handler.fetch(request, env, ctx);
  },
};

export default worker;

// Kept as in OpenNext's custom-worker template, so binding one of these
// Durable Objects later does not fail the deploy on a missing export.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore same generated module as above
export {
  DOQueueHandler,
  DOShardedTagCache,
  BucketCachePurge,
} from "./.open-next/worker.js";
