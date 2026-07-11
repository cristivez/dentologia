"use client";

import { m } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import {
  groupVariants,
  groupVariantsReduced,
  itemVariants,
  itemVariantsReduced,
  viewportOnce,
} from "@/lib/motion";

/**
 * Staggers its `AnimatedItem` children as the group scrolls into view.
 *
 * Prefer this over giving each child its own `delay`: a delay is measured from
 * the moment *that child* enters the viewport, so on a short screen the cards
 * animate one at a time as you scroll past each one. Stagger is orchestrated by
 * the parent from a single trigger, so the sequence always reads as one motion.
 */
export function AnimatedGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <m.div
      className={className}
      variants={prefersReduced ? groupVariantsReduced : groupVariants}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
    >
      {children}
    </m.div>
  );
}

export function AnimatedItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <m.div
      className={className}
      variants={prefersReduced ? itemVariantsReduced : itemVariants}
    >
      {children}
    </m.div>
  );
}
