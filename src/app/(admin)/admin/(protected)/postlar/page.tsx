import Link from "next/link";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  const posts = await db.post.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Blog postlar</h1>
          <div className="seam mt-3 w-24" aria-hidden="true" />
        </div>
        <Link href="/admin/postlar/yangi" className="btn btn-primary">
          ＋ Yangi post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="card mt-6 py-16 text-center text-sm" style={{ color: "var(--color-muted)" }}>
          Postlar yo'q.
        </div>
      ) : (
        <ul className="mt-6 space-y-2">
          {posts.map((p) => (
            <li key={p.id} className="card flex items-center justify-between p-4">
              <div>
                <Link href={`/admin/postlar/${p.id}`} className="font-medium hover:text-[var(--color-bronze)]">
                  {p.titleUz}
                </Link>
                <div className="text-xs" style={{ color: "var(--color-muted)" }}>
                  {p.isPublished ? `Chop etilgan · ${p.publishedAt ? formatDate(p.publishedAt) : ""}` : "Qoralama"}
                </div>
              </div>
              <span className="rounded-full px-2 py-0.5 text-xs" style={{ background: p.isPublished ? "var(--color-sage)" : "var(--color-ivory-deep)", color: p.isPublished ? "#fff" : "var(--color-muted)" }}>
                {p.isPublished ? "LIVE" : "DRAFT"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
