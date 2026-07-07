import Link from "next/link";
import { db } from "@/lib/db";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await db.category.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, nameUz: true } });

  return (
    <div className="max-w-4xl">
      <Link href="/admin/mahsulotlar" className="text-sm" style={{ color: "var(--color-bronze)" }}>
        ← Mahsulotlar
      </Link>
      <h1 className="mt-2 text-2xl font-semibold">Yangi mahsulot</h1>
      <div className="seam mt-3 w-24" aria-hidden="true" />
      <div className="mt-6">
        {categories.length === 0 ? (
          <p className="text-sm" style={{ color: "#b91c1c" }}>
            Avval kamida bitta kategoriya yarating.
          </p>
        ) : (
          <ProductForm categories={categories} />
        )}
      </div>
    </div>
  );
}
