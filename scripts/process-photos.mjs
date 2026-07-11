/**
 * Turns the originals in public/photos/originals/ into the web assets the site
 * ships. Every operation in THIS script is a reversible photographic
 * adjustment — white balance, exposure, crop, resize.
 *
 * `photo-1-composite.jpg` is the genuine storefront photograph, cropped to the
 * ground floor (upper apartment storey removed at 13% down) and nothing else.
 * No AI, no retouching — every pixel is the real premises. Earlier generative
 * attempts to declutter the walls were rejected; the plain photo is what ships.
 * (The filename keeps the `-composite` suffix only so the pipeline path is
 * stable; there is no compositing in it.)
 *
 * Run: node scripts/process-photos.mjs
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SRC = "public/photos/originals";
const OUT = "public/photos";

/**
 * Partial grey-world white balance.
 *
 * Full grey-world forces every channel mean to match, which neutralises the
 * warm afternoon light that makes these rooms look inviting. `strength` blends
 * between the original and the fully-corrected gain, so we pull the cast back
 * without sterilising the light.
 */
async function whiteBalanceGains(file, strength) {
  const { channels } = await sharp(file).stats();
  const [r, g, b] = channels.map((c) => c.mean);
  const target = (r + g + b) / 3;

  return [r, g, b].map((mean) => {
    const fullGain = target / mean;
    return 1 + (fullGain - 1) * strength;
  });
}

/** sharp's `linear` takes per-channel multipliers and offsets. */
function applyGains(pipeline, gains, brightness = 0) {
  return pipeline.linear(gains, [brightness, brightness, brightness]);
}

async function build({ src, out, wb = 0.6, brightness = 0, gamma, crop, width, height, quality = 82 }) {
  const file = `${SRC}/${src}`;
  const gains = await whiteBalanceGains(file, wb);

  let p = sharp(file);
  if (crop) p = p.extract(crop);
  p = applyGains(p, gains, brightness);
  if (gamma) p = p.gamma(gamma);
  // Passing `height` forces an exact output size. The <Image> tags declare
  // width/height, so a one-pixel drift here becomes a layout shift.
  p = height
    ? p.resize({ width, height, fit: "cover", kernel: "lanczos3" })
    : p.resize({ width, withoutEnlargement: true, kernel: "lanczos3" });

  const info = await p.webp({ quality, effort: 6 }).toFile(`${OUT}/${out}`);

  const gainStr = gains.map((x) => x.toFixed(3)).join(", ");
  console.log(
    `  ${out.padEnd(28)} ${String(info.width).padStart(4)}x${String(info.height).padEnd(4)}  ` +
      `${String(Math.round(info.size / 1024)).padStart(4)} KB   gains [${gainStr}]`,
  );
}

async function pct(file, l, t, w, h) {
  const { width, height } = await sharp(`${SRC}/${file}`).metadata();
  return {
    left: Math.round(width * l),
    top: Math.round(height * t),
    width: Math.round(width * w),
    height: Math.round(height * h),
  };
}

await mkdir(OUT, { recursive: true });
console.log("Processing clinic photos\n");

/*
 * Storefront — the composite described in the file header. It is already
 * cropped to the ground floor (16:9), so no further crop here: just white
 * balance and resize to the exact size the <Image> tag declares.
 */
await build({
  src: "photo-1-composite.jpg",
  out: "storefront.webp",
  wb: 0.5,
  brightness: 8,
  width: 1600,
  height: 900,
});

