# Content Migration from Static HTML

How to extract content from an existing static HTML/CSS/JS dental clinic website and migrate it into the Next.js setup.

## Overview

```
Static HTML Site → Extract content → Structure as data/translations → Build Next.js pages
```

The goal is to keep **content and colors** from the old site while upgrading the **architecture, performance, and quality** to match the enterprise setup.

## Step 1: Inventory the Old Site

Map every page and section:

```
Old Site Pages:
├── index.html          → Home page (Hero, About, Services, Team, Contact sections)
├── about.html          → About / Team page (if separate)
├── services.html       → Services / Price list
├── contact.html        → Contact form / Map / Schedule
├── privacy.html        → Privacy policy
└── assets/
    ├── css/style.css   → Extract color palette
    ├── js/             → Extract any interactive behavior
    └── images/         → Copy and optimize
```

Create a checklist of every text block, image, and interactive element.

## Step 2: Extract the Color Palette

From the old site's CSS, identify:

```css
/* Look for these in the old stylesheet */
body {
  color: ???;
  background: ???;
}
h1,
h2 {
  color: ???;
}
a {
  color: ???;
}
.btn-primary {
  background: ???;
  color: ???;
}
.footer {
  background: ???;
}
```

Map old colors to the theme system:

| Old CSS              | New Variable                  | Role              |
| -------------------- | ----------------------------- | ----------------- |
| `body background`    | `--background`                | Page background   |
| `body color`         | `--foreground`                | Primary text      |
| `.btn-primary bg`    | `--primary`                   | Brand color       |
| `.btn-primary color` | `--primary-foreground`        | Button text       |
| Heading color        | `--foreground` or `--primary` | Depends on design |
| Muted/secondary text | `--muted`                     | Helper text       |

**Critical:** After mapping colors, check every combination against WCAG 4.5:1. See `15-THEME-COLORS.md` for how.

## Step 3: Extract Text Content

### Option A: Manual Extraction (Small Sites)

For each page, copy text into translation JSON files:

```json
// src/messages/ro.json
{
  "Hero": {
    "title": "[Copy from old site hero heading]",
    "subtitle": "[Copy from old site hero subheading]",
    "cta": "[Copy from old site CTA button text]"
  },
  "About": {
    "title": "[Copy from old site about heading]",
    "description": "[Copy from old site about paragraph]"
  }
}
```

### Option B: Scripted Extraction (Larger Sites)

Create a Node.js script to parse HTML and extract text:

```typescript
// scripts/extract-content.ts
import { JSDOM } from "jsdom";
import { readFileSync, writeFileSync } from "fs";

const html = readFileSync("old-site/index.html", "utf-8");
const dom = new JSDOM(html);
const doc = dom.window.document;

const content = {
  Hero: {
    title: doc.querySelector(".hero h1")?.textContent?.trim() ?? "",
    subtitle: doc.querySelector(".hero p")?.textContent?.trim() ?? "",
  },
  About: {
    title: doc.querySelector("#about h2")?.textContent?.trim() ?? "",
    description: doc.querySelector("#about p")?.textContent?.trim() ?? "",
  },
  // ... continue for each section
};

writeFileSync("extracted-content.json", JSON.stringify(content, null, 2));
```

Run with: `npx tsx scripts/extract-content.ts`

## Step 4: Extract and Optimize Images

### Copy Images

```bash
# Copy all images from old site
cp -r old-site/assets/images/ src/public/images/
```

### Optimize for Web

Images must be pre-optimized because Cloudflare Workers can't do on-the-fly optimization.

```bash
# Install sharp CLI
npm install -g sharp-cli

# Convert to WebP with quality 80
find public/images -name "*.jpg" -o -name "*.png" | while read f; do
  sharp -i "$f" -o "${f%.*}.webp" --format webp --quality 80
done

# Resize large images (max 1920px wide)
find public/images -name "*.webp" | while read f; do
  sharp -i "$f" -o "$f" --resize 1920 --withoutEnlargement
done
```

### Image Naming Convention

```
public/images/
├── hero/
│   ├── clinic-exterior.webp
│   └── clinic-interior.webp
├── team/
│   ├── dr-firstname-lastname.webp    # Professional headshots
│   └── ...
├── gallery/
│   ├── treatment-room-1.webp
│   └── ...
└── services/
    ├── implant-dentar.webp
    └── ...
```

