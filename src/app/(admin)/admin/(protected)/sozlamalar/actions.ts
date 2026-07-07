"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

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
