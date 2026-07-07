import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { productCardSelect } from "@/lib/queries";

export const PAGE_SIZE = 24;
export const SORTS = ["newest", "price_asc", "price_desc", "popular"] as const;
export type Sort = (typeof SORTS)[number];

export type CatalogSearchParams = {
  size?: string;
  min?: string;
  max?: string;
  sort?: string;
  q?: string;
  page?: string;
};

export type ParsedFilters = {
  size: string | null;
  min: number | null;
  max: number | null;
  sort: Sort;
  q: string | null;
  page: number;
  /** true if any indexable-affecting filter/search/page param is set */
  hasActiveFilters: boolean;
};

export function parseFilters(sp: CatalogSearchParams): ParsedFilters {
  const size = sp.size?.trim() || null;
  const min = sp.min && /^\d+$/.test(sp.min) ? parseInt(sp.min, 10) : null;
  const max = sp.max && /^\d+$/.test(sp.max) ? parseInt(sp.max, 10) : null;
  const sort = (SORTS as readonly string[]).includes(sp.sort ?? "") ? (sp.sort as Sort) : "newest";
  const q = sp.q?.trim().slice(0, 60) || null;
  const page = sp.page && /^\d+$/.test(sp.page) ? Math.max(1, parseInt(sp.page, 10)) : 1;
  const hasActiveFilters = Boolean(size || min !== null || max !== null || q || (sp.sort && sort !== "newest") || page > 1);
  return { size, min, max, sort, q, page, hasActiveFilters };
}

function orderBy(sort: Sort): Prisma.ProductOrderByWithRelationInput {
  switch (sort) {
    case "price_asc":
      return { price: "asc" };
    case "price_desc":
      return { price: "desc" };
    case "popular":
      return { viewCount: "desc" };
    default:
      return { createdAt: "desc" };
  }
}

export async function queryCatalog(filters: ParsedFilters, categorySlug?: string) {
  // SOLD_OUT stays visible (labelled); HIDDEN never rendered.
  const where: Prisma.ProductWhereInput = {
    status: { in: ["ACTIVE", "SOLD_OUT"] },
    ...(categorySlug ? { category: { slug: categorySlug } } : {}),
    ...(filters.size ? { sizes: { has: filters.size } } : {}),
    ...(filters.min !== null || filters.max !== null
      ? { price: { ...(filters.min !== null ? { gte: filters.min } : {}), ...(filters.max !== null ? { lte: filters.max } : {}) } }
      : {}),
    ...(filters.q
      ? { OR: [{ nameUz: { contains: filters.q, mode: "insensitive" } }, { nameRu: { contains: filters.q, mode: "insensitive" } }] }
      : {}),
  };

  try {
    const [total, products] = await Promise.all([
      db.product.count({ where }),
      db.product.findMany({
        where,
        orderBy: orderBy(filters.sort),
        skip: (filters.page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        select: productCardSelect,
      }),
    ]);
    return { total, products, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
  } catch {
    return { total: 0, products: [], totalPages: 1 };
  }
}

/** Build a querystring from filters (omitting defaults) for pagination/links. */
export function buildQuery(filters: Partial<ParsedFilters>, overrides: Partial<{ page: number }> = {}): string {
  const p = new URLSearchParams();
  if (filters.size) p.set("size", filters.size);
  if (filters.min != null) p.set("min", String(filters.min));
  if (filters.max != null) p.set("max", String(filters.max));
  if (filters.sort && filters.sort !== "newest") p.set("sort", filters.sort);
  if (filters.q) p.set("q", filters.q);
  const page = overrides.page ?? filters.page;
  if (page && page > 1) p.set("page", String(page));
  const s = p.toString();
  return s ? `?${s}` : "";
}
