import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";

/**
 * Dashboard aggregations.
 *
 * Every figure is a `GROUP BY` over one of the two analytics tables, hitting the
 * `(createdAt)` / `(startedAt)` indexes, so the whole page is a fixed number of
 * indexed scans regardless of how much history has accumulated. Written as raw
 * SQL because Prisma's `groupBy` cannot express `COUNT(DISTINCT …)`, which is
 * exactly what "how many people" means.
 *
 * Timestamps are stored UTC in `timestamp(3)`; day buckets are rendered in
 * Asia/Tashkent so "bugun" means the shop's today, not London's.
 */

const TZ = "Asia/Tashkent";
const TZ_OFFSET_MIN = 300; // UTC+5, no DST

export const RANGES = ["today", "7d", "30d", "90d"] as const;
export type Range = (typeof RANGES)[number];

export const RANGE_UZ: Record<Range, string> = {
  today: "Bugun",
  "7d": "7 kun",
  "30d": "30 kun",
  "90d": "90 kun",
};

function startOfDayTashkent(d: Date): Date {
  const shifted = new Date(d.getTime() + TZ_OFFSET_MIN * 60_000);
  shifted.setUTCHours(0, 0, 0, 0);
  return new Date(shifted.getTime() - TZ_OFFSET_MIN * 60_000);
}

/**
 * Binds an instant for raw SQL against our `timestamp` (no time zone) columns.
 *
 * Prisma binds a JS `Date` as `timestamptz`; Postgres then coerces it to
 * `timestamp` using the *session* time zone, so on a server that is not UTC the
 * bound value silently shifts by the offset and range filters quietly return the
 * wrong rows. Passing an explicit UTC literal removes the session from the
 * equation, and — unlike wrapping the column in `AT TIME ZONE` — leaves the
 * btree index on the column usable.
 */
function utc(d: Date) {
  return Prisma.sql`${d.toISOString().replace("Z", "")}::timestamp`;
}

export type Bounds = { from: Date; to: Date; prevFrom: Date; prevTo: Date; days: number };

/** Current window plus the window immediately before it, for the deltas. */
export function rangeBounds(range: Range, now = new Date()): Bounds {
  const to = now;
  if (range === "today") {
    const from = startOfDayTashkent(now);
    const span = to.getTime() - from.getTime();
    return { from, to, prevFrom: new Date(from.getTime() - 86_400_000), prevTo: new Date(from.getTime() - 86_400_000 + span), days: 1 };
  }
  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  const from = new Date(startOfDayTashkent(now).getTime() - (days - 1) * 86_400_000);
  const span = to.getTime() - from.getTime();
  return { from, to, prevFrom: new Date(from.getTime() - span), prevTo: from, days };
}

export function parseRange(raw: string | undefined): Range {
  return (RANGES as readonly string[]).includes(raw ?? "") ? (raw as Range) : "7d";
}

// ───────────────────────────── KPI ─────────────────────────────

export type Kpi = {
  visitors: number;
  sessions: number;
  pageviews: number;
  events: number;
  avgDuration: number;
  bounceRate: number;
  pagesPerSession: number;
};

async function kpi(from: Date, to: Date): Promise<Kpi> {
  const [row] = await db.$queryRaw<
    { visitors: bigint; sessions: bigint; pageviews: number | null; events: number | null; avg_duration: number | null; bounce: number | null }[]
  >`
    SELECT COUNT(DISTINCT "visitorId")           AS visitors,
           COUNT(*)                              AS sessions,
           COALESCE(SUM("pageviews"), 0)::int    AS pageviews,
           COALESCE(SUM("eventCount"), 0)::int   AS events,
           COALESCE(AVG("durationSec"), 0)::float AS avg_duration,
           COALESCE(AVG(CASE WHEN "pageviews" <= 1 THEN 1.0 ELSE 0.0 END), 0)::float AS bounce
    FROM "AnalyticsSession"
    WHERE "startedAt" >= ${utc(from)} AND "startedAt" < ${utc(to)}
  `;

  const sessions = Number(row?.sessions ?? 0);
  const pageviews = Number(row?.pageviews ?? 0);
  return {
    visitors: Number(row?.visitors ?? 0),
    sessions,
    pageviews,
    events: Number(row?.events ?? 0),
    avgDuration: Math.round(Number(row?.avg_duration ?? 0)),
    bounceRate: Number(row?.bounce ?? 0),
    pagesPerSession: sessions > 0 ? pageviews / sessions : 0,
  };
}

