import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ProductForm, type ProductInitial } from "@/components/admin/ProductForm";
import { ArrowLeft, ExternalLink } from "@/components/ui/icons";

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
      {/* ───────────────────────── Header ───────────────────────── */}
      <Link
        href="/admin/mahsulotlar"
        className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold"
        style={{ color: "var(--color-gold-dk)" }}
      >
        <ArrowLeft size={16} />
        Mahsulotlar
      </Link>

      <header className="mt-1 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <h1 className="text-3xl">{product.nameUz}</h1>
          <p className="mt-3 text-sm" style={{ color: "var(--fg-muted)" }}>
            /mahsulot/{product.slug}
            {product.sku ? ` · ${product.sku}` : ""}
          </p>
        </div>
        <Link href={`/mahsulot/${product.slug}`} target="_blank" className="btn btn-outline btn-sm shrink-0">
          Saytda ko'rish
          <ExternalLink size={15} />
        </Link>
      </header>
      <div className="seam mt-6" aria-hidden="true" />

      <div className="mt-8">
        <ProductForm categories={categories} initial={initial} />
      </div>
    </div>
  );
}
