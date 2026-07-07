// Registers the Telegram webhook so updates are pushed to SITE_URL/api/telegram.
// Run once after each deploy (server, inside /var/www/oltinoy):
//   node --env-file=.env scripts/set-webhook.mjs
// or: npm run bot:webhook
import { Bot } from "grammy";

const token = process.env.BOT_TOKEN;
const site = (process.env.SITE_URL || "").replace(/\/$/, "");
const secret = process.env.TELEGRAM_WEBHOOK_SECRET || undefined;

if (!token) throw new Error("BOT_TOKEN topilmadi (.env ni tekshiring)");
if (!site.startsWith("https://")) {
  throw new Error(`SITE_URL https bo'lishi kerak (hozir: ${site || "bo'sh"}). Webhook faqat HTTPS bilan ishlaydi.`);
}

const url = `${site}/api/telegram`;
const bot = new Bot(token);

await bot.api.setWebhook(url, { secret_token: secret, drop_pending_updates: true });
const info = await bot.api.getWebhookInfo();

console.log("✅ Webhook o'rnatildi");
console.log("   url:            ", info.url);
console.log("   secret himoya:  ", secret ? "yoqilgan" : "yo'q (TELEGRAM_WEBHOOK_SECRET bo'sh)");
console.log("   pending updates:", info.pending_update_count);
if (info.last_error_message) {
  console.log("   ⚠️  last_error: ", info.last_error_message);
}
