import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/seo";
import { getSettings } from "@/lib/settings";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return pageMetadata({ locale, path: "/biz-haqimizda", title: t("metaTitle"), description: t("metaDescription") });
}

const STORY: Record<Locale, { lead: string; paras: string[]; points: { t: string; d: string }[] }> = {
  uz: {
    lead: "Oltinoy Collection — Toshkentdagi o'z tikuv sexiga ega oilaviy brend. Biz modest fashion — abaya, ko'ylak va rumollarni to'g'ridan-to'g'ri ishlab chiqaruvchidan optom taqdim etamiz.",
    paras: [
      "Bizning hikoyamiz kichik tikuv ustaxonasidan boshlangan. Bugun bizda o'z sexmiz bor — bu bizga har bir tikuvni, har bir matoni nazorat qilish imkonini beradi. Vositachilar yo'q, shuning uchun narxlar resellerlar uchun eng qulay.",
      "Har hafta yangi kolleksiya chiqaramiz. Modellarimiz zamonaviy, ammo an'anaviy nazokatni saqlaydi. Sifatli matolar, puxta tikuv va diqqat bilan tanlangan detallar — bularning barchasi bizning ustaxonamizdan chiqadi.",
      "Mijozlarimiz — O'zbekiston bo'ylab optomchilar. Biz ular bilan uzoq muddatli hamkorlikni qadrlaymiz: barqaror sifat, o'z vaqtida yetkazib berish va halol narxlar.",
    ],
    points: [
      { t: "O'z tikuv sexi", d: "Har bir model o'zimizda tikiladi — sifat nazoratimizda." },
      { t: "Har hafta yangilik", d: "Doimiy yangi modellar bilan assortimentingizni yangilang." },
      { t: "Optom narxlar", d: "Ishlab chiqaruvchidan to'g'ridan-to'g'ri — vositachisiz." },
    ],
  },
  ru: {
    lead: "Oltinoy Collection — семейный бренд с собственным швейным цехом в Ташкенте. Мы предлагаем модест-моду — абайи, платья и платки — напрямую от производителя оптом.",
    paras: [
      "Наша история началась с небольшой швейной мастерской. Сегодня у нас собственный цех — это позволяет контролировать каждый шов и каждую ткань. Без посредников, поэтому цены выгодны для реселлеров.",
      "Каждую неделю мы выпускаем новую коллекцию. Наши модели современны, но сохраняют традиционную сдержанность. Качественные ткани, аккуратный пошив и продуманные детали — всё из нашей мастерской.",
      "Наши клиенты — оптовики по всему Узбекистану. Мы ценим долгосрочное сотрудничество: стабильное качество, своевременная доставка и честные цены.",
    ],
    points: [
      { t: "Собственный цех", d: "Каждая модель шьётся у нас — под нашим контролем качества." },
      { t: "Новинки каждую неделю", d: "Обновляйте ассортимент постоянно новыми моделями." },
      { t: "Оптовые цены", d: "Напрямую от производителя — без посредников." },
    ],
  },
};

export default async function AboutPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, tp, th, settings] = await Promise.all([
    getTranslations("about"),
    getTranslations("product"),
    getTranslations("home"),
    getSettings(),
  ]);
  const story = STORY[locale];

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ name: tp("breadcrumbHome"), href: "/" }, { name: t("title") }]} />
      <h1 className="mt-4 text-3xl font-semibold md:text-4xl">{t("title")}</h1>
      <div className="seam mt-3 w-24" aria-hidden="true" />

      <div className="mt-8 max-w-2xl">
        <p className="text-lg leading-relaxed" style={{ color: "var(--color-ink)" }}>
          {story.lead}
        </p>
        <div className="mt-5 space-y-4 text-[0.975rem] leading-relaxed" style={{ color: "var(--color-ink-soft)" }}>
          {story.paras.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {story.points.map((pt) => (
          <div key={pt.t} className="card p-6">
            <h2 className="text-lg">{pt.t}</h2>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--color-muted)" }}>
              {pt.d}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/katalog" className="btn btn-primary">
          {th("heroCtaCatalog")}
        </Link>
        {settings.tgChannelUrl && (
          <a href={settings.tgChannelUrl} target="_blank" rel="noopener" className="btn btn-outline">
            ✈️ {th("heroCtaChannel")}
          </a>
        )}
      </div>
    </div>
  );
}
