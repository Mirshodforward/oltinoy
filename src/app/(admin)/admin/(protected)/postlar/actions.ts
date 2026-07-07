"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";
import { postFormSchema } from "@/lib/schemas";
import { slugify, uniqueSlug } from "@/lib/slug";

function revalidateBlog(slug?: string) {
  revalidatePath("/blog");
  if (slug) revalidatePath(`/blog/${slug}`);
  revalidatePath("/admin/postlar");
}

export async function savePost(raw: unknown): Promise<{ ok: boolean; id?: number; error?: string }> {
  await requireAdmin();
  const payload = raw as { id?: number } & Record<string, unknown>;
  const parsed = postFormSchema.safeParse(payload);
  if (!parsed.success) return { ok: false, error: parsed.error.issues.map((i) => i.path.join(".")).join(", ") };
  const data = parsed.data;

  const id = payload.id ? Number(payload.id) : null;
  let slug = data.slug ? slugify(data.slug) : "";
  if (!slug) slug = uniqueSlug(data.titleUz);
  const clash = await db.post.findUnique({ where: { slug } });
  if (clash && clash.id !== id) slug = uniqueSlug(data.titleUz);

  const publishedAt = data.isPublished ? new Date() : null;

  try {
    if (id) {
      const current = await db.post.findUnique({ where: { id } });
      await db.post.update({
        where: { id },
        data: {
          slug,
          titleUz: data.titleUz,
          titleRu: data.titleRu,
          excerptUz: data.excerptUz,
          excerptRu: data.excerptRu,
          contentUz: data.contentUz,
          contentRu: data.contentRu,
          coverImage: data.coverImage,
          isPublished: data.isPublished,
          // Keep the original publish date if it was already published.
          publishedAt: data.isPublished ? current?.publishedAt ?? publishedAt : null,
        },
      });
      revalidateBlog(current?.slug);
      revalidateBlog(slug);
      return { ok: true, id };
    }
    const created = await db.post.create({
      data: {
        slug,
        titleUz: data.titleUz,
        titleRu: data.titleRu,
        excerptUz: data.excerptUz,
        excerptRu: data.excerptRu,
        contentUz: data.contentUz,
        contentRu: data.contentRu,
        coverImage: data.coverImage,
        isPublished: data.isPublished,
        publishedAt,
      },
    });
    revalidateBlog(slug);
    return { ok: true, id: created.id };
  } catch (err) {
    console.error("[admin] savePost:", err);
    return { ok: false, error: "Saqlashda xatolik" };
  }
}

export async function deletePost(id: number) {
  await requireAdmin();
  const p = await db.post.findUnique({ where: { id }, select: { slug: true } });
  await db.post.delete({ where: { id } });
  revalidateBlog(p?.slug);
}
