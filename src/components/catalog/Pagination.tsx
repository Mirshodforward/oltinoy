import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ChevronLeft, ChevronRight } from "@/components/ui/icons";

const PAGE_BTN = "btn btn-sm min-h-[44px] min-w-[44px] px-3";
const STEP_BTN = "btn btn-outline btn-sm min-h-[44px] w-[44px] px-0";

/**
 * Server-rendered pagination with indexable <a> links (shareable URLs).
 * Phones get a "3 / 12" readout instead of the number strip — the numbers stay
 * in the markup for crawlers, they are just not worth the tap targets there.
 */
export async function Pagination({
  basePath,
  page,
  totalPages,
  makeQuery,
}: {
  basePath: string;
  page: number;
  totalPages: number;
  makeQuery: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  const [t, tc] = await Promise.all([getTranslations("catalog"), getTranslations("common")]);

  const pages: number[] = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  const ellipsis = (
    <span className="px-1 text-sm" style={{ color: "var(--fg-subtle)" }} aria-hidden="true">
      …
    </span>
  );

  return (
    <nav aria-label={t("page")} className="mt-12 flex items-center justify-center gap-1.5">
      {page > 1 ? (
        <Link href={`${basePath}${makeQuery(page - 1)}`} rel="prev" className={STEP_BTN} aria-label={tc("prev")}>
          <ChevronLeft size={18} />
        </Link>
      ) : (
        <span className={STEP_BTN} aria-hidden="true" aria-disabled="true">
          <ChevronLeft size={18} />
        </span>
      )}

      {/* Phones: a compact readout in place of the number strip. */}
      <span className="price px-4 text-sm sm:hidden">{t("pageOf", { page, total: totalPages })}</span>

      <div className="hidden items-center gap-1.5 sm:flex">
        {start > 1 && (
          <>
            <Link href={`${basePath}${makeQuery(1)}`} className={`${PAGE_BTN} btn-outline`}>
              1
            </Link>
            {start > 2 && ellipsis}
          </>
        )}

        {pages.map((p) => (
          <Link
            key={p}
            href={`${basePath}${makeQuery(p)}`}
            aria-current={p === page ? "page" : undefined}
            className={`${PAGE_BTN} ${p === page ? "btn-gold" : "btn-outline"}`}
          >
            {p}
          </Link>
        ))}

        {end < totalPages && (
          <>
            {end < totalPages - 1 && ellipsis}
            <Link href={`${basePath}${makeQuery(totalPages)}`} className={`${PAGE_BTN} btn-outline`}>
              {totalPages}
            </Link>
          </>
        )}
      </div>

      {page < totalPages ? (
        <Link href={`${basePath}${makeQuery(page + 1)}`} rel="next" className={STEP_BTN} aria-label={tc("next")}>
          <ChevronRight size={18} />
        </Link>
      ) : (
        <span className={STEP_BTN} aria-hidden="true" aria-disabled="true">
          <ChevronRight size={18} />
        </span>
      )}
    </nav>
  );
}
