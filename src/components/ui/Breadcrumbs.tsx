import { Link } from "@/i18n/navigation";
import { ChevronRight } from "./icons";

export type Crumb = { name: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1">
              {c.href && !last ? (
                <Link
                  href={c.href}
                  className="-my-2 inline-flex min-h-[44px] items-center rounded px-1 transition-colors hover:text-ink"
                  style={{ color: "var(--fg-subtle)" }}
                >
                  {c.name}
                </Link>
              ) : (
                <span
                  aria-current={last ? "page" : undefined}
                  className="px-1 py-0.5 font-semibold"
                  style={{ color: last ? "var(--fg)" : "var(--fg-subtle)" }}
                >
                  {c.name}
                </span>
              )}
              {!last && <ChevronRight size={13} style={{ color: "var(--fg-subtle)", opacity: 0.6 }} />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
