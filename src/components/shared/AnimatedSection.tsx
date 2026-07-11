"use client";

import { m } from "framer-motion";
import { useIsMobile } from "@/hooks/useIsMobile";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { spring, viewportOnce } from "@/lib/motion";

type AnimatedSectionProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

/**
 * Fades and lifts a single block into view. For a set of sibling elements that
 * should animate as one sequence, use `AnimatedGroup` + `AnimatedItem` instead:
 * a per-child `delay` here is measured from each child's own viewport entry,
 * which does not read as a stagger.
 */
export function AnimatedSection({
  children,
  className,
  delay = 0,
}: AnimatedSectionProps) {
  const prefersReduced = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: isMobile ? 16 : 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={isMobile ? { once: true, margin: "0px" } : viewportOnce}
      transition={{ ...spring, delay }}
    >
      {children}
    </m.div>
  );
}
