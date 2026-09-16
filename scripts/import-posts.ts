/**
 * Blog maqolalarini bazaga yozadi — seed'dan farqli o'laroq, faqat postlarga
 * tegadi va hech narsani o'chirmaydi.
 *
 *   npx tsx --env-file=.env scripts/import-posts.ts            # muddati kelganini nashr qiladi
 *   npx tsx --env-file=.env scripts/import-posts.ts --dry-run  # faqat ko'rsatadi
 *   npx tsx --env-file=.env scripts/import-posts.ts --all      # hammasini darhol nashr qiladi
 *
 * Nega shunday: blog sahifasi faqat isPublished bo'yicha filtrlaydi, sanaga
 * qaramaydi. Ya'ni kelasi sana bilan yozilgan post ham darhol ko'rinib ketadi.
 * Shuning uchun nashr qilish shu yerda hal qilinadi — sanasi kelmagan maqola
 * qoralama bo'lib turadi. Skriptni haftada bir marta ishga tushirish yetarli
 * (seo-keywordlar-50.md: 20 ta maqolani bir kunda chiqarish Google uchun
 * "scaled content abuse" signali).
 */
import { PrismaClient } from "@prisma/client";
import { POSTS_SEO_20 } from "../prisma/posts-seo-20";
import { POSTS_SEO_20_REST } from "../prisma/posts-seo-20-rest";
import { POSTS_SEO_20_AUTUMN } from "../prisma/posts-seo-20-autumn";

const db = new PrismaClient();
const dryRun = process.argv.includes("--dry-run");
const publishAll = process.argv.includes("--all");

const ALL = [...POSTS_SEO_20, ...POSTS_SEO_20_REST, ...POSTS_SEO_20_AUTUMN];
const now = new Date();

let created = 0;
let published = 0;
let drafts = 0;

for (const post of ALL) {
  const publishedAt = new Date(post.publishedAt);
  const isDue = publishAll || publishedAt <= now;

  if (dryRun) {
    const existing = await db.post.findUnique({ where: { slug: post.slug }, select: { id: true } });
    console.log(`  ${isDue ? "nashr" : "qoralama"}  ${existing ? "mavjud" : "YANGI "}  ${post.publishedAt}  ${post.slug}`);
    isDue ? published++ : drafts++;
    if (!existing) created++;
    continue;
  }

  const fields = {
    titleUz: post.titleUz,
    titleRu: post.titleRu,
    excerptUz: post.excerptUz,
    excerptRu: post.excerptRu,
    contentUz: post.contentUz,
    contentRu: post.contentRu,
    isPublished: isDue,
    publishedAt: isDue ? publishedAt : null,
  };

  const before = await db.post.findUnique({ where: { slug: post.slug }, select: { id: true } });
  await db.post.upsert({ where: { slug: post.slug }, create: { slug: post.slug, ...fields }, update: fields });

  if (!before) created++;
  isDue ? published++ : drafts++;
}

console.log(`\n${dryRun ? "[dry-run] " : ""}${ALL.length} maqola · ${created} yangi · ${published} nashrda · ${drafts} qoralama`);
if (!dryRun) {
  console.log("bazada jami:", await db.post.count(), "maqola,", await db.post.count({ where: { isPublished: true } }), "nashrda");
}
await db.$disconnect();
