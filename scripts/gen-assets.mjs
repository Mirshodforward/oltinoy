// Generates brand assets (favicon, apple-icon, icon, opengraph-image) in
// /public from the official logo (public/oltinoy_logo.png) using sharp.
// Run once (or whenever the logo changes): `node scripts/gen-assets.mjs`.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pub = join(root, "public");
const LOGO = join(pub, "oltinoy_logo.png");

const INK = "#14161f";
const IVORY = "#f7f3ec";
const GOLD = "#c9a227";
const BRONZE = "#8a6f4d";

/** Composite the logo, centered, onto a square background. */
async function squareIcon(outFile, size, { padding = 0.13, rounded = true, bg = INK } = {}) {
  const inner = Math.round(size * (1 - padding * 2));
  const logoBuf = await sharp(LOGO).resize({ width: inner, height: inner, fit: "contain" }).toBuffer();
  const bgSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
    <rect width="${size}" height="${size}" rx="${rounded ? size * 0.18 : 0}" fill="${bg}"/>
  </svg>`;
  await sharp(Buffer.from(bgSvg))
    .composite([{ input: logoBuf, gravity: "center" }])
    .png()
    .toFile(outFile);
}

/** Ink-navy OG card: logo mark on the left, wordmark + tagline on the right. */
async function ogImage(outFile, w, h) {
  const logoHeight = Math.round(h * 0.42);
  const logoWidth = Math.round(logoHeight * (827 / 812));
  const logoX = Math.round(w * 0.07);
  const logoY = Math.round((h - logoHeight) / 2);
  const textX = logoX + logoWidth + Math.round(w * 0.05);

  const seam = [];
  const seamY = Math.round(h * 0.7);
  for (let x = textX; x < w * 0.92; x += w * 0.026) {
    seam.push(`<rect x="${x}" y="${seamY}" width="${w * 0.015}" height="3" fill="${GOLD}" rx="1.5"/>`);
  }

  const textSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <rect width="${w}" height="${h}" fill="${INK}"/>
    <text x="${textX}" y="${h * 0.44}" font-family="Georgia, serif" font-weight="600" font-size="${h * 0.115}" fill="${IVORY}">Oltinoy <tspan fill="${GOLD}">Collection</tspan></text>
    <text x="${textX}" y="${h * 0.58}" font-family="Arial, sans-serif" font-size="${h * 0.05}" fill="${BRONZE}">Optom modest fashion • O'z tikuv sexidan • Toshkent</text>
    ${seam.join("")}
  </svg>`;

  const logoBuf = await sharp(LOGO).resize({ height: logoHeight }).toBuffer();

  await sharp(Buffer.from(textSvg))
    .composite([{ input: logoBuf, left: logoX, top: logoY }])
    .png()
    .toFile(outFile);
}

async function main() {
  await mkdir(pub, { recursive: true });
  await squareIcon(join(pub, "icon.png"), 512);
  await squareIcon(join(pub, "apple-icon.png"), 180, { rounded: false }); // iOS applies its own mask
  await squareIcon(join(pub, "favicon-32.png"), 32, { padding: 0.08 });
  await ogImage(join(pub, "opengraph-image.png"), 1200, 630);
  console.log("✓ Generated brand assets from oltinoy_logo.png in /public");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
