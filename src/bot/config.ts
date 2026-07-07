import { env } from "@/lib/env";

export const BOT_TOKEN = env.BOT_TOKEN;
export const CHANNEL_ID = env.CHANNEL_ID;

/** ADMIN_CHAT_ID may be a numeric group/user id (possibly negative). */
export const ADMIN_CHAT_ID_RAW = env.ADMIN_CHAT_ID;
export const ADMIN_CHAT_ID_NUM = Number(env.ADMIN_CHAT_ID);

export function isAdminChat(chatId: number | undefined): boolean {
  if (chatId === undefined) return false;
  return chatId === ADMIN_CHAT_ID_NUM;
}
