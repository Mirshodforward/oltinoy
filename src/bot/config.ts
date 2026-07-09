export {
  ADMIN_CHAT_ID_NUM,
  ADMIN_CHAT_ID_RAW,
  canManageBookings,
  isAdminChat,
  isAdminTelegramUser,
  siteHostname,
} from "@/lib/admin-telegram";
export { env as botEnv } from "@/lib/env";

import { env } from "@/lib/env";

export const BOT_TOKEN = env.BOT_TOKEN;
export const CHANNEL_ID = env.CHANNEL_ID;
