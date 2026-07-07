"use client";

import { useState, useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

const SIZES = ["46", "48", "50", "52", "54", "56"];
const SORTS = [
  { value: "newest", key: "sortNewest" },
  { value: "price_asc", key: "sortPriceAsc" },
  { value: "price_desc", key: "sortPriceDesc" },
  { value: "popular", key: "sortPopular" },
] as const;

type Props = {
  basePath: string; // "/katalog" or "/katalog/abaya"
  current: { size: string | null; min: number | null; max: number | null; sort: string; q: string | null };
};

export function CatalogFilters({ basePath, current }: Props) {
  const t = useTranslations("catalog");
  const tc = useTranslations("common");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const [size, setSize] = useState(current.size ?? "");
  const [min, setMin] = useState(current.min?.toString() ?? "");
  const [max, setMax] = useState(current.max?.toString() ?? "");
  const [sort, setSort] = useState(current.sort);
  const [q, setQ] = useState(current.q ?? "");

  function apply(next?: Partial<{ size: string; min: string; max: string; sort: string; q: string }>) {
    const s = { size, min, max, sort, q, ...next };
    const params = new URLSearchParams();
    if (s.size) params.set("size", s.size);
    if (s.min) params.set("min", s.min);
    if (s.max) params.set("max", s.max);
    if (s.sort && s.sort !== "newest") params.set("sort", s.sort);
    if (s.q) params.set("q", s.q.trim());
    const qs = params.toString();
    startTransition(() => {
      router.push(`${basePath}${qs ? `?${qs}` : ""}`);
      setOpen(false);
    });
  }

  function clear() {
    setSize("");
    setMin("");
    setMax("");
    setSort("newest");
    setQ("");
    startTransition(() => router.push(basePath));
  }

  const activeCount = [current.size, current.min, current.max, current.q].filter(Boolean).length;

  return (
    <div className="mb-6">
      {/* Search + sort row (always visible) */}
      <div className="flex flex-wrap items-center gap-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            apply();
          }}
          className="flex min-w-[200px] flex-1 items-center gap-2"
          role="search"
        >
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={tc("searchPlaceholder")}
            aria-label={tc("search")}
            className="field-input"
          />
        </form>

        <label className="sr-only" htmlFor="sort">
          {t("sort")}
        </label>
        <select
          id="sort"
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            apply({ sort: e.target.value });
          }}
          className="field-input max-w-[180px]"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {t(s.key)}
            </option>
          ))}
        </select>

        <button type="button" onClick={() => setOpen((o) => !o)} className="btn btn-outline" aria-expanded={open}>
          {t("filters")}
          {activeCount > 0 && (
            <span className="ml-1 rounded-full bg-[var(--color-gold)] px-1.5 text-xs text-[var(--color-ink)]">{activeCount}</span>
          )}
        </button>
      </div>

      {/* Expandable filter panel */}
      {open && (
        <div className="card mt-3 grid gap-5 p-4 md:grid-cols-3">
          <fieldset>
            <legend className="field-label">{t("size")}</legend>
            <div className="flex flex-wrap gap-1.5">
              {SIZES.map((s) => {
                const active = size === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(active ? "" : s)}
                    aria-pressed={active}
                    className="min-w-[44px] rounded-full border px-3 py-2 text-sm font-medium transition-colors"
                    style={{
                      borderColor: active ? "var(--color-gold)" : "var(--color-line)",
                      background: active ? "var(--color-gold)" : "#fff",
                      color: "var(--color-ink)",
                    }}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className="field-label">{t("priceRange")}</legend>
            <div className="flex items-center gap-2">
              <input
                type="number"
                inputMode="numeric"
                value={min}
                onChange={(e) => setMin(e.target.value)}
                placeholder={t("priceMin")}
                aria-label={t("priceMin")}
                className="field-input"
              />
              <span aria-hidden="true">—</span>
              <input
                type="number"
                inputMode="numeric"
                value={max}
                onChange={(e) => setMax(e.target.value)}
                placeholder={t("priceMax")}
                aria-label={t("priceMax")}
                className="field-input"
              />
            </div>
          </fieldset>

          <div className="flex items-end gap-2">
            <button type="button" onClick={() => apply()} disabled={isPending} className="btn btn-primary flex-1">
              {t("applyFilters")}
            </button>
            <button type="button" onClick={clear} className="btn btn-outline">
              {t("clearFilters")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
