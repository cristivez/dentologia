import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { MotionProvider } from "@/components/shared/MotionProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingContactFAB } from "@/components/shared/FloatingContactFAB";
import { CloudflareAnalytics } from "@/components/shared/CloudflareAnalytics";
import { montserrat } from "@/lib/fonts";
import "@/app/globals.css";

/**
 * The document every page shares: <html>, font, header, footer, contact FAB.
 * Used by [locale]/layout.tsx and by the root not-found.tsx, which renders
 * outside [locale] (unknown URLs never match it) and so gets no layout of its
 * own — without this it fell back to Next's bare English 404.
 */
export function SiteShell({
  locale,
  children,
  structuredData,
}: Readonly<{
  locale: string;
  children: ReactNode;
  structuredData?: ReactNode;
}>) {
  return (
    <html lang={locale} className={`${montserrat.variable} antialiased`}>
      <body className="min-h-dvh flex flex-col bg-background text-foreground font-sans">
        {/*
          `messages={{}}` is deliberate, and the empty object has to be passed
          explicitly: next-intl reads `messages === undefined ? await
          getMessages() : messages`, so *omitting* the prop inlines the whole
          catalogue rather than none of it.

          No client component calls useTranslations — only the homepage and
          /servicii do, and both are server components, so their strings are
          already rendered into HTML. Passing the catalogue serialised ~5KB of
          JSON into all 74 pages that nothing on the client ever read. The
          provider itself stays: `Link` from @/i18n/navigation needs the
          locale, which next-intl fills in separately.

          If a client component ever does need translations, give this the one
          namespace it needs (`pick(messages, ['Thing'])`) rather than the lot.
        */}
        <NextIntlClientProvider locale={locale} messages={{}}>
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
          </MotionProvider>
        </NextIntlClientProvider>
        {structuredData}
        <CloudflareAnalytics />
      </body>
    </html>
  );
}
