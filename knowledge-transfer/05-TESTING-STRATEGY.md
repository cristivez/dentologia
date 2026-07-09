# Testing Strategy

## Overview

| Layer         | Tool                   | What It Tests                                  | Run Command                |
| ------------- | ---------------------- | ---------------------------------------------- | -------------------------- |
| Unit          | Vitest + jsdom         | Utilities, data integrity, component rendering | `npm run test:unit`        |
| E2E           | Playwright + Chromium  | User flows, navigation, accessibility, SEO     | `npm test`                 |
| Accessibility | @axe-core/playwright   | WCAG 2.1 AA on all pages                       | Part of E2E suite          |
| Visual        | Playwright screenshots | Pixel-level regression (local only)            | `npm run test:ui`          |
| Performance   | Lighthouse CI          | Core Web Vitals, SEO score                     | CI pipeline (non-blocking) |

## Unit Tests (Vitest)

### What to Test

1. **Utility functions** — `cn()`, `formatPrice()`, any helpers
2. **Data integrity** — services match pricing docs, all slugs resolve, doctor assignments valid
3. **Translation coverage** — ro.json and en.json have same keys, no empty values
4. **Constants** — phone numbers, emails, coordinates are valid formats
5. **UI primitives** — Button renders correct element (`<a>` vs `<button>`), variants apply classes
6. **Cookie consent logic** — `getConsentStatus()` returns correct boolean
7. **Schema generation** — JSON-LD outputs valid structure, escapes XSS

### What NOT to Unit Test

- Components that need i18n/routing context (too much mocking overhead)
- Layout components (test via E2E instead)
- CSS visual output (test via visual regression)

### localStorage Mocking Pattern

jsdom doesn't provide standard localStorage. Use this pattern:

```typescript
const mockStorage = new Map<string, string>();
const mockLocalStorage = {
  getItem: vi.fn((key: string) => mockStorage.get(key) ?? null),
  setItem: vi.fn((key: string, value: string) => mockStorage.set(key, value)),
  removeItem: vi.fn((key: string) => mockStorage.delete(key)),
  clear: vi.fn(() => mockStorage.clear()),
  get length() {
    return mockStorage.size;
  },
  key: vi.fn((index: number) => [...mockStorage.keys()][index] ?? null),
};
Object.defineProperty(globalThis, "localStorage", {
  value: mockLocalStorage,
  writable: true,
});
```

### Example: Data Integrity Test

```typescript
describe("Service catalog", () => {
  it("every slug has a matching detail entry", () => {
    for (const slug of serviceSlugs) {
      expect(serviceDetails[slug], `Missing detail for ${slug}`).toBeDefined();
    }
  });

  it("every doctorId resolves to a team member", () => {
    for (const [slug, detail] of Object.entries(serviceDetails)) {
      for (const docId of detail.doctorIds) {
        const member = teamMembers.find((m) => m.id === docId);
        expect(
          member,
          `${slug} references unknown doctor ${docId}`,
        ).toBeDefined();
      }
    }
  });
});
```

---

## E2E Tests (Playwright)

### What to Test

1. **Routes** — all pages return 200 (both locales)
2. **Navigation** — header scroll behavior, mobile menu open/close/navigate
3. **Language switching** — RO↔EN, URL updates, content changes, path preservation
4. **Cookie consent** — show/accept/decline, persistence across reload
5. **Theme toggle** — dark mode toggle, persistence
6. **Accessibility** — axe-core on every page (WCAG 2.1 AA)
7. **Sitemap** — valid XML, all URLs return 200, hreflang alternates correct
8. **Service detail pages** — JSON-LD schemas present, canonical tags, breadcrumbs
9. **404** — unknown routes show 404 page
10. **Mobile** — menu interaction, content visibility at small viewports

### CI-Specific Gotchas

**Hydration race condition:** In CI, the dev server starts cold. `page.goto("/")` may return before React hydrates. If you immediately call `page.evaluate(() => window.scrollBy(...))`, the scroll listener may not be attached yet.

**Fix:** Use `{ waitUntil: "networkidle" }` for scroll-dependent tests:

```typescript
test("header gets background on scroll", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" }); // Wait for hydration
  await page.evaluate(() => window.scrollBy(0, 200));
  await expect(header).toHaveClass(/backdrop-blur/); // Auto-retry assertion
});
```

**Auto-retry assertions:** Always prefer Playwright's built-in assertions (`toHaveClass`, `toBeVisible`, `toContainText`) over manual `getAttribute` + `expect`. Built-in assertions auto-retry for up to 5 seconds.

**Bad (one-shot, flaky in CI):**

```typescript
const classes = await header.getAttribute("class");
expect(classes).toContain("backdrop-blur");
```

**Good (auto-retry, CI-safe):**

```typescript
await expect(header).toHaveClass(/backdrop-blur/);
```

**Cookie banner in accessibility tests:** Dismiss the cookie banner before running axe scans. Its entry animation has intermediate opacity states that cause false contrast failures:

```typescript
await page.evaluate(() => localStorage.setItem("cookie-consent", "accepted"));
await page.reload({ waitUntil: "networkidle" });
```

**Strict mode locators:** `page.locator("nav")` may match multiple elements (desktop nav, mobile nav, Next.js dev overlay nav). Use `.first()` or scope to a specific container:

```typescript
// Bad — strict mode violation if multiple navs exist
await expect(page.locator("nav")).toContainText(/Home/);

// Good — scoped
const mobilePanel = page.locator(".lg\\:hidden.fixed");
const link = mobilePanel.locator("a", { hasText: /services/i }).first();
```

---

## Accessibility Testing

```typescript
import AxeBuilder from "@axe-core/playwright";

const pages = [
  { name: "Home", path: "/" },
  { name: "Team", path: "/echipa" },
  // ... all pages
];

for (const { name, path } of pages) {
  test(`${name} has no critical a11y violations`, async ({ page }) => {
    await page.goto(path, { waitUntil: "networkidle" });

    // Dismiss cookie banner
    await page.evaluate(() => localStorage.setItem("consent", "accepted"));
    await page.reload({ waitUntil: "networkidle" });

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .exclude(".google-map-iframe") // third-party
      .analyze();

    const critical = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );
    expect(critical).toHaveLength(0);
  });
}
```

---

## Visual Regression (Local Only)

```typescript
test("homepage light mode", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await page.evaluate(() => localStorage.setItem("consent", "accepted"));
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(1000); // Animation settle

  await expect(page).toHaveScreenshot("home-light.png", {
    maxDiffPixelRatio: 0.01,
  });
});
```

Exclude from CI: `npx playwright test --grep-invert "Visual Regression"`

---

## Test Organization

```
tests/
├── accessibility.spec.ts    # Axe on all pages
├── cookie-consent.spec.ts   # GDPR banner flow
├── language.spec.ts         # i18n switching
├── middleware.spec.ts       # Locale routing
├── mobile.spec.ts           # Responsive behavior
├── navigation.spec.ts       # Header, footer, menu
├── routes.spec.ts           # All routes return 200
├── service-landing.spec.ts  # Service detail pages
├── sitemap.spec.ts          # Sitemap + canonical validation
├── theme.spec.ts            # Dark mode
├── visual.spec.ts           # Screenshots (local only)
└── unit/
    ├── setup.ts             # @testing-library/jest-dom
    ├── utils.test.ts
    ├── services.test.ts
    ├── constants.test.ts
    ├── translations.test.ts
    ├── components.test.tsx
    ├── schemas.test.tsx
    ├── cookie-consent.test.tsx
    └── analytics.test.tsx
```
