# Icon & OG Image Generation

## Overview

A single script generates all favicon variants, PWA icons, and the OpenGraph social sharing image from one source logo. This ensures consistency across all platforms.

```
public/images/logo.png (source)
    ↓  npx tsx scripts/generate-icons.ts
    ↓
├── src/app/favicon.ico          (48×48  — browser tab)
├── src/app/icon.png             (32×32  — browser tab fallback)
├── src/app/apple-icon.png       (180×180 — iOS home screen)
├── public/icons/icon-192.png    (192×192 — PWA manifest)
├── public/icons/icon-512.png    (512×512 — PWA splash screen)
└── public/images/og-default.jpg (1200×630 — social sharing)
```

## Prerequisites

- **Source logo**: `public/images/logo.png` — transparent PNG, at least 512×512px
- **Clinic photo** (for OG image): `public/images/hero/clinic-exterior.webp`
- **sharp** installed as dev dependency: `npm install -D sharp`
- **tsx** for running TypeScript scripts: `npm install -D tsx`

## The Script

Save as `scripts/generate-icons.ts`:

```typescript
/**
 * One-time script to generate favicon variants, PWA icons, and OG image
 * from the clinic logo.
 *
 * Run: npx tsx scripts/generate-icons.ts
 */

import sharp from "sharp";
import { mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const LOGO_PATH = join(ROOT, "public/images/logo.png");
const APP_DIR = join(ROOT, "src/app");
const ICONS_DIR = join(ROOT, "public/icons");
const IMAGES_DIR = join(ROOT, "public/images");

/**
 * Create an icon with:
 * - Diagonal gradient background (white → gray)
 * - Subtle rounded corners (~12% radius)
 * - Logo centered at ~76% size (12% padding each side)
 */
async function createIcon(size: number, outputPath: string) {
  const logoSize = Math.round(size * 0.76);
  const offset = Math.round((size - logoSize) / 2);
  const radius = Math.round(size * 0.12);

  // Gradient background with rounded corners via SVG
  const gradientSvg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#F5F5F5" />
          <stop offset="100%" stop-color="#D0D2D6" />
        </linearGradient>
        <rect id="rect" width="${size}" height="${size}" rx="${radius}" ry="${radius}" />
        <clipPath id="clip"><use href="#rect" /></clipPath>
      </defs>
      <use href="#rect" fill="url(#bg)" />
    </svg>`;

  const bgBuffer = await sharp(Buffer.from(gradientSvg)).png().toBuffer();

  // Keep logo transparent so the gradient shows through
  const logoBuffer = await sharp(LOGO_PATH)
    .resize(logoSize, logoSize, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  // Rounded-corner mask
  const maskSvg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="white" />
    </svg>`;

  await sharp(bgBuffer)
    .composite([
      { input: logoBuffer, top: offset, left: offset },
      { input: Buffer.from(maskSvg), blend: "dest-in" },
    ])
    .png()
    .toFile(outputPath);
}

async function generateIcons() {
  mkdirSync(ICONS_DIR, { recursive: true });

  const { width, height } = await sharp(LOGO_PATH).metadata();
  console.log(`Logo source: ${width}x${height}`);

  // Next.js file-based metadata (placed in src/app/)
  await createIcon(32, join(APP_DIR, "icon.png"));
  console.log("Created src/app/icon.png (32x32)");

  await createIcon(180, join(APP_DIR, "apple-icon.png"));
  console.log("Created src/app/apple-icon.png (180x180)");

  // PWA manifest icons (placed in public/icons/)
  await createIcon(192, join(ICONS_DIR, "icon-192.png"));
  console.log("Created public/icons/icon-192.png (192x192)");

  await createIcon(512, join(ICONS_DIR, "icon-512.png"));
  console.log("Created public/icons/icon-512.png (512x512)");

  // Favicon (placed in src/app/ — Next.js serves it automatically)
  await createIcon(48, join(APP_DIR, "favicon.ico"));
  console.log("Replaced src/app/favicon.ico (48x48)");
}

async function generateOGImage() {
  const OG_WIDTH = 1200;
  const OG_HEIGHT = 630;
  const LOGO_SIZE = 180;
  const CLINIC_PHOTO = join(ROOT, "public/images/hero/clinic-exterior.webp");

  // Resize clinic photo to fill OG dimensions
  const bgBuffer = await sharp(CLINIC_PHOTO)
    .resize(OG_WIDTH, OG_HEIGHT, {
      fit: "cover",
      position: "center",
      withoutEnlargement: false,
    })
    .flatten({ background: "#ffffff" })
    .toBuffer();

  const logoBuffer = await sharp(LOGO_PATH)
    .resize(LOGO_SIZE, LOGO_SIZE, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  // Gradient overlay + text (customize for your clinic)
  const svgOverlay = `
    <svg width="${OG_WIDTH}" height="${OG_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="overlay" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#1a2e3d;stop-opacity:0.88" />
          <stop offset="50%" style="stop-color:#2c4a5a;stop-opacity:0.85" />
          <stop offset="100%" style="stop-color:#1a2e3d;stop-opacity:0.90" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#overlay)" />

      <!-- Clinic name — CUSTOMIZE -->
      <text x="${OG_WIDTH / 2}" y="400"
        font-family="Arial, Helvetica, sans-serif"
        font-size="64" font-weight="bold"
        fill="white" text-anchor="middle">
        [Clinic Name]
      </text>

      <!-- Subtitle — CUSTOMIZE -->
      <text x="${OG_WIDTH / 2}" y="455"
        font-family="Arial, Helvetica, sans-serif"
        font-size="30"
        fill="rgba(255,255,255,0.9)" text-anchor="middle">
        [Tagline / Location]
      </text>

      <!-- Services — CUSTOMIZE -->
      <text x="${OG_WIDTH / 2}" y="505"
        font-family="Arial, Helvetica, sans-serif"
        font-size="24"
        fill="rgba(255,255,255,0.75)" text-anchor="middle">
        [Key Services]
      </text>

      <!-- Phone — CUSTOMIZE -->
      <text x="${OG_WIDTH / 2}" y="555"
        font-family="Arial, Helvetica, sans-serif"
        font-size="22"
        fill="rgba(255,255,255,0.65)" text-anchor="middle">
        [Phone Number]
      </text>
    </svg>`;

  await sharp(bgBuffer)
    .composite([
      { input: Buffer.from(svgOverlay), top: 0, left: 0 },
      {
        input: logoBuffer,
        top: 100,
        left: Math.round((OG_WIDTH - LOGO_SIZE) / 2),
      },
    ])
    .jpeg({ quality: 90 })
    .toFile(join(IMAGES_DIR, "og-default.jpg"));

  console.log("Created public/images/og-default.jpg (1200x630)");
}

async function main() {
  console.log("Generating icons and OG image...\n");
  await generateIcons();
  console.log("");
  await generateOGImage();
  console.log("\nDone! All assets generated.");
}

main().catch(console.error);
```

## How to Run

```bash
npx tsx scripts/generate-icons.ts
```

## How Next.js Discovers Icons

Next.js uses **file-based metadata**. Files placed in `src/app/` are automatically served:

| File                     | Served as                       | Purpose          |
| ------------------------ | ------------------------------- | ---------------- |
| `src/app/favicon.ico`    | `/favicon.ico`                  | Browser tab icon |
| `src/app/icon.png`       | `<link rel="icon">`             | Modern browsers  |
| `src/app/apple-icon.png` | `<link rel="apple-touch-icon">` | iOS home screen  |

No `<link>` tags needed in your layout — Next.js injects them automatically.

## PWA Manifest

PWA icons are referenced in `src/app/manifest.ts`:

```typescript
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "[Clinic Name]",
    short_name: "[Short Name]",
    description: "[Description]",
    start_url: "/",
    display: "standalone",
    background_color: "#0b1120",
    theme_color: "[--primary color]",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
```

## OpenGraph Image Usage

Reference in your metadata helper:

```typescript
export const metadata = {
  openGraph: {
    images: [
      {
        url: "/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "[Clinic Name]",
      },
    ],
  },
};
```

## Customization Points

| What                | Where                           | Notes                                      |
| ------------------- | ------------------------------- | ------------------------------------------ |
| Background gradient | `gradientSvg` in `createIcon()` | Change `stop-color` values                 |
| Corner radius       | `size * 0.12`                   | Increase for rounder, decrease for squarer |
| Logo padding        | `size * 0.76`                   | Decrease for more padding around logo      |
| OG overlay color    | `svgOverlay` gradient           | Match your brand's dark tones              |
| OG text content     | `<text>` elements in SVG        | Clinic name, tagline, services, phone      |

## Icon Size Requirements

| Platform             | Size     | Format | Where                          |
| -------------------- | -------- | ------ | ------------------------------ |
| Browser tab          | 32×32    | PNG    | `src/app/icon.png`             |
| Browser tab (legacy) | 48×48    | ICO    | `src/app/favicon.ico`          |
| iOS home screen      | 180×180  | PNG    | `src/app/apple-icon.png`       |
| Android PWA          | 192×192  | PNG    | `public/icons/icon-192.png`    |
| PWA splash           | 512×512  | PNG    | `public/icons/icon-512.png`    |
| Social sharing       | 1200×630 | JPEG   | `public/images/og-default.jpg` |

## When to Re-run

Re-run the script whenever:

- The source logo changes
- The clinic photo changes (OG image)
- You want different gradient/styling on icons
- Brand colors change (update OG overlay gradient)
