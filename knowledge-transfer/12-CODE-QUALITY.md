# Code Quality Setup

## ESLint (Flat Config)

Save as `eslint.config.mjs`:

```javascript
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import { defineConfig } from "eslint/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

export default defineConfig([
  {
    ignores: [".next/**", "out/**", "build/**", ".claude/**"],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
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
]);
```

## Prettier

Save as `.prettierrc`:

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

Save as `.prettierignore`:

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

## Husky + lint-staged

### Setup

```bash
npx husky init
```

This creates `.husky/pre-commit`. Set its content to:

```bash
npx lint-staged
```

### lint-staged Config

In `package.json`:

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,css,md}": ["prettier --write"]
  }
}
```

## How It Works

1. Developer stages files (`git add`)
2. Runs `git commit`
3. Husky's pre-commit hook fires
4. lint-staged runs ESLint + Prettier on staged files only
5. If ESLint errors exist → commit blocked
6. If ESLint fixes or Prettier reformats → changes are auto-staged
7. Commit proceeds with clean code

## Import Ordering

ESLint's `sort-imports` rule enforces consistent import ordering within import groups. Use `allowSeparatedGroups: true` to allow blank lines between groups:

```typescript
// React/Next.js imports
import { useState, useEffect } from "react";
import Link from "next/link";

// External libraries
import { useTranslations } from "next-intl";
import { m } from "framer-motion";

// Internal imports
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

// Relative imports
import { ServiceCard } from "./ServiceCard";
```

## TypeScript Config Notes

- **`skipLibCheck: true`** is required when using `@opennextjs/cloudflare` — their types reference Cloudflare Worker types (Fetcher, KVNamespace, DurableObjectNamespace) that aren't available in your TypeScript context
- **`strict: true`** — always on
- **Path alias**: `@/*` maps to `./src/*`
