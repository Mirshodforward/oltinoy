import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CatalogFilters } from "./CatalogFilters";
import { ProductGrid } from "./ProductGrid";
import { Pagination } from "./Pagination";
import type { ProductCardData } from "./ProductCard";
import { buildQuery, type ParsedFilters } from "@/lib/catalog";
import { Search, categoryIcon } from "@/components/ui/icons";

export type RailCategory = { slug: string; nameUz: string; nameRu: string };

/**
 * The category rail that sits between the page header and the toolbar: the
 * whole assortment in one horizontally scrollable row, so switching category
 * never costs a trip back to /katalog.
 */
export async function CategoryRail({ categories, active }: { categories: RailCategory[]; active?: string }) {
  if (categories.length === 0) return null;

  const [t, locale] = await Promise.all([getTranslations("catalog"), getLocale()]);

  return (
    <div className="border-b" style={{ borderColor: "var(--line)" }}>
      <div className="container-page">
        <nav aria-label={t("category")} className="rail no-scrollbar py-4">
          <Link
            href="/katalog"
            className="chip"
            data-active={active ? undefined : "true"}
            aria-current={active ? undefined : "page"}
          >
            {t("allCategories")}
          </Link>
          {categories.map((c) => {
            const Icon = categoryIcon(c.slug);
            const isActive = c.slug === active;
            return (
              <Link
                key={c.slug}
                href={`/katalog/${c.slug}`}
                className="chip"
                data-active={isActive ? "true" : undefined}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon size={16} style={{ color: isActive ? "var(--color-gold-lt)" : "var(--color-gold-dk)" }} />
                {locale === "ru" ? c.nameRu : c.nameUz}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export async function CatalogView({
  basePath,
  filters,
  products,
  total,
  totalPages,
}: {
  basePath: string;
  filters: ParsedFilters;
  products: ProductCardData[];
  total: number;
  totalPages: number;
}) {
  const t = await getTranslations("catalog");

  return (
    <>
      <CatalogFilters
        basePath={basePath}
        current={{ size: filters.size, min: filters.min, max: filters.max, sort: filters.sort, q: filters.q }}
      />

      {/* Result count as a meta line, the seam running out to the margin. */}
      <div className="mb-5 flex items-center gap-4">
        <p
          className="text-2xs font-bold uppercase tracking-[0.18em]"
          style={{ color: "var(--fg-muted)" }}
          aria-live="polite"
        >
          {t("resultsCount", { count: total })}
        </p>
        <span className="seam flex-1" aria-hidden="true" />
      </div>

      {products.length > 0 ? (
        <>
          {/* The grid's tiles are <h3>s under the page <h1>; this keeps the
              outline from skipping a level without adding visible chrome. */}
          <h2 className="sr-only">{t("title")}</h2>
          <ProductGrid products={products} priorityCount={4} />
          <Pagination
            basePath={basePath}
            page={filters.page}
            totalPages={totalPages}
            makeQuery={(p) => buildQuery(filters, { page: p })}
          />
        </>
      ) : (
        <div className="card px-6 py-16 text-center">
          <Search size={30} className="mx-auto text-gold" />
          <h2 className="mt-5 text-2xl">{t("emptyTitle")}</h2>
          <p className="mx-auto mt-3 max-w-md text-base" style={{ color: "var(--fg-muted)" }}>
            {t("empty")}
          </p>
          <Link href={basePath} className="btn btn-gold mt-7">
            {t("emptyCta")}
          </Link>
        </div>
      )}
    </>
  );
}
