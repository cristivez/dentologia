import { defineConfig, devices } from "@playwright/test";

/**
 * Two servers.
 *
 * The dev server (3001) backs the normal suite. The production server (3002)
 * backs `no-js.spec.ts`, which asserts what the server actually paints before
 * any JavaScript runs.
 *
 * The distinction matters: `next dev` streams every page into a hidden
 * <template> that an inline script moves into place, so with JS disabled a dev
 * page renders nothing at all — the test would fail no matter how the markup
 * was written. Only the prerendered production HTML tells the truth about what
 * a crawler or a slow phone sees first.
 */
export default defineConfig({
  testDir: "./tests",
  testMatch: "*.spec.ts",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3001",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      testIgnore: "no-js.spec.ts",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile",
      testIgnore: "no-js.spec.ts",
      use: {
        ...devices["iPhone 14"],
        hasTouch: true,
      },
    },
    {
      name: "no-js",
      testMatch: "no-js.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://localhost:3002",
      },
    },
  ],
  webServer: [
    {
      command: "npm run dev",
      url: "http://localhost:3001",
      reuseExistingServer: !process.env.CI,
      timeout: 30000,
    },
    {
      command: "npm run build && npx next start -p 3002",
      url: "http://localhost:3002",
      reuseExistingServer: !process.env.CI,
      timeout: 180000,
    },
  ],
});
