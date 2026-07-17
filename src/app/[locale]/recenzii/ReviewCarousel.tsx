"use client";

import { useCallback, useSyncExternalStore } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { reviews } from "@/data/reviews";
import { cn } from "@/lib/utils";

/**
 * Split out of page.tsx so the page itself stays a server component.
 *
 * `reviews` is empty by design (see data/reviews.ts), so this never renders
 * today and its chunk — embla included — is never sent to the browser. Adding
 * real reviews back to that list is all it takes to bring this back; keep it
 * that way rather than inlining it into the page.
 */
function StarRating({ rating }: { rating: number }) {
  return (
    <div
      className="flex gap-0.5"
      role="img"
      aria-label={`${rating} din 5 stele`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={16}
          className={cn(i < rating ? "fill-star text-star" : "text-muted/40")}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export function ReviewCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    skipSnaps: false,
    dragFree: false,
  });

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (!emblaApi) return () => {};
      emblaApi.on("select", onStoreChange);
      emblaApi.on("reInit", onStoreChange);
      return () => {
        emblaApi.off("select", onStoreChange);
        emblaApi.off("reInit", onStoreChange);
      };
    },
    [emblaApi],
  );

  const selectedIndex = useSyncExternalStore(
    subscribe,
    () => (emblaApi ? emblaApi.selectedScrollSnap() : 0),
    () => 0,
  );

  const snapCount = useSyncExternalStore(
    subscribe,
    () => (emblaApi ? emblaApi.scrollSnapList().length : 0),
    () => 0,
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi],
  );

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {reviews.map((review) => (
            <div
              key={review.author}
              className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_calc(50%-8px)] lg:flex-[0_0_calc(33.333%-11px)]"
            >
              <div className="rounded-2xl bg-surface border border-border p-6 h-full flex flex-col gap-3">
                <StarRating rating={review.rating} />
                <blockquote className="text-sm text-foreground leading-relaxed flex-1">
                  &ldquo;{review.text}&rdquo;
                </blockquote>
                <p className="text-sm font-semibold text-primary">
                  {review.author}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 mt-6">
        <div
          className="flex gap-2"
          role="tablist"
          aria-label="Navigare recenzii"
        >
          {Array.from({ length: snapCount }, (_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === selectedIndex}
              aria-label={`Pagina ${i + 1}`}
              onClick={() => scrollTo(i)}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-colors cursor-pointer",
                i === selectedIndex
                  ? "bg-primary"
                  : "bg-border [@media(hover:hover)]:hover:bg-muted",
              )}
            />
          ))}
        </div>

        <div className="flex gap-4">
          <button
            onClick={scrollPrev}
            aria-label="Recenzia anterioară"
            className="flex items-center justify-center w-11 h-11 min-h-[44px] min-w-[44px] rounded-full bg-surface border border-border text-foreground [@media(hover:hover)]:hover:bg-surface-elevated transition-colors cursor-pointer"
          >
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
          <button
            onClick={scrollNext}
            aria-label="Recenzia următoare"
            className="flex items-center justify-center w-11 h-11 min-h-[44px] min-w-[44px] rounded-full bg-surface border border-border text-foreground [@media(hover:hover)]:hover:bg-surface-elevated transition-colors cursor-pointer"
          >
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
