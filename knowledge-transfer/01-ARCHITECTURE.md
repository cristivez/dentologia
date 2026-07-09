# Architecture Patterns

## App Router Conventions

- **Server Components by default** — only add `"use client"` when the component needs interactivity (hooks, event handlers, browser APIs)
- **Layout hierarchy**: `app/layout.tsx` (root) → `app/[locale]/layout.tsx` (providers, header, footer)
- **Error boundaries**: `error.tsx` per route + `global-error.tsx` at app root
- **Loading states**: `loading.tsx` per route (Suspense fallback)
- **Dynamic imports**: Use `next/dynamic` + `<Suspense>` for non-critical components (cookie banner, FAB, map)

## Provider Stack

```tsx
// app/[locale]/layout.tsx
<ThemeProvider>
  {" "}
  {/* next-themes: class-based dark mode */}
  <MotionProvider>
    {" "}
    {/* framer-motion: LazyMotion with domAnimation */}
    <NextIntlClientProvider messages={messages}>
      <Header />
      {children}
      <Footer />
      <Suspense>
        <FloatingContactFAB />
      </Suspense>
      <Suspense>
        <CookieConsent />
      </Suspense>
      <Analytics />
      <WebVitals />
    </NextIntlClientProvider>
  </MotionProvider>
</ThemeProvider>
```

## Component Organization

### UI Primitives (`components/ui/`)

Reusable, stateless, no business logic:

- **Button** — polymorphic (renders `<a>` if `href`, else `<button>`), variants: primary/secondary/ghost/whatsapp
- **Card** — `rounded-2xl bg-surface border-border p-6`, optional hover lift
- **Container** — `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`, polymorphic `as` prop
- **SectionHeading** — h2 with subtitle, decorative accent bar, align center/left
- **Badge** — inline pill label, variants: default (primary tint), accent

### Layout (`components/layout/`)

Page structure, appears on every page:

- **Header** — fixed, hides on scroll-down, transparent on homepage hero
- **Footer** — 4-column grid: brand, nav, contact, social
- **ThemeToggle** — sun/moon icon, cycles light↔dark
- **LanguageToggle** — RO/EN buttons, updates URL via `router.replace`

### Shared (`components/shared/`)

Cross-cutting concerns:

- **AnimatedSection** — scroll-triggered fade-in via Framer Motion `whileInView`
- **CookieConsent** — GDPR banner, localStorage persistence, StorageEvent dispatch
- **Analytics** — GA loader, gated behind cookie consent
- **WebVitals** — sends Core Web Vitals to GA
- **JsonLd** — schema.org Dentist structured data
- **FloatingContactFAB** — expandable phone/WhatsApp button

### Feature Components (`components/[feature]/`)

Domain-specific, used on one page:

- `gallery/GalleryGrid.tsx` — masonry grid with lightbox
- `team/TeamCard.tsx` — doctor card with image, specialty, bio
- `services/ServiceCategory.tsx` — price list with links to detail pages
- `testimonials/TestimonialsCarousel.tsx` — embla carousel with autoplay

## Data Layer

Static data in `src/data/`:

```typescript
// services.ts — pricing catalog
type ServiceItem = { nameKey: string; price: string; slug?: string };
type ServiceCategory = { titleKey: string; items: ServiceItem[] };

// team.ts — doctor profiles with E-E-A-T fields
type TeamMember = {
  id: string;
  name: string;
  nameKey: string;
  specialtyKey: string;
  bioKey: string;
  image: string;
  yearsOfExperience?: number;
  education?: string[];
  certifications?: string[];
  memberships?: string[];
};

// gallery.ts — image metadata
type GalleryImage = { src: string; alt: string; width: number; height: number };
```

## Utility Functions

```typescript
// lib/utils.ts
function cn(...inputs: ClassValue[]) // clsx + tailwind-merge

// lib/constants.ts
const CLINIC = { name, phone, email, address, coordinates, social, ... }
const SCHEDULE = [{ day, open, close }, ...]

// lib/metadata.ts
function generatePageMetadata({ locale, titleKey, descriptionKey, path, ... }): Metadata
```

## Custom Hooks

```typescript
// hooks/useScrollDirection.ts — header hide/show
function useScrollDirection(): {
  scrollDirection: "up" | "down";
  isAtTop: boolean;
};

// hooks/useIsMobile.ts — responsive logic
function useIsMobile(breakpoint?: number): boolean;

// hooks/usePrefersReducedMotion.ts — animation respect
function usePrefersReducedMotion(): boolean;
```

All hooks use `useSyncExternalStore` for hydration safety.

## Routing

- Romanian (default): `/preturi`, `/echipa`, `/contact`
- English: `/en/preturi`, `/en/echipa`, `/en/contact`
- Prefix strategy: `"as-needed"` — no `/ro` prefix for default locale
- Always use `Link` from `@/i18n/navigation` (not `next/link`) for automatic locale handling
