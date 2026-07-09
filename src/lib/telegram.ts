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

export type ChannelPostInput = {
  nameUz: string;
  categoryName?: string | null;
  materialUz: string | null;
  price: number;
  oldPrice?: number | null;
  sizes: string[];
  minOrderQty: number;
  slug: string;
  phone: string;
  sku?: string | null;
  imageFileNames: string[];
};

/** Channel post caption (HTML). */
export function productChannelCaption(p: ChannelPostInput): string {
  const site = env.SITE_URL.replace(/\/$/, "");
  const productUrl = `${site}/mahsulot/${p.slug}`;
  const sizesLine = p.sizes.length > 0 ? p.sizes.join(" · ") : "—";

  let priceBlock = `💰 <b>Optom narxi:</b> ${formatPrice(p.price)}`;
  if (p.oldPrice && p.oldPrice > p.price) {
    priceBlock += `\n🏷 <b>Chegirma:</b> <s>${formatPrice(p.oldPrice)}</s>`;
  }

  const lines = [
    `✨ <b>OLTINOY COLLECTION</b> ✨`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `🆕 <b>YANGI MODEL</b>`,
    ``,
    `👗 <b>${escapeHtml(p.nameUz)}</b>`,
    p.categoryName ? `📂 ${escapeHtml(p.categoryName)}` : null,
    p.sku ? `🔖 Artikul: ${escapeHtml(p.sku)}` : null,
    ``,
    `🧵 <b>Mato:</b> ${escapeHtml(p.materialUz ?? "—")}`,
    `📏 <b>Razmer:</b> ${escapeHtml(sizesLine)}`,
    p.minOrderQty > 1 ? `📦 <b>Min. buyurtma:</b> ${p.minOrderQty} dona` : null,
    ``,
    priceBlock,
    ``,
    `━━━━━━━━━━━━━━━━━━━━`,
    `📩 <b>Bron qilish:</b>`,
    `<a href="${productUrl}">${productUrl}</a>`,
    ``,
    `🏬 Bek Baraka bozori, 12-qator, 473-do'kon`,
    `☎️ ${escapeHtml(p.phone)}`,
  ];

  return lines.filter((l) => l !== null).join("\n");
}

export function productChannelKeyboard(slug: string) {
  const site = env.SITE_URL.replace(/\/$/, "");
  const productUrl = `${site}/mahsulot/${slug}`;
  return {
    inline_keyboard: [
      [
        { text: "🛍 Ko'rish", url: productUrl },
        { text: "📩 Bron qilish", url: productUrl },
      ],
      [{ text: "📦 Katalog", url: `${site}/katalog` }],
    ],
  };
}

/** §8.3 channel auto-post via sendMediaGroup + action buttons. Returns posted message ids. */
export async function postProductToChannel(p: ChannelPostInput): Promise<number[]> {
  const caption = productChannelCaption(p);
  const replyMarkup = productChannelKeyboard(p.slug);
  const fileNames = p.imageFileNames.slice(0, 10);

  if (fileNames.length === 0) {
    throw new Error("Kamida bitta rasm kerak");
  }

  // Single photo: caption + inline buttons on one message.
  if (fileNames.length === 1) {
    const msg = await tg.sendPhoto(env.CHANNEL_ID, absoluteImageUrl(env.SITE_URL, fileNames[0], "lg", "jpg"), {
      caption,
      parse_mode: "HTML",
      reply_markup: replyMarkup,
    });
    return [msg.message_id];
  }

  const media = fileNames.map((fileName, i) => ({
    type: "photo" as const,
    media: absoluteImageUrl(env.SITE_URL, fileName, "lg", "jpg"),
    ...(i === 0 ? { caption, parse_mode: "HTML" as const } : {}),
  }));

  const album = await tg.sendMediaGroup(env.CHANNEL_ID, media);
  const ids = album.map((m) => m.message_id);

  const actionMsg = await tg.sendMessage(env.CHANNEL_ID, "👇 Buyurtma uchun tugmani bosing", {
    parse_mode: "HTML",
    reply_markup: replyMarkup,
    reply_parameters: { message_id: album[0].message_id },
  });
  ids.push(actionMsg.message_id);

  return ids;
}
