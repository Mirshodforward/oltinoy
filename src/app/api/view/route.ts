import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { rateLimit, clientIp } from "@/lib/ratelimit";

export const runtime = "nodejs";

const schema = z.object({ slug: z.string().min(1).max(200) });

/** Beacon endpoint: increment viewCount. Best-effort, always 204. */
export async function POST(req: NextRequest) {
  const ip = clientIp(req.headers);
  // Loose cap to blunt abuse while staying invisible to real users.
  const rl = rateLimit(`view:${ip}`, 120, 60 * 1000);
  if (!rl.ok) return new NextResponse(null, { status: 204 });

  try {
    const json = await req.json();
    const parsed = schema.safeParse(json);
    if (parsed.success) {
      await db.product.updateMany({
        where: { slug: parsed.data.slug },
        data: { viewCount: { increment: 1 } },
      });
    }
  } catch {
    // ignore — beacon is fire-and-forget
  }
  return new NextResponse(null, { status: 204 });
}
