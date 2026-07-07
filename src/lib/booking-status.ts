import type { BookingStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { tg, bookingAlertText, escapeHtml } from "@/lib/telegram";

export const STATUS_LABEL: Record<BookingStatus, string> = {
  NEW: "YANGI",
  CONFIRMED: "TASDIQLANGAN",
  CONTACTED: "BOG'LANILDI",
  CANCELLED: "BEKOR QILINGAN",
  COMPLETED: "YAKUNLANGAN",
};

/** Map a short callback code → status. */
export const CODE_TO_STATUS: Record<string, BookingStatus> = {
  c: "CONFIRMED",
  t: "CONTACTED",
  x: "CANCELLED",
  d: "COMPLETED",
};

/** Inline keyboard offering the sensible next actions for a given status. */
export function keyboardForStatus(id: number, status: BookingStatus) {
  const btn = {
    c: { text: "✅ Tasdiqlash", callback_data: `bk:${id}:c` },
    t: { text: "📞 Bog'lanildi", callback_data: `bk:${id}:t` },
    d: { text: "🏁 Yakunlash", callback_data: `bk:${id}:d` },
    x: { text: "❌ Bekor", callback_data: `bk:${id}:x` },
  };
  let row: (typeof btn)[keyof typeof btn][] = [];
  switch (status) {
    case "NEW":
      row = [btn.c, btn.t, btn.x];
      break;
    case "CONFIRMED":
      row = [btn.t, btn.d, btn.x];
      break;
    case "CONTACTED":
      row = [btn.c, btn.d, btn.x];
      break;
    case "CANCELLED":
    case "COMPLETED":
      return undefined; // terminal — no keyboard
  }
  return { inline_keyboard: [row] };
}

function bookingToAlertInput(b: {
  id: number;
  size: string;
  quantity: number;
  customerName: string;
  phone: string;
  tgUsername: string | null;
  note: string | null;
  createdAt: Date;
  product: { nameUz: string; sku: string | null; slug: string; price: number };
}) {
  return {
    id: b.id,
    productName: b.product.nameUz,
    sku: b.product.sku,
    slug: b.product.slug,
    size: b.size,
    quantity: b.quantity,
    price: b.product.price,
    customerName: b.customerName,
    phone: b.phone,
    tgUsername: b.tgUsername,
    note: b.note,
    createdAt: b.createdAt,
  };
}

/**
 * Apply a booking status change and mirror it into the admin-chat Telegram
 * message (append HOLAT line + adjust keyboard). Used by both the bot callback
 * handler and the admin panel so the two stay in sync (§7.3 / §8.2).
 */
export async function applyBookingStatus(
  bookingId: number,
  status: BookingStatus,
  actorName: string,
): Promise<{ ok: boolean }> {
  const updated = await db.booking.update({
    where: { id: bookingId },
    data: { status },
    include: { product: { select: { nameUz: true, sku: true, slug: true, price: true } } },
  });

  const adminChatId = process.env.ADMIN_CHAT_ID;
  if (updated.adminTgMessageId && adminChatId) {
    const time = new Intl.DateTimeFormat("uz-UZ", {
      timeZone: "Asia/Tashkent",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date());
    const text =
      bookingAlertText(bookingToAlertInput(updated)) +
      `\n\n➡️ <b>HOLAT: ${STATUS_LABEL[status]}</b> (${escapeHtml(actorName)}, ${time})`;
    try {
      await tg.editMessageText(adminChatId, updated.adminTgMessageId, text, {
        parse_mode: "HTML",
        link_preview_options: { is_disabled: true },
        reply_markup: keyboardForStatus(bookingId, status),
      });
    } catch (err) {
      // Message may be too old / identical — non-fatal.
      console.error("[booking-status] editMessageText failed:", err);
    }
  }
  return { ok: true };
}
