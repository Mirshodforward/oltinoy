import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";

/** Shared select shape for product cards (matches ProductCardData). */
export const productCardSelect = {
  slug: true,
  nameUz: true,
  nameRu: true,
  price: true,
  oldPrice: true,
  sizes: true,
  status: true,
  isNew: true,
  category: { select: { nameUz: true, nameRu: true } },
  // Two images: the card cross-fades to the second on hover — in fashion the
  // back/detail shot is what actually sells the model.
  images: {
    orderBy: { sortOrder: "asc" as const },
    take: 2,
    select: { fileName: true, altUz: true, altRu: true },
  },
} satisfies Prisma.ProductSelect;

/** Latest ACTIVE products for the home "Yangi kolleksiya" strip. */
export async function getLatestProducts(limit = 8) {
  try {
    return await db.product.findMany({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: productCardSelect,
    });
  } catch {
    return [];
  }
}

export async function getActiveCategories() {
  try {
    return await db.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { products: { where: { status: { not: "HIDDEN" } } } } } },
    });
  } catch {
    return [];
  }
}

/**
 * Categories for the catalogue rail. Deliberately lighter than
 * `getActiveCategories` — the rail shows no counts, so it skips the join.
 */
export async function getRailCategories() {
  try {
    return await db.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      select: { id: true, slug: true, nameUz: true, nameRu: true },
    });
  } catch {
    return [];
  }
}
