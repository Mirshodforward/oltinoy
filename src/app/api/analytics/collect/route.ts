import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";
import { rateLimit, clientIp } from "@/lib/ratelimit";
import { parseUa } from "@/lib/analytics/ua";
import { classifyReferrer, parseUtm } from "@/lib/analytics/referrer";
import { enqueue, type PendingEvent, type SessionSeed } from "@/lib/analytics/ingest";
import { batchSchema } from "@/lib/analytics/wire";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Set by Cloudflare / nginx GeoIP2 when available; null otherwise. */
function country(headers: Headers): string | null {
  const raw =
    headers.get("cf-ipcountry") ??
    headers.get("x-country-code") ??
    headers.get("x-geoip-country") ??
    headers.get("x-vercel-ip-country");
  if (!raw || raw === "XX" || raw === "T1") return null;
  return raw.toUpperCase().slice(0, 2);
}

/** Query strings are recorded as UTM fields, never as part of the page identity. */
function normalisePath(raw: string): string {
  const path = raw.split("?")[0]!.split("#")[0]!.slice(0, 300);
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
  return path || "/";
}

/**
 * Collector. Answers 204 unconditionally and as early as possible: a visitor's
 * page must never wait on, or be affected by, analytics.
 */
export async function POST(req: NextRequest) {
  const ip = clientIp(req.headers);
  // Generous — one active tab flushes a handful of batches per minute.
  if (!rateLimit(`an:${ip}`, 240, 60_000).ok) return new NextResponse(null, { status: 204 });

  const ua = parseUa(req.headers.get("user-agent"));
  if (ua.isBot) return new NextResponse(null, { status: 204 });

  try {
    const parsed = batchSchema.safeParse(await req.json());
    if (!parsed.success) return new NextResponse(null, { status: 204 });
    const { sid, vid, sd, ctx, e } = parsed.data;

    // The admin panel is a tool, not an audience — never record it.
    const events: PendingEvent[] = [];
    for (const ev of e) {
      const path = normalisePath(ev.p);
      if (path.startsWith("/admin")) continue;
      events.push({
        sessionId: sid,
        kind: ev.k,
        name: ev.n.trim().slice(0, 160) || path,
        path,
        productId: ev.pid ?? null,
        meta: ev.m ?? undefined,
      });
    }
    if (events.length === 0) return new NextResponse(null, { status: 204 });

    const selfHost = new URL(env.SITE_URL).hostname;
    const { refType, refHost } = classifyReferrer(ctx.r, selfHost);

    const seed: SessionSeed = {
      id: sid,
      visitorId: vid,
      landingPath: normalisePath(new URL(ctx.u, env.SITE_URL).pathname),
      referrer: ctx.r?.slice(0, 600) ?? null,
      refHost,
      refType,
      ...parseUtm(ctx.u),
      country: country(req.headers),
      device: ua.device,
      os: ua.os,
      browser: ua.browser,
      screenW: ctx.sw ?? null,
      locale: ctx.l ?? null,
      isTelegram: ua.isTelegram,
    };

    enqueue(seed, events, sd);
  } catch {
    // Malformed body, bad URL, anything — the beacon is fire-and-forget.
  }

  return new NextResponse(null, { status: 204 });
}
