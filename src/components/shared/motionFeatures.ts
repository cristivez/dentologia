import { domMax } from "framer-motion";

/**
 * Loaded asynchronously by `MotionProvider`, so the feature bundle stays out of
 * the initial payload. `domMax` (rather than `domAnimation`) is required for
 * layout animations — the sliding tab pill on /preturi uses `layoutId`.
 */
export default domMax;
