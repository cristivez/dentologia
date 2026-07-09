import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { BreadcrumbJsonLd } from "@/components/shared/JsonLd";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { generatePageMetadata } from "@/lib/metadata";
import { CLINIC } from "@/lib/constants";
import { FileText, Star, Smile } from "lucide-react";

export const metadata: Metadata = generatePageMetadata({
  title: "Servicii Stomatologice Câmpulung Muscel | Dentologia",
  description:
    "Servicii stomatologice complete în Câmpulung Muscel: implant dentar, aparat dentar, albire, detartraj, chirurgie orală. Prețuri transparente.",
  path: "/servicii",
});

const serviceIcons = [FileText, Star, Smile];
const serviceTabSlugs = ["general", "implant", "ortodontie"];

export default function ServicesPage() {
  const t = useTranslations("Services");

  const cards = [1, 2, 3].map((i) => ({
    title: t(`card${i}_title`),
    description: t(`card${i}_description`),
    features: [1, 2, 3, 4, 5].map((f) => t(`card${i}_feature${f}`)),
    Icon: serviceIcons[i - 1],
    tabSlug: serviceTabSlugs[i - 1],
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
        <AnimatedSection>
          <SectionHeading title={t("heading")} subtitle={t("subtitle")} />
        </AnimatedSection>

        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((card, i) => (
            <AnimatedSection key={card.tabSlug} delay={i * 0.1}>
              <Card hover>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-surface-elevated">
                  <card.Icon
                    size={28}
                    className="text-primary"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="text-lg font-bold mb-2">{card.title}</h3>
                <p className="text-muted text-sm mb-4 leading-relaxed">
                  {card.description}
                </p>
                <ul className="space-y-2">
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
                <a
                  href={`/preturi?tab=${card.tabSlug}`}
                  className="mt-4 inline-block text-sm font-semibold text-primary [@media(hover:hover)]:hover:underline"
                >
                  Vezi prețuri →
                </a>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </Container>
    </>
  );
}
