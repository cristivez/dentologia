# Cloudflare Workers Deployment

## Architecture

```
Next.js App → opennextjs-cloudflare build → .open-next/ → wrangler deploy → Cloudflare Workers
```

- **Static assets** (images, CSS, JS) → served from Cloudflare CDN
- **Server functions** (API routes, SSR) → run on Cloudflare Workers (edge)
- **Pre-rendered pages** (SSG) → served as static HTML from CDN

## Setup

### 1. Install Dependencies

```bash
npm install -D @opennextjs/cloudflare wrangler
```

### 2. OpenNext Config

Create `open-next.config.ts`:

```typescript
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({});
```

### 3. Wrangler Config

Create `wrangler.jsonc`:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "main": ".open-next/worker.js",
  "name": "your-clinic",
  "compatibility_date": "2025-12-01",
  "compatibility_flags": ["nodejs_compat"],
  "assets": {
    "directory": ".open-next/assets",
    "binding": "ASSETS",
  },
}
```

### 4. Next.js Config

```typescript
// next.config.ts
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

if (process.env.NODE_ENV === "development") {
  initOpenNextCloudflareForDev();
}

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // Cloudflare Workers can't do on-the-fly image optimization
  },
};
```

### 5. NPM Scripts

```json
{
  "preview": "opennextjs-cloudflare build && wrangler dev",
  "deploy": "opennextjs-cloudflare build && wrangler deploy"
}
```

## Cloudflare Account Setup

### Create API Token

1. Go to Cloudflare Dashboard → My Profile → API Tokens
2. Create Token → Custom Token
3. Permissions: Account: Cloudflare Workers → Edit
4. Save the token securely

### Get Account ID

1. Go to Cloudflare Dashboard → Workers & Pages
2. Account ID is in the right sidebar

### GitHub Secrets

Add to your repo: Settings → Secrets and variables → Actions:

| Secret                  | Value                          |
| ----------------------- | ------------------------------ |
| `CLOUDFLARE_API_TOKEN`  | Your API token                 |
| `CLOUDFLARE_ACCOUNT_ID` | Your account ID                |
| `GA_MEASUREMENT_ID`     | Google Analytics ID (optional) |

## Custom Domain

1. In Cloudflare Dashboard → Workers & Pages → your worker
2. Settings → Triggers → Custom Domains
3. Add your domain (must be on Cloudflare DNS)
4. SSL is automatic

## Known Limitations

### Images Must Be Unoptimized

Cloudflare Workers don't have a filesystem for on-the-fly image processing. Set `images: { unoptimized: true }` in next.config.ts. Pre-optimize images before adding them to the repo.

### No Nonce-Based CSP

Middleware can't modify response headers reliably on `@opennextjs/cloudflare`. This means `unsafe-inline` is required for scripts. Monitor the OpenNext repo for updates.

### skipLibCheck Required

`@opennextjs/cloudflare` types reference Cloudflare Worker types not available in your TS context. Keep `skipLibCheck: true` in tsconfig.json.

### Error 1101 Troubleshooting

**Error 1101** means the Worker threw an unhandled exception. Common causes:

1. **Dynamic imports failing** — template literal imports (`import(\`../messages/${locale}/...\`)`) can fail if the bundler doesn't include all possible files
2. **Missing environment variables** — check that secrets are set in Cloudflare
3. **Node.js API usage** — Workers don't have `fs`, `child_process`, etc. Use `nodejs_compat` flag for basic Node.js polyfills

**Debugging:**

```bash
# Local preview (simulates Worker environment)
npm run preview

# Check Cloudflare logs
wrangler tail
```

## .gitignore Additions

```
.open-next/
.wrangler/
.dev.vars
```
