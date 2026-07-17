import type { Metadata } from "next";
import type { ReactNode } from "react";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/shared/JsonLd";
import { CLINIC, GOOGLE_RATING, formattedRating } from "@/lib/constants";

export const metadata: Metadata = generatePageMetadata({
  title: "Recenzii Dentist Câmpulung Muscel | Dentologia",
  description: `Recenzii reale de pe Google Maps. Dentologia Câmpulung Muscel: ${formattedRating} stele din ${GOOGLE_RATING.count} recenzii. Servicii de calitate și personal profesionist.`,
  path: "/recenzii",
});

export default function ReviewsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Acasă", url: CLINIC.url },
          { name: "Recenzii", url: `${CLINIC.url}/recenzii` },
        ]}
      />
      {children}
    </>
  );
}
