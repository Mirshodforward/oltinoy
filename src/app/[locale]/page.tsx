import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { getLatestProducts, getActiveCategories } from "@/lib/queries";
import { getSettings } from "@/lib/settings";
import { faqForLocale } from "@/lib/faq";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { ProductImageView } from "@/components/catalog/ProductImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Accordion } from "@/components/ui/Accordion";
import { JsonLd, localBusinessSchema, faqSchema } from "@/components/seo/JsonLd";
import {
  ArrowRight,
  ArrowUpRight,
  Moon,
  Telegram,
  Scissors,
  Repeat,
  Package,
  Storefront,
  categoryIcon,
} from "@/components/ui/icons";

export const revalidate = 3600;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return pageMetadata({
    locale,
    path: "/",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

const WHY_ICON = { workshop: Scissors, weekly: Repeat, wholesale: Package, store: Storefront } as const;
const MARQUEE_KEYS = ["one", "two", "three", "four", "five", "six"] as const;
const PROCESS_KEYS = ["one", "two", "three"] as const;

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, tc, products, categories, settings] = await Promise.all([
    getTranslations("home"),
    getTranslations("catalog"),
    getLatestProducts(8),
    getActiveCategories(),
    getSettings(),
  ]);
  const faq = faqForLocale(locale);
  const why = ["workshop", "weekly", "wholesale", "store"] as const;
  const heroImages = products.slice(0, 2);
  const marquee = MARQUEE_KEYS.map((k) => t(`marquee.${k}`));

  return (
    <>
      <JsonLd data={localBusinessSchema(settings, locale)} />
      <JsonLd data={faqSchema(faq)} />

      {/* ───────────────────────── Hero ───────────────────────── */}
      <section className="on-dark relative overflow-hidden bg-ink">
        <div
          className="pointer-events-none absolute right-[-10%] top-[-20%] h-[36rem] w-[36rem] rounded-full opacity-[0.13]"
          style={{ background: "radial-gradient(circle, var(--color-gold) 0%, transparent 62%)" }}
          aria-hidden="true"
        />

        <div className="container-page relative grid gap-12 py-16 md:py-24 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16">
          <div>
            <span className="kicker">
              <Moon size={14} />
              {t("heroKicker")}
            </span>

            <h1 className="mt-6 text-4xl sm:max-w-[18ch] sm:text-5xl">{t("heroTitle")}</h1>

            <p className="mt-6 max-w-lg text-lg leading-relaxed" style={{ color: "var(--fg-muted)" }}>
              {t("heroSubtitle")}
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/katalog" className="btn btn-gold btn-lg">
                {t("heroCtaCatalog")}
                <ArrowRight size={18} />
              </Link>
              {settings.tgChannelUrl && (
                <a href={settings.tgChannelUrl} target="_blank" rel="noopener" className="btn btn-outline btn-lg">
                  <Telegram size={18} />
                  {t("heroCtaChannel")}
                </a>
              )}
            </div>

            {/* Proof points — the three things a reseller checks first. */}
            <dl className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t pt-8 sm:mt-12 sm:gap-6" style={{ borderColor: "var(--line)" }}>
              {(
                [
                  ["sizesValue", "sizesLabel"],
                  ["weeklyValue", "weeklyLabel"],
                  ["regionsValue", "regionsLabel"],
                ] as const
              ).map(([v, l]) => (
                <div key={v} className="min-w-0">
                  <dt className="sr-only">{t(`heroStats.${l}`)}</dt>
                  <dd>
                    <span className="price block break-words text-lg sm:text-xl md:text-2xl" style={{ color: "var(--color-gold-lt)" }}>
                      {t(`heroStats.${v}`)}
                    </span>
                    <span className="mt-1.5 block text-2xs leading-snug sm:text-xs" style={{ color: "var(--fg-subtle)" }}>
                      {t(`heroStats.${l}`)}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Editorial image pair — the second frame overlaps and breaks the grid. */}
          {heroImages.length > 0 && (
            <div className="relative hidden lg:block">
              <div
                className="relative ml-auto aspect-[4/5] w-[85%] overflow-hidden rounded-lg"
                style={{ boxShadow: "var(--shadow-lg)" }}
              >
                <ProductImageView
                  fileName={heroImages[0]?.images[0]?.fileName ?? null}
                  alt={locale === "ru" ? heroImages[0].nameRu : heroImages[0].nameUz}
                  priority
                  sizes="(max-width: 1024px) 0px, 34vw"
                />
              </div>
              {heroImages[1] && (
                <div
                  className="absolute -bottom-8 left-0 aspect-[3/4] w-[46%] overflow-hidden rounded-lg border-4"
                  style={{ borderColor: "var(--color-ink)", boxShadow: "var(--shadow-lg)" }}
                >
                  <ProductImageView
                    fileName={heroImages[1]?.images[0]?.fileName ?? null}
                    alt={locale === "ru" ? heroImages[1].nameRu : heroImages[1].nameUz}
                    sizes="(max-width: 1024px) 0px, 18vw"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="seam" aria-hidden="true" />
      </section>

      {/* ─────────────────── Brand promise marquee ─────────────────── */}
      <div className="panel-cream border-b py-4" style={{ borderColor: "var(--line)" }}>
        <div className="marquee">
          <div className="marquee__track">
            {[0, 1].map((pass) => (
              <div key={pass} className="flex shrink-0 items-center" aria-hidden={pass === 1}>
                {marquee.map((phrase) => (
                  <span key={phrase} className="flex shrink-0 items-center gap-5 px-5">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-mocha">{phrase}</span>
                    <Moon size={13} className="text-gold" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ───────────────────────── Categories ───────────────────────── */}
      {categories.length > 0 && (
        <section className="container-page section-y">
          <SectionHeading
            kicker={t("categoriesKicker")}
            title={t("categoriesTitle")}
            subtitle={t("categoriesSubtitle")}
          />
          <div className="reveal-group grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
            {categories.map((c) => {
              const Icon = categoryIcon(c.slug);
              return (
                <Link
                  key={c.id}
                  href={`/katalog/${c.slug}`}
                  className="card card-lift group flex flex-col items-start gap-5 p-6 md:p-7"
                >
                  <span
                    className="flex h-14 w-14 items-center justify-center rounded-full border transition-colors duration-300 group-hover:border-gold group-hover:bg-gold"
                    style={{ borderColor: "var(--line)", color: "var(--color-gold-dk)" }}
                  >
                    <Icon size={26} />
                  </span>
                  <div>
                    <h3 className="text-xl">{locale === "ru" ? c.nameRu : c.nameUz}</h3>
                    <p className="mt-1.5 text-sm" style={{ color: "var(--fg-subtle)" }}>
                      {tc("modelsCount", { count: c._count.products })}
                    </p>
                  </div>
                  <ArrowUpRight
                    size={20}
                    className="mt-auto transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                    style={{ color: "var(--color-gold-dk)" }}
                  />
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ─────────────────────── New collection ─────────────────────── */}
      <section className="container-page pb-[var(--section-y)]">
        <SectionHeading
          kicker={t("newCollectionKicker")}
          title={t("newCollection")}
          subtitle={t("newCollectionSubtitle")}
          action={
            <Link href="/katalog" className="btn btn-outline">
              {t("heroCtaCatalog")}
              <ArrowRight size={17} />
            </Link>
          }
        />
        {products.length > 0 ? (
          <ProductGrid products={products} priorityCount={2} />
        ) : (
          <div className="card px-6 py-16 text-center">
            <Moon size={30} className="mx-auto text-gold" />
            <p className="mx-auto mt-4 max-w-md text-base" style={{ color: "var(--fg-muted)" }}>
              {t("newCollectionEmpty")}
            </p>
            {settings.tgChannelUrl && (
              <a href={settings.tgChannelUrl} target="_blank" rel="noopener" className="btn btn-gold mt-6">
                <Telegram size={17} />
                {t("heroCtaChannel")}
              </a>
            )}
          </div>
        )}
      </section>

      {/* ───────────────────────── Why us ───────────────────────── */}
      <section className="panel-cream border-y section-y" style={{ borderColor: "var(--line)" }}>
        <div className="container-page">
          <SectionHeading kicker={t("whyKicker")} title={t("whyTitle")} subtitle={t("whySubtitle")} />
          <div className="reveal-group grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {why.map((k) => {
              const Icon = WHY_ICON[k];
              return (
                <div key={k}>
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-full"
                    style={{ background: "var(--color-gold)", color: "var(--color-ink)" }}
                  >
                    <Icon size={23} />
                  </span>
                  <h3 className="mt-5 text-xl">{t(`why.${k}.title`)}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed" style={{ color: "var(--fg-muted)" }}>
                    {t(`why.${k}.text`)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────────────────── How ordering works ───────────────────── */}
      <section className="container-page section-y">
        <SectionHeading kicker={t("processKicker")} title={t("processTitle")} subtitle={t("processSubtitle")} />
        <ol className="reveal-group grid gap-8 md:grid-cols-3 md:gap-6">
          {PROCESS_KEYS.map((k, i) => (
            <li key={k} className="relative pt-8">
              {/* The seam runs between the steps like a stitch line. */}
              <span className="seam absolute left-0 right-0 top-3 hidden md:block" aria-hidden="true" />
              <span
                className="price absolute left-0 top-0 flex h-7 w-7 items-center justify-center rounded-full text-xs"
                style={{ background: "var(--color-ink)", color: "var(--color-gold-lt)" }}
              >
                {i + 1}
              </span>
              <h3 className="mt-4 text-xl md:mt-6">{t(`process.${k}.title`)}</h3>
              <p className="mt-2.5 max-w-sm text-sm leading-relaxed" style={{ color: "var(--fg-muted)" }}>
                {t(`process.${k}.text`)}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* ───────────────────────── Telegram CTA ───────────────────────── */}
      {settings.tgChannelUrl && (
        <section className="on-dark relative overflow-hidden bg-ink">
          <div className="seam" aria-hidden="true" />
          <div
            className="arc pointer-events-none absolute -bottom-40 -right-24 w-[30rem] opacity-60"
            aria-hidden="true"
          />
          <div className="container-page relative flex flex-col items-start gap-8 py-14 md:flex-row md:items-center md:justify-between md:py-18">
            <div className="max-w-xl">
              <span className="kicker">
                <Telegram size={14} />
                {t("ctaKicker")}
              </span>
              <h2 className="mt-4 text-3xl md:text-4xl">{t("ctaTitle")}</h2>
              <p className="mt-3 text-base" style={{ color: "var(--fg-muted)" }}>
                {t("ctaText")}
              </p>
            </div>
            <a
              href={settings.tgChannelUrl}
              target="_blank"
              rel="noopener"
              className="btn btn-gold btn-lg shrink-0"
            >
              <Telegram size={19} />
              {t("heroCtaChannel")}
            </a>
          </div>
        </section>
      )}

      {/* ───────────────────────── FAQ ───────────────────────── */}
      <section className="container-page section-y">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <span className="kicker">{t("faqKicker")}</span>
            <h2 className="mt-4 text-3xl md:text-4xl">{t("faqTitle")}</h2>
            <p className="mt-3 text-base leading-relaxed" style={{ color: "var(--fg-muted)" }}>
              {t("faqSubtitle")}
            </p>
            <div className="seam mt-6 w-20" aria-hidden="true" />
          </div>
          <Accordion items={faq} />
        </div>
      </section>
    </>
  );
}
