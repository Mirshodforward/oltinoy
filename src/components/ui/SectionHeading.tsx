import type { ReactNode } from "react";

/** Section heading with the signature dashed-gold seam beneath. */
export function SectionHeading({
  title,
  subtitle,
  action,
  as = "h2",
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  as?: "h1" | "h2";
}) {
  const Tag = as;
  return (
    <div className="mb-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <Tag className="text-2xl font-semibold md:text-3xl">{title}</Tag>
          {subtitle && (
            <p className="mt-1.5 max-w-xl text-sm" style={{ color: "var(--color-muted)" }}>
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <div className="seam mt-4 w-24" aria-hidden="true" />
    </div>
  );
}
