import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { imageUrl, productImageLoader } from "@/lib/images";
import { ProductRowActions } from "@/components/admin/ProductRowActions";
import { Bag, Check, Eye, ImageIcon, Inbox, Plus } from "@/components/ui/icons";

export const dynamic = "force-dynamic";

const STATUS_UZ: Record<string, string> = {
  ACTIVE: "Sotuvda",
  SOLD_OUT: "Sotilgan",
  HIDDEN: "Yashirin",
};

const STATUS_BADGE: Record<string, string> = {
  ACTIVE: "badge-soft",
  SOLD_OUT: "badge-sold",
  HIDDEN: "badge-soft",
};

const STATUS_TINT: Record<string, string | undefined> = {
  ACTIVE: "var(--color-sage)",
};

/** Sticky small-caps header cell on the cream band. */
function Th({
  children,
  className = "",
  align = "left",
}: {
  children: ReactNode;
  className?: string;
  align?: "left" | "right";
}) {
  return (
    <th
      scope="col"
      className={`sticky top-0 z-10 whitespace-nowrap border-b px-4 py-3 text-2xs font-bold uppercase tracking-[0.14em] ${
        align === "right" ? "text-right" : "text-left"
      } ${className}`}
      style={{ background: "var(--color-cream)", color: "var(--fg-muted)", borderColor: "var(--line)" }}
    >
      {children}
    </th>
  );
}

/** Product thumbnail, or the cream placeholder when nothing is uploaded yet. */
function Thumb({ fileName }: { fileName?: string }) {
  return (
    <div
      className="relative h-14 w-11 shrink-0 overflow-hidden rounded-sm border"
      style={{ background: "var(--color-cream)", borderColor: "var(--line)" }}
    >
      {fileName ? (
        <Image
          loader={productImageLoader}
          src={imageUrl(fileName, "sm", "webp")}
          alt=""
          fill
          sizes="44px"
          className="object-cover"
        />
      ) : (
        <ImageIcon
          size={16}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ color: "var(--fg-subtle)" }}
        />
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`badge ${STATUS_BADGE[status] ?? "badge-soft"}`} style={{ color: STATUS_TINT[status] }}>
      {STATUS_UZ[status] ?? status}
    </span>
  );
}

/** Posted-to-channel marker: a sage check, or an em dash for "not yet". */
function ChannelMark({ posted }: { posted: boolean }) {
  return posted ? (
    <Check size={17} className="text-sage" title="Kanalga joylangan" />
  ) : (
    <span aria-hidden="true" style={{ color: "var(--fg-subtle)" }}>
      —
    </span>
  );
}

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
      {/* ───────────────────────── Header ───────────────────────── */}
      <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <h1 className="text-3xl">Mahsulotlar</h1>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--fg-muted)" }}>
            Katalogdagi barcha modellar — narx, ko'rishlar, bronlar va kanal holati.
          </p>
        </div>
        <Link href="/admin/mahsulotlar/yangi" className="btn btn-primary">
          <Plus size={17} />
          Yangi mahsulot
        </Link>
      </header>
      <div className="seam mt-6" aria-hidden="true" />

      {products.length === 0 ? (
        <div className="card mt-8 px-6 py-16 text-center">
          <Bag size={30} className="mx-auto text-gold" />
          <p className="mx-auto mt-4 max-w-md text-sm" style={{ color: "var(--fg-muted)" }}>
            Hozircha mahsulot yo'q. "Yangi mahsulot" tugmasini bosing.
          </p>
          <Link href="/admin/mahsulotlar/yangi" className="btn btn-gold mt-6">
            <Plus size={17} />
            Yangi mahsulot
          </Link>
        </div>
      ) : (
        <>
          {/* ─────────────── Table (md+) — scrolls inside its card ─────────────── */}
          <div className="card mt-8 hidden md:block">
            <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Mahsulotlar jadvali">
              <table className="w-full min-w-[880px] border-collapse text-sm">
                <thead>
                  <tr>
                    <Th className="w-16">Rasm</Th>
                    <Th>Nomi</Th>
                    <Th>Kategoriya</Th>
                    <Th align="right">Narx</Th>
                    <Th>
                      <Eye size={15} title="Ko'rishlar" />
                    </Th>
                    <Th>
                      <Inbox size={15} title="Bronlar" />
                    </Th>
                    <Th>Kanal</Th>
                    <Th>Amallar</Th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr
                      key={p.id}
                      className="border-t transition-colors duration-200 hover:bg-cream/60"
                      style={{ borderColor: "var(--line)" }}
                    >
                      <td className="px-4 py-3">
                        <Thumb fileName={p.images[0]?.fileName} />
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/mahsulotlar/${p.id}`}
                          className="font-semibold transition-colors duration-200 hover:text-gold-dk"
                        >
                          {p.nameUz}
                        </Link>
                        <div className="mt-1.5 flex flex-wrap items-center gap-2">
                          <StatusBadge status={p.status} />
                          {p.sku && (
                            <span className="text-xs tabular-nums" style={{ color: "var(--fg-subtle)" }}>
                              {p.sku}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3" style={{ color: "var(--fg-muted)" }}>
                        {p.category.nameUz}
                      </td>
                      <td className="price whitespace-nowrap px-4 py-3 text-right">{formatPrice(p.price)}</td>
                      <td className="px-4 py-3 tabular-nums" style={{ color: "var(--fg-muted)" }}>
                        {p.viewCount}
                      </td>
                      <td className="px-4 py-3 tabular-nums" style={{ color: "var(--fg-muted)" }}>
                        {p._count.bookings}
                      </td>
                      <td className="px-4 py-3">
                        <ChannelMark posted={p.tgMessageIds.length > 0} />
                      </td>
                      <td className="px-4 py-3">
                        <ProductRowActions id={p.id} status={p.status} slug={p.slug} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ─────────────── Same rows, stacked (phones) ─────────────── */}
          <ul className="mt-6 space-y-3 md:hidden">
            {products.map((p) => (
              <li key={p.id} className="card p-4">
                <div className="flex gap-3">
                  <Thumb fileName={p.images[0]?.fileName} />
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/admin/mahsulotlar/${p.id}`}
                      className="block font-semibold leading-snug hover:text-gold-dk"
                    >
                      {p.nameUz}
                    </Link>
                    <p className="mt-0.5 text-xs" style={{ color: "var(--fg-muted)" }}>
                      {p.category.nameUz}
                      {p.sku ? ` · ${p.sku}` : ""}
                    </p>
                    <p className="price mt-1.5 text-base">{formatPrice(p.price)}</p>
                  </div>
                  <StatusBadge status={p.status} />
                </div>

                <div className="hairline my-3" />

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-4 text-xs" style={{ color: "var(--fg-muted)" }}>
                    <span className="inline-flex items-center gap-1.5 tabular-nums">
                      <Eye size={15} title="Ko'rishlar" />
                      {p.viewCount}
                    </span>
                    <span className="inline-flex items-center gap-1.5 tabular-nums">
                      <Inbox size={15} title="Bronlar" />
                      {p._count.bookings}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      Kanal
                      <ChannelMark posted={p.tgMessageIds.length > 0} />
                    </span>
                  </div>
                  <ProductRowActions id={p.id} status={p.status} slug={p.slug} />
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
