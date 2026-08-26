import { formatCount } from "@/lib/analytics/format";

/** Right now, on the site — a live count with a quietly pulsing sage dot. */
export function LiveBadge({ visitors }: { visitors: number }) {
  const live = visitors > 0;
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold"
      style={{ borderColor: "var(--line)", color: live ? "var(--fg)" : "var(--fg-muted)" }}
    >
      <span
        className={live ? "animate-pulse" : ""}
        style={{
          width: 8,
          height: 8,
          borderRadius: 999,
          background: live ? "var(--color-sage)" : "var(--color-taupe)",
          display: "inline-block",
        }}
        aria-hidden="true"
      />
      Hozir saytda: {formatCount(visitors)}
    </span>
  );
}
