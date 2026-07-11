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
        variant === "default" && "bg-surface-elevated text-foreground",
        variant === "accent" && "bg-surface-elevated text-accent",
        className,
      )}
    >
      {children}
    </span>
  );
}
