"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { formatPrice } from "@/lib/format";
import { useDialog } from "@/components/ui/useDialog";
import { Close, Search, Sliders } from "@/components/ui/icons";

const SIZES = ["46", "48", "50", "52", "54", "56"];
const SORTS = [
  { value: "newest", key: "sortNewest" },
  { value: "price_asc", key: "sortPriceAsc" },
  { value: "price_desc", key: "sortPriceDesc" },
  { value: "popular", key: "sortPopular" },
] as const;

type FilterKey = "size" | "min" | "max" | "q";

type Props = {
  basePath: string; // "/katalog" or "/katalog/abaya"
  current: { size: string | null; min: number | null; max: number | null; sort: string; q: string | null };
};

/**
 * Catalogue toolbar. One row — search, sort, filters — then the applied
 * filters as removable chips. The filter panel is the same node in both
 * layouts: an inline card from 768px up, a bottom sheet on phones, which is
 * where a reseller actually browses.
 */
export function CatalogFilters({ basePath, current }: Props) {
  const t = useTranslations("catalog");
  const tc = useTranslations("common");
  const tn = useTranslations("nav");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const [size, setSize] = useState(current.size ?? "");
  const [min, setMin] = useState(current.min?.toString() ?? "");
  const [max, setMax] = useState(current.max?.toString() ?? "");
  const [sort, setSort] = useState(current.sort);
  const [q, setQ] = useState(current.q ?? "");

  // Below 768px the same node is a real modal — a bottom sheet over a backdrop —
  // so it has to behave like one. From 768px up it is an inline card: no scroll
  // lock, no focus trap, nothing to escape from.
  const [isModal, setIsModal] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setIsModal(!mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useDialog({
    open: open && isModal,
    panelRef: sheetRef,
    triggerRef,
    onClose: () => setOpen(false),
  });

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
    startTransition(() => {
      router.push(basePath);
      setOpen(false);
    });
  }

  /** Drop one applied filter and re-apply the rest exactly as the URL has them. */
  function remove(key: FilterKey) {
    const next = {
      size: key === "size" ? "" : (current.size ?? ""),
      min: key === "min" ? "" : (current.min?.toString() ?? ""),
      max: key === "max" ? "" : (current.max?.toString() ?? ""),
      q: key === "q" ? "" : (current.q ?? ""),
    };
    setSize(next.size);
    setMin(next.min);
    setMax(next.max);
    setQ(next.q);
    apply(next);
  }

  // "50 000 so'm dan" in uz, "от 50 000 сум" in ru — the preposition swaps sides.
  const bound = (amount: number, word: string) => {
    const price = formatPrice(amount, locale);
    return locale === "ru" ? `${word} ${price}` : `${price} ${word}`;
  };

  const chips: { key: FilterKey; label: string }[] = [];
  if (current.size) chips.push({ key: "size", label: `${t("size")} ${current.size}` });
  if (current.min !== null) chips.push({ key: "min", label: bound(current.min, tc("from")) });
  if (current.max !== null) chips.push({ key: "max", label: bound(current.max, tc("to")) });
  if (current.q) chips.push({ key: "q", label: `${tc("search")}: ${current.q}` });

  const activeCount = chips.length;

  return (
    <div className="mb-7" aria-busy={isPending}>
      {/* ── Toolbar ─────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2 md:gap-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            apply();
          }}
          className="relative min-w-[13rem] flex-1"
          role="search"
        >
          <label htmlFor="catalog-q" className="sr-only">
            {tc("search")}
          </label>
          <Search
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2"
            style={{ color: "var(--fg-subtle)" }}
          />
          <input
            id="catalog-q"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={tc("searchPlaceholder")}
            className="field-input pl-11"
          />
        </form>

        <label htmlFor="catalog-sort" className="sr-only">
          {t("sort")}
        </label>
        <select
          id="catalog-sort"
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            apply({ sort: e.target.value });
          }}
          className="field-input w-[10rem] shrink-0 md:w-[11.5rem]"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {t(s.key)}
            </option>
          ))}
        </select>

        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="btn btn-outline shrink-0"
          aria-expanded={open}
          aria-controls="catalog-filters"
        >
          <Sliders size={17} />
          {t("filters")}
          {activeCount > 0 && <span className="badge badge-new">{activeCount}</span>}
        </button>
      </div>

      {/* ── Applied filters ─────────────────────────────────────────── */}
      {chips.length > 0 && (
        <div className="mt-3.5 flex flex-wrap items-center gap-2">
          <span
            className="text-2xs font-bold uppercase tracking-[0.16em]"
            style={{ color: "var(--fg-subtle)" }}
          >
            {t("activeFilters")}
          </span>
          {chips.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => remove(c.key)}
              className="chip pr-2.5 text-xs"
              aria-label={`${t("clearFilters")}: ${c.label}`}
            >
              {c.label}
              <Close size={14} style={{ color: "var(--fg-subtle)" }} />
            </button>
          ))}
          <button type="button" onClick={clear} className="btn btn-ghost btn-sm">
            {t("clearAll")}
          </button>
        </div>
      )}

      {/* ── Filter panel: inline card ≥768px, bottom sheet on phones ─── */}
      {open && (
        <>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={tn("close")}
            className="fixed inset-0 z-[60] cursor-default md:hidden"
            style={{ background: "color-mix(in srgb, var(--color-ink) 45%, transparent)" }}
          />

          <div
            id="catalog-filters"
            ref={sheetRef}
            role={isModal ? "dialog" : "group"}
            aria-modal={isModal || undefined}
            tabIndex={isModal ? -1 : undefined}
            // The sheet's own <h2> is `md:hidden`, so aria-labelledby would point
            // at a display:none node on desktop — name the panel directly instead.
            aria-label={t("filtersTitle")}
            className="card fixed inset-x-0 bottom-0 z-[61] max-h-[85dvh] overflow-y-auto rounded-b-none rounded-t-lg shadow-[var(--shadow-lg)] md:static md:mt-4 md:max-h-none md:rounded-md md:shadow-none"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            {/* Sheet grab handle + title bar — phones only. */}
            <div className="md:hidden">
              <div
                className="mx-auto mt-3 h-1 w-10 rounded-full"
                style={{ background: "var(--line)" }}
                aria-hidden="true"
              />
              <div className="flex items-center justify-between gap-3 px-4 pb-3 pt-4">
                <h2 className="text-xl">{t("filtersTitle")}</h2>
                <button type="button" onClick={() => setOpen(false)} className="btn-icon -mr-2" aria-label={tn("close")}>
                  <Close size={20} />
                </button>
              </div>
            </div>

            <div className="grid gap-7 border-t px-4 py-5 md:grid-cols-2 md:gap-10 md:border-t-0 md:p-6">
              <fieldset>
                <legend className="field-label">{t("size")}</legend>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSize(size === s ? "" : s)}
                      aria-pressed={size === s}
                      className="chip"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="field-label">{t("priceRange")}</legend>
                <div className="flex items-center gap-2.5">
                  <input
                    type="number"
                    inputMode="numeric"
                    value={min}
                    onChange={(e) => setMin(e.target.value)}
                    placeholder={t("priceMin")}
                    aria-label={t("priceMin")}
                    className="field-input"
                  />
                  <span className="seam w-4 shrink-0" aria-hidden="true" />
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
            </div>

            <div
              className="sticky bottom-0 flex gap-2.5 border-t px-4 py-4 md:px-6"
              style={{ background: "var(--surface)" }}
            >
              <button
                type="button"
                onClick={() => apply()}
                disabled={isPending}
                className="btn btn-primary flex-1 md:flex-none md:px-8"
              >
                {t("applyFilters")}
              </button>
              <button type="button" onClick={clear} className="btn btn-outline">
                {t("clearFilters")}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
