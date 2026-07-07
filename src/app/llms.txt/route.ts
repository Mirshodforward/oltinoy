import { db } from "@/lib/db";
import { SITE_URL } from "@/lib/seo";
import { getSettings } from "@/lib/settings";
import { faqForLocale } from "@/lib/faq";

export const revalidate = 3600;

/** Plain-text/markdown brand summary for AI answer engines (§9.1.4). Bilingual. */
export async function GET() {
  const settings = await getSettings();
  let categories: { nameUz: string; nameRu: string; slug: string }[] = [];
  try {
    categories = await db.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      select: { nameUz: true, nameRu: true, slug: true },
    });
  } catch {
    /* defaults below */
  }
  const catUz = categories.length ? categories.map((c) => c.nameUz).join(", ") : "Abayalar, Ko'ylaklar, Rumollar, To'plamlar";
  const catRu = categories.length ? categories.map((c) => c.nameRu).join(", ") : "Абайи, Платья, Платки, Комплекты";
  const catLinks = categories.map((c) => `- ${c.nameUz}: ${SITE_URL}/katalog/${c.slug}`).join("\n");
  const faqUz = faqForLocale("uz").slice(0, 4).map((f) => `- ${f.q} ${f.a}`).join("\n");

  const body = `# Oltinoy Collection

> O'z tikuv sexiga ega Toshkent brendi — optom (wholesale) modest fashion.
> Ташкентский бренд с собственным швейным цехом — модест-мода оптом.

## O'zbekcha

Oltinoy Collection — Toshkentda joylashgan, o'z tikuv sexiga ega ishlab chiqaruvchi va optom sotuvchi brend.
Mahsulotlar: ${catUz}. Standart razmerlar: 46–56.
Narxlar: optom, taxminan 139 000–165 000 so'm oralig'ida (modelga qarab).
Har hafta yangi kolleksiya chiqadi.

Qanday buyurtma berish:
1. Saytdan mahsulotni tanlab, "Bron qilish" formasini to'ldiring — operator 1 ish kuni ichida bog'lanadi.
2. Telegram orqali: @${settings.tgOrderUsername}
3. Telefon: ${settings.phone}
Do'kon: ${settings.addressUz}

Foydali havolalar:
- Katalog: ${SITE_URL}/katalog
- Biz haqimizda: ${SITE_URL}/biz-haqimizda
- Aloqa: ${SITE_URL}/aloqa
- Blog: ${SITE_URL}/blog
${catLinks}

Ko'p so'raladigan savollar:
${faqUz}

## Русский

Oltinoy Collection — производитель и оптовый продавец из Ташкента с собственным швейным цехом.
Товары: ${catRu}. Стандартные размеры: 46–56.
Цены: оптовые, примерно 139 000–165 000 сум (в зависимости от модели).
Новая коллекция выходит каждую неделю.

Как заказать:
1. Выберите товар на сайте и заполните форму "Бронирование" — оператор свяжется в течение 1 рабочего дня.
2. Через Telegram: @${settings.tgOrderUsername}
3. Телефон: ${settings.phone}
Магазин: ${settings.addressRu}

Ссылки:
- Каталог: ${SITE_URL}/ru/katalog
- О нас: ${SITE_URL}/ru/biz-haqimizda
- Контакты: ${SITE_URL}/ru/aloqa
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
