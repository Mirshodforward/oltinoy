import type { ImageLoaderProps } from "next/image";

export type ImageSize = "sm" | "md" | "lg";
export type ImageFormat = "jpg" | "webp" | "avif";

/** Width (px) of each generated variant. See §11 image pipeline. */
export const VARIANT_WIDTH: Record<ImageSize, number> = {
  sm: 384,
  md: 768,
  lg: 1280,
};

/**
 * Build the public path for an image variant. Files are served by Nginx from
 * `/uploads/` (dev: Next static route). `fileName` is the cuid base, no extension.
 */
export function imageUrl(fileName: string, size: ImageSize = "md", format: ImageFormat = "webp"): string {
  return `/uploads/products/${fileName}-${size}.${format}`;
}

/** Absolute URL variant (for og:image, Telegram posts). */
export function absoluteImageUrl(
  siteUrl: string,
  fileName: string,
  size: ImageSize = "lg",
  format: ImageFormat = "jpg",
): string {
  return `${siteUrl.replace(/\/$/, "")}${imageUrl(fileName, size, format)}`;
}

/**
 * Custom next/image loader: map a requested width to the nearest pre-generated
 * variant so Next never re-optimizes at runtime (keeps droplet CPU free).
 * Expects `src` already produced by imageUrl() — we only swap the size token.
 */
export function productImageLoader({ src, width }: ImageLoaderProps): string {
  const size: ImageSize = width <= 384 ? "sm" : width <= 768 ? "md" : "lg";
  return src.replace(/-(sm|md|lg)\.(jpg|webp|avif)$/, `-${size}.$2`);
}
