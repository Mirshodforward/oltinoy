import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { formatPrice, productAltFallback } from "@/lib/format";
import { ProductImageView } from "./ProductImage";
import { ArrowUpRight } from "@/components/ui/icons";

export type ProductCardData = {
  slug: string;
  nameUz: string;
  nameRu: string;
  price: number;
  oldPrice: number | null;
  sizes: string[];
  status: "ACTIVE" | "SOLD_OUT" | "HIDDEN";
  isNew: boolean;
  images: { fileName: string; altUz: string | null; altRu: string | null }[];
  category: { nameUz: string; nameRu: string };
};

/**
 * Catalogue tile. The whole card is one link; on hover the primary shot zooms
 * and — when a second image exists — cross-fades to it, which is how a reseller
 * judges a model without opening the page.
 */
export async function ProductCard({ product, priority = false }: { product: ProductCardData; priority?: boolean }) {
  const [t, locale] = await Promise.all([getTranslations("product"), getLocale()]);

  const name = locale === "ru" ? product.nameRu : product.nameUz;
  const categoryName = locale === "ru" ? product.category.nameRu : product.category.nameUz;
  const [first, second] = product.images;
  const altFallback = productAltFallback(name, categoryName);
  const alt = first ? (locale === "ru" ? first.altRu : first.altUz) || altFallback : altFallback;

  const sold = product.status === "SOLD_OUT";
  const discounted = product.oldPrice !== null && product.oldPrice > product.price;
  const sizeRange = product.sizes.length
    ? product.sizes.length === 1
      ? product.sizes[0]
      : `${product.sizes[0]}–${product.sizes[product.sizes.length - 1]}`
    : "";

  return (
    <Link href={`/mahsulot/${product.slug}`} className="card card-lift group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-cream">
        <div className="absolute inset-0 transition-transform duration-[700ms] ease-[var(--ease-expo)] group-hover:scale-[1.045]">
          <ProductImageView
            fileName={first?.fileName ?? null}
            alt={alt}
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={second ? "transition-opacity duration-500 group-hover:opacity-0" : undefined}
          />
          {second && (
            <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <ProductImageView
                fileName={second.fileName}
                alt=""
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </div>
          )}
        </div>

        <div className="absolute left-2.5 top-2.5 flex flex-col items-start gap-1.5">
          {product.isNew && !sold && <span className="badge badge-new">{t("new")}</span>}
          {discounted && !sold && <span className="badge badge-sale">{t("sale")}</span>}
        </div>

        {sold ? (
          <div
            className="absolute inset-0 flex items-center justify-center backdrop-blur-[1px]"
            style={{ background: "color-mix(in srgb, var(--color-ink) 42%, transparent)" }}
          >
            <span className="badge badge-sold text-xs">{t("soldOut")}</span>
          </div>
        ) : (
          <span
            className="absolute bottom-3 right-3 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full opacity-0 transition-all duration-300 ease-[var(--ease-expo)] group-hover:translate-y-0 group-hover:opacity-100"
            style={{ background: "var(--color-gold)", color: "var(--color-ink)" }}
            aria-hidden="true"
          >
            <ArrowUpRight size={18} />
          </span>
        )}
      </div>

      <div className="p-3.5 md:p-4">
        <p className="text-2xs font-bold uppercase tracking-[0.14em]" style={{ color: "var(--color-gold-dk)" }}>
          {categoryName}
        </p>

        <h3
          className="mt-1.5 line-clamp-2 text-sm font-medium leading-snug transition-colors group-hover:text-gold-dk"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {name}
        </h3>

        <div className="mt-2.5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="price text-lg">{formatPrice(product.price, locale as "uz" | "ru")}</span>
          {discounted && (
            <span className="price-old text-xs">{formatPrice(product.oldPrice!, locale as "uz" | "ru")}</span>
          )}
        </div>

        {sizeRange && (
          <p className="mt-2 flex items-center gap-1.5 text-xs" style={{ color: "var(--fg-subtle)" }}>
            <span className="font-semibold">{t("sizesShort")}</span>
            <span className="tabular-nums">{sizeRange}</span>
          </p>
        )}
      </div>
    </Link>
  );
}
