import { Bot } from "grammy";
import { BOT_TOKEN } from "./config";
import { handleStart, handleStop } from "./handlers/start";
import { handleBookingCallback } from "./handlers/callbacks";
import { handleStats, handleAdminStatsCallback } from "./handlers/adminCommands";

/**
 * Build a fully-configured bot. Shared by:
 *  - the webhook route (production, single Next.js process), and
 *  - the standalone long-polling entry (`src/bot/index.ts`, local dev).
 */
export function createBot(): Bot {
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

  bot.callbackQuery("admin:stats", async (ctx) => {
    try {
      await handleAdminStatsCallback(ctx);
    } catch (err) {
      console.error("[bot] admin stats callback failed:", err);
    }
  });

  return bot;
}
