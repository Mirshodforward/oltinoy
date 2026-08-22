"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useTransition } from "react";

/**
 * Segmented UZ / RU toggle. It reads the contextual `--fg` / `--line` tokens,
 * so dropping it inside an `.on-dark` band recolours it with no extra props.
 */
export function LangSwitcher({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const t = useTranslations("langSwitcher");
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
      className={`inline-flex items-center rounded-full border p-0.5 text-2xs font-bold ${className}`}
      style={{ borderColor: "var(--line)", opacity: isPending ? 0.6 : 1 }}
      role="group"
      aria-label={t("label")}
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
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full px-3 uppercase tracking-widest transition-colors"
            style={{
              backgroundColor: active ? "var(--color-gold)" : "transparent",
              color: active ? "var(--color-ink)" : "var(--fg-muted)",
            }}
          >
            {l}
          </button>
        );
      })}
    </div>
  );
}
