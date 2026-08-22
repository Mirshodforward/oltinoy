import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { parseFilters, queryCatalog, type CatalogSearchParams } from "@/lib/catalog";
import { getRailCategories } from "@/lib/queries";
import { CatalogView, CategoryRail } from "@/components/catalog/CatalogView";
import { PageHeader } from "@/components/ui/PageHeader";
import { Package } from "@/components/ui/icons";

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

  const [{ total, products, totalPages }, categories, t, tp] = await Promise.all([
    queryCatalog(filters),
    getRailCategories(),
    getTranslations("catalog"),
    getTranslations("product"),
  ]);

  return (
    <>
      <PageHeader
        crumbs={[{ name: tp("breadcrumbHome"), href: "/" }, { name: t("title") }]}
        kicker={
          <>
            <Package size={14} />
            {t("kicker")}
          </>
        }
        title={t("title")}
        intro={t("intro")}
      />

      <CategoryRail categories={categories} />

      <div className="container-page section-y">
        <CatalogView basePath="/katalog" filters={filters} products={products} total={total} totalPages={totalPages} />
      </div>
    </>
  );
}
