# Lessons Learned

Hard-won knowledge from building DentNaik Center. Every item here cost time to discover and fix.

---

## 1. Color Contrast is Harder Than You Think

**What happened:** Initial colors `--muted: #6b7280` and `--primary: #5A8A8A` looked fine visually but failed WCAG 4.5:1 contrast on several backgrounds.

**Why it was hard:** Contrast isn't just foreground vs background. `bg-primary/10` creates a computed tinted background. `opacity-60` on a row drops all child text contrast. You need to check every combination.

**Fix:**

- Darkened `--muted` to `#596066` (5.47:1 on surface)
- Darkened `--primary` to `#446e6e` (4.71:1 on bg-primary/10)
- Removed all `text-*/70` and `opacity-60` usage on text
- Added axe-core E2E tests on every page

**Rule:** Never use fractional opacity on text. Always verify contrast against the _computed_ background, not the CSS variable.

---

## 2. iOS Safari Cancels Navigation During CSS Transform

**What happened:** On mobile, tapping a service link showed the animation (press effect) but never navigated to the detail page.

**Why:** `active:-translate-y-0.5` shifts the element's position during the tap. iOS Safari interprets this as the touch target moving out from under the finger, and cancels the navigation.

**Fix:**

```css
/* Bad — cancels navigation on iOS */
active:-translate-y-0.5 active:shadow-md

/* Good — gate transforms behind hover media query */
[@media(hover:hover)]:hover:-translate-y-0.5
[@media(hover:hover)]:hover:shadow-md
active:bg-surface-elevated  /* Safe touch feedback */
```

**Rule:** Never use `active:translate-*` or `active:scale-*` on links/buttons on mobile. Use `@media(hover:hover)` for transform effects and `active:bg-*` for touch feedback.

---

## 3. React Hydration Race Condition in CI

**What happened:** Navigation scroll tests passed locally but failed in CI. The test scrolled down, expecting the header to get a `backdrop-blur-lg` class, but it never appeared.

**Why:** `page.goto()` returns when the page loads, but React `useEffect` hooks (including scroll listeners) haven't attached yet. In CI (slower machine), the scroll event fires before the listener exists. Locally, hydration is fast enough that it works by coincidence.

**Fix:** Added `{ waitUntil: "networkidle" }` to `page.goto()` for tests that depend on client-side React state:

```typescript
await page.goto("/", { waitUntil: "networkidle" });
// Now scroll listeners are attached
await page.evaluate(() => window.scrollBy(0, 200));
```

**Rule:** Any test that triggers browser events (scroll, click) and expects React state changes must wait for hydration. `networkidle` is a reasonable proxy.

---

## 4. Playwright `getAttribute` Doesn't Auto-Retry

**What happened:** Assertion `expect(el.getAttribute("class")).toContain("backdrop-blur")` failed even with networkidle, because `getAttribute` is a one-shot call — it reads the class at that instant and never retries.

**Fix:** Use Playwright's auto-retrying assertions:

```typescript
// Bad — one-shot, no retry
const cls = await el.getAttribute("class");
expect(cls).toContain("backdrop-blur");

// Good — retries until timeout
await expect(el).toHaveClass(/backdrop-blur/);
```

**Rule:** Always use `toHaveClass()`, `toBeVisible()`, `toHaveText()` and other auto-retrying assertions. Never use `getAttribute` + manual `expect`.

---

## 5. Cookie Banner Creates False axe-core Failures

**What happened:** axe-core flagged contrast violations on cookie banner text. The colors actually pass — but Framer Motion's entry animation transitions through `opacity: 0` → `opacity: 1`, and axe catches the intermediate state.

**Fix:** Dismiss the banner before scanning:

```typescript
await page.evaluate(() =>
  localStorage.setItem("dentnaik-cookie-consent", "accepted"),
);
await page.reload({ waitUntil: "networkidle" });
// Now scan without the banner
const results = await new AxeBuilder({ page }).analyze();
```

**Rule:** Any animated component with text can produce false contrast failures. Dismiss or stabilize dynamic content before running accessibility scans.

---

## 6. `100vh` is Broken on Mobile

**What happened:** Hero section used `h-screen` (100vh). On mobile browsers, the address bar overlaps the content, making the actual viewport shorter than 100vh.

**Fix:** Use dynamic viewport units:

