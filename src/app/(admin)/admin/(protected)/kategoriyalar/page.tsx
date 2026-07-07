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
      <h1 className="text-2xl font-semibold">Kategoriyalar</h1>
      <div className="seam mt-3 w-24" aria-hidden="true" />
      <div className="mt-6">
        <CategoryManager categories={items} />
      </div>
    </div>
  );
}
