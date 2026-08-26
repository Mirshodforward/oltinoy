import type { ReactElement, ReactNode } from "react";
import type { IconProps } from "@/components/ui/icons";
import { Moon } from "@/components/ui/icons";
import { formatCount } from "@/lib/analytics/format";

export { delta, formatCount, formatDuration, formatPercent } from "@/lib/analytics/format";

/**
 * One measurement, in the same dress the dashboard tiles wear: the number in the
 * display face, a small-caps label, the glyph in a cream disc, a seam on top.
 * The delta chip is the only addition — sage when up, danger when down.
 */
export function KpiCard({
  icon: Icon,
  label,
  value,
  hint,
  change,
  invertChange = false,
}: {
  icon: (p: IconProps) => ReactElement;
  label: string;
  value: string | number;
  hint?: string;
  change?: number | null;
  /** For metrics where lower is better (bounce rate). */
  invertChange?: boolean;
}) {
  const up = typeof change === "number" && change > 0;
  const good = typeof change === "number" && change !== 0 && (invertChange ? !up : up);

  return (
    <div className="card p-5">
      <span className="seam absolute inset-x-0 top-0" aria-hidden="true" />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p
            className="text-2xs font-bold uppercase leading-tight tracking-[0.12em]"
            style={{ color: "var(--fg-muted)", minHeight: "2.1em" }}
          >
            {label}
          </p>
          <p className="price mt-1 whitespace-nowrap text-3xl">{value}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            {typeof change === "number" && change !== 0 && (
              <span
                className="text-xs font-bold tabular-nums"
                style={{ color: good ? "var(--color-sage)" : "var(--color-danger)" }}
              >
                {up ? "▲" : "▼"} {Math.abs(change).toFixed(0)}%
              </span>
            )}
            {hint && (
              <span className="text-xs" style={{ color: "var(--fg-subtle)" }}>
                {hint}
              </span>
            )}
          </div>
        </div>
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
          style={{ background: "var(--color-cream)", color: "var(--color-gold-dk)" }}
        >
          <Icon size={19} />
        </span>
      </div>
    </div>
  );
}

export function EmptyLine({ text = "Ma'lumot yo'q" }: { text?: string }) {
  return (
    <div className="py-10 text-center">
      <Moon size={26} className="mx-auto text-gold" />
      <p className="mt-3 text-sm" style={{ color: "var(--fg-muted)" }}>
        {text}
      </p>
    </div>
  );
}

export function Panel({
  icon: Icon,
  title,
  hint,
  children,
}: {
  icon: (p: IconProps) => ReactElement;
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <section className="card p-5 md:p-6">
      <div className="flex items-center gap-2.5">
        <Icon size={18} style={{ color: "var(--color-gold-dk)" }} />
        <h2 className="text-xl">{title}</h2>
      </div>
      {hint && (
        <p className="mt-1.5 text-xs" style={{ color: "var(--fg-subtle)" }}>
          {hint}
        </p>
      )}
      <div className="hairline mt-4" />
      {children}
    </section>
  );
}

/**
 * A ranked list where each row carries its own share as a soft cream bar behind
 * the label — the proportion is readable without a second axis or a legend.
 */
export function BarList({
  rows,
  unitLabel = "tashrifchi",
  empty,
}: {
  rows: { key: string; value: number; sub?: string; href?: string }[];
  unitLabel?: string;
  empty?: string;
}) {
  if (rows.length === 0) return <EmptyLine text={empty} />;
  const max = Math.max(...rows.map((r) => r.value), 1);

  return (
    <ul className="mt-1">
      {rows.map((r) => (
        <li key={r.key} className="relative py-2">
          <span
            className="absolute inset-y-1 left-0 rounded-sm"
            style={{ width: `${(r.value / max) * 100}%`, background: "var(--color-cream)" }}
            aria-hidden="true"
          />
          <div className="relative flex items-center justify-between gap-3 px-2">
            <span className="min-w-0 truncate text-sm font-semibold" title={r.key}>
              {r.key}
            </span>
            <span className="flex shrink-0 items-center gap-2">
              {r.sub && (
                <span className="text-xs tabular-nums" style={{ color: "var(--fg-subtle)" }}>
                  {r.sub}
                </span>
              )}
              <span className="text-sm font-bold tabular-nums" title={`${formatCount(r.value)} ${unitLabel}`}>
                {formatCount(r.value)}
              </span>
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
