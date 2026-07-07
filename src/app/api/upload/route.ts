import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { processProductImage, sniffImageType } from "@/lib/images-server";

export const runtime = "nodejs";

const MAX_BYTES = 15 * 1024 * 1024; // 15 MB/file

/** Admin image upload (auth-guarded). Accepts jpeg/png/webp, returns variants. */
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "bad_request" }, { status: 400 });

  const files = form.getAll("files").filter((f): f is File => f instanceof File);
  if (files.length === 0) return NextResponse.json({ error: "no_files" }, { status: 400 });

  const results = [];
  for (const file of files) {
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "too_large" }, { status: 413 });
    }
    const buf = Buffer.from(await file.arrayBuffer());
    const kind = sniffImageType(buf);
    if (!kind) {
      return NextResponse.json({ error: "unsupported_type" }, { status: 415 });
    }
    try {
      const variant = await processProductImage(buf);
      results.push(variant);
    } catch (err) {
      console.error("[upload] processing failed:", err);
      return NextResponse.json({ error: "processing_failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true, images: results });
}
