import { Bot } from "grammy";
import { BOT_TOKEN } from "./config";
import { handleStart, handleStop } from "./handlers/start";
import { handleBookingCallback } from "./handlers/callbacks";
import { handleStats } from "./handlers/adminCommands";
import { db } from "@/lib/db";

const bot = new Bot(BOT_TOKEN);

// Never crash on a bad update.
bot.catch((err) => {
  console.error("[bot] error handling update:", err.error);
});

bot.command("start", async (ctx) => {
  try {
    await handleStart(ctx);
  } catch (err) {
    console.error("[bot] /start failed:", err);
  }
});

bot.command("stop", async (ctx) => {
  try {
    await handleStop(ctx);
  } catch (err) {
    console.error("[bot] /stop failed:", err);
  }
});

bot.command("stats", async (ctx) => {
  try {
    await handleStats(ctx);
  } catch (err) {
    console.error("[bot] /stats failed:", err);
  }
});

bot.callbackQuery(/^bk:\d+:[ctxd]$/, async (ctx) => {
  try {
    await handleBookingCallback(ctx);
  } catch (err) {
    console.error("[bot] callback failed:", err);
  }
});

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
