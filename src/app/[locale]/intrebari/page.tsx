import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FAQPageJsonLd, BreadcrumbJsonLd } from "@/components/shared/JsonLd";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { generatePageMetadata } from "@/lib/metadata";
import { CLINIC } from "@/lib/constants";
import { faqItems } from "@/data/faq";

export const metadata: Metadata = generatePageMetadata({
  title: "Întrebări Frecvente Dentist Câmpulung | Dentologia",
  description:
    "Răspunsuri la cele mai frecvente întrebări: cât costă un implant dentar, aparat dentar, detartraj, albire dentară la Dentologia Câmpulung Muscel.",
  path: "/intrebari",
});

export default function FaqPage() {
  return (
    <>
      <FAQPageJsonLd items={faqItems} />
      <BreadcrumbJsonLd
        items={[
          { name: "Acasă", url: CLINIC.url },
          { name: "Întrebări frecvente", url: `${CLINIC.url}/intrebari` },
        ]}
      />
      <Container as="section" className="py-20 pt-28">
        <AnimatedSection>
          <SectionHeading
            title="Întrebări frecvente"
            subtitle="Răspunsuri la cele mai frecvente întrebări despre serviciile noastre"
          />
        </AnimatedSection>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqItems.map((item, i) => (
            <AnimatedSection key={i} delay={i * 0.05}>
              <details
                key={i}
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
            </AnimatedSection>
          ))}
        </div>
      </Container>
    </>
  );
}
