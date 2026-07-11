import type { Metadata } from "next";
import { CLINIC } from "./constants";

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  locale?: string;
};

/**
 * A real photo of the premises, cropped to 1.91:1 — the ratio Facebook,
 * WhatsApp and LinkedIn crop to. Anything else and they centre-crop it for us.
 *
 * JPG, not WebP: WhatsApp (this clinic's main sharing channel) renders WebP
 * link previews inconsistently and can fail silently on older Android clients.
 * JPG is the universally-supported og:image format.
 */
const OG_IMAGE = {
  url: `${CLINIC.url}/photos/og-storefront.jpg`,
  width: 1200,
  height: 628,
  alt: `Intrarea clinicii ${CLINIC.name}, ${CLINIC.address.city}`,
} as const;

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
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE.url],
    },
  };
}
