import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { SITE_URL } from "@/lib/seo";

function entry(path: string, lastModified?: Date, priority = 0.7): MetadataRoute.Sitemap[number] {
  const uz = path === "/" ? SITE_URL : `${SITE_URL}${path}`;
  const ru = path === "/" ? `${SITE_URL}/ru` : `${SITE_URL}/ru${path}`;
  return {
    url: uz,
    lastModified: lastModified ?? new Date(),
    changeFrequency: "weekly",
    priority,
    alternates: { languages: { uz, ru } },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = [
    entry("/", undefined, 1),
    entry("/katalog", undefined, 0.9),
    entry("/blog", undefined, 0.6),
    entry("/biz-haqimizda", undefined, 0.5),
    entry("/aloqa", undefined, 0.5),
  ];

  let categories: { slug: string }[] = [];
  let products: { slug: string; updatedAt: Date }[] = [];
  let posts: { slug: string; updatedAt: Date }[] = [];
  try {
    [categories, products, posts] = await Promise.all([
      db.category.findMany({ where: { isActive: true }, select: { slug: true } }),
      db.product.findMany({ where: { status: { in: ["ACTIVE", "SOLD_OUT"] } }, select: { slug: true, updatedAt: true } }),
      db.post.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
    ]);
  } catch {
    // DB unavailable at build — emit static entries only.
  }

  return [
    ...staticEntries,
    ...categories.map((c) => entry(`/katalog/${c.slug}`, undefined, 0.8)),
    ...products.map((p) => entry(`/mahsulot/${p.slug}`, p.updatedAt, 0.8)),
    ...posts.map((p) => entry(`/blog/${p.slug}`, p.updatedAt, 0.5)),
  ];
}
