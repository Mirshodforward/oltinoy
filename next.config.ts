import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    // We serve pre-generated variants; a custom loader (lib/images.ts) is applied
    // per <Image> so Next never re-optimizes at runtime.
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    // Keep bundle lean; only needed packages transpile.
  },
};

export default withNextIntl(nextConfig);
