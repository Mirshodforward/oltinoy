import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { parseFilters, queryCatalog, type CatalogSearchParams } from "@/lib/catalog";
import { CatalogView } from "@/components/catalog/CatalogView";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<CatalogSearchParams>;
}): Promise<Metadata> {
  const { locale } = await params;
  const filters = parseFilters(await searchParams);
  const t = await getTranslations({ locale, namespace: "catalog" });
  return pageMetadata({
    locale,
    path: "/katalog",
    title: t("metaTitle"),
    description: t("metaDescription"),
    // Clean /katalog is indexable; any filter/search/page param → noindex + canonical to clean URL.
    index: !filters.hasActiveFilters,
  });
}

export default async function CatalogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<CatalogSearchParams>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const filters = parseFilters(sp);
  const { total, products, totalPages } = await queryCatalog(filters);

  const t = await getTranslations("catalog");
  const tp = await getTranslations("product");

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ name: tp("breadcrumbHome"), href: "/" }, { name: t("title") }]} />
      <h1 className="mt-4 text-3xl font-semibold md:text-4xl">{t("title")}</h1>
      <div className="seam mt-3 w-24" aria-hidden="true" />
      <div className="mt-8">
        <CatalogView basePath="/katalog" filters={filters} products={products} total={total} totalPages={totalPages} />
      </div>
    </div>
  );
}
