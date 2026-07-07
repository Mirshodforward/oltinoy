import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ProductForm, type ProductInitial } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const productId = Number(id);
  if (!Number.isInteger(productId)) notFound();

  const [product, categories] = await Promise.all([
    db.product.findUnique({ where: { id: productId }, include: { images: { orderBy: { sortOrder: "asc" } } } }),
    db.category.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, nameUz: true } }),
  ]);
  if (!product) notFound();

  const initial: ProductInitial = {
    id: product.id,
    nameUz: product.nameUz,
    nameRu: product.nameRu,
    slug: product.slug,
    sku: product.sku,
    descriptionUz: product.descriptionUz,
    descriptionRu: product.descriptionRu,
    materialUz: product.materialUz,
    materialRu: product.materialRu,
    price: product.price,
    oldPrice: product.oldPrice,
    sizes: product.sizes,
    minOrderQty: product.minOrderQty,
    categoryId: product.categoryId,
    status: product.status,
    isNew: product.isNew,
    images: product.images.map((img) => ({
      fileName: img.fileName,
      width: img.width,
      height: img.height,
      altUz: img.altUz ?? "",
      altRu: img.altRu ?? "",
    })),
    alreadyPosted: product.tgMessageIds.length > 0,
  };

  return (
    <div className="max-w-4xl">
      <Link href="/admin/mahsulotlar" className="text-sm" style={{ color: "var(--color-bronze)" }}>
        ← Mahsulotlar
      </Link>
      <div className="mt-2 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">{product.nameUz}</h1>
        <Link href={`/mahsulot/${product.slug}`} target="_blank" className="text-sm hover:underline" style={{ color: "var(--color-bronze)" }}>
          Saytda ko'rish ↗
        </Link>
      </div>
      <div className="seam mt-3 w-24" aria-hidden="true" />
      <div className="mt-6">
        <ProductForm categories={categories} initial={initial} />
      </div>
    </div>
  );
}
