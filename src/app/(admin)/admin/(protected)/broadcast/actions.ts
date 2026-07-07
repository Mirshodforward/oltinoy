"use server";

import { GrammyError } from "grammy";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";
import { tg, escapeHtml } from "@/lib/telegram";
import { absoluteImageUrl } from "@/lib/images";
import { env } from "@/lib/env";

const schema = z.object({
  text: z.string().min(1).max(3000),
  productId: z.number().int().positive().optional().nullable(),
});

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function getRecipientCount(): Promise<number> {
  await requireAdmin();
  return db.subscriber.count({ where: { isActive: true } });
}

export type BroadcastResult = { sent: number; blocked: number; failed: number; total: number };

/** Loop over active subscribers at ~20 msg/sec; disable blocked (403) users. */
export async function sendBroadcast(raw: unknown): Promise<{ ok: boolean; error?: string; result?: BroadcastResult }> {
  await requireAdmin();
  const parsed = schema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Matn noto'g'ri" };
  const { text, productId } = parsed.data;

  let photoUrl: string | null = null;
  let productUrl: string | null = null;
  if (productId) {
    const product = await db.product.findUnique({
      where: { id: productId },
      include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
    });
    if (product) {
      productUrl = `${env.SITE_URL}/mahsulot/${product.slug}`;
      if (product.images[0]) photoUrl = absoluteImageUrl(env.SITE_URL, product.images[0].fileName, "lg", "jpg");
    }
  }

  const subscribers = await db.subscriber.findMany({ where: { isActive: true }, select: { telegramId: true } });
  const html = escapeHtml(text).replace(/\n/g, "\n");
  const replyMarkup = productUrl ? { inline_keyboard: [[{ text: "🛍 Ko'rish", url: productUrl }]] } : undefined;

  const result: BroadcastResult = { sent: 0, blocked: 0, failed: 0, total: subscribers.length };
  const blockedIds: bigint[] = [];

  for (const sub of subscribers) {
    const chatId = Number(sub.telegramId);
    try {
      if (photoUrl) {
        await tg.sendPhoto(chatId, photoUrl, { caption: html, parse_mode: "HTML", reply_markup: replyMarkup });
      } else {
        await tg.sendMessage(chatId, html, { parse_mode: "HTML", reply_markup: replyMarkup, link_preview_options: { is_disabled: !productUrl } });
      }
      result.sent++;
    } catch (err) {
      if (err instanceof GrammyError && (err.error_code === 403 || err.error_code === 400)) {
        result.blocked++;
        blockedIds.push(sub.telegramId);
      } else {
        result.failed++;
        console.error("[broadcast] send failed:", err);
      }
    }
    await sleep(50); // ~20 msg/sec
  }

  if (blockedIds.length > 0) {
    await db.subscriber.updateMany({ where: { telegramId: { in: blockedIds } }, data: { isActive: false } });
  }

  return { ok: true, result };
}
