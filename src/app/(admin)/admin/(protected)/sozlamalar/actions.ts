"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";
import { rateLimit } from "@/lib/ratelimit";
import bcrypt from "bcryptjs";

const ALLOWED_KEYS = [
  "phone",
  "addressUz",
  "addressRu",
  "tgChannelUrl",
  "tgOrderUsername",
  "instagramUrl",
  "mapUrl",
  "geoLat",
  "geoLng",
] as const;

const schema = z.record(z.enum(ALLOWED_KEYS), z.string().max(1000));

export async function saveSettings(raw: unknown): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  const parsed = schema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Validatsiya xatosi" };

  const entries = Object.entries(parsed.data);
  await db.$transaction(
    entries.map(([key, value]) =>
      db.setting.upsert({ where: { key }, create: { key, value }, update: { value } }),
    ),
  );
  revalidatePath("/", "layout");
  revalidatePath("/admin/sozlamalar");
  return { ok: true };
}

// ─────────────────────────── Admin paroli ───────────────────────────

const passwordSchema = z
  .object({
    current: z.string().min(1),
    next: z.string().min(8, "Parol kamida 8 belgidan iborat bo'lsin").max(200),
    confirm: z.string().min(1),
  })
  .refine((v) => v.next === v.confirm, { message: "Yangi parollar mos kelmadi" })
  .refine((v) => v.next !== v.current, { message: "Yangi parol eskisidan farq qilsin" });

/**
 * Changes the signed-in admin's password. The current password is re-checked
 * here rather than trusted from the session: a live session is proof of an
 * earlier login, not of who is at the keyboard right now.
 */
export async function changePassword(raw: unknown): Promise<{ ok: boolean; error?: string }> {
  const admin = await requireAdmin();

  // Five attempts a minute is plenty for a typo and useless for guessing.
  if (!rateLimit(`pw:${admin.id}`, 5, 60_000).ok) {
    return { ok: false, error: "Juda ko'p urinish. Bir daqiqadan so'ng qayta urining." };
  }

  const parsed = passwordSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Validatsiya xatosi" };
  }

  const user = await db.adminUser.findUnique({ where: { username: admin.name } });
  if (!user) return { ok: false, error: "Foydalanuvchi topilmadi" };

  if (!(await bcrypt.compare(parsed.data.current, user.passwordHash))) {
    return { ok: false, error: "Joriy parol noto'g'ri" };
  }

  await db.adminUser.update({
    where: { id: user.id },
    data: { passwordHash: await bcrypt.hash(parsed.data.next, 12) },
  });

  return { ok: true };
}
