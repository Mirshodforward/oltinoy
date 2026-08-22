"use client";

import Image from "next/image";
import { imageUrl, productImageLoader } from "@/lib/images";
import { Logo } from "@/components/ui/Logo";

type Props = {
  fileName: string | null;
  alt: string;
  priority?: boolean;
  sizes: string;
  className?: string;
};

/**
 * A pre-generated image variant via the custom loader, or a branded cream
 * placeholder (mark on a seam-ruled ground) when a product has no photo yet.
 *
 * This is a Client Component on purpose: `next/image` is one, and a function
 * prop like `loader` cannot cross the server → client boundary. Rendering it
 * from a Server Component throws "Functions cannot be passed directly to
 * Client Components" the moment a product actually has an image.
 */
export function ProductImageView({ fileName, alt, priority, sizes, className = "" }: Props) {
  if (!fileName) {
    return (
      <div
        className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-cream ${className}`}
        aria-label={alt || undefined}
        role={alt ? "img" : undefined}
      >
        <div
          className="absolute inset-0 opacity-[0.45]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, var(--color-sand) 0 1px, transparent 1px 14px)",
          }}
          aria-hidden="true"
        />
        <Logo height={44} className="relative opacity-45" />
      </div>
    );
  }

  return (
    <Image
      loader={productImageLoader}
      src={imageUrl(fileName, "md", "webp")}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={`object-cover ${className}`}
    />
  );
}
