import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { slugify } from "../src/lib/slug";

const db = new PrismaClient();

const CATEGORIES = [
  { slug: "abaya", nameUz: "Abayalar", nameRu: "Абайи", sortOrder: 1 },
  { slug: "koylak", nameUz: "Ko'ylaklar", nameRu: "Платья", sortOrder: 2 },
  { slug: "rumol", nameUz: "Rumollar", nameRu: "Платки", sortOrder: 3 },
  { slug: "toplam", nameUz: "To'plamlar", nameRu: "Комплекты", sortOrder: 4 },
];

const SETTINGS: Record<string, string> = {
  phone: "+998 97 423 81 41",
  addressUz: "Toshkent, Bek Baraka bozori, 12-qator, 473-do'kon",
  addressRu: "Ташкент, рынок Бек Барака, 12-й ряд, магазин 473",
  tgOrderUsername: "oltinoy_shopping",
  tgChannelUrl: "https://t.me/oltinoy_collection",
};

const PRODUCTS: {
  category: string;
  nameUz: string;
  nameRu: string;
  materialUz: string;
  materialRu: string;
  price: number;
  oldPrice?: number;
  sizes: string[];
  minOrderQty: number;
  isNew: boolean;
}[] = [
  {
    category: "abaya",
    nameUz: "Zilola abaya, PRADO mato",
    nameRu: "Абайя «Зилола», ткань PRADO",
    materialUz: "PRADO mato, gulli qism XB LION",
    materialRu: "Ткань PRADO, узорная вставка XB LION",
    price: 149000,
    sizes: ["46", "48", "50", "52", "54", "56"],
    minOrderQty: 1,
    isNew: true,
  },
  {
    category: "abaya",
    nameUz: "Munisa abaya, keshtali yenglar",
    nameRu: "Абайя «Муниса», вышитые рукава",
    materialUz: "Adnatoni mato, qo'lda keshta",
    materialRu: "Ткань Аднатони, ручная вышивка",
    price: 165000,
    oldPrice: 179000,
    sizes: ["46", "48", "50", "52", "54"],
    minOrderQty: 1,
    isNew: true,
  },
  {
    category: "koylak",
    nameUz: "Gulbahor ko'ylagi, keng yenglar",
    nameRu: "Платье «Гулбахор», широкие рукава",
    materialUz: "Krep-shifon, astarlangan",
    materialRu: "Креп-шифон, на подкладке",
    price: 139000,
    sizes: ["46", "48", "50", "52", "54", "56"],
    minOrderQty: 2,
    isNew: true,
  },
  {
    category: "koylak",
    nameUz: "Sevinch ko'ylagi, kamar bilan",
    nameRu: "Платье «Севинч», с поясом",
    materialUz: "Turkiston tri-nite, elastik",
    materialRu: "Трикотаж Туркистон, эластичный",
    price: 145000,
    sizes: ["46", "48", "50", "52"],
    minOrderQty: 2,
    isNew: false,
  },
  {
    category: "rumol",
    nameUz: "Rumol to'plami, 3 ranglar",
    nameRu: "Комплект платков, 3 цвета",
    materialUz: "Modal mato, yumshoq to'qima",
    materialRu: "Ткань модал, мягкая текстура",
    price: 149000,
    sizes: ["Standart"],
    minOrderQty: 5,
    isNew: false,
  },
  {
    category: "toplam",
    nameUz: "Nafisa to'plami — abaya + rumol",
    nameRu: "Комплект «Нафиса» — абайя + платок",
    materialUz: "PRADO mato + modal rumol",
    materialRu: "Ткань PRADO + платок модал",
    price: 159000,
    sizes: ["46", "48", "50", "52", "54", "56"],
    minOrderQty: 1,
    isNew: true,
  },
];

/**
 * 10 fully-written articles from the content plan (maqolalar-1-10.md), staggered
 * publishedAt dates matching the recommended weekly cadence so the blog archive
 * reads naturally rather than "50 posts published in one day".
 */
