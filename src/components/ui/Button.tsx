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
  "aria-label"?: string;
};

const variants = {
  primary:
    "bg-primary text-primary-foreground [@media(hover:hover)]:hover:opacity-90 shadow-lg",
  secondary:
    "border border-border text-foreground [@media(hover:hover)]:hover:bg-surface-elevated",
  ghost: "text-foreground [@media(hover:hover)]:hover:bg-surface-elevated",
  whatsapp:
    "bg-whatsapp text-whatsapp-foreground [@media(hover:hover)]:hover:opacity-90 shadow-lg",
};

const sizes = {
  sm: "px-4 py-2 text-sm min-h-[44px] min-w-[44px]",
  md: "px-6 py-3 text-base min-h-[44px] min-w-[44px]",
  lg: "px-8 py-4 text-lg min-h-[44px] min-w-[44px]",
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
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold",
    "transition-[transform,opacity] duration-200 cursor-pointer active:scale-95",
    variants[variant],
    sizes[size],
    className,
  );

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
