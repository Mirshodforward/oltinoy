import { Link } from "@/i18n/navigation";

export type Crumb = { name: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs" style={{ color: "var(--color-muted)" }}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1.5">
              {c.href && !last ? (
                <Link href={c.href} className="hover:text-[var(--color-ink)]">
                  {c.name}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} style={{ color: last ? "var(--color-ink)" : undefined }}>
                  {c.name}
                </span>
              )}
              {!last && <span aria-hidden="true">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
