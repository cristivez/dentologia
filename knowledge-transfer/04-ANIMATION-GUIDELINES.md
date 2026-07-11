# Animation Guidelines — Medical/Dental Websites

## Design Philosophy

- **Calming** — patients visiting a dental site may be anxious. Animations should reassure, not excite
- **Professional** — no bouncy springs, playful wobbles, or attention-grabbing effects
- **Purposeful** — every animation serves a function: guiding attention, showing state change, or providing feedback
- **Performant** — smooth 60fps on budget phones. Only animate `transform` and `opacity`

## Timing

| Use Case              | Duration  | Easing  |
| --------------------- | --------- | ------- |
| Fade-in on scroll     | 0.5–0.8s  | easeOut |
| Button hover/active   | 0.2s      | ease    |
| Page transitions      | 0.3–0.4s  | easeOut |
| Modal open            | 0.3s      | easeOut |
| Modal close           | 0.2s      | easeIn  |
| Stagger between items | 0.05–0.1s | —       |

## Pattern: Scroll-Triggered Reveal (AnimatedSection)

The centerpiece animation component. All below-fold content uses this.

```tsx
"use client";
import { m } from "framer-motion";
import { useIsMobile } from "@/hooks/useIsMobile";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type Props = {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
  className?: string;
};

export function AnimatedSection({
  children,
  direction = "up",
  delay = 0,
  duration = 0.6,
  className,
}: Props) {
  const isMobile = useIsMobile();
  const prefersReduced = usePrefersReducedMotion();

  if (prefersReduced) return <div className={className}>{children}</div>;

  const offset = isMobile ? 20 : 40;
  const directionMap = {
    up: { y: offset },
    down: { y: -offset },
    left: { x: offset },
    right: { x: -offset },
  };

  return (
    <m.div
      initial={{ opacity: 0, ...directionMap[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: isMobile ? "0px" : "-80px" }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </m.div>
  );
}
```

## Pattern: Card Hover (Desktop Only)

```html
<div
  class="transition-[transform,box-shadow] duration-300
  [@media(hover:hover)]:hover:-translate-y-1
  [@media(hover:hover)]:hover:shadow-lg
  [@media(hover:hover)]:hover:shadow-primary/10
  active:bg-surface-elevated"
></div>
```

## Pattern: Tap Feedback (Mobile)

```html
<button class="active:scale-95 transition-transform duration-200"></button>
```

For links that navigate (where transform can cancel navigation):

```html
<a class="active:bg-surface-elevated transition-colors duration-200"></a>
```

## Pattern: Staggered List

```tsx
{
  items.map((item, i) => (
    <AnimatedSection key={item.id} delay={Math.min(i * 0.08, 0.48)}>
      <ItemCard item={item} />
    </AnimatedSection>
  ));
}
```

**Cap at 6 items** (`Math.min(i * 0.08, 0.48)`). Beyond 6, the delay becomes noticeable and annoying.

## Pattern: CSS Micro-Animation (No JS)

For simple effects that don't need Framer Motion:

```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-hidden {
  opacity: 0 !important;
  transform: translateY(0.5rem) !important;
}
```

Use with IntersectionObserver in a `useEffect`:

```typescript
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.remove("animate-hidden");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 },
);
```

## MotionProvider Setup

Lazy-load Framer Motion features for performance:

```tsx
"use client";
import { LazyMotion, domAnimation } from "framer-motion";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
```

Use `m.div` (not `motion.div`) inside LazyMotion for tree-shaking.

## What NOT to Do

- No parallax scrolling on mobile (causes jank)
- No bouncy spring animations (`type: "spring"` with high bounce)
- No auto-playing video backgrounds (bandwidth, accessibility)
- No infinite loading spinners > 3 seconds (use skeleton screens)
- No transform animations on tappable links (breaks iOS navigation)
- No `transition-all` (animates layout properties, causes paint thrashing)
