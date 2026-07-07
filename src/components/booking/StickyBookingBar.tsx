"use client";

import { useTranslations } from "next-intl";

/** Mobile-only sticky CTA that scrolls to the booking form. */
export function StickyBookingBar({ price, targetId }: { price: string; targetId: string }) {
  const t = useTranslations("booking");

  function scrollToForm() {
    const el = document.getElementById(targetId);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t md:hidden"
      style={{ background: "#fff", borderColor: "var(--color-line)", paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="container-page flex items-center justify-between gap-3 py-2.5">
        <span className="price text-lg font-semibold">{price}</span>
        <button type="button" onClick={scrollToForm} className="btn btn-gold flex-1 max-w-[220px]">
          {t("submit")}
        </button>
      </div>
    </div>
  );
}
