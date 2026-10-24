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

- [x] RESOLVED by the 2026-10-23 deploy (version 8570a6b3): both now return
      `cf-cache-status: HIT` with a rising `age` across three consecutive
      requests, no Cache Rule needed. Not isolated which change did it — that
      deploy shipped the escaped header source, the custom Worker entry and the
      compatibility_date bump together. **`/sitemap.xml` and `/manifest.webmanifest` still return `EXPIRED`**
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

- [x] Shipped in the 2026-10-23 deploy (version 8570a6b3). **Deployed Worker still carries the unescaped-dot version of the header
      source.** The escape fix (`sitemap\.xml` etc.) is committed but ships
      only on the next deploy. Harmless meanwhile: the over-matched paths 404,
      and 404s carry `private, no-cache, no-store`.

## Bot probes

- [x] DONE 2026-10-23: rule `ab5ee5723a9544efa5d3cdc19e6045a5` added via the
      plugin:cloudflare:cloudflare-api connector (the other two credentials
      403'd). Verified on production: 15 probe paths (/api, /ro/api/x,
      /backup.zip, /dump.sql, /.htaccess, /x/.svn/entries, wlwmanifest, ...)
      all 403 at the edge; all 18 pages and assets 200, www 200, /apidentar and
      /nu-exista still reach Next's 404, /.well-known/* stays open. **Extend the
      zone WAF block rule to the probe paths the Worker filter now 404s.**
      worker.ts (commit fefeb43) answers /api, wp-* segments, dot-segments and
      server-side extensions without booting Next, but each probe still costs
      a Worker invocation against the Free plan's 100k requests/day. Extending
      the existing `*.php` rule would stop them at the edge with no invocation.
      Keep the Worker filter as the backstop. Source: review of fefeb43,
      altitude finding, skipped.
      2026-10-23: the owner approved it, but neither the wrangler OAuth token
      nor the Cloudflare API connector holds a rulesets/WAF write scope (both
      return 10000 Authentication error). The live zone already has one custom
      rule, "Block secret/CMS scanners" (.env, .git, .php, wp-*, xmlrpc, ...).
      Add a SECOND rule, action Block, description
      "Block probe paths (mirrors worker.ts filter)", expression:

      ```
                      (http.request.uri.path wildcard r"/api") or (http.request.uri.path wildcard r"/api/*") or (http.request.uri.path wildcard r"/ro/api") or (http.request.uri.path wildcard r"/ro/api/*") or (http.request.uri.path wildcard r"/en/api") or (http.request.uri.path wildcard r"/en/api/*") or (http.request.uri.path wildcard r"*wlwmanifest*") or (http.request.uri.path wildcard r"*/wordpress*") or (http.request.uri.path wildcard r"*/cgi-bin*") or (http.request.uri.path wildcard r"*phpmyadmin*") or (http.request.uri.path.extension in {"phtml" "asp" "aspx" "jsp" "cgi" "pl" "ini" "sql" "bak" "old" "swp" "zip" "tar" "gz" "tgz" "rar" "7z" "log" "yml" "yaml" "cfg" "conf"}) or ((http.request.uri.path wildcard r"*/.*") and not (http.request.uri.path wildcard r"/.well-known/*"))
                      ```

                      `.well-known` is excluded on purpose (certificate validation lives there).

- [ ] **Sync the "Block probe paths" WAF rule with worker.ts again.** Branch
      `fix/cf-404-workersdev` added `/Dockerfile`, `/docker-compose*` and
      `/aws-exports.js` (any segment, case-insensitive) to src/lib/botProbe.ts.
      The live rule `ab5ee5723a9544efa5d3cdc19e6045a5` was left untouched on
      purpose (owner's rule for that session). Append to its expression
      (`wildcard` is case-insensitive; these match whole segments, like
      PROBE_SEGMENT):

      ```
              or (http.request.uri.path wildcard r"*/dockerfile") or (http.request.uri.path wildcard r"*/dockerfile/*") or (http.request.uri.path wildcard r"*/docker-compose*") or (http.request.uri.path wildcard r"*/aws-exports.js") or (http.request.uri.path wildcard r"*/aws-exports.js/*")
              ```

- [ ] **Harden the Worker's 404 allowlist (worker.ts + src/lib/knownRoute.ts).**
      Review findings on commit 77e0586, skipped at commit time:
      (1) anything not prerendered — a route.ts handler, an on-demand page, a
      next.config redirect/rewrite — gets the Worker's 404, and only production
      shows it because E2E never runs worker.ts; a build-time check (e.g. a
      script that fails when routes-manifest has rewrites/redirects beyond the
      trailing-slash one, or an app route outside the prerender manifest) would
      catch it. (2) tests/unit/known-route.test.ts derives its manifest from the
      sitemap, so it never checks real prerender-manifest keys; a post-build
      check (curl every sitemap URL through `opennextjs-cloudflare preview`)
      would. (3) worker.ts reads the 404 HTML and page list from .next/ but the
      handler from .open-next/; a `next build` followed by a bare
      `opennextjs-cloudflare deploy` mixes builds (`npm run deploy` always
      rebuilds). (4) the 404's cache-control string is hand-copied from Next's.

## Other sites (frizerescu, tomarhi, dentnaik)

- [ ] PAUSED (2026-10-23: other repos, needs sessions opened there)
      **frizerescu.ro and tomarhi.com still emit `Set-Cookie` on every HTML
      response**, so neither can be edge-cached — the same next-intl v4
      `localeCookie` default that cost dentologia all its caching. dentnaik.com
      sends none. Fix is the two-line change in commit 9ba66ab, applied in each
      repo. Needs a session opened in those projects.
- [ ] PAUSED (2026-10-23: live WAF change on other zones, needs the owner's go)
      **`.php` WAF block rule not yet deployed on frizerescu.ro, tomarhi.com,
      dentnaik.com** (~3,200 errors/week between them over 7 days). Rule:
      `(http.request.uri.path wildcard r"*.php")`, action Block. Lower priority
      than it looks — all three return 404 on `.php` rather than dentologia's
      503, so their Workers survive the probes.
