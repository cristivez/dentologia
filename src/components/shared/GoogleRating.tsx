import { Star } from "lucide-react";
import { CLINIC, GOOGLE_RATING, formattedRating } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * Displays the clinic's real Google rating. Deliberately not marked up as
 * `aggregateRating` JSON-LD — Google disallows a business rating itself.
 */
export function GoogleRating({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const starSize = size === "lg" ? 20 : size === "md" ? 18 : 14;
  const valueSize =
    size === "lg" ? "text-5xl" : size === "md" ? "text-4xl" : "text-2xl";

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="flex items-center gap-3">
        <span className={cn("font-bold text-foreground", valueSize)}>
          {formattedRating}
        </span>
        <div className="flex flex-col gap-1">
          <div
            className="flex gap-0.5"
            role="img"
            aria-label={`${GOOGLE_RATING.value} din 5 stele`}
          >
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                size={starSize}
                className="fill-star text-star"
                aria-hidden="true"
              />
            ))}
          </div>
          <span className="text-sm text-muted">
            {GOOGLE_RATING.count} recenzii pe Google
          </span>
        </div>
      </div>
      <a
        href={CLINIC.social.google}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-primary underline underline-offset-2 [@media(hover:hover)]:hover:opacity-80 transition-opacity min-h-[44px] flex items-center"
      >
        Vezi recenziile pe Google Maps →
      </a>
    </div>
  );
}
