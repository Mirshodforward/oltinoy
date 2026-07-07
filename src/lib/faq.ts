import type { Locale } from "@/i18n/routing";

/**
 * Home FAQ — single source of truth for both the visible accordion and the
 * FAQPage JSON-LD (they must match exactly). Uzbek originals + Russian.
 */
export const FAQ: { uz: { q: string; a: string }; ru: { q: string; a: string } }[] = [
  {
    uz: {
      q: "Optom minimal buyurtma qancha?",
      a: "Har bir modelda minimal miqdor ko'rsatilgan; odatda 1 dona/razmerdan boshlab olish mumkin.",
    },
    ru: {
      q: "Какой минимальный оптовый заказ?",
      a: "Для каждой модели указано минимальное количество; обычно можно заказать от 1 шт./размер.",
    },
  },
  {
    uz: {
      q: "Bron qilsam nima bo'ladi?",
      a: "Saytda bron qoldirasiz, operatorimiz 1 ish kuni ichida telefon yoki Telegram orqali bog'lanib, buyurtmani tasdiqlaydi.",
    },
    ru: {
      q: "Что происходит после брони?",
      a: "Вы оставляете бронь на сайте, наш оператор в течение 1 рабочего дня связывается по телефону или в Telegram и подтверждает заказ.",
    },
  },
  {
    uz: {
      q: "Viloyatlarga yuborasizlarmi?",
      a: "Ha, O'zbekistonning barcha viloyatlariga yetkazib berish xizmatlari orqali yuboramiz.",
    },
    ru: {
      q: "Отправляете ли в регионы?",
      a: "Да, отправляем во все регионы Узбекистана через службы доставки.",
    },
  },
  {
    uz: {
      q: "To'lov qanday?",
      a: "Hozircha to'lov buyurtma tasdiqlangandan so'ng kelishilgan usulda amalga oshiriladi (naqd / karta orqali).",
    },
    ru: {
      q: "Как происходит оплата?",
      a: "Пока оплата производится после подтверждения заказа согласованным способом (наличные / карта).",
    },
  },
  {
    uz: {
      q: "Mahsulotlar o'zingiznikimi?",
      a: "Ha, barcha modellar o'z tikuv seximizda tikiladi — shu sababli narxlar optom va sifat nazoratimizda.",
    },
    ru: {
      q: "Товары вашего производства?",
      a: "Да, все модели шьются в нашем швейном цехе — поэтому цены оптовые, а качество под нашим контролем.",
    },
  },
  {
    uz: {
      q: "Yangi modellar qachon chiqadi?",
      a: "Har hafta yangi kolleksiya chiqaramiz. Birinchilardan bilish uchun Telegram botimizga obuna bo'ling.",
    },
    ru: {
      q: "Когда выходят новые модели?",
      a: "Новую коллекцию выпускаем каждую неделю. Чтобы узнавать первыми, подпишитесь на наш Telegram-бот.",
    },
  },
];

export function faqForLocale(locale: Locale) {
  return FAQ.map((item) => (locale === "ru" ? item.ru : item.uz));
}
