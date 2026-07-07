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
 * Renders a product image variant via the custom loader, or a branded ivory
 * placeholder with the seam motif when no image exists (seed / pre-upload).
 */
export function ProductImageView({ fileName, alt, priority, sizes, className = "" }: Props) {
  if (!fileName) {
    return (
      <div
        className={`flex h-full w-full items-center justify-center ${className}`}
        style={{ background: "var(--color-ivory-deep)" }}
        aria-label={alt}
        role="img"
      >
        <div className="text-center opacity-60">
          <Logo height={36} className="mx-auto" />
        </div>
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
