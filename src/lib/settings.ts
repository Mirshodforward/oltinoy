import { cache } from "react";
import { db } from "@/lib/db";

/** Defaults used when a Setting row is absent (keeps pages resilient pre-seed). */
export const DEFAULT_SETTINGS: Record<string, string> = {
  phone: "+998 97 423 81 41",
  addressUz: "Toshkent, Bek Baraka bozori, 12-qator, 473-do'kon",
  addressRu: "Ташкент, рынок Бек Барака, 12-й ряд, магазин 473",
  tgChannelUrl: "https://t.me/oltinoy_collection",
  tgOrderUsername: "oltinoy_shopping",
  instagramUrl: "",
  mapUrl: "",
  geoLat: "",
  geoLng: "",
};

/** Cached per-request settings map merged over defaults. */
export const getSettings = cache(async (): Promise<Record<string, string>> => {
  try {
    const rows = await db.setting.findMany();
    const map = { ...DEFAULT_SETTINGS };
    for (const r of rows) map[r.key] = r.value;
    return map;
  } catch {
    // DB unavailable (e.g. during static analysis) — fall back to defaults.
    return { ...DEFAULT_SETTINGS };
  }
});
