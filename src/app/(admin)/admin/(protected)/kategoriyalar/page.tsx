import { db } from "@/lib/db";
import { CategoryManager, type CategoryItem } from "@/components/admin/CategoryManager";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const cats = await db.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });
  const items: CategoryItem[] = cats.map((c) => ({
    id: c.id,
    slug: c.slug,
    nameUz: c.nameUz,
    nameRu: c.nameRu,
    sortOrder: c.sortOrder,
    isActive: c.isActive,
    productCount: c._count.products,
  }));

  return (
    <div className="max-w-4xl">
      {/* ───────────────────────── Header ───────────────────────── */}
      <header className="max-w-2xl">
        <h1 className="text-3xl">Kategoriyalar</h1>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--fg-muted)" }}>
          Katalog bo'limlari — nomlari, tartibi va saytda ko'rinishi.
        </p>
      </header>
      <div className="seam mt-6" aria-hidden="true" />

      <div className="mt-8">
        <CategoryManager categories={items} />
      </div>
    </div>
  );
}
