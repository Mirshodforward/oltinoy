# -*- coding: utf-8 -*-
"""Kuratsiya faylini + xom guruhlarni saytga tayyor katalogga aylantiradi.

Kanal sarlavhasida faqat tur, mato, narx va razmer bor — nom, rang va tavsif
yo'q. Shu sababli har bir partiya uchun `scripts/tg/batches/<nom>.json` ichida
nom/rang/kadr tanlovi qo'lda yoziladi (rasmlarga qarab), narx-mato-razmer esa
kanal matnidan olinadi — o'ylab topilmaydi.

    scripts/tg/.venv/bin/python scripts/tg/make_catalog.py \
        --batch scripts/tg/batches/2026-09.json \
        --out scripts/tg/out/sep/catalog.json
"""
import argparse, json, re, unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

KIND_UZ = {"dvoyka": "ikki qismli to'plam", "troyka": "uch qismli to'plam", "abaya": "abaya",
           "abaya-rumol": "abaya va ro'mol to'plami", "kuylak": "ko'ylak", "vecherni": "kechki ko'ylak"}
KIND_RU = {"dvoyka": "двойка", "troyka": "тройка", "abaya": "абайя",
           "abaya-rumol": "комплект абайя и платок", "kuylak": "платье", "vecherni": "вечернее платье"}

TRANSLIT = {"'": "", "’": "", "‘": "", "o‘": "o", "g‘": "g", "ʻ": "", "ʼ": ""}


def slugify(s: str) -> str:
    s = s.lower()
    for a, b in TRANSLIT.items():
        s = s.replace(a, b)
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return re.sub(r"-{2,}", "-", s)


def is_multicolour(colour: str) -> bool:
    """Bir nechta rang sanalganmi — shunda rang nomga emas, tavsifga tushadi."""
    return "," in colour or " va " in colour


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--batch", required=True)
    ap.add_argument("--out", required=True)
    a = ap.parse_args()

    batch = json.loads(Path(a.batch).read_text(encoding="utf-8"))
    src = json.loads((ROOT / batch["source"]).read_text(encoding="utf-8"))
    by_rank = {g["rank"]: g for g in src["products"]}

    out, seen = [], set()
    sku_no = batch["skuStart"]

    for item in batch["products"]:
        groups = [by_rank[r] for r in item["groups"]]
        head = groups[0]

        # Bir model bir nechta post bo'lib chiqqan bo'lsa — razmer va media id'lari
        # birlashtiriladi; narx hammasida bir xil bo'lishi kerak.
        prices = {g["price"] for g in groups}
        if len(prices) > 1:
            raise SystemExit(f"❌ {item['nameUz']}: guruhlarda narx har xil: {prices}")

        sizes = item.get("sizes") or sorted({s for g in groups for s in g["sizes"]}, key=int)
        msg_ids = sorted({i for g in groups for i in (g["photo_ids"] + g["doc_ids"])}, reverse=True)

        price = item.get("price", head["price"])
        old_price = item.get("oldPrice")
        colour_uz, colour_ru = item["colorUz"], item["colorRu"]
        multi = is_multicolour(colour_uz)

        name_uz = item["nameUz"] if multi else f"{item['nameUz']} — {colour_uz}"
        name_ru = item["nameRu"] if multi else f"{item['nameRu']} — {colour_ru}"

        rng = f"{sizes[0]}–{sizes[-1]}" if sizes else "46–56"
        kind = head["kind"]
        colour_phrase_uz = f"{colour_uz} ranglarda" if multi else f"{colour_uz} rangda"
        colour_phrase_ru = f"цвета: {colour_ru}" if multi else f"{colour_ru} цвет"

        desc_uz = (
            f"{item['nameUz']} — {colour_phrase_uz}, {item['materialUz'].lower()} matosidan. "
            f"{KIND_UZ.get(kind, 'model').capitalize()}, {rng} razmerlar oralig'ida. "
            f"O'z tikuv seximizda tikilgan, optom narxda — vositachisiz."
        )
        desc_ru = (
            f"{item['nameRu']} — {colour_phrase_ru}, материал: {item['materialRu'].lower()}. "
            f"{KIND_RU.get(kind, 'модель').capitalize()}, размеры {rng}. "
            f"Пошив в собственном цехе, оптовая цена — без посредников."
        )

        slug = base = slugify(item["nameUz"] if multi else f"{item['nameUz']} {colour_uz}")
        i = 2
        while slug in seen:
            slug = f"{base}-{i}"
            i += 1
        seen.add(slug)

        out.append({
            "rank": sku_no, "slug": slug, "sku": f"OC-{sku_no:03d}",
            "nameUz": name_uz, "nameRu": name_ru,
            "descriptionUz": desc_uz, "descriptionRu": desc_ru,
            "materialUz": item["materialUz"], "materialRu": item["materialRu"],
            "price": price, "oldPrice": old_price,
            "sizes": sizes, "minOrderQty": 1,
            "category": item["category"], "isNew": True,
            "colorUz": colour_uz, "colorRu": colour_ru,
            "tgMessageIds": msg_ids,
            "sourceCaption": head["caption"], "latest": max(g["latest"] for g in groups),
            "images": item["images"],
        })
        sku_no += 1

    Path(a.out).parent.mkdir(parents=True, exist_ok=True)
    Path(a.out).write_text(
        json.dumps({"batch": batch["batch"], "count": len(out), "products": out}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    print(f"{len(out)} ta mahsulot -> {a.out}\n")
    for p in out:
        old = f" (eski {p['oldPrice']:,})" if p["oldPrice"] else ""
        print(f"  {p['sku']}  {p['slug'][:42]:<42} {p['price']:>7,}{old:<16} "
              f"{len(p['sizes'])} razmer  {len(p['images'])} rasm  {p['category']}")
    for s in batch.get("skipped", []):
        print(f"\n  ⛔ g{s['groups']} chetlatildi — {s['reason']}")


if __name__ == "__main__":
    main()
