import type { Metadata } from "next";
import { CLINIC } from "./constants";

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  locale?: string;
};

export function generatePageMetadata({
  title,
  description,
  path,
  locale = "ro",
}: PageMetadataOptions): Metadata {
  const url = `${CLINIC.url}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: CLINIC.fullName,
      locale: locale === "ro" ? "ro_RO" : "en_US",
      type: "website",
      images: [
        {
          url: `${CLINIC.url}/og-image.png`,
          width: 1200,
          height: 630,
          alt: CLINIC.fullName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${CLINIC.url}/og-image.png`],
    },
  };
}
