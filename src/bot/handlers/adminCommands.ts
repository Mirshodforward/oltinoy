import type { Context } from "grammy";
import { db } from "@/lib/db";
import { canManageBookings, isAdminChat, isAdminTelegramUser } from "@/lib/admin-telegram";

async function buildStatsText(): Promise<string> {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [byStatus, activeProducts, subs] = await Promise.all([
    db.booking.groupBy({
      by: ["status"],
      _count: { _all: true },
      where: { createdAt: { gte: startOfDay } },
    }),
    db.product.count({ where: { status: "ACTIVE" } }),
    db.subscriber.count({ where: { isActive: true } }),
  ]);

  const counts: Record<string, number> = {};
  for (const row of byStatus) counts[row.status] = row._count._all;
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    `📊 <b>Bugungi statistika</b>\n\n` +
    `🆕 Yangi: ${counts.NEW ?? 0}\n` +
    `✅ Tasdiqlangan: ${counts.CONFIRMED ?? 0}\n` +
    `📞 Bog'lanilgan: ${counts.CONTACTED ?? 0}\n` +
    `🏁 Yakunlangan: ${counts.COMPLETED ?? 0}\n` +
    `❌ Bekor: ${counts.CANCELLED ?? 0}\n` +
    `— Jami bugun: ${total}\n\n` +
    `🛍 Aktiv mahsulotlar: ${activeProducts}\n` +
    `👥 Aktiv obunachilar: ${subs}`
  );
}

/** /stats — admin only (private chat or admin alert chat). */
export async function handleStats(ctx: Context) {
  const chatId = ctx.chat?.id;
  const userId = ctx.from?.id;
  const allowed =
    isAdminTelegramUser(userId) && (isAdminChat(chatId) || ctx.chat?.type === "private");
  if (!allowed) return;

  await ctx.reply(await buildStatsText(), { parse_mode: "HTML" });
}

/** Inline "Statistika" button from admin /start. */
export async function handleAdminStatsCallback(ctx: Context) {
  if (!isAdminTelegramUser(ctx.from?.id)) {
    await ctx.answerCallbackQuery({ text: "Ruxsat yo'q.", show_alert: true }).catch(() => {});
    return;
  }

  await ctx.answerCallbackQuery().catch(() => {});
  await ctx.reply(await buildStatsText(), { parse_mode: "HTML" });
}
