# Security Headers

## Configuration

Add to `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  async headers() {
    const isDev = process.env.NODE_ENV === "development";
    return [
      {
        source: "/:path*",
        headers: [
          // Prevent clickjacking
          { key: "X-Frame-Options", value: "SAMEORIGIN" },

          // Prevent MIME-type sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },

          // Control referrer information
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },

          // Disable unnecessary browser features
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },

          // Force HTTPS (2-year max-age, preload-ready)
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },

          // Content Security Policy
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // unsafe-inline required by Next.js hydration scripts
              // TODO: Replace with nonce-based CSP when OpenNext adds middleware support
              `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} www.googletagmanager.com www.google-analytics.com`,
              "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
              "font-src 'self' fonts.gstatic.com",
              "img-src 'self' data: blob: maps.googleapis.com maps.gstatic.com *.google.com *.googleusercontent.com",
              "frame-src maps.google.com www.google.com",
              "frame-ancestors 'self'",
              "connect-src 'self' www.google-analytics.com maps.googleapis.com",
            ].join("; "),
          },
        ],
      },
    ];
  },
};
```

## Header Explanations

### X-Frame-Options: SAMEORIGIN

Prevents your site from being embedded in iframes on other domains (clickjacking protection). `SAMEORIGIN` allows your own site to use iframes (needed for Google Maps embed).

### X-Content-Type-Options: nosniff

Prevents browsers from MIME-type sniffing. Without this, a browser might interpret a text file as JavaScript and execute it.

### Referrer-Policy: strict-origin-when-cross-origin

- Same-origin requests: full URL sent as referrer
- Cross-origin requests: only the origin (domain) sent
- HTTPS→HTTP: no referrer sent
  Balances analytics data collection with privacy.

### Permissions-Policy

Explicitly disables browser features you don't use. Prevents third-party scripts from accessing camera, microphone, or geolocation without your knowledge.

### Strict-Transport-Security (HSTS)

Forces browsers to always use HTTPS for your domain. The `preload` flag lets you submit to the HSTS preload list (hstspreload.org) so browsers enforce HTTPS even on first visit.

### Content-Security-Policy (CSP)

| Directive         | Value                                         | Why                                          |
| ----------------- | --------------------------------------------- | -------------------------------------------- |
| `default-src`     | `'self'`                                      | Only load resources from your domain         |
| `script-src`      | `'self' 'unsafe-inline'`                      | Next.js injects inline scripts for hydration |
| `style-src`       | `'self' 'unsafe-inline' fonts.googleapis.com` | Tailwind + Google Fonts                      |
| `font-src`        | `'self' fonts.gstatic.com`                    | Google Fonts files                           |
| `img-src`         | `'self' data: blob: maps.googleapis.com ...`  | Images + Google Maps tiles                   |
| `frame-src`       | `maps.google.com www.google.com`              | Google Maps iframe                           |
| `frame-ancestors` | `'self'`                                      | Same as X-Frame-Options (CSP version)        |
| `connect-src`     | `'self' www.google-analytics.com`             | GA beacon + API calls                        |

### Why `unsafe-inline` is Required

Next.js App Router injects inline `<script>` tags for:

- Hydration data (`__NEXT_DATA__`)
- Chunk preloading
- Theme initialization (prevent flash)

Nonce-based CSP (the proper fix) requires middleware to generate per-request nonces and pass them to React. `@opennextjs/cloudflare` doesn't yet support modifying response headers in middleware. When it does, switch to nonces.

### Dev vs Production

`unsafe-eval` is added in development mode only — Next.js hot reload needs `eval()`. Never ship `unsafe-eval` to production.
