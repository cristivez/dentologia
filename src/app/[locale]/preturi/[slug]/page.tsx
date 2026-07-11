import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Phone, ArrowRight, ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { PriceTable } from "@/components/shared/PriceTable";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import {
  BreadcrumbJsonLd,
  OfferCatalogJsonLd,
} from "@/components/shared/JsonLd";
import { generatePageMetadata } from "@/lib/metadata";
import { CLINIC } from "@/lib/constants";
import { routing } from "@/i18n/routing";
import {
  serviceCategories,
  getServiceCategory,
  type ServiceCategory,
} from "@/data/services";

/** Fixed set of categories — refuse anything else rather than soft-404 with a 200. */
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    serviceCategories.map((cat) => ({ locale, slug: cat.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getServiceCategory(slug);
  if (!category) return {};

  return generatePageMetadata({
    title: category.title,
    description: category.metaDescription,
    path: `/preturi/${category.slug}`,
  });
}

/** The other six categories, so every page links onward. */
function OtherCategories({ current }: { current: ServiceCategory }) {
  const others = serviceCategories.filter((cat) => cat.slug !== current.slug);

  return (
    <nav aria-label="Alte categorii de prețuri" className="mt-16">
      <h2 className="mb-4 text-lg font-bold">Alte categorii de prețuri</h2>
      <ul className="flex flex-wrap gap-2">
        {others.map((cat) => (
          <li key={cat.slug}>
            <Link
              href={`/preturi/${cat.slug}`}
              className="flex min-h-[44px] items-center rounded-full bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors [@media(hover:hover)]:hover:bg-surface-elevated"
            >
              {cat.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default async function PriceCategoryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const category = getServiceCategory(slug);
  if (!category) notFound();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Acasă", url: CLINIC.url },
          { name: "Prețuri", url: `${CLINIC.url}/preturi` },
          {
            name: category.label,
            url: `${CLINIC.url}/preturi/${category.slug}`,
          },
        ]}
      />
      <OfferCatalogJsonLd
        name={category.h1}
        description={category.metaDescription}
        path={`/preturi/${category.slug}`}
        items={category.items}
      />

      <Container as="section" className="py-20 pt-28">
        {/* Above the fold: CSS transform entrance only, never opacity. */}
        <nav
          aria-label="Firimituri"
          className="rise mb-6 text-sm text-muted"
          style={{ "--rise-delay": "0ms" } as CSSProperties}
        >
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link
                href="/"
                className="transition-colors [@media(hover:hover)]:hover:text-primary"
              >
                Acasă
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href="/preturi"
                className="transition-colors [@media(hover:hover)]:hover:text-primary"
              >
                Prețuri
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-foreground" aria-current="page">
              {category.label}
            </li>
          </ol>
        </nav>

        <h1
          className="rise mb-6 text-3xl font-bold tracking-tight md:text-4xl"
          style={{ "--rise-delay": "60ms" } as CSSProperties}
        >
          {category.h1}
        </h1>

        <p
          className="rise mb-8 max-w-2xl text-lg leading-relaxed text-muted"
          style={{ "--rise-delay": "120ms" } as CSSProperties}
        >
          {category.intro}
        </p>

        <div
          className="rise mb-12 flex flex-col gap-4 sm:flex-row"
          style={{ "--rise-delay": "180ms" } as CSSProperties}
        >
          <Button href={`tel:${CLINIC.phone}`} size="lg">
            <Phone size={20} aria-hidden="true" />
            Sună acum
          </Button>
        </div>

        <div
          className="rise max-w-3xl"
          style={{ "--rise-delay": "240ms" } as CSSProperties}
        >
          <h2 className="mb-4 text-2xl font-bold">
            Prețuri {category.label.toLowerCase()}
          </h2>
          <PriceTable
            items={category.items}
            caption={`${category.h1} — ${CLINIC.name}`}
          />
          <p className="mt-4 text-sm text-accent">
            Prețurile sunt orientative. Planul de tratament final se stabilește
            după consultația de specialitate (100 lei).
          </p>

          <Link
            href="/preturi"
            className="mt-6 inline-flex min-h-[44px] items-center gap-1 text-sm font-semibold text-primary [@media(hover:hover)]:hover:underline"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Vezi lista completă de prețuri
          </Link>
        </div>

        <AnimatedSection>
          <OtherCategories current={category} />
        </AnimatedSection>

        <AnimatedSection delay={0.05}>
          <div className="mt-12">
            <Link
              href="/servicii"
              className="inline-flex min-h-[44px] items-center gap-1 text-sm font-semibold text-primary [@media(hover:hover)]:hover:underline"
            >
              Vezi serviciile noastre
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </AnimatedSection>
      </Container>
    </>
  );
}
