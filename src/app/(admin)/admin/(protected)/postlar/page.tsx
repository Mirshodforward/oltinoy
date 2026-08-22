import type { ReactNode } from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { PenLine, Plus } from "@/components/ui/icons";

export const dynamic = "force-dynamic";

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

function StateBadge({ published }: { published: boolean }) {
  return <span className={`badge ${published ? "badge-new" : "badge-soft"}`}>{published ? "LIVE" : "DRAFT"}</span>;
}

/** Published date, or the word the editor uses for a post that never shipped. */
function whenLabel(isPublished: boolean, publishedAt: Date | null) {
  if (!isPublished) return "Qoralama";
  return publishedAt ? formatDate(publishedAt) : "Chop etilgan";
}

export default async function AdminPostsPage() {
  const posts = await db.post.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="max-w-5xl">
      {/* ───────────────────────── Header ───────────────────────── */}
      <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <h1 className="text-3xl">Blog postlar</h1>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--fg-muted)" }}>
            Blog maqolalari — qoralamalar va chop etilgan postlar bir ro'yxatda.
          </p>
        </div>
        <Link href="/admin/postlar/yangi" className="btn btn-primary">
          <Plus size={17} />
          Yangi post
        </Link>
      </header>
      <div className="seam mt-6" aria-hidden="true" />

      {posts.length === 0 ? (
        <div className="card mt-8 px-6 py-16 text-center">
          <PenLine size={30} className="mx-auto text-gold" />
          <p className="mx-auto mt-4 max-w-md text-sm" style={{ color: "var(--fg-muted)" }}>
            Postlar yo'q.
          </p>
          <Link href="/admin/postlar/yangi" className="btn btn-gold mt-6">
            <Plus size={17} />
            Yangi post
          </Link>
        </div>
      ) : (
        <>
          {/* ─────────────── Table (md+) — scrolls inside its card ─────────────── */}
          <div className="card mt-8 hidden md:block">
            <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Blog postlar jadvali">
              <table className="w-full min-w-[640px] border-collapse text-sm">
                <thead>
                  <tr>
                    <Th>Sarlavha</Th>
                    <Th className="w-28">Holat</Th>
                    <Th className="w-48">Sana</Th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((p) => (
                    <tr
                      key={p.id}
                      className="border-t transition-colors duration-200 hover:bg-cream/60"
                      style={{ borderColor: "var(--line)" }}
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/postlar/${p.id}`}
                          className="font-semibold transition-colors duration-200 hover:text-gold-dk"
                        >
                          {p.titleUz}
                        </Link>
                        <div className="mt-0.5 text-xs" style={{ color: "var(--fg-subtle)" }}>
                          /{p.slug}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <StateBadge published={p.isPublished} />
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 tabular-nums" style={{ color: "var(--fg-muted)" }}>
                        {whenLabel(p.isPublished, p.publishedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ─────────────── Same rows, stacked (phones) ─────────────── */}
          <ul className="mt-6 space-y-3 md:hidden">
            {posts.map((p) => (
              <li key={p.id} className="card p-4">
                <div className="flex items-start justify-between gap-3">
                  <Link href={`/admin/postlar/${p.id}`} className="font-semibold leading-snug">
                    {p.titleUz}
                  </Link>
                  <StateBadge published={p.isPublished} />
                </div>
                <p className="mt-1 text-xs tabular-nums" style={{ color: "var(--fg-muted)" }}>
                  {whenLabel(p.isPublished, p.publishedAt)} · /{p.slug}
                </p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
