# Active work

Discovered work that is real but not yet applied. Add an unticked box rather
than leaving a deferral in prose — a deferral recorded only in a report is
invisible to the loop and quietly never gets built.

## Caching

- [x] **`/robots.txt` now serves from the edge cache.** Fixed in next.config.ts
      via `cloudflare-cdn-cache-control: public, s-maxage=3600` on a headers()
      entry matching the three metadata routes. Verified on production
      2026-10-16: `cf-cache-status: HIT` with `age: 23` across four consecutive
      requests, while the client still receives Next's original
      `max-age=0, must-revalidate` (Cloudflare consumes and strips the header).

- [ ] **`/sitemap.xml` and `/manifest.webmanifest` still return `EXPIRED`**
      despite the same fix that worked for `/robots.txt`. Established, so do
      not re-derive: the compiled route regex in `.next/.../routes-manifest.json`
      matched all three, and the dev server emits the header on all three
      (`/servicii` correctly does not). Neither is a plain static asset — all
      three live in the incremental cache plus server-functions — so the
      asset-vs-Worker split is ruled out. Four consecutive requests are
      consistently EXPIRED, so it is not propagation lag. The remaining
      difference is content type (`text/plain` caches; `application/xml` and
      the manifest type do not), which points at Cloudflare-side handling
      rather than anything in this repo. Low value: ~12 hits/day on sitemap,
      fewer on manifest. Next lever: a zone Cache Rule targeting those two
      paths, or checking whether Cloudflare's default cacheable-extension
      handling overrides the origin directive for those content types.

- [ ] **Deployed Worker still carries the unescaped-dot version of the header
      source.** The escape fix (`sitemap\.xml` etc.) is committed but ships
      only on the next deploy. Harmless meanwhile: the over-matched paths 404,
      and 404s carry `private, no-cache, no-store`.

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
