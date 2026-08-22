"""Telegram user-akkaunt sessiyasini yaratadi va .env ga TG_SESSION sifatida yozadi.

Bir marta ishga tushiriladi:
    scripts/tg/.venv/bin/python scripts/tg/login.py

Kerak: my.telegram.org -> API development tools -> api_id / api_hash.

DIQQAT: hosil bo'ladigan session string — akkauntingizga TO'LIQ kirish huquqi.
Uni hech kimga bermang, git'ga commit qilmang (.env allaqachon gitignored).
"""
import asyncio
import sys

from telethon import TelegramClient
from telethon.sessions import StringSession

from _env import load_env, upsert_env


async def main() -> int:
    env = load_env()
    api_id = env.get("TG_API_ID") or input("api_id: ").strip()
    api_hash = env.get("TG_API_HASH") or input("api_hash: ").strip()
    if not api_id or not api_hash:
        print("api_id/api_hash kiritilmadi.", file=sys.stderr)
        return 1

    async with TelegramClient(StringSession(), int(api_id), api_hash) as client:
        # start() telefon raqami, SMS/app kodi va (bo'lsa) 2FA parolini so'raydi
        await client.start()
        me = await client.get_me()
        session = client.session.save()

    upsert_env("TG_API_ID", str(api_id))
    upsert_env("TG_API_HASH", api_hash)
    upsert_env("TG_SESSION", session)

    name = " ".join(filter(None, [me.first_name, me.last_name]))
    print(f"\n✅ Kirildi: {name} (@{me.username}) id={me.id}")
    print("✅ TG_API_ID / TG_API_HASH / TG_SESSION .env ga yozildi.")
    return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