// ─────────────────────────── Series ───────────────────────────

export type Point = { label: string; visitors: number; pageviews: number };

/** Tashkent-local calendar parts of an instant, without pulling in a TZ library. */
function tashkentParts(d: Date) {
  const t = new Date(d.getTime() + TZ_OFFSET_MIN * 60_000);
  return {
    y: t.getUTCFullYear(),
    m: t.getUTCMonth() + 1,
    d: t.getUTCDate(),
    h: t.getUTCHours(),
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Every bucket in the window, including the empty ones.
 *
 * Postgres only returns buckets that have rows, so a quiet Tuesday would simply
 * vanish and the line would join Monday to Wednesday as if nothing had happened.
 * Building the axis here and filling misses with zero keeps the shape honest.
 */
function buckets(from: Date, to: Date, unit: "hour" | "day"): { key: string; label: string }[] {
  const step = unit === "hour" ? 3_600_000 : 86_400_000;
  const out: { key: string; label: string }[] = [];
  // Snap the start onto a bucket boundary in Tashkent time.
  const p0 = tashkentParts(from);
  const startLocal = Date.UTC(p0.y, p0.m - 1, p0.d, unit === "hour" ? p0.h : 0);
  let cursor = startLocal - TZ_OFFSET_MIN * 60_000;

  for (let guard = 0; cursor <= to.getTime() && guard < 2000; guard++, cursor += step) {
    const p = tashkentParts(new Date(cursor));
    out.push(
      unit === "hour"
        ? { key: `${p.y}-${pad(p.m)}-${pad(p.d)} ${pad(p.h)}`, label: `${pad(p.h)}:00` }
        : { key: `${p.y}-${pad(p.m)}-${pad(p.d)}`, label: `${pad(p.d)}.${pad(p.m)}` },
    );
  }
  return out;
}

/**
 * Today is read hour by hour, longer ranges day by day.
 *
 * Visitors are counted from session starts; pageviews from the events themselves,
 * because a session that begins at 23:58 and runs past midnight would otherwise
 * dump all of its pageviews onto the wrong day.
 */
async function series(from: Date, to: Date, range: Range): Promise<Point[]> {
  const unit = range === "today" ? "hour" : "day";
  const fmt = unit === "hour" ? "YYYY-MM-DD HH24" : "YYYY-MM-DD";

  // One date_trunc per statement: repeating it would emit two separate bind
  // parameters, which Postgres cannot match against the GROUP BY.
  const [visitorRows, viewRows] = await Promise.all([
    db.$queryRaw<{ key: string; visitors: bigint }[]>`
      SELECT to_char(bucket, ${fmt}) AS key, visitors
      FROM (
        SELECT date_trunc(${unit}, ("startedAt" AT TIME ZONE 'UTC') AT TIME ZONE ${TZ}) AS bucket,
               COUNT(DISTINCT "visitorId") AS visitors
        FROM "AnalyticsSession"
        WHERE "startedAt" >= ${utc(from)} AND "startedAt" < ${utc(to)}
        GROUP BY 1
      ) t
      ORDER BY bucket
    `,
    db.$queryRaw<{ key: string; pageviews: bigint }[]>`
      SELECT to_char(bucket, ${fmt}) AS key, pageviews
      FROM (
        SELECT date_trunc(${unit}, ("createdAt" AT TIME ZONE 'UTC') AT TIME ZONE ${TZ}) AS bucket,
               COUNT(*) AS pageviews
        FROM "AnalyticsEvent"
        WHERE "kind" = 'pageview' AND "createdAt" >= ${utc(from)} AND "createdAt" < ${utc(to)}
        GROUP BY 1
      ) t
      ORDER BY bucket
    `,
  ]);

  const visitors = new Map(visitorRows.map((r) => [r.key, Number(r.visitors)]));
  const views = new Map(viewRows.map((r) => [r.key, Number(r.pageviews)]));

  return buckets(from, to, unit).map((b) => ({
    label: b.label,
    visitors: visitors.get(b.key) ?? 0,
    pageviews: views.get(b.key) ?? 0,
  }));
}

// ───────────────────────── Breakdowns ─────────────────────────

export type Row = { key: string; visitors: number; sessions: number };

/** Columns the dashboard is allowed to group by — never interpolate user input. */
const GROUPABLE = [
  "refType",
  "refHost",
  "utmSource",
  "utmMedium",
  "utmCampaign",
  "country",
  "device",
  "os",
  "browser",
  "locale",
] as const;
export type Groupable = (typeof GROUPABLE)[number];

async function breakdown(column: Groupable, from: Date, to: Date, limit = 8): Promise<Row[]> {
  if (!GROUPABLE.includes(column)) return [];
  const col = Prisma.raw(`"${column}"`);

  const rows = await db.$queryRaw<{ key: string | null; visitors: bigint; sessions: bigint }[]>`
    SELECT ${col} AS key,
           COUNT(DISTINCT "visitorId") AS visitors,
           COUNT(*)                    AS sessions
    FROM "AnalyticsSession"
    WHERE "startedAt" >= ${utc(from)} AND "startedAt" < ${utc(to)} AND ${col} IS NOT NULL AND ${col} <> ''
    GROUP BY ${col}
    ORDER BY visitors DESC, sessions DESC
    LIMIT ${limit}
  `;

  return rows.map((r) => ({ key: r.key ?? "—", visitors: Number(r.visitors), sessions: Number(r.sessions) }));
}

// ─────────────────────── Pages / clicks ───────────────────────

export type PageRow = { path: string; views: number; sessions: number };

/**
 * `/uz/katalog` and `/ru/katalog` are the same page in two languages. Folding the
 * locale away here — rather than when rendering — keeps one row per page with a
 * correct total; which language people read is its own report.
 */
const PAGE_KEY = Prisma.raw(
  `COALESCE(NULLIF(regexp_replace("path", '^/(uz|ru)($|/)', '\\2'), ''), '/')`,
);

async function topPages(from: Date, to: Date, limit = 12): Promise<PageRow[]> {
  const rows = await db.$queryRaw<{ path: string; views: bigint; sessions: bigint }[]>`
    SELECT ${PAGE_KEY} AS path, COUNT(*) AS views, COUNT(DISTINCT "sessionId") AS sessions
    FROM "AnalyticsEvent"
    WHERE "kind" = 'pageview' AND "createdAt" >= ${utc(from)} AND "createdAt" < ${utc(to)}
    GROUP BY 1
    ORDER BY views DESC
    LIMIT ${limit}
  `;
  return rows.map((r) => ({ path: r.path, views: Number(r.views), sessions: Number(r.sessions) }));
}

/** Where sessions began, folded the same way. */
async function topLandings(from: Date, to: Date, limit = 8): Promise<Row[]> {
  const key = Prisma.raw(
    `COALESCE(NULLIF(regexp_replace("landingPath", '^/(uz|ru)($|/)', '\\2'), ''), '/')`,
  );
  const rows = await db.$queryRaw<{ key: string; visitors: bigint; sessions: bigint }[]>`
    SELECT ${key} AS key, COUNT(DISTINCT "visitorId") AS visitors, COUNT(*) AS sessions
    FROM "AnalyticsSession"
    WHERE "startedAt" >= ${utc(from)} AND "startedAt" < ${utc(to)}
    GROUP BY 1
    ORDER BY visitors DESC
    LIMIT ${limit}
  `;
  return rows.map((r) => ({ key: r.key, visitors: Number(r.visitors), sessions: Number(r.sessions) }));
}

export type ActionRow = { name: string; count: number; sessions: number };

async function topActions(kind: "click" | "custom", from: Date, to: Date, limit = 12): Promise<ActionRow[]> {
  const rows = await db.$queryRaw<{ name: string; count: bigint; sessions: bigint }[]>`
    SELECT "name", COUNT(*) AS count, COUNT(DISTINCT "sessionId") AS sessions
    FROM "AnalyticsEvent"
    WHERE "kind" = ${kind} AND "createdAt" >= ${utc(from)} AND "createdAt" < ${utc(to)}
    GROUP BY "name"
    ORDER BY count DESC
    LIMIT ${limit}
  `;
  return rows.map((r) => ({ name: r.name, count: Number(r.count), sessions: Number(r.sessions) }));
}

export type ProductRow = { id: number | null; slug: string; name: string; views: number };

/** Product interest, measured on the product page itself. */
async function topProducts(from: Date, to: Date, limit = 10): Promise<ProductRow[]> {
  const rows = await db.$queryRaw<{ slug: string; views: bigint }[]>`
    SELECT split_part("path", '/mahsulot/', 2) AS slug, COUNT(*) AS views
    FROM "AnalyticsEvent"
    WHERE "kind" = 'pageview' AND "path" LIKE '%/mahsulot/%'
      AND "createdAt" >= ${utc(from)} AND "createdAt" < ${utc(to)}
    GROUP BY 1
    HAVING split_part("path", '/mahsulot/', 2) <> ''
    ORDER BY views DESC
    LIMIT ${limit}
  `;
  if (rows.length === 0) return [];

  const products = await db.product.findMany({
    where: { slug: { in: rows.map((r) => r.slug) } },
    select: { id: true, slug: true, nameUz: true },
  });
  const bySlug = new Map(products.map((p) => [p.slug, p]));

  return rows.map((r) => {
    const p = bySlug.get(r.slug);
    return { id: p?.id ?? null, slug: r.slug, name: p?.nameUz ?? r.slug, views: Number(r.views) };
  });
}

// ───────────────────────────── Live ─────────────────────────────

export type Live = { visitors: number; pages: { path: string; count: number }[] };

/** Who is on the site right now — a 5-minute window on `lastSeenAt`. */
export async function getLive(): Promise<Live> {
  const since = new Date(Date.now() - 5 * 60_000);
  const [[count], pages] = await Promise.all([
    db.$queryRaw<{ visitors: bigint }[]>`
      SELECT COUNT(DISTINCT "visitorId") AS visitors
      FROM "AnalyticsSession" WHERE "lastSeenAt" >= ${utc(since)}
    `,
    db.$queryRaw<{ path: string | null; count: bigint }[]>`
      SELECT "exitPath" AS path, COUNT(*) AS count
      FROM "AnalyticsSession" WHERE "lastSeenAt" >= ${utc(since)}
      GROUP BY "exitPath" ORDER BY count DESC LIMIT 6
    `,
  ]);
  return {
    visitors: Number(count?.visitors ?? 0),
    pages: pages.map((p) => ({ path: p.path ?? "/", count: Number(p.count) })),
  };
}

// ─────────────────────────── Overview ───────────────────────────

export type Overview = {
  range: Range;
  bounds: Bounds;
  kpi: Kpi;
  prev: Kpi;
  series: Point[];
  pages: PageRow[];
  clicks: ActionRow[];
  customEvents: ActionRow[];
  products: ProductRow[];
  sources: Row[];
  referrers: Row[];
  campaigns: Row[];
  countries: Row[];
  devices: Row[];
  browsers: Row[];
  systems: Row[];
  languages: Row[];
  landings: Row[];
  live: Live;
};

/** One round of parallel queries backs the whole page. */
export async function getOverview(range: Range): Promise<Overview> {
  const bounds = rangeBounds(range);
  const { from, to, prevFrom, prevTo } = bounds;

  const [
    current, prev, points, pages, clicks, customEvents, products,
    sources, referrers, campaigns, countries, devices, browsers, systems, languages, landings, live,
  ] = await Promise.all([
    kpi(from, to),
    kpi(prevFrom, prevTo),
    series(from, to, range),
    topPages(from, to),
    topActions("click", from, to),
    topActions("custom", from, to),
    topProducts(from, to),
    breakdown("refType", from, to, 6),
    breakdown("refHost", from, to, 8),
    breakdown("utmCampaign", from, to, 6),
    breakdown("country", from, to, 8),
    breakdown("device", from, to, 4),
    breakdown("browser", from, to, 6),
    breakdown("os", from, to, 6),
    breakdown("locale", from, to, 4),
    topLandings(from, to, 8),
    getLive(),
  ]);

  return {
    range, bounds, kpi: current, prev, series: points, pages, clicks, customEvents,
    products, sources, referrers, campaigns, countries, devices, browsers, systems,
    languages, landings, live,
  };
}
