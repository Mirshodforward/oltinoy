import type { Locale } from "@/i18n/routing";

const TASHKENT_TZ = "Asia/Tashkent";

/** 140000 → "140 000 so'm" (uz) / "140 000 сум" (ru). Uses a narrow no-break space. */
export function formatPrice(amount: number, locale: Locale = "uz"): string {
  const grouped = new Intl.NumberFormat("ru-RU").format(amount).replace(/ /g, " ");
  const suffix = locale === "ru" ? "сум" : "so'm";
  return `${grouped} ${suffix}`;
}

/** dd.MM.yyyy HH:mm in Asia/Tashkent. */
export function formatDateTime(date: Date, locale: Locale = "uz"): string {
  return new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "uz-UZ", {
    timeZone: TASHKENT_TZ,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export function formatDate(date: Date, locale: Locale = "uz"): string {
  return new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "uz-UZ", {
    timeZone: TASHKENT_TZ,
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

/** Normalize Uzbek phone input to +998XXXXXXXXX (or null if not valid). */
export function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  let national = digits;
  if (national.startsWith("998")) national = national.slice(3);
  if (national.length !== 9) return null;
  return `+998${national}`;
}

/** +998974238141 → "+998 97 423 81 41" for display. */
export function displayPhone(normalized: string): string {
  const m = normalized.match(/^\+998(\d{2})(\d{3})(\d{2})(\d{2})$/);
  if (!m) return normalized;
  return `+998 ${m[1]} ${m[2]} ${m[3]} ${m[4]}`;
}

/** Fallback alt text when no manual alt is set: "product name — category" (§9.4). */
export function productAltFallback(name: string, categoryName: string): string {
  return `${name} — ${categoryName}`;
}