## Step 5: Structure Service Data

Extract service/pricing data into a structured format:

```typescript
// src/data/services.ts
export type Service = {
  slug: string;
  price: number | null;
  categorySlug: string;
};

export type ServiceCategory = {
  slug: string;
  icon: string; // lucide-react icon name
  services: Service[];
};

export const serviceCategories: ServiceCategory[] = [
  {
    slug: "general",
    icon: "Stethoscope",
    services: [
      { slug: "consultatie", price: 100, categorySlug: "general" },
      { slug: "detartraj", price: 200, categorySlug: "general" },
      // ... extract from old site price list
    ],
  },
];
```

Translations for service names go in the JSON files:

```json
{
  "Services": {
    "categories": {
      "general": {
        "name": "Stomatologie Generală",
        "services": {
          "consultatie": "Consultație",
          "detartraj": "Detartraj"
        }
      }
    }
  }
}
```

## Step 6: Structure Team Data

```typescript
// src/data/team.ts
export type TeamMember = {
  slug: string;
  image: string; // Path in /public/images/team/
  specializations: string[];
};

export const team: TeamMember[] = [
  {
    slug: "dr-firstname-lastname",
    image: "/images/team/dr-firstname-lastname.webp",
    specializations: ["implantology", "surgery"],
  },
];
```

Names, titles, and bios go in translation files (for i18n support).

## Step 7: Extract Contact & Schedule Data

```typescript
// src/lib/constants.ts
export const CLINIC = {
  name: "[Clinic Name]",
  phone: "+40...",
  email: "contact@...",
  whatsapp: "+40...",
  address: {
    street: "[Street]",
    city: "[City]",
    county: "[County]",
    country: "România",
  },
  coordinates: {
    lat: 0.0, // From Google Maps
    lng: 0.0,
  },
  social: {
    facebook: "https://facebook.com/...",
    instagram: "https://instagram.com/...",
  },
};

export const SCHEDULE = [
  { day: "monday", open: "09:00", close: "17:00" },
  { day: "tuesday", open: "09:00", close: "17:00" },
  // ...
  { day: "sunday", open: null, close: null }, // Closed
];
```

## Step 8: Map Old Routes to New Routes

| Old URL          | New URL (Romanian)            | New URL (English)                |
| ---------------- | ----------------------------- | -------------------------------- |
| `/index.html`    | `/`                           | `/en`                            |
| `/services.html` | `/preturi`                    | `/en/preturi`                    |
| `/about.html`    | `/echipa`                     | `/en/echipa`                     |
| `/contact.html`  | `/contact`                    | `/en/contact`                    |
| `/privacy.html`  | `/politica-confidentialitate` | `/en/politica-confidentialitate` |

If the old site had different URLs, add redirects in middleware or Cloudflare rules.

## Step 9: Migrate Interactive Behavior

Common JS from static sites and their Next.js equivalents:

| Old JS Feature       | Next.js Approach                                  |
| -------------------- | ------------------------------------------------- |
| jQuery smooth scroll | Native CSS `scroll-behavior: smooth`              |
| Lightbox gallery     | `embla-carousel-react`                            |
| Form validation      | React state + HTML5 validation                    |
| Mobile menu toggle   | React state + AnimatePresence                     |
| Lazy loading images  | Next.js `<Image>` with `loading="lazy"`           |
| Google Maps embed    | `<iframe>` with `loading="lazy"`                  |
| Scroll animations    | Framer Motion `whileInView` via `AnimatedSection` |

## Migration Checklist

- [ ] Color palette extracted and WCAG-verified
- [ ] All text content in translation JSON files (ro.json, en.json)
- [ ] Images copied, converted to WebP, and optimized
- [ ] Service data structured with slugs and prices
- [ ] Team data structured with images and specializations
- [ ] Contact info and schedule in constants file
- [ ] Route mapping documented (old URLs → new URLs)
- [ ] Redirects configured for old URLs (if site was indexed)
- [ ] Google Business Profile updated with new URL
- [ ] Old site analytics data noted (for baseline comparison)
- [ ] All interactive features mapped to React equivalents
- [ ] English translations created for all Romanian content
