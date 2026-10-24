import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { SiteShell } from "@/components/layout/SiteShell";
import NotFoundPage from "./[locale]/not-found";

/**
 * The page every unknown URL gets. Unknown paths never match [locale], so this
 * renders without its layout and needs the whole SiteShell itself. It stays
 * static (`○ /_not-found`): worker.ts serves the prerendered HTML directly.
 */
// No robots entry: Next already adds `noindex` to every 404.
export const metadata: Metadata = {
  title: "Pagina nu a fost găsită | Dentologia",
};

export default function RootNotFound() {
  // Without an explicit locale next-intl reads it from request headers, which
  // would turn this page dynamic and put the 404 back on the Worker's CPU.
  setRequestLocale(routing.defaultLocale);
  return (
    <SiteShell locale={routing.defaultLocale}>
      <NotFoundPage />
    </SiteShell>
  );
}
