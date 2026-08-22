import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

/**
 * Shared masthead for every inner page: breadcrumbs, H1 and an optional intro.
 * Sitting on the cream panel it separates the page's identity from its content
 * and gives the ivory body something to start against.
 */
export function PageHeader({
  crumbs,
  title,
  kicker,
  intro,
  action,
}: {
  crumbs: Crumb[];
  title: string;
  kicker?: ReactNode;
  intro?: string;
  action?: ReactNode;
}) {
  return (
    <div className="panel-cream border-b" style={{ borderColor: "var(--line)" }}>
      <div className="container-page py-8 md:py-12">
        <Breadcrumbs items={crumbs} />
        <div className="mt-5 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            {kicker && <span className="kicker mb-3">{kicker}</span>}
            <h1 className="text-4xl md:text-5xl">{title}</h1>
            {intro && (
              <p className="mt-4 max-w-2xl text-base leading-relaxed" style={{ color: "var(--fg-muted)" }}>
                {intro}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
        <div className="seam mt-7 w-20" aria-hidden="true" />
      </div>
    </div>
  );
}
