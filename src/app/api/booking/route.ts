import { NextRequest, NextResponse } from "next/server";
import { bookingSchema } from "@/lib/schemas";
import { db } from "@/lib/db";
import { rateLimit, clientIp } from "@/lib/ratelimit";
import { sendBookingAlert } from "@/lib/telegram";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  // 1) rate limit: 5 req / 10 min per IP
  const ip = clientIp(req.headers);
  const rl = rateLimit(`booking:${ip}`, 5, 10 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const parsed = bookingSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation" }, { status: 422 });
  }
  const data = parsed.data;

  // Honeypot — pretend success, silently drop.
  if (data.website && data.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  // Verify product exists and is bookable.
  const product = await db.product.findUnique({
    where: { id: data.productId },
    select: { id: true, nameUz: true, slug: true, sku: true, price: true, status: true },
  });
  if (!product || product.status === "HIDDEN") {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  // 2) create booking (status NEW)
  const booking = await db.booking.create({
    data: {
      productId: product.id,
      size: data.size,
      quantity: data.quantity,
      customerName: data.customerName.trim(),
      phone: data.phone,
      tgUsername: data.tgUsername,
      note: data.note,
    },
  });

  // 3) admin alert via Telegram (never fail the user if TG is down)
  try {
    const messageId = await sendBookingAlert({
      id: booking.id,
      productName: product.nameUz,
      sku: product.sku,
      slug: product.slug,
      size: booking.size,
      quantity: booking.quantity,
      price: product.price,
      customerName: booking.customerName,
      phone: booking.phone,
      tgUsername: booking.tgUsername,
      note: booking.note,
      createdAt: booking.createdAt,
    });
    if (messageId) {
      await db.booking.update({ where: { id: booking.id }, data: { adminTgMessageId: messageId } });
    }
  } catch (err) {
    console.error("[booking] telegram alert failed:", err);
  }

  return NextResponse.json({ ok: true, id: booking.id });
}
