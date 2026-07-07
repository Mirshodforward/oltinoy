import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["uz", "ru"],
  defaultLocale: "uz",
  // uz has no prefix; ru lives under /ru/...
  localePrefix: "as-needed",
  // Sayt doim o'zbekcha ochilsin — brauzer Accept-Language'iga qarab /ru ga
  // yo'naltirmasin. Foydalanuvchi tilni o'zi almashtira oladi.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
