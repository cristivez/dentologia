import { use, type CSSProperties } from "react";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BreadcrumbJsonLd } from "@/components/shared/JsonLd";
import { generatePageMetadata } from "@/lib/metadata";
import { CLINIC } from "@/lib/constants";
import { routing } from "@/i18n/routing";
import { PricesExplorer } from "./PricesExplorer";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = generatePageMetadata({
  title: "Prețuri Dentist Câmpulung Muscel | Lista Completă | Dentologia",
  description:
    "Lista completă de prețuri Dentologia Câmpulung Muscel: consultație 100 lei, detartraj 150 lei, aparat dentar de la 2.700 lei, coroană zirconiu de la 900 lei.",
  path: "/preturi",
});

export default function PricesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Acasă", url: CLINIC.url },
          { name: "Prețuri", url: `${CLINIC.url}/preturi` },
        ]}
      />
      <Container as="section" className="py-20 pt-28">
        {/* Page header is server-rendered with a CSS-only entrance: it must not
            depend on framer-motion hydrating. */}
        <div
          className="rise"
          style={{ "--rise-delay": "0ms" } as CSSProperties}
        >
          <SectionHeading
            as="h1"
            title="Prețuri servicii stomatologice în Câmpulung Muscel"
            subtitle="Lista completă, actualizată. Fără costuri surpriză la final."
          />
        </div>

        <PricesExplorer />
      </Container>
    </>
  );
}
