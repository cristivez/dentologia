# Accessibility Standards — WCAG 2.1 AA

## Target Level

**WCAG 2.1 AA** — the standard for commercial websites and a legal requirement in the EU.

## Color Contrast

### Minimum Ratios

| Text Type                            | Minimum Ratio |
| ------------------------------------ | ------------- |
| Normal text (< 18px)                 | 4.5:1         |
| Large text (>= 18px bold or >= 24px) | 3:1           |
| UI components (borders, icons)       | 3:1           |

### How to Check

1. **Before choosing colors**: Use a contrast calculator (WebAIM Contrast Checker)
2. **After implementation**: axe-core catches violations automatically in E2E tests
3. **Opacity trap**: `text-primary/70` reduces contrast — always verify the computed color against its background

### Common Mistakes

- **Muted text on surface backgrounds**: `#6b7280` on `#F0EDE8` gives only 4.14:1 (fails). We darkened to `#596066` for 5.47:1
- **Primary on tinted backgrounds**: `bg-primary/10` creates a tinted surface. Check primary text color against that computed background, not the base background
- **Opacity classes**: `text-muted/60` or `opacity-60` dramatically reduce contrast. Avoid fractional opacities on text
- **Animation opacity**: Cookie banner entry animations pass through opacity 0→1, causing false axe failures. Dismiss banners before scanning

### Tested Values (Proven to Pass)

```css
:root {
  --primary: #446e6e; /* 5.09:1 on #FAF9F6, 4.71:1 on bg-primary/10 */
  --muted: #596066; /* 5.47:1 on #F0EDE8, 6.06:1 on #FAF9F6 */
  --foreground: #1e293b; /* 12.63:1 on #FAF9F6 */
  --primary-foreground: #fff; /* 5.36:1 on #446e6e (buttons) */
}
```

## Touch Targets

- **Minimum**: 44×44px (Apple HIG)
- **Recommended**: 48×48px (Google Material)
- **Spacing**: At least 8px between adjacent targets

```html
<!-- Bad -->
<button class="p-1">×</button>

<!-- Good -->
<button class="min-h-[44px] min-w-[44px] p-3">×</button>
```

## Keyboard Navigation

- **Skip link**: First element in body, visible on focus

```html
<a
  href="#main-content"
  class="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4"
>
  Skip to main content
</a>
```

- **Focus indicators**: Never remove outline without replacement. Tailwind's `focus-visible:ring-2` is good
- **Tab order**: Must follow visual order. Avoid `tabindex > 0`
- **Escape key**: Close modals and menus

## Semantic HTML

- Use `<header>`, `<main>`, `<footer>`, `<nav>`, `<section>`, `<article>`
- Heading hierarchy: `h1` → `h2` → `h3` (never skip levels)
- `<button>` for actions, `<a>` for navigation
- `aria-label` on icon-only buttons: `<button aria-label="Toggle menu">`

## Images

- Every `<img>` needs `alt` text (descriptive for content images, empty `alt=""` for decorative)
- Gallery images: describe what's shown (not "image-1.jpg")
- Team photos: include doctor name and title

## Motion Sensitivity

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-delay: 0ms !important;
  }
}
```

In components, check with `usePrefersReducedMotion()` and skip animations entirely.

## Automated Testing

Run axe-core on every page in CI:

```typescript
import AxeBuilder from "@axe-core/playwright";

test("page has no critical a11y violations", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });

  // Dismiss dynamic content that causes false positives
  await page.evaluate(() => localStorage.setItem("consent", "accepted"));
  await page.reload({ waitUntil: "networkidle" });

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .exclude(".google-map-iframe")
    .analyze();

  const critical = results.violations.filter(
    (v) => v.impact === "critical" || v.impact === "serious",
  );
  expect(critical).toHaveLength(0);
});
```

## Checklist

- [ ] Color contrast ratios meet 4.5:1 for normal text
- [ ] All touch targets are 44×44px minimum
- [ ] Skip-to-main-content link is present and functional
- [ ] Heading hierarchy is correct (h1 → h2 → h3)
- [ ] All images have meaningful alt text
- [ ] Icon-only buttons have aria-label
- [ ] prefers-reduced-motion is respected
- [ ] Keyboard navigation works for all interactive elements
- [ ] axe-core tests pass on all pages in CI
- [ ] No text uses opacity classes that drop contrast below 4.5:1
