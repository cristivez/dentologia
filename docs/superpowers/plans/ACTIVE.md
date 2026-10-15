# Active work

Discovered work that is real but not yet applied. Add an unticked box rather
than leaving a deferral in prose — a deferral recorded only in a report is
invisible to the loop and quietly never gets built.

## Caching

- [ ] **`/sitemap.xml` and `/robots.txt` still bypass the edge cache.** Both
      send `cache-control: public, max-age=0, must-revalidate`, so Cloudflare
      stores the entry but revalidates against the Worker on every request —
      `cf-cache-status: EXPIRED` where HTML pages return `HIT`. Measured on
      production 2026-10-15 after the Workers Cache rollout (commit 9ba66ab).
      Traffic: robots.txt ~24 hits/day, sitemap.xml ~12/day, both crawler-facing.
      Fix: add an explicit `Cache-Control: public, s-maxage=3600` for those two
      routes in `next.config.ts` `headers()`. Verify with
      `curl -sD- https://dentologia.ro/robots.txt | grep -i cf-cache-status`
      returning `HIT` on the second request.

## Other sites (frizerescu, tomarhi, dentnaik)

- [ ] **frizerescu.ro and tomarhi.com still emit `Set-Cookie` on every HTML
      response**, so neither can be edge-cached — the same next-intl v4
      `localeCookie` default that cost dentologia all its caching. dentnaik.com
      sends none. Fix is the two-line change in commit 9ba66ab, applied in each
      repo. Needs a session opened in those projects.
- [ ] **`.php` WAF block rule not yet deployed on frizerescu.ro, tomarhi.com,
      dentnaik.com** (~3,200 errors/week between them over 7 days). Rule:
      `(http.request.uri.path wildcard r"*.php")`, action Block. Lower priority
      than it looks — all three return 404 on `.php` rather than dentologia's
      503, so their Workers survive the probes.
