import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FAQPageJsonLd, BreadcrumbJsonLd } from "@/components/shared/JsonLd";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { FaqItem } from "@/components/shared/FaqItem";
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
        <div className="rise">
          <SectionHeading
            as="h1"
            title="Întrebări frecvente"
            subtitle="Răspunsuri la cele mai frecvente întrebări despre serviciile noastre"
          />
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqItems.map((item, i) => (
            <AnimatedSection key={i} delay={i * 0.05}>
              <FaqItem question={item.question} answer={item.answer} />
            </AnimatedSection>
          ))}
        </div>
      </Container>
    </>
  );
}
