import { Api } from "grammy";
import { env } from "@/lib/env";
import { formatPrice, formatDateTime } from "@/lib/format";
import { absoluteImageUrl } from "@/lib/images";

/**
 * Outbound-only Telegram client for the web process. No bot instance / no polling
 * here — inbound updates are handled by the separate `oltinoy-bot` PM2 process.
 */
export const tg = new Api(env.BOT_TOKEN);

export function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export type BookingAlertInput = {
  id: number;
  productName: string;
  sku: string | null;
  slug: string;
  size: string;
  quantity: number;
  price: number;
  customerName: string;
  phone: string;
  tgUsername: string | null;
  note: string | null;
  createdAt: Date;
};

/** Renders the admin booking-alert body (HTML). Shared by web (send) + bot (edit). */
export function bookingAlertText(b: BookingAlertInput): string {
  const total = b.price * b.quantity;
  return (
    `🆕 <b>YANGI BRON</b>  #B-${b.id}\n\n` +
    `📦 ${escapeHtml(b.productName)}  (SKU: ${escapeHtml(b.sku ?? "—")})\n` +
    `📏 O'lcham: ${escapeHtml(b.size)}   |   🔢 Soni: ${b.quantity} dona\n` +
    `💰 Optom: ${formatPrice(b.price)}  →  Jami: ${formatPrice(total)}\n\n` +
    `👤 ${escapeHtml(b.customerName)}\n` +
    `📞 ${escapeHtml(b.phone)}\n` +
    `✈️ ${b.tgUsername ? "@" + escapeHtml(b.tgUsername) : "—"}\n` +
    `📝 ${b.note ? escapeHtml(b.note) : "—"}\n\n` +
    `🕐 ${formatDateTime(b.createdAt)} (Toshkent)\n` +
    `🔗 ${env.SITE_URL}/mahsulot/${b.slug}`
  );
}

/** Full inline keyboard for a fresh NEW booking. */
export function bookingKeyboard(id: number) {
  return {
    inline_keyboard: [
      [
        { text: "✅ Tasdiqlash", callback_data: `bk:${id}:c` },
        { text: "📞 Bog'lanildi", callback_data: `bk:${id}:t` },
        { text: "❌ Bekor", callback_data: `bk:${id}:x` },
      ],
    ],
  };
}

/** §8.2 admin booking alert with inline status keyboard. Returns message_id or null. */
export async function sendBookingAlert(b: BookingAlertInput): Promise<number | null> {
  const res = await tg.sendMessage(env.ADMIN_CHAT_ID, bookingAlertText(b), {
    parse_mode: "HTML",
    link_preview_options: { is_disabled: true },
    reply_markup: bookingKeyboard(b.id),
  });
  return res.message_id;
}

type ChannelPostInput = {
  nameUz: string;
  materialUz: string | null;
  price: number;
  sizes: string[];
  slug: string;
  phone: string;
  imageFileNames: string[];
};

/** §8.3 channel auto-post via sendMediaGroup. Returns posted message ids. */
export async function postProductToChannel(p: ChannelPostInput): Promise<number[]> {
  const caption =
    `✨ <b>Oltinoy Collection</b> ✨\n\n` +
    `🆕 ${escapeHtml(p.nameUz)} sotuvga chiqdi 🔥\n\n` +
    `🧵 Materiali: ${escapeHtml(p.materialUz ?? "—")}\n` +
    `💯 NARXI ~ OPTOM: ${formatPrice(p.price)}\n` +
    `📏 Razmer: STANDART ${p.sizes.join(".")}\n\n` +
    `📩 Bron qilish 👇\n` +
    `${env.SITE_URL}/mahsulot/${p.slug}\n\n` +
    `🏬 Bek Baraka 12-qator, 473-do'kon\n` +
    `☎️ ${escapeHtml(p.phone)}`;

  const media = p.imageFileNames.slice(0, 10).map((fileName, i) => ({
    type: "photo" as const,
    media: absoluteImageUrl(env.SITE_URL, fileName, "lg", "jpg"),
    ...(i === 0 ? { caption, parse_mode: "HTML" as const } : {}),
  }));

  const messages = await tg.sendMediaGroup(env.CHANNEL_ID, media);
  return messages.map((m) => m.message_id);
}
