"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useTransition } from "react";

export function LangSwitcher({ light = false }: { light?: boolean }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function switchTo(next: string) {
    if (next === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: next as (typeof routing.locales)[number] });
    });
  }

  return (
    <div
      className="inline-flex items-center rounded-full border p-0.5 text-xs font-semibold"
      style={{ borderColor: light ? "rgba(247,243,236,0.3)" : "var(--color-line)" }}
      role="group"
      aria-label="Language switcher"
    >
      {routing.locales.map((l) => {
        const active = l === locale;
        return (
          <button
            key={l}
            type="button"
            onClick={() => switchTo(l)}
            disabled={isPending}
            aria-current={active ? "true" : undefined}
            className="min-w-[38px] rounded-full px-2.5 py-1 uppercase transition-colors"
            style={{
              backgroundColor: active ? "var(--color-gold)" : "transparent",
              color: active ? "var(--color-ink)" : light ? "var(--color-ivory)" : "var(--color-ink)",
            }}
          >
            {l}
          </button>
        );
      })}
    </div>
  );
}
