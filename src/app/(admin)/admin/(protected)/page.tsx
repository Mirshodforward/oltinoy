import type { ReactElement } from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import {
  ArrowRight,
  Bag,
  CheckCircle,
  Eye,
  Inbox,
  Moon,
  Plus,
  TrendingUp,
  type IconProps,
} from "@/components/ui/icons";

export const dynamic = "force-dynamic";

const STATUS_UZ: Record<string, string> = {
  NEW: "Yangi",
  CONFIRMED: "Tasdiqlangan",
  CONTACTED: "Bog'lanilgan",
  COMPLETED: "Yakunlangan",
  CANCELLED: "Bekor",
};

/** Gold for the fresh ones, ink for the closed ones, soft for everything between. */
const STATUS_BADGE: Record<string, string> = {
  NEW: "badge-new",
  CONFIRMED: "badge-soft",
  CONTACTED: "badge-soft",
  COMPLETED: "badge-sold",
  CANCELLED: "badge-soft",
};

const STATUS_TINT: Record<string, string | undefined> = {
  CONFIRMED: "var(--color-sage)",
  CANCELLED: "var(--color-danger)",
};

/**
 * One measurement: the number set in the display face (the same treatment the
 * storefront gives a price), a small-caps label, the glyph in a soft cream disc
 * and the seam stitched across the top edge of the tile.
 */
function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: (p: IconProps) => ReactElement;
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="card p-5">
      <span className="seam absolute inset-x-0 top-0" aria-hidden="true" />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-2xs font-bold uppercase tracking-[0.16em]" style={{ color: "var(--fg-muted)" }}>
            {label}
          </p>
          <p className="price mt-2 text-3xl">{value}</p>
          {hint && (
            <p className="mt-1 text-xs" style={{ color: "var(--fg-subtle)" }}>
              {hint}
            </p>
          )}
        </div>
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
          style={{ background: "var(--color-cream)", color: "var(--color-gold-dk)" }}
        >
          <Icon size={19} />
        </span>
      </div>
    </div>
  );
}

/** Inside an already-bordered card an empty list is a centred moon plus a line. */
function EmptyLine({ text }: { text: string }) {
  return (
    <div className="py-10 text-center">
      <Moon size={26} className="mx-auto text-gold" />
      <p className="mt-3 text-sm" style={{ color: "var(--fg-muted)" }}>
        {text}
      </p>
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

  return (
    <div>
      {/* ───────────────────────── Header ───────────────────────── */}
      <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <h1 className="text-3xl">Boshqaruv paneli</h1>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--fg-muted)" }}>
            Bugungi bronlar, haftalik dinamika va eng ko'p ko'rilgan modellar.
          </p>
        </div>
        <Link href="/admin/mahsulotlar/yangi" className="btn btn-primary">
          <Plus size={17} />
          Yangi mahsulot
        </Link>
      </header>
      <div className="seam mt-6" aria-hidden="true" />

      {/* ───────────────────────── Measurements ───────────────────────── */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Inbox} label="Bugungi bronlar" value={todayTotal} hint={`Yangi: ${counts.NEW ?? 0}`} />
        <StatCard icon={TrendingUp} label="Hafta bronlari" value={weekCount} hint="So'nggi 7 kun" />
        <StatCard icon={Bag} label="Aktiv mahsulotlar" value={activeProducts} />
        <StatCard icon={CheckCircle} label="Tasdiqlangan (bugun)" value={counts.CONFIRMED ?? 0} />
      </div>

      {/* ──────────────────── Two lists, side by side ──────────────────── */}
      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <section className="card p-5 md:p-6">
          <div className="flex items-center gap-2.5">
            <TrendingUp size={18} style={{ color: "var(--color-gold-dk)" }} />
            <h2 className="text-xl">Eng ko'p ko'rilgan mahsulotlar</h2>
          </div>
          <div className="hairline mt-4" />

          {topViewed.length === 0 ? (
            <EmptyLine text="Ma'lumot yo'q" />
          ) : (
            <ul className="divide-y" style={{ borderColor: "var(--line)" }}>
              {topViewed.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <Link
                      href={`/admin/mahsulotlar/${p.id}`}
                      className="block truncate text-sm font-semibold transition-colors duration-200 hover:text-gold-dk"
                    >
                      {p.nameUz}
                    </Link>
                    <span className="price text-xs" style={{ color: "var(--fg-muted)" }}>
                      {formatPrice(p.price)}
                    </span>
                  </div>
                  <span
                    className="inline-flex shrink-0 items-center gap-1.5 text-sm tabular-nums"
                    style={{ color: "var(--fg-muted)" }}
                  >
                    <Eye size={15} title="Ko'rishlar" />
                    {p.viewCount}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card p-5 md:p-6">
          <div className="flex items-center gap-2.5">
            <Inbox size={18} style={{ color: "var(--color-gold-dk)" }} />
            <h2 className="text-xl">So'nggi bronlar</h2>
          </div>
          <div className="hairline mt-4" />

          {latestBookings.length === 0 ? (
            <EmptyLine text="Bronlar yo'q" />
          ) : (
            <ul className="divide-y" style={{ borderColor: "var(--line)" }}>
              {latestBookings.map((b) => (
                <li key={b.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{b.product.nameUz}</p>
                    <p className="truncate text-xs" style={{ color: "var(--fg-muted)" }}>
                      {b.customerName} · {b.phone}
                    </p>
                  </div>
                  <span
                    className={`badge ${STATUS_BADGE[b.status] ?? "badge-soft"} shrink-0`}
                    style={{ color: STATUS_TINT[b.status] }}
                  >
                    {STATUS_UZ[b.status]}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <div className="hairline mt-2" />
          <Link href="/admin/bronlar" className="link-seam mt-4 inline-flex items-center gap-1.5 text-sm">
            Barcha bronlar
            <ArrowRight size={16} />
          </Link>
        </section>
      </div>
    </div>
  );
}
