"""Kanal postlaridan mahsulot kartalarini ajratib oladi.

Kanalda bitta mahsulot bir nechta post bo'lib chiqadi (har bir rasm/video —
alohida post, sarlavha takrorlanadi). Shu sababli postlar sarlavha matni
bo'yicha guruhlanadi: bir guruh = bitta mahsulot.

    scripts/tg/.venv/bin/python scripts/tg/parse_products.py \
        --in scripts/tg/out/survey700/messages.json --limit 30 \
        --out scripts/tg/out/products.json
"""
import argparse, json, re, unicodedata
from collections import OrderedDict

EMOJI = re.compile(
    "[\U0001F000-\U0001FAFF☀-➿️‍⬀-⯿←-⇿⌀-⏿]"
)

def strip_emoji(t: str) -> str:
    return EMOJI.sub("", t)

def norm_key(t: str) -> str:
    t = strip_emoji(t).lower()
    t = re.sub(r"[^\w\s]", " ", t, flags=re.UNICODE)
    return re.sub(r"\s+", " ", t).strip()

def parse_price(text: str):
    """'NARXI~OPTOM 190ming' / 'NARXI :180MING' / '145ming' -> 190000"""
    m = re.search(r"narx\w*\s*[~:.\-]*\s*(?:optom)?\s*[~:.\-]*\s*(\d[\d\s]{1,8})\s*(ming|min\b|000)?", text, re.I)
    if not m:
        m = re.search(r"(\d{3})\s*ming", text, re.I)
        if not m:
            return None
    raw = re.sub(r"\s", "", m.group(1))
    unit = (m.group(2) or "").lower() if m.lastindex and m.lastindex >= 2 else ""
    try:
        n = int(raw)
    except ValueError:
        return None
    if unit.startswith("ming") or unit.startswith("min") or n < 1000:
        n *= 1000
    return n

def parse_material(text: str):
    m = re.search(r"material\w*\s*[:~\-]?\s*(.+)", text, re.I)
    if not m:
        return None
    val = strip_emoji(m.group(1)).strip()
    val = re.split(r"\bnarx", val, flags=re.I)[0]
    val = val.strip(" .:&-\n")
    return val[:80] or None

SIZE_RE = re.compile(r"\b(4[4-9]|5[0-9]|6[0-4])\b")

def parse_sizes(text: str):
    m = re.search(r"razmer\w*\s*[:~\-]?\s*(.+)", text, re.I | re.S)
    seg = m.group(1) if m else text
    seg = seg.split("\n\n")[0]
    found = sorted({int(x) for x in SIZE_RE.findall(seg)})
    if not found and re.search(r"standart", seg, re.I):
        found = [48, 50, 52, 54, 56]
    if not found:
        return [], True
    lo, hi = found[0], found[-1]
    full = [s for s in range(lo, hi + 1, 2)]
    return ([str(s) for s in full] or [str(s) for s in found]), bool(re.search(r"standart", seg, re.I))

def classify(text: str) -> str:
    t = norm_key(text)
    if re.search(r"\brumol\b", t) and not re.search(r"abaya|kuylak|dvoyka|troyka", t):
        return "rumol"
    if re.search(r"dvoyka|troyka|komplekt|to plam|toplam", t):
        return "toplam"
    if re.search(r"abaya", t) and re.search(r"rumol", t):
        return "toplam"
    if re.search(r"abaya", t):
        return "abaya"
    if re.search(r"kuylak|kuylag|koylak|ko ylak|vecherni", t):
        return "koylak"
    return "koylak"

def kind_label(text: str) -> str:
    t = norm_key(text)
    if re.search(r"dvoyka", t): return "dvoyka"
    if re.search(r"troyka", t): return "troyka"
    if re.search(r"abaya", t) and re.search(r"rumol", t): return "abaya-rumol"
    if re.search(r"abaya", t): return "abaya"
    if re.search(r"vecherni", t): return "vecherni"
    return "kuylak"

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--in", dest="src", required=True)
    ap.add_argument("--out", dest="dst", required=True)
    ap.add_argument("--limit", type=int, default=30)
    a = ap.parse_args()

    posts = json.load(open(a.src, encoding="utf-8"))["posts"]

    groups = OrderedDict()
    for p in posts:
        text = (p.get("text") or "").strip()
        if not text or not re.search(r"narx", text, re.I):
            continue
        price = parse_price(text)
        if not price:
            continue
        mat = parse_material(text)
        sizes, standart = parse_sizes(text)
        key = (kind_label(text), (mat or "").lower(), price, tuple(sizes))
        g = groups.setdefault(key, {
            "kind": kind_label(text), "category": classify(text),
            "material": mat, "price": price, "sizes": sizes, "standart": standart,
            "caption": text, "photo_ids": [], "doc_ids": [], "dates": [], "views": 0,
        })
        # Photos beat videos: a still is what the catalogue card needs, and a
        # video's Telegram thumbnail is much lower resolution.
        for m in p["messages"]:
            if m.get("media_type") == "MessageMediaPhoto":
                g["photo_ids"].append(m["id"])
            elif m.get("media_type") == "MessageMediaDocument":
                g["doc_ids"].append(m["id"])
        g["dates"].append(p["date"])
        g["views"] += p.get("views") or 0

    items = []
    for g in groups.values():
        g["photo_ids"] = sorted(set(g["photo_ids"]), reverse=True)
        g["doc_ids"] = sorted(set(g["doc_ids"]), reverse=True)
        g["latest"] = max(g["dates"])
        g["posts"] = len(g["dates"])
        del g["dates"]
        items.append(g)
    items.sort(key=lambda x: x["latest"], reverse=True)
    items = items[: a.limit]
    for i, g in enumerate(items, 1):
        g["rank"] = i

    json.dump({"count": len(items), "products": items}, open(a.dst, "w", encoding="utf-8"),
              ensure_ascii=False, indent=2)
    print(f"{len(items)} ta mahsulot -> {a.dst}\n")
    for g in items:
        print(f"[{g['rank']:2}] {g['latest'][:10]}  {g['category']:7} {g['kind']:12} "
              f"{g['price']:>7,}  {len(g['sizes'])} razmer  {g['posts']:2} post  "
              f"{len(g['photo_ids']):3} foto {len(g['doc_ids']):3} video | {(g['material'] or '—')[:32]}")

if __name__ == "__main__":
    main()
