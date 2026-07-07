import type { Update } from "grammy/types";
import { createBot } from "@/bot/bot";
import { env } from "@/lib/env";

// Bot uses Prisma + grammY — must run on the Node.js runtime, never cached.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// One bot instance per server process, shared across all webhook requests.
const bot = createBot();
let initPromise: Promise<void> | null = null;
/** bot.init() (getMe) must run exactly once before the first handleUpdate. */
function ensureInit(): Promise<void> {
  if (!initPromise) initPromise = bot.init();
  return initPromise;
}

/**
 * Telegram webhook endpoint. Telegram POSTs updates here instead of us polling,
 * so the bot lives inside the web process — no separate PM2 job needed.
 * Register it once after deploy: `npm run bot:webhook`.
 */
export async function POST(req: Request): Promise<Response> {
  // Reject spoofed calls: Telegram echoes our secret in this header.
  if (env.TELEGRAM_WEBHOOK_SECRET) {
    const got = req.headers.get("x-telegram-bot-api-secret-token");
    if (got !== env.TELEGRAM_WEBHOOK_SECRET) {
      return new Response("unauthorized", { status: 401 });
    }
  }

  let update: Update;
  try {
    update = (await req.json()) as Update;
  } catch {
    return new Response("bad request", { status: 400 });
  }

  try {
    await ensureInit();
    await bot.handleUpdate(update);
  } catch (err) {
    // bot.catch already handles per-handler errors; this guards init/parse only.
    console.error("[webhook] update handling failed:", err);
  }

  // Always 200 so Telegram doesn't retry-storm on our transient errors.
  return new Response("ok", { status: 200 });
}
