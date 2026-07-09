"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";
import { productFormSchema } from "@/lib/schemas";
import { uniqueSlug, slugify } from "@/lib/slug";
import { deleteProductImage } from "@/lib/images-server";
import { postProductToChannel } from "@/lib/telegram";
import { getSettings } from "@/lib/settings";
import type { ProductStatus } from "@prisma/client";

function revalidateProducts(slug?: string) {
  revalidateTag("products");
  revalidatePath("/", "layout");
  revalidatePath("/katalog");
  if (slug) revalidatePath(`/mahsulot/${slug}`);
}

export type ProductActionState = { error?: string; ok?: boolean };

/** Load product + settings and post to Telegram channel. */
async function publishProductToChannel(
  id: number,
  force: boolean,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const product = await db.product.findUnique({
    where: { id },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      category: { select: { nameUz: true } },
    },
  });
  if (!product) return { ok: false, error: "Mahsulot topilmadi" };
  if (product.tgMessageIds.length > 0 && !force) {
    return { ok: false, error: "Allaqachon kanalga joylangan" };
  }
  if (product.images.length === 0) {
    return { ok: false, error: "Kamida bitta rasm kerak" };
  }
  if (product.status === "HIDDEN") {
    return { ok: false, error: "Yashirin mahsulot kanalga joylanmaydi" };
  }

  const settings = await getSettings();
  try {
    const ids = await postProductToChannel({
      nameUz: product.nameUz,
      categoryName: product.category.nameUz,
      materialUz: product.materialUz,
      price: product.price,
      oldPrice: product.oldPrice,
      sizes: product.sizes,
      minOrderQty: product.minOrderQty,
      slug: product.slug,
      phone: settings.phone,
      sku: product.sku,
      imageFileNames: product.images.map((i) => i.fileName),
    });
    await db.product.update({ where: { id }, data: { tgMessageIds: ids } });
    return { ok: true };
  } catch (err) {
    console.error("[admin] channel post failed:", err);
    return { ok: false, error: "Kanalga joylashda xatolik (bot kanal admini ekanini tekshiring)" };
  }
}

/** Create or update a product from the admin form (JSON payload). */
export async function saveProduct(raw: unknown): Promise<
  | { ok: true; id: number; slug: string; channelPosted?: boolean; channelError?: string }
  | { ok: false; error: string }
> {
  await requireAdmin();
  const payload = raw as { id?: number } & Record<string, unknown>;
  const parsed = productFormSchema.safeParse(payload);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((i) => i.path.join(".")).join(", ") || "Validatsiya xatosi" };
  }
  const data = parsed.data;

  // Verify category exists.
  const cat = await db.category.findUnique({ where: { id: data.categoryId } });
  if (!cat) return { ok: false, error: "Kategoriya topilmadi" };

  const id = payload.id ? Number(payload.id) : null;

  // Slug: keep provided (slugified) or generate a unique one; never collide.
  let slug = data.slug ? slugify(data.slug) : "";
  if (!slug) slug = uniqueSlug(data.nameUz);
  const existing = await db.product.findUnique({ where: { slug } });
  if (existing && existing.id !== id) slug = uniqueSlug(data.nameUz);

  try {
    if (id) {
      // Update: replace images (delete removed files).
      const current = await db.product.findUnique({ where: { id }, include: { images: true } });
      if (!current) return { ok: false, error: "Mahsulot topilmadi" };

      const keptFileNames = new Set(data.images.map((i) => i.fileName));
      const removed = current.images.filter((img) => !keptFileNames.has(img.fileName));
      await Promise.all(removed.map((img) => deleteProductImage(img.fileName)));

      await db.$transaction([
        db.productImage.deleteMany({ where: { productId: id } }),
        db.product.update({
          where: { id },
          data: {
            nameUz: data.nameUz,
            nameRu: data.nameRu,
            slug,
            sku: data.sku,
            descriptionUz: data.descriptionUz,
            descriptionRu: data.descriptionRu,
            materialUz: data.materialUz,
            materialRu: data.materialRu,
            price: data.price,
            oldPrice: data.oldPrice ?? null,
            sizes: data.sizes,
            minOrderQty: data.minOrderQty,
            categoryId: data.categoryId,
            status: data.status,
            isNew: data.isNew,
            images: {
              create: data.images.map((img, i) => ({
                fileName: img.fileName,
                width: img.width,
                height: img.height,
                sortOrder: i,
                altUz: img.altUz ?? null,
                altRu: img.altRu ?? null,
              })),
            },
          },
        }),
      ]);
      revalidateProducts(current.slug);
      revalidateProducts(slug);
      return { ok: true, id, slug };
    }

    const created = await db.product.create({
      data: {
        nameUz: data.nameUz,
        nameRu: data.nameRu,
        slug,
        sku: data.sku,
        descriptionUz: data.descriptionUz,
        descriptionRu: data.descriptionRu,
        materialUz: data.materialUz,
        materialRu: data.materialRu,
        price: data.price,
        oldPrice: data.oldPrice ?? null,
        sizes: data.sizes,
        minOrderQty: data.minOrderQty,
        categoryId: data.categoryId,
        status: data.status,
        isNew: data.isNew,
        images: {
          create: data.images.map((img, i) => ({
            fileName: img.fileName,
            width: img.width,
            height: img.height,
            sortOrder: i,
            altUz: img.altUz ?? null,
            altRu: img.altRu ?? null,
          })),
        },
      },
    });
    revalidateProducts(slug);

    // Yangi mahsulot — rasm bo'lsa avtomatik kanalga joylash (Mini App / admin panel).
    let channelPosted: boolean | undefined;
    let channelError: string | undefined;
    if (data.images.length > 0 && data.status !== "HIDDEN") {
      const posted = await publishProductToChannel(created.id, false);
      if (posted.ok) {
        channelPosted = true;
      } else {
        channelError = posted.error;
      }
    }

    return { ok: true, id: created.id, slug, channelPosted, channelError };
  } catch (err) {
    console.error("[admin] saveProduct failed:", err);
    return { ok: false, error: "Saqlashda xatolik" };
  }
}

export async function setProductStatus(id: number, status: ProductStatus) {
  await requireAdmin();
  const p = await db.product.update({ where: { id }, data: { status }, select: { slug: true } });
  revalidateProducts(p.slug);
}

export async function deleteProduct(id: number) {
  await requireAdmin();
  const product = await db.product.findUnique({ where: { id }, include: { images: true } });
  if (!product) return;
  await Promise.all(product.images.map((img) => deleteProductImage(img.fileName)));
  await db.product.delete({ where: { id } });
  revalidateProducts(product.slug);
  redirect("/admin/mahsulotlar");
}

/** §8.3 — post the product to the Telegram channel; store returned message ids. */
export async function postProductChannel(id: number, force = false): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  const result = await publishProductToChannel(id, force);
  return result.ok ? { ok: true } : { ok: false, error: result.error };
}
