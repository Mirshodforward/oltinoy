import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PostForm, type PostInitial } from "@/components/admin/PostForm";
import { ArrowLeft } from "@/components/ui/icons";

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const postId = Number(id);
  if (!Number.isInteger(postId)) notFound();
  const post = await db.post.findUnique({ where: { id: postId } });
  if (!post) notFound();

  const initial: PostInitial = {
    id: post.id,
    slug: post.slug,
    titleUz: post.titleUz,
    titleRu: post.titleRu,
    excerptUz: post.excerptUz,
    excerptRu: post.excerptRu,
    contentUz: post.contentUz,
    contentRu: post.contentRu,
    coverImage: post.coverImage,
    isPublished: post.isPublished,
  };

  return (
    <div className="max-w-4xl">
      {/* ───────────────────────── Header ───────────────────────── */}
      <Link
        href="/admin/postlar"
        className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold"
        style={{ color: "var(--color-gold-dk)" }}
      >
        <ArrowLeft size={16} />
        Postlar
      </Link>

      <header className="mt-1 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <h1 className="text-3xl">{post.titleUz}</h1>
          <p className="mt-3 text-sm" style={{ color: "var(--fg-muted)" }}>
            /blog/{post.slug}
          </p>
        </div>
        <span className={`badge ${post.isPublished ? "badge-new" : "badge-soft"} shrink-0 self-start md:self-auto`}>
          {post.isPublished ? "LIVE" : "DRAFT"}
        </span>
      </header>
      <div className="seam mt-6" aria-hidden="true" />

      <div className="mt-8">
        <PostForm initial={initial} />
      </div>
    </div>
  );
}
