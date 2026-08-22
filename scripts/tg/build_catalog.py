# -*- coding: utf-8 -*-
"""Kanaldan olingan xom ma'lumotni saytga tayyor katalogga aylantiradi.

Kanal sarlavhalarida faqat tur, mato, narx va razmer bor — nom, tavsif va rang
yo'q. Shu sababli har bir mahsulot uchun nom/tavsif shu yerda qo'lda yozilgan:
rang va fason rasmlardan aniqlangan, mato va narx esa kanal matnidan olinadi
(o'ylab topilmaydi).

    scripts/tg/.venv/bin/python scripts/tg/build_catalog.py
"""
import json, re, unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "scripts/tg/out/products.json"
PICKED = ROOT / "scripts/tg/out/picked.json"
DST = ROOT / "scripts/tg/out/catalog.json"

# rank -> (uz nomi, ru nomi, uz rang, ru rang, uz mato, ru mato, kategoriya)
MANUAL = {
 1:("Kapyushonli sport dvoyka","Спортивная двойка с капюшоном","bordo","бордовый","Kaliforniya trikotaji","Трикотаж «Калифорния»","toplam"),
 2:("Gul applikatsiyali dvoyka","Двойка с цветочной аппликацией","zumrad yashil","изумрудный","Italyan shifoni","Итальянский шифон","toplam"),
 3:("Dantelli dvoyka","Двойка с гипюром","tilla-bej","золотисто-бежевый","Turk paxtasi (XB)","Турецкий хлопок","toplam"),
 4:("Leopard naqshli dvoyka","Двойка с леопардовым принтом","g'ishtrang","терракотовый","Markiza (paxta aralash)","Маркиза (хлопок)","toplam"),
 5:("Gulli jiletli abaya va ro'mol","Абайя с цветочным жилетом и платком","bordo va sut","бордовый и молочный","PRADO (gulli qism) va XB lion","PRADO (цветочная часть) и XB lion","toplam"),
 6:("Mayda gulli kamarli ko'ylak","Платье с мелким цветочным принтом и поясом","sut-pushti","молочно-розовый","Shifon, kamari bilan","Шифон, с поясом","koylak"),
 7:("Adras naqshli dvoyka","Двойка с узором адрас","rang-barang","разноцветный","Sifatli poplin","Качественный поплин","toplam"),
 8:("Tilla naqshli troyka","Тройка с золотым узором","qora va tilla","чёрный с золотом","Turk paxtasi (XB)","Турецкий хлопок","toplam"),
 9:("Tilla bezakli abaya","Абайя с золотой отделкой","shokolad","шоколадный","Turk paxtasi (XB)","Турецкий хлопок","abaya"),
10:("Kamarli yaltiroq abaya","Абайя с поясом и блеском","shampan","шампань","Lion XB (baza ko'ylak bilan)","Lion XB (с базовым платьем)","abaya"),
11:("Yashil kashtali dvoyka","Двойка с зелёной вышивкой","sut","молочный","Singapur (nafas oladigan)","Сингапур (дышащая)","toplam"),
12:("Chiziqli sarafan va oq bluzka","Сарафан в полоску с белой блузой","qora-oq","чёрно-белый","Chiziqli trikotaj","Трикотаж в полоску","koylak"),
13:("Dantelli kechki dvoyka","Вечерняя двойка с гипюром","tilla-bej","золотисто-бежевый","Turk paxtasi (XB)","Турецкий хлопок","toplam"),
14:("Mayda gulli uzun ko'ylak","Длинное платье с мелким цветком","sut-firuza","молочно-бирюзовый","Florya (nafas oladigan)","Florya (дышащая)","koylak"),
15:("Kashtali keng abaya","Свободная абайя с вышивкой","tuya rang","верблюжий","Turk paxtasi (XB)","Турецкий хлопок","abaya"),
16:("Volanli gulli ko'ylak","Платье с воланами и цветочным принтом","to'q bordo","тёмно-бордовый","Florya (yumshoq, nafas oladigan)","Florya (мягкая, дышащая)","koylak"),
17:("Volanli shokolad ko'ylak","Шоколадное платье с воланами","shokolad-pushti","шоколадно-розовый","Florya (yumshoq, nafas oladigan)","Florya (мягкая, дышащая)","koylak"),
18:("Abstrakt naqshli dvoyka","Двойка с абстрактным принтом","qora-oq","чёрно-белый","Silin va Belmando","Silin и Belmando","toplam"),
19:("Oq gulli qora ko'ylak","Чёрное платье с белым цветком","qora","чёрный","DOIN original poplin","DOIN оригинальный поплин","koylak"),
20:("Yunon naqshli abaya","Абайя с греческим орнаментом","shokolad","шоколадный","Turk paxtasi (XB)","Турецкий хлопок","abaya"),
21:("Zaytun rangli dvoyka","Оливковая двойка","zaytun","оливковый","PRADO (nafas oladigan)","PRADO (дышащая)","toplam"),
22:("Leopard naqshli troyka","Тройка с леопардовым принтом","bej-jigarrang","бежево-коричневый","PRADO (nafas oladigan)","PRADO (дышащая)","toplam"),
23:("Adras naqshli bordo dvoyka","Бордовая двойка с узором адрас","bordo","бордовый","Silin va Belmando","Silin и Belmando","toplam"),
24:("Charm ko'rinishli dvoyka","Двойка под кожу","qora","чёрный","OYSHA (qalin)","OYSHA (плотная)","toplam"),
25:("Firuza gulli ko'ylak","Платье с бирюзовым цветком","sut-firuza","молочно-бирюзовый","Florya (nafas oladigan)","Florya (дышащая)","koylak"),
26:("Mayda gulli bordo ko'ylak","Бордовое платье с мелким цветком","to'q bordo","тёмно-бордовый","DOIN original poplin","DOIN оригинальный поплин","koylak"),
27:("Qora yoqali adras dvoyka","Двойка адрас с чёрной кокеткой","rang-barang","разноцветный","Sifatli poplin","Качественный поплин","toplam"),
28:("Baland yoqali troyka","Тройка с высоким воротом","olxo'ri","сливовый","XB lakra (paxta-elastan)","XB лакра (хлопок-эластан)","toplam"),
29:("Romashka bezakli dvoyka","Двойка с ромашками","qora","чёрный","Belmando","Belmando","toplam"),
30:("Dantel volanli dvoyka","Двойка с кружевными воланами","bordo","бордовый","Shifon, dantel bezakli","Шифон с кружевом","toplam"),
}

