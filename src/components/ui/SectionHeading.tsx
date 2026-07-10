import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
  /** `h1` when this heading titles the page, `h2` (default) for a section. */
  as?: "h1" | "h2";
};

export function SectionHeading({
  title,
  subtitle,
  align = "center",
  className,
  as: Heading = "h2",
}: SectionHeadingProps) {
  return (
    <div
      className={cn("mb-12", align === "center" && "text-center", className)}
    >
      <Heading className="text-3xl md:text-4xl font-bold text-foreground mb-4">
        {title}
      </Heading>
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
