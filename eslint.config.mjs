import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Cloudflare build output. Flat config does not read .gitignore, so
    // without these `npm run lint` reports ~13k problems from generated
    // bundles after any `npm run preview`/`deploy` — and passes in CI only
    // because a fresh checkout hasn't built yet. The gate's result must not
    // depend on which artifacts happen to be on disk.
    ".open-next/**",
    ".wrangler/**",
  ]),
]);

export default eslintConfig;
