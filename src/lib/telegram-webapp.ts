import crypto from "crypto";

export type TelegramWebAppUser = {
  userId: number;
  username?: string;
  firstName?: string;
};

/**
 * Validates Telegram WebApp initData (HMAC-SHA256 per Telegram docs).
 * Returns parsed user on success, null otherwise.
 */
export function validateTelegramWebAppInitData(
  initData: string,
  botToken: string,
  maxAgeSec = 86_400,
): TelegramWebAppUser | null {
  if (!initData.trim()) return null;

  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) return null;
  params.delete("hash");

  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("\n");

  const secretKey = crypto.createHmac("sha256", "WebAppData").update(botToken).digest();
  const calculatedHash = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

  try {
    const a = Buffer.from(calculatedHash, "hex");
    const b = Buffer.from(hash, "hex");
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }

  const authDate = Number(params.get("auth_date"));
  if (!Number.isFinite(authDate) || Date.now() / 1000 - authDate > maxAgeSec) return null;

  const userStr = params.get("user");
  if (!userStr) return null;

  try {
    const user = JSON.parse(userStr) as { id?: number; username?: string; first_name?: string };
    if (!user.id) return null;
    return { userId: user.id, username: user.username, firstName: user.first_name };
  } catch {
    return null;
  }
}
