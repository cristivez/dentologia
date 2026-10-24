/**
 * Route allowlist for the Worker entry (worker.ts).
 *
 * Every page on this site is prerendered and every dynamic segment sets
 * `dynamicParams = false`, so the build's prerender manifest is the complete
 * list of URLs Next.js can answer with anything but a 404. A path outside it
 * used to boot the Next.js server and run the middleware just to look up the
 * prerendered /_not-found page — ~100 ms of CPU per request against the Free
 * plan's 10 ms, and the 404 carries `no-store`, so Workers Cache never helps.
 *
 * `pages` holds the manifest's route keys, which always carry the locale
 * (`/ro/contact`). The default locale is served unprefixed (`localePrefix:
 * "as-needed"`), so `/contact` is checked as `/ro/contact` too. The prefixed
 * form stays known because next-intl redirects it to the unprefixed one.
 * A trailing slash is ignored here; Next.js redirects it away.
 *
 * Adding anything that is not prerendered — a route.ts handler, a page that
 * renders on demand, a next.config redirect or rewrite — means extending this
 * check, or the Worker 404s it. Only production shows that: the E2E suite runs
 * next dev/start and never goes through worker.ts.
 */
import { routing } from "@/i18n/routing";

export function isKnownRoute(
  pathname: string,
  pages: ReadonlySet<string>,
): boolean {
  if (pathname.startsWith("/_next/")) return true;
  // A loop, not /\/+$/: that regex backtracks quadratically on a long run of
  // slashes, and the path is attacker-controlled.
  let end = pathname.length;
  while (end > 1 && pathname[end - 1] === "/") end--;
  const path = pathname.slice(0, end);
  const prefix = `/${routing.defaultLocale}`;
  return pages.has(path) || pages.has(path === "/" ? prefix : prefix + path);
}
