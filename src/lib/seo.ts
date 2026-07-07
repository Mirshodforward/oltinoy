import type { Metadata } from "next";
import { env } from "@/lib/env";
import type { Locale } from "@/i18n/routing";

export const SITE_URL = env.SITE_URL.replace(/\/$/, "");
export const BRAND = "Oltinoy Collection";

/** Build a locale-aware absolute URL for a path (uz has no prefix). */
export function localeUrl(locale: Locale, path: string): string {
  const clean = path === "/" ? "" : path.replace(/^\//, "/");
  return locale === "uz" ? `${SITE_URL}${clean}` : `${SITE_URL}/ru${clean}`;
}

/**
 * Standard alternates block for every public page: self-canonical +
 * languages (uz, ru, x-default → uz).
 */
export function buildAlternates(path: string, locale: Locale): NonNullable<Metadata["alternates"]> {
  return {
    canonical: localeUrl(locale, path),
    languages: {
      uz: localeUrl("uz", path),
      ru: localeUrl("ru", path),
      "x-default": localeUrl("uz", path),
    },
  };
}

type OgImage = { url: string; width?: number; height?: number; alt?: string };

type PageMetaInput = {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  images?: OgImage[];
  index?: boolean;
  type?: "website" | "article";
};

const FALLBACK_OG: OgImage = {
  url: `${SITE_URL}/opengraph-image.png`,
  width: 1200,
  height: 630,
  alt: BRAND,
};

/** Compose consistent Metadata for a public page. */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  images,
  index = true,
  type = "website",
}: PageMetaInput): Metadata {
  const ogImages = images && images.length > 0 ? images : [FALLBACK_OG];
  return {
    title,
    description,
    alternates: buildAlternates(path, locale),
    robots: index
      ? { index: true, follow: true }
      : { index: false, follow: true },
    openGraph: {
      type,
      title,
      description,
      url: localeUrl(locale, path),
      siteName: BRAND,
      locale: locale === "ru" ? "ru_RU" : "uz_UZ",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImages.map((i) => i.url),
    },
  };
}
