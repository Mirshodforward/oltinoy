import Link from "next/link";
import { db } from "@/lib/db";
import { formatPrice, formatDateTime, displayPhone } from "@/lib/format";
import { BookingRow } from "@/components/admin/BookingRow";
import type { BookingStatus, Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

const STATUSES: (BookingStatus | "ALL")[] = ["ALL", "NEW", "CONFIRMED", "CONTACTED", "COMPLETED", "CANCELLED"];
const STATUS_LABEL: Record<string, string> = {
  ALL: "Barchasi",
  NEW: "Yangi",
  CONFIRMED: "Tasdiqlangan",
  CONTACTED: "Bog'lanilgan",
  COMPLETED: "Yakunlangan",
  CANCELLED: "Bekor",
};

export default async function AdminBookingsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const active = STATUSES.includes(status as BookingStatus) ? (status as BookingStatus) : "ALL";
  const where: Prisma.BookingWhereInput = active === "ALL" ? {} : { status: active };

  const bookings = await db.booking.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { product: { select: { nameUz: true, slug: true, price: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold">Bronlar</h1>
      <div className="seam mt-3 w-24" aria-hidden="true" />

      <div className="mt-5 flex flex-wrap gap-1.5">
        {STATUSES.map((s) => {
          const isActive = active === s;
          return (
            <Link
              key={s}
              href={s === "ALL" ? "/admin/bronlar" : `/admin/bronlar?status=${s}`}
              className="rounded-full px-3 py-1.5 text-sm font-medium"
              style={{
                background: isActive ? "var(--color-ink)" : "#fff",
                color: isActive ? "var(--color-ivory)" : "var(--color-ink)",
                border: "1px solid var(--color-line)",
              }}
            >
              {STATUS_LABEL[s]}
            </Link>
          );
        })}
      </div>

      {bookings.length === 0 ? (
        <div className="card mt-6 py-16 text-center text-sm" style={{ color: "var(--color-muted)" }}>
          Bronlar topilmadi.
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse text-sm">
            <thead>
              <tr className="text-left" style={{ color: "var(--color-muted)" }}>
                <th className="p-2 font-semibold">#</th>
                <th className="p-2 font-semibold">Sana</th>
                <th className="p-2 font-semibold">Mahsulot</th>
                <th className="p-2 font-semibold">O'lcham/soni</th>
                <th className="p-2 font-semibold">Mijoz</th>
                <th className="p-2 font-semibold">Holat / Izoh</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-t align-top" style={{ borderColor: "var(--color-line)" }}>
                  <td className="p-2 tabular-nums">B-{b.id}</td>
                  <td className="p-2 text-xs" style={{ color: "var(--color-muted)" }}>{formatDateTime(b.createdAt)}</td>
                  <td className="p-2">
                    <Link href={`/mahsulot/${b.product.slug}`} target="_blank" className="font-medium hover:text-[var(--color-bronze)]">
                      {b.product.nameUz}
                    </Link>
                    <div className="text-xs" style={{ color: "var(--color-muted)" }}>
                      {formatPrice(b.product.price * b.quantity)}
                    </div>
                  </td>
                  <td className="p-2">
                    {b.size} · {b.quantity} dona
                  </td>
                  <td className="p-2">
                    <div className="font-medium">{b.customerName}</div>
                    <a href={`tel:${b.phone}`} className="text-xs hover:text-[var(--color-bronze)]" style={{ color: "var(--color-muted)" }}>
                      {displayPhone(b.phone)}
                    </a>
                    {b.tgUsername && (
                      <div className="text-xs">
                        <a href={`https://t.me/${b.tgUsername}`} target="_blank" rel="noopener" style={{ color: "var(--color-bronze)" }}>
                          @{b.tgUsername}
                        </a>
                      </div>
                    )}
                    {b.note && <div className="mt-0.5 text-xs italic" style={{ color: "var(--color-muted)" }}>“{b.note}”</div>}
                  </td>
                  <td className="p-2" style={{ minWidth: 180 }}>
                    <BookingRow id={b.id} status={b.status} adminNote={b.adminNote} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
