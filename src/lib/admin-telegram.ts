import { env } from "@/lib/env";

/** Chat where booking alerts are delivered (group id or personal chat id). */
export const ADMIN_CHAT_ID_RAW = env.ADMIN_CHAT_ID;
export const ADMIN_CHAT_ID_NUM = Number(env.ADMIN_CHAT_ID);

/** Telegram user ids allowed to use admin bot commands and Mini App auto-login. */
export function getAdminTelegramIds(): Set<number> {
  const raw = process.env.ADMIN_TELEGRAM_IDS?.trim();
  if (raw) {
    return new Set(
      raw
        .split(",")
        .map((s) => Number(s.trim()))
        .filter((n) => Number.isFinite(n) && n > 0),
    );
  }
  // Back-compat: a positive ADMIN_CHAT_ID is treated as the admin user's id.
  if (Number.isFinite(ADMIN_CHAT_ID_NUM) && ADMIN_CHAT_ID_NUM > 0) {
    return new Set([ADMIN_CHAT_ID_NUM]);
  }
  return new Set();
}

const ADMIN_TELEGRAM_IDS = getAdminTelegramIds();

export function isAdminTelegramUser(userId: number | undefined): boolean {
  if (userId === undefined) return false;
  return ADMIN_TELEGRAM_IDS.has(userId);
}

export function isAdminChat(chatId: number | undefined): boolean {
  if (chatId === undefined) return false;
  return chatId === ADMIN_CHAT_ID_NUM;
}

/** Booking inline buttons: message must be in admin chat; in groups only listed admins may act. */
export function canManageBookings(opts: {
  chatId?: number;
  userId?: number;
  chatType?: string;
}): boolean {
  if (!isAdminChat(opts.chatId)) return false;
  if (opts.chatType === "private") return true;
  return isAdminTelegramUser(opts.userId);
}

export function siteHostname(): string {
  try {
    return new URL(env.SITE_URL).hostname.replace(/^www\./, "");
  } catch {
    return "oltinoycollection.uz";
  }
}
