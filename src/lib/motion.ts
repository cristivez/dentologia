import type { Transition, Variants } from "framer-motion";

/**
 * Shared motion vocabulary. Every value here animates only `transform` and
 * `opacity`, so nothing triggers layout or paint on the compositor thread.
 */

/**
 * Springs are defined by physics, not by a duration. `visualDuration` is the
 * time to *visually* settle; the spring keeps a little overshoot after it,
 * which is what makes the motion feel alive instead of mechanical.
 */
export const spring: Transition = {
  type: "spring",
  visualDuration: 0.45,
  bounce: 0.18,
};

/** Snappier spring for controls that must feel immediate under the finger. */
export const springSnappy: Transition = {
  type: "spring",
  visualDuration: 0.28,
  bounce: 0.12,
};

/** A parent orchestrates its children; children never set their own delay. */
export const groupVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.04,
    },
  },
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: spring,
  },
};

/** Reduced-motion equivalents: state changes still happen, movement does not. */
export const groupVariantsReduced: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0 } },
};

export const itemVariantsReduced: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.01 } },
};

export const viewportOnce = { once: true, margin: "-64px" } as const;
