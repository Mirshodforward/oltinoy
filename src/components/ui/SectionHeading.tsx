import type { ReactNode } from "react";

/**
 * Section header: small-caps kicker, display title, optional supporting line
 * and a trailing action. The gold seam under the title is the through-line that
 * ties every section of the site together.
 */
export function SectionHeading({
  kicker,
  title,
  subtitle,
  action,
  as = "h2",
  align = "start",
  className = "",
}: {
  kicker?: ReactNode;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  as?: "h1" | "h2";
  align?: "start" | "center";
  className?: string;
}) {
  const Tag = as;
  const centered = align === "center";

  return (
    <div className={`mb-8 md:mb-10 ${centered ? "text-center" : ""} ${className}`}>
      <div
        className={`flex gap-6 ${
          centered ? "flex-col items-center" : "flex-col items-start md:flex-row md:items-end md:justify-between"
        }`}
      >
        <div className="max-w-2xl">
          {kicker && <span className={`kicker ${centered ? "kicker-center" : ""}`}>{kicker}</span>}
          <Tag className={`text-3xl md:text-4xl ${kicker ? "mt-3.5" : ""}`}>{title}</Tag>
          {subtitle && (
            <p className="mt-3 text-base leading-relaxed" style={{ color: "var(--fg-muted)" }}>
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <div className={`seam mt-6 w-20 ${centered ? "mx-auto" : ""}`} aria-hidden="true" />
    </div>
  );
}
