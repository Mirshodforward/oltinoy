import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/seo";
import { getSettings } from "@/lib/settings";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowRight, Package, Repeat, Scissors, Telegram } from "@/components/ui/icons";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return pageMetadata({ locale, path: "/biz-haqimizda", title: t("metaTitle"), description: t("metaDescription") });
}

const STORY: Record<Locale, { paras: string[]; points: { t: string; d: string }[] }> = {
  uz: {
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

/** The three STORY points, in order, get the workshop / weekly / wholesale glyphs. */
const POINT_ICONS = [Scissors, Repeat, Package] as const;

const NUMBERS = [
  ["yearsValue", "yearsLabel"],
  ["modelsValue", "modelsLabel"],
  ["partnersValue", "partnersLabel"],
  ["regionsValue", "regionsLabel"],
] as const;

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
    <>
      <PageHeader
        crumbs={[{ name: tp("breadcrumbHome"), href: "/" }, { name: t("title") }]}
        kicker={t("kicker")}
        title={t("title")}
      />

      {/* ───────────────────────── The story ───────────────────────── */}
      <section className="container-page section-y">
        {/* The lead sits on its own narrow measure — it is the page's thesis. */}
        <p className="max-w-2xl text-xl leading-relaxed">{t("lead")}</p>

        <div className="mt-14 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <h2 className="text-3xl md:text-4xl">{t("storyTitle")}</h2>
            <div className="seam mt-6 w-20" aria-hidden="true" />
          </div>
          <div className="space-y-5 text-base leading-relaxed" style={{ color: "var(--fg-muted)" }}>
            {story.paras.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────── The numbers ─────────────────────── */}
      <section className="on-dark relative overflow-hidden bg-ink">
        <div className="seam" aria-hidden="true" />
        <div className="arc pointer-events-none absolute -right-32 -top-48 w-[34rem] opacity-70" aria-hidden="true" />

        <div className="container-page relative py-14 md:py-20">
          <span className="kicker">{t("numbersKicker")}</span>
          <dl className="reveal-group mt-9 grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4">
            {NUMBERS.map(([v, l]) => (
              <div key={v}>
                <dt className="sr-only">{t(`numbers.${l}`)}</dt>
                <dd>
                  <span className="price block text-4xl text-gold-lt">{t(`numbers.${v}`)}</span>
                  <span className="mt-2 block text-sm leading-snug" style={{ color: "var(--fg-subtle)" }}>
                    {t(`numbers.${l}`)}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="seam" aria-hidden="true" />
      </section>

      {/* ─────────────────────── What sets us apart ─────────────────────── */}
      <section className="container-page section-y">
        <SectionHeading kicker={t("valuesKicker")} title={t("valuesTitle")} />
        <div className="reveal-group grid gap-5 md:grid-cols-3">
          {story.points.map((pt, i) => {
            const Icon = POINT_ICONS[i];
            return (
              <div key={pt.t} className="card p-6 md:p-7">
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-full border"
                  style={{ borderColor: "var(--line)", color: "var(--color-gold-dk)" }}
                >
                  <Icon size={23} />
                </span>
                <h3 className="mt-5 text-xl">{pt.t}</h3>
                <p className="mt-2.5 text-sm leading-relaxed" style={{ color: "var(--fg-muted)" }}>
                  {pt.d}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────── Start working with us ─────────────────────── */}
      <section className="panel-cream border-t" style={{ borderColor: "var(--line)" }}>
        <div className="container-page py-14 md:py-20">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl">{t("ctaTitle")}</h2>
            <p className="mt-4 text-base leading-relaxed" style={{ color: "var(--fg-muted)" }}>
              {t("ctaText")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/katalog" className="btn btn-primary btn-lg">
                {th("heroCtaCatalog")}
                <ArrowRight size={18} />
              </Link>
              {settings.tgChannelUrl && (
                <a href={settings.tgChannelUrl} target="_blank" rel="noopener" className="btn btn-outline btn-lg">
                  <Telegram size={18} />
                  {th("heroCtaChannel")}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
