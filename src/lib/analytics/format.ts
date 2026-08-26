/** Shared number/label formatting for the analytics dashboard. */

export function formatCount(n: number): string {
  return n.toLocaleString("uz-UZ");
}

/** Compact enough to stay on one line inside a stat tile. */
export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)} s`;
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return s === 0 ? `${m} daq` : `${m} daq ${s} s`;
}

export function formatPercent(fraction: number): string {
  return `${(fraction * 100).toFixed(fraction < 0.1 ? 1 : 0)}%`;
}

/** Percentage change against the previous window, or null when there is no base. */
export function delta(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null;
  return ((current - previous) / previous) * 100;
}

/** `/uz/mahsulot/oq-abaya` → `/mahsulot/oq-abaya` — the locale is its own report. */
export function stripLocale(path: string): string {
  return path.replace(/^\/(uz|ru)(?=\/|$)/, "") || "/";
}
