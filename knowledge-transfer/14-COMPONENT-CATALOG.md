# Component Catalog

## UI Primitives

### Button

Polymorphic component — renders `<a>` when `href` is provided, `<button>` otherwise.

```tsx
import { cn } from "@/lib/utils";

type ButtonProps = {
  variant?: "primary" | "secondary" | "ghost" | "whatsapp";
  size?: "sm" | "md" | "lg";
  href?: string;
  target?: string;
  rel?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

const variants = {
  primary:
    "bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/25",
  secondary: "border border-border text-foreground hover:bg-surface-elevated",
  ghost: "text-foreground hover:bg-surface-elevated",
  whatsapp:
    "bg-whatsapp text-white hover:opacity-90 shadow-lg shadow-whatsapp/25",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  href,
  children,
  className,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium",
    "transition-all duration-200 cursor-pointer active:scale-95",
    variants[variant],
    sizes[size],
    className,
  );

  if (href)
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
```

### Container

```tsx
import { cn } from "@/lib/utils";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "main";
};

export function Container({
  children,
  className,
  as: Tag = "div",
}: ContainerProps) {
  return (
    <Tag className={cn("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </Tag>
  );
}
```

### Card

```tsx
import { cn } from "@/lib/utils";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
};

export function Card({ children, className, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-surface border border-border p-6",
        hover &&
          "transition-[transform,box-shadow] duration-300 [@media(hover:hover)]:hover:-translate-y-1 [@media(hover:hover)]:hover:shadow-lg",
        className,
      )}
    >
      {children}
    </div>
  );
}
```

### SectionHeading

```tsx
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
};

export function SectionHeading({
  title,
  subtitle,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn("mb-12", align === "center" && "text-center", className)}
    >
      <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-muted text-lg max-w-2xl mx-auto">{subtitle}</p>
      )}
      <div
        className={cn(
          "mt-4 h-1 w-16 rounded-full bg-accent",
          align === "center" && "mx-auto",
        )}
      />
    </div>
  );
}
```

### Badge

```tsx
import { cn } from "@/lib/utils";

type BadgeProps = {
  children: string;
  variant?: "default" | "accent";
  className?: string;
};

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        variant === "default" && "bg-primary/10 text-primary",
        variant === "accent" && "bg-accent/10 text-accent",
        className,
      )}
    >
      {children}
    </span>
  );
}
```

## Utility: cn()

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## Layout Components

### Header Pattern

- Fixed position, `z-50`
- Transparent when at top of homepage, `bg-background/80 backdrop-blur-lg` when scrolled
- Hides on scroll down (`-translate-y-full`), reappears on scroll up
- Mobile: hamburger button → slide-out panel from right
- iOS scroll lock when menu open

### Footer Pattern

- 4-column responsive grid: Brand, Navigation, Contact, Social
- Phone link: `<a href="tel:+40...">`
- Email link: `<a href="mailto:...">`
- Privacy policy link at bottom
- Copyright with dynamic year

## Shared Components

### FloatingContactFAB

- Fixed bottom-right, appears 1s after page load
- Main button (phone icon) expands to show Call + WhatsApp options
- 44×44px minimum touch targets
- Backdrop dismisses menu
- Staggered animation (0.05s between items)

### CookieConsent

- Fixed bottom banner, appears 1.5s after first visit
- Accept/Decline → localStorage → StorageEvent dispatch
- Hidden on return visits

### Analytics

- Listens for StorageEvent from CookieConsent
- Only loads GoogleAnalytics component when consent = "accepted"

### WebVitals

- `useReportWebVitals` → sends CLS, LCP, FID, etc. to GA via `gtag`

### AnimatedSection

- Scroll-triggered reveal via Framer Motion `whileInView`
- Reduced offset on mobile (20px vs 40px)
- Respects `prefers-reduced-motion`
- `once: true` — only animates first time in view
