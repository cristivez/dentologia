import type { Metadata } from "next";
import type { ReactNode } from "react";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/shared/JsonLd";
import { CLINIC } from "@/lib/constants";

export const metadata: Metadata = generatePageMetadata({
  title: "Prețuri Dentist Câmpulung Muscel | Dentologia",
  description:
    "Prețuri transparente la Dentologia Câmpulung: implant dentar, aparat dentar, detartraj, albire, coroană zirconiu. Consultație 100 lei.",
  path: "/preturi",
});

export default function PricesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Acasă", url: CLINIC.url },
          { name: "Prețuri", url: `${CLINIC.url}/preturi` },
        ]}
      />
      {children}
    </>
  );
}
