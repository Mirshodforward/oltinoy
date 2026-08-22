"""1-qadam: telefon raqamga login kodini yuboradi va kutish holatini saqlaydi.

    scripts/tg/.venv/bin/python scripts/tg/login_start.py +998501769384
"""
import asyncio
import json
import os
import sys
from pathlib import Path

from telethon import TelegramClient
from telethon.sessions import StringSession

from _env import load_env

STATE = Path(os.environ.get("TG_LOGIN_STATE", "/tmp/tg_login_state.json"))


async def main() -> int:
    env = load_env()
    phone = (sys.argv[1] if len(sys.argv) > 1 else env.get("TG_PHONE", "")).strip()
    if not phone:
        print("Foydalanish: login_start.py +998XXXXXXXXX", file=sys.stderr)
        return 1

    client = TelegramClient(StringSession(), int(env["TG_API_ID"]), env["TG_API_HASH"])
    await client.connect()
    try:
        sent = await client.send_code_request(phone)
        STATE.write_text(json.dumps({
            "phone": phone,
            "phone_code_hash": sent.phone_code_hash,
            "session": client.session.save(),
        }), encoding="utf-8")
        STATE.chmod(0o600)
        print(f"📨 Kod yuborildi: {phone}  (turi: {type(sent.type).__name__})")
        print(f"   holat saqlandi: {STATE}")
    finally:
        await client.disconnect()
    return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
