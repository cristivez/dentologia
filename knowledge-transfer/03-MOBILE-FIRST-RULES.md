# Mobile-First Rules

These rules were learned through real bugs on iOS Safari, Android Chrome, and mobile viewports. Each has a "why" explaining the failure mode.

## Rule 1: Never Use `100vh`

**Bad:**

```css
.hero {
  height: 100vh;
}
```

**Good:**

```css
.hero {
  height: 100dvh;
}
/* or */
.hero {
  min-height: 100dvh;
}
```

**Why:** Mobile browsers have a dynamic address bar that shrinks on scroll. `100vh` equals the viewport with the bar retracted, causing content to overflow behind the bar on initial load. `100dvh` (dynamic viewport height) adapts to the current bar state.

**Tailwind:** Use `min-h-dvh` instead of `min-h-screen` or `h-screen`.

---

## Rule 2: No Negative IntersectionObserver Margins on Mobile

**Bad:**

```tsx
<motion.div whileInView={{ opacity: 1 }} viewport={{ margin: "-80px" }}>
```

**Good:**

```tsx
const isMobile = useIsMobile();
<motion.div
  whileInView={{ opacity: 1 }}
  viewport={{ margin: isMobile ? "0px" : "-80px" }}
>
```

**Why:** Negative margins shrink the observation area. On small screens (< 812px tall), an element may never enter the reduced observation zone, so the animation never fires. Use `"0px"` margin on mobile.

---

## Rule 3: Gate Hover Behind `@media (hover: hover)`

**Bad:**

```html
<div class="hover:scale-105 hover:shadow-lg"></div>
```

**Good:**

```html
<div
  class="[@media(hover:hover)]:hover:scale-105 [@media(hover:hover)]:hover:shadow-lg active:bg-surface-elevated"
></div>
```

**Why:** On touch devices, `hover:` states become "sticky" — they activate on tap and stay until you tap elsewhere. This causes visual glitches (cards stuck in hover state) and can break navigation. Gate hover effects behind `@media (hover: hover)` and provide `active:` states for touch feedback.

---

## Rule 4: Never Transform on Tap for Links

**Bad:**

```html
<a class="active:-translate-y-0.5 active:shadow-md"></a>
```

**Good:**

```html
<a
  class="active:bg-surface-elevated [@media(hover:hover)]:hover:-translate-y-0.5"
></a>
```

**Why:** On iOS Safari, when a link's `active` state triggers a CSS `transform`, the element moves during the touch event. The browser detects the touch target has moved and cancels the navigation. The user sees the animation but the link never opens. Use background color changes for tap feedback instead.

---

## Rule 5: Minimum Touch Target 44×44px

**Bad:**

```html
<button class="p-1 text-sm">×</button>
<!-- 24×24px -->
```

**Good:**

```html
<button class="p-3 min-h-[44px] min-w-[44px]">×</button>
```

**Why:** Apple HIG requires 44×44pt minimum. Smaller targets cause mis-taps, especially on smaller phones. Always verify with browser DevTools (element inspector shows computed dimensions).

---

## Rule 6: iOS Scroll Lock

**Bad:**

```typescript
document.body.style.overflow = "hidden"; // Doesn't work on iOS Safari
```

**Good:**

```typescript
document.body.style.overflow = "hidden";
document.body.style.touchAction = "none";
document.body.style.overscrollBehavior = "none";
```

**Why:** iOS Safari ignores `overflow: hidden` on the body for scroll locking. You need all three properties. Clean up on unmount:

```typescript
useEffect(() => {
  if (menuOpen) {
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    document.body.style.overscrollBehavior = "none";
  } else {
    document.body.style.overflow = "";
    document.body.style.touchAction = "";
    document.body.style.overscrollBehavior = "";
  }
  return () => {
    /* reset all three */
  };
}, [menuOpen]);
```

---

## Rule 7: No `position: fixed` Inside a `transform` Ancestor

**Bad:**

```html
<div class="transform">
  <div class="fixed top-0">Header</div>
  <!-- Breaks! -->
</div>
```

**Good:**

```html
<div class="fixed top-0 z-50">Header</div>
<div class="transform">Content</div>
```

**Why:** CSS spec says `transform` creates a new containing block. `position: fixed` elements inside it become `position: absolute` relative to the transformed ancestor, not the viewport. This affects ALL browsers.

---

## Rule 8: Only Animate `transform` and `opacity`

**Bad:**

```css
.card {
  transition: all 0.3s;
} /* Animates width, height, padding, etc. */
```

**Good:**

```css
.card {
  transition:
    transform 0.3s,
    opacity 0.3s;
}
```

**Tailwind:**

```html
<!-- Bad: transition-all -->
<div class="transition-all duration-300">
  <!-- Good: specific properties -->
  <div class="transition-[transform,opacity] duration-300"></div>
</div>
```

**Why:** `transform` and `opacity` are the only properties that can be GPU-composited without triggering layout or paint. Animating `width`, `height`, `padding`, `margin`, or `top/left` causes layout thrashing on every frame — janky on mobile.

---

## Rule 9: `prefers-reduced-motion` Fallbacks

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

In components:

```typescript
const prefersReduced = usePrefersReducedMotion();
if (prefersReduced) return <div>{children}</div>; // No animation wrapper
```

**Why:** ~10% of users have motion sensitivity. Medical sites should be extra careful — patients may have vestibular disorders.

---

## Testing Mobile

1. **Chrome DevTools**: Device toolbar (iPhone 12/14, Galaxy S21)
2. **Real device**: Access dev server via local IP (`192.168.x.x:3001`)
3. **Playwright**: `page.setViewportSize({ width: 375, height: 812 })` with `hasTouch: true`
4. **iOS Safari**: Most restrictive — always test here for scroll/fixed/touch issues
