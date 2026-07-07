"use server";

import { revalidatePath } from "next/cache";
import { revalidateTag } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";
import { categoryFormSchema } from "@/lib/schemas";
import { slugify } from "@/lib/slug";

function revalidateAll() {
  revalidateTag("products");
  revalidatePath("/", "layout");
  revalidatePath("/katalog");
  revalidatePath("/admin/kategoriyalar");
}

export async function saveCategory(raw: unknown): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  const payload = raw as { id?: number } & Record<string, unknown>;
  const parsed = categoryFormSchema.safeParse(payload);
  if (!parsed.success) return { ok: false, error: "Validatsiya xatosi" };
  const data = { ...parsed.data, slug: slugify(parsed.data.slug) };
  if (!data.slug) return { ok: false, error: "Slug noto'g'ri" };

  const id = payload.id ? Number(payload.id) : null;
  try {
    const clash = await db.category.findUnique({ where: { slug: data.slug } });
    if (clash && clash.id !== id) return { ok: false, error: "Bu slug band" };

    if (id) {
      await db.category.update({ where: { id }, data });
    } else {
      await db.category.create({ data });
    }
    revalidateAll();
    return { ok: true };
  } catch (err) {
    console.error("[admin] saveCategory:", err);
    return { ok: false, error: "Saqlashda xatolik" };
  }
}

export async function deleteCategory(id: number): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  const count = await db.product.count({ where: { categoryId: id } });
  if (count > 0) return { ok: false, error: `Kategoriyada ${count} ta mahsulot bor — avval ularni ko'chiring` };
  await db.category.delete({ where: { id } });
  revalidateAll();
  return { ok: true };
}
