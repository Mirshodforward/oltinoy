import type { Context } from "grammy";
import { CODE_TO_STATUS, STATUS_LABEL, applyBookingStatus } from "@/lib/booking-status";
import { isAdminChat } from "../config";

/** Handle inline status buttons on booking alerts (admin chat only). */
export async function handleBookingCallback(ctx: Context) {
  const data = ctx.callbackQuery?.data;
  const chatId = ctx.callbackQuery?.message?.chat.id;

  // Only members of the admin chat may act.
  if (!isAdminChat(chatId)) {
    await ctx.answerCallbackQuery({ text: "Ruxsat yo'q.", show_alert: true }).catch(() => {});
    return;
  }

  const match = data?.match(/^bk:(\d+):([ctxd])$/);
  if (!match) {
    await ctx.answerCallbackQuery().catch(() => {});
    return;
  }

  const id = parseInt(match[1], 10);
  const status = CODE_TO_STATUS[match[2]];
  const actor = ctx.from?.first_name ?? "admin";

  try {
    await applyBookingStatus(id, status, actor);
    await ctx.answerCallbackQuery({ text: `Holat: ${STATUS_LABEL[status]}` });
  } catch (err) {
    console.error("[bot] callback failed:", err);
    await ctx.answerCallbackQuery({ text: "Xatolik yuz berdi.", show_alert: true }).catch(() => {});
  }
}
