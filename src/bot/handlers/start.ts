import type { Context } from "grammy";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";

/** /start — upsert subscriber + greeting with catalog/channel buttons. */
export async function handleStart(ctx: Context) {
  const from = ctx.from;
  if (!from) return;

  await db.subscriber.upsert({
    where: { telegramId: BigInt(from.id) },
    create: {
      telegramId: BigInt(from.id),
      firstName: from.first_name ?? null,
      username: from.username ?? null,
      isActive: true,
    },
    update: { isActive: true, firstName: from.first_name ?? null, username: from.username ?? null },
  });

  const settings = await getSettings();
  const siteUrl = process.env.SITE_URL ?? "https://oltinoy.uz";

  const text =
    `Assalomu alaykum, ${from.first_name ?? "mehmon"}! 👋\n\n` +
    `<b>Oltinoy Collection</b> botiga xush kelibsiz.\n\n` +
    `Bu yerda siz yangi kolleksiya chiqqanda birinchilardan bo'lib xabar olasiz. ` +
    `Optom abaya, ko'ylak va rumollar — o'z tikuv seximizdan, to'g'ridan-to'g'ri.\n\n` +
    `Buyurtma berish uchun saytdan bron qoldiring yoki biz bilan bog'laning.`;

  await ctx.reply(text, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "🛍 Katalog", url: `${siteUrl}/katalog` }],
        ...(settings.tgChannelUrl ? [[{ text: "✈️ Kanal", url: settings.tgChannelUrl }]] : []),
      ],
    },
  });
}

/** /stop — unsubscribe. */
export async function handleStop(ctx: Context) {
  const from = ctx.from;
  if (!from) return;
  await db.subscriber.updateMany({
    where: { telegramId: BigInt(from.id) },
    data: { isActive: false },
  });
  await ctx.reply("Obuna bekor qilindi. Xohlagan payt /start bilan qayta obuna bo'lishingiz mumkin. 🙏");
}
