import { db } from "@/lib/db";
import { env } from "@/lib/env";
import type { Prisma } from "@prisma/client";

/**
 * Write buffer for the collector.
 *
 * A busy product page fires a pageview, a scroll event and two or three clicks.
 * Writing each one straight through would be one round-trip per interaction on a
 * box that also serves the storefront. Instead every hit lands in memory and the
 * buffer flushes on a timer (or when it fills), collapsing a burst into a single
 * `createMany` plus one upsert per distinct session.
 *
 * This is safe because the app runs as a single long-lived Node process under
 * PM2. The trade-off is bounded: at most FLUSH_MS of hits are lost if the process
 * is killed mid-window, which for analytics is an acceptable price. `flushNow()`
 * is exported so a graceful shutdown can drain the queue.
 */

const FLUSH_MS = 2_000;
const FLUSH_AT = 50; // events buffered before an early flush
const MAX_QUEUE = 5_000; // hard backstop against unbounded growth

/** Context captured once, when a session is first seen. */
export type SessionSeed = {
  id: string;
  visitorId: string;
  landingPath: string;
  referrer: string | null;
  refHost: string | null;
  refType: string;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmTerm: string | null;
  utmContent: string | null;
  country: string | null;
  device: string;
  os: string | null;
  browser: string | null;
  screenW: number | null;
  locale: string | null;
  isTelegram: boolean;
};

export type PendingEvent = {
  sessionId: string;
  kind: string;
  name: string;
  path: string;
  productId: number | null;
  meta: Prisma.InputJsonValue | undefined;
};

type SessionDelta = {
  seed: SessionSeed;
  pageviews: number;
  eventCount: number;
  durationSec: number;
  exitPath: string;
};

let queue: PendingEvent[] = [];
let deltas = new Map<string, SessionDelta>();
let timer: ReturnType<typeof setTimeout> | null = null;
let flushing = false;
let lastSweep = 0;

const RETENTION_DAYS = env.ANALYTICS_RETENTION_DAYS;
const SWEEP_MS = 6 * 60 * 60 * 1000; // prune at most every 6h

export function enqueue(seed: SessionSeed, events: PendingEvent[], durationSec: number) {
  if (queue.length >= MAX_QUEUE) return; // shed load rather than grow without bound

  const delta = deltas.get(seed.id) ?? {
    seed,
    pageviews: 0,
    eventCount: 0,
    durationSec: 0,
    exitPath: seed.landingPath,
  };

  for (const e of events) {
    if (e.kind === "pageview") delta.pageviews += 1;
    else delta.eventCount += 1;
    delta.exitPath = e.path;
  }
  delta.durationSec = Math.max(delta.durationSec, durationSec);
  deltas.set(seed.id, delta);
  queue.push(...events);

  if (queue.length >= FLUSH_AT) {
    void flushNow();
    return;
  }
  if (!timer) {
    timer = setTimeout(() => void flushNow(), FLUSH_MS);
    if (typeof timer.unref === "function") timer.unref();
  }
}

/** Drains the buffer into Postgres. Safe to call concurrently — reentry is skipped. */
export async function flushNow(): Promise<void> {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  if (flushing || (queue.length === 0 && deltas.size === 0)) return;

  flushing = true;
  const events = queue;
  const sessions = deltas;
  queue = [];
  deltas = new Map();

  try {
    // Sessions first: the events carry a foreign key onto them.
    for (const d of sessions.values()) {
      await db.analyticsSession.upsert({
        where: { id: d.seed.id },
        create: {
          ...d.seed,
          exitPath: d.exitPath,
          pageviews: d.pageviews,
          eventCount: d.eventCount,
          durationSec: d.durationSec,
        },
        update: {
          lastSeenAt: new Date(),
          exitPath: d.exitPath,
          pageviews: { increment: d.pageviews },
          eventCount: { increment: d.eventCount },
          // The client clock owns duration; never let it walk backwards.
          durationSec: d.durationSec,
        },
      });
    }

    if (events.length > 0) {
      await db.analyticsEvent.createMany({ data: events });
    }
  } catch {
    // A dropped analytics batch must never surface to a visitor or crash the
    // process — the collector already answered 204.
  } finally {
    flushing = false;
  }

  void sweep();
}

/** Opportunistic retention pruning; sessions cascade to their events. */
async function sweep(): Promise<void> {
  const now = Date.now();
  if (!RETENTION_DAYS || now - lastSweep < SWEEP_MS) return;
  lastSweep = now;
  const cutoff = new Date(now - RETENTION_DAYS * 24 * 60 * 60 * 1000);
  try {
    await db.analyticsSession.deleteMany({ where: { startedAt: { lt: cutoff } } });
  } catch {
    // best-effort
  }
}
