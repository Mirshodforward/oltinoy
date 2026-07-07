import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["uz", "ru"],
  defaultLocale: "uz",
  // uz has no prefix; ru lives under /ru/...
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
