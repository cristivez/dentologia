import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Phone, MessageCircle, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import {
  BreadcrumbJsonLd,
  FAQPageJsonLd,
  ServiceJsonLd,
} from "@/components/shared/JsonLd";
import { generatePageMetadata } from "@/lib/metadata";
import { CLINIC } from "@/lib/constants";
import { routing } from "@/i18n/routing";
import { PriceTable } from "@/components/shared/PriceTable";
import { getServiceCategory, type ServiceCategorySlug } from "@/data/services";
import {
  servicePages,
  getServicePage,
  priceItemsFor,
  type ServicePage,
} from "@/data/servicePages";

function categoryLabel(slug: ServiceCategorySlug): string {
  return getServiceCategory(slug)?.label.toLowerCase() ?? "prețuri";
}

/**
 * The service pages are a fixed set known at build time, so refuse any slug
 * outside it. Without this, an unknown slug is rendered on demand and
 * `notFound()` throws only after the shell has streamed — the response is
 * already committed as 200 and Google sees a soft 404.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    servicePages.map((page) => ({ locale, slug: page.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getServicePage(slug);
  if (!page) return {};

  return generatePageMetadata({
    title: page.title,
    description: page.metaDescription,
    path: `/servicii/${page.slug}`,
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const page = getServicePage(slug);
  if (!page) notFound();

  const related = page.relatedSlugs
    .map(getServicePage)
    .filter((p): p is ServicePage => p !== undefined);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Acasă", url: CLINIC.url },
          { name: "Servicii", url: `${CLINIC.url}/servicii` },
          { name: page.h1, url: `${CLINIC.url}/servicii/${page.slug}` },
        ]}
      />
      <ServiceJsonLd
        name={page.h1}
        description={page.metaDescription}
        path={`/servicii/${page.slug}`}
        offers={page.offers}
      />
      <FAQPageJsonLd items={page.faq} />

      <Container as="section" className="py-20 pt-28">
        {/* Above the fold: CSS transform entrance only. This block holds the
            <h1> these pages exist to rank, so it must never be opacity-gated
            on framer-motion hydrating. */}
        <nav
          aria-label="Firimituri"
          className="rise mb-6 text-sm text-muted"
          style={{ "--rise-delay": "0ms" } as CSSProperties}
        >
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link
                href="/"
                className="[@media(hover:hover)]:hover:text-primary transition-colors"
              >
                Acasă
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href="/servicii"
                className="[@media(hover:hover)]:hover:text-primary transition-colors"
              >
                Servicii
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-foreground" aria-current="page">
              {page.h1}
            </li>
          </ol>
        </nav>

        <h1
          className="rise text-3xl md:text-5xl font-bold tracking-tight mb-6"
          style={{ "--rise-delay": "60ms" } as CSSProperties}
        >
          {page.h1}
        </h1>
        <p
          className="rise max-w-2xl text-lg text-muted leading-relaxed mb-8"
          style={{ "--rise-delay": "120ms" } as CSSProperties}
        >
          {page.intro}
        </p>

        <div
          className="rise flex flex-col sm:flex-row gap-4 mb-16"
          style={{ "--rise-delay": "180ms" } as CSSProperties}
        >
          <Button href={`tel:${CLINIC.phone}`} size="lg">
            <Phone size={20} aria-hidden="true" />
            Sună acum
          </Button>
          <Button
            href={CLINIC.whatsapp}
            variant="whatsapp"
            size="lg"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={20} aria-hidden="true" />
            WhatsApp
          </Button>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-16">
          <div className="max-w-2xl">
            {page.sections.map((section, i) => (
              <AnimatedSection key={section.heading} delay={i * 0.05}>
                <section className="mb-10">
                  <h2 className="text-2xl font-bold mb-3">{section.heading}</h2>
                  <p className="text-muted leading-relaxed">{section.body}</p>
                </section>
              </AnimatedSection>
            ))}

            <AnimatedSection>
              <section className="mb-10">
                <h2 className="text-2xl font-bold mb-6">Întrebări frecvente</h2>
                <div className="space-y-3">
                  {page.faq.map((item) => (
                    <details
                      key={item.question}
                      className="group rounded-xl border border-border bg-surface overflow-hidden"
                    >
                      <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-foreground font-medium text-sm min-h-[44px] list-none [&::-webkit-details-marker]:hidden">
                        <span>{item.question}</span>
                        <span
                          className="shrink-0 text-muted transition-transform duration-200 group-open:rotate-45"
                          aria-hidden="true"
                        >
                          +
                        </span>
                      </summary>
                      <div className="px-5 pb-4 text-sm text-muted leading-relaxed">
                        <p>{item.answer}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            </AnimatedSection>
          </div>

          {/* Prices sit above the fold on desktop — same rule as the header. */}
          <div
            className="rise"
            style={{ "--rise-delay": "240ms" } as CSSProperties}
          >
            <aside className="lg:sticky lg:top-28">
              <h2 className="text-2xl font-bold mb-4">Prețuri</h2>
              {page.priceNote && (
                <p className="text-sm text-accent leading-relaxed mb-4">
                  {page.priceNote}
                </p>
              )}
              <PriceTable
                items={priceItemsFor(page)}
                caption={`Prețuri pentru ${page.h1} la ${CLINIC.name}`}
              />
              <div className="mt-4 flex flex-col gap-2">
                <Link
                  href={`/preturi/${page.priceCategory}`}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-primary [@media(hover:hover)]:hover:underline"
                >
                  Toate prețurile din categoria{" "}
                  {categoryLabel(page.priceCategory)}
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
                <Link
                  href="/preturi"
                  className="inline-flex items-center gap-1 text-sm text-muted [@media(hover:hover)]:hover:text-primary"
                >
                  Vezi lista completă de prețuri
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>

              {related.length > 0 && (
                <div className="mt-10">
                  <h2 className="text-lg font-bold mb-3">Servicii conexe</h2>
                  <ul className="space-y-2">
                    {related.map((rel) => (
                      <li key={rel.slug}>
                        <Link
                          href={`/servicii/${rel.slug}`}
                          className="inline-flex items-center gap-1 text-sm text-muted [@media(hover:hover)]:hover:text-primary transition-colors"
                        >
                          {rel.h1}
                          <ArrowRight size={14} aria-hidden="true" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          </div>
        </div>
      </Container>
    </>
  );
}
