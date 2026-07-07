import { Link } from "@/i18n/navigation";

/** Server-rendered pagination with indexable <a> links (shareable URLs). */
export function Pagination({
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

  const pages: number[] = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-1.5">
      {page > 1 && (
        <Link href={`${basePath}${makeQuery(page - 1)}`} rel="prev" className="btn btn-outline px-3 py-2" aria-label="Previous">
          ←
        </Link>
      )}
      {start > 1 && (
        <>
          <Link href={`${basePath}${makeQuery(1)}`} className="btn btn-outline px-3.5 py-2">
            1
          </Link>
          {start > 2 && <span className="px-1" style={{ color: "var(--color-muted)" }}>…</span>}
        </>
      )}
      {pages.map((p) => (
        <Link
          key={p}
          href={`${basePath}${makeQuery(p)}`}
          aria-current={p === page ? "page" : undefined}
          className={p === page ? "btn btn-gold px-3.5 py-2" : "btn btn-outline px-3.5 py-2"}
        >
          {p}
        </Link>
      ))}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-1" style={{ color: "var(--color-muted)" }}>…</span>}
          <Link href={`${basePath}${makeQuery(totalPages)}`} className="btn btn-outline px-3.5 py-2">
            {totalPages}
          </Link>
        </>
      )}
      {page < totalPages && (
        <Link href={`${basePath}${makeQuery(page + 1)}`} rel="next" className="btn btn-outline px-3 py-2" aria-label="Next">
          →
        </Link>
      )}
    </nav>
  );
}
