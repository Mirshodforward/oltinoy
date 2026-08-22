import { getTranslations } from "next-intl/server";

/** Keyboard-only shortcut past the header straight into the page content. */
export async function SkipLink() {
  const t = await getTranslations("nav");
  return (
    <a
      href="#main"
      className="btn btn-gold sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:h-auto focus:w-auto focus:px-6 focus:py-3"
    >
      {t("skip")}
    </a>
  );
}
