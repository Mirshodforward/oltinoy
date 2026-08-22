import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { db } from "@/lib/db";
import { parseFilters, queryCatalog, type CatalogSearchParams } from "@/lib/catalog";
import { getRailCategories } from "@/lib/queries";
import { CatalogView, CategoryRail } from "@/components/catalog/CatalogView";
import { PageHeader } from "@/components/ui/PageHeader";
import { categoryIcon } from "@/components/ui/icons";

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
  // `categoryMeta` is a top-level namespace in the message files, not a child of
  // `catalog` — reading it off the catalog translator shipped the key as the title.
  const tm = await getTranslations({ locale, namespace: "categoryMeta" });
  const name = locale === "ru" ? cat.nameRu : cat.nameUz;
  return pageMetadata({
    locale,
    path: `/katalog/${category}`,
    title: tm("titleTemplate", { name }),
    description: tm("descriptionTemplate", { name }),
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

  const [{ total, products, totalPages }, categories, t, tp, ti] = await Promise.all([
    queryCatalog(filters, category),
    getRailCategories(),
    getTranslations("catalog"),
    getTranslations("product"),
    getTranslations("categoryIntro"),
  ]);

  const name = locale === "ru" ? cat.nameRu : cat.nameUz;
  const Icon = categoryIcon(category);

  // Category intro paragraph (indexable content above the grid). Only four of
  // the categories have one, hence the `has` guard.
  const intro = ti.has(category) ? ti(category) : "";

  return (
    <>
      <PageHeader
        crumbs={[
          { name: tp("breadcrumbHome"), href: "/" },
          { name: t("title"), href: "/katalog" },
          { name },
        ]}
        kicker={
          <>
            <Icon size={14} />
            {t("kicker")}
          </>
        }
        title={name}
        intro={intro}
      />

      <CategoryRail categories={categories} active={category} />

      <div className="container-page section-y">
        <CatalogView
          basePath={`/katalog/${category}`}
          filters={filters}
          products={products}
          total={total}
          totalPages={totalPages}
        />
      </div>
    </>
  );
}
