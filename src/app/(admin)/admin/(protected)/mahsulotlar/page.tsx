import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { imageUrl, productImageLoader } from "@/lib/images";
import { ProductRowActions } from "@/components/admin/ProductRowActions";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { nameUz: true } },
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
      _count: { select: { bookings: true } },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Mahsulotlar</h1>
          <div className="seam mt-3 w-24" aria-hidden="true" />
        </div>
        <Link href="/admin/mahsulotlar/yangi" className="btn btn-primary">
          ＋ Yangi mahsulot
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="card mt-6 py-16 text-center text-sm" style={{ color: "var(--color-muted)" }}>
          Hozircha mahsulot yo'q. "Yangi mahsulot" tugmasini bosing.
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="text-left" style={{ color: "var(--color-muted)" }}>
                <th className="p-2 font-semibold">Rasm</th>
                <th className="p-2 font-semibold">Nomi</th>
                <th className="p-2 font-semibold">Kategoriya</th>
                <th className="p-2 font-semibold">Narx</th>
                <th className="p-2 font-semibold">👁</th>
                <th className="p-2 font-semibold">📩</th>
                <th className="p-2 font-semibold">Kanal</th>
                <th className="p-2 font-semibold">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const img = p.images[0];
                return (
                  <tr key={p.id} className="border-t" style={{ borderColor: "var(--color-line)" }}>
                    <td className="p-2">
                      <div className="relative h-14 w-11 overflow-hidden rounded bg-[var(--color-ivory-deep)]">
                        {img && (
                          <Image loader={productImageLoader} src={imageUrl(img.fileName, "sm", "webp")} alt="" fill sizes="44px" className="object-cover" />
                        )}
                      </div>
                    </td>
                    <td className="p-2">
                      <Link href={`/admin/mahsulotlar/${p.id}`} className="font-medium hover:text-[var(--color-bronze)]">
                        {p.nameUz}
                      </Link>
                      {p.sku && <div className="text-xs" style={{ color: "var(--color-muted)" }}>{p.sku}</div>}
                    </td>
                    <td className="p-2" style={{ color: "var(--color-muted)" }}>{p.category.nameUz}</td>
                    <td className="p-2 tabular-nums">{formatPrice(p.price)}</td>
                    <td className="p-2 tabular-nums">{p.viewCount}</td>
                    <td className="p-2 tabular-nums">{p._count.bookings}</td>
                    <td className="p-2">{p.tgMessageIds.length > 0 ? "✅" : "—"}</td>
                    <td className="p-2">
                      <ProductRowActions id={p.id} status={p.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
