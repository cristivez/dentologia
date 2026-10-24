import type { ReactNode } from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { SiteShell } from "@/components/layout/SiteShell";
import { CLINIC } from "@/lib/constants";
import { generatePageMetadata } from "@/lib/metadata";
import { LocalBusinessJsonLd, WebSiteJsonLd } from "@/components/shared/JsonLd";

/** Without this every route renders on demand (`ƒ`). With it, they prerender (`○`). */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    ...generatePageMetadata({
      title: t("title"),
      description: t("description"),
      path: "",
      locale,
    }),
    metadataBase: new URL(CLINIC.url),
    // The English pages are a stub: their body copy is still Romanian. Keep
    // them out of the index until they are actually translated, otherwise
    // Google crawls a half-translated duplicate of the Romanian site.
    // Romanian pages opt into unrestricted previews — Google recommends
    // large image previews and unlimited snippets for AI Overviews and
    // Discover eligibility.
    robots:
      locale !== routing.defaultLocale
        ? { index: false, follow: true }
        : {
            index: true,
            follow: true,
            googleBot: {
              index: true,
              follow: true,
              "max-snippet": -1,
              "max-image-preview": "large",
              "max-video-preview": -1,
            },
          },
    icons: {
      icon: [
        { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
        { url: "/favicon-192.png", sizes: "192x192", type: "image/png" },
      ],
      apple: [{ url: "/favicon-192.png" }],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "ro" | "en")) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <SiteShell
      locale={locale}
      structuredData={
        <>
          <LocalBusinessJsonLd />
          <WebSiteJsonLd />
        </>
      }
    >
      {children}
    </SiteShell>
  );
}
