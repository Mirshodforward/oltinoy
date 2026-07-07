import Link from "next/link";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

function StatCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="card p-5">
      <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-bronze)" }}>
        {label}
      </div>
      <div className="price mt-1 text-3xl font-semibold">{value}</div>
      {hint && (
        <div className="mt-1 text-xs" style={{ color: "var(--color-muted)" }}>
          {hint}
        </div>
      )}
    </div>
  );
}

export default async function AdminDashboard() {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - 7);

  const [todayByStatus, weekCount, activeProducts, topViewed, latestBookings] = await Promise.all([
    db.booking.groupBy({ by: ["status"], _count: { _all: true }, where: { createdAt: { gte: startOfDay } } }),
    db.booking.count({ where: { createdAt: { gte: startOfWeek } } }),
    db.product.count({ where: { status: "ACTIVE" } }),
    db.product.findMany({ orderBy: { viewCount: "desc" }, take: 5, select: { id: true, nameUz: true, slug: true, viewCount: true, price: true } }),
    db.booking.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { product: { select: { nameUz: true } } } }),
  ]);

  const counts: Record<string, number> = {};
  for (const r of todayByStatus) counts[r.status] = r._count._all;
  const todayTotal = Object.values(counts).reduce((a, b) => a + b, 0);

  const statusUz: Record<string, string> = {
    NEW: "Yangi",
    CONFIRMED: "Tasdiqlangan",
    CONTACTED: "Bog'lanilgan",
    COMPLETED: "Yakunlangan",
    CANCELLED: "Bekor",
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold">Boshqaruv paneli</h1>
      <div className="seam mt-3 w-24" aria-hidden="true" />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Bugungi bronlar" value={todayTotal} hint={`Yangi: ${counts.NEW ?? 0}`} />
        <StatCard label="Hafta bronlari" value={weekCount} hint="So'nggi 7 kun" />
        <StatCard label="Aktiv mahsulotlar" value={activeProducts} />
        <StatCard label="Tasdiqlangan (bugun)" value={counts.CONFIRMED ?? 0} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="card p-5">
          <h2 className="text-lg font-semibold">Eng ko'p ko'rilgan mahsulotlar</h2>
          <ul className="mt-3 divide-y" style={{ borderColor: "var(--color-line)" }}>
            {topViewed.length === 0 && <li className="py-3 text-sm" style={{ color: "var(--color-muted)" }}>Ma'lumot yo'q</li>}
            {topViewed.map((p) => (
              <li key={p.id} className="flex items-center justify-between py-2.5 text-sm">
                <Link href={`/admin/mahsulotlar/${p.id}`} className="truncate pr-3 hover:text-[var(--color-bronze)]">
                  {p.nameUz}
                </Link>
                <span className="shrink-0 tabular-nums" style={{ color: "var(--color-muted)" }}>
                  👁 {p.viewCount}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="card p-5">
          <h2 className="text-lg font-semibold">So'nggi bronlar</h2>
          <ul className="mt-3 divide-y" style={{ borderColor: "var(--color-line)" }}>
            {latestBookings.length === 0 && <li className="py-3 text-sm" style={{ color: "var(--color-muted)" }}>Bronlar yo'q</li>}
            {latestBookings.map((b) => (
              <li key={b.id} className="flex items-center justify-between py-2.5 text-sm">
                <div className="min-w-0 pr-3">
                  <div className="truncate font-medium">{b.product.nameUz}</div>
                  <div className="text-xs" style={{ color: "var(--color-muted)" }}>
                    {b.customerName} · {b.phone}
                  </div>
                </div>
                <span className="shrink-0 rounded-full px-2 py-0.5 text-xs" style={{ background: "var(--color-ivory-deep)" }}>
                  {statusUz[b.status]}
                </span>
              </li>
            ))}
          </ul>
          <Link href="/admin/bronlar" className="mt-3 inline-block text-sm font-semibold" style={{ color: "var(--color-bronze)" }}>
            Barcha bronlar →
          </Link>
        </section>
      </div>
    </div>
  );
}
