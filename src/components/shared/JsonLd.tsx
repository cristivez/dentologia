import { CLINIC, SCHEDULE } from "@/lib/constants";
import { parsePrice, type ServiceItem } from "@/data/services";

function safeJsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

type JsonLdProps = {
  data: Record<string, unknown>;
};

function JsonLdScript({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }}
    />
  );
}

export function LocalBusinessJsonLd() {
  const openingHours = SCHEDULE.filter((s) => s.open && s.close).map((s) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: `https://schema.org/${s.schemaDay}`,
    opens: s.open,
    closes: s.close,
  }));

  // No `aggregateRating` here. Google treats a LocalBusiness rating itself as
  // self-serving review markup: it is ignored for rich results and risks a
  // manual action. The real 5,0/15 figure is displayed on-page instead.
  const data = {
    "@context": "https://schema.org",
    "@type": ["Dentist", "LocalBusiness", "MedicalClinic"],
    name: CLINIC.name,
    description:
      "Clinică stomatologică modernă în Câmpulung Muscel. Implant dentar, aparat dentar, albire, detartraj, urgențe stomatologice.",
    url: CLINIC.url,
    telephone: CLINIC.phone,
    email: CLINIC.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: CLINIC.address.street,
      addressLocality: CLINIC.address.city,
      addressRegion: CLINIC.address.county,
      postalCode: CLINIC.address.postalCode,
      addressCountry: CLINIC.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: CLINIC.coordinates.lat,
      longitude: CLINIC.coordinates.lng,
    },
    hasMap: CLINIC.social.google,
    openingHoursSpecification: openingHours,
    sameAs: [
      CLINIC.social.facebook,
      CLINIC.social.instagram,
      CLINIC.social.google,
    ],
    // Several real photos of the premises. Google's local surfaces favour
    // businesses with genuine imagery, and these are the only ones we have.
    image: [
      `${CLINIC.url}/photos/storefront.webp`,
      `${CLINIC.url}/photos/receptie.webp`,
      `${CLINIC.url}/photos/cabinet.webp`,
    ],
    photo: `${CLINIC.url}/photos/storefront.webp`,
    priceRange: "$$",
    areaServed: {
      "@type": "City",
      name: "Câmpulung Muscel",
    },
    availableLanguage: "Romanian",
  };

  return <JsonLdScript data={data} />;
}

export function ServiceJsonLd({
  name,
  description,
  path,
  offers,
}: {
  name: string;
  description: string;
  path: string;
  offers: { name: string; price: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name,
    description,
    url: `${CLINIC.url}${path}`,
    procedureType: "https://schema.org/TherapeuticProcedure",
    provider: {
      "@type": "Dentist",
      name: CLINIC.name,
      url: CLINIC.url,
      telephone: CLINIC.phone,
      address: {
        "@type": "PostalAddress",
        streetAddress: CLINIC.address.street,
        addressLocality: CLINIC.address.city,
        postalCode: CLINIC.address.postalCode,
        addressCountry: CLINIC.address.country,
      },
    },
    ...(offers.length > 0 && {
      offers: offers.map((offer) => ({
        "@type": "Offer",
        name: offer.name,
        price: offer.price,
        priceCurrency: "RON",
        availability: "https://schema.org/InStock",
      })),
    }),
  };

  return <JsonLdScript data={data} />;
}

export function WebSiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: CLINIC.name,
    url: CLINIC.url,
  };

  return <JsonLdScript data={data} />;
}

export function FAQPageJsonLd({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return <JsonLdScript data={data} />;
}

/**
 * An `OfferCatalog` of a price category. Rows whose price cannot be read as a
 * number are omitted rather than guessed at — a wrong price in structured data
 * is worse than an absent one.
 */
export function OfferCatalogJsonLd({
  name,
  description,
  path,
  items,
}: {
  name: string;
  description: string;
  path: string;
  items: ServiceItem[];
}) {
  const offers = items.flatMap((item) => {
    const parsed = parsePrice(item.price);
    if (!parsed) return [];

    const base = {
      name: item.name,
      priceCurrency: parsed.currency,
      availability: "https://schema.org/InStock",
      seller: { "@type": "Dentist", name: CLINIC.name, url: CLINIC.url },
    };

    return [
      parsed.kind === "single"
        ? { "@type": "Offer", ...base, price: parsed.value }
        : {
            "@type": "AggregateOffer",
            ...base,
            lowPrice: parsed.min,
            highPrice: parsed.max,
          },
    ];
  });

  const data = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name,
    description,
    url: `${CLINIC.url}${path}`,
    numberOfItems: offers.length,
    itemListElement: offers,
  };

  return <JsonLdScript data={data} />;
}

export function PhysicianJsonLd({
  members,
}: {
  members: {
    name: string;
    role: string;
    photo: string;
    slug: string;
    cmdr?: string;
  }[];
}) {
  const data = members.map((m) => ({
    "@context": "https://schema.org",
    "@type": ["Physician", "Dentist"],
    name: m.name,
    jobTitle: m.role,
    image: `${CLINIC.url}${m.photo}`,
    url: `${CLINIC.url}/echipa#${m.slug}`,
    medicalSpecialty: "Dentistry",
    ...(m.cmdr && { identifier: m.cmdr }),
    worksFor: {
      "@type": "Dentist",
      name: CLINIC.name,
      url: CLINIC.url,
      address: {
        "@type": "PostalAddress",
        streetAddress: CLINIC.address.street,
        addressLocality: CLINIC.address.city,
        postalCode: CLINIC.address.postalCode,
        addressCountry: CLINIC.address.country,
      },
    },
  }));

  // One <script> per person keeps each Physician node independently valid.
  return (
    <>
      {data.map((d, i) => (
        <JsonLdScript key={i} data={d} />
      ))}
    </>
  );
}

/**
 * BlogPosting for the patient-education articles. The author is the clinic
 * (an Organization), not an invented person — no fake bylines on YMYL content.
 */
export function BlogPostingJsonLd({
  headline,
  description,
  path,
  image,
  datePublished,
}: {
  headline: string;
  description: string;
  path: string;
  image: string;
  datePublished: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline,
    description,
    image: `${CLINIC.url}${image}`,
    datePublished,
    dateModified: datePublished,
    inLanguage: "ro",
    mainEntityOfPage: `${CLINIC.url}${path}`,
    author: {
      "@type": "Organization",
      name: CLINIC.name,
      url: CLINIC.url,
    },
    publisher: {
      "@type": "Organization",
      name: CLINIC.name,
      url: CLINIC.url,
      logo: {
        "@type": "ImageObject",
        url: `${CLINIC.url}/logo.webp`,
      },
    },
  };

  return <JsonLdScript data={data} />;
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <JsonLdScript data={data} />;
}