// Open Graph card — a *designed* social-share image, not a bare photo crop.
// The real storefront (storefront.webp, built just above) is the background;
// a brand gradient darkens the lower-left so the name, tagline, services and
// phone read clearly. Only this gradient + text layer is composited — the
// photograph underneath is untouched (no fabricated details on the premises).
// The phone mirrors CLINIC.phoneDisplay; keep the two in sync if it changes.
{
  const W = 1200;
  const H = 630; // 1.91:1, the ratio Facebook / WhatsApp / LinkedIn crop to
  const bg = await sharp(`${OUT}/storefront.webp`)
    .resize({ width: W, height: H, fit: "cover", position: "centre" })
    .toBuffer();

  // lucide "phone" glyph, stroked inside the call-to-action pill.
  const phoneIcon =
    "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z";

  const overlay = Buffer.from(
    `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="v" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#141514" stop-opacity="0.06"/>
          <stop offset="0.45" stop-color="#141514" stop-opacity="0.34"/>
          <stop offset="1" stop-color="#0e0f0e" stop-opacity="0.94"/>
        </linearGradient>
        <linearGradient id="h" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#0e0f0e" stop-opacity="0.74"/>
          <stop offset="0.55" stop-color="#0e0f0e" stop-opacity="0.12"/>
          <stop offset="1" stop-color="#0e0f0e" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#v)"/>
      <rect width="${W}" height="${H}" fill="url(#h)"/>
      <rect x="72" y="330" width="60" height="5" rx="2.5" fill="#ece3cb"/>
      <text x="70" y="420" font-family="Helvetica Neue, Arial, sans-serif" font-size="80" font-weight="700" fill="#ece3cb" letter-spacing="-1">Dentologia</text>
      <text x="72" y="470" font-family="Helvetica Neue, Arial, sans-serif" font-size="33" font-weight="500" fill="#ece3cb" fill-opacity="0.93">Clinică stomatologică în Câmpulung Muscel</text>
      <text x="72" y="512" font-family="Helvetica Neue, Arial, sans-serif" font-size="25" font-weight="600" fill="#ece3cb" fill-opacity="0.70" letter-spacing="0.3">Implant · Aparat dentar · Albire · Urgențe</text>
      <g transform="translate(72,538)">
        <rect x="0" y="0" width="300" height="52" rx="26" fill="#ece3cb"/>
        <g transform="translate(24,14)" stroke="#17181a" stroke-width="2.1" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="${phoneIcon}"/></g>
        <text x="62" y="34" font-family="Helvetica Neue, Arial, sans-serif" font-size="27" font-weight="700" fill="#17181a" letter-spacing="0.5">0750 486 564</text>
      </g>
    </svg>`,
  );

  const card = sharp(bg).composite([{ input: overlay, top: 0, left: 0 }]);
  await card.clone().webp({ quality: 82, effort: 6 }).toFile(`${OUT}/og-storefront.webp`);
  // JPG copy: WhatsApp/Facebook render WebP og:image inconsistently (silent
  // failures on older Android), so the metadata points at this JPG.
  await card.clone().jpeg({ quality: 86 }).toFile(`${OUT}/og-storefront.jpg`);
  console.log(`  ${"og-storefront (webp+jpg)".padEnd(28)} designed card ${W}x${H}`);
}

// Reception — strongest warm cast (R/B 1.26). Crop away dead ceiling.
await build({
  src: "photo-2.jpg",
  out: "receptie.webp",
  wb: 0.75,
  brightness: 4,
  gamma: 1.06,
  crop: await pct("photo-2.jpg", 0.0, 0.18, 1.0, 0.72),
  width: 1200,
});

// Treatment room — warm cast + deep shadows. Crop the empty foreground floor.
await build({
  src: "photo-3.jpg",
  out: "cabinet.webp",
  wb: 0.7,
  brightness: 8,
  gamma: 1.1,
  crop: await pct("photo-3.jpg", 0.0, 0.0, 1.0, 0.78),
  width: 1200,
});

// Alternative Open Graph card, cropped from the treatment room. Use this one if
// you would rather link previews did not show the opening-day balloons.
{
  const { width, height } = await sharp(`${SRC}/photo-3.jpg`).metadata();
  const bandHeight = Math.round(width / 1.91);
  const top = Math.round(height * 0.34); // chair + window, above the empty floor
  await build({
    src: "photo-3.jpg",
    out: "og-cabinet.webp",
    wb: 0.7,
    brightness: 8,
    gamma: 1.1,
    crop: { left: 0, top, width, height: bandHeight },
    width: 1200,
    quality: 84,
  });
}

// Staff portrait — already well exposed and neutral. Light touch, 4:5 crop.
await build({
  src: "photo-4.jpg",
  out: "echipa-portret.webp",
  wb: 0.4,
  crop: await pct("photo-4.jpg", 0.06, 0.02, 0.88, 0.86),
  width: 800,
});

// Gallery — clinic-in-action shots for the homepage "În cabinet" section.
// Staff and patient consent is on record. Cropped to a uniform 4:5 portrait so
// they tile cleanly. The treatment-room shots are cooler than the interiors
// (surgical light is bluer), so these get a warm-ward white balance.
async function crop45(file, topFrac) {
  const { width, height } = await sharp(`${SRC}/${file}`).metadata();
  const h = Math.min(height, Math.round((width * 5) / 4));
  const top = Math.round((height - h) * topFrac);
  return { left: 0, top, width, height: h };
}

for (const [src, out, wb, topFrac] of [
  ["photo-5.jpg", "galerie-1.webp", 0.35, 0.15],
  ["photo-6.jpg", "galerie-2.webp", 0.55, 0.1],
  ["photo-7.jpg", "galerie-3.webp", 0.45, 0.1],
]) {
  await build({
    src,
    out,
    wb,
    brightness: 4,
    crop: await crop45(src, topFrac),
    width: 760,
  });
}

console.log("\nDone.");
