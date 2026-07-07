import type { Context } from "grammy";
import { db } from "@/lib/db";
import { isAdminChat } from "../config";

/** /stats — admin-chat only: today's bookings by status, active products, subs. */
export async function handleStats(ctx: Context) {
  if (!isAdminChat(ctx.chat?.id)) {
    return; // silently ignore outside admin chat
  }

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

  const text =
    `📊 <b>Bugungi statistika</b>\n\n` +
    `🆕 Yangi: ${counts.NEW ?? 0}\n` +
    `✅ Tasdiqlangan: ${counts.CONFIRMED ?? 0}\n` +
    `📞 Bog'lanilgan: ${counts.CONTACTED ?? 0}\n` +
    `🏁 Yakunlangan: ${counts.COMPLETED ?? 0}\n` +
    `❌ Bekor: ${counts.CANCELLED ?? 0}\n` +
    `— Jami bugun: ${total}\n\n` +
    `🛍 Aktiv mahsulotlar: ${activeProducts}\n` +
    `👥 Aktiv obunachilar: ${subs}`;

  await ctx.reply(text, { parse_mode: "HTML" });
}
