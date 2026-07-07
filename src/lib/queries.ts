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
  images: {
    orderBy: { sortOrder: "asc" as const },
    take: 1,
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
