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

// Open Graph card, cropped from the same composite to 1.91:1 (the ratio
// Facebook / WhatsApp / LinkedIn crop to), centred on the door.
{
  const src = "photo-1-composite.jpg";
  const { width, height } = await sharp(`${SRC}/${src}`).metadata();
  const bandWidth = Math.min(Math.round(height * 1.91), width);
  const left = Math.round((width - bandWidth) / 2);
  await build({
    src,
    out: "og-storefront.webp",
    wb: 0.5,
    brightness: 8,
    crop: { left, top: 0, width: bandWidth, height },
    width: 1200,
    height: 628,
    quality: 84,
  });
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
