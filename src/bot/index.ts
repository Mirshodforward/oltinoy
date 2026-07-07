import { createBot } from "./bot";
import { db } from "@/lib/db";

// Standalone long-polling entry — for LOCAL DEV only (`npm run dev:bot`).
// Production uses the webhook route (src/app/api/telegram/route.ts), so this
// process is not started on the server. Note: a bot can't poll while a webhook
// is set (Telegram 409) — run `node --env-file=.env -e "..."` deleteWebhook first
// if you switch a real token back to polling.
const bot = createBot();

async function shutdown(signal: string) {
  console.log(`[bot] received ${signal}, shutting down…`);
  try {
    await bot.stop();
    await db.$disconnect();
  } finally {
    process.exit(0);
  }
}
process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM"));

console.log("[bot] starting long polling…");
bot.start({
  onStart: (info) => console.log(`[bot] @${info.username} is running`),
  drop_pending_updates: true,
});
