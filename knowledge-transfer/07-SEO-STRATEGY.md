# SEO Strategy — Dental Clinic Website

## Metadata Generation

Create a reusable metadata helper:

```typescript
// lib/metadata.ts
import type { Metadata } from "next";

const BASE_URL = "https://www.your-clinic.com";

export function generatePageMetadata({
  locale,
  titleKey,
  descriptionKey,
  path,
  keywords,
}: {
  locale: string;
  titleKey: string;
  descriptionKey: string;
  path: string;
  keywords?: string;
}): Metadata {
  const localePath = locale === "en" ? `/en${path}` : path;
  const canonicalUrl = `${BASE_URL}${localePath}`;

  return {
    title: titleKey, // Translated by caller
    description: descriptionKey,
    keywords,
    robots: "index, follow",
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ro: `${BASE_URL}${path}`,
        en: `${BASE_URL}/en${path}`,
        "x-default": `${BASE_URL}${path}`,
      },
    },
    openGraph: {
      title: titleKey,
      description: descriptionKey,
      url: canonicalUrl,
      siteName: "Your Clinic Name",
      locale: locale === "en" ? "en_US" : "ro_RO",
      type: "website",
      images: [
        { url: `${BASE_URL}/images/og-default.jpg`, width: 1200, height: 630 },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: titleKey,
      description: descriptionKey,
    },
  };
}
```

### SEO Rules

- **metaTitle**: max 65 characters (truncated in Google results beyond this)
- **metaDescription**: 110–165 characters (sweet spot for display)
- **Every page** must have a unique title and description
- **OG image**: 1200×630px, include clinic name/logo

## Structured Data (JSON-LD)

### Dentist Schema (Homepage)

```typescript
// components/shared/JsonLd.tsx
const dentistSchema = {
  "@context": "https://schema.org",
  "@type": "Dentist",
  name: CLINIC.name,
  url: BASE_URL,
  telephone: CLINIC.phoneInternational,
  email: CLINIC.email,
  image: `${BASE_URL}/images/og-default.jpg`,
  address: {
    "@type": "PostalAddress",
    streetAddress: CLINIC.address,
    addressLocality: CLINIC.city,
    addressRegion: CLINIC.region,
    postalCode: CLINIC.postalCode,
    addressCountry: "RO",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: CLINIC.coordinates.lat,
    longitude: CLINIC.coordinates.lng,
  },
  openingHoursSpecification: SCHEDULE.filter(s => s.open).map(s => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: s.day.charAt(0).toUpperCase() + s.day.slice(1),
    opens: s.open,
    closes: s.close,
  })),
  medicalSpecialty: ["Implantology", "Oral Surgery", "Cosmetic Dentistry", ...],
};
```

**XSS Prevention:** Always escape `<` as `\u003c` in JSON-LD:

```typescript
function serializeJsonLd(schema: object): string {
  return JSON.stringify(schema).replace(/</g, "\\u003c");
}
```

### Service Detail Schemas

Each service page should emit 3 schemas:

1. **BreadcrumbList** — navigation trail
2. **MedicalProcedure** — procedure details, doctor info
3. **FAQPage** — FAQ section (rich snippet in Google)

### Person Schema (Team Page)

For E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness):

```json
{
  "@type": "Dentist",
  "name": "Dr. Name",
  "jobTitle": "Specialty",
  "worksFor": { "@type": "Dentist", "name": "Clinic Name" },
  "alumniOf": ["University Name"],
  "hasCredential": [
    {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": "board certification"
    }
  ]
}
```

**Never fabricate credentials.** Only include verifiable data.

## Sitemap

```typescript
// app/sitemap.ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.your-clinic.com";
  const lastModified =
    process.env.NEXT_PUBLIC_BUILD_DATE || new Date().toISOString();

  const pages = [
    { path: "", priority: 1.0 },
    { path: "/preturi", priority: 0.9 },
    { path: "/echipa", priority: 0.8 },
    { path: "/contact", priority: 0.8 },
    // ... all pages
  ];

  return pages.flatMap(({ path, priority }) => [
    {
      url: `${baseUrl}${path}`,
      lastModified,
      changeFrequency: "monthly",
      priority,
      alternates: {
        languages: {
          ro: `${baseUrl}${path}`,
          en: `${baseUrl}/en${path}`,
        },
      },
    },
    {
      url: `${baseUrl}/en${path}`,
      lastModified,
      changeFrequency: "monthly",
      priority,
      alternates: {
        languages: {
          ro: `${baseUrl}${path}`,
          en: `${baseUrl}/en${path}`,
        },
      },
    },
  ]);
}
```

## Robots.txt

```typescript
// app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://www.your-clinic.com/sitemap.xml",
  };
}
```

## Local SEO

Add geo meta tags for local search:

```html
<meta name="geo.region" content="RO-GJ" />
<meta name="geo.placename" content="Târgu Jiu" />
<meta name="geo.position" content="45.035216;23.2799507" />
<meta name="ICBM" content="45.035216, 23.2799507" />
```

## SEO Checklist

- [ ] Every page has unique `<title>` (≤ 65 chars) and `<meta description>` (110–165 chars)
- [ ] Every page has canonical URL
- [ ] Every page has hreflang alternates (ro, en, x-default)
- [ ] Homepage has Dentist JSON-LD schema
- [ ] Service pages have MedicalProcedure + FAQ + BreadcrumbList schemas
- [ ] Team page has Person schemas with credentials
- [ ] sitemap.xml includes all pages in all locales
- [ ] robots.txt allows crawling and points to sitemap
- [ ] OG image exists at `/images/og-default.jpg` (1200×630)
- [ ] Google Business Profile linked (see separate guide)
