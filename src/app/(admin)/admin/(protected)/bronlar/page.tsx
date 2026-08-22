import type { ReactNode } from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatPrice, formatDateTime, displayPhone } from "@/lib/format";
import { BookingRow } from "@/components/admin/BookingRow";
import { Inbox, Phone, Sliders, Telegram } from "@/components/ui/icons";
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

/** Sticky small-caps header cell on the cream band. */
function Th({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <th
      scope="col"
      className={`sticky top-0 z-10 whitespace-nowrap border-b px-4 py-3 text-left text-2xs font-bold uppercase tracking-[0.14em] ${className}`}
      style={{ background: "var(--color-cream)", color: "var(--fg-muted)", borderColor: "var(--line)" }}
    >
      {children}
    </th>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`badge ${STATUS_BADGE[status] ?? "badge-soft"}`} style={{ color: STATUS_TINT[status] }}>
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}

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
      {/* ───────────────────────── Header ───────────────────────── */}
      <header className="max-w-2xl">
        <h1 className="text-3xl">Bronlar</h1>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--fg-muted)" }}>
          Mijozlarning so'nggi bronlari — holatini o'zgartiring va izoh qoldiring.
        </p>
      </header>
      <div className="seam mt-6" aria-hidden="true" />

      {/* ───────────────────── Status filter ───────────────────── */}
      <nav aria-label="Holat bo'yicha filtr" className="mt-6 flex flex-wrap items-center gap-2">
        <Sliders size={17} aria-hidden="true" style={{ color: "var(--color-gold-dk)" }} />
        {STATUSES.map((s) => {
          const isActive = active === s;
          return (
            <Link
              key={s}
              href={s === "ALL" ? "/admin/bronlar" : `/admin/bronlar?status=${s}`}
              className="chip"
              data-active={isActive ? "true" : undefined}
              aria-current={isActive ? "page" : undefined}
            >
              {STATUS_LABEL[s]}
            </Link>
          );
        })}
      </nav>

      {bookings.length === 0 ? (
        <div className="card mt-6 px-6 py-16 text-center">
          <Inbox size={30} className="mx-auto text-gold" />
          <p className="mx-auto mt-4 max-w-md text-sm" style={{ color: "var(--fg-muted)" }}>
            Bronlar topilmadi.
          </p>
        </div>
      ) : (
        <>
          {/* ─────────────── Table (md+) — scrolls inside its card ─────────────── */}
          <div className="card mt-6 hidden md:block">
            <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Bronlar jadvali">
              <table className="w-full min-w-[900px] border-collapse text-sm">
                <thead>
                  <tr>
                    <Th className="w-16">#</Th>
                    <Th>Sana</Th>
                    <Th>Mahsulot</Th>
                    <Th>O'lcham/soni</Th>
                    <Th>Mijoz</Th>
                    <Th className="w-56">Holat / Izoh</Th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr
                      key={b.id}
                      className="border-t align-top transition-colors duration-200 hover:bg-cream/60"
                      style={{ borderColor: "var(--line)" }}
                    >
                      <td className="px-4 py-3 tabular-nums" style={{ color: "var(--fg-muted)" }}>
                        B-{b.id}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-xs tabular-nums" style={{ color: "var(--fg-muted)" }}>
                        {formatDateTime(b.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/mahsulot/${b.product.slug}`}
                          target="_blank"
                          className="font-semibold transition-colors duration-200 hover:text-gold-dk"
                        >
                          {b.product.nameUz}
                        </Link>
                        <div className="price mt-0.5 text-xs" style={{ color: "var(--fg-muted)" }}>
                          {formatPrice(b.product.price * b.quantity)}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 tabular-nums">
                        {b.size} · {b.quantity} dona
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold">{b.customerName}</div>
                        <a
                          href={`tel:${b.phone}`}
                          className="text-xs tabular-nums transition-colors duration-200 hover:text-gold-dk"
                          style={{ color: "var(--fg-muted)" }}
                        >
                          {displayPhone(b.phone)}
                        </a>
                        {b.tgUsername && (
                          <div>
                            <a
                              href={`https://t.me/${b.tgUsername}`}
                              target="_blank"
                              rel="noopener"
                              className="inline-flex items-center gap-1 text-xs font-semibold"
                              style={{ color: "var(--color-gold-dk)" }}
                            >
                              <Telegram size={13} />@{b.tgUsername}
                            </a>
                          </div>
                        )}
                        {b.note && (
                          <p className="mt-1 max-w-[16rem] text-xs italic" style={{ color: "var(--fg-subtle)" }}>
                            “{b.note}”
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="mb-2">
                          <StatusBadge status={b.status} />
                        </div>
                        <BookingRow id={b.id} status={b.status} adminNote={b.adminNote} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ─────────────── Same rows, stacked (phones) ─────────────── */}
          <ul className="mt-6 space-y-3 md:hidden">
            {bookings.map((b) => (
              <li key={b.id} className="card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="text-xs tabular-nums" style={{ color: "var(--fg-muted)" }}>
                    B-{b.id} · {formatDateTime(b.createdAt)}
                  </div>
                  <StatusBadge status={b.status} />
                </div>

                <Link
                  href={`/mahsulot/${b.product.slug}`}
                  target="_blank"
                  className="mt-2 block font-semibold leading-snug"
                >
                  {b.product.nameUz}
                </Link>
                <p className="mt-1 text-sm tabular-nums" style={{ color: "var(--fg-muted)" }}>
                  {b.size} · {b.quantity} dona ·{" "}
                  <span className="price text-sm" style={{ color: "var(--fg)" }}>
                    {formatPrice(b.product.price * b.quantity)}
                  </span>
                </p>

                <div className="hairline my-3" />

                <p className="font-semibold">{b.customerName}</p>
                <div className="flex flex-wrap items-center gap-x-4">
                  <a
                    href={`tel:${b.phone}`}
                    className="inline-flex min-h-11 items-center gap-1.5 text-sm tabular-nums"
                    style={{ color: "var(--fg-muted)" }}
                  >
                    <Phone size={15} />
                    {displayPhone(b.phone)}
                  </a>
                  {b.tgUsername && (
                    <a
                      href={`https://t.me/${b.tgUsername}`}
                      target="_blank"
                      rel="noopener"
                      className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold"
                      style={{ color: "var(--color-gold-dk)" }}
                    >
                      <Telegram size={15} />@{b.tgUsername}
                    </a>
                  )}
                </div>
                {b.note && (
                  <p className="text-sm italic" style={{ color: "var(--fg-subtle)" }}>
                    “{b.note}”
                  </p>
                )}

                <div className="hairline my-3" />

                <BookingRow id={b.id} status={b.status} adminNote={b.adminNote} />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
