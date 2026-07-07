import { db } from "@/lib/db";
import { BroadcastForm } from "@/components/admin/BroadcastForm";

export const dynamic = "force-dynamic";

export default async function AdminBroadcastPage() {
  const products = await db.product.findMany({
    where: { status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: { id: true, nameUz: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold">Broadcast</h1>
      <div className="seam mt-3 w-24" aria-hidden="true" />
      <p className="mt-3 text-sm" style={{ color: "var(--color-muted)" }}>
        Barcha aktiv Telegram obunachilariga xabar yuboring (~20 msg/sek). Bloklagan foydalanuvchilar avtomatik o'chiriladi.
      </p>
      <div className="mt-6">
        <BroadcastForm products={products} />
      </div>
    </div>
  );
}
