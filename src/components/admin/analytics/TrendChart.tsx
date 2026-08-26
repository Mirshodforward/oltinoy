"use client";

import { useId, useMemo, useRef, useState } from "react";
import { formatCount } from "@/lib/analytics/format";

/**
 * One measure over time.
 *
 * Deliberately a single series per chart. Visitors and pageviews live on
 * different scales, and putting them on one plot would either need two y-axes —
 * which invents a correlation the data does not contain — or squash the smaller
 * series flat. So the page renders small multiples instead: same x, same shape,
 * one measure each, compared by eye across two cards.
 *
 * The mark colour is the brand's text-safe gold nudged just over the chroma
 * floor, so it reads as gold rather than grey at hairline weights.
 */

const MARK = "#a37310";
const W = 720;
const H = 176;
const PAD = { top: 14, right: 10, bottom: 22, left: 10 };

export type ChartPoint = { label: string; value: number };

export function TrendChart({
  points,
  title,
  unit,
}: {
  points: ChartPoint[];
  title: string;
  unit: string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  // Never build an SVG id out of a label: the Uzbek unit names carry apostrophes,
  // which make `url(#…)` unresolvable and silently paint the area black.
  const fillId = `oa-fill-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  const geom = useMemo(() => {
    const max = Math.max(...points.map((p) => p.value), 1);
    const innerW = W - PAD.left - PAD.right;
    const innerH = H - PAD.top - PAD.bottom;
    const step = points.length > 1 ? innerW / (points.length - 1) : 0;

    const xy = points.map((p, i) => ({
      x: PAD.left + (points.length > 1 ? i * step : innerW / 2),
      y: PAD.top + innerH - (p.value / max) * innerH,
    }));

    const line = xy.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
    const base = PAD.top + innerH;
    const area = xy.length
      ? `${line} L${xy[xy.length - 1]!.x.toFixed(1)},${base} L${xy[0]!.x.toFixed(1)},${base} Z`
      : "";

    // Label the peak, not every point — one number is a reference, twenty is noise.
    const peak = points.reduce((best, p, i) => (p.value > points[best]!.value ? i : best), 0);

    return { max, xy, line, area, base, innerH, peak };
  }, [points]);

  const total = points.reduce((sum, p) => sum + p.value, 0);
  if (points.length === 0 || total === 0) {
    return (
      <div>
        <ChartHeader title={title} total={0} unit={unit} />
        <p className="py-12 text-center text-sm" style={{ color: "var(--fg-muted)" }}>
          Bu davr uchun ma&apos;lumot yo&apos;q
        </p>
      </div>
    );
  }

  /** Nearest point to the pointer, in viewBox space. */
  function onMove(e: React.MouseEvent<SVGSVGElement>) {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect || points.length === 0) return;
    const x = ((e.clientX - rect.left) / rect.width) * W;
    let nearest = 0;
    let best = Infinity;
    for (let i = 0; i < geom.xy.length; i++) {
      const d = Math.abs(geom.xy[i]!.x - x);
      if (d < best) {
        best = d;
        nearest = i;
      }
    }
    setHover(nearest);
  }

  const active = hover !== null ? geom.xy[hover] : null;
  const activePoint = hover !== null ? points[hover] : null;

  // Thin x labels so they never collide, whatever the range length.
  const every = Math.max(1, Math.ceil(points.length / 8));

  return (
    <div>
      <ChartHeader title={title} total={total} unit={unit} />

      <div className="relative mt-3">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          style={{ height: "auto" }}
          role="img"
          aria-label={`${title}: ${formatCount(total)} ${unit}`}
          onMouseMove={onMove}
          onMouseLeave={() => setHover(null)}
        >
          <defs>
            <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={MARK} stopOpacity="0.20" />
              <stop offset="100%" stopColor={MARK} stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Recessive grid: solid hairlines, never dashes. */}
          {[0, 0.5, 1].map((t) => {
            const y = PAD.top + geom.innerH * t;
            return <line key={t} x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke="var(--line)" strokeWidth="1" />;
          })}

          <path d={geom.area} fill={`url(#${fillId})`} />
          <path d={geom.line} fill="none" stroke={MARK} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

          {/* The peak, labelled directly. */}
          {hover === null && (
            <>
              <circle cx={geom.xy[geom.peak]!.x} cy={geom.xy[geom.peak]!.y} r="4" fill={MARK} stroke="var(--surface)" strokeWidth="2" />
              <text
                x={Math.min(Math.max(geom.xy[geom.peak]!.x, 24), W - 24)}
                y={Math.max(geom.xy[geom.peak]!.y - 10, 12)}
                textAnchor="middle"
                fontSize="12"
                fontWeight="700"
                fill="var(--fg)"
                /* A surface-coloured halo so the peak figure stays legible where
                   it crosses the line it labels. */
                stroke="var(--surface)"
                strokeWidth="3"
                paintOrder="stroke"
              >
                {formatCount(points[geom.peak]!.value)}
              </text>
            </>
          )}

          {/* Crosshair */}
          {active && (
            <>
              <line x1={active.x} y1={PAD.top} x2={active.x} y2={geom.base} stroke="var(--fg-subtle)" strokeWidth="1" />
              <circle cx={active.x} cy={active.y} r="5" fill={MARK} stroke="var(--surface)" strokeWidth="2" />
            </>
          )}

          {points.map((p, i) =>
            i % every === 0 ? (
              <text
                key={p.label + i}
                x={geom.xy[i]!.x}
                y={H - 6}
                /* Anchor the end labels inward so neither is cut off at the edge. */
                textAnchor={i === 0 ? "start" : i >= points.length - every ? "end" : "middle"}
                fontSize="11"
                fill="var(--fg-subtle)"
              >
                {p.label}
              </text>
            ) : null,
          )}
        </svg>

        {activePoint && active && (
          <div
            className="pointer-events-none absolute -translate-x-1/2 rounded-md border px-2.5 py-1.5 text-xs shadow-sm"
            style={{
              left: `${(active.x / W) * 100}%`,
              top: 0,
              background: "var(--surface)",
              borderColor: "var(--line)",
              whiteSpace: "nowrap",
            }}
          >
            <span className="font-semibold">{activePoint.label}</span>
            <span className="ml-2 font-bold tabular-nums" style={{ color: MARK }}>
              {formatCount(activePoint.value)}
            </span>
            <span className="ml-1" style={{ color: "var(--fg-subtle)" }}>
              {unit}
            </span>
          </div>
        )}
      </div>

      {/* The same series as numbers, for screen readers and for copying out. */}
      <details className="mt-2">
        <summary className="cursor-pointer text-xs" style={{ color: "var(--fg-subtle)" }}>
          Jadval ko&apos;rinishida
        </summary>
        <table className="mt-2 w-full text-xs tabular-nums">
          <thead>
            <tr style={{ color: "var(--fg-subtle)" }}>
              <th className="py-1 text-left font-semibold">Davr</th>
              <th className="py-1 text-right font-semibold">{unit}</th>
            </tr>
          </thead>
          <tbody>
            {points.map((p, i) => (
              <tr key={p.label + i}>
                <td className="py-0.5">{p.label}</td>
                <td className="py-0.5 text-right">{formatCount(p.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}

function ChartHeader({ title, total, unit }: { title: string; total: number; unit: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <h3 className="text-2xs font-bold uppercase tracking-[0.16em]" style={{ color: "var(--fg-muted)" }}>
        {title}
      </h3>
      <span className="text-sm tabular-nums" style={{ color: "var(--fg-subtle)" }}>
        jami {formatCount(total)} {unit}
      </span>
    </div>
  );
}
