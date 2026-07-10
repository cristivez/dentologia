import { use } from "react";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { BreadcrumbJsonLd } from "@/components/shared/JsonLd";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { AnimatedGroup, AnimatedItem } from "@/components/shared/AnimatedGroup";
import { generatePageMetadata } from "@/lib/metadata";
import { CLINIC } from "@/lib/constants";
import { servicePages } from "@/data/servicePages";
import { FileText, Star, Smile, ArrowRight } from "lucide-react";

export const metadata: Metadata = generatePageMetadata({
  title: "Servicii Stomatologice Câmpulung Muscel | Dentologia",
  description:
    "Servicii stomatologice complete în Câmpulung Muscel: implant dentar, aparat dentar, albire, detartraj, urgențe. Prețuri transparente.",
  path: "/servicii",
});

const serviceIcons = [FileText, Star, Smile];

/** Each themed card points at the service page it actually describes. */
const cardTargets = [
  "urgente-stomatologice",
  "implant-dentar",
  "aparat-dentar",
] as const;

export default function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);

  const t = useTranslations("Services");

  const cards = [1, 2, 3].map((i) => ({
    title: t(`card${i}_title`),
    description: t(`card${i}_description`),
    features: [1, 2, 3, 4, 5].map((f) => t(`card${i}_feature${f}`)),
    Icon: serviceIcons[i - 1],
    target: cardTargets[i - 1],
  }));

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Acasă", url: CLINIC.url },
          { name: "Servicii", url: `${CLINIC.url}/servicii` },
        ]}
      />
      <Container as="section" className="py-20 pt-28">
        <div className="rise">
          <SectionHeading title={t("heading")} subtitle={t("subtitle")} />
        </div>

        <AnimatedGroup className="grid gap-6 md:grid-cols-3">
          {cards.map((card) => (
            <AnimatedItem key={card.target} className="h-full">
              <Card hover className="h-full flex flex-col">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-surface-elevated">
                  <card.Icon
                    size={28}
                    className="text-primary"
                    aria-hidden="true"
                  />
                </div>
                <h2 className="text-lg font-bold mb-2">{card.title}</h2>
                <p className="text-muted text-sm mb-4 leading-relaxed">
                  {card.description}
                </p>
                <ul className="space-y-2 mb-4">
                  {card.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-accent"
                    >
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/servicii/${card.target}`}
                  className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-primary [@media(hover:hover)]:hover:underline"
                >
                  Află mai multe
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </Card>
            </AnimatedItem>
          ))}
        </AnimatedGroup>

        <AnimatedSection>
          <h2 className="text-2xl md:text-3xl font-bold mt-20 mb-8 text-center">
            Servicii detaliate
          </h2>
        </AnimatedSection>

        <AnimatedGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {servicePages.map((page) => (
            <AnimatedItem key={page.slug} className="h-full">
              <Link href={`/servicii/${page.slug}`} className="block h-full">
                <Card hover className="h-full">
                  <h3 className="text-base font-bold mb-2 text-foreground">
                    {page.h1}
                  </h3>
                  <p className="text-muted text-sm leading-relaxed line-clamp-3">
                    {page.intro}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    Detalii și prețuri
                    <ArrowRight size={16} aria-hidden="true" />
                  </span>
                </Card>
              </Link>
            </AnimatedItem>
          ))}
        </AnimatedGroup>
      </Container>
    </>
  );
}
