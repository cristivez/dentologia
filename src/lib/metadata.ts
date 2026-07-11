import type { Metadata } from "next";
import { CLINIC } from "./constants";

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  locale?: string;
  /** Page-specific social card (e.g. a blog hero). JPG — see OG_IMAGE note. */
  ogImage?: { url: string; alt: string };
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
  height: 630,
  alt: `${CLINIC.name} — clinică stomatologică în ${CLINIC.address.city} Muscel`,
} as const;

export function generatePageMetadata({
  title,
  description,
  path,
  locale = "ro",
  ogImage,
}: PageMetadataOptions): Metadata {
  const url = `${CLINIC.url}${path}`;
  const image = ogImage
    ? {
        url: `${CLINIC.url}${ogImage.url}`,
        width: 1200,
        height: 627,
        alt: ogImage.alt,
      }
    : OG_IMAGE;

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
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
  };
}