const POSTS: {
  slug: string;
  titleUz: string;
  titleRu: string;
  excerptUz: string;
  excerptRu: string;
  contentUz: string;
  contentRu: string;
  publishedAt: string;
}[] = [
  {
    slug: "abaya-optom-olishda-nimalarga-etibor-berish-kerak",
    titleUz: "Abaya optom olishda nimalarga e'tibor berish kerak: to'liq qo'llanma",
    titleRu: "На что обратить внимание при оптовой закупке абай: полное руководство",
    excerptUz:
      "Abaya optom olayotganda mato, tikuv sifati, razmer qatori va narxni qanday tekshirish kerak — tikuv sexi tajribasidan amaliy qo'llanma.",
    excerptRu:
      "Что проверять при оптовой закупке абай — ткань, качество пошива, размерный ряд и цену — практическое руководство из опыта швейного цеха.",
    publishedAt: "2026-05-18",
    contentUz: `Abaya — O'zbekistonda eng barqaror sotiladigan yopiq liboslardan biri. Lekin optom xariddagi bitta noto'g'ri qaror — sifatsiz mato, kam yuradigan razmer yoki oshirilgan narx — butun partiya foydasini yeb qo'yishi mumkin. Quyida o'z tikuv sexrimizda har kuni ko'radigan tajribamiz asosida abaya optom olishda tekshirilishi shart bo'lgan 5 asosiy nuqtani keltiramiz.

## 1. Mato va tikuv sifatini joyida tekshiring

Abayaning umri matodan boshlanadi. Qo'lingizga oling: sifatli mato og'irroq turadi, yorug'likka tutganda siyrak joylari ko'rinmaydi, g'ijimlaganda darrov o'z holiga qaytadi. Keyin choklarga qarang — ip mato rangiga mos bo'lishi, chok qadamlari bir tekis turishi, yeng va etak ichki tomondan toza qayirilgan bo'lishi kerak. Astarli modellarda astar tashqi matodan qisqa bo'lmasligi lozim. Bitta donani ag'darib 2 daqiqa qarash — butun partiyaning sifatini aytib beradi.

## 2. Razmer qatori to'liqligini so'rang

Yakka 50-razmer bilan savdo qilish qiyin. Mijoz kelib o'ziga mos o'lchamni topa olmasa, boshqa do'konga ketadi. Shuning uchun tajribali optomchilar har modeldan to'liq qator — 48, 50, 52, 54, 56 — olishga harakat qiladi. Yetkazuvchidan qatorning to'liqligini oldindan aniqlang: ba'zi sotuvchilar faqat "yurimsiz" qolgan razmerlarni optomga chiqaradi.

## 3. Narx tarkibini tushuning: bozor va tikuv sexi farqi

Bozordagi narx ichida odatda kamida bitta, ko'pincha ikkita vositachi ustamasi yotadi. Tikuv sexidan to'g'ridan-to'g'ri olganda esa siz ishlab chiqarish narxiga eng yaqin summani to'laysiz — farq odatda partiya hajmiga qarab sezilarli chiqadi. Bundan tashqari, sexda modelning qaysi matodan, qanday sharoitda tikilganini o'z ko'zingiz bilan ko'rasiz. Taqqoslash uchun har doim kamida ikki manbadan narx so'rang.

## 4. Bron (oldindan buyurtma) imkoniyatidan foydalaning

Yangi kolleksiya chiqqanda eng chiroyli modellar va yurimli razmerlar birinchi kunlardayoq tarqab ketadi. Bron tizimi bor yetkazuvchi bilan ishlasangiz, kolleksiya hali tikuvda bo'lganida o'zingizga kerakli razmer va miqdorni band qilib qo'yasiz. Bu ayniqsa Ramazon va hayit oldi mavsumida katta ustunlik beradi.

## 5. Qabul qilishda tekshiruv cheklisti

Partiyani qabul qilayotganda quyidagilarni tekshiring: dona soni buyurtmaga mosligi; razmerlar yorliqdagi bilan bir xilligi; barcha donalar bir partiyadan (rang tusi farq qilmasligi); zamok va tugmalar ishlashi; dog', ip chiqishi yo'qligi. Muammo topilsa, o'sha zahoti suratga olib yetkazuvchiga yuboring — keyin isbotlash qiyin bo'ladi.

## Tez-tez so'raladigan savollar

**Abaya optomda minimal buyurtma qancha bo'ladi?**
Yetkazuvchiga bog'liq. Ko'pchilik sexlar, jumladan biz ham, bitta modeldan razmer qatori bo'yicha kichik partiyadan boshlashga ruxsat beramiz — bu yangi optomchilar uchun xavfsiz start.

**Optom narx bilan chakana narx orasidagi farq odatda qancha?**
O'zbekiston bozorida yopiq liboslarda ustama odatda 30–50% oralig'ida qo'yiladi. Ya'ni 140 000 so'mlik abaya chakanada 185 000–210 000 atrofida sotiladi.

**Rasm orqali optom olsam bo'ladimi?**
Bo'ladi, lekin birinchi hamkorlikda kichik sinov partiyasi oling yoki video-ko'rik so'rang. Ishonch hosil qilgach, katta partiyaga o'ting.

*Oltinoy Collection — o'z tikuv sexiga ega brend. Har hafta yangi abaya va ko'ylak kolleksiyalari optom narxlarda: [katalogni ko'rish](/katalog/abaya). Savollar uchun: [aloqa](/aloqa).*`,
    contentRu: `Абайя — один из самых стабильно продаваемых видов закрытой одежды в Узбекистане. Но одно неверное решение при оптовой закупке — некачественная ткань, размер, который плохо идёт, или завышенная цена — может съесть всю прибыль партии. Ниже — 5 главных пунктов, которые стоит проверить при оптовой закупке абай, основанные на нашем ежедневном опыте в собственном швейном цехе.

## 1. Проверяйте качество ткани и пошива на месте

Жизнь абайи начинается с ткани. Возьмите в руки: качественная ткань немного тяжелее, на просвет не видно редких участков, после сминания быстро возвращается в исходное состояние. Затем посмотрите на швы — нить должна соответствовать цвету ткани, стежки должны быть ровными, а рукава и подол аккуратно подшиты изнутри. В моделях с подкладкой подкладка не должна быть короче основной ткани. Достаточно повертеть в руках одно изделие в течение 2 минут, чтобы понять качество всей партии.

## 2. Уточняйте полноту размерного ряда

Торговать только одним 50-м размером сложно. Если клиент не найдёт свой размер, он уйдёт в другой магазин. Поэтому опытные оптовики стараются брать полный ряд по каждой модели — 48, 50, 52, 54, 56. Заранее уточните у поставщика полноту ряда: некоторые продавцы выставляют оптом только «зависшие» размеры.

## 3. Разберитесь в структуре цены: рынок и швейный цех

В рыночной цене обычно заложена минимум одна, а часто и две посреднические наценки. При закупке напрямую у швейного цеха вы платите сумму, максимально близкую к себестоимости производства — разница обычно ощутима в зависимости от объёма партии. К тому же в цехе вы своими глазами видите, из какой ткани и в каких условиях шьётся модель. Для сравнения всегда запрашивайте цену минимум у двух источников.

## 4. Используйте возможность бронирования (предзаказа)

Когда выходит новая коллекция, самые красивые модели и ходовые размеры разбирают в первые же дни. Если вы работаете с поставщиком, у которого есть система бронирования, вы можете забронировать нужный размер и количество ещё до того, как коллекция полностью сшита. Это особенно даёт преимущество в сезон Рамазана и Хайита.

## 5. Чек-лист проверки при приёмке партии

При приёмке партии проверьте: соответствие количества заказу; совпадение размеров с ярлыками; принадлежность всех изделий к одной партии (без разницы в оттенке); работу молний и пуговиц; отсутствие пятен и торчащих нитей. Если обнаружена проблема — сразу сфотографируйте и отправьте поставщику, позже доказать это будет сложно.

## Часто задаваемые вопросы

**Какой минимальный объём оптового заказа абай?**
Зависит от поставщика. Многие цеха, включая нас, разрешают начинать с небольшой партии по размерному ряду одной модели — это безопасный старт для новых оптовиков.

**Какая обычно разница между оптовой и розничной ценой?**
На рынке Узбекистана на закрытую одежду обычно закладывается наценка 30–50%. То есть абайя за 140 000 сум в рознице продаётся за 185 000–210 000.

**Можно ли заказывать оптом по фото?**
Можно, но при первом сотрудничестве возьмите небольшую пробную партию или запросите видео-обзор. После того как убедитесь в надёжности, переходите на крупные партии.

*Oltinoy Collection — бренд с собственным швейным цехом. Каждую неделю новые коллекции абай и платьев по оптовым ценам: [смотреть каталог](/ru/katalog/abaya). По вопросам: [контакты](/ru/aloqa).*`,
  },
  {
    slug: "kiyim-sotish-biznesini-qanday-boshlash",
    titleUz: "Kiyim sotish biznesini 0 dan boshlash: 2026-yil uchun amaliy qo'llanma",
    titleRu: "Как начать бизнес по продаже одежды с нуля: практическое руководство 2026",
    excerptUz:
      "Kapital, nisha, birinchi partiya, sotuv kanali va narx qo'yish — kiyim biznesini noldan boshlashning 6 amaliy bosqichi raqamlar bilan.",
    excerptRu:
      "Капитал, ниша, первая партия, канал продаж и ценообразование — 6 практических шагов запуска бизнеса по продаже одежды с нуля с конкретными цифрами.",
    publishedAt: "2026-05-21",
    contentUz: `O'zbekistonda onlayn savdo yildan-yilga tez o'smoqda va kiyim — internetda eng ko'p sotiladigan kategoriyalardan biri. Bu bozorga kirish uchun katta do'kon ham, katta kapital ham shart emas. Quyida kiyim savdosini noldan boshlashning 6 bosqichli rejasi.

## 1-bosqich. Nisha tanlang: hamma narsani sotmang

"Ayollar kiyimi" — bu nisha emas, bu okean. Toraytiring: masalan, yopiq liboslar (abaya, hijob ko'ylaklar, rumol to'plamlari). Bu segmentda talab mavsumga kam bog'liq, auditoriya sodiq, qaytadan xarid yuqori. Bitta nishada chuqur bo'lish — yuzta nishada yuzaki bo'lishdan foydali.

## 2-bosqich. Boshlang'ich kapitalni hisoblang

Minimal ish rejasi: 20–30 donalik sinov partiyasi. Masalan, o'rtacha optom narxi 140 000 so'mdan 20 dona — 2,8 mln so'm. Ustiga yetkazib berish, qadoqlash va reklama testiga 500 ming–1 mln qo'shing. Demak, 3,5–4 mln so'm bilan real start qilish mumkin. Bor pulning hammasini tovarga tikmang — kamida 20% zaxira qoldiring.

## 3-bosqich. Birinchi partiyani to'g'ri oling

Ikki qoida: birinchidan, bitta modeldan ko'p emas, ko'p modeldan ozdan oling — qaysi biri "yuradi"ganini bozor o'zi ko'rsatadi. Ikkinchidan, razmerlarni real talabga moslang: O'zbekistonda 50–52 razmerlar eng ko'p so'raladi, chekka razmerlar (46 va 56) kamroq olinadi. Ishlab chiqaruvchidan to'g'ridan-to'g'ri olsangiz, xit modelni keyin xohlagancha qayta buyurtma qila olasiz — bu bozordan olishga nisbatan katta ustunlik.

## 4-bosqich. Sotuv kanalini quring

Boshlanish uchun Telegram-kanal + Instagram-sahifa yetarli. Telegram — buyurtma va doimiy mijozlar uchun, Instagram — yangi auditoriya oqimi uchun. Do'kon ijarasiz ishlash mumkin: buyurtma keladi, yetkazib berish xizmati olib boradi. Muhimi — har kuni kontent: mahsulot videosi, o'lchamlar, narx ochiq yozilgan post.

## 5-bosqich. Narx va ustamani belgilang

Tannarxga faqat tovar narxini emas, yetkazish, qadoqlash, reklama va o'z vaqtingizni ham qo'shing. Yopiq liboslarda odatiy ustama — 30–50%. Misol: optom 140 000 → sotuv 189 000–210 000. Chegara: raqobatchilar narxidan uzoqlashmang, lekin eng arzon bo'lishga ham urinmang — eng arzon sotuvchi eng birinchi kuyadi.

## 6-bosqich. Birinchi mijozlar va qayta sotuv

Birinchi 10 mijoz — tanish-bilishlar va mahalla chatlari orqali keladi, bu normal. Har bir xaridorning kontaktini saqlang, yangi kolleksiya kelganda birinchi bo'lib ularga yozing. Kiyim savdosida asosiy foyda yangi mijozdan emas, qayta xariddan chiqadi.

## Tez-tez so'raladigan savollar

**Ish boshlash uchun YaTT ochish shartmi?**
Doimiy faoliyat va onlayn to'lovlar uchun rasmiylashish kerak bo'ladi. Aniq talab va stavkalarni soliq idorasining rasmiy manbalaridan tekshiring — ular yangilanib turadi.

**Zaxira ushlamasdan savdo qilsa bo'ladimi?**
Bo'ladi — bron/pre-order modeli: mijozdan buyurtma olasiz, keyin yetkazuvchidan olasiz. Foyda kamroq, lekin risk deyarli nol. Boshlovchilar uchun yaxshi start.

*Birinchi partiyangizni izlayapsizmi? Oltinoy Collection tikuv sexidan haftalik yangi kolleksiyalar, kichik partiyadan boshlab: [katalog](/katalog). Savollar uchun: [aloqa](/aloqa).*`,
    contentRu: `Онлайн-торговля в Узбекистане растёт из года в год, и одежда — одна из самых продаваемых категорий в интернете. Чтобы войти в этот рынок, не обязательны ни большой магазин, ни крупный капитал. Ниже — план запуска торговли одеждой с нуля из 6 шагов.

## Шаг 1. Выберите нишу: не продавайте всё подряд

«Женская одежда» — это не ниша, это океан. Сузьте фокус: например, закрытая одежда (абайи, хиджаб-платья, комплекты платков). В этом сегменте спрос слабо зависит от сезона, аудитория лояльна, повторные покупки высокие. Быть глубоким в одной нише выгоднее, чем поверхностным в сотне.

## Шаг 2. Рассчитайте стартовый капитал

Минимальный рабочий план: пробная партия 20–30 единиц. Например, при средней оптовой цене 140 000 сум за 20 штук — 2,8 млн сум. Добавьте 500 тыс.–1 млн на доставку, упаковку и тестовую рекламу. Итого реальный старт возможен с 3,5–4 млн сум. Не вкладывайте все деньги в товар — оставьте минимум 20% резерва.

## Шаг 3. Правильно возьмите первую партию

Два правила: во-первых, лучше взять понемногу разных моделей, чем много одной — рынок сам покажет, какая «пойдёт». Во-вторых, размеры должны соответствовать реальному спросу: в Узбекистане больше всего спрашивают 50–52 размеры, крайние размеры (46 и 56) берут меньше. Закупая напрямую у производителя, вы сможете потом повторно заказать хитовую модель сколько угодно — это большое преимущество перед закупкой на рынке.

## Шаг 4. Постройте канал продаж

Для старта достаточно Telegram-канала и страницы в Instagram. Telegram — для заказов и постоянных клиентов, Instagram — для притока новой аудитории. Работать можно без аренды магазина: заказ поступает, доставляет служба доставки. Главное — ежедневный контент: видео товара, размеры, цена открыто указана в посте.

## Шаг 5. Определите цену и наценку

В себестоимость закладывайте не только цену товара, но и доставку, упаковку, рекламу и своё время. Для закрытой одежды обычная наценка — 30–50%. Пример: опт 140 000 → продажа 189 000–210 000. Ограничение: не отрывайтесь от цен конкурентов, но и не пытайтесь быть самым дешёвым — самый дешёвый продавец сгорает первым.

## Шаг 6. Первые клиенты и повторные продажи

Первые 10 клиентов обычно приходят через знакомых и районные чаты — это нормально. Сохраняйте контакты каждого покупателя, пишите им первыми при поступлении новой коллекции. Основная прибыль в торговле одеждой приходит не от новых клиентов, а от повторных покупок.

## Часто задаваемые вопросы

**Обязательно ли открывать ИП для начала?**
Для постоянной деятельности и онлайн-платежей потребуется официальное оформление. Точные требования и ставки уточняйте на официальных источниках налоговой службы — они периодически обновляются.

**Можно ли торговать без остатка на складе?**
Можно — модель брони/предзаказа: вы принимаете заказ от клиента, затем берёте у поставщика. Прибыль меньше, но риск почти нулевой. Хороший старт для новичков.

*Ищете первую партию? Oltinoy Collection — еженедельные новые коллекции из швейного цеха, можно начать с небольшой партии: [каталог](/ru/katalog). По вопросам: [контакты](/ru/aloqa).*`,
  },
  {
    slug: "ayollar-koylaklarini-optom-qayerdan-olish-mumkin",
    titleUz: "Ayollar ko'ylaklarini optom qayerdan olish mumkin? Toshkent bo'yicha halol taqqoslash",
    titleRu: "Где купить женские платья оптом? Честное сравнение по Ташкенту",
    excerptUz:
      "Abu Saxiy, Bek Baraka, Telegram-kanallar yoki tikuv sexi — optomchi uchun qaysi biri qulay? Narx, sifat va risk bo'yicha halol taqqoslash.",
    excerptRu:
      "Абу Сахий, Бек Барака, Telegram-каналы или швейный цех — что удобнее оптовику? Честное сравнение по цене, качеству и риску.",
    publishedAt: "2026-05-25",
    contentUz: `Kiyim savdosini boshlayotgan har bir optomchi bir xil savoldan boshlaydi: tovarni qayerdan olsam — arzon ham, sifatli ham bo'lsin? Toshkentda buning to'rtta asosiy yo'li bor va har birining o'z kuchli hamda zaif tomonlari mavjud. Quyida hech kimni "yagona to'g'ri manba" deb ko'rsatmasdan, real taqqoslab chiqamiz.

## 1. Abu Saxiy bozori — import tovarlar markazi

Xitoy, Turkiya va Qirg'izistondan keladigan tovarning asosiy oqimi shu yerdan o'tadi. Kuchli tomoni — assortiment kengligi va past narx segmenti. Zaif tomoni — sifat juda notekis: bitta qatordagi ikki do'konda bir xil ko'rinishdagi ko'ylak butunlay boshqa matodan bo'lishi mumkin. Tanlab olish uchun vaqt va tajriba kerak. Yopiq liboslar bo'yicha tanlov bor, lekin ixtisoslashuv yo'q.

## 2. Bek Baraka bozori — mahalliy ishlab chiqaruvchilar hududi

Bek Barakada mahalliy tikuv sexlarining do'konlari jamlangan, ayniqsa abaya, hijob ko'ylaklar va rumol to'plamlari bo'yicha bu yer Toshkentdagi eng kuchli nuqtalardan biri. Afzalligi — mahalliy tikuv: razmerlar o'zbek xaridoriga moslangan, qayta buyurtma berish oson, sotuvchi bilan to'g'ridan-to'g'ri gaplashasiz. Narxlar Abu Saxiydagi eng arzon import tovarlardan yuqoriroq, lekin sifat/narx nisbati odatda yaxshiroq.

## 3. Telegram optom kanallari — qulay, lekin ehtiyot bo'ling

Bugungi kunda optom savdoning katta qismi Telegramga ko'chgan: kanalda rasm, narx, razmer — yozasiz va yetkazib berishadi. Qulaylik shubhasiz. Risklar ham aniq: rasm bilan real tovar farq qilishi, oldindan to'lovdan keyin aloqaga chiqmaslik holatlari, sifatni ko'rmasdan olish. Qoida: yangi kanal bilan birinchi ishda faqat kichik summa, iloji bo'lsa do'koni yoki sexi borligini tekshirish.

## 4. Tikuv sexidan to'g'ridan-to'g'ri — eng qisqa zanjir

Vositachisiz eng past narx, sifatni manbada ko'rish, to'liq razmer qatori va yangi kolleksiyaga birinchi bo'lib kirish — bu yo'lning afzalliklari. Kamchiligi: har bir sex tor assortimentga ega (o'z yo'nalishida chuqur, lekin keng emas), shuning uchun optomchilar odatda 2–3 sex bilan parallel ishlaydi. Sayt yoki kanal orqali bron qilish imkoni bo'lgan sexlar bilan ishlash eng qulayi — kolleksiya tikilmasidan razmeringiz band bo'ladi.

## Taqqoslash jadvali

| Manba | Narx | Sifat barqarorligi | Risk | Kimga mos |
|---|---|---|---|---|
| Abu Saxiy | Eng past | Notekis | O'rta | Keng assortiment izlovchilar |
| Bek Baraka | O'rta | Yaxshi | Past | Yopiq liboslar sotuvchilari |
| Telegram kanallar | Har xil | Noma'lum | Yuqori | Tajribali, ehtiyotkor xaridorlar |
| Tikuv sexi | Past | Nazorat ostida | Past | Doimiy hamkorlik izlovchilar |

## Tez-tez so'raladigan savollar

**Yangi boshlovchi qayerdan boshlagani ma'qul?**
Yopiq liboslar yo'nalishida — Bek Baraka yoki bitta ishonchli tikuv sexidan kichik sinov partiyasi bilan. Assortimentni his qilgach, manbalarni kengaytirasiz.

**Viloyatdan turib optom olsam bo'ladimi?**
Bo'ladi: bugungi kunda sexlar va do'konlar barcha viloyatlarga yetkazib berish xizmatlari orqali yuboradi. Saytda yoki kanalda bron qilib, tayyor partiyani qabul qilasiz.

*Oltinoy Collection — Bek Baraka bozori, 12-qator, 473-do'kon va onlayn: [katalog](/katalog). Savollar uchun: [aloqa](/aloqa). O'z sexrimizda tikilgan haftalik yangi kolleksiyalar.*`,
    contentRu: `Каждый, кто начинает торговлю одеждой, задаётся одним и тем же вопросом: где взять товар — чтобы и недорого, и качественно? В Ташкенте есть четыре основных пути, и у каждого свои сильные и слабые стороны. Ниже — честное сравнение без утверждения, что есть «единственно правильный» источник.

## 1. Рынок Абу Сахий — центр импортного товара

Основной поток товара из Китая, Турции и Кыргызстана проходит именно отсюда. Сильная сторона — широкий ассортимент и низкий ценовой сегмент. Слабая — качество очень неровное: одинаковые на вид платья в двух соседних магазинах могут оказаться из совершенно разной ткани. Чтобы выбрать хорошее, нужны время и опыт. Выбор закрытой одежды есть, но специализации нет.

## 2. Рынок Бек Барака — территория местных производителей

На Бек Бараке сосредоточены магазины местных швейных цехов, особенно сильно представлены абайи, хиджаб-платья и комплекты платков — это одна из самых сильных точек Ташкента в этом сегменте. Преимущество — местный пошив: размеры адаптированы под узбекского покупателя, повторный заказ сделать легко, вы общаетесь напрямую с продавцом. Цены выше самых дешёвых импортных товаров с Абу Сахий, но соотношение цена/качество обычно лучше.

## 3. Оптовые Telegram-каналы — удобно, но осторожно

Сегодня большая часть оптовой торговли переместилась в Telegram: в канале фото, цена, размер — пишете и вам доставляют. Удобство бесспорно. Риски тоже очевидны: реальный товар может отличаться от фото, случаи пропажи связи после предоплаты, покупка без возможности увидеть качество. Правило: с новым каналом при первой сделке — только небольшая сумма, по возможности проверить наличие магазина или цеха.

## 4. Напрямую от швейного цеха — самая короткая цепочка

Самая низкая цена без посредников, возможность увидеть качество у источника, полный размерный ряд и первый доступ к новой коллекции — преимущества этого пути. Недостаток: у каждого цеха узкий ассортимент (глубокий в своём направлении, но не широкий), поэтому оптовики обычно работают параллельно с 2–3 цехами. Удобнее всего работать с цехами, где есть возможность бронирования через сайт или канал — тогда ваш размер бронируется ещё до пошива коллекции.

## Сравнительная таблица

| Источник | Цена | Стабильность качества | Риск | Кому подходит |
|---|---|---|---|---|
| Абу Сахий | Самая низкая | Неровная | Средний | Ищущим широкий ассортимент |
| Бек Барака | Средняя | Хорошая | Низкий | Продавцам закрытой одежды |
| Telegram-каналы | Разная | Неизвестна | Высокий | Опытным, осторожным покупателям |
| Швейный цех | Низкая | Под контролем | Низкий | Ищущим постоянное сотрудничество |

## Часто задаваемые вопросы

**С чего лучше начать новичку?**
В направлении закрытой одежды — с Бек Бараки или одного надёжного швейного цеха, с небольшой пробной партии. Почувствовав ассортимент, вы расширите источники.

**Можно ли закупать оптом, находясь в другом регионе?**
Можно: сегодня цеха и магазины отправляют товар во все регионы через службы доставки. Забронировав на сайте или в канале, вы получаете готовую партию.

*Oltinoy Collection — рынок Бек Барака, 12-й ряд, магазин 473, и онлайн: [каталог](/ru/katalog). По вопросам: [контакты](/ru/aloqa). Еженедельные новые коллекции из нашего цеха.*`,
  },
  {
    slug: "tikuv-sexidan-togridan-togri-olish-afzalliklari",
    titleUz: "Tikuv sexidan to'g'ridan-to'g'ri olishning 7 afzalligi",
    titleRu: "7 преимуществ закупки напрямую у швейного цеха",
    excerptUz:
      "Vositachisiz narx, manbada sifat nazorati, to'liq razmer qatori, bron va qayta buyurtma — sexdan to'g'ridan-to'g'ri olishning real afzalliklari.",
    excerptRu:
      "Цена без посредников, контроль качества у источника, полный размерный ряд, бронирование и повторный заказ — реальные преимущества закупки напрямую у цеха.",
    publishedAt: "2026-05-28",
    contentUz: `Optom savdoda oddiy haqiqat bor: zanjir qancha qisqa bo'lsa, foyda shuncha sizda qoladi. Ishlab chiqaruvchi bilan to'g'ridan-to'g'ri ishlash — shu zanjirning eng qisqa varianti. Quyida buning 7 aniq afzalligi, o'z sexrimiz tajribasidan.

## 1. Vositachisiz narx

Bozorga yetib borguncha tovar odatda 1–2 qo'ldan o'tadi va har qo'l o'z ustamasini qo'shadi. Sexdan olganingizda shu ustamalar sizning foydangizga aylanadi — bir xil chakana narxda siz raqobatchidan ko'proq ishlaysiz yoki narxda ustunlik qilasiz.

## 2. Sifat manbada nazorat qilinadi

Sexda siz matoning rulonini, tikuv jarayonini, tayyor mahsulot tekshiruvini ko'rasiz. Muammo chiqsa, kim javob berishi aniq — "men olib kelganman, bilmadim" degan javob yo'q.

## 3. To'liq razmer qatori kafolati

Bozor peshtaxtasida ko'pincha "qolgan" razmerlar turadi. Sex esa har modelni to'liq qatorda — 46 dan 56 gacha — tikadi va sizga kerakli taqsimotda beradi.

## 4. Bron: kolleksiyani tikilishidan oldin band qilasiz

Ishlab chiqaruvchining eng katta ustunliklaridan biri — pre-order. Yangi kolleksiya rasmlari chiqadi, siz razmer va miqdorni band qilasiz, partiya aynan buyurtmalarga qarab tikiladi. Sizda "sotilmay qolish" riski, sexda "ortiqcha zaxira" riski kamayadi.

## 5. Xit modelni qayta buyurtma qilish mumkin

Bozordan olingan model tugasa — tugadi, xuddi shunisini topolmaysiz. Sex bilan ishlaganda esa yaxshi ketgan modelni xohlagancha qayta tiktirasiz. Barqaror sotiladigan "oltin" modellar bazasi shunday yig'iladi.

## 6. Barqaror hamkorlik = yaxshiroq shartlar

Doimiy mijoz sex uchun qimmatli: vaqt o'tishi bilan hajmga qarab shartlar yaxshilanadi, yangi kolleksiyani birinchi ko'rish, band qilingan razmerlar, moslashuvchan kelishuvlar paydo bo'ladi. Bozorda har xarid — nolinchi munosabat.

## 7. Yangi kolleksiyaga birinchi kirish

Haftalik yangilanadigan sexda siz trendni bozordan oldin olasiz. Sotuvda birinchi bo'lish — eng yuqori marja bilan sotish degani: model hali hamma joyda paydo bo'lmagan payt.

## Sex realligini qanday tekshirish mumkin

Afsuski, "sexdan" deb yozib, aslida qayta sotuvchilar ham bor. Tekshirish oddiy: ishlab chiqarish jarayonidan video so'rang, manzilini aniqlang (bizniki: Toshkent, Bek Baraka bozori, 12-qator, 473-do'kon), model o'zgartirish yoki qayta tikish mumkinligini so'rang — haqiqiy sex uchun bu tabiiy savollar, vositachi uchun esa qiyin.

## Tez-tez so'raladigan savollar

**Sexdan kichik partiya olsa bo'ladimi yoki faqat katta hajm shartmi?**
Sexiga bog'liq. Biz yangi hamkorlarga kichik sinov partiyasidan boshlashni taklif qilamiz — ishonch ikkala tomon uchun ham xariddan keyin keladi.

**Sexdan olish bozordan qancha arzon chiqadi?**
Model va hajmga qarab farq qiladi, lekin vositachi ustamasi hisobiga tejash odatda sezilarli — aniq raqamni katalogdagi narxlarni bozordagi o'xshash tovar bilan solishtirib o'zingiz ko'rasiz.

*Oltinoy Collection — o'z tikuv sexi, haftalik yangi kolleksiyalar, saytda bron: [katalog](/katalog) · [biz haqimizda](/biz-haqimizda).*`,
    contentRu: `В оптовой торговле есть простая истина: чем короче цепочка, тем больше прибыли остаётся у вас. Работа напрямую с производителем — самый короткий вариант этой цепочки. Ниже — 7 конкретных преимуществ этого подхода из опыта нашего собственного цеха.

## 1. Цена без посредников

Пока товар доходит до рынка, он обычно проходит через 1–2 руки, и каждая добавляет свою наценку. Закупая у цеха, эти наценки остаются в вашей прибыли — при той же розничной цене вы зарабатываете больше конкурента или выигрываете по цене.

## 2. Качество контролируется у источника

В цехе вы видите рулон ткани, процесс пошива, проверку готового изделия. Если возникла проблема, понятно, кто отвечает — нет ответа «я просто привёз, не знаю».

## 3. Гарантия полного размерного ряда

На рыночном прилавке часто остаются только «непроданные» размеры. Цех же шьёт каждую модель полным рядом — от 46 до 56 — и предоставляет вам в нужном распределении.

## 4. Бронирование: резервируете коллекцию ещё до пошива

Одно из главных преимуществ производителя — предзаказ. Выходят фото новой коллекции, вы бронируете размер и количество, партия шьётся именно под заказы. У вас снижается риск «не продать», у цеха — риск «лишнего запаса».

## 5. Возможность повторно заказать хитовую модель

Модель, купленная на рынке, закончилась — и всё, точно такую же не найти. Работая с цехом, вы можете сколько угодно перезаказывать хорошо продающуюся модель. Так формируется база стабильно продаваемых «золотых» моделей.

## 6. Стабильное партнёрство = лучшие условия

Постоянный клиент ценен для цеха: со временем, в зависимости от объёма, условия улучшаются — появляется первый просмотр новой коллекции, забронированные размеры, гибкие договорённости. На рынке же каждая покупка — с нулевым отношением.

## 7. Первый доступ к новой коллекции

В цехе, обновляющемся еженедельно, вы получаете тренд раньше рынка. Быть первым в продаже — значит продавать с самой высокой маржой: пока модель ещё нигде не появилась.

## Как проверить, что это действительно цех

К сожалению, есть и перепродавцы, пишущие «от цеха». Проверка проста: попросите видео процесса производства, уточните адрес (наш: Ташкент, рынок Бек Барака, 12-й ряд, магазин 473), спросите о возможности изменить модель или перешить — для настоящего цеха это естественные вопросы, для посредника — сложные.

## Часто задаваемые вопросы

**Можно ли взять у цеха небольшую партию, или обязателен большой объём?**
Зависит от цеха. Мы новым партнёрам предлагаем начать с небольшой пробной партии — доверие приходит с обеих сторон уже после покупки.

**Насколько закупка у цеха дешевле рынка?**
Зависит от модели и объёма, но экономия за счёт отсутствия посреднической наценки обычно ощутима — точную цифру вы увидите, сравнив цены в каталоге с аналогичным товаром на рынке.

*Oltinoy Collection — собственный швейный цех, еженедельные новые коллекции, бронирование на сайте: [каталог](/ru/katalog) · [о нас](/ru/biz-haqimizda).*`,
  },
  {
    slug: "hijob-koylak-modellari-2026",
    titleUz: "Hijob ko'ylak modellari 2026: qaysi fasonlar eng ko'p sotilmoqda",
    titleRu: "Модели хиджаб-платьев 2026: какие фасоны продаются лучше всего",
    excerptUz:
      "2026-yilda O'zbekistonda eng talabgir hijob ko'ylak fasonlari: keng yeng, belbog'li siluet, gulli shifon, rumolli to'plamlar — tahlil.",
    excerptRu:
      "Самые востребованные фасоны хиджаб-платьев в Узбекистане в 2026 году: широкие рукава, силуэт с поясом, цветочный шифон, комплекты с платками — анализ.",
    publishedAt: "2026-06-01",
    contentUz: `Har hafta yangi kolleksiya chiqaradigan tikuv sexi sifatida biz qaysi model "otilib" ketishini, qaysi biri javonda qolishini birinchi bo'lib ko'ramiz. 2026-yilning birinchi yarmi bo'yicha kuzatuvlarimiz — sotuvchilar va xaridorlar uchun birdek foydali.

## 1. Keng, yig'ma yengli modellar

Yenglarida rezinka yoki yig'ma bo'lgan keng yeng — yilning eng kuchli detali. Sabab oddiy: keng yeng ham talabga mos yopiqlikni beradi, ham libosga harakat va salobat qo'shadi. Ayniqsa bir rangli abayalarda keng yeng modelni "oddiy"dan "bashang"ga aylantiradi.

## 2. Belbog'li (kamarli) siluet

Old tomondan bog'lanadigan yumshoq belbog' — erkin bichimga shakl beruvchi eng sodda yechim. Belbog'li modellar universal: uni bog'lab ham, bo'sh qo'yib ham kiyish mumkin, shuning uchun bitta model kengroq auditoriyaga sotiladi. Sotuvchi uchun bu — kamroq qaytish, ko'proq moslik.

## 3. Gulli shifon — bahor-yoz yetakchisi

Oq yoki krem fonda mayda gulli shifon ko'ylaklar issiq mavsumning eng tez sotiladigan tovari bo'lib qolmoqda. Muhim nuance: mayda gul yirik guldan barqarorroq sotiladi — u yoshi kattaroq auditoriyaga ham, yoshlarga ham birdek yarashadi. Astarli ishlanishi shart — astarsiz shifon qaytishlarning asosiy sababi.

## 4. Rumolli to'plamlar (ko'ylak + mos rumol)

Tayyor to'plam xaridorning "nimani nima bilan kiyaman" muammosini hal qiladi va o'rtacha chekni oshiradi. 2026-yilda to'plamlar ulushi sezilarli o'sdi — ayniqsa sovg'a sifatida olinadigan xaridlarda. Optomchiga maslahat: har kolleksiyada kamida 2–3 to'plamli pozitsiya bo'lsin.

## 5. Tabiiy-neytral palitra + bitta "urg'u" rang

Bej, jigarrang, krem, zaytun — bazani shu ranglar tashkil qilmoqda. Ular ustiga har mavsum bitta yorqin urg'u rang qo'shiladi. Qora esa mavsumdan tashqari klassika bo'lib qolaveradi: qora abaya har doim assortimentda bo'lishi kerak.

## Optomchi uchun qisqa xulosa

Zaxirani taqsimlashda ishlaydigan formula: 40% bir rangli bazaviy modellar (qora, bej, jigarrang), 30% gulli mavsumiy, 20% to'plamlar, 10% trend-eksperiment. Yangi modellarni oldindan bron qilib boring — xit fasonlar birinchi haftadayoq razmer bo'yicha uziladi.

## Tez-tez so'raladigan savollar

**Qaysi razmerlar eng ko'p sotiladi?**
Bizning statistikada 50 va 52 razmerlar yetakchi, keyin 54. Chekka razmerlarni (46, 56) kamroq, lekin albatta qatorda ushlash kerak.

**Trend modellarga ko'p pul tikish kerakmi?**
Yo'q. Trend — assortimentning 10–20% i. Asosiy foyda barqaror bazaviy modellardan keladi, trend esa vitrina va kontent uchun ishlaydi.

*Yangi kolleksiyamizni ko'ring: [abayalar](/katalog/abaya) · [ko'ylaklar](/katalog/koylak). Har hafta yangi modellar, bron qilish saytda.*`,
    contentRu: `Как швейный цех, выпускающий новую коллекцию каждую неделю, мы первыми видим, какая модель «взлетает», а какая остаётся на полке. Наши наблюдения за первую половину 2026 года будут полезны как продавцам, так и покупателям.

## 1. Модели с широкими, присборенными рукавами

Широкий рукав с резинкой или сборкой — самая сильная деталь года. Причина проста: широкий рукав одновременно даёт нужную закрытость и добавляет платью движения и представительности. Особенно в однотонных абайях широкий рукав превращает модель из «простой» в «нарядную».

## 2. Силуэт с поясом

Мягкий пояс, завязывающийся спереди, — самое простое решение, придающее форму свободному крою. Модели с поясом универсальны: их можно завязать или оставить свободными, поэтому одна модель продаётся более широкой аудитории. Для продавца это значит — меньше возвратов, больше соответствия.

## 3. Цветочный шифон — лидер весны-лета

Платья из шифона с мелким цветочным принтом на белом или кремовом фоне остаются самым продаваемым товаром жаркого сезона. Важный нюанс: мелкий цветок продаётся стабильнее крупного — он одинаково хорошо подходит и старшей аудитории, и молодёжи. Подкладка обязательна — шифон без подкладки является главной причиной возвратов.

## 4. Комплекты с платком (платье + подходящий платок)

Готовый комплект решает для покупательницы вопрос «что с чем надеть» и повышает средний чек. В 2026 году доля комплектов заметно выросла — особенно в покупках, которые делают в качестве подарка. Совет оптовику: в каждой коллекции должно быть минимум 2–3 комплектные позиции.

## 5. Натурально-нейтральная палитра + один акцентный цвет

Бежевый, коричневый, кремовый, оливковый — эти цвета составляют базу. К ним каждый сезон добавляется один яркий акцентный цвет. Чёрный же остаётся вне сезона классикой: чёрная абайя должна быть в ассортименте всегда.

## Краткий вывод для оптовика

Рабочая формула распределения запаса: 40% однотонных базовых моделей (чёрный, бежевый, коричневый), 30% сезонных цветочных, 20% комплектов, 10% трендовых экспериментов. Бронируйте новые модели заранее — хитовые фасоны разбирают по размерам уже в первую неделю.

## Часто задаваемые вопросы

**Какие размеры продаются больше всего?**
По нашей статистике лидируют 50 и 52 размеры, затем 54. Крайние размеры (46, 56) берут меньше, но держать их в ряду обязательно.

**Стоит ли вкладывать много денег в трендовые модели?**
Нет. Тренд — это 10–20% ассортимента. Основная прибыль приходит от стабильных базовых моделей, тренд же работает на витрину и контент.

*Смотрите нашу новую коллекцию: [абайи](/ru/katalog/abaya) · [платья](/ru/katalog/koylak). Новые модели каждую неделю, бронирование на сайте.*`,
  },
  {
    slug: "46-56-razmer-jadvali-ayollar-kiyimi",
    titleUz: "46–56 razmer jadvali: ko'ylak o'lchamini to'g'ri aniqlash",
    titleRu: "Таблица размеров 46–56: как правильно определить размер платья",
    excerptUz:
      "Ko'krak, bel va son o'lchovlari bo'yicha 46–56 razmer jadvali, o'zini to'g'ri o'lchash usuli va onlayn buyurtmada adashmaslik sirlari.",
    excerptRu:
      "Таблица размеров 46–56 по обхвату груди, талии и бёдер, правильный способ измерения и секреты, как не ошибиться при онлайн-заказе.",
    publishedAt: "2026-06-04",
    contentUz: `Onlayn buyurtmalardagi qaytishlarning eng katta sababi — razmerda adashish. Vaholanki, uchta o'lchovni bilish va bitta jadvalga qarash kifoya. Quyida O'zbekiston bozorida standart hisoblanadigan 46–56 razmer jadvali va uni to'g'ri ishlatish qoidalari.

## O'zingizni qanday o'lchash kerak

Santimetr lentasi bilan, yupqa kiyimda, uchta joyni o'lchang: **ko'krak aylanasi** — eng chiqib turgan nuqtadan, lenta gorizontal; **bel aylanasi** — eng ingichka joydan, qorinni tortmasdan; **son aylanasi** — eng keng nuqtadan. Lenta zich, lekin qismaydigan holatda tursin.

## Standart razmer jadvali (taxminiy)

| Razmer | Ko'krak (sm) | Bel (sm) | Son (sm) |
|---|---|---|---|
| 46 | 92 | 74 | 100 |
| 48 | 96 | 78 | 104 |
| 50 | 100 | 82 | 108 |
| 52 | 104 | 86 | 112 |
| 54 | 108 | 90 | 116 |
| 56 | 112 | 94 | 120 |

Muhim izoh: bu — umumiy standart. Har bir ishlab chiqaruvchining andozasi ozgina farq qilishi mumkin, shuning uchun sotuvchi bergan jadval bo'lsa, o'shanga tayaning.

## Erkin bichimli liboslarda razmer tanlash

Abaya va erkin ko'ylaklarda vaziyat yengilroq: bunday fasonlar odatda ikki razmerni "qamrab oladi" (masalan, standart bichim 48–52 ga bemalol keladi). Ikki razmer orasida qolsangiz: zich mato va aniq siluetda kattaroqni, cho'ziluvchan yoki juda erkin bichimda kichigini oling. Bo'yga ham e'tibor bering — mahsulot tavsifidagi libos uzunligini o'z bo'yingizga solishtiring.

## Optomchi uchun: razmer taqsimoti

Partiya yig'ayotganda razmerlarni teng olmang — talab teng emas. Bizning sotuv tajribamizda ishlaydigan taxminiy taqsimot: 50 va 52 — partiyaning yarmiga yaqini, 54 — beshdan biri, 48 va 56 — qolgan qismi teng bo'linadi. Aniq nisbat hududga qarab farq qiladi, lekin "o'rta razmerlar ko'proq" qoidasi hamma joyda ishlaydi.

## Tez-tez so'raladigan savollar

**Onlayn buyurtmada eng xavfsiz usul qaysi?**
O'z uchta o'lchovingizni sotuvchiga yozing va aynan shu modelda qaysi razmer to'g'ri kelishini so'rang. Yaxshi sotuvchi libosning real o'lchovlarini aytib bera oladi.

**52 va 54 orasidaman, qaysi birini olay?**
Yopiq liboslarda ko'pchilik kattaroq tomonga o'tadi: ortiqcha erkinlik yopiq libosga xalaqit bermaydi, torlik esa kiyishga yaramaydi.

*Katalogimizda har bir modelning mavjud razmerlari ko'rsatilgan: [ko'rish](/katalog). 46 dan 56 gacha to'liq qator — [abayalar](/katalog/abaya).*`,
    contentRu: `Самая частая причина возвратов при онлайн-заказе — ошибка с размером. При этом достаточно знать три мерки и свериться с одной таблицей. Ниже — стандартная для рынка Узбекистана таблица размеров 46–56 и правила её правильного использования.

## Как правильно измерить себя

Сантиметровой лентой, в тонкой одежде, измерьте три места: **обхват груди** — по самой выступающей точке, лента горизонтально; **обхват талии** — по самому узкому месту, не втягивая живот; **обхват бёдер** — по самой широкой точке. Лента должна прилегать плотно, но не сдавливать.

## Стандартная таблица размеров (примерная)

| Размер | Грудь (см) | Талия (см) | Бёдра (см) |
|---|---|---|---|
| 46 | 92 | 74 | 100 |
| 48 | 96 | 78 | 104 |
| 50 | 100 | 82 | 108 |
| 52 | 104 | 86 | 112 |
| 54 | 108 | 90 | 116 |
| 56 | 112 | 94 | 120 |

Важное замечание: это общий стандарт. Лекала каждого производителя могут немного отличаться, поэтому если продавец предоставляет свою таблицу — ориентируйтесь на неё.

## Выбор размера в свободных фасонах

С абайями и свободными платьями ситуация проще: такие фасоны обычно «охватывают» два размера сразу (например, стандартный крой свободно садится на 48–52). Если вы между двумя размерами: при плотной ткани и чёткого силуэта берите больший, при эластичной или очень свободной — меньший. Обращайте внимание и на рост — сверяйте длину изделия в описании со своим ростом.

## Для оптовика: распределение размеров

При формировании партии не берите размеры поровну — спрос не одинаков. По нашему опыту продаж работает примерно такое распределение: 50 и 52 — около половины партии, 54 — пятая часть, 48 и 56 — оставшаяся часть делится поровну. Точное соотношение отличается по региону, но правило «средних размеров больше» работает везде.

## Часто задаваемые вопросы

**Какой самый безопасный способ при онлайн-заказе?**
Напишите продавцу свои три мерки и спросите, какой размер подойдёт именно в этой модели. Хороший продавец сможет назвать реальные размеры изделия.

**Я между 52 и 54, какой взять?**
В закрытой одежде большинство выбирает больший: лишняя свобода не мешает закрытому платью, а теснота не годится для носки.

*В нашем каталоге у каждой модели указаны доступные размеры: [смотреть](/ru/katalog). Полный ряд от 46 до 56 — [абайи](/ru/katalog/abaya).*`,
  },
  {
    slug: "shifon-prado-lion-matolari-farqi",
    titleUz: "Shifon, PRADO va XB LION matolari: farqi nimada?",
    titleRu: "Шифон, PRADO и XB LION: в чём разница между тканями?",
    excerptUz:
      "Abaya va ko'ylaklarda ishlatiladigan asosiy matolar taqqoslashi: og'irlik, mavsum, parvarish, narx segmenti va sifatni aniqlash usullari.",
    excerptRu:
      "Сравнение основных тканей, используемых в абайях и платьях: вес, сезонность, уход, ценовой сегмент и способы определения качества.",
    publishedAt: "2026-06-08",
    contentUz: `Mahsulot tavsiflarida "shifon", "PRADO", "XB LION" so'zlarini ko'p uchratasiz, lekin bu nomlar ortida nima turganini hamma ham bilmaydi. Tikuvchi sifatida tushuntiramiz — chunki mato tanlash bu narx, qulaylik va libos umrini belgilaydigan asosiy qaror.

## Shifon — yengillik va oqim

Shifon yupqa, yarim shaffof, havodor mato. Undan tikilgan ko'ylak tanaga yopishmaydi, harakatda chiroyli to'lqinlanadi, issiqda saqlaydi. Kamchiliklari: astar talab qiladi (astarsiz shifon — jiddiy xato), ilashib yirtilishga moyil, dazmolda ehtiyotkorlik kerak. Eng kuchli mavsumi — bahor va yoz. Gul bosmalar shifon ustida ayniqsa nafis chiqadi.

## PRADO — zichlik va shakl

PRADO — zichroq, og'irroq tushadigan, shaklni yaxshi ushlaydigan mato turi. Undan tikilgan abaya "osilib" turmaydi, salobatli ko'rinadi, g'ijimga chidamli. Gul bosma PRADO ustida to'q va aniq chiqadi — shuning uchun gulli abayalarning ko'p qismi aynan shu matoda tikiladi. Mavsumi: demi-sezon va salqin kunlar; qattiq issiqda shifondan og'irroq seziladi.

## XB LION — paxta aralash kundalik qulaylik

XB (xlopok — paxta) belgisi tarkibida tabiiy tola borligini bildiradi. LION turkumidagi paxta aralash matolar nafas oladi, terlatmaydi, teri uchun yoqimli — kundalik kiyiladigan ko'ylaklar uchun eng amaliy tanlov. G'ijimlanishga biroz moyilligi bor, lekin parvarishi oson: oddiy rejimda yuviladi, dazmollanadi.

## Taqqoslash jadvali

| Mezon | Shifon | PRADO | XB LION |
|---|---|---|---|
| Og'irlik | Juda yengil | O'rtacha-og'ir | O'rtacha |
| Mavsum | Bahor-yoz | Demi-sezon | Yil davomida |
| Astar kerakmi | Ha, shart | Odatda yo'q | Yo'q |
| G'ijimga chidamlilik | O'rtacha | Yuqori | O'rtacha |
| Parvarish | Nozik rejim | Oson | Oson |
| Kim uchun | Bashang, mavsumiy | Salobatli abayalar | Kundalik kiyim |

## Sifatni qo'lda qanday aniqlash mumkin

Uchta oddiy test: (1) g'ijimlash — sifatli mato bir necha soniyada tiklanadi; (2) yorug'likka tutish — to'qish zichligi bir tekis bo'lishi kerak, "siyrak orollar" arzon matoning belgisi; (3) qirqim chetiga qarash — sifatli matoda tolalar to'kilib turmaydi. Va yana: keskin kimyoviy hid — bo'yoq sifatsizligining ishorasi.

## Tez-tez so'raladigan savollar

**Qaysi mato eng uzoq xizmat qiladi?**
To'g'ri parvarishda PRADO va paxta aralash matolar eng chidamli. Shifon nozikroq, lekin ehtiyot kiyilsa u ham yillab xizmat qiladi.

**Nega bir xil fasondagi ikki ko'ylak narxi har xil?**
Ko'pincha sabab aynan matoda: zichlik (gramaj), bo'yoq sifati va tarkibdagi tabiiy tola ulushi narxni belgilaydi.

*Biz har bir modelning tavsifida matoni aniq yozamiz — [katalogda](/katalog) ko'ring. Savol bo'lsa: [aloqa](/aloqa).*`,
    contentRu: `В описаниях товаров часто встречаются слова «шифон», «PRADO», «XB LION», но не все знают, что за ними стоит. Как швея, объясняем — ведь выбор ткани определяет цену, комфорт и срок службы изделия.

## Шифон — лёгкость и движение

Шифон — тонкая, полупрозрачная, воздушная ткань. Платье из неё не липнет к телу, красиво «течёт» в движении, сохраняет прохладу в жару. Недостатки: требует подкладки (шифон без подкладки — серьёзная ошибка), склонен к зацепкам и разрывам, требует аккуратности при глажке. Самый сильный сезон — весна и лето. Цветочные принты на шифоне смотрятся особенно нежно.

## PRADO — плотность и форма

PRADO — более плотная, тяжёлая ткань, хорошо держащая форму. Абайя из неё не «висит», выглядит представительно, устойчива к сминанию. Цветочный принт на PRADO смотрится ярко и чётко — поэтому большинство цветочных абай шьётся именно из этой ткани. Сезон: межсезонье и прохладные дни; в сильную жару ощущается тяжелее шифона.

## XB LION — хлопковый комфорт на каждый день

Обозначение XB (хлопок) говорит о наличии натурального волокна в составе. Ткани серии LION с добавлением хлопка дышат, не вызывают потливость, приятны для кожи — самый практичный выбор для повседневных платьев. Есть небольшая склонность к сминанию, но уход прост: стирается и гладится в обычном режиме.

## Сравнительная таблица

| Критерий | Шифон | PRADO | XB LION |
|---|---|---|---|
| Вес | Очень лёгкая | Средне-тяжёлая | Средняя |
| Сезон | Весна-лето | Межсезонье | Круглый год |
| Нужна ли подкладка | Да, обязательно | Обычно нет | Нет |
| Устойчивость к сминанию | Средняя | Высокая | Средняя |
| Уход | Деликатный режим | Простой | Простой |
| Кому подходит | Нарядные, сезонные модели | Представительные абайи | Повседневная одежда |

## Как определить качество ткани вручную

Три простых теста: (1) сминание — качественная ткань за несколько секунд расправляется обратно; (2) на просвет — плотность плетения должна быть равномерной, «редкие островки» — признак дешёвой ткани; (3) осмотр среза — у качественной ткани нити не осыпаются. И ещё: резкий химический запах — признак некачественного красителя.

## Часто задаваемые вопросы

**Какая ткань служит дольше всего?**
При правильном уходе PRADO и хлопковые ткани самые долговечные. Шифон более нежный, но при бережной носке тоже служит годами.

**Почему у платьев одного фасона разная цена?**
Часто причина именно в ткани: плотность (грамматура), качество красителя и доля натурального волокна в составе определяют цену.

*Мы указываем точный состав ткани в описании каждой модели — смотрите в [каталоге](/ru/katalog). Вопросы: [контакты](/ru/aloqa).*`,
  },
  {
    slug: "ramazon-hayit-liboslari-optomchi-kalendari",
    titleUz: "Ramazon va hayitga liboslar: qaysi modellarga talab oshadi va qachon tayyorlanish kerak",
    titleRu: "Одежда к Рамазану и Хайиту: когда и почему растёт спрос",
    excerptUz:
      "Ramazon oldidan qaysi liboslarga talab keskin oshadi, namazbop ko'ylaklar, hayit kolleksiyasi va optomchi uchun tayyorgarlik kalendari.",
    excerptRu:
      "Спрос на какую одежду резко растёт перед Рамазаном, намазная одежда, коллекция к Хайиту и календарь подготовки для оптовика.",
    publishedAt: "2026-06-11",
    contentUz: `Yopiq liboslar savdosida yilning eng kuchli davri — Ramazon va hayit mavsumi. Bu oylarda to'g'ri tovar bilan turgan sotuvchi oddiy oyning ikki-uch baravar savdosini qiladi. Muvaffaqiyat siri esa bitta so'zda: tayyorgarlik.

## Talab dinamikasi qanday ishlaydi

Xarid to'lqini Ramazon boshlanishidan 3–4 hafta oldin ko'tarila boshlaydi: ayollar iftorlik va tarovehlarga qulay, yopiq liboslar izlaydi. Ikkinchi, undan ham kuchli to'lqin — hayitdan 2 hafta oldin: bayramga yangi libos olish an'anasi savdoni cho'qqiga chiqaradi. Hayitdan keyingi hafta esa keskin sokinlik — shuning uchun zaxirani bayramgacha sotib tugatish rejasi bilan ishlanadi.

## Ramazon davrida nima sotiladi

Bu oyda amaliylik yutadi: **namazbop ko'ylaklar** — bemalol sajda qilish mumkin bo'lgan erkin, yopiq, yupqa bo'lmagan fasonlar; **sodda, bir rangli abayalar** — har kuni kiyishga; **rumolli to'plamlar** — vaqt tejaydigan tayyor yechim. Bezakka boy, bashang modellarga navbat keyinroq keladi.

## Hayit kolleksiyasi: bayramona, lekin me'yorida

Hayitga xaridor "yangi va chiroyli" izlaydi: yorqinroq ranglar, sifatli gul bosmalar, nafis detallar. Oilaviy xaridlar ko'payadi — ona va qizga uyg'un liboslar, opa-singillarga bir xil to'plamlar. Sovg'a formati kuchayadi, shuning uchun to'plamlar va chiroyli qadoq bu davrda alohida ishlaydi.

## Optomchi uchun tayyorgarlik kalendari

Oddiy qoida: xarid to'lqinidan 6–8 hafta oldin zaxira boshlang. Ramazon har yili taxminan 10–11 kunga oldinga suriladi; 2027-yilda u fevral boshida boshlanadi — demak, optomchi uchun asosiy zaxira davri dekabr–yanvar. Reja: dekabrda modellarni tanlash va bron qilish, yanvarda partiyani qabul qilish va kontent tayyorlash, fevral–martda faol savdo, hayitdan 2 hafta oldin qoldiqlarga aksiya.

Bron tizimi bu mavsumda ayniqsa qimmatli: talab cho'qqisida sexlarning navbati to'lib ketadi, oldindan band qilganlar esa kerakli razmer va miqdorni kafolatli oladi.

## Tez-tez so'raladigan savollar

**Ramazonda narx ko'tariladimi?**
Talab oshgani bilan halol yetkazuvchilar narxni keskin oshirmaydi. Lekin kech qolgan xaridor tanlovsiz qoladi — "narx emas, tovar tugaydi" bu mavsumning asosiy riski.

**Qancha zaxira olish kerak?**
Oddiy oydagi savdongizning 2–2,5 baravariga mo'ljallang, lekin birinchi mavsumingiz bo'lsa ehtiyotkorroq boshlang — mavsum statistikangiz keyingi yilga aniq mo'ljal beradi.

*Ramazon kolleksiyamiz haqida birinchi bo'lib bilish uchun saytda bron tizimidan foydalaning: [katalog](/katalog). Savollar uchun: [aloqa](/aloqa).*`,
    contentRu: `В торговле закрытой одеждой самый сильный период года — сезон Рамазана и Хайита. В эти месяцы продавец с правильным товаром делает в два-три раза больше обычных продаж. А секрет успеха — в одном слове: подготовка.

## Как работает динамика спроса

Волна покупок начинает расти за 3–4 недели до начала Рамазана: женщины ищут удобную закрытую одежду для ифтара и таравих-намазов. Вторая, ещё более сильная волна — за 2 недели до Хайита: традиция покупать новую одежду к празднику поднимает продажи на пик. А через неделю после Хайита наступает резкое затишье — поэтому работа планируется с расчётом распродать запас до праздника.

## Что продаётся в период Рамазана

В этот месяц побеждает практичность: **намазная одежда** — свободные, закрытые, не слишком тонкие фасоны, удобные для земных поклонов; **простые однотонные абайи** — на каждый день; **комплекты с платками** — готовое решение, экономящее время. Модели с обилием декора и нарядные приходят позже.

## Коллекция к Хайиту: праздничная, но в меру

К Хайиту покупатель ищет «новое и красивое»: более яркие цвета, качественные цветочные принты, изящные детали. Растут семейные покупки — гармоничная одежда для мамы и дочки, подарочные комплекты для сестёр. Усиливается подарочный формат, поэтому комплекты и красивая упаковка особенно хорошо работают в этот период.

## Календарь подготовки для оптовика

Простое правило: начинайте формировать запас за 6–8 недель до волны спроса. Рамазан каждый год смещается примерно на 10–11 дней раньше; в 2027 году он начнётся в начале февраля — значит, основной период закупки для оптовика — декабрь–январь. План: в декабре — выбор моделей и бронирование, в январе — приёмка партии и подготовка контента, в феврале–марте — активные продажи, за 2 недели до Хайита — акция на остатки.

Система бронирования особенно ценна в этот сезон: в пик спроса очередь у цехов заполняется, а те, кто забронировал заранее, гарантированно получают нужный размер и количество.

## Часто задаваемые вопросы

**Растут ли цены в Рамазан?**
Несмотря на рост спроса, честные поставщики резко цену не поднимают. Но опоздавший покупатель остаётся без выбора — «не цена, а нехватка товара» является главным риском этого сезона.

**Сколько запаса нужно взять?**
Ориентируйтесь на 2–2,5 объёма вашей обычной продажи за месяц, но если это ваш первый сезон — начните осторожнее: статистика первого сезона даст точный ориентир на следующий год.

*Чтобы узнать о нашей коллекции к Рамазану первыми, используйте систему бронирования на сайте: [каталог](/ru/katalog). Вопросы: [контакты](/ru/aloqa).*`,
  },
  {
    slug: "instagram-telegram-orqali-kiyim-sotish",
    titleUz: "Instagram va Telegram orqali kiyim sotish: optomchilar uchun amaliy formula",
    titleRu: "Продажа одежды в Instagram и Telegram: рабочая формула",
    excerptUz:
      "Reels, stories, kanal postlari orqali kiyim sotishning amaliy formulasi: haftalik kontent-plan, ishonch signallari va keng tarqalgan xatolar.",
    excerptRu:
      "Практическая формула продажи одежды через Reels, сторис и посты в канале: недельный контент-план, сигналы доверия и частые ошибки.",
    publishedAt: "2026-06-15",
    contentUz: `O'zbekistonda kiyim savdosining katta qismi ikki platformada bo'lyapti: Instagram — yangi mijozni topadi, Telegram — uni doimiy xaridorga aylantiradi. Ikkalasini birga yuritganlar yutadi. Quyida do'konsiz, ijarasiz ishlayotgan yuzlab sotuvchilar amalda qo'llayotgan yondashuv.

## Instagram: ko'rsatish va jalb qilish

Instagramda sotuvni rasm emas, video qiladi. Uchta eng ishlaydigan Reels formati: **kiyib ko'rsatish** — libos harakatda qanday tushishini ko'rsatadi (eng ko'p buyurtma keltiradigan format); **qadoqlash jarayoni** — buyurtmani chiroyli o'rash ishonch uyg'otadi; **yangi kolleksiya ochilishi** — quti ochish, sexdan kadrlar. Har postda: narx ochiq yozilgan bo'lsin (narxni "direktga yozing" deyish — auditoriyaning yarmini yo'qotish), razmerlar, mato, buyurtma yo'li.

## Telegram: sotish va qaytarish

Telegram-kanal — sizning "do'koningiz". Post formati sodda va barqaror bo'lsin: 3–4 ta sifatli rasm + nom + mato + narx + razmerlar + buyurtma havolasi. Qoidalar: kanal tavsifida manzil va telefon aniq tursin; to'lov va yetkazish shartlari alohida qotirilgan (pin) postda; har yangi kolleksiya alohida e'lon bilan. Mijozlar bazasi shu yerda yig'iladi — yangi tovar kelganda birinchi bo'lib kanal ko'radi.

## Haftalik kontent-plan (minimal ishlaydigan)

- Dushanba: yangi kolleksiya anonsi (Reels + kanal posti)
- Chorshanba: bitta modelga chuqur post — mato, o'lchamlar, kiyib ko'rsatish
- Juma: ijtimoiy isbot — mijoz fikri, "sotildi" hisoboti, qayta buyurtmalar
- Yakshanba: yengil kontent — sahna ortidan, savol-javob stories

Kuniga bitta kontent birligi — yetarli. Muntazamlik miqdordan muhim.

## Ishonch signallari — onlayn savdoning valyutasi

Xaridor pulini ko'rmagan odamga yuboradi, shuning uchun ishonch hal qiladi: real video (birovning rasmini olmang), manzil ko'rsatilgani (do'kon/sex bor degani), mijozlar fikrlari skrinshotlari, muntazam faollik (oxirgi post 2 oy oldin bo'lgan kanaldan hech kim olmaydi). Sayt bo'lsa — bu alohida daraja: narxlar, razmerlar, bron — hammasi bir joyda, va bu jiddiy biznes taassurotini beradi.

## Uch keng tarqalgan xato

Birinchisi — narxni yashirish (yuqorida aytdik). Ikkinchisi — faqat sotuv posti: 10 postdan 10 tasi "oling-oling" bo'lsa, auditoriya charchaydi; oraga foydali va jonli kontent qo'shing. Uchinchisi — buyurtma yo'lini murakkablashtirish: mijoz 3 qadamda buyurtma bera olmasa, ketadi.

## Tez-tez so'raladigan savollar

**Reklamaga qancha pul kerak?**
Boshida — nol. Organik Reels + mahalliy guruhlar bilan birinchi sotuvlarga chiqish mumkin. Reklamani nima sotilishini aniq bilganingizdan keyin yoqing.

**Kanalga obunachini qayerdan olaman?**
Instagram profilida kanal havolasi, har buyurtma qadog'ida QR-kod, mijozlarga "yangi kolleksiya birinchi kanalda chiqadi" deyish — uch oddiy va tekin usul.

*Optom hamkorlar uchun tayyor kontent: mahsulot suratlari va tavsiflarini beramiz. [Katalog](/katalog) · [Aloqa](/aloqa).*`,
    contentRu: `Значительная часть торговли одеждой в Узбекистане происходит на двух платформах: Instagram находит нового клиента, Telegram превращает его в постоянного покупателя. Побеждают те, кто ведёт оба направления вместе. Ниже — подход, который на практике применяют сотни продавцов, работающих без магазина и аренды.

## Instagram: показ и вовлечение

В Instagram продаёт не фото, а видео. Три самых работающих формата Reels: **показ на модели** — как платье садится и «играет» в движении (формат, приносящий больше всего заказов); **процесс упаковки** — красивая упаковка заказа вызывает доверие; **открытие новой коллекции** — распаковка коробки, кадры из цеха. В каждом посте: цена указана открыто (просьба «пишите в директ» теряет половину аудитории), размеры, ткань, способ заказа.

## Telegram: продажа и удержание

Telegram-канал — это ваш «магазин». Формат поста должен быть простым и стабильным: 3–4 качественных фото + название + ткань + цена + размеры + ссылка для заказа. Правила: в описании канала точно указаны адрес и телефон; условия оплаты и доставки закреплены отдельным постом; каждая новая коллекция — отдельный анонс. Именно здесь собирается база клиентов — при поступлении нового товара канал видят первыми.

## Недельный контент-план (минимально рабочий)

- Понедельник: анонс новой коллекции (Reels + пост в канале)
- Среда: подробный пост об одной модели — ткань, размеры, показ на модели
- Пятница: социальное доказательство — отзыв клиента, отчёт «продано», повторные заказы
- Воскресенье: лёгкий контент — закулисье, вопросы-ответы в сторис

Одна единица контента в день — достаточно. Регулярность важнее количества.

## Сигналы доверия — валюта онлайн-торговли

Покупатель отправляет деньги человеку, которого не видел, поэтому доверие решает всё: настоящее видео (не берите чужие фото), указанный адрес (значит, есть магазин/цех), скриншоты отзывов клиентов, регулярная активность (канал с последним постом 2 месяца назад никто не купит). Наличие сайта — отдельный уровень: цены, размеры, бронирование — всё в одном месте, и это создаёт впечатление серьёзного бизнеса.

## Три частые ошибки

Первая — скрытие цены (об этом уже сказали). Вторая — только продающие посты: если 10 из 10 постов «покупайте-покупайте», аудитория устаёт; добавляйте полезный и живой контент. Третья — усложнённый путь заказа: если клиент не может оформить заказ за 3 шага, он уходит.

## Часто задаваемые вопросы

**Сколько денег нужно на рекламу?**
Вначале — ноль. Органические Reels и местные группы позволяют выйти на первые продажи. Включайте рекламу, когда точно знаете, что продаётся.

**Откуда взять подписчиков для канала?**
Ссылка на канал в профиле Instagram, QR-код в каждой упаковке заказа, фраза клиентам «новая коллекция выходит первой в канале» — три простых и бесплатных способа.

*Для оптовых партнёров предоставляем готовый контент: фото и описания товаров. [Каталог](/ru/katalog) · [Контакты](/ru/aloqa).*`,
  },
  {
    slug: "2026-kuz-qish-modest-fashion-trendlari",
    titleUz: "2026-yil kuz-qish modest fashion trendlari: O'zbekiston bozori uchun tahlil",
    titleRu: "Тренды модест-моды осень-зима 2026: анализ рынка Узбекистана",
    excerptUz:
      "Jahon modest fashion trendlaridan qaysilari O'zbekistonda ishlaydi: teksturali matolar, keng yeng, layering, chuqur ranglar — zaxira tavsiyalari bilan.",
    excerptRu:
      "Какие мировые тренды модест-моды работают в Узбекистане: текстурные ткани, широкие рукава, лееринг, глубокие цвета — с рекомендациями по запасам.",
    publishedAt: "2026-06-22",
    contentUz: `Modest fashion (yopiq kiyim modasi) jahon miqyosida eng tez o'sayotgan segmentlardan biriga aylandi — yirik brendlar maxsus kolleksiyalar chiqarmoqda, abaya esa bu bozorning eng katta mahsulot toifasi hisoblanadi. Lekin jahon trendining hammasi ham O'zbekistonda ishlamaydi. Quyida 2026 kuz-qish tendensiyalarini mahalliy bozor ko'zi bilan saralab chiqamiz.

## 1. Teksturali matolar: jakkard va relyefli to'qimalar

Jahonda bezak markazdan matoga ko'chdi: naqsh emas, to'qimaning o'zi o'ynaydi — jakkard, relyefli chiziqlar, mat-yaltiroq kombinatsiyalar. O'zbekistonda bu trend "bayramona, lekin bosiq" liboslar segmentida yaxshi ishlaydi: to'y-marosim auditoriyasi teksturani qadrlaydi. Zaxirada bashang qismning bir bo'lagi sifatida saqlang.

## 2. Keng, arxitektura yenglar davom etadi

Keng yeng trendi kuchayib davom etmoqda va bu bizning bozorga to'liq mos: keng yeng yopiqlik talabiga zid emas, aksincha uni chiroyli hal qiladi. Bir rangli qishki abayalarda keng yeng — modelning asosiy "sotuvchi" detali bo'la oladi.

## 3. Layering: ochiq abaya va ustki qatlamlar

Kardigan uslubidagi ochiq abayalar — ichki ko'ylak ustidan kiyiladigan ustki qatlam — jahonda garderobning doimiy qismiga aylandi. Bizda bu format o'sish bosqichida: ayniqsa demi-sezon uchun qulay, chunki bitta ochiq abaya bir necha ichki libos bilan yangi obraz beradi. Assortimentga kiritishga arziydigan yo'nalish.

## 4. Rang palitrasi: chuqur va issiq tonlar

Kuz-qishning ishlaydigan ranglari: shokolad va tut jigarrangi, zumrad, chuqur vino (bordo), tungi ko'k, hamda baza sifatida krem va qora. Muhim mahalliy nuance: bizning xaridor juda yorqin "toza" ranglardan ko'ra bosiq, chuqur tonlarni afzal ko'radi — aynan shu palitrada adashmaysiz.

## 5. Minimalizm + bitta aksent

Ortiqcha bezakdan tozalangan siluetlar, sifatli mato va bitta aniq aksent (belbog', yeng, tugma qatori) — jahon trendining o'zagi shu. Bu bizga ham mos, bitta shart bilan: to'liq "yalang'och" minimalizm bizda sekinroq sotiladi, kichik bir detal (nafis gul, kant, bog'ich) bo'lgani ma'qul.

## Optomchiga zaxira tavsiyasi (kuz-qish)

Ishlaydigan taqsimot: 40% bazaviy bir ranglilar (qora, shokolad, krem) — bular baribir sotiladi; 25% keng yengli va belbog'li modellar — mavsum yetakchilari; 15% teksturali bashang qism; 10% ochiq abaya/layering; 10% sinov uchun trend-yangiliklar. Va klassik eslatma: kuzgi zaxira avgust–sentabrda yig'iladi, oktabrda kech bo'ladi.

## Tez-tez so'raladigan savollar

**Trendga ergashish shartmi? Eski modellar ham sotilyapti-ku.**
Baza hech qayoqqa ketmaydi — asosiy pul o'sha yerda. Trend esa vitringizni yangi ushlab turadi va kontent beradi: trend modeli e'tibor tortadi, baza esa sotiladi.

**Qishga shifon olish xatomi?**
Yo'q, lekin ulushini kamaytiring: qishda zichroq matolar (PRADO tipidagi) va astarli modellar yetakchi bo'ladi, shifon bahorga qaytadi.

*Kuz-qish kolleksiyamiz har hafta yangilanadi — yangi modellarni birinchi ko'rish va bron qilish uchun: [katalog](/katalog). Savollar uchun: [aloqa](/aloqa).*`,
    contentRu: `Модест-мода (мода на закрытую одежду) стала одним из самых быстрорастущих сегментов в мире — крупные бренды выпускают специальные коллекции, а абайя считается крупнейшей товарной категорией этого рынка. Но не все мировые тренды работают в Узбекистане. Ниже — отбор тенденций осень-зима 2026 года глазами местного рынка.

## 1. Текстурные ткани: жаккард и рельефные плетения

В мире акцент декора сместился с принта на саму ткань — жаккард, рельефные полосы, комбинации матового и блестящего. В Узбекистане этот тренд хорошо работает в сегменте «праздничной, но сдержанной» одежды: свадебно-торжественная аудитория ценит текстуру. Держите в запасе как часть нарядного ассортимента.

## 2. Широкие, архитектурные рукава продолжают тренд

Тренд на широкий рукав усиливается и полностью соответствует нашему рынку: широкий рукав не противоречит требованию закрытости, а наоборот, красиво его решает. В однотонных зимних абайях широкий рукав может стать главной «продающей» деталью модели.

## 3. Лееринг: открытые абайи и верхние слои

Открытые абайи в стиле кардигана — верхний слой, надеваемый поверх внутреннего платья — стали постоянной частью гардероба в мире. У нас этот формат на стадии роста: особенно удобен для межсезонья, ведь одна открытая абайя с разными внутренними платьями даёт новый образ. Направление, которое стоит включить в ассортимент.

## 4. Цветовая палитра: глубокие и тёплые тона

Рабочие цвета осени-зимы: шоколадный и тутовый коричневый, изумрудный, глубокий бордовый, ночной синий, а также кремовый и чёрный как база. Важный локальный нюанс: наш покупатель предпочитает сдержанные, глубокие тона ярким «чистым» цветам — с этой палитрой вы не ошибётесь.

## 5. Минимализм + один акцент

Силуэты, очищенные от лишнего декора, качественная ткань и один чёткий акцент (пояс, рукав, ряд пуговиц) — суть мирового тренда. Это подходит и нам, с одним условием: полностью «голый» минимализм у нас продаётся медленнее, лучше, когда есть одна небольшая деталь (изящный цветок, кант, завязка).

## Рекомендация по запасам для оптовика (осень-зима)

Рабочее распределение: 40% базовых однотонных (чёрный, шоколадный, кремовый) — они продаются всегда; 25% моделей с широким рукавом и поясом — лидеры сезона; 15% текстурной нарядной части; 10% открытых абай/лееринга; 10% на пробу трендовых новинок. И классическое напоминание: осенний запас формируется в августе-сентябре, в октябре уже поздно.

## Часто задаваемые вопросы

**Обязательно ли следовать тренду? Старые модели тоже продаются.**
База никуда не денется — основная прибыль именно там. Тренд же держит вашу витрину свежей и даёт контент: трендовая модель привлекает внимание, база — продаёт.

**Ошибка ли брать шифон на зиму?**
Нет, но уменьшите его долю: зимой лидируют более плотные ткани (типа PRADO) и модели с подкладкой, шифон возвращается весной.

*Наша осенне-зимняя коллекция обновляется каждую неделю — чтобы первыми увидеть и забронировать новые модели: [каталог](/ru/katalog). Вопросы: [контакты](/ru/aloqa).*`,
  },
];

