"""2-qadam: kelgan kod (va kerak bo'lsa 2FA parol) bilan sessiyani yakunlaydi.

    scripts/tg/.venv/bin/python scripts/tg/login_finish.py 12345 [2FA_PAROL]
"""
import asyncio
import json
import os
import sys
from pathlib import Path

from telethon import TelegramClient
from telethon.errors import (
    PhoneCodeExpiredError,
    PhoneCodeInvalidError,
    SessionPasswordNeededError,
)
from telethon.sessions import StringSession

from _env import load_env, upsert_env

STATE = Path(os.environ.get("TG_LOGIN_STATE", "/tmp/tg_login_state.json"))


async def main() -> int:
    env = load_env()
    if not STATE.exists():
        print("❌ Holat fayli yo'q — avval login_start.py ni ishga tushiring.", file=sys.stderr)
        return 1
    if len(sys.argv) < 2:
        print("Foydalanish: login_finish.py <kod> [2FA_parol]", file=sys.stderr)
        return 1

    state = json.loads(STATE.read_text(encoding="utf-8"))
    code = sys.argv[1].strip().replace(" ", "").replace("-", "")
    password = sys.argv[2] if len(sys.argv) > 2 else None

    client = TelegramClient(StringSession(state["session"]), int(env["TG_API_ID"]), env["TG_API_HASH"])
    await client.connect()
    try:
        try:
            await client.sign_in(state["phone"], code, phone_code_hash=state["phone_code_hash"])
        except SessionPasswordNeededError:
            if not password:
                print("🔐 Akkauntda 2FA (cloud password) yoqilgan. Qayta chaqiring:", file=sys.stderr)
                print("   login_finish.py <kod> <2FA_parol>", file=sys.stderr)
                return 2
            await client.sign_in(password=password)
        except (PhoneCodeExpiredError, PhoneCodeInvalidError):
            # Kod oldingi urinishda allaqachon ishlatilgan bo'lishi mumkin —
            # bunda akkaunt shu auth key uchun "parol kutilmoqda" holatida qoladi.
            if not password:
                raise
            await client.sign_in(password=password)

        me = await client.get_me()
        upsert_env("TG_SESSION", client.session.save())
    finally:
        await client.disconnect()

    STATE.unlink(missing_ok=True)
    name = " ".join(filter(None, [me.first_name, me.last_name]))
    print(f"✅ Kirildi: {name} (@{me.username}) id={me.id}")
    print("✅ TG_SESSION .env ga yozildi, vaqtinchalik holat fayli o'chirildi.")
    return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
