# Project Blueprint — Dental Clinic Website

## Tech Stack

| Layer         | Technology                                    | Why                                                       |
| ------------- | --------------------------------------------- | --------------------------------------------------------- |
| Framework     | Next.js 16+ (App Router, Server Components)   | SSG for static pages, edge rendering, built-in SEO        |
| UI            | React 19, Tailwind CSS 4                      | Utility-first CSS, server components support              |
| Animation     | Framer Motion 12                              | Scroll-triggered animations, reduced-motion support       |
| Theming       | next-themes                                   | Class-based dark mode, system preference detection        |
| i18n          | next-intl                                     | Locale routing, server/client translation, SEO alternates |
| Icons         | lucide-react                                  | Tree-shakeable, consistent medical-appropriate icons      |
| Carousel      | embla-carousel-react                          | Lightweight, touch-friendly, accessible                   |
| Testing       | Playwright (E2E) + Vitest (unit)              | Full coverage from components to user flows               |
| Accessibility | @axe-core/playwright                          | Automated WCAG 2.1 AA audits in CI                        |
| Linting       | ESLint 9 + Prettier                           | Flat config, auto-fix on commit                           |
| Pre-commit    | Husky + lint-staged                           | Enforce quality before code enters repo                   |
| Deployment    | Cloudflare Workers via @opennextjs/cloudflare | Edge-deployed, global CDN, low latency                    |
| CI/CD         | GitHub Actions                                | Lint → Unit → E2E → Lighthouse → Deploy                   |

## Node.js Requirement

- Node.js >= 22 (set in `.nvmrc`)
- npm >= 10

## Getting Started (New Project)

```bash
# 1. Create Next.js project
npx create-next-app@latest my-clinic --app --typescript --tailwind --eslint

# 2. Install core dependencies
npm install next-intl next-themes framer-motion lucide-react embla-carousel-react clsx tailwind-merge

# 3. Install dev dependencies
npm install -D @playwright/test vitest @vitejs/plugin-react jsdom \
  @axe-core/playwright @testing-library/react @testing-library/jest-dom \
  prettier husky lint-staged @opennextjs/cloudflare wrangler

# 4. Set up Husky
npx husky init

# 5. Set dev port to 3001 (avoid conflicts)
# In package.json scripts: "dev": "next dev --port 3001"

# 6. Create .nvmrc
echo "22" > .nvmrc
```

## Project Structure

```
src/
├── app/
│   ├── [locale]/           # Locale-based routing (ro default, en secondary)
│   │   ├── layout.tsx      # Root layout with providers
│   │   ├── page.tsx        # Homepage
│   │   ├── error.tsx       # Route error boundary
│   │   ├── not-found.tsx   # 404 page
│   │   ├── loading.tsx     # Loading spinner
│   │   ├── contact/        # Contact page
│   │   ├── echipa/         # Team page
│   │   ├── galerie/        # Gallery page
│   │   ├── preturi/        # Services + [slug] detail pages
│   │   ├── program/        # Schedule page
│   │   └── confidentialitate/ # Privacy policy (GDPR)
│   ├── api/health/         # Health check endpoint
│   ├── sitemap.ts          # Dynamic sitemap
│   ├── robots.ts           # robots.txt
│   └── manifest.ts         # PWA manifest
├── components/
│   ├── ui/                 # Primitives: Button, Card, Container, Badge, SectionHeading
│   ├── layout/             # Header, Footer, LanguageToggle, ThemeToggle
│   ├── sections/           # Homepage sections (Hero, About, Services, Team, etc.)
│   ├── shared/             # Global: CookieConsent, Analytics, WebVitals, FAB, JsonLd
│   └── [feature]/          # Feature-specific (gallery, team, services, testimonials)
├── data/                   # Static data (team members, services, gallery images)
├── hooks/                  # Custom hooks (useScrollDirection, useIsMobile, etc.)
├── i18n/                   # Internationalization config (routing, request, navigation)
├── lib/                    # Utilities (cn, constants, metadata helpers, reviews)
└── messages/               # Translation files (ro.json, en.json, plus per-category splits)
tests/
├── *.spec.ts               # Playwright E2E tests
└── unit/                   # Vitest unit tests
docs/                       # Architecture, deployment, content reference
```

## Environment Variables

```bash
# .env.example
GOOGLE_PLACES_API_KEY=      # Google Places API for live reviews (optional)
GOOGLE_PLACE_ID=            # Your clinic's Google Place ID (optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=  # Google Analytics (optional)
```

Without Google Places variables, testimonials show static fallback reviews.

## NPM Scripts

```json
{
  "dev": "next dev --port 3001",
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
}
```