async function main() {
  console.log("[seed] categories…");
  const categoryBySlug = new Map<string, number>();
  for (const c of CATEGORIES) {
    const row = await db.category.upsert({
      where: { slug: c.slug },
      create: c,
      update: { nameUz: c.nameUz, nameRu: c.nameRu, sortOrder: c.sortOrder },
    });
    categoryBySlug.set(c.slug, row.id);
  }

  console.log("[seed] settings…");
  for (const [key, value] of Object.entries(SETTINGS)) {
    await db.setting.upsert({ where: { key }, create: { key, value }, update: { value } });
  }

  console.log("[seed] products…");
  for (const p of PRODUCTS) {
    const categoryId = categoryBySlug.get(p.category);
    if (!categoryId) continue;
    const slug = slugify(p.nameUz);
    await db.product.upsert({
      where: { slug },
      create: {
        slug,
        nameUz: p.nameUz,
        nameRu: p.nameRu,
        materialUz: p.materialUz,
        materialRu: p.materialRu,
        price: p.price,
        oldPrice: p.oldPrice ?? null,
        sizes: p.sizes,
        minOrderQty: p.minOrderQty,
        isNew: p.isNew,
        categoryId,
      },
      update: {},
    });
  }

  console.log("[seed] admin user…");
  const adminUsername = process.env.ADMIN_USERNAME ?? "admin";
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD ?? "admin12345";
  const passwordHash = await bcrypt.hash(adminPassword, 12);
  await db.adminUser.upsert({
    where: { username: adminUsername },
    create: { username: adminUsername, passwordHash },
    update: {},
  });

  console.log("[seed] blog posts…");
  // Drop stale demo posts so re-seeding stays idempotent as the content plan evolves.
  await db.post.deleteMany({ where: { slug: { notIn: POSTS.map((p) => p.slug) } } });
  for (const post of POSTS) {
    const publishedAt = new Date(post.publishedAt);
    await db.post.upsert({
      where: { slug: post.slug },
      create: {
        slug: post.slug,
        titleUz: post.titleUz,
        titleRu: post.titleRu,
        excerptUz: post.excerptUz,
        excerptRu: post.excerptRu,
        contentUz: post.contentUz,
        contentRu: post.contentRu,
        isPublished: true,
        publishedAt,
      },
      update: {
        titleUz: post.titleUz,
        titleRu: post.titleRu,
        excerptUz: post.excerptUz,
        excerptRu: post.excerptRu,
        contentUz: post.contentUz,
        contentRu: post.contentRu,
        isPublished: true,
        publishedAt,
      },
    });
  }

  console.log("[seed] done ✅");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
