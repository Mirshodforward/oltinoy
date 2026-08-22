import Link from "next/link";
import { db } from "@/lib/db";
import { ProductForm } from "@/components/admin/ProductForm";
import { AlertCircle, ArrowLeft } from "@/components/ui/icons";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await db.category.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, nameUz: true } });

  return (
    <div className="max-w-4xl">
      {/* ───────────────────────── Header ───────────────────────── */}
      <Link
        href="/admin/mahsulotlar"
        className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold"
        style={{ color: "var(--color-gold-dk)" }}
      >
        <ArrowLeft size={16} />
        Mahsulotlar
      </Link>

      <header className="mt-1 max-w-2xl">
        <h1 className="text-3xl">Yangi mahsulot</h1>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--fg-muted)" }}>
          Model nomi, narxi, razmerlari va rasmlari — so'ng katalogda paydo bo'ladi.
        </p>
      </header>
      <div className="seam mt-6" aria-hidden="true" />

      <div className="mt-8">
        {categories.length === 0 ? (
          <div className="card px-6 py-16 text-center">
            <AlertCircle size={30} className="mx-auto" style={{ color: "var(--color-danger)" }} />
            <p className="mx-auto mt-4 max-w-md text-sm" style={{ color: "var(--fg-muted)" }}>
              Avval kamida bitta kategoriya yarating.
            </p>
            <Link href="/admin/kategoriyalar" className="btn btn-gold mt-6">
              Kategoriyalar
            </Link>
          </div>
        ) : (
          <ProductForm categories={categories} />
        )}
      </div>
    </div>
  );
}
