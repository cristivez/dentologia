"use client";

import { LazyMotion } from "framer-motion";

/**
 * `m` ships a small core; the feature bundle is fetched on demand rather than
 * included in the first load. Every animation on this site is triggered by
 * scroll or interaction, so nothing waits on it at paint time.
 *
 * `domMax` (not `domAnimation`) because /preturi animates its tab pill with
 * `layoutId`, which lives in the layout-animation feature set.
 */
const loadFeatures = () =>
  import("./motionFeatures").then((mod) => mod.default);

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <LazyMotion features={loadFeatures}>{children}</LazyMotion>;
}
