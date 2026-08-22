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
    <div className="max-w-4xl">
      {/* ───────────────────────── Header ───────────────────────── */}
      <header className="max-w-2xl">
        <h1 className="text-3xl">Broadcast</h1>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--fg-muted)" }}>
          Barcha aktiv Telegram obunachilariga xabar yuboring (~20 msg/sek). Bloklagan foydalanuvchilar avtomatik
          o'chiriladi.
        </p>
      </header>
      <div className="seam mt-6" aria-hidden="true" />

      <div className="mt-8">
        <BroadcastForm products={products} />
      </div>
    </div>
  );
}
