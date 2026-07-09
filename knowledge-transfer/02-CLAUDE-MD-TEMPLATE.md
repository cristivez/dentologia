# CLAUDE.md Template

Copy this file to the root of your new project as `CLAUDE.md`. Replace placeholders with your clinic's details.

---

```markdown
# {{CLINIC_NAME}} — Project Guidelines

## Overview

Dental clinic website for **{{CLINIC_NAME}}** in {{CITY}}, {{REGION}}, {{COUNTRY}}.
Single responsive website (no separate mobile app).

## Tech Stack

- **Framework**: Next.js 16+ (App Router, Server Components)
- **UI**: React 19, Tailwind CSS 4, Framer Motion 12
- **Theming**: next-themes (class-based dark mode, system preference default)
- **i18n**: next-intl ({{DEFAULT_LOCALE}} default, {{SECONDARY_LOCALE}} secondary)
- **Icons**: lucide-react | **Carousel**: embla-carousel-react
- **Testing**: Playwright (E2E), Vitest (unit) | **Linting**: ESLint 9, Prettier
- **Code Quality**: Husky pre-commit hooks, lint-staged
- **Deployment**: Cloudflare Workers via @opennextjs/cloudflare
- **CI/CD**: GitHub Actions (lint → tests → build → deploy on push to main)
- **Dev server**: `npm run dev` → localhost:3001

## Architecture
```

src/
├── app/[locale]/ # Pages (locale-based routing)
├── components/
│ ├── ui/ # Primitives (Button, Card, Container, Badge, SectionHeading)
│ ├── layout/ # Header, Footer, LanguageToggle, ThemeToggle
│ ├── sections/ # Home page sections
│ ├── shared/ # Global (FAB, CookieConsent, AnimatedSection, Analytics)
│ └── [feature]/ # Feature-specific (gallery, team, services, testimonials)
├── data/ # Static data (team, services, gallery)
├── hooks/ # Custom hooks
├── i18n/ # Internationalization config
├── lib/ # Utilities (constants, metadata, utils)
└── messages/ # Translation files

````

## Key Patterns
- **All scroll-triggered animations** go through `AnimatedSection` component
- **Translations**: all user-facing text lives in `src/messages/{locale}.json`
- **Constants**: clinic info, schedule, social links in `src/lib/constants.ts`
- **Utility**: `cn()` from `src/lib/utils.ts` (clsx + tailwind-merge)
- **SEO**: JsonLd structured data, sitemap, robots.txt, OpenGraph metadata
- **Links**: always use `Link` from `@/i18n/navigation` (not `next/link`)

## Mobile-First Rules (CRITICAL)
1. **Never use `100vh` or `h-screen`** — use `100dvh` or `min-h-dvh` instead (mobile address bar overlap)
2. **Never use negative IntersectionObserver margins on mobile** — use `"0px"` on mobile
3. **Always provide touch equivalents for hover interactions** — gate hover behind `@media (hover: hover)`, pair with `active:` states
4. **Minimum touch target: 44×44px** (Apple HIG)
5. **Always add `prefers-reduced-motion` fallbacks** for animations
6. **Never place `position: fixed` inside a `transform` ancestor** — breaks on all browsers
7. **iOS scroll lock requires**: `overflow: hidden` + `touch-action: none` + `overscroll-behavior: none`
8. **Only animate `transform` and `opacity`** — GPU-composited, no layout/paint
9. **Never use `active:-translate-y-*` on tappable links** — transform during touch cancels navigation on iOS Safari

## Animation Style
- **Professional medical — calm, not playful**
- Eased transitions, 0.4–0.8s durations, `easeOut` curves
- No bouncy springs for clinical content
- Max 3–4 simultaneous animations on screen
- Cap stagger delays (never stagger more than 6 items)
- Reduce or disable parallax on mobile

## Confidence Rule
Before implementing any change:
1. State confidence level (0.0 to 1.0)
2. If confidence < 0.98 → STOP. Research the topic, read source code, check browser compatibility
3. Only proceed with implementation when confidence ≥ 0.98
4. After implementation, verify with testing before declaring done

## Communication
- Project owner is a **non-developer stakeholder**
- Always explain the "why" behind technical decisions in plain language
- Use analogies when helpful
- Present trade-offs in terms of user experience, not technical complexity

## Commands
```bash
npm run dev         # Dev server on :3001
npm run build       # Production build
npm run lint        # ESLint
npm test            # Playwright E2E tests
npm run test:ui     # Playwright UI mode
npm run test:unit   # Vitest unit tests
npm run preview     # Build + local Cloudflare Worker preview
npm run deploy      # Build + deploy to Cloudflare Workers
````

```

```
