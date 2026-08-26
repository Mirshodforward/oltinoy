import { z } from "zod";

/**
 * Validated environment. The process refuses to boot with missing/invalid env.
 * Split into server + public schemas so the client bundle never touches secrets.
 */
const serverSchema = z.object({
  DATABASE_URL: z.string().url(),
  SITE_URL: z.string().url(),
  BOT_TOKEN: z.string().min(1),
  ADMIN_CHAT_ID: z.string().min(1),
  CHANNEL_ID: z.string().min(1),
  // Optional shared secret for the /api/telegram webhook (recommended in prod).
  TELEGRAM_WEBHOOK_SECRET: z.string().optional().default(""),
  AUTH_SECRET: z.string().min(16),
  ADMIN_USERNAME: z.string().min(1),
  ADMIN_INITIAL_PASSWORD: z.string().min(6),
  UPLOAD_DIR: z.string().min(1),
  // Analitika tarixini necha kun saqlash (0 = cheksiz).
  ANALYTICS_RETENTION_DAYS: z.coerce.number().int().min(0).max(3650).optional().default(365),
  GOOGLE_SITE_VERIFICATION: z.string().optional().default(""),
  YANDEX_VERIFICATION: z.string().optional().default(""),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

const publicSchema = z.object({
  NEXT_PUBLIC_GA_ID: z.string().optional().default(""),
  NEXT_PUBLIC_YM_ID: z.string().optional().default(""),
});

function format(error: z.ZodError) {
  return error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`).join("\n");
}

const parsedServer = serverSchema.safeParse(process.env);
const parsedPublic = publicSchema.safeParse({
  NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
  NEXT_PUBLIC_YM_ID: process.env.NEXT_PUBLIC_YM_ID,
});

if (!parsedServer.success) {
  throw new Error("❌ Invalid server environment variables:\n" + format(parsedServer.error));
}
if (!parsedPublic.success) {
  throw new Error("❌ Invalid public environment variables:\n" + format(parsedPublic.error));
}

export const env = { ...parsedServer.data, ...parsedPublic.data };
export type Env = typeof env;
