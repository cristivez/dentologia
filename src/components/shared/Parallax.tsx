"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

/**
 * Subtle scroll parallax for a single image.
 *
 * The frame clips (`overflow-hidden`); an inner wrapper is scaled up so the
 * image overflows, then GSAP scrubs it a few percent as the frame crosses the
 * viewport — the classic depth cue, and the one place GSAP earns its weight
 * over Framer Motion (a scrub tied to scroll position).
 *
 * GSAP (~44 KB) is loaded lazily via dynamic import, and only once the frame
 * nears the viewport — so it never touches the homepage's initial payload or
 * the LCP path. It is also never loaded under reduced motion or with JS off,
 * where the image simply renders as a normal, un-cropped picture.
 *
 * `amount` is the peak travel as a percentage of the element's height.
 */
export function Parallax({
  children,
  className,
  amount = 7,
}: {
  children: React.ReactNode;
  className?: string;
  amount?: number;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;
    const frameEl = frame.current;
    const innerEl = inner.current;
    if (!frameEl || !innerEl) return;

    let cancelled = false;
    let ctx: { revert: () => void } | undefined;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();

        Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
          ([{ default: gsap }, { ScrollTrigger }]) => {
            if (cancelled) return;
            gsap.registerPlugin(ScrollTrigger);
            // Scoped context → revert() kills the tween + ScrollTrigger and
            // clears the inline transform on unmount.
            ctx = gsap.context(() => {
              gsap.set(innerEl, { scale: 1 + (amount + 1) / 50 });
              gsap.fromTo(
                innerEl,
                { yPercent: -amount },
                {
                  yPercent: amount,
                  ease: "none",
                  scrollTrigger: {
                    trigger: frameEl,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 0.5,
                  },
                },
              );
            }, frameEl);
          },
        );
      },
      // Preload a little before the frame scrolls in, so the motion is ready.
      { rootMargin: "200px" },
    );
    io.observe(frameEl);

    return () => {
      cancelled = true;
      io.disconnect();
      ctx?.revert();
    };
  }, [prefersReduced, amount]);

  return (
    <div ref={frame} className={cn("overflow-hidden", className)}>
      <div ref={inner} className="will-change-transform">
        {children}
      </div>
    </div>
  );
}
