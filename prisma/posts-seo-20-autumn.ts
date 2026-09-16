import type { SeedPost } from "./posts-seo-20";

/**
 * Ikkinchi partiya: 20 ta SEO maqola (2026 kuz-qish).
 *
 * Birinchi 30 ta maqola kontent-rejaning model, mato va "nima tanlash" qismini
 * qopladi. Bu partiya ataylab boshqa tomonga qaraydi: optomchining pul, sifat,
 * yetkazib berish va hisob-kitob savollari — ya'ni kontent-rejadagi hali
 * yozilmagan bandlar va seo-keywordlar-50.md dagi maqolasi yo'q so'rovlar
 * ("rumol o'rash usullari", "namazbop ko'ylak", "abaya va jilbab farqi",
 * "Bek Baraka bozori", "kiyimga narx qo'yish", "YaTT").
 *
 * Sanalar haftasiga 2–3 tadan qilib taqsimlangan: seo-keywordlar-50.md da
 * aytilganidek, 20 ta maqolani bir kunda chiqarish "scaled content abuse"
 * signalini beradi.
 */
export const POSTS_SEO_20_AUTUMN: SeedPost[] = [
  {
    slug: "optom-kiyim-tanlashda-10-ta-xatolik",
    titleUz: "Optom kiyim olishda 10 ta keng tarqalgan xatolik va ularni qanday oldini olish",
    titleRu: "10 частых ошибок при оптовой закупке одежды и как их избежать",
    excerptUz:
      "Optom kiyim olishda yangi boshlovchilar takrorlaydigan 10 ta xatolik: razmer, rang, mato, partiya hajmi va kelishuv shartlari bo'yicha amaliy tahlil.",
    excerptRu:
      "10 ошибок, которые повторяют начинающие оптовики: размеры, цвета, ткань, объём партии и условия сделки — с практическим разбором.",
    publishedAt: "2026-09-18",
    contentUz: `Optom kiyim olish — savdoning eng arzon qismi emas, eng qimmat xatolar aynan shu yerda qilinadi. Bir marta noto'g'ri partiya olsangiz, puling omborda yotadi va mavsum o'tib ketadi. Quyida tikuv sexi sifatida yillar davomida ko'rgan eng keng tarqalgan 10 ta xatolik.

## 1. Faqat o'z didiga qarab olish

Eng ko'p uchraydigan xato. Sizga yoqqan rang mijozingizga yoqmasligi mumkin. Optomchi o'z didini emas, o'z mijozining didini olishi kerak. Yechim: oxirgi 3 oyda nima sotilganini yozib boring va shu ro'yxat bilan xaridga boring.

## 2. Razmerni teng taqsimlash

10 ta ko'ylakni 46, 48, 50, 52, 54 razmerdan 2 tadan olish — mantiqli tuyuladi, lekin xato. O'zbekistonda eng ko'p so'raladigan razmerlar 50, 52 va 54. Odatiy taqsimot: 50–54 ga partiyaning yarmidan ko'pi, 46–48 va 56 ga qolgani.

## 3. Bitta modeldan juda ko'p olish

"Bu model albatta ketadi" degan ishonch bilan 30 dona olish — kapitalni bitta joyga qamash. Yangi modeldan avval kichik partiya oling, sotilishini ko'ring, keyin qaytadan buyurtma bering. Yaxshi yetkazib beruvchi qayta buyurtmani tez bajaradi.

## 4. Matoni qo'l bilan tekshirmaslik

Rasm mato haqida deyarli hech narsa aytmaydi. Imkon bo'lsa namuna so'rang: yorug'likka tuting, g'ijimlab qo'ying, chok ichini ko'ring. Masofadan olayotgan bo'lsangiz — mato nomini aniq so'rang va bitta namunaviy dona buyurtma qiling.

## 5. Mavsumni kech boshlash

Kuzgi tovarni oktyabrda olish — kech. Optomchining kalendari mijozinikidan bir oy oldinda yuradi: kuzgi partiya avgust oxirida, qishki oktyabrda, hayit tovari bayramdan 6–8 hafta oldin olinadi.

## 6. Narxni yagona mezon qilish

Eng arzon partiya ko'pincha eng qimmatga tushadi: chok so'kiladi, rang ketadi, qaytarish ko'payadi. Narxni sifat, qayta buyurtma imkoniyati va brak shartlari bilan birga hisoblang.

## 7. Kelishuv shartlarini og'zaki qoldirish

Brak chiqsa nima bo'ladi? Almashtiriladimi? Qancha muddat ichida? Bularni xarid oldidan yozma (hech bo'lmasa Telegramda yozishma) qilib qo'ying. Og'zaki kelishuv muammo chiqqanda ishlamaydi.

## 8. Partiyani sanab olmaslik

Dona soni, razmerlar va ranglar qadoqni ochgan zahoti sanaladi va suratga olinadi. Bir hafta o'tib "ikkita kam chiqdi" deyish — hech kimga isbot emas.

## 9. Bitta yetkazib beruvchiga bog'lanib qolish

Yagona manba — yagona xavf. Kamida ikkita ishonchli manba bo'lsin, biri asosiy, biri zaxira. Shu bilan birga har oy yangi manba qidirib vaqt yo'qotish ham shart emas.

## 10. Hisobni yuritmaslik

Qancha olindi, qancha sotildi, qanchasi omborda qoldi — bu uchta raqamni bilmasangiz, foyda hisoblanmaydi. Oddiy daftar yoki Google Sheets yetarli.

## Tez-tez so'raladigan savollar

**Birinchi optom xaridni qaysi modeldan boshlagan ma'qul?**
Neytral rangdagi, 50–54 razmerli, o'rta narxdagi asosiy model — eng kam xavfli boshlanish.

**Namuna uchun bitta dona olish mumkinmi?**
Ko'p tikuv sexlari namunaviy donani beradi. Oltinoy Collectionda ham yangi model bo'yicha avval bitta olib ko'rish mumkin.

**Brak chiqsa nima qilish kerak?**
Darhol suratga oling va yetkazib beruvchiga yozing. Kechiktirilgan da'vo qabul qilinmasligi mumkin.

*Oltinoy Collection — o'z tikuv seximizdan optom ayollar kiyimi. Katalog: [to'plamlar](/katalog/toplam) · [abayalar](/katalog/abaya). Savollar: [aloqa](/aloqa).*`,
    contentRu: `Оптовая закупка — не самая дешёвая часть торговли, и самые дорогие ошибки допускаются именно здесь. Одна неудачная партия — и деньги лежат на складе, а сезон уходит. Ниже 10 самых частых ошибок, которые мы видим как швейный цех.

## 1. Закупать по своему вкусу

Самая частая ошибка. То, что нравится вам, не обязательно нравится вашему покупателю. Оптовик закупает вкус своего клиента, а не свой. Решение: записывайте, что продавалось последние 3 месяца, и идите на закупку с этим списком.

## 2. Равномерно распределять размеры

Взять по 2 штуки на 46, 48, 50, 52, 54 кажется логичным, но это ошибка. В Узбекистане больше всего спрашивают 50, 52 и 54. Обычное распределение: больше половины партии на 50–54, остальное — на 46–48 и 56.

## 3. Брать слишком много одной модели

Уверенность «эта модель точно уйдёт» и 30 штук — это заморозка капитала в одной точке. Берите новую модель небольшой партией, посмотрите продажи, затем заказывайте повторно.

## 4. Не щупать ткань

Фото почти ничего не говорит о ткани. Просите образец: на просвет, смять в руке, посмотреть шов изнутри. При удалённой закупке — уточните название ткани и закажите один пробный экземпляр.

## 5. Поздно начинать сезон

Осенний товар в октябре — уже поздно. Календарь оптовика идёт на месяц впереди покупателя: осенняя партия в конце августа, зимняя в октябре, праздничная за 6–8 недель.

## 6. Делать цену единственным критерием

Самая дешёвая партия часто выходит дороже всего: расходятся швы, линяет цвет, растут возвраты. Считайте цену вместе с качеством, возможностью повторного заказа и условиями по браку.

## 7. Оставлять условия устными

Что будет при браке? Меняют ли? В какой срок? Зафиксируйте это до закупки хотя бы перепиской в Telegram. Устная договорённость не работает, когда возникает проблема.

## 8. Не пересчитывать партию

Количество, размеры и цвета считаются и фотографируются сразу при вскрытии. Заявление через неделю «не хватило двух» ничего не доказывает.

## 9. Зависеть от одного поставщика

Один источник — один риск. Пусть будет минимум два надёжных: основной и запасной.

## 10. Не вести учёт

Сколько взято, сколько продано, сколько осталось — без этих трёх цифр прибыль не считается. Достаточно тетради или Google Sheets.

## Частые вопросы

**С какой модели начать первую закупку?**
Базовая модель нейтрального цвета, размеры 50–54, средняя цена — наименее рискованный старт.

**Можно ли взять один образец?**
Многие цеха дают образец. В Oltinoy Collection по новой модели тоже можно сначала взять одну.

**Что делать при браке?**
Сразу сфотографировать и написать поставщику. Отложенная претензия может быть не принята.

*Oltinoy Collection — оптовая женская одежда из собственного цеха. Каталог: [комплекты](/ru/katalog/toplam) · [абайи](/ru/katalog/abaya). Вопросы: [контакты](/ru/aloqa).*`,
  },
  {
    slug: "birinchi-optom-xarid-qancha-pul-kerak",
    titleUz: "Birinchi optom xarid: qancha pul kerak va nimadan boshlanadi",
    titleRu: "Первая оптовая закупка: сколько нужно денег и с чего начать",
    excerptUz:
      "Kiyim savdosini boshlash uchun qancha kapital kerak, birinchi partiyada nechta model olinadi va pul qayerlarga ketadi — raqamlar bilan tushuntirish.",
    excerptRu:
      "Сколько капитала нужно для старта в торговле одеждой, сколько моделей брать в первой партии и куда уходят деньги — объяснение с цифрами.",
    publishedAt: "2026-09-21",
    contentUz: `"Kiyim sotishni boshlamoqchiman, qancha pul kerak?" — bizga eng ko'p beriladigan savol. Aniq bitta raqam yo'q, lekin hisob-kitob mantig'i bor. Quyida birinchi partiyani qanday hisoblash kerakligi.

## Pul faqat tovarga ketmaydi

Yangi boshlovchilarning asosiy xatosi — butun kapitalni tovarga sarflash. Amalda byudjet kamida uch qismga bo'linadi:

- **Tovar** — byudjetning ~70%
- **Yetkazib berish va qadoqlash** — ~10%
- **Zaxira** (qayta buyurtma, kutilmagan xarajat) — ~20%

Zaxirasiz boshlasangiz, birinchi model yaxshi ketganda uni qayta olishga puling qolmaydi — bu esa eng achinarli yo'qotish.

## Birinchi partiyaning mantiqiy hajmi

Kichik boshlash — ayb emas, aqlli qadam. Ishlaydigan minimal tuzilma:

- **3–4 ta model**, har biridan 5–8 dona
- Har modelda **2–3 ta rang**, ko'pi neytral
- Razmerlar: **50, 52, 54** asosiy, 46–48 va 56 dan bittadan

Bu taxminan 20–30 dona bo'ladi. Shuncha tovar bilan siz bozorni sinab ko'rasiz va qaysi model ishlashini bilib olasiz.

## Nima sotilishini qanday bilasiz?

Birinchi partiyada bilmaysiz — va bu normal. Shuning uchun partiya kichik bo'ladi. Ikkinchi xaridda esa sizda allaqachon ma'lumot bo'ladi: qaysi rang tez ketdi, qaysi razmer qolib ketdi, mijoz nima so'radi. Shu ma'lumot pulingizdan ham qimmat.

## Ustama va qaytim

Kiyim savdosida ustama odatda 30–60% oralig'ida bo'ladi — bozorga, shaharga va xizmat darajasiga qarab. Ustamani hisoblashda faqat tovar narxini emas, yetkazib berish, qadoq, yo'l va qaytarilgan tovarni ham qo'shing. Aks holda "foyda bordek, pul yo'q" holati chiqadi.

## Birinchi 3 oy nimaga ketadi

Realistik kutish: birinchi oy — tanishuv va sinov, ikkinchi oy — birinchi qaytim, uchinchi oy — assortimentni tuzatish. Bu davrda daromad chiqmasligi mumkin va bu muvaffaqiyatsizlik emas.

## Qayerdan olish

Bozordan olish tez, lekin vositachi ustamasi bor. Tikuv sexidan to'g'ridan-to'g'ri olish arzonroq va qayta buyurtma oson, lekin minimal partiya talab qilinishi mumkin. Oltinoy Collection o'z sexida tikadi — shuning uchun qayta buyurtma bir necha kun ichida bajariladi.

## Tez-tez so'raladigan savollar

**Eng kam qancha pul bilan boshlash mumkin?**
Aniq raqam bozor va modelga bog'liq. Mantiq shunday: 20–30 donalik partiya + 20% zaxira.

**Qarzga tovar olish mumkinmi?**
Yangi mijozga odatda yo'q. Bir necha marta to'lov tarixi bo'lgandan keyin shartlar yumshashi mumkin.

**Do'kon ochish shartmi?**
Yo'q. Ko'p optomchilar Telegram va Instagram orqali, ombor-xonadan sotib boshlaydi.

*Oltinoy Collection — tikuv seximizdan optom ayollar kiyimi. Katalog: [ko'ylaklar](/katalog/koylak) · [to'plamlar](/katalog/toplam). Savollar: [aloqa](/aloqa).*`,
    contentRu: `«Хочу начать продавать одежду, сколько нужно денег?» — самый частый вопрос. Одной цифры нет, но есть логика расчёта. Ниже — как посчитать первую партию.

## Деньги уходят не только на товар

Главная ошибка новичка — потратить весь капитал на товар. На практике бюджет делится минимум на три части:

- **Товар** — около 70%
- **Доставка и упаковка** — около 10%
- **Резерв** (повторный заказ, непредвиденное) — около 20%

Без резерва, когда первая модель хорошо пошла, денег на её повторную закупку не останется — это самая обидная потеря.

## Разумный объём первой партии

Начать с малого — не слабость, а расчёт. Рабочий минимум:

- **3–4 модели**, по 5–8 штук каждой
- **2–3 цвета** на модель, большинство нейтральные
- Размеры: основные **50, 52, 54**, по одной на 46–48 и 56

Получается примерно 20–30 единиц. Этого достаточно, чтобы проверить рынок.

## Как понять, что будет продаваться

В первой партии — никак, и это нормально. Поэтому она маленькая. Ко второй закупке у вас уже будут данные: какой цвет ушёл быстро, какой размер завис, что спрашивал клиент. Эти данные дороже денег.

## Наценка и оборот

В одежде наценка обычно 30–60% — зависит от рынка, города и уровня сервиса. Считайте не только цену товара, но и доставку, упаковку, дорогу и возвраты. Иначе получается «прибыль есть, а денег нет».

## На что уходят первые 3 месяца

Реалистично: первый месяц — знакомство и проверка, второй — первый оборот, третий — корректировка ассортимента. Отсутствие дохода в этот период — не провал.

## Где закупать

На рынке быстро, но есть наценка посредника. Напрямую из цеха дешевле и повторный заказ проще, но может быть минимальная партия. Oltinoy Collection шьёт в своём цехе — повторный заказ выполняется за несколько дней.

## Частые вопросы

**С какой минимальной суммы можно начать?**
Точная цифра зависит от рынка и модели. Логика: партия 20–30 единиц плюс 20% резерв.

**Можно ли взять товар в долг?**
Новому клиенту обычно нет. После нескольких оплат условия могут смягчиться.

**Обязательно ли открывать магазин?**
Нет. Многие начинают через Telegram и Instagram со склада-комнаты.

*Oltinoy Collection — оптовая женская одежда из нашего цеха. Каталог: [платья](/ru/katalog/koylak) · [комплекты](/ru/katalog/toplam). Вопросы: [контакты](/ru/aloqa).*`,
  },
  {
    slug: "optom-partiyani-qabul-qilish-sifat-nazorati",
    titleUz: "Optom partiyani qabul qilishda sifat nazorati: 12 banddan iborat cheklist",
    titleRu: "Приёмка оптовой партии: чек-лист контроля качества из 12 пунктов",
    excerptUz:
      "Qadoq ochilgan zahoti nimani tekshirish kerak: chok, mato, rang, razmer, furnitura va hujjat. Optomchi uchun amaliy qabul qilish cheklisti.",
    excerptRu:
      "Что проверять сразу после вскрытия упаковки: швы, ткань, цвет, размеры, фурнитуру и документы. Практический чек-лист приёмки для оптовика.",
    publishedAt: "2026-09-24",
    contentUz: `Brak haqidagi da'vo qadoq ochilgan kunidan keyin kuchini yo'qotadi. Shuning uchun partiyani qabul qilish — alohida ish jarayoni, "keyin ko'raman" emas. Quyidagi cheklist 20 daqiqada bajariladi va oylik zararni saqlab qoladi.

## Qadoqni ochishdan oldin

**1.** Qadoq butunligini tekshiring va suratga oling — ayniqsa yo'lda kelgan bo'lsa.
**2.** Yetkazib beruvchi yuborgan ro'yxatni (dona, razmer, rang) qo'lingizda tayyor tuting.

## Dona va taqsimot

**3.** Umumiy sonni sanang.
**4.** Razmerlar bo'yicha sanang — eng ko'p xato shu yerda chiqadi.
**5.** Ranglar bo'yicha sanang. Rasmda bir xil ko'ringan ikki rang amalda farq qilishi mumkin.

## Mato va rang

**6.** Bitta donani yorug'likka tuting: siyrak joy, teshik, dog' bormi.
**7.** Matoni kafting orasida g'ijimlab qo'yib yuboring — tez tiklanishi kerak.
**8.** Bir partiyadagi bir rangli donalarni yonma-yon qo'ying. Rang tovlanishi (partiyalar farqi) shu yerda ko'rinadi va keyin mijoz shikoyat qiladi.

## Tikuv

**9.** Yon chok va yeng osti chokini ichkaridan cho'zib ko'ring — ip chiqib qolmasin.
**10.** Etak va yeng uchini tekshiring: overlok tekismi, ip uchlari kesilganmi.
**11.** Furnitura: tugma, zamok, belbog' halqasi — hammasi joyidami va mahkammi.

## Hujjat va yozishma

**12.** Qabul qilingan dona sonini va aniqlangan kamchiliklarni o'sha kuni yetkazib beruvchiga yozma yuboring, suratlar bilan. Telegramdagi xabar ham hujjat.

## Brak chiqsa

Braklangan donani sotmang va o'zgartirmang — qaytarish shartlari buziladi. Uni alohida qo'ying, suratga oling va kelishuvga muvofiq almashtirishni so'rang. Yaxshi yetkazib beruvchi uchun brakni almashtirish — odatiy ish, janjal emas.

## Tez-tez so'raladigan savollar

**Necha foiz brak normal hisoblanadi?**
Ommaviy tikuvda kichik foiz bo'lishi mumkin. Muhimi — yetkazib beruvchi uni almashtirishga tayyormi yoki yo'q.

**Qabulni necha kun ichida qilish kerak?**
Iloji boricha o'sha kuni. Kechikkan da'vo deyarli hech qachon qabul qilinmaydi.

**Rang tovlanishi brakmi?**
Agar bitta partiya ichida bo'lsa — ha, bu kamchilik. Turli partiyalar orasidagi kichik farq esa matoning tabiiy xususiyati.

*Oltinoy Collection — o'z sexida tikadi, shuning uchun brak bo'yicha savol to'g'ridan-to'g'ri hal qilinadi. [Katalog](/katalog) · [aloqa](/aloqa).*`,
    contentRu: `Претензия по браку теряет силу на следующий день после вскрытия упаковки. Поэтому приёмка партии — отдельный рабочий процесс, а не «посмотрю потом». Чек-лист ниже выполняется за 20 минут и спасает месячный убыток.

## До вскрытия

**1.** Проверьте целостность упаковки и сфотографируйте — особенно если товар ехал.
**2.** Держите под рукой список от поставщика (количество, размеры, цвета).

## Количество и раскладка

**3.** Пересчитайте общее количество.
**4.** Пересчитайте по размерам — здесь больше всего расхождений.
**5.** Пересчитайте по цветам. Два цвета, одинаковых на фото, вживую могут отличаться.

## Ткань и цвет

**6.** Посмотрите одну единицу на просвет: разрежённые места, дырки, пятна.
**7.** Сомните ткань в ладони и отпустите — должна быстро расправляться.
**8.** Положите рядом изделия одного цвета из партии. Разнотон виден именно так, а потом на него жалуется покупатель.

## Пошив

**9.** Потяните боковой шов и шов подмышкой изнутри — нитка не должна выходить.
**10.** Проверьте низ и края рукавов: ровный ли оверлок, обрезаны ли концы ниток.
**11.** Фурнитура: пуговицы, молнии, шлёвки пояса — всё на месте и держится.

## Документы и переписка

**12.** В тот же день письменно отправьте поставщику принятое количество и найденные недостатки с фото. Сообщение в Telegram — тоже документ.

## Если есть брак

Бракованную вещь не продавайте и не переделывайте — это нарушает условия возврата. Отложите отдельно, сфотографируйте и запросите замену по договорённости. Для нормального поставщика замена брака — рабочий момент, а не конфликт.

## Частые вопросы

**Какой процент брака считается нормой?**
В массовом пошиве небольшой процент возможен. Важно другое — готов ли поставщик его заменить.

**За сколько дней нужно принять партию?**
По возможности в тот же день. Отложенная претензия почти никогда не принимается.

**Разнотон — это брак?**
Внутри одной партии — да, это недостаток. Небольшая разница между разными партиями — естественное свойство ткани.

*Oltinoy Collection шьёт в собственном цехе, поэтому вопрос по браку решается напрямую. [Каталог](/ru/katalog) · [контакты](/ru/aloqa).*`,
  },
  {
    slug: "dokon-uchun-assortiment-70-20-10",
    titleUz: "Kichik do'kon uchun assortiment qanday tuziladi: 70/20/10 qoidasi",
    titleRu: "Как собрать ассортимент для небольшого магазина: правило 70/20/10",
    excerptUz:
      "Assortimentni uchga bo'lish: ishonchli asosiy modellar, mavsumiy yangiliklar va tajriba. Kichik do'kon va onlayn savdo uchun amaliy tuzilma.",
    excerptRu:
      "Разделение ассортимента на три части: проверенная база, сезонные новинки и эксперимент. Практическая схема для небольшого магазина.",
    publishedAt: "2026-09-27",
    contentUz: `Assortimentni "nima yoqsa shuni olish" tarzida tuzish — omborni sotilmaydigan tovarga to'ldirishning eng qisqa yo'li. Savdoda ko'p ishlatiladigan sodda tuzilma bor: 70/20/10.

## 70% — ishonchli asos

Bu sizda doim sotiladigan modellar: neytral rangdagi asosiy ko'ylaklar, qora abaya, oddiy to'plamlar. Ular hayajonli emas, lekin ular pul keltiradi va aylanmani ushlab turadi. Bu qismda tajriba qilmang.

## 20% — mavsumiy va trend

Kuzgi ranglar, qishki zichroq matolar, bayram oldidan bezakli modellar. Bu qism mavsum bilan almashadi va do'koningizni "yangi" qilib ko'rsatadi. Muhim: mavsum tugashidan oldin sotib bo'lish kerak, shuning uchun hajmi cheklangan.

## 10% — tajriba

Yangi fason, kutilmagan rang, sinab ko'rilmagan mato. Bu qismning bir qismi sotilmasligi normal — siz aynan shuning uchun uni 10% qilib olyapsiz. Aynan shu 10% dan keyingi mavsumning "70%" i tug'iladi.

## Nega aynan shunday

Agar hammasi asosiy model bo'lsa, do'kon zerikarli bo'ladi va mijoz yangilik uchun boshqa joyga boradi. Agar hammasi trend bo'lsa, mavsum o'tishi bilan omboringiz qoladi. 70/20/10 shu ikki xavfni balanslaydi.

## Amalda qanday qo'llash

30 donalik partiya uchun: 21 dona asosiy, 6 dona mavsumiy, 3 dona tajriba. Har oy sotuvni ko'rib chiqing — tajriba qismidan yaxshi ketgani keyingi xaridda mavsumiy qismga, undan keyin esa asosiy qismga ko'chadi.

## Razmer va rang taqsimoti

Asosiy qismda razmerlar to'liq (50–54 ko'proq), ranglar neytral. Tajriba qismida razmerni torroq oling — 50 va 52 bilan sinab ko'rish yetarli.

## Tez-tez so'raladigan savollar

**Yangi do'kon uchun ham shu nisbat to'g'ri keladimi?**
Boshida asosiy qismni yanada kattaroq (80% gacha) qilish mumkin — tajriba uchun ma'lumot hali yo'q.

**Qaysi modellar "asosiy" hisoblanadi?**
Oxirgi 3 oyda eng ko'p qaytarilgan buyurtmalar. Bu ro'yxat sizda bo'lishi shart.

**Tajriba qismi sotilmasa nima qilaman?**
Mavsum oxirida chegirma bilan chiqaring. U yerdagi asosiy foyda — pul emas, ma'lumot.

*Oltinoy Collection — asosiy modellar ham, mavsumiy yangiliklar ham bitta sexdan. [To'plamlar](/katalog/toplam) · [ko'ylaklar](/katalog/koylak) · [aloqa](/aloqa).*`,
    contentRu: `Собирать ассортимент по принципу «беру то, что нравится» — кратчайший путь забить склад неликвидом. В торговле есть простая схема: 70/20/10.

## 70% — надёжная база

Это модели, которые продаются всегда: базовые платья нейтральных цветов, чёрная абайя, простые комплекты. Они не вызывают восторга, но приносят деньги и держат оборот. В этой части не экспериментируйте.

## 20% — сезон и тренд

Осенние цвета, более плотные зимние ткани, нарядные модели перед праздником. Эта часть меняется вместе с сезоном и делает магазин «свежим». Важно: её нужно распродать до конца сезона, поэтому объём ограничен.

## 10% — эксперимент

Новый фасон, неожиданный цвет, непроверенная ткань. То, что часть этого не продастся, — нормально: именно поэтому доля 10%. И именно из этих 10% рождается «база» следующего сезона.

## Почему именно так

Если всё — база, магазин скучный, и за новинкой клиент уходит в другое место. Если всё — тренд, после сезона склад остаётся забитым. 70/20/10 балансирует оба риска.

## Как применять на практике

Для партии в 30 единиц: 21 базовых, 6 сезонных, 3 экспериментальных. Раз в месяц пересматривайте продажи — то, что хорошо пошло из эксперимента, в следующей закупке переходит в сезонную часть, затем в базу.

## Размеры и цвета

В базовой части размерный ряд полный (больше 50–54), цвета нейтральные. В экспериментальной части ряд можно сузить — достаточно 50 и 52.

## Частые вопросы

**Подходит ли схема новому магазину?**
В начале базовую часть можно увеличить до 80% — данных для эксперимента ещё нет.

**Какие модели считать базовыми?**
Те, что чаще всего перезаказывали за последние 3 месяца. Этот список у вас должен быть.

**Что делать, если эксперимент не продался?**
Вывести со скидкой в конце сезона. Главная прибыль оттуда — не деньги, а данные.

*Oltinoy Collection — и база, и сезонные новинки из одного цеха. [Комплекты](/ru/katalog/toplam) · [платья](/ru/katalog/koylak) · [контакты](/ru/aloqa).*`,
  },
  {
    slug: "viloyatlarga-kiyim-yetkazib-berish",
    titleUz: "Toshkentdan viloyatlarga kiyim yetkazib berish: optomchi uchun qo'llanma",
    titleRu: "Доставка одежды из Ташкента в регионы: руководство для оптовика",
    excerptUz:
      "Viloyatga optom partiyani qanday yuborish kerak: qadoqlash, to'lov, javobgarlik va yo'qotishlarni kamaytirish bo'yicha amaliy maslahatlar.",
    excerptRu:
      "Как отправить оптовую партию в регион: упаковка, оплата, ответственность и как уменьшить потери. Практические советы.",
    publishedAt: "2026-09-30",
    contentUz: `Optomchilarning katta qismi Toshkentdan tashqarida ishlaydi. Tovar bir necha yuz kilometr yo'l yuradi va shu yo'lda eng ko'p janjal chiqadi. Quyida yo'qotishni kamaytiradigan amaliy tartib.

## To'lov shartini oldindan aniqlang

Eng ko'p tushunmovchilik shu yerda. Uch xil variant bor va har birining xavfi boshqacha:

- **Oldindan to'lov** — sotuvchi uchun xavfsiz, xaridor uchun ishonch talab qiladi.
- **Yetkazilgach to'lash** — xaridor uchun qulay, sotuvchi uchun xavfli.
- **Qisman oldindan** — amalda eng ko'p ishlatiladigan o'rta yo'l.

Qaysi variant bo'lsa ham, uni yozma qayd eting.

## Qadoqlash — arzon, lekin hal qiluvchi

Kiyim yo'lda ifloslanadi va namlanadi. Ishlaydigan tartib: har bir dona alohida selofan paketda, ustidan umumiy qora qop yoki quti, burchaklar skotch bilan mustahkamlanadi. Ichiga dona soni va razmerlar yozilgan qog'oz qo'ying — qabul qiluvchi shu bilan sanaydi.

## Yo'l hujjati va surat

Yuborishdan oldin qadoqni suratga oling: umumiy ko'rinish, ichidagi tovar, yopilgan holati. Bu suratlar "kam chiqdi" yoki "ifloslangan" degan da'voda yagona dalil bo'ladi.

## Kim javobgar

Tashish xizmati odatda qadoq butunligiga javob beradi, ichidagi dona soniga emas. Shuning uchun ichki ro'yxat va suratlar muhim. Kelishuvda "yo'lda yo'qolgan tovar kimning zarari" degan savolga oldindan javob bo'lsin.

## Qaytarish oqimini o'ylab qo'ying

Brak yoki noto'g'ri razmer chiqsa, u qanday qaytariladi va kim to'laydi? Bu savolni birinchi xaridda hal qilish kerak, oltinchida emas.

## Vaqtni mavsumga moslang

Bayram oldidan tashish xizmatlari band bo'ladi va kechikish oshadi. Hayit yoki Yangi yil partiyasini odatdagidan 1–2 hafta oldin yuboring.

## Tez-tez so'raladigan savollar

**Kichik partiyani yuborish foydalimi?**
Yetkazish narxi dona boshiga tushadi. 20–30 donadan kam partiyada yetkazish ustamasi sezilarli bo'ladi.

**Qadoqni kim to'laydi?**
Odatda xaridor, lekin bu ham kelishuv masalasi — oldindan aniqlang.

**Tovarni qanday sanab olish kerak?**
Qadoq ochilgan zahoti, suratga olib. Kechikkan da'vo qabul qilinmaydi.

*Oltinoy Collection viloyatlardagi optomchilar bilan ishlaydi. Shartlar va joriy modellar: [katalog](/katalog) · [aloqa](/aloqa).*`,
    contentRu: `Большая часть оптовиков работает за пределами Ташкента. Товар едет несколько сотен километров, и именно в дороге возникает больше всего споров. Ниже — порядок, который уменьшает потери.

## Заранее определите условия оплаты

Здесь больше всего недопониманий. Есть три варианта, и риск у каждого свой:

- **Предоплата** — безопасно для продавца, требует доверия от покупателя.
- **Оплата по факту** — удобно покупателю, рискованно продавцу.
- **Частичная предоплата** — на практике самый используемый компромисс.

Какой бы вариант ни был — зафиксируйте письменно.

## Упаковка — дёшево, но решает

Одежда в дороге пачкается и отсыревает. Рабочий порядок: каждая вещь в отдельном пакете, сверху общий мешок или коробка, углы проклеены скотчем. Внутрь вложите лист с количеством и размерами — по нему принимающий считает.

## Документ и фото

Перед отправкой сфотографируйте упаковку: общий вид, содержимое, закрытое состояние. Эти фото — единственное доказательство при претензии «не хватило» или «испачкано».

## Кто отвечает

Транспортная служба обычно отвечает за целостность упаковки, а не за количество внутри. Поэтому внутренняя опись и фото важны. В договорённости заранее ответьте: чей убыток, если товар потерян в пути.

## Продумайте поток возвратов

Если пришёл брак или не тот размер — как он возвращается и кто платит? Этот вопрос решается на первой закупке, а не на шестой.

## Подстройтесь под сезон

Перед праздниками транспорт загружен, задержки растут. Праздничную партию отправляйте на 1–2 недели раньше обычного.

## Частые вопросы

**Выгодно ли отправлять маленькую партию?**
Стоимость доставки ложится на единицу товара. Меньше 20–30 единиц наценка на доставку ощутима.

**Кто платит за упаковку?**
Обычно покупатель, но это тоже вопрос договорённости.

**Как принимать товар?**
Сразу при вскрытии, с фото. Отложенная претензия не принимается.

*Oltinoy Collection работает с оптовиками из регионов. Условия и актуальные модели: [каталог](/ru/katalog) · [контакты](/ru/aloqa).*`,
  },
  {
    slug: "optomda-qaytarish-almashtirish-brak",
    titleUz: "Optomda qaytarish, almashtirish va brak: shartlarni qanday kelishish kerak",
    titleRu: "Возврат, обмен и брак в опте: как договариваться об условиях",
    excerptUz:
      "Brak nima hisoblanadi, nima hisoblanmaydi, da'vo qancha muddatda bildiriladi va kelishuvda qanday bandlar bo'lishi kerak.",
    excerptRu:
      "Что считается браком, а что нет, в какой срок заявлять претензию и какие пункты должны быть в договорённости.",
    publishedAt: "2026-10-03",
    contentUz: `Optom savdoda eng ko'p janjal "brak" so'zining har kim uchun boshqacha ma'no anglatishidan chiqadi. Shartlarni oldindan aniqlab qo'ysangiz, muammo texnik masalaga aylanadi.

## Brak nima hisoblanadi

Odatda quyidagilar kamchilik deb tan olinadi:

- so'kilgan yoki qiyshiq chok
- matodagi teshik, dog' yoki siyrak joy
- bir partiya ichida sezilarli rang tovlanishi
- ishlamaydigan zamok, tushib qolgan tugma
- e'lon qilingan razmerdan jiddiy farq

## Brak hisoblanmaydigan holatlar

Buni ham bilish kerak, aks holda da'vo asossiz chiqadi:

- kiyilgandan yoki yuvilgandan keyingi o'zgarish
- turli partiyalar orasidagi kichik rang farqi (matoning tabiiy xususiyati)
- monitor rangi bilan haqiqiy rang farqi
- xaridor o'zi o'zgartirgan yoki bichgan dona

## Muddat — eng muhim band

Amalda ishlaydigan qoida: da'vo qadoq ochilgan kuni, suratlar bilan bildiriladi. Bir hafta o'tgan da'voni hech kim tekshira olmaydi — tovar qayerda bo'lgani noma'lum.

## Kelishuvda bo'lishi kerak bo'lgan 5 band

1. Brak deb nima tan olinadi
2. Da'vo muddati (kun hisobida)
3. Almashtiriladimi yoki puli qaytariladimi
4. Qaytarish yo'l xarajatini kim to'laydi
5. Braklangan dona qayerda qoladi

Bularni Telegramdagi bitta xabarga yozib, ikkala tomon tasdiqlashi yetarli.

## Almashtirish odatda pul qaytarishdan yaxshiroq

Ikkala tomon uchun ham: sotuvchi tovarni beradi, xaridor kerakli donani oladi, pul aylanmadan chiqmaydi. Shuning uchun ko'p sexlar almashtirishni birinchi variant qilib taklif qiladi.

## Munosabatni saqlash

Yaxshi yetkazib beruvchi braklangan bitta dona uchun mijozni yo'qotmaydi. Yaxshi xaridor ham har kichik nuqson uchun janjal qilmaydi. Uzoq muddatli hamkorlik ikkala tomonning yon berishidan quriladi.

## Tez-tez so'raladigan savollar

**Braklangan donani chegirma bilan sotsam bo'ladimi?**
Bu sizning qaroringiz, lekin uni sotganingizdan keyin almashtirish talab qila olmaysiz.

**Rang tovlanishi uchun butun partiyani qaytarish mumkinmi?**
Odatda yo'q — faqat farq qilayotgan donalar bo'yicha da'vo qilinadi.

**Yozma kelishuv shartmi?**
Rasmiy shartnoma shart emas, lekin yozishma bo'lishi shart.

*Oltinoy Collection o'z sexida tikadi — brak bo'yicha savol vositachisiz hal qilinadi. [Katalog](/katalog) · [aloqa](/aloqa).*`,
    contentRu: `Больше всего конфликтов в опте возникает из-за того, что слово «брак» каждый понимает по-своему. Если условия определены заранее, проблема становится технической.

## Что считается браком

Обычно признаются недостатками:

- разошедшийся или кривой шов
- дырка, пятно или разрежённое место в ткани
- заметный разнотон внутри одной партии
- нерабочая молния, оторванная пуговица
- серьёзное расхождение с заявленным размером

## Что браком не считается

Это тоже нужно знать, иначе претензия окажется необоснованной:

- изменения после носки или стирки
- небольшая разница цвета между разными партиями (свойство ткани)
- разница между цветом на экране и реальным
- изделие, которое покупатель сам переделал или подрезал

## Срок — самый важный пункт

Рабочее правило: претензия заявляется в день вскрытия упаковки, с фото. Претензию через неделю никто не сможет проверить.

## 5 пунктов, которые должны быть в договорённости

1. Что признаётся браком
2. Срок претензии (в днях)
3. Замена или возврат денег
4. Кто оплачивает обратную дорогу
5. Где остаётся бракованное изделие

Достаточно одного сообщения в Telegram, подтверждённого обеими сторонами.

## Замена обычно лучше возврата денег

Для обеих сторон: продавец отдаёт товар, покупатель получает нужное, деньги не выходят из оборота. Поэтому многие цеха предлагают замену первым вариантом.

## Сохранять отношения

Нормальный поставщик не теряет клиента из-за одной бракованной единицы. Нормальный покупатель не устраивает конфликт из-за мелочи. Долгое сотрудничество строится на уступках с обеих сторон.

## Частые вопросы

**Можно ли продать брак со скидкой?**
Это ваше решение, но после продажи требовать замену уже нельзя.

**Можно ли вернуть всю партию из-за разнотона?**
Обычно нет — претензия только по отличающимся единицам.

**Обязателен ли письменный договор?**
Официальный договор не обязателен, но переписка обязательна.

*Oltinoy Collection шьёт в своём цехе — вопрос по браку решается без посредника. [Каталог](/ru/katalog) · [контакты](/ru/aloqa).*`,
  },
  {
    slug: "ayollar-kiyimi-optom-narxlari-2026",
    titleUz: "Ayollar kiyimi optom narxlari 2026: narx nimadan tashkil topadi",
    titleRu: "Оптовые цены на женскую одежду 2026: из чего складывается цена",
    excerptUz:
      "Optom narx nimalardan yig'iladi: mato, bichish, tikuv, furnitura, qadoq va vositachi ustamasi. Narxni to'g'ri taqqoslashni o'rganing.",
    excerptRu:
      "Из чего складывается оптовая цена: ткань, крой, пошив, фурнитура, упаковка и наценка посредника. Как правильно сравнивать цены.",
    publishedAt: "2026-10-06",
    contentUz: `"Nega bu ko'ylak u yerda arzon, bu yerda qimmat?" — narx farqi ko'pincha ustamadan emas, tarkibdan chiqadi. Optomchi narxni taqqoslay olishi uchun uning ichini bilishi kerak.

## Narxning tarkibi

Bir dona kiyimning optom narxi taxminan quyidagilardan yig'iladi:

- **Mato** — eng katta ulush. Mato turi va sarfi (uzun ko'ylakka ko'proq ketadi) narxni eng kuchli o'zgartiradi.
- **Bichish va tikuv** — model murakkabligiga bog'liq. Volan, plisse, dantel qo'shilishi ish vaqtini oshiradi.
- **Furnitura** — tugma, zamok, belbog', kashta.
- **Qadoq** — paket, yorliq.
- **Vositachi ustamasi** — bozordan olsangiz bor, sexdan olsangiz yo'q.

## Nega bir xil ko'rinadigan ikki ko'ylak narxi farq qiladi

Eng ko'p sabab — mato zichligi. Yorug'likka tutganda siyrak ko'rinadigan mato arzonroq turadi va kiyilganda tez eskiradi. Ikkinchi sabab — chok ishlovi: overloksiz yoki bir qatorli chok arzonlashtiradi, lekin birinchi yuvishdan keyin bilinadi.

## Narxni qanday to'g'ri taqqoslash kerak

Faqat raqamga qaramang. Taqqoslashda uchta narsani yonma-yon qo'ying:

1. Mato nomi va zichligi
2. Razmer oralig'i (56 gacha tikiladimi — matoning sarfi boshqacha)
3. Brak va qayta buyurtma shartlari

Arzon narx + yomon shart = qimmat tovar.

## 2026 kuz mavsumida nima ta'sir qiladi

Kuz-qish modellarida mato zichroq bo'ladi va sarfi ko'proq — shuning uchun qishki model yozgisidan tabiiy ravishda qimmat turadi. Bayram oldidan bezakli modellar (kashta, tosh, dantel) narxi ham ko'tariladi, chunki qo'l ishi ko'payadi.

## Vositachisiz olishning ta'siri

Tikuv sexidan to'g'ridan-to'g'ri olganda vositachi ustamasi tushib qoladi va qayta buyurtma tezlashadi. Oltinoy Collection o'z sexida tikadi — shuning uchun narx ham, muddat ham to'g'ridan-to'g'ri kelishiladi.

## Tez-tez so'raladigan savollar

**Eng arzon variantni olish to'g'rimi?**
Faqat mato va tikuv sifati bir xil bo'lsa. Aks holda taqqoslash noto'g'ri.

**Partiya kattalashsa narx tushadimi?**
Odatda ha — lekin bu har bir sex bilan alohida kelishiladi.

**Narx qachon o'zgaradi?**
Mato narxi va mavsum o'zgarganda. Kuzda va bayram oldidan o'zgarish ko'proq bo'ladi.

*Oltinoy Collection — joriy modellar va optom shartlari: [katalog](/katalog) · [biz haqimizda](/biz-haqimizda) · [aloqa](/aloqa).*`,
    contentRu: `«Почему это платье там дешевле, а здесь дороже?» — разница в цене чаще идёт не от наценки, а от состава. Чтобы сравнивать цены, оптовик должен понимать, из чего они складываются.

## Составляющие цены

Оптовая цена единицы примерно складывается из:

- **Ткань** — самая большая доля. Вид ткани и расход (на длинное платье уходит больше) сильнее всего двигают цену.
- **Крой и пошив** — зависит от сложности модели. Воланы, плиссе, кружево увеличивают время работы.
- **Фурнитура** — пуговицы, молнии, пояс, вышивка.
- **Упаковка** — пакет, бирка.
- **Наценка посредника** — есть при закупке на рынке, нет при закупке из цеха.

## Почему два похожих платья стоят по-разному

Чаще всего — плотность ткани. Ткань, которая просвечивает, стоит дешевле и быстрее изнашивается. Вторая причина — обработка швов: без оверлока или в одну строчку дешевле, но это видно после первой стирки.

## Как правильно сравнивать цены

Не смотрите только на цифру. Сопоставляйте три вещи:

1. Название и плотность ткани
2. Размерный ряд (шьют ли до 56 — расход ткани другой)
3. Условия по браку и повторному заказу

Низкая цена плюс плохие условия равно дорогой товар.

## Что влияет в осеннем сезоне 2026

В осенне-зимних моделях ткань плотнее и расход больше — поэтому зимняя модель естественно дороже летней. Перед праздниками растёт цена нарядных моделей (вышивка, камни, кружево), потому что больше ручной работы.

## Что даёт закупка без посредника

При закупке напрямую из цеха уходит наценка посредника и ускоряется повторный заказ. Oltinoy Collection шьёт в своём цехе — цена и сроки обсуждаются напрямую.

## Частые вопросы

**Правильно ли брать самый дешёвый вариант?**
Только если ткань и качество пошива одинаковые. Иначе сравнение некорректно.

**Снижается ли цена при большой партии?**
Обычно да, но это обсуждается с каждым цехом отдельно.

**Когда меняются цены?**
При изменении цены ткани и смене сезона. Осенью и перед праздниками — чаще.

*Oltinoy Collection — актуальные модели и оптовые условия: [каталог](/ru/katalog) · [о нас](/ru/biz-haqimizda) · [контакты](/ru/aloqa).*`,
  },
  {
    slug: "bek-baraka-bozori-optomchi-uchun-gid",
    titleUz: "Bek Baraka bozori: optom kiyim oluvchilar uchun amaliy gid",
    titleRu: "Рынок Бек Барака: практический гид для оптовых закупок одежды",
    excerptUz:
      "Bek Barakada optom kiyim qanday olinadi: qachon borish, qanday tayyorlanish, narxni qanday tekshirish va do'kon topish bo'yicha maslahatlar.",
    excerptRu:
      "Как закупать одежду оптом на Бек Барака: когда ехать, как подготовиться, как проверять цену и находить магазины.",
    publishedAt: "2026-10-09",
    contentUz: `Toshkentda optom ayollar kiyimi olinadigan asosiy nuqtalardan biri — Bek Baraka. Birinchi marta boradiganlar ko'pincha vaqtini yo'qotadi va kerakmas tovar bilan qaytadi. Quyida tayyorgarlik uchun amaliy gid.

## Qachon borish kerak

Ertalab — eng yaxshi vaqt. Tovar yangi chiqariladi, sotuvchilar bo'sh bo'ladi va siz bilan gaplashishga vaqti bor. Tushdan keyin olomon ko'payadi, muzokara qiyinlashadi.

## Borishdan oldin tayyorlang

- **Ro'yxat.** Nima kerakligini yozib oling: model turi, razmer taqsimoti, rang, byudjet chegarasi.
- **Oxirgi sotuv statistikangiz.** Qaysi razmer tez ketdi, qaysi rang qoldi.
- **O'lchov jadvali.** Har do'konda razmer boshqacha bo'lishi mumkin.
- **Qadoq uchun qop va skotch.**

Ro'yxatsiz borish — "ko'zga chiroyli ko'ringan" tovar bilan qaytishning eng aniq yo'li.

## Narxni qanday tekshirish

Bitta do'konda to'xtab qolmang. Bir xil modelni 2–3 joyda so'rang, keyin qaytib keling. Narx so'raganda partiya hajmini ayting — dona narxi va partiya narxi farq qiladi.

## Nimaga e'tibor berish kerak

Qo'lingiz bilan tekshiring: matoni yorug'likka tuting, chokni ichkaridan ko'ring, zamokni ochib-yoping. Rasm va vitrinadagi ko'rinish yetarli emas.

## Vositachi va sex farqi

Bozordagi ko'p do'konlar tikuv sexlaridan olib sotadi — ya'ni narxda ustama bor. Agar model sizga doimiy kerak bo'lsa, uni tikadigan sexni topib, to'g'ridan-to'g'ri ishlash arzonroq tushadi va qayta buyurtma tezlashadi.

## Tovarni olib chiqish

Sanab oling va suratga oling — bozorda ham xuddi masofaviy xariddagi kabi. Qadoqni mahkam yoping, ayniqsa viloyatga yuboradigan bo'lsangiz.

## Tez-tez so'raladigan savollar

**Birinchi marta yolg'iz borish qiyinmi?**
Ro'yxat va byudjet bilan borsangiz — yo'q. Eng katta xavf tayyorgarliksizlik.

**Narxni tortishish odat emasmi?**
Optom xaridda partiya hajmi bo'yicha kelishish odatiy hol.

**Sexdan olish uchun bozorga borish shartmi?**
Yo'q. Ko'p sexlar, jumladan Oltinoy Collection, to'g'ridan-to'g'ri ishlaydi va viloyatlarga yuboradi.

*Oltinoy Collection — Bek Baraka, 12-qator, 473-do'kon. Joriy modellar: [katalog](/katalog) · manzil va telefon: [aloqa](/aloqa).*`,
    contentRu: `Один из главных адресов оптовой закупки женской одежды в Ташкенте — рынок Бек Барака. Те, кто едет впервые, часто теряют время и возвращаются с ненужным товаром. Ниже — практическая подготовка.

## Когда ехать

Утро — лучшее время. Товар только выкладывают, продавцы свободнее и готовы разговаривать. После обеда становится людно, договариваться труднее.

## Что подготовить заранее

- **Список.** Что нужно: тип модели, раскладка по размерам, цвета, лимит бюджета.
- **Свою статистику продаж.** Какой размер ушёл быстро, какой цвет остался.
- **Размерную таблицу.** В каждом магазине размер может отличаться.
- **Мешок и скотч для упаковки.**

Поехать без списка — верный способ вернуться с тем, что «красиво выглядело».

## Как проверять цену

Не останавливайтесь на первом магазине. Спросите одну и ту же модель в 2–3 местах, потом вернитесь. Называя цену, сразу говорите объём партии — цена за штуку и за партию отличаются.

## На что смотреть

Проверяйте руками: ткань на просвет, шов изнутри, молнию открыть-закрыть. Фото и вид на витрине недостаточно.

## Разница между посредником и цехом

Многие магазины на рынке перепродают товар из швейных цехов — в цене есть наценка. Если модель нужна вам постоянно, дешевле найти цех и работать напрямую: и цена ниже, и повторный заказ быстрее.

## Вывоз товара

Пересчитайте и сфотографируйте — как и при удалённой закупке. Плотно закройте упаковку, особенно если отправляете в регион.

## Частые вопросы

**Сложно ли ехать в первый раз одному?**
Со списком и бюджетом — нет. Главный риск это неподготовленность.

**Принято ли торговаться?**
При оптовой закупке договариваться по объёму партии — обычное дело.

**Нужно ли ехать на рынок, чтобы закупиться из цеха?**
Нет. Многие цеха, включая Oltinoy Collection, работают напрямую и отправляют в регионы.

*Oltinoy Collection — Бек Барака, 12-й ряд, магазин 473. Актуальные модели: [каталог](/ru/katalog) · адрес и телефон: [контакты](/ru/aloqa).*`,
  },
  {
    slug: "kiyimga-narx-qoyish-ustama-necha-foiz",
    titleUz: "Kiyimga narx qo'yish: ustama necha foiz bo'lishi kerak?",
    titleRu: "Ценообразование в одежде: какой должна быть наценка?",
    excerptUz:
      "Optom olingan kiyimga qanday narx qo'yiladi: ustama hisobi, yashirin xarajatlar, chegirma va psixologik narx bo'yicha amaliy formulalar.",
    excerptRu:
      "Как назначить цену на закупленную одежду: расчёт наценки, скрытые расходы, скидки и психология цены — практические формулы.",
    publishedAt: "2026-10-12",
    contentUz: `Ko'p sotuvchilarda "foyda bordek, lekin pul yo'q" holati bo'ladi. Sababi deyarli har doim bitta: ustama faqat tovar narxidan hisoblangan, qolgan xarajatlar hisobga olinmagan.

## Avval haqiqiy tannarxni hisoblang

Bir donaning sizga tushgan narxi faqat optom narx emas. Unga qo'shiladi:

- yetkazib berish (partiya narxini dona soniga bo'ling)
- qadoq va yorliq
- yo'l va vaqt
- sotilmay qolgan yoki chegirma bilan ketgan donalarning zarari
- to'lov tizimi komissiyasi (agar bor bo'lsa)

Shu yig'indi — sizning haqiqiy tannarxingiz.

## Ustama formulasi

Sotuv narxi = haqiqiy tannarx × (1 + ustama). Kiyim savdosida ustama odatda 30–60% oralig'ida. Qaysi chekka sizga to'g'ri kelishi uch narsaga bog'liq:

- **Aylanma tezligi.** Tez sotiladigan asosiy modelda ustama pastroq bo'lishi mumkin.
- **Xizmat darajasi.** Yetkazib berish, o'lchamda maslahat, almashtirish — bular ustamani oqlaydi.
- **Raqobat.** Bir xil model ko'p joyda bo'lsa, ustama siqiladi.

## Har bir modelga bir xil ustama qo'yish shart emas

Asosiy modellarda ustama pastroq, kam uchraydigan yoki bezakli modellarda yuqoriroq bo'lishi mumkin. Umumiy foyda muhim, har bir donaning foizi emas.

## Chegirmani oldindan rejalashtiring

Mavsum oxirida chegirma bo'lishi aniq. Agar ustamangiz shu chegirmani ko'tara olmasa, mavsum oxirida zarar bilan chiqasiz. Amaliy yechim: narxni belgilashda 10–15% "chegirma zaxirasi" qo'shing.

## Psixologik narx

Yumaloq raqam (150 000) aniq raqamdan (148 000) ko'ra ishonchliroq ko'rinadi, ayniqsa optom savdoda. Chakana savdoda esa aksincha ishlashi mumkin. O'z auditoriyangizda sinab ko'ring.

## Narxni tez-tez o'zgartirmang

Har hafta narx o'zgarsa, doimiy mijoz ishonchni yo'qotadi. Narxni mavsum boshida belgilang va mavsum ichida ushlab turing.

## Tez-tez so'raladigan savollar

**Raqobatchidan arzon qo'ysam bo'ladimi?**
Bo'ladi, lekin bu doimiy strategiya emas — arzonlik bo'yicha musobaqada har doim kimdir undan ham arzon qo'yadi.

**Optom va chakana narxni bir sahifada ko'rsatish kerakmi?**
Auditoriyangiz kim ekaniga bog'liq. Aralashtirmaslik odatda tushunarliroq.

**Yetkazib berishni narxga qo'shish kerakmi?**
Ikkala variant ishlaydi, lekin aniq yozilishi shart.

*Oltinoy Collection — optom narxlar va joriy modellar: [katalog](/katalog) · [aloqa](/aloqa).*`,
    contentRu: `У многих продавцов бывает ощущение «прибыль есть, а денег нет». Причина почти всегда одна: наценка посчитана только от цены товара, остальные расходы не учтены.

## Сначала посчитайте реальную себестоимость

Стоимость единицы для вас — это не только оптовая цена. К ней добавляются:

- доставка (цену партии делим на количество)
- упаковка и бирка
- дорога и время
- убыток от непроданного или проданного со скидкой
- комиссия платёжной системы, если есть

Эта сумма и есть ваша реальная себестоимость.

## Формула наценки

Цена продажи = реальная себестоимость × (1 + наценка). В одежде наценка обычно 30–60%. Какой край подходит вам, зависит от трёх вещей:

- **Скорость оборота.** На быстрой базовой модели наценка может быть ниже.
- **Уровень сервиса.** Доставка, помощь с размером, обмен — это оправдывает наценку.
- **Конкуренция.** Если модель есть у многих, наценка сжимается.

## Одинаковая наценка на всё не обязательна

На базовых моделях наценка ниже, на редких и нарядных — выше. Важна общая прибыль, а не процент по каждой единице.

## Планируйте скидку заранее

Скидка в конце сезона будет обязательно. Если наценка её не выдерживает, сезон закроется в убыток. Практическое решение: закладывать 10–15% «запаса на скидку».

## Психология цены

Круглое число (150 000) в опте выглядит надёжнее точного (148 000). В рознице может работать наоборот. Проверьте на своей аудитории.

## Не меняйте цену слишком часто

Если цена меняется каждую неделю, постоянный клиент теряет доверие. Установите цену в начале сезона и держите её.

## Частые вопросы

**Можно ли поставить дешевле конкурента?**
Можно, но это не постоянная стратегия — в гонке за дешевизной всегда найдётся кто-то дешевле.

**Показывать оптовую и розничную цену на одной странице?**
Зависит от аудитории. Обычно понятнее их не смешивать.

**Включать ли доставку в цену?**
Работают оба варианта, но это должно быть явно написано.

*Oltinoy Collection — оптовые цены и актуальные модели: [каталог](/ru/katalog) · [контакты](/ru/aloqa).*`,
  },
  {
    slug: "kiyim-sotish-uchun-yatt-kerakmi",
    titleUz: "Kiyim sotish uchun YaTT ochish kerakmi? Sodda tilda javob",
    titleRu: "Нужно ли открывать ИП для продажи одежды? Простыми словами",
    excerptUz:
      "Onlayn va do'konda kiyim sotishda rasmiy ro'yxatdan o'tish qachon kerak bo'ladi, nima beradi va nimadan boshlanadi — umumiy tushuntirish.",
    excerptRu:
      "Когда нужна официальная регистрация при продаже одежды онлайн и в магазине, что она даёт и с чего начать — общее объяснение.",
    publishedAt: "2026-10-15",
    contentUz: `Kiyim savdosini boshlaganlarning ko'pi bu savolni kechiktiradi: "hozircha kichik, keyin ko'raman". Amalda esa rasmiylashtirish savdoning o'sishini ochib beradigan qadam bo'lib chiqadi.

> Quyidagi ma'lumot umumiy tushuntirish uchun. Aniq talablar va soliq stavkalari vaqt bilan o'zgaradi — yakuniy qaror oldidan rasmiy manbalardan yoki buxgalterdan tasdiqlang.

## Rasmiy ro'yxatdan o'tish nima beradi

- **Yetkazib beruvchilar bilan ishlash.** Ko'p sexlar va tashish xizmatlari rasmiy hujjat bilan ishlashni afzal ko'radi.
- **To'lovni qonuniy qabul qilish.** Kartaga to'lov va onlayn to'lov tizimlari uchun kerak bo'ladi.
- **Marketpleyslarga chiqish.** Ko'pchiligi ro'yxatdan o'tganlik talab qiladi.
- **Mijoz ishonchi.** Ayniqsa katta partiya sotayotganda.

## Qachon kechiktirmaslik kerak

Quyidagi holatlarda rasmiylashtirish kechiktirilmaydi:

- muntazam va sezilarli aylanma paydo bo'lganda
- do'kon yoki ombor ijaraga olinganda
- xodim yollanganda
- marketpleys yoki rasmiy to'lov tizimiga chiqilganda

## Nimadan boshlanadi

Umumiy tartib odatda shunday: faoliyat turini tanlash, ro'yxatdan o'tish arizasi, soliq rejimini tanlash, hisob raqami ochish. Ko'p qadamlar onlayn bajariladi.

## Eng ko'p uchraydigan qo'rquvlar

**"Soliq hammasini yeb qo'yadi."** Kichik aylanmada soliq yuki odatda kutilganidan past. Aniq raqamni buxgalter bilan hisoblang.

**"Hujjatlar juda murakkab."** Boshlang'ich bosqichda hisobot hajmi kichik bo'ladi.

**"Keyin to'xtata olmayman."** Faoliyatni to'xtatish tartibi ham mavjud.

## Rasmiylashtirmasdan boshlash

Ko'pchilik uy sharoitida, kichik partiya bilan, tanish-bilish orqali boshlaydi. Bu bosqichda asosiy vazifa — bozorni sinash. Aylanma barqarorlashgach, rasmiylashtirish keyingi tabiiy qadam bo'ladi.

## Tez-tez so'raladigan savollar

**Instagramdan sotish uchun ham kerakmi?**
Aylanma kichik bo'lsa boshida kerak bo'lmasligi mumkin, lekin o'sish bilan zarur bo'ladi.

**Optomchi sifatida hujjatsiz ishlay olamanmi?**
Kichik hajmda mumkin, lekin katta sexlar va tashish xizmatlari hujjat so'raydi.

**Qaysi soliq rejimi qulay?**
Aylanma hajmiga bog'liq — buxgalter bilan tanlang.

*Oltinoy Collection optomchilar bilan ishlaydi. [Katalog](/katalog) · [biz haqimizda](/biz-haqimizda) · [aloqa](/aloqa).*`,
    contentRu: `Многие, кто начинает торговать одеждой, откладывают этот вопрос: «пока мелко, потом посмотрю». На практике регистрация оказывается шагом, который открывает рост.

> Ниже — общее объяснение. Конкретные требования и налоговые ставки со временем меняются: перед решением уточните в официальных источниках или у бухгалтера.

## Что даёт официальная регистрация

- **Работа с поставщиками.** Многие цеха и транспортные службы предпочитают работать по документам.
- **Законный приём оплаты.** Нужен для оплаты на карту и онлайн-платежей.
- **Выход на маркетплейсы.** Большинство требует регистрацию.
- **Доверие клиента.** Особенно при крупных партиях.

## Когда откладывать нельзя

- появился регулярный и заметный оборот
- арендован магазин или склад
- нанят сотрудник
- выход на маркетплейс или официальную платёжную систему

## С чего начинается

Обычный порядок: выбор вида деятельности, заявление на регистрацию, выбор налогового режима, открытие счёта. Многие шаги делаются онлайн.

## Частые страхи

**«Налоги съедят всё».** При небольшом обороте нагрузка обычно ниже ожидаемой. Точную цифру посчитайте с бухгалтером.

**«Документы слишком сложные».** На старте объём отчётности небольшой.

**«Потом не смогу остановиться».** Порядок прекращения деятельности тоже существует.

## Начать без регистрации

Многие начинают дома, небольшой партией, через знакомых. На этом этапе главная задача — проверить рынок. Когда оборот стабилизируется, регистрация становится следующим естественным шагом.

## Частые вопросы

**Нужна ли регистрация для продаж в Instagram?**
При небольшом обороте на старте может не быть нужна, но с ростом становится необходимой.

**Можно ли работать оптовиком без документов?**
В малом объёме возможно, но крупные цеха и транспорт просят документы.

**Какой налоговый режим удобнее?**
Зависит от оборота — выбирайте с бухгалтером.

*Oltinoy Collection работает с оптовиками. [Каталог](/ru/katalog) · [о нас](/ru/biz-haqimizda) · [контакты](/ru/aloqa).*`,
  },
  {
    slug: "uyda-otirib-kiyim-sotish-onalar-uchun",
    titleUz: "Uyda o'tirib kiyim sotish: onalar uchun ishlaydigan biznes-model",
    titleRu: "Продажа одежды из дома: рабочая модель для мам",
    excerptUz:
      "Bola bilan uyda o'tirib kiyim savdosini qanday yo'lga qo'yish mumkin: vaqt taqsimoti, kichik ombor, buyurtma oqimi va o'sish bosqichlari.",
    excerptRu:
      "Как наладить продажу одежды из дома с ребёнком: распределение времени, мини-склад, поток заказов и этапы роста.",
    publishedAt: "2026-10-18",
    contentUz: `Kiyim savdosi uyda boshlash mumkin bo'lgan kam biznesdan biri: katta jihoz kerak emas, ish vaqti moslashuvchan va boshlang'ich kapital kichik bo'lishi mumkin. Quyida bola bilan uyda ishlaydigan modelning amaliy tuzilishi.

## Vaqtni ishga emas, blokka bo'ling

Kun bo'yi telefonga qarab o'tirish — charchoqning eng tez yo'li. Ishlaydigan tartib: kuniga 2–3 ta qat'iy blok.

- **Ertalab (30–40 daqiqa):** tungi xabarlarga javob, buyurtmalarni yozib olish.
- **Kunduzi (1 soat):** qadoqlash va jo'natish.
- **Kechqurun (30 daqiqa):** post/story tayyorlash, ertangi rejani yozish.

Mijozga "javob vaqti" ni oldindan aytib qo'ying — bu kutishni ham, sizni ham tinchlantiradi.

## Kichik ombor qanday tashkil qilinadi

Bir javon yoki bitta shkaf yetarli. Qoidalar sodda: har model alohida paketda, razmer yozilgan, eng ko'p sotiladigani qo'l ostida. Oyiga bir marta "qolib ketganlar" ni alohida ajratib, chegirmaga chiqaring.

## Buyurtma oqimini bitta joyga yig'ing

Telegram, Instagram, qo'ng'iroq — uchta kanaldan kelgan buyurtma bitta daftarga yoki bitta jadvalga tushishi kerak. Aks holda "kimningdir buyurtmasi unutilgan" holati muqarrar. Oddiy jadval ustunlari: sana, ism, telefon, model, razmer, to'lov, holat.

## Nimadan boshlash

3–4 ta model, har biridan bir necha dona, eng ko'p so'raladigan razmerlar. Katta partiya kerak emas — boshida sizga tovar emas, ma'lumot kerak.

## Ishonchni qanday quriladi

Uydan sotayotgan bo'lsangiz, ishonch — asosiy kapitalingiz. Uni quradigan narsalar: haqiqiy suratlar (o'zingiz olgan), o'lchov jadvali, aniq yetkazib berish muddati va muammo chiqqanda javob berish.

## O'sish bosqichlari

1. Tanish-bilish doirasida sotish
2. Telegram kanal ochish va muntazam post
3. Doimiy mijozlarga qayta sotish
4. Kichik optom (boshqa sotuvchilarga berish)

Har bosqichga o'tishdan oldin oldingisi barqaror ishlashi kerak.

## Tez-tez so'raladigan savollar

**Kuniga qancha vaqt kerak?**
Boshlang'ich bosqichda 2–3 soat yetarli, agar u bloklarga bo'lingan bo'lsa.

**Do'kon ochmasdan qanday ishonch qozonaman?**
Haqiqiy surat, aniq o'lcham va bergan so'zni bajarish — uchtasi yetarli.

**Tovarni qayerdan olaman?**
Tikuv sexlaridan to'g'ridan-to'g'ri olish kichik savdo uchun ham mumkin.

*Oltinoy Collection kichik optomchilar bilan ham ishlaydi. [Katalog](/katalog) · [aloqa](/aloqa).*`,
    contentRu: `Торговля одеждой — один из немногих видов бизнеса, который можно начать дома: не нужно оборудование, график гибкий, стартовый капитал может быть небольшим. Ниже — практическая структура модели, которая работает дома с ребёнком.

## Делите не задачи, а блоки времени

Сидеть весь день в телефоне — самый быстрый путь к выгоранию. Рабочий порядок: 2–3 жёстких блока в день.

- **Утро (30–40 минут):** ответы на ночные сообщения, запись заказов.
- **День (1 час):** упаковка и отправка.
- **Вечер (30 минут):** контент, план на завтра.

Скажите клиентам заранее, в какое время вы отвечаете — это успокаивает и их, и вас.

## Как организовать мини-склад

Достаточно одной полки или шкафа. Правила простые: каждая модель в отдельном пакете, размер подписан, ходовое — под рукой. Раз в месяц отделяйте «зависшее» и выводите со скидкой.

## Сведите заказы в одно место

Telegram, Instagram, звонки — заказы из трёх каналов должны попадать в одну тетрадь или таблицу. Иначе чей-то заказ обязательно потеряется. Колонки: дата, имя, телефон, модель, размер, оплата, статус.

## С чего начать

3–4 модели, по несколько штук, самые ходовые размеры. Большая партия не нужна — вначале вам нужен не товар, а данные.

## Как строится доверие

Когда вы продаёте из дома, доверие — основной капитал. Его строят: реальные фото (снятые вами), размерная таблица, точный срок доставки и ответ, когда возникла проблема.

## Этапы роста

1. Продажи в кругу знакомых
2. Свой Telegram-канал и регулярные посты
3. Повторные продажи постоянным клиентам
4. Мелкий опт (перепродавцам)

Переходить на следующий этап стоит, когда предыдущий работает стабильно.

## Частые вопросы

**Сколько времени нужно в день?**
На старте достаточно 2–3 часов, если они разбиты на блоки.

**Как завоевать доверие без магазина?**
Реальные фото, точные размеры и выполнение обещаний — этих трёх достаточно.

**Где брать товар?**
Закупка напрямую из цеха возможна и для небольшой торговли.

*Oltinoy Collection работает и с мелкими оптовиками. [Каталог](/ru/katalog) · [контакты](/ru/aloqa).*`,
  },
  {
    slug: "telegramda-kiyim-dokoni-kanal-guruh-bot",
    titleUz: "Telegramda kiyim do'koni: kanal, guruh yoki bot — qaysi biri kerak?",
    titleRu: "Магазин одежды в Telegram: канал, группа или бот — что выбрать?",
    excerptUz:
      "Telegramda savdo uchun kanal, guruh va botning farqi, har birining kuchli tomoni va qaysi bosqichda nimasi kerakligi.",
    excerptRu:
      "Чем отличаются канал, группа и бот для торговли в Telegram, в чём сила каждого и что нужно на каком этапе.",
    publishedAt: "2026-10-21",
    contentUz: `O'zbekistonda kiyim savdosining katta qismi Telegramda ketadi. Lekin "kanal ochsam bo'ldimi yoki bot kerakmi?" degan savolga ko'pchilik noto'g'ri javob beradi va keraksiz ishga vaqt sarflaydi.

## Kanal — asosiy vitrina

Kanal bir tomonlama: siz post qo'yasiz, obunachilar ko'radi. Kiyim savdosi uchun eng muhim vosita, chunki:

- post tartibi siz nazorat qilasiz
- eski postlar katalog vazifasini bajaradi
- obunachi soni ijtimoiy dalil bo'ladi

Kamchiligi: mijoz bilan muloqot kanal ichida bo'lmaydi.

## Guruh — muloqot va jamoa

Guruhda hamma yozadi. Bu foydali bo'lishi mumkin (jonli savol-javob, mijoz sharhlari), lekin boshqarish talab qiladi: spam, keraksiz bahs, raqobatchilarning reklamasi. Kichik savdo uchun odatda shart emas.

## Bot — buyurtmani tartibga soluvchi

Bot kerak bo'ladigan payt aniq: buyurtma soni qo'lda uddalab bo'lmaydigan darajaga yetganda. Bot nima qiladi:

- buyurtmani standart shaklda qabul qiladi (model, razmer, telefon)
- ma'lumotni bitta joyga yig'adi
- adminga xabar yuboradi
- takroriy savollarga avtomatik javob beradi

Agar kuniga 5 ta buyurtma bo'lsa, bot shart emas. 30 ta bo'lsa — botsiz xato qilasiz.

## Amaliy tartib

1. **Kanaldan boshlang.** Muntazam post, aniq narx, o'lchov jadvali.
2. **Shaxsiy yozishmada soting.** Boshida bu yetarli va eng ishonchli.
3. **Hajm oshgach bot qo'shing.** Buyurtma shakli va bazasi bilan.
4. **Sayt qo'shing.** Google va Yandexdan trafik Telegramga kirmaydi — sayt shu bo'shliqni yopadi.

## Kanalda nima post qilish kerak

Faqat mahsulot posti kanalni zerikarli qiladi. Ishlaydigan aralashma: yangi model, narx bilan; kiyish variantlari; mijoz sharhi; sexdan kadrlar; mavsumiy maslahat.

## Tez-tez so'raladigan savollar

**Kanal va guruhni birga yuritsa bo'ladimi?**
Bo'ladi, lekin guruh boshqaruvga vaqt talab qiladi.

**Botni o'zim yasay olamanmi?**
Oddiy buyurtma boti uchun tayyor yechimlar bor, dasturchi shart emas.

**Kanal obunachisi qancha bo'lishi kerak?**
Raqamdan ko'ra faollik muhim: 1 000 faol obunachi 10 000 jim obunachidan ko'ra ko'proq sotadi.

*Oltinoy Collection modellari har kuni kanalda va saytda yangilanadi. [Katalog](/katalog) · [aloqa](/aloqa).*`,
    contentRu: `Большая часть торговли одеждой в Узбекистане идёт в Telegram. Но на вопрос «достаточно канала или нужен бот?» многие отвечают неверно и тратят время на лишнее.

## Канал — основная витрина

Канал односторонний: вы публикуете, подписчики читают. Для торговли одеждой это главный инструмент:

- порядок публикаций контролируете вы
- старые посты работают как каталог
- число подписчиков — социальное доказательство

Минус: общение с клиентом происходит не в канале.

## Группа — общение и сообщество

В группе пишут все. Это бывает полезно (живые вопросы, отзывы), но требует модерации: спам, споры, реклама конкурентов. Для небольшой торговли обычно не нужна.

## Бот — упорядочивает заказы

Момент, когда нужен бот, вполне определённый: когда количество заказов перестаёт обрабатываться вручную. Что делает бот:

- принимает заказ в стандартной форме (модель, размер, телефон)
- собирает данные в одно место
- уведомляет администратора
- отвечает на повторяющиеся вопросы

Если заказов 5 в день — бот не нужен. Если 30 — без него будут ошибки.

## Практический порядок

1. **Начните с канала.** Регулярные посты, понятная цена, размерная таблица.
2. **Продавайте в личной переписке.** На старте этого достаточно и это надёжнее всего.
3. **С ростом добавьте бота.** С формой заказа и базой.
4. **Добавьте сайт.** Трафик из Google и Яндекса в Telegram не заходит — сайт закрывает этот разрыв.

## Что публиковать в канале

Только товарные посты делают канал скучным. Рабочая смесь: новая модель с ценой; варианты сочетаний; отзыв клиента; кадры из цеха; сезонный совет.

## Частые вопросы

**Можно ли вести канал и группу одновременно?**
Можно, но группа требует времени на модерацию.

**Смогу ли я сделать бота сам?**
Для простого бота заказов есть готовые решения, программист не обязателен.

**Сколько нужно подписчиков?**
Важнее активность: 1 000 активных продают больше, чем 10 000 молчащих.

*Модели Oltinoy Collection обновляются каждый день в канале и на сайте. [Каталог](/ru/katalog) · [контакты](/ru/aloqa).*`,
  },
  {
    slug: "qora-abaya-nega-har-doim-trendda",
    titleUz: "Qora abaya nega har doim trendda: 7 sabab va tanlash mezonlari",
    titleRu: "Почему чёрная абайя всегда в тренде: 7 причин и критерии выбора",
    excerptUz:
      "Qora abaya nima uchun hech qachon modadan chiqmaydi, qanday matolar unga mos keladi va sifatli qora abayani qanday ajratish mumkin.",
    excerptRu:
      "Почему чёрная абайя не выходит из моды, какие ткани ей подходят и как отличить качественную модель.",
    publishedAt: "2026-10-24",
    contentUz: `Kolleksiyalar almashadi, ranglar o'zgaradi, lekin qora abaya har mavsumda sotiladi. Bu tasodif emas — uning ortida amaliy sabablar bor.

## 1. Har narsa bilan mos tushadi

Qora ro'mol, sumka va poyabzalning istalgan rangi bilan uyg'unlashadi. Mijoz uni sotib olayotganda "buni nima bilan kiyaman?" degan savolni bermaydi — bu sotuvni tezlashtiradi.

## 2. Qomatni tinch ko'rsatadi

Qora rang siluetni yumshatadi va ortiqcha e'tiborni tortmaydi. To'liq qomatli ayollar uchun eng ko'p so'raladigan rang aynan shu.

## 3. Rasmiy va kundalik o'rtasida turadi

Ishga ham, mehmonga ham, kundalik yurishga ham yaroqli. Bitta libos bir nechta vaziyatni yopadi.

## 4. Kir bo'lgani kam bilinadi

Amaliy jihat, lekin sotuvda juda muhim — ayniqsa bolali ayollar uchun.

## 5. Bezak bilan oson o'zgaradi

Bir xil qora asos: kashta qo'shilsa bayramona, toshli yeng qo'shilsa kechki, sodda qoldirilsa kundalik bo'ladi.

## 6. Mavsumdan tashqarida

Yozgi yengil shifon ham, qishki zichroq mato ham qora rangda bir xil yaxshi ko'rinadi.

## 7. Optomchi uchun eng xavfsiz zaxira

Qora abaya omborda qolib ketmaydi. Shuning uchun assortimentning asosiy qismida u doim bo'ladi.

## Sifatli qora abayani qanday ajratish

Qora matoda kamchilik ko'zga kamroq tashlanadi, shuning uchun tekshiruv muhimroq:

- **Yorug'likka tuting.** Arzon qora mato yorug'likda siyrak ko'rinadi.
- **Chokni ichkaridan ko'ring.** Qora ip bilan qilingan qo'pol chok tashqaridan bilinmaydi, lekin tez so'kiladi.
- **Rang chuqurligi.** Sifatsiz bo'yoq "kul rang tortgan qora" beradi va birinchi yuvishdan keyin yanada ochiladi.
- **Ikki donani yonma-yon qo'ying.** Bir partiya ichida tovlanish bo'lmasligi kerak.

## Qanday matolar qora abayaga mos

Kundalik uchun — nafas oladigan, kam g'ijimlanadigan matolar. Bayram uchun — yengil tovlanishi bor yoki bezakli variantlar. Qishda zichroq mato qulay.

## Tez-tez so'raladigan savollar

**Qora abaya yozda issiq emasmi?**
Rang emas, mato hal qiladi. Yengil va nafas oladigan matoda yozda ham qulay.

**Qora rang o'chib ketadimi?**
Sifatli bo'yoqda deyarli yo'q. Teskari ag'darib, sovuq suvda yuvish rangni saqlaydi.

**Optomda qora ulushi qancha bo'lishi kerak?**
Abaya kategoriyasida odatda eng katta ulush qorada bo'ladi.

*Oltinoy Collection abayalari o'z seximizda tikiladi. [Abayalar](/katalog/abaya) · [to'plamlar](/katalog/toplam) · [aloqa](/aloqa).*`,
    contentRu: `Коллекции меняются, цвета обновляются, а чёрная абайя продаётся каждый сезон. Это не случайность — за этим стоят практические причины.

## 1. Сочетается со всем

Чёрный подходит к платку, сумке и обуви любого цвета. Покупательница не задаёт вопрос «с чем это носить» — и решение принимается быстрее.

## 2. Спокойно показывает силуэт

Чёрный смягчает линии и не притягивает лишнее внимание. Для полного телосложения это самый спрашиваемый цвет.

## 3. Между официальным и повседневным

Подходит и на работу, и в гости, и на каждый день. Одна вещь закрывает несколько ситуаций.

## 4. Меньше заметны загрязнения

Практическая деталь, но в продажах очень важная — особенно для женщин с детьми.

## 5. Легко меняется за счёт отделки

Одна чёрная база: с вышивкой — праздничная, с камнями на рукавах — вечерняя, без отделки — повседневная.

## 6. Вне сезона

И лёгкий летний шифон, и плотная зимняя ткань в чёрном смотрятся одинаково хорошо.

## 7. Самый безопасный запас для оптовика

Чёрная абайя не зависает на складе. Поэтому она всегда есть в базовой части ассортимента.

## Как отличить качественную чёрную абайю

На чёрной ткани недостатки заметны хуже, поэтому проверка важнее:

- **На просвет.** Дешёвая чёрная ткань просвечивает.
- **Шов изнутри.** Грубый шов чёрной ниткой снаружи не виден, но быстро расходится.
- **Глубина цвета.** Плохая краска даёт «серо-чёрный» и после первой стирки светлеет ещё сильнее.
- **Две единицы рядом.** Внутри партии разнотона быть не должно.

## Какие ткани подходят

Для повседневной носки — дышащие, мало мнущиеся. Для праздника — с лёгким блеском или отделкой. Зимой удобнее плотнее.

## Частые вопросы

**Не жарко ли в чёрной абайе летом?**
Решает не цвет, а ткань. В лёгкой дышащей ткани комфортно и летом.

**Выцветает ли чёрный?**
При качественной краске почти нет. Стирка наизнанку в холодной воде сохраняет цвет.

**Какая доля чёрного должна быть в опте?**
В категории абайя обычно наибольшая доля именно у чёрного.

*Абайи Oltinoy Collection шьются в собственном цехе. [Абайи](/ru/katalog/abaya) · [комплекты](/ru/katalog/toplam) · [контакты](/ru/aloqa).*`,
  },
  {
    slug: "rumol-orash-usullari",
    titleUz: "Ro'mol o'rash usullari: kundalik va bayram uchun 8 ta oson usul",
    titleRu: "Способы завязывания платка: 8 простых вариантов на каждый день и праздник",
    excerptUz:
      "Rumol o'rashning sodda usullari: kundalik, ishga, to'yga va sovuq havoga mos variantlar hamda ro'mol sirpanmasligi uchun maslahatlar.",
    excerptRu:
      "Простые способы завязывания платка: на каждый день, на работу, на праздник и в холод, плюс советы, чтобы платок не скользил.",
    publishedAt: "2026-10-30",
    contentUz: `Ro'mol o'rash — mashq bilan bir necha daqiqaga tushadigan ish. Quyida kundalik hayotda eng ko'p ishlatiladigan usullar, murakkabligi bo'yicha tartiblangan.

## Tayyorgarlik: ikkita narsa hal qiladi

**Ostki bandaj (podshapka).** Sochni yig'ib turadi va ro'molning sirpanishini kamaytiradi. Ro'mol tinmay tushayotgan bo'lsa, sabab deyarli har doim shu.

**To'g'ri mato.** Silliq atlas chiroyli, lekin sirpanadi. Kundalik uchun biroz g'adir-budur yuzali mato (paxta aralash, shifon) ancha qulay.

## 1. Eng sodda: ikki uchni orqaga

To'rtburchak ro'molni uchburchak qilib buklang, boshga qo'ying, ikki uchni iyak ostidan o'tkazib orqaga tugmalang yoki tugib qo'ying. 30 soniya. Kundalik yurish uchun.

## 2. Bir tomonga tashlash

Bir uchini kalta, ikkinchisini uzun qoldiring. Uzun uchni iyak ostidan aylantirib yelkaga tashlang. Bo'yin yopiq bo'ladi, ko'rinishi yengil.

## 3. Ikki qavat (sovuq uchun)

Yupqa ro'molni ikki qavat o'rang yoki ostiga yupqa ro'mol, ustiga zichrog'ini qo'ying. Qishda bo'yin va quloqni yopadi.

## 4. Turban uslubi

Uzun to'g'ri burchakli ro'mol bilan: uchlarni boshga aylantirib, tepada yoki yon tomonda tugib qo'ying. Ishga va rasmiy joylarga mos, sochni to'liq yig'adi.

## 5. Yelkani yopadigan uzun o'ram

Katta o'lchamli ro'molni bir uchi ko'krakni, ikkinchisi yelkani yopadigan qilib o'rang. Abaya bilan yaxshi ko'rinadi.

## 6. Yon tomondan burma

Bir uchni yuz atrofida yumshoq burma hosil qilib qo'ying va nina bilan mahkamlang. To'y va marosimlarga mos.

## 7. Ikki rangli kombinatsiya

Ostiga bir rang, ustiga boshqa rang — chekkasi ko'rinib turadi. Oddiy libosni jonlantiradi.

## 8. Tayyor to'plam bilan

Ko'ylak bilan bir matodan tikilgan ro'mol eng oson yechim: rang tanlash shart emas, o'ram ham sodda bo'ladi.

## Ro'mol tushib qolmasligi uchun

- ostki bandaj kiying
- 2–3 ta nina ishlating (ko'rinmaydigan joyga)
- sirpanadigan matoni kundalik uchun tanlamang
- ro'mol o'lchami bo'y va yelka kengligiga mos bo'lsin

## Tez-tez so'raladigan savollar

**Qaysi o'lcham qulay?**
Kundalik uchun o'rta o'lcham, marosim uchun kattaroq — u yelkani ham yopadi.

**Yozda qaysi mato salqinroq?**
Yengil, nafas oladigan paxta aralash matolar.

**Ko'ylak bilan bir xil ro'mol qayerdan olinadi?**
To'plam sifatida tikilgan modellarda ro'mol ko'ylak bilan birga keladi.

*Oltinoy Collection to'plamlarida ro'mol libos bilan bir matodan tikiladi. [To'plamlar](/katalog/toplam) · [ro'mollar](/katalog/rumol) · [aloqa](/aloqa).*`,
    contentRu: `Завязывание платка — навык, который после нескольких повторений занимает пару минут. Ниже самые используемые способы, от простого к сложному.

## Подготовка: решают две вещи

**Подшапка.** Держит волосы и уменьшает скольжение. Если платок постоянно съезжает, причина почти всегда в этом.

**Правильная ткань.** Гладкий атлас красив, но скользит. Для повседневной носки удобнее слегка шероховатая ткань (хлопок с примесью, шифон).

## 1. Самый простой: два конца назад

Квадратный платок сложите треугольником, накиньте, концы проведите под подбородком и закрепите сзади. 30 секунд. Для повседневных дел.

## 2. Один конец на плечо

Один конец короче, другой длиннее. Длинный проведите под подбородком и перекиньте на плечо. Шея закрыта, вид лёгкий.

## 3. В два слоя (для холода)

Тонкий платок в два оборота или тонкий снизу и плотный сверху. Зимой закрывает шею и уши.

## 4. Тюрбан

Длинным прямоугольным платком: концы обернуть вокруг головы и завязать сверху или сбоку. Подходит для работы и официальных мест.

## 5. Длинная драпировка на плечо

Большой платок укладывается так, что один конец закрывает грудь, другой плечо. Хорошо смотрится с абайей.

## 6. Складка сбоку

Один конец уложить мягкой складкой у лица и закрепить булавкой. Подходит для торжеств.

## 7. Двухцветное сочетание

Снизу один цвет, сверху другой — видна кромка. Оживляет простой наряд.

## 8. Готовый комплект

Платок из той же ткани, что и платье, — самое простое решение: не нужно подбирать цвет, укладка проще.

## Чтобы платок не съезжал

- носите подшапку
- используйте 2–3 булавки в незаметных местах
- не берите скользящую ткань на каждый день
- размер платка должен подходить под рост и ширину плеч

## Частые вопросы

**Какой размер удобнее?**
Средний на каждый день, побольше — на торжество: он закрывает и плечи.

**Какая ткань прохладнее летом?**
Лёгкие дышащие ткани с хлопком.

**Где взять платок в тон платью?**
В моделях, сшитых комплектом, платок идёт вместе с платьем.

*В комплектах Oltinoy Collection платок шьётся из той же ткани. [Комплекты](/ru/katalog/toplam) · [платки](/ru/katalog/rumol) · [контакты](/ru/aloqa).*`,
  },
  {
    slug: "gulli-koylak-qanday-tanlash-va-kombinatsiya",
    titleUz: "Gulli ko'ylak qanday tanlanadi va nima bilan kiyiladi",
    titleRu: "Как выбрать платье в цветочек и с чем его носить",
    excerptUz:
      "Gulli ko'ylakda naqsh o'lchami, fon rangi va qomat uyg'unligi qanday ishlaydi, ro'mol va ustki kiyim bilan kombinatsiya qoidalari.",
    excerptRu:
      "Как работают размер принта, цвет фона и сочетание с фигурой, правила комбинации с платком и верхней одеждой.",
    publishedAt: "2026-10-27",
    contentUz: `Gulli ko'ylak — katalogdagi eng tez sotiladigan toifalardan biri, lekin eng ko'p "rasmda boshqacha ko'rindi" deb qaytariladigani ham shu. Sabab odatda naqsh o'lchamida.

## Naqsh o'lchami qomatga qanday ta'sir qiladi

- **Mayda gul** — qomatni tinch ko'rsatadi, hamma bo'yga mos, kundalik uchun eng xavfsiz tanlov.
- **O'rta gul** — eng ko'p sotiladigan oraliq, ko'zga tashlanadi lekin ortiqcha emas.
- **Yirik gul** — e'tiborni tortadi va hajm qo'shadi. Baland bo'yli va to'liqroq qomatda yaxshi o'tiradi, past bo'yda esa siluetni "bo'lib" yuborishi mumkin.

## Fon rangi naqshdan muhimroq

Xaridorlar naqshga qaraydi, amalda esa fon hal qiladi. Qora yoki to'q fon ustidagi gul har doim vazminroq va universal. Oq yoki sutli fon yengil va bahorona ko'rinadi, lekin kir tezroq bilinadi.

## Nima bilan kiyiladi

Asosiy qoida: **bitta naqsh yetarli**. Gulli ko'ylakka sodda ro'mol, gulli ro'molga sodda ko'ylak. Ikkalasi ham naqshli bo'lsa, ko'z charchaydi.

Ro'mol rangini tanlashda: ko'ylakdagi eng kichik rangni oling. Masalan, qora fonda xantal gullar bo'lsa, xantal ro'mol butun ko'rinishni bog'laydi.

## Ustki kiyim

Gulli ko'ylak ustiga bir rangli jilet, kardigan yoki ochiq abaya juda yaxshi tushadi — naqsh qisman yopiladi va ko'rinish rasmiylashadi. Ishga kiyish uchun eng oson usul shu.

## Mavsum bo'yicha

Yozda — yengil matoda mayda gul, ochiq fon. Kuz-qishda — to'q fon, zichroq mato, kamroq kontrast. Kuzgi kolleksiyalarda xantal, bordo va to'q yashil fonlar ko'p uchraydi.

## Optomchi uchun eslatma

Gulli modelda razmerni tor olmang: naqsh cho'zilganda buziladi va bu ayniqsa yirik gulda ko'rinadi. 50–54 razmerni to'liqroq oling.

## Tez-tez so'raladigan savollar

**Gulli ko'ylak to'liq qomatga mos keladimi?**
Ha — mayda yoki o'rta gul, to'q fon va tik tushadigan fason tanlansa.

**Rasmdagi rang bilan haqiqiy rang farq qiladimi?**
Ekran sozlamalariga qarab biroz farq bo'lishi mumkin. Shuning uchun tavsifdagi rang nomiga ham qarang.

**Gulli ko'ylakni to'yga kiysa bo'ladimi?**
Bo'ladi — bezakli mato yoki yirikroq naqshli variant marosimga mos tushadi.

*Oltinoy Collection katalogida gulli modellar muntazam yangilanadi. [Ko'ylaklar](/katalog/koylak) · [to'plamlar](/katalog/toplam) · [aloqa](/aloqa).*`,
    contentRu: `Платье в цветочек — одна из самых продаваемых категорий, но и самая частая по возвратам «на фото выглядело иначе». Причина обычно в размере принта.

## Как размер принта влияет на фигуру

- **Мелкий цветок** — спокойно смотрится, подходит любому росту, самый безопасный выбор.
- **Средний цветок** — самый продаваемый вариант: заметно, но не избыточно.
- **Крупный цветок** — притягивает внимание и добавляет объём. Хорошо садится на высоких и более полных, на невысоком росте может «разрезать» силуэт.

## Цвет фона важнее принта

Покупатели смотрят на цветы, но решает фон. Цветы на чёрном или тёмном фоне всегда сдержаннее и универсальнее. Белый и молочный фон выглядит легко и по-весеннему, но быстрее пачкается.

## С чем носить

Главное правило: **одного принта достаточно**. К платью в цветочек — однотонный платок, к цветному платку — однотонное платье. Если узор и там, и там, глаз устаёт.

При выборе платка берите самый мелкий цвет из платья. Например, если на чёрном фоне горчичные цветы, горчичный платок соберёт образ.

## Верхняя одежда

Однотонный жилет, кардиган или открытая абайя поверх цветочного платья смотрятся очень хорошо — принт частично закрывается, образ становится строже. Это самый простой способ надеть его на работу.

## По сезонам

Летом — мелкий цветок на лёгкой ткани, светлый фон. Осенью и зимой — тёмный фон, плотнее ткань, меньше контраста. В осенних коллекциях часто встречаются горчичный, бордовый и тёмно-зелёный фоны.

## Заметка для оптовика

Не берите цветочные модели впритык по размеру: при натяжении принт искажается, особенно крупный. Размеры 50–54 берите полнее.

## Частые вопросы

**Подходит ли цветочное платье полной фигуре?**
Да — при мелком или среднем принте, тёмном фоне и прямом крое.

**Отличается ли реальный цвет от фото?**
Возможна небольшая разница из-за настроек экрана. Смотрите и на название цвета в описании.

**Можно ли надеть его на торжество?**
Можно — вариант из нарядной ткани или с более крупным принтом подойдёт.

*Цветочные модели в каталоге Oltinoy Collection обновляются регулярно. [Платья](/ru/katalog/koylak) · [комплекты](/ru/katalog/toplam) · [контакты](/ru/aloqa).*`,
  },
  {
    slug: "qishki-hijob-kiyimlar-issiq-matolar",
    titleUz: "Qishki hijob kiyimlar: issiq, yopiq va bejirim qolish uchun mato tanlovi",
    titleRu: "Зимняя одежда для хиджаба: как выбрать тёплую ткань и остаться аккуратной",
    excerptUz:
      "Qishda yopiq kiyinishda qaysi matolar issiq saqlaydi, qatlamli kiyinish qanday ishlaydi va qishki abaya tanlashda nimaga qarash kerak.",
    excerptRu:
      "Какие ткани греют зимой, как работает многослойность и на что смотреть при выборе зимней абайи.",
    publishedAt: "2026-11-02",
    contentUz: `Qishda yopiq kiyinishning qiyinligi — issiq bo'lish bilan bejirim ko'rinish o'rtasida muvozanat topish. Qalin palto ostida uzun ko'ylak burishadi, yengil libosda esa sovuq o'tadi. Yechim matoda va qatlamda.

## Qatlamli kiyinish qoidasi

Uch qatlam eng yaxshi ishlaydi:

1. **Ichki qatlam** — terini quruq saqlaydi. Yupqa paxta asosli ichki kiyim.
2. **Asosiy qatlam** — issiqlikni ushlaydi. Zichroq mato yoki ostiga astarli ko'ylak.
3. **Tashqi qatlam** — shamol va namdan himoya. Palto yoki qalin abaya.

Bitta juda qalin qatlamdan ko'ra uchta yupqa qatlam yaxshiroq isitadi va harakatni cheklamaydi.

## Qishga mos matolar

- **Zich trikotaj** — issiq, cho'ziladi, harakatga xalaqit bermaydi.
- **Astarli mato** — ichki qatlam qo'shilgani uchun issiqroq va tanaga yopishmaydi.
- **Jun aralashmali matolar** — issiq, lekin ba'zilarda tirnash bo'lishi mumkin; ichiga yupqa ko'ylak kerak.
- **Qalin paxta (XB)** — nafas oladi, elektrlanmaydi, kundalik uchun qulay.

## Nimadan ehtiyot bo'lish kerak

**Sintetik zich matolar** issiq tuyuladi, lekin nafas olmaydi: ichkarida terlash, tashqarida sovqotish paydo bo'ladi. **Juda silliq matolar** statik elektr yig'adi va ro'mol sirpanadi.

## Qishki abaya tanlash

- Yeng kengligi: ostiga sviter kirishi kerak.
- Uzunlik: etak sal kaltaroq bo'lsa, qorli yo'lda amaliyroq.
- Old tugmali yoki ochiq fason: kirib-chiqishda qulay.
- To'q ranglar amaliyroq — qishda kir tezroq bilinadi.

## Ro'mol va sovuq

Qishda yupqa sirpanadigan ro'mol noqulay. Zichroq mato tanlang, ostidan bandaj kiying va quloqni yopadigan o'ram usulini ishlating.

## Optomchi uchun mavsumiy eslatma

Qishki partiya odatda oktyabrda olinadi. Kechiktirilsa, eng ko'p so'raladigan razmerlar (50–54) tugab qoladi. Qishda to'q ranglar ulushini oshiring.

## Tez-tez so'raladigan savollar

**Qishda qora abaya sovuqmi?**
Rang emas, mato zichligi va astar hal qiladi.

**Uzun ko'ylak ostiga nima kiyish mumkin?**
Termo ichki kiyim yoki paxta leggins — shakl buzilmaydi.

**Qishki liboslarni qanday yuvish kerak?**
Zich matolarni sovuq suvda, teskari ag'darib. Jun aralashmasini quritgichga solmang.

*Oltinoy Collection kuz-qish modellari: [abayalar](/katalog/abaya) · [to'plamlar](/katalog/toplam) · [aloqa](/aloqa).*`,
    contentRu: `Сложность закрытой одежды зимой — найти баланс между теплом и аккуратным видом. Под плотным пальто длинное платье мнётся, а в лёгком становится холодно. Решение — в ткани и слоях.

## Правило многослойности

Лучше всего работают три слоя:

1. **Внутренний** — держит кожу сухой. Тонкое бельё на хлопковой основе.
2. **Основной** — удерживает тепло. Плотная ткань или платье на подкладке.
3. **Внешний** — защита от ветра и влаги. Пальто или плотная абайя.

Три тонких слоя греют лучше одного очень плотного и не сковывают движение.

## Ткани для зимы

- **Плотный трикотаж** — тёплый, тянется, не мешает двигаться.
- **Ткань на подкладке** — теплее за счёт второго слоя и не липнет к телу.
- **Смеси с шерстью** — тёплые, но могут колоться; под них нужна тонкая основа.
- **Плотный хлопок** — дышит, не электризуется, удобен на каждый день.

## Чего избегать

**Плотная синтетика** кажется тёплой, но не дышит: внутри жарко, на улице холодно. **Очень гладкие ткани** накапливают статику, и платок скользит.

## Как выбрать зимнюю абайю

- Ширина рукава: под неё должен входить свитер.
- Длина: чуть короче практичнее на снегу.
- Фасон на пуговицах или открытый: удобнее надевать.
- Тёмные цвета практичнее — зимой грязь заметнее.

## Платок и холод

Тонкий скользящий платок зимой неудобен. Возьмите плотнее, наденьте подшапку и используйте укладку, закрывающую уши.

## Сезонная заметка для оптовика

Зимняя партия обычно закупается в октябре. При задержке ходовые размеры (50–54) заканчиваются. Зимой увеличьте долю тёмных цветов.

## Частые вопросы

**Холодно ли зимой в чёрной абайе?**
Решает не цвет, а плотность ткани и подкладка.

**Что надеть под длинное платье?**
Термобельё или хлопковые леггинсы — силуэт не портится.

**Как стирать зимние вещи?**
Плотные ткани — в холодной воде, наизнанку. Смеси с шерстью не сушить в сушилке.

*Осенне-зимние модели Oltinoy Collection: [абайи](/ru/katalog/abaya) · [комплекты](/ru/katalog/toplam) · [контакты](/ru/aloqa).*`,
  },
  {
    slug: "namazbop-koylak-qanday-bolishi-kerak",
    titleUz: "Namazbop ko'ylak qanday bo'lishi kerak: amaliy mezonlar",
    titleRu: "Каким должно быть платье для намаза: практические критерии",
    excerptUz:
      "Namazga qulay ko'ylak tanlashda uzunlik, yeng, yoqa, mato va kengligi bo'yicha amaliy mezonlar hamda namazlik to'plamlar haqida.",
    excerptRu:
      "Практические критерии выбора платья для намаза: длина, рукав, горловина, ткань и свобода кроя, а также о молитвенных комплектах.",
    publishedAt: "2026-11-05",
    contentUz: `Namazbop libos — alohida "diniy" fason emas, balki bir nechta aniq amaliy shartga javob beradigan oddiy ko'ylak. Quyida shu shartlar.

## 1. Uzunlik

Ko'ylak tik turganda ham, sajdaga borganda ham to'piqni yopib turishi kerak. Sinash usuli oddiy: kiyib turib cho'kkalab ko'ring — etak ko'tarilib oyoq ochilmasa, uzunlik yetarli.

## 2. Yeng

Bilakni to'liq yopadigan, harakatda ko'tarilib ketmaydigan yeng kerak. Juda keng yeng sajdada yerga tegadi va yig'ilib qoladi — o'rta kenglik qulayroq. Rezinkali yoki manjetli yeng eng amaliy variant.

## 3. Yoqa va ko'krak qismi

Egilganda ochilib ketmaydigan yoqa muhim. Chuqur V yoki keng yoqali modelga ostidan yupqa ichki ko'ylak kerak bo'ladi.

## 4. Kenglik

Tor ko'ylak ruku va sajdada qomat shaklini ko'rsatib qo'yadi. Tik tushadigan yoki pastga qarab kengayadigan fason qulayroq. Bel bo'yidagi qattiq kamar harakatni cheklaydi.

## 5. Mato

- nafas oladigan bo'lsin — namoz vaqtida issiq bo'lmasligi uchun
- yorug'likda siyrak ko'rinmasin
- kam g'ijimlanadigan bo'lsin — sajdadan keyin tez tiklanishi kerak
- silliq sirpanuvchi matolar ro'molni ushlab turmaydi

## 6. Harakatda tekshirish

Xarid qilishdan oldin uchta harakatni sinang: qo'lni yuqoriga ko'tarish, oldinga egilish, cho'kkalash. Uchalasida ham teri va ichki kiyim ko'rinmasa — libos namazga mos.

## Namazlik to'plam (yalpi libos) haqida

Bir bo'lakli yalpi namazlik tez kiyiladi va mehmonda yoki ishda qulay. Kundalik kiyim sifatida esa uzun ko'ylak amaliyroq — ikkalasi bir-birini almashtirmaydi, to'ldiradi.

## Optomchi uchun eslatma

Namazbop deb sotiladigan modellarda uzunlik va yeng eng ko'p tekshiriladigan parametr. Tavsifda aniq uzunlik va yeng turini yozib qo'ysangiz, qaytarish kamayadi.

## Tez-tez so'raladigan savollar

**Oddiy uzun ko'ylak namazga yaraydimi?**
Ha, agar u yuqoridagi beshta shartga javob bersa.

**Namazlik ostiga nima kiyiladi?**
Odatdagi kiyim; muhimi yengi va uzunligi yetarli bo'lsin.

**Qaysi rang tanlash kerak?**
Cheklov yo'q. Amaliy jihatdan to'q va sodda ranglar kam kir bo'ladi.

*Oltinoy Collection uzun va keng fasonli ko'ylaklar tikadi. [Ko'ylaklar](/katalog/koylak) · [abayalar](/katalog/abaya) · [aloqa](/aloqa).*`,
    contentRu: `Платье для намаза — не особый «религиозный» фасон, а обычное платье, отвечающее нескольким практическим условиям. Ниже — эти условия.

## 1. Длина

Платье должно закрывать щиколотки и стоя, и в земном поклоне. Простая проверка: присядьте в нём — если подол не поднимается и ноги не открываются, длины достаточно.

## 2. Рукав

Нужен рукав, полностью закрывающий запястье и не задирающийся при движении. Очень широкий рукав касается пола в поклоне и сминается — удобнее средняя ширина. Резинка или манжета — самый практичный вариант.

## 3. Горловина и грудь

Важно, чтобы при наклоне вырез не открывался. Под модель с глубоким V или широкой горловиной понадобится тонкая нижняя основа.

## 4. Свобода кроя

Узкое платье в поклоне обрисовывает фигуру. Удобнее прямой или расширяющийся книзу крой. Жёсткий пояс по талии ограничивает движение.

## 5. Ткань

- дышащая — чтобы не было жарко во время молитвы
- не просвечивающая на свету
- мало мнущаяся — должна быстро расправляться
- гладкие скользящие ткани плохо держат платок

## 6. Проверка в движении

Перед покупкой проверьте три движения: поднять руки, наклониться вперёд, присесть. Если ни в одном не видно кожи и белья — платье подходит.

## О молитвенных комплектах

Цельный молитвенный комплект надевается быстро и удобен в гостях или на работе. Как повседневная одежда практичнее длинное платье — они не заменяют, а дополняют друг друга.

## Заметка для оптовика

В моделях, которые продаются как молитвенные, чаще всего проверяют длину и рукав. Если указать их точно в описании, возвратов будет меньше.

## Частые вопросы

**Подойдёт ли обычное длинное платье?**
Да, если оно отвечает пяти условиям выше.

**Что надевают под молитвенный комплект?**
Обычную одежду; важно, чтобы хватало длины и рукава.

**Какой цвет выбрать?**
Ограничений нет. Практично — тёмные и простые цвета.

*Oltinoy Collection шьёт длинные платья свободного кроя. [Платья](/ru/katalog/koylak) · [абайи](/ru/katalog/abaya) · [контакты](/ru/aloqa).*`,
  },
  {
    slug: "abaya-jilbab-chodra-farqi",
    titleUz: "Abaya, jilbab, chodra va hijob: farqi nimada?",
    titleRu: "Абайя, джильбаб, чадра и хиджаб: в чём разница?",
    excerptUz:
      "Yopiq kiyim turlarining nomlari ko'pincha aralashtiriladi. Abaya, jilbab, chodra, hijob va niqob o'rtasidagi farq — sodda va aniq tushuntirish.",
    excerptRu:
      "Названия видов закрытой одежды часто путают. Разница между абайей, джильбабом, чадрой, хиджабом и никабом — просто и понятно.",
    publishedAt: "2026-11-08",
    contentUz: `Bir xil libosni turli mintaqada turlicha ataydilar, shuning uchun chalkashlik tabiiy. Quyida eng ko'p uchraydigan atamalar va ular orasidagi amaliy farq.

## Hijob

Keng ma'noda — musulmon ayolning yopiq kiyinish tarzi. Tor ma'noda — sochni va bo'yinni yopadigan ro'mol. O'zbekistonda ko'pincha ikkinchi ma'noda ishlatiladi: "hijob taqdi" degani ro'mol o'radi degani.

## Abaya

Ustki libos — uzun, keng, ko'pincha old tomoni ochiladigan (tugma yoki zamok bilan) yoki yalpi kiyiladigan. Ostiga oddiy kiyim kiyiladi. Kelib chiqishi Arab yarim oroli bilan bog'liq. Bugun O'zbekistonda eng ommabop ustki yopiq libos shu.

## Jilbab

Ko'p manbalarda — butun tanani yopadigan uzun ustki libos. Amalda ko'pincha ikki qismli to'plamni bildiradi: uzun yuqori qism (bosh va yelkani yopadi) va uzun yubka. Abayadan farqi — yopilish darajasi ko'proq va odatda bosh qismi libosga birlashgan.

## Chodra

Bir bo'lak keng mato, boshdan yopiladi va oldi ochiq qoladi. Ko'proq Eron va unga yaqin mintaqalarda tarqalgan. Tugmasi va yengi yo'q — qo'l bilan ushlab turiladi.

## Niqob

Yuzni yopadigan qism, ko'z ochiq qoladi. Bu alohida libos emas, qo'shimcha element.

## Namazlik (yalpi namoz libosi)

Namoz uchun tez kiyiladigan bir yoki ikki bo'lakli libos. Ko'cha kiyimi sifatida emas, uy va mehmon uchun mo'ljallangan.

## Qisqa farq jadvali

- **Hijob** — ro'mol / umumiy kiyinish tarzi
- **Abaya** — uzun ustki libos, bosh qismi alohida
- **Jilbab** — uzun yopiq to'plam, bosh qismi ko'pincha birlashgan
- **Chodra** — ochiq oldi, qo'lda ushlanadigan yopqich
- **Niqob** — yuz qismi
- **Namazlik** — namoz uchun tez kiyiladigan libos

## Nomlar nega turlicha ishlatiladi

Atamalar mintaqaga qarab siljiydi: bir mamlakatda "jilbab" deb atalgan narsa boshqasida "abaya" deyiladi. Onlayn xarid qilayotganda nomga emas, **tavsif va o'lchamga** qarang: uzunlik, yeng turi, oldi ochiqmi, bosh qismi bormi.

## Tez-tez so'raladigan savollar

**Abaya ostiga nima kiyiladi?**
Odatdagi kiyim — ko'ylak yoki kofta-yubka. Ba'zi modellar baza ko'ylak bilan birga sotiladi.

**Abaya va jilbabning qaysi biri yopiqroq?**
Odatda jilbab, chunki unda bosh qismi libosga qo'shilgan bo'ladi.

**To'plam olganda ro'mol ham keladimi?**
Ba'zi to'plamlarda keladi va u libos bilan bir matodan tikiladi.

*Oltinoy Collection abaya va to'plamlari: [abayalar](/katalog/abaya) · [to'plamlar](/katalog/toplam) · [aloqa](/aloqa).*`,
    contentRu: `Одну и ту же вещь в разных регионах называют по-разному, поэтому путаница закономерна. Ниже — самые частые термины и практическая разница между ними.

## Хиджаб

В широком смысле — сам образ закрытой одежды мусульманки. В узком — платок, закрывающий волосы и шею. В Узбекистане чаще используется второе значение.

## Абайя

Верхнее длинное свободное одеяние, часто распашное (на пуговицах или молнии) либо цельное. Под неё надевается обычная одежда. Происхождение связано с Аравийским полуостровом. Сегодня в Узбекистане это самая популярная верхняя закрытая вещь.

## Джильбаб

Во многих источниках — длинное верхнее одеяние, закрывающее всё тело. На практике часто означает комплект из двух частей: длинный верх (закрывает голову и плечи) и длинная юбка. Отличие от абайи — большая степень закрытости и обычно объединённая с одеждой головная часть.

## Чадра

Цельное широкое полотно, накидывается на голову, спереди остаётся открытым. Распространена в Иране и близких регионах. Без застёжек и рукавов — придерживается руками.

## Никаб

Часть, закрывающая лицо, глаза остаются открытыми. Это не отдельная одежда, а дополнительный элемент.

## Молитвенный комплект

Одежда для намаза из одной или двух частей, надевается быстро. Рассчитана не на улицу, а на дом и гости.

## Краткая таблица различий

- **Хиджаб** — платок / общий образ
- **Абайя** — длинное верхнее одеяние, головная часть отдельно
- **Джильбаб** — длинный закрытый комплект, головная часть чаще объединена
- **Чадра** — открытое спереди покрывало, придерживается руками
- **Никаб** — лицевая часть
- **Молитвенный комплект** — одежда для намаза

## Почему названия используют по-разному

Термины смещаются по регионам: то, что в одной стране называют «джильбаб», в другой назовут «абайя». При онлайн-покупке смотрите не на название, а на **описание и замеры**: длина, тип рукава, распашная ли модель, есть ли головная часть.

## Частые вопросы

**Что надевают под абайю?**
Обычную одежду — платье или кофту с юбкой. Некоторые модели продаются с базовым платьем.

**Что закрытее — абайя или джильбаб?**
Обычно джильбаб, так как головная часть соединена с одеждой.

**Идёт ли платок в комплекте?**
В некоторых комплектах идёт и шьётся из той же ткани.

*Абайи и комплекты Oltinoy Collection: [абайи](/ru/katalog/abaya) · [комплекты](/ru/katalog/toplam) · [контакты](/ru/aloqa).*`,
  },
  {
    slug: "shifon-koylakni-yuvish-va-dazmollash",
    titleUz: "Shifon ko'ylakni yuvish va dazmollash: libos shaklini yo'qotmasligi uchun",
    titleRu: "Как стирать и гладить шифоновое платье, чтобы оно не потеряло форму",
    excerptUz:
      "Shifon, PRADO va boshqa nozik matolarni yuvish harorati, dazmol rejimi, quritish va saqlash bo'yicha amaliy qoidalar.",
    excerptRu:
      "Температура стирки, режим глажки, сушка и хранение шифона, PRADO и других тонких тканей — практические правила.",
    publishedAt: "2026-11-11",
    contentUz: `Shifon ko'ylak birinchi yuvishdan keyin "boshqa libosga aylanib qolishi" mumkin — cho'zilib ketadi, etagi qiyshayadi yoki rangi ochiladi. Deyarli hamma holatda sabab yuvish rejimida.

## Yuvishdan oldin

- Yorliqni o'qing — agar u bo'lsa, u eng ishonchli manba.
- Kiyimni **teskari ag'daring**. Bu rangni ham, bezakni ham saqlaydi.
- Zamok va tugmalarni yoping — ular matoni ilib yirtadi.
- Toshli yoki kashtali modelni to'r xaltaga soling.

## Harorat va rejim

Shifon va nozik matolar uchun:

- **Suv harorati:** 30 darajagacha, iloji bo'lsa sovuq.
- **Rejim:** nozik (delikat) yoki qo'lda yuvish.
- **Sig'im:** mashina to'la bo'lmasin — nozik mato siqilib g'ijimlanadi.
- **Siqish (otjim):** eng past tezlikda yoki umuman o'chirilgan holda.

Eng ko'p zarar aynan yuqori tezlikdagi siqishdan keladi.

## Qo'lda yuvish

Sovuq suvga yumshoq vosita qo'shing, kiyimni 10–15 daqiqa qo'yib turing, ishqalamasdan bir necha marta bosib-qo'yib yuboring, keyin chayqang. **Burab siqmang** — shifon tolasi buraganda uziladi va o'sha joy keyin bilinib turadi.

## Quritish

- Quritish mashinasiga solmang.
- Ilgichga osing (og'ir modelni yassi holda quriting — o'z og'irligidan cho'ziladi).
- To'g'ridan-to'g'ri quyoshda quritmang — rang ochiladi.
- Nam holida shaklini qo'lingiz bilan to'g'rilab qo'ying — dazmol ishi kamayadi.

## Dazmollash

- Dazmolni eng past haroratga qo'ying.
- **Teskari tomondan** dazmollang.
- Orasiga yupqa paxta mato qo'ying.
- Toshli va payetkali joylarga dazmol tegmasin — ular eriydi.
- Bug'li dazmol yoki bug' generatori shifon uchun eng xavfsiz variant.

## Saqlash

Uzun ko'ylak va abayani buklab emas, osib saqlang. Yelkasi keng ilgich ishlating — ingichka simli ilgich yelka joyida iz qoldiradi. Toshli modellarni bir-biriga tegmaydigan qilib joylang.

## Rang o'chmasligi uchun

Yangi to'q rangli liboslarni birinchi ikki yuvishda alohida yuving. Sovuq suv, teskari ag'darish va soyada quritish — rangni saqlaydigan uchta asosiy qoida.

## Tez-tez so'raladigan savollar

**Shifonni mashinada yuvsa bo'ladimi?**
Bo'ladi — nozik rejim, sovuq suv, past siqish va to'r xalta bilan.

**Dazmol izini qanday tuzatish mumkin?**
Yengil namlab, past haroratda teskari tomondan qayta dazmollang.

**Toshli abayani yuvsa bo'ladimi?**
Ehtiyot bilan qo'lda; ko'p modellar uchun quruq tozalash xavfsizroq.

*Oltinoy Collection modellarining mato tarkibi tavsifda ko'rsatilgan. [Katalog](/katalog) · [aloqa](/aloqa).*`,
    contentRu: `Шифоновое платье после первой стирки может «стать другой вещью» — вытянуться, перекоситься по низу или потерять цвет. Почти всегда причина в режиме стирки.

## Перед стиркой

- Прочитайте ярлык — если он есть, это самый надёжный источник.
- Выверните вещь **наизнанку**. Это сохраняет и цвет, и отделку.
- Застегните молнии и пуговицы — они цепляют и рвут ткань.
- Модель с камнями или вышивкой положите в сетчатый мешок.

## Температура и режим

Для шифона и тонких тканей:

- **Температура воды:** до 30 градусов, лучше холодная.
- **Режим:** деликатный или ручная стирка.
- **Загрузка:** машина не должна быть полной — тонкая ткань сминается.
- **Отжим:** на минимальных оборотах или выключен.

Больше всего вреда наносит именно отжим на высоких оборотах.

## Ручная стирка

В холодную воду добавьте мягкое средство, оставьте на 10–15 минут, несколько раз мягко прожмите без трения, затем прополощите. **Не выкручивайте** — волокно шифона рвётся, и это место потом видно.

## Сушка

- Не кладите в сушильную машину.
- Повесьте на плечики (тяжёлую модель сушите разложенной — она вытягивается под своим весом).
- Не сушите под прямым солнцем — цвет светлеет.
- Расправьте форму руками во влажном виде — глажки будет меньше.

## Глажка

- Минимальная температура.
- Гладьте **с изнанки**.
- Проложите тонкую хлопковую ткань.
- Не касайтесь утюгом камней и пайеток — они плавятся.
- Отпариватель для шифона — самый безопасный вариант.

## Хранение

Длинные платья и абайи храните на вешалке, а не сложенными. Используйте плечики с широкой перекладиной — тонкая проволочная оставляет след. Модели с камнями развешивайте так, чтобы они не тёрлись друг о друга.

## Чтобы цвет не сходил

Новые тёмные вещи первые две стирки стирайте отдельно. Холодная вода, изнанка и сушка в тени — три главных правила.

## Частые вопросы

**Можно ли стирать шифон в машине?**
Можно — деликатный режим, холодная вода, минимальный отжим и сетчатый мешок.

**Как убрать след от утюга?**
Слегка увлажнить и повторно прогладить с изнанки на низкой температуре.

**Можно ли стирать абайю с камнями?**
Осторожно и вручную; для многих моделей безопаснее химчистка.

*Состав ткани моделей Oltinoy Collection указан в описании. [Каталог](/ru/katalog) · [контакты](/ru/aloqa).*`,
  },
  {
    slug: "homilador-va-emizikli-onalar-uchun-yopiq-liboslar",
    titleUz: "Homilador va emizikli onalar uchun qulay yopiq liboslar",
    titleRu: "Удобная закрытая одежда для беременных и кормящих мам",
    excerptUz:
      "Homiladorlik va emizish davrida qanday fason, mato va o'lcham qulay bo'ladi, qaysi detallar kundalik hayotni osonlashtiradi.",
    excerptRu:
      "Какие фасоны, ткани и размеры удобны во время беременности и кормления и какие детали облегчают повседневность.",
    publishedAt: "2026-11-14",
    contentUz: `Homiladorlik davrida maxsus "homiladorlar uchun" yorlig'i bor libos sotib olish shart emas. Bir necha detalga qarab tanlangan oddiy yopiq ko'ylak ancha uzoq va qulay xizmat qiladi.

## Qaysi fasonlar qulay

- **Ko'krak ostidan kengayadigan fason (A-silueti).** Qorin o'sganda ham shakl buzilmaydi, tug'ruqdan keyin ham kiyish mumkin.
- **Tik tushadigan uzun ko'ylak.** Bel chizig'i yo'q, shuning uchun hech qayeri siqmaydi.
- **Old tomoni tugmali yoki ochiladigan modellar.** Emizish davri uchun eng amaliy yechim.
- **Ochiq abaya + ichki ko'ylak.** Ikki qatlam osongina moslashadi.

## Nimadan qochish kerak

- qattiq belbog' va tor bel chizig'i
- juda tor yeng (qo'l shishganda noqulay bo'ladi)
- orqasidagi uzun zamok — o'zi kiyish qiyin
- yorug'likda siyrak ko'rinadigan yupqa mato

## Mato tanlash

Bu davrda tana harorati o'zgaruvchan bo'ladi, shuning uchun **nafas oladigan matolar** muhim: paxta aralashmalari, yengil trikotaj, yumshoq PRADO. Zich sintetik matolar terlashni oshiradi. Biroz cho'ziladigan mato harakatni osonlashtiradi.

## O'lcham

Odatiy razmerdan bitta katta olish ko'p hollarda yetarli — ayniqsa kengayadigan fasonda. Ikki razmer katta olish esa yelka chizig'ini buzadi va libos "osilib" qoladi. Yelka va yeng o'z razmeringizda bo'lsin, kenglik esa pastda bo'lsin.

## Emizish davri uchun detallar

- oldi tugmali yoki ochiladigan yoqa
- yon tomondan tikilgan yashirin tirqishli modellar
- ikki qismli to'plamlar (yuqori qismini ko'tarish oson)
- to'q rang va mayda naqsh — dog' kam bilinadi

## Bir libos, uch davr

Yaxshi tanlangan kengayadigan ko'ylak homiladorlikda ham, emizish davrida ham, undan keyin ham kiyiladi. Bu — shu davrdagi eng tejamli yechim.

## Tez-tez so'raladigan savollar

**Oddiy abaya homiladorlikka to'g'ri keladimi?**
Ha, ochiq yoki keng fasonli bo'lsa. Tor belli modellar noqulay.

**Qaysi razmerni olay?**
Odatdagidan bitta katta, kengayadigan fasonda o'z razmeringiz ham yetishi mumkin.

**Qishda nima kiyish qulay?**
Qatlamli kiyinish: yupqa ichki qatlam va ustidan keng abaya.

*Oltinoy Collection keng fasonli va 56 razmergacha modellar tikadi. [Ko'ylaklar](/katalog/koylak) · [abayalar](/katalog/abaya) · [aloqa](/aloqa).*`,
    contentRu: `Во время беременности не обязательно покупать вещи с пометкой «для беременных». Обычное закрытое платье, выбранное по нескольким деталям, прослужит дольше и будет удобнее.

## Какие фасоны удобны

- **Расширяющийся от груди (силуэт А).** Форма не портится с ростом живота, и вещь носится после родов.
- **Прямое длинное платье.** Нет линии талии, ничего не сдавливает.
- **Модели на пуговицах спереди.** Самое практичное решение для периода кормления.
- **Открытая абайя плюс нижнее платье.** Два слоя легко подстраиваются.

## Чего избегать

- жёсткого пояса и узкой линии талии
- слишком узкого рукава (при отёках неудобно)
- длинной молнии на спине — трудно надеть самой
- тонкой ткани, которая просвечивает

## Выбор ткани

В этот период температура тела меняется, поэтому важны **дышащие ткани**: смеси с хлопком, лёгкий трикотаж, мягкий PRADO. Плотная синтетика усиливает потоотделение. Слегка тянущаяся ткань облегчает движение.

## Размер

Часто достаточно взять на размер больше — особенно в расширяющемся фасоне. Брать на два размера больше не стоит: нарушается линия плеча и вещь «висит». Плечо и рукав — по своему размеру, свобода — внизу.

## Детали для периода кормления

- застёжка или разрез спереди
- модели со скрытым боковым разрезом
- комплекты из двух частей (верх легко поднять)
- тёмный цвет и мелкий принт — пятна заметны меньше

## Одна вещь, три периода

Хорошо выбранное расширяющееся платье носится и во время беременности, и при кормлении, и после. Это самое экономное решение.

## Частые вопросы

**Подходит ли обычная абайя при беременности?**
Да, если она открытая или свободного кроя. Модели с узкой талией неудобны.

**Какой размер брать?**
На размер больше обычного; в расширяющемся фасоне может подойти и свой.

**Что удобно зимой?**
Многослойность: тонкий внутренний слой и свободная абайя сверху.

*Oltinoy Collection шьёт свободные фасоны до 56 размера. [Платья](/ru/katalog/koylak) · [абайи](/ru/katalog/abaya) · [контакты](/ru/aloqa).*`,
  },
];
