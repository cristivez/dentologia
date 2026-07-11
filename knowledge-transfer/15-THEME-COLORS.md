# Theme & Color System

## Architecture

Colors are defined as CSS custom properties in `globals.css` and mapped to Tailwind via `@theme inline`. This gives you:

- **One source of truth** for all colors
- **Dark mode** via class-based toggle (`.dark` selector)
- **Tailwind integration** — use `bg-primary`, `text-muted`, etc.

## CSS Variable Setup

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-surface: var(--surface);
  --color-surface-elevated: var(--surface-elevated);
  --color-muted: var(--muted);
  --color-border: var(--border-color);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-whatsapp: #25d366;

  --font-sans: var(--font-inter);
  --font-serif: var(--font-playfair);
}
```

## Light Mode Palette

```css
:root {
  --background: #faf9f6; /* Warm off-white */
  --foreground: #1e293b; /* Near-black slate */
  --surface: #f0ede8; /* Warm gray cards */
  --surface-elevated: #e8e4df; /* Hover/active state */
  --muted: #596066; /* Secondary text */
  --border-color: #ddd8d2; /* Subtle borders */
  --primary: #446e6e; /* Teal — trust/medical */
  --primary-foreground: #ffffff; /* White on primary buttons */
  --accent: #6b5c4a; /* Warm brown */
  --accent-foreground: #1e293b; /* Text on accent backgrounds */
}
```

## Dark Mode Palette

```css
.dark {
  --background: #0b1120; /* Deep navy */
  --foreground: #f1f5f9; /* Near-white */
  --surface: #111827; /* Dark card */
  --surface-elevated: #1e293b; /* Hover/active */
  --muted: #94a3b8; /* Lighter gray for readability */
  --border-color: #1e293b; /* Subtle dark borders */
  --primary: #7fb8b8; /* Lighter teal for dark bg */
  --primary-foreground: #0b1120; /* Dark text on primary buttons */
  --accent: #e5e5e5; /* Light neutral */
  --accent-foreground: #0b1120; /* Dark text on accent */
}
```

## Color Semantics

| Token                | Purpose                  | Usage                                              |
| -------------------- | ------------------------ | -------------------------------------------------- |
| `background`         | Page background          | `bg-background`                                    |
| `foreground`         | Primary text             | `text-foreground`                                  |
| `surface`            | Card/section backgrounds | `bg-surface`                                       |
| `surface-elevated`   | Hover/active states      | `bg-surface-elevated`, `hover:bg-surface-elevated` |
| `muted`              | Secondary/helper text    | `text-muted`                                       |
| `border`             | Borders, dividers        | `border-border`                                    |
| `primary`            | Brand color, CTAs        | `bg-primary`, `text-primary`                       |
| `primary-foreground` | Text on primary bg       | `text-primary-foreground`                          |
| `accent`             | Secondary brand accent   | `bg-accent`, `text-accent`                         |
| `whatsapp`           | WhatsApp CTA buttons     | `bg-whatsapp`                                      |

## Contrast Ratios (WCAG 2.1 AA)

All combinations must meet **4.5:1** for normal text, **3:1** for large text.

### Light Mode — Proven Values

| Combination                                         | Ratio   | Status |
| --------------------------------------------------- | ------- | ------ |
| `foreground` on `background` (#1e293b on #FAF9F6)   | 12.63:1 | Pass   |
| `muted` on `background` (#596066 on #FAF9F6)        | 6.06:1  | Pass   |
| `muted` on `surface` (#596066 on #F0EDE8)           | 5.47:1  | Pass   |
| `primary` on `background` (#446e6e on #FAF9F6)      | 5.09:1  | Pass   |
| `primary` on `bg-primary/10` (#446e6e on computed)  | 4.71:1  | Pass   |
| `primary-foreground` on `primary` (#fff on #446e6e) | 5.36:1  | Pass   |

### Common Contrast Traps

1. **Opacity classes destroy contrast**: `text-primary/70` or `text-muted/60` reduces the effective color. Never use fractional opacity on text.

2. **Tinted backgrounds change the math**: `bg-primary/10` creates a computed background color. You must check contrast against the _computed_ color, not `--background`.

3. **`opacity-60` on rows**: Applying `opacity-60` to an entire table row drops all text contrast below passing. Use `text-muted` class instead.

4. **Animation intermediate states**: Framer Motion animations pass through `opacity: 0` → `opacity: 1`. axe-core can catch the intermediate state and report false contrast violations.

## Dark Mode Setup

Uses `next-themes` with class-based switching:

```typescript
// In layout.tsx
import { ThemeProvider } from "next-themes";

<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  {children}
</ThemeProvider>
```

The `@custom-variant dark` directive in CSS tells Tailwind to use the `.dark` class selector. `next-themes` adds/removes `.dark` on `<html>`.

## Fonts

Two font families loaded via `next/font`:

```typescript
import { Inter, Playfair_Display } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

// Apply to <html>
<html className={`${inter.variable} ${playfair.variable}`}>
```

- **Inter** (`font-sans`) — body text, UI elements
- **Playfair Display** (`font-serif`) — headings, section titles

## Choosing Colors for a New Clinic

1. **Pick a primary** that conveys trust. Medical/dental sites typically use teal, blue, or green.
2. **Verify contrast** against your background before committing. Use [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/).
3. **Derive dark mode** by lightening the primary (add ~30% lightness) and using a dark background.
4. **Test with axe-core** on every page after setting colors — this catches edge cases like tinted backgrounds.

## Reduced Motion

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

This global rule ensures all CSS animations are effectively disabled for users who prefer reduced motion. Framer Motion animations should also check this preference via `usePrefersReducedMotion()`.
