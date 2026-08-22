"use client";

import { useTranslations } from "next-intl";
import { ArrowRight } from "@/components/ui/icons";

/**
 * Phone-only sticky CTA that scrolls to the booking form. The price stays in
 * view because in optom the price is the decision; the bar rides on a blurred
 * ivory surface so the product shots keep showing through it.
 *
 * It overlays the bottom of the viewport at roughly 70px plus the safe-area
 * inset, so whatever section ends a product page has to carry enough bottom
 * padding of its own for the bar never to cover content.
 */
export function StickyBookingBar({ price, targetId }: { price: string; targetId: string }) {
  const t = useTranslations("booking");

  function scrollToForm() {
    const el = document.getElementById(targetId);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t backdrop-blur-md md:hidden"
      style={{
        background: "color-mix(in srgb, var(--color-ivory) 88%, transparent)",
        borderColor: "var(--line)",
        boxShadow: "0 -8px 24px -18px color-mix(in srgb, var(--color-ink) 35%, transparent)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="container-page flex items-center justify-between gap-4 py-3">
        {/* At 360px both cannot fit — the price truncates, the CTA never does. */}
        <span className="price min-w-0 flex-1 truncate text-xl">{price}</span>
        <button type="button" onClick={scrollToForm} className="btn btn-gold flex-none max-w-[220px]">
          {t("submit")}
          <ArrowRight size={17} />
        </button>
      </div>
    </div>
  );
}
