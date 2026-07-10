import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { MotionProvider } from "@/components/shared/MotionProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingContactFAB } from "@/components/shared/FloatingContactFAB";
import { CLINIC } from "@/lib/constants";
import { generatePageMetadata } from "@/lib/metadata";
import { LocalBusinessJsonLd, WebSiteJsonLd } from "@/components/shared/JsonLd";
import { CookieConsent } from "@/components/shared/CookieConsent";
import { Analytics } from "@/components/shared/Analytics";
import "../globals.css";

const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

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
    ...(locale !== routing.defaultLocale && {
      robots: { index: false, follow: true },
    }),
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

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${montserrat.variable} antialiased`}>
      <body className="min-h-dvh flex flex-col bg-background text-foreground font-sans">
        <NextIntlClientProvider messages={messages}>
          <MotionProvider>
            <a href="#main" className="skip-to-content">
              Sari la conținut
            </a>
            <Header />
            <main id="main" className="flex-1">
              {children}
            </main>
            <Footer />
            <FloatingContactFAB />
            <CookieConsent />
          </MotionProvider>
        </NextIntlClientProvider>
        <LocalBusinessJsonLd />
        <WebSiteJsonLd />
        <Analytics />
      </body>
    </html>
  );
}
