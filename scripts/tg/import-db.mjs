/**
 * Katalogni bazaga yozadi. Serverda /var/www/oltinoy ichida ishlatiladi:
 *
 *   node --env-file=.env scripts/tg/import-db.mjs catalog.json manifest.json
 *
 * Rasm variantlari allaqachon uploads/products/ ichida bo'lishi kerak.
 */
import { readFileSync } from "node:fs";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();
const catalog = JSON.parse(readFileSync(process.argv[2], "utf8"));
const manifest = JSON.parse(readFileSync(process.argv[3], "utf8"));

const cats = Object.fromEntries((await db.category.findMany()).map((c) => [c.slug, c.id]));
console.log("kategoriyalar:", cats);

let created = 0, images = 0;
for (const p of catalog.products) {
  const categoryId = cats[p.category];
  if (!categoryId) { console.log(`  ⚠️ kategoriya yo'q: ${p.category} (${p.slug})`); continue; }

  const row = await db.product.upsert({
    where: { slug: p.slug },
    update: {
      sku: p.sku, nameUz: p.nameUz, nameRu: p.nameRu,
      descriptionUz: p.descriptionUz, descriptionRu: p.descriptionRu,
      materialUz: p.materialUz, materialRu: p.materialRu,
      price: p.price, oldPrice: p.oldPrice, sizes: p.sizes,
      minOrderQty: p.minOrderQty, categoryId, isNew: p.isNew, status: "ACTIVE",
      // Qaysi kanal postlaridan kelganini saqlaymiz — qayta import va
      // "bu model allaqachon saytdami?" savoli shu maydon orqali hal bo'ladi.
      tgMessageIds: p.tgMessageIds ?? [],
    },
    create: {
      slug: p.slug, sku: p.sku, nameUz: p.nameUz, nameRu: p.nameRu,
      descriptionUz: p.descriptionUz, descriptionRu: p.descriptionRu,
      materialUz: p.materialUz, materialRu: p.materialRu,
      price: p.price, oldPrice: p.oldPrice, sizes: p.sizes,
      minOrderQty: p.minOrderQty, categoryId, isNew: p.isNew, status: "ACTIVE",
      tgMessageIds: p.tgMessageIds ?? [],
    },
  });

  await db.productImage.deleteMany({ where: { productId: row.id } });
  const files = manifest[p.slug] || [];
  for (const [i, f] of files.entries()) {
    await db.productImage.create({
      data: {
        productId: row.id, fileName: f.fileName, width: f.width, height: f.height,
        sortOrder: i,
        altUz: `${p.nameUz} — Oltinoy Collection optom`,
        altRu: `${p.nameRu} — Oltinoy Collection оптом`,
      },
    });
    images++;
  }
  created++;
  console.log(`  [${p.rank}] ${p.slug} — ${files.length} rasm`);
}

const counts = {
  Product: await db.product.count(),
  ProductImage: await db.productImage.count(),
  Category: await db.category.count(),
  Post: await db.post.count(),
  Setting: await db.setting.count(),
};
console.log(`\n✅ ${created} mahsulot, ${images} rasm`);
console.log("baza:", counts);
await db.$disconnect();
