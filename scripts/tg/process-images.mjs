/**
 * Kanaldan olingan rasmlarni saytning variant sxemasiga aylantiradi
 * (src/lib/images-server.ts bilan bir xil: lg.jpg/lg.webp/lg.avif/md.webp/sm.webp).
 *
 * Kadr 3:4 ga qirqiladi — katalog kartasi ham, galereya ham shu nisbatda,
 * shuning uchun bir xil kadrlash butun katalogni tekis ko'rsatadi.
 *
 *   node scripts/tg/process-images.mjs
 */
import sharp from "sharp";
import { randomBytes } from "node:crypto";
import { mkdirSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "out/variants");
const CATALOG = join(HERE, "out/catalog.json");
const PICS = join(HERE, "out/pics");
const VARIANT_WIDTH = { sm: 384, md: 768, lg: 1280 };

mkdirSync(OUT, { recursive: true });
const catalog = JSON.parse(readFileSync(CATALOG, "utf8"));
const manifest = {};
let done = 0;

for (const p of catalog.products) {
  manifest[p.slug] = [];
  for (const id of p.images) {
    const src = join(PICS, `${id}.jpg`);
    if (!existsSync(src)) { console.log(`  ⚠️ yo'q: ${id}`); continue; }

    const fileName = randomBytes(12).toString("hex");
    const base = sharp(src, { failOn: "none" }).rotate().withMetadata({ orientation: undefined });
    const meta = await base.clone().metadata();

    // 3:4 ga qirqish — yuqoridan, bosh va kiyimning yuqori qismi saqlansin.
    const targetW = Math.min(meta.width ?? VARIANT_WIDTH.lg, VARIANT_WIDTH.lg);
    const targetH = Math.round((targetW * 4) / 3);
    const framed = await base
      .clone()
      .resize({ width: targetW, height: targetH, fit: "cover", position: "top", withoutEnlargement: false })
      .toBuffer({ resolveWithObject: true });

    const lg = sharp(framed.data);
    const f = (s) => join(OUT, `${fileName}-${s}`);
    await Promise.all([
      lg.clone().jpeg({ quality: 80, mozjpeg: true }).toFile(f("lg.jpg")),
      lg.clone().webp({ quality: 80 }).toFile(f("lg.webp")),
      lg.clone().avif({ quality: 55 }).toFile(f("lg.avif")),
      lg.clone().resize({ width: VARIANT_WIDTH.md }).webp({ quality: 78 }).toFile(f("md.webp")),
      lg.clone().resize({ width: VARIANT_WIDTH.sm }).webp({ quality: 74 }).toFile(f("sm.webp")),
    ]);

    manifest[p.slug].push({ fileName, width: framed.info.width, height: framed.info.height, sourceId: id });
    done++;
  }
  process.stdout.write(`\r${p.rank}/30 — ${done} rasm`);
}

writeFileSync(join(HERE, "out/manifest.json"), JSON.stringify(manifest, null, 2));
console.log(`\n✅ ${done} rasm × 5 variant -> ${OUT}`);