KIND_UZ = {"dvoyka":"ikki qismli to'plam","troyka":"uch qismli to'plam","abaya":"abaya",
           "abaya-rumol":"abaya va ro'mol to'plami","kuylak":"ko'ylak","vecherni":"kechki ko'ylak"}
KIND_RU = {"dvoyka":"двойка","troyka":"тройка","abaya":"абайя",
           "abaya-rumol":"комплект абайя и платок","kuylak":"платье","vecherni":"вечернее платье"}

TRANSLIT = {"'":"","’":"","‘":"","o‘":"o","g‘":"g","ʻ":"","ʼ":""}

def slugify(s: str) -> str:
    s = s.lower()
    for a, b in TRANSLIT.items():
        s = s.replace(a, b)
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return re.sub(r"-{2,}", "-", s)

def main() -> None:
    prods = json.load(open(SRC, encoding="utf-8"))["products"]
    picked = json.load(open(PICKED, encoding="utf-8"))
    out, seen = [], set()

    for g in prods:
        r = g["rank"]
        nu, nr, cu, cr, mu, mr, cat = MANUAL[r]
        kind = g["kind"]
        sizes = g["sizes"]
        # #9 and #20 are the same abaya; the #9 caption only carried its second
        # size line, so take the full run the model is actually cut in.
        if r == 9:
            sizes = ["48", "50", "52", "54", "56"]

        name_uz = f"{nu} — {cu}"
        name_ru = f"{nr} — {cr}"
        rng = f"{sizes[0]}–{sizes[-1]}" if sizes else "46–56"

        desc_uz = (
            f"{nu.capitalize()} — {cu} rangda, {mu.lower()} matosidan. "
            f"{KIND_UZ.get(kind,'model').capitalize()}, {rng} razmerlar oralig'ida. "
            f"O'z tikuv seximizda tikilgan, optom narxda — vositachisiz."
        )
        desc_ru = (
            f"{nr} — {cr} цвет, материал: {mr.lower()}. "
            f"{KIND_RU.get(kind,'модель').capitalize()}, размеры {rng}. "
            f"Пошив в собственном цехе, оптовая цена — без посредников."
        )

        slug = slugify(name_uz)
        base = slug
        i = 2
        while slug in seen:
            slug = f"{base}-{i}"; i += 1
        seen.add(slug)

        out.append({
            "rank": r, "slug": slug, "sku": f"OC-{r:03d}",
            "nameUz": name_uz, "nameRu": name_ru,
            "descriptionUz": desc_uz, "descriptionRu": desc_ru,
            "materialUz": mu, "materialRu": mr,
            "price": g["price"], "oldPrice": None,
            "sizes": sizes, "minOrderQty": 1,
            "category": cat, "isNew": r <= 10,
            "colorUz": cu, "colorRu": cr,
            "sourceCaption": g["caption"], "latest": g["latest"],
            "images": picked[str(r)],
        })

    json.dump({"count": len(out), "products": out}, open(DST, "w", encoding="utf-8"),
              ensure_ascii=False, indent=2)
    print(f"{len(out)} ta mahsulot -> {DST}\n")
    for p in out:
        print(f"[{p['rank']:2}] {p['slug'][:44]:<44} {p['price']:>7,}  {len(p['sizes'])} razmer  {len(p['images'])} rasm  {p['category']}")

if __name__ == "__main__":
    main()
