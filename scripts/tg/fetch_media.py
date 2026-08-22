"""Berilgan message id'lar uchun eng sifatli rasmni yuklab oladi.

Video bo'lsa — Telegram o'zi saqlagan eng katta thumbnail (ffmpeg kerak emas).

    scripts/tg/.venv/bin/python scripts/tg/fetch_media.py --ids 15303,15302 --out scripts/tg/out/pics
"""
import argparse, asyncio, json, sys
from pathlib import Path

from telethon import TelegramClient
from telethon.sessions import StringSession
from telethon.tl.types import MessageMediaPhoto, MessageMediaDocument, DocumentAttributeVideo

from _env import load_env


async def main() -> int:
    env = load_env()
    ap = argparse.ArgumentParser()
    ap.add_argument("--ids", required=True, help="vergul bilan ajratilgan message id'lar")
    ap.add_argument("--chat", default="-1002601439663")
    ap.add_argument("--out", required=True)
    args = ap.parse_args()

    out = Path(args.out).resolve()
    out.mkdir(parents=True, exist_ok=True)
    ids = [int(x) for x in args.ids.split(",") if x.strip()]

    api_id, api_hash, session = env.get("TG_API_ID"), env.get("TG_API_HASH"), env.get("TG_SESSION")
    if not (api_id and api_hash and session):
        print("❌ .env da TG_* kalitlari yo'q", file=sys.stderr)
        return 1

    report = []
    async with TelegramClient(StringSession(session), int(api_id), api_hash) as client:
        entity = await client.get_entity(int(args.chat))
        for chunk_start in range(0, len(ids), 100):
            chunk = ids[chunk_start:chunk_start + 100]
            for msg in await client.get_messages(entity, ids=chunk):
                if msg is None or msg.media is None:
                    report.append({"id": chunk[0] if not msg else msg.id, "file": None, "kind": "none"})
                    continue
                kind, path = None, None
                if isinstance(msg.media, MessageMediaPhoto):
                    kind = "photo"
                    path = await client.download_media(msg, file=str(out / f"{msg.id}"))
                elif isinstance(msg.media, MessageMediaDocument):
                    doc = msg.media.document
                    is_video = any(isinstance(a, DocumentAttributeVideo) for a in doc.attributes)
                    if is_video:
                        # eng katta thumbnail — ffmpeg'siz kadr
                        thumbs = getattr(doc, "thumbs", None) or []
                        if thumbs:
                            kind = "video-thumb"
                            path = await client.download_media(msg, file=str(out / f"{msg.id}"), thumb=-1)
                    else:
                        mime = getattr(doc, "mime_type", "") or ""
                        if mime.startswith("image/"):
                            kind = "doc-image"
                            path = await client.download_media(msg, file=str(out / f"{msg.id}"))
                report.append({"id": msg.id, "file": str(path) if path else None, "kind": kind or "skip"})
                print(f"{msg.id}: {kind or 'skip'} -> {Path(path).name if path else '—'}")

    (out / "report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    ok = sum(1 for r in report if r["file"])
    print(f"\n✅ {ok}/{len(ids)} rasm -> {out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
