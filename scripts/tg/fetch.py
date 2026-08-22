"""Kanaldan oxirgi N ta postni (matn + media) user-session orqali tortadi.

    scripts/tg/.venv/bin/python scripts/tg/fetch.py            # oxirgi 5 post
    scripts/tg/.venv/bin/python scripts/tg/fetch.py -n 20
    scripts/tg/.venv/bin/python scripts/tg/fetch.py --no-media # faqat matn
    scripts/tg/.venv/bin/python scripts/tg/fetch.py --chat -1002601439663

Albom (bir nechta rasmli bitta post) bitta "post" deb hisoblanadi.
Natija: scripts/tg/out/messages.json + scripts/tg/out/media/
"""
import argparse
import asyncio
import json
import sys
from pathlib import Path

from telethon import TelegramClient
from telethon.sessions import StringSession

from _env import ROOT, load_env

OUT_DIR = Path(__file__).resolve().parent / "out"


def rel(path) -> str:
    """ROOT ga nisbatan yo'l; tashqarida bo'lsa — absolyut yo'l."""
    p = Path(path).resolve()
    try:
        return str(p.relative_to(ROOT))
    except ValueError:
        return str(p)


def public_link(chat_id: int, message_id: int) -> str:
    short = str(chat_id)
    if short.startswith("-100"):
        short = short[4:]
    return f"https://t.me/c/{short}/{message_id}"


def serialize(msg, files: list[str], chat_id: int) -> dict:
    reactions = []
    if getattr(msg, "reactions", None) and msg.reactions.results:
        for r in msg.reactions.results:
            emoji = getattr(r.reaction, "emoticon", None) or getattr(r.reaction, "document_id", "?")
            reactions.append({"emoji": str(emoji), "count": r.count})
    return {
        "id": msg.id,
        "grouped_id": msg.grouped_id,
        "date": msg.date.isoformat() if msg.date else None,
        "text": msg.message or "",
        "views": getattr(msg, "views", None),
        "forwards": getattr(msg, "forwards", None),
        "reactions": reactions,
        "media_type": type(msg.media).__name__ if msg.media else None,
        "files": files,
        "link": public_link(chat_id, msg.id),
    }


async def main() -> int:
    env = load_env()
    ap = argparse.ArgumentParser()
    ap.add_argument("-n", "--posts", type=int, default=5, help="nechta post (albom = 1 post)")
    ap.add_argument("--chat", default=env.get("CHANNEL_ID", "-1002601439663"))
    ap.add_argument("--no-media", action="store_true", help="mediani yuklab olmaslik")
    ap.add_argument("--out", default=str(OUT_DIR))
    args = ap.parse_args()

    api_id, api_hash, session = env.get("TG_API_ID"), env.get("TG_API_HASH"), env.get("TG_SESSION")
    if not (api_id and api_hash and session):
        print("❌ .env da TG_API_ID / TG_API_HASH / TG_SESSION yo'q. Avval login.py ni ishga tushiring.", file=sys.stderr)
        return 1

    out = Path(args.out).resolve()
    media_dir = out / "media"
    out.mkdir(parents=True, exist_ok=True)
    if not args.no_media:
        media_dir.mkdir(exist_ok=True)

    chat_id = int(args.chat)
    # albomlarni to'liq qamrab olish uchun kerakligidan ko'proq xabar o'qiymiz
    raw_limit = max(args.posts * 12, 30)

    async with TelegramClient(StringSession(session), int(api_id), api_hash) as client:
        entity = await client.get_entity(chat_id)
        print(f"📡 {getattr(entity, 'title', chat_id)} — oxirgi {args.posts} post olinmoqda…\n")

        groups: list[list] = []      # har biri bitta post (albom bo'lsa bir nechta message)
        seen_groups: dict[int, int] = {}
        async for msg in client.iter_messages(entity, limit=raw_limit):
            gid = msg.grouped_id
            if gid is not None and gid in seen_groups:
                groups[seen_groups[gid]].append(msg)
                continue
            if len(groups) >= args.posts:
                break
            if gid is not None:
                seen_groups[gid] = len(groups)
            groups.append([msg])

        posts = []
        for gi, group in enumerate(groups, 1):
            group.sort(key=lambda m: m.id)
            head = next((m for m in group if m.message), group[0])
            items = []
            for msg in group:
                files = []
                if msg.media and not args.no_media:
                    path = await client.download_media(msg, file=str(media_dir / f"{msg.id}"))
                    if path:
                        files.append(rel(path))
                items.append(serialize(msg, files, chat_id))

            posts.append({
                "post": gi,
                "message_ids": [m.id for m in group],
                "date": head.date.isoformat() if head.date else None,
                "text": head.message or "",
                "views": getattr(head, "views", None),
                "link": public_link(chat_id, group[0].id),
                "messages": items,
            })

            preview = (head.message or "").strip().replace("\n", " ⏎ ")
            print(f"── POST {gi}  id={group[0].id}"
                  f"{'..' + str(group[-1].id) if len(group) > 1 else ''}"
                  f"  {head.date:%Y-%m-%d %H:%M}  👁 {getattr(head, 'views', '—')}")
            print(f"   {preview[:220] or '(matnsiz)'}")
            for it in items:
                if it["files"]:
                    print(f"   📎 {it['files'][0]}")
            print()

    result_path = out / "messages.json"
    result_path.write_text(
        json.dumps({"chat_id": chat_id, "posts": posts}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    total_files = sum(len(i["files"]) for p in posts for i in p["messages"])
    print(f"✅ {len(posts)} post, {total_files} media fayl → {rel(result_path)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
