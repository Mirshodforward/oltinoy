import Link from "next/link";
import { RANGES, RANGE_UZ, type Range } from "@/lib/analytics/queries";

/**
 * The time filter, in one row above the charts. Plain links — the range lives in
 * the URL, so a view is shareable and the back button does what it should.
 */
export function RangeTabs({ current }: { current: Range }) {
  return (
    <div className="rail no-scrollbar" role="group" aria-label="Davr">
      {RANGES.map((r) => {
        const active = r === current;
        return (
          <Link
            key={r}
            href={`/admin/analitika?range=${r}`}
            aria-current={active ? "true" : undefined}
            className={[
              "flex min-h-11 items-center whitespace-nowrap rounded-md border px-4 text-sm font-semibold transition-colors duration-200",
              active ? "bg-ink text-ivory" : "hover:bg-[var(--color-cream)]",
            ].join(" ")}
            style={active ? { borderColor: "var(--color-ink)" } : { borderColor: "var(--line)", color: "var(--fg-muted)" }}
          >
            {RANGE_UZ[r]}
          </Link>
        );
      })}
    </div>
  );
}
