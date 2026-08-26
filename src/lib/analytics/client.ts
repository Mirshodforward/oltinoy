"use client";

/**
 * Browser-side collector.
 *
 * Identity is first-party and storage-based, never a cookie: `vid` is a random
 * id kept in localStorage (returning visitors), `sid` is the same idea with a
 * 30-minute inactivity window (sessions, matching GA's rule). Nothing here is
 * shared with a third party and nothing leaves this origin.
 *
 * Hits are queued and flushed in batches — on a timer, when the queue fills, and
 * unconditionally when the page is hidden, which is the only moment guaranteed
 * to happen before a tab closes.
 */

const ENDPOINT = "/api/analytics/collect";
const SESSION_TTL_MS = 30 * 60 * 1000;
const FLUSH_MS = 5_000;
const FLUSH_AT = 8;

const K = {
  vid: "oa_vid",
  sid: "oa_sid",
  exp: "oa_exp",
  start: "oa_start",
  ctx: "oa_ctx",
} as const;

type Ctx = { r: string | null; u: string; sw: number | null; l: string | null };
type QueuedEvent = {
  k: "pageview" | "click" | "custom";
  n: string;
  p: string;
  pid?: number | null;
  m?: Record<string, string | number | boolean> | null;
};

/** localStorage throws in Safari private mode and some in-app WebViews. */
const store = {
  get(key: string): string | null {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return memory.get(key) ?? null;
    }
  },
  set(key: string, value: string) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      memory.set(key, value);
    }
  },
};
const memory = new Map<string, string>();

function uid(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
  }
}

function freshCtx(): Ctx {
  const ref = document.referrer || null;
  return {
    // A same-origin referrer is our own previous page, not an acquisition source.
    r: ref && !ref.startsWith(window.location.origin) ? ref : null,
    u: window.location.href.slice(0, 600),
    sw: window.screen?.width ?? null,
    l: document.documentElement.lang || null,
  };
}

type Identity = { sid: string; vid: string; sd: number; ctx: Ctx };

/** Reads (or rotates) the session, and refreshes its idle deadline. */
function identity(): Identity {
  const now = Date.now();

  let vid = store.get(K.vid);
  if (!vid) {
    vid = uid();
    store.set(K.vid, vid);
  }

  let sid = store.get(K.sid);
  let start = Number(store.get(K.start) ?? 0);
  const expired = Number(store.get(K.exp) ?? 0) < now;

  let ctxRaw = store.get(K.ctx);
  if (!sid || expired || !start) {
    sid = uid();
    start = now;
    ctxRaw = JSON.stringify(freshCtx());
    store.set(K.sid, sid);
    store.set(K.start, String(start));
    store.set(K.ctx, ctxRaw);
  }
  store.set(K.exp, String(now + SESSION_TTL_MS));

  let ctx: Ctx;
  try {
    ctx = JSON.parse(ctxRaw!) as Ctx;
  } catch {
    ctx = freshCtx();
  }

  return { sid, vid, sd: Math.min(Math.floor((now - start) / 1000), 86_400), ctx };
}

let queue: QueuedEvent[] = [];
let timer: ReturnType<typeof setTimeout> | null = null;

function send(events: QueuedEvent[], beacon: boolean) {
  const { sid, vid, sd, ctx } = identity();
  const body = JSON.stringify({ v: 1, sid, vid, sd, ctx, e: events });

  try {
    if (beacon && navigator.sendBeacon) {
      navigator.sendBeacon(ENDPOINT, new Blob([body], { type: "application/json" }));
      return;
    }
    void fetch(ENDPOINT, {
      method: "POST",
      body,
      keepalive: true,
      headers: { "Content-Type": "application/json" },
    }).catch(() => {});
  } catch {
    // analytics must never throw into the page
  }
}

export function flush(beacon = false) {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  if (queue.length === 0) return;
  const batch = queue.slice(0, 40);
  queue = queue.slice(40);
  send(batch, beacon);
  if (queue.length > 0) flush(beacon);
}

function push(event: QueuedEvent) {
  if (typeof window === "undefined") return;
  if (window.location.pathname.startsWith("/admin")) return;

  // Establish the session — and freeze its context — at the first hit, not at
  // flush time. The queue can still be draining five seconds later, by which
  // point a client-side navigation would have moved `location.href` on and the
  // session would be filed under the wrong landing page.
  identity();

  queue.push(event);
  if (queue.length >= FLUSH_AT) {
    flush();
    return;
  }
  if (!timer) timer = setTimeout(() => flush(), FLUSH_MS);
}

export function trackPageview(path: string, title: string) {
  push({ k: "pageview", n: title.slice(0, 160), p: path });
}

export function trackClick(label: string, path: string, productId?: number | null, meta?: QueuedEvent["m"]) {
  push({ k: "click", n: label, p: path, pid: productId ?? null, m: meta ?? null });
}

/**
 * Records a named business event — "bron_yuborildi", "telefon_bosildi".
 * Safe to call from any client component.
 */
export function track(name: string, meta?: Record<string, string | number | boolean>) {
  push({
    k: "custom",
    n: name.slice(0, 160),
    p: typeof window === "undefined" ? "/" : window.location.pathname,
    m: meta ?? null,
  });
}
