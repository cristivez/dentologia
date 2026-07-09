# Configuration Templates

Copy-paste ready configs. Adjust values in `[BRACKETS]` for your project.

## tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": ["node_modules"]
}
```

**Notes:**

- `skipLibCheck: true` is **required** when using `@opennextjs/cloudflare` — their types reference Cloudflare Worker types not available in your TS context
- `@/*` path alias maps to `./src/*` for clean imports

## eslint.config.mjs

```javascript
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "sort-imports": [
        "warn",
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
          allowSeparatedGroups: true,
        },
      ],
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    ".claude/**",
  ]),
]);

export default eslintConfig;
```

**Notes:**

- ESLint 9 flat config format (not legacy `.eslintrc`)
- `sort-imports` with `ignoreDeclarationSort: true` — only enforces member ordering within import statements, not declaration order (avoids conflicts with auto-imports)

## .prettierrc

```json
{
  "semi": true,
  "singleQuote": false,
  "trailingComma": "es5",
  "tabWidth": 2,
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

## .prettierignore

```
node_modules/
.next/
.open-next/
.wrangler/
.lighthouseci/
playwright-report/
test-results/
coverage/
*.min.js
package-lock.json
```

## playwright.config.ts

```typescript
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests",
  timeout: 60_000,
  testIgnore: ["**/unit/**"],
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: "html",
  use: {
    baseURL: "http://localhost:[PORT]",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    port: [PORT],
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
```

**Notes:**

- `fullyParallel: false` + `workers: 1` — sequential execution prevents test interference when sharing a single dev server
- `testIgnore: ["**/unit/**"]` — keeps Vitest unit tests out of Playwright's runner
- `reuseExistingServer: !process.env.CI` — reuses local dev server but starts fresh in CI
- `forbidOnly: !!process.env.CI` — prevents `.only` from accidentally passing in CI

## vitest.config.ts

```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/unit/setup.ts"],
    include: ["tests/unit/**/*.test.{ts,tsx}"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

**Unit test setup file** (`tests/unit/setup.ts`):

```typescript
import "@testing-library/jest-dom";
```

## package.json (scripts + lint-staged)

```json
{
  "name": "[project-name]",
  "version": "0.1.0",
  "private": true,
  "engines": {
    "node": ">=22.0.0",
    "npm": ">=10.0.0"
  },
  "scripts": {
    "dev": "next dev --port [PORT]",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "test": "playwright test",
    "test:ui": "playwright test --ui",
    "test:unit": "vitest run",
    "test:unit:watch": "vitest",
    "preview": "opennextjs-cloudflare build && wrangler dev",
    "deploy": "opennextjs-cloudflare build && wrangler deploy",
    "prepare": "husky"
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,css,md}": ["prettier --write"]
  }
}
```

## next.config.ts

```typescript
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

if (process.env.NODE_ENV === "development") {
  initOpenNextCloudflareForDev();
}

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // Required for Cloudflare Workers
  },
  allowedDevOrigins: ["[LOCAL-IP]"], // For mobile testing on LAN
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
export default withNextIntl(nextConfig);
```

## open-next.config.ts

```typescript
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({});
```

## wrangler.jsonc

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "main": ".open-next/worker.js",
  "name": "[project-name]",
  "compatibility_date": "2025-12-01",
  "compatibility_flags": ["nodejs_compat"],
  "assets": {
    "directory": ".open-next/assets",
    "binding": "ASSETS",
  },
}
```

## .gitignore (additions for this stack)

```
# Next.js
.next/
out/

# Cloudflare
.open-next/
.wrangler/
.dev.vars

# Testing
playwright-report/
test-results/
coverage/

# Lighthouse
.lighthouseci/

# OS
.DS_Store
```

## Husky Setup

```bash
npx husky init
```

This creates `.husky/pre-commit`. Set its content to:

```bash
npx lint-staged
```

## Dependencies

### Production

```bash
npm install clsx tailwind-merge next-intl next-themes framer-motion lucide-react embla-carousel-react @next/third-parties
```

### Development

```bash
npm install -D @opennextjs/cloudflare wrangler @playwright/test @axe-core/playwright vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom eslint eslint-config-next prettier husky lint-staged tailwindcss @tailwindcss/postcss typescript @types/node @types/react @types/react-dom sharp tsx
```