```css
/* Bad */
height: 100vh; /* or h-screen */

/* Good */
min-height: 100dvh; /* or min-h-dvh */
```

**Rule:** Never use `vh` for full-screen sections. Always use `dvh` (dynamic viewport height).

---

## 7. Multiple `<nav>` Elements Break Playwright Locators

**What happened:** `page.locator("nav")` returned 3 matches: desktop nav, mobile nav, and Next.js dev overlay nav. Playwright strict mode threw an error.

**Fix:** Scope locators:

```typescript
// Bad — ambiguous
page.locator("nav");

// Good — scoped
page.locator("nav").first();
page.locator("header nav");
```

**Rule:** Always scope Playwright locators. Assume there are multiple matches and be specific.

---

## 8. Slide-Out Panels Are Not `display: none`

**What happened:** Mobile menu uses `translate-x-full` to slide off-screen. `toBeHidden()` assertion failed because the element is technically still visible (just positioned off-screen).

**Fix:**

```typescript
// Bad — fails for transform-based hiding
await expect(panel).toBeHidden();

// Good — checks actual CSS state
await expect(panel).toHaveClass(/translate-x-full/);
```

**Rule:** `toBeHidden()` checks `display: none` / `visibility: hidden` / `opacity: 0`. For transform-based visibility, check the class directly.

---

## 9. Dev Server CSS Cache Persists After Variable Changes

**What happened:** Changed CSS custom properties in `globals.css`, but the dev server kept serving old styles. Tests failed with the old colors.

**Fix:** Kill the dev server completely and restart:

```bash
lsof -ti:3001 | xargs kill -9
npm run dev
```

**Rule:** After changing CSS custom properties, restart the dev server. Hot reload doesn't always pick up `@theme` or `:root` variable changes.

---

## 10. Cloudflare Workers Error 1101

**What happened:** Production deployment returned Error 1101 (Worker threw unhandled exception).

**Common causes:**

1. Dynamic imports with template literals (`import(\`../messages/${locale}/...\`)`) — bundler may not include all files
2. Missing environment variables in Cloudflare dashboard
3. Using Node.js APIs not available in Workers (even with `nodejs_compat`)

**Debugging:**

```bash
npm run preview    # Test locally in Worker environment
wrangler tail      # Stream production logs
```

**Rule:** Always test with `npm run preview` before deploying. It simulates the Worker environment locally.

---

## 11. `position: fixed` Inside `transform` Ancestor

**What happened:** Fixed-position elements (header, FAB) stopped being fixed when placed inside a parent with a CSS `transform`.

**Why:** CSS spec says `position: fixed` is relative to the containing block, which changes from viewport to the transformed ancestor.

**Rule:** Never nest `position: fixed` elements inside a parent that has `transform`, `filter`, or `will-change: transform`.

---

## 12. iOS Scroll Lock Requires Three Properties

**What happened:** Setting `overflow: hidden` on body didn't prevent scrolling on iOS Safari.

**Fix:**

```css
body.menu-open {
  overflow: hidden;
  touch-action: none;
  overscroll-behavior: none;
}
```

All three are required. iOS Safari ignores `overflow: hidden` alone.

---

## 13. IntersectionObserver Negative Margins on Mobile

**What happened:** `whileInView` with `margin: "-80px"` never triggered on small screens because the negative margin was larger than the element's intersection area.

**Fix:** Use `"0px"` margin on mobile:

```typescript
const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
<motion.div whileInView="visible" viewport={{ margin: isMobile ? "0px" : "-80px" }} />
```

**Rule:** Negative IntersectionObserver margins must be smaller than the element. On mobile screens, use zero or small positive margins.

---

## Summary Checklist

Before going live, verify:

- [ ] axe-core passes on every page (dismiss cookie banner first)
- [ ] All text passes 4.5:1 contrast — no opacity classes on text
- [ ] No `active:translate-*` on links (iOS navigation bug)
- [ ] Tests use `waitUntil: "networkidle"` for hydration-dependent assertions
- [ ] Tests use auto-retrying assertions (`toHaveClass`, not `getAttribute`)
- [ ] No `100vh` — use `100dvh`
- [ ] `npm run preview` works before deploying
- [ ] Mobile scroll lock uses all three CSS properties
- [ ] No `position: fixed` inside `transform` ancestors
