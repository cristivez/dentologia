import { Montserrat } from "next/font/google";

export const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700"],
  variable: "--font-montserrat",
  // `optional`, not `swap`: on a slow first visit the size-adjusted fallback
  // stays for that pageview instead of swapping in late — the late swap
  // repainted the hero <h1> and pushed LCP from ~0.9s to 4.2s in Lighthouse.
  // Fast connections (the normal case; fonts are preloaded from the edge)
  // still render Montserrat immediately.
  display: "optional",
});
