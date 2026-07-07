import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PostForm, type PostInitial } from "@/components/admin/PostForm";

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
      <Link href="/admin/postlar" className="text-sm" style={{ color: "var(--color-bronze)" }}>
        ← Postlar
      </Link>
      <h1 className="mt-2 text-2xl font-semibold">{post.titleUz}</h1>
      <div className="seam mt-3 w-24" aria-hidden="true" />
      <div className="mt-6">
        <PostForm initial={initial} />
      </div>
    </div>
  );
}
