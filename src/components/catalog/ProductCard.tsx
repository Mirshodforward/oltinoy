import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { formatPrice, productAltFallback } from "@/lib/format";
import { ProductImageView } from "./ProductImage";

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

export async function ProductCard({ product, priority = false }: { product: ProductCardData; priority?: boolean }) {
  const [t, locale] = await Promise.all([getTranslations("product"), getLocale()]);
  const name = locale === "ru" ? product.nameRu : product.nameUz;
  const categoryName = locale === "ru" ? product.category.nameRu : product.category.nameUz;
  const first = product.images[0];
  const altFallback = productAltFallback(name, categoryName);
  const alt = first ? (locale === "ru" ? first.altRu : first.altUz) || altFallback : altFallback;
  const sold = product.status === "SOLD_OUT";
  const sizeRange = product.sizes.length ? `${product.sizes[0]}–${product.sizes[product.sizes.length - 1]}` : "";

  return (
    <Link
      href={`/mahsulot/${product.slug}`}
      className="group card block transition-shadow hover:shadow-[0_8px_30px_rgb(20_22_31/0.08)]"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-[var(--color-ivory-deep)]">
        <ProductImageView
          fileName={first?.fileName ?? null}
          alt={alt}
          priority={priority}
          sizes="(max-width: 768px) 50vw, 25vw"
          className="transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {product.isNew && !sold && <span className="badge badge-new">{t("new")}</span>}
        </div>
        {sold && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(20,22,31,0.45)" }}>
            <span className="badge badge-sold text-sm">{t("soldOut")}</span>
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="line-clamp-2 text-sm font-medium leading-snug" style={{ fontFamily: "var(--font-body)" }}>
          {name}
        </h3>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="price text-base font-semibold" style={{ color: "var(--color-ink)" }}>
            {formatPrice(product.price, locale as "uz" | "ru")}
          </span>
          {product.oldPrice && (
            <span className="text-xs line-through" style={{ color: "var(--color-muted)" }}>
              {formatPrice(product.oldPrice, locale as "uz" | "ru")}
            </span>
          )}
        </div>
        {sizeRange && (
          <p className="mt-1 text-xs" style={{ color: "var(--color-muted)" }}>
            {t("sizes")}: {sizeRange}
          </p>
        )}
      </div>
    </Link>
  );
}
