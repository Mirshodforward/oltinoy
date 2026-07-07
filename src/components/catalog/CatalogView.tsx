import { getTranslations } from "next-intl/server";
import { CatalogFilters } from "./CatalogFilters";
import { ProductGrid } from "./ProductGrid";
import { Pagination } from "./Pagination";
import type { ProductCardData } from "./ProductCard";
import { buildQuery, type ParsedFilters } from "@/lib/catalog";

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

      <p className="mb-4 text-sm" style={{ color: "var(--color-muted)" }}>
        {t("resultsCount", { count: total })}
      </p>

      {products.length > 0 ? (
        <>
          <ProductGrid products={products} priorityCount={4} />
          <Pagination
            basePath={basePath}
            page={filters.page}
            totalPages={totalPages}
            makeQuery={(p) => buildQuery(filters, { page: p })}
          />
        </>
      ) : (
        <div className="card py-16 text-center">
          <p className="text-sm" style={{ color: "var(--color-muted)" }}>
            {t("empty")}
          </p>
        </div>
      )}
    </>
  );
}
