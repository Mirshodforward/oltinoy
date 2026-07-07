import "server-only";
import sharp from "sharp";
import { randomBytes } from "node:crypto";
import { mkdir, unlink } from "node:fs/promises";
import { join } from "node:path";
import { env } from "@/lib/env";
import { VARIANT_WIDTH } from "@/lib/images";

const PRODUCTS_DIR = join(env.UPLOAD_DIR, "products");

/** Magic-byte sniff — do not trust the client-provided mimetype. */
export function sniffImageType(buf: Buffer): "jpeg" | "png" | "webp" | null {
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpeg";
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return "png";
  if (buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") return "webp";
  return null;
}

export type UploadedVariant = { fileName: string; width: number; height: number };

/**
 * Process one uploaded image into all variants (§11). Returns the base
 * fileName (cuid-like) + dimensions of the "lg" variant.
 */
export async function processProductImage(input: Buffer): Promise<UploadedVariant> {
  await mkdir(PRODUCTS_DIR, { recursive: true });
  const fileName = randomBytes(12).toString("hex");

  // Normalize: auto-rotate + strip metadata.
  const base = sharp(input, { failOn: "none" }).rotate().withMetadata({ orientation: undefined });

  const lgBuf = await base.clone().resize({ width: VARIANT_WIDTH.lg, withoutEnlargement: true }).toBuffer({ resolveWithObject: true });
  const { width, height } = lgBuf.info;

  const p = (suffix: string) => join(PRODUCTS_DIR, `${fileName}-${suffix}`);

  await Promise.all([
    sharp(lgBuf.data).jpeg({ quality: 80, mozjpeg: true }).toFile(p("lg.jpg")),
    sharp(lgBuf.data).webp({ quality: 80 }).toFile(p("lg.webp")),
    sharp(lgBuf.data).avif({ quality: 55 }).toFile(p("lg.avif")),
    base.clone().resize({ width: VARIANT_WIDTH.md, withoutEnlargement: true }).webp({ quality: 78 }).toFile(p("md.webp")),
    base.clone().resize({ width: VARIANT_WIDTH.sm, withoutEnlargement: true }).webp({ quality: 74 }).toFile(p("sm.webp")),
  ]);

  return { fileName, width: width ?? VARIANT_WIDTH.lg, height: height ?? Math.round((VARIANT_WIDTH.lg * 4) / 3) };
}

/** Best-effort removal of every variant of an image. */
export async function deleteProductImage(fileName: string): Promise<void> {
  const suffixes = ["lg.jpg", "lg.webp", "lg.avif", "md.webp", "sm.webp"];
  await Promise.all(
    suffixes.map((s) => unlink(join(PRODUCTS_DIR, `${fileName}-${s}`)).catch(() => {})),
  );
}
