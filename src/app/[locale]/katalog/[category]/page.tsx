import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { db } from "@/lib/db";
import { parseFilters, queryCatalog, type CatalogSearchParams } from "@/lib/catalog";
import { CatalogView } from "@/components/catalog/CatalogView";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

async function getCategory(slug: string) {
  try {
    return await db.category.findUnique({ where: { slug } });
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const cats = await db.category.findMany({ where: { isActive: true }, select: { slug: true } });
    return cats.map((c) => ({ category: c.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale; category: string }>;
  searchParams: Promise<CatalogSearchParams>;
}): Promise<Metadata> {
  const { locale, category } = await params;
  const cat = await getCategory(category);
  if (!cat) return {};
  const filters = parseFilters(await searchParams);
  const t = await getTranslations({ locale, namespace: "catalog" });
  const name = locale === "ru" ? cat.nameRu : cat.nameUz;
  return pageMetadata({
    locale,
    path: `/katalog/${category}`,
    title: t("categoryMeta.titleTemplate", { name }),
    description: t("categoryMeta.descriptionTemplate", { name }),
    index: !filters.hasActiveFilters,
  });
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale; category: string }>;
  searchParams: Promise<CatalogSearchParams>;
}) {
  const { locale, category } = await params;
  setRequestLocale(locale);
  const cat = await getCategory(category);
  if (!cat || !cat.isActive) notFound();

  const filters = parseFilters(await searchParams);
  const { total, products, totalPages } = await queryCatalog(filters, category);

  const t = await getTranslations("catalog");
  const tp = await getTranslations("product");
  const name = locale === "ru" ? cat.nameRu : cat.nameUz;

  // Category intro paragraph (indexable content above the grid).
  const intro = t.has(`categoryIntro.${category}`) ? t(`categoryIntro.${category}`) : "";

  return (
    <div className="container-page py-8">
      <Breadcrumbs
        items={[
          { name: tp("breadcrumbHome"), href: "/" },
          { name: t("title"), href: "/katalog" },
          { name },
        ]}
      />
      <h1 className="mt-4 text-3xl font-semibold md:text-4xl">{name}</h1>
      <div className="seam mt-3 w-24" aria-hidden="true" />
      {intro && (
        <p className="mt-4 max-w-3xl text-sm leading-relaxed" style={{ color: "var(--color-muted)" }}>
          {intro}
        </p>
      )}
      <div className="mt-8">
        <CatalogView
          basePath={`/katalog/${category}`}
          filters={filters}
          products={products}
          total={total}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
