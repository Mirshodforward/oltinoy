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

const CATEGORY_ICON: Record<string, string> = {
  abaya: "🧕",
  koylak: "👗",
  rumol: "🧣",
  toplam: "🎁",
};

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, products, categories, settings] = await Promise.all([
    getTranslations("home"),
    getLatestProducts(8),
    getActiveCategories(),
    getSettings(),
  ]);
  const faq = faqForLocale(locale);
  const why = ["workshop", "weekly", "wholesale", "store"] as const;
  const whyIcon: Record<string, string> = { workshop: "✂️", weekly: "🔄", wholesale: "📦", store: "🏬" };

  return (
    <>
      <JsonLd data={localBusinessSchema(settings, locale)} />
      <JsonLd data={faqSchema(faq)} />

      {/* Hero */}
      <section style={{ background: "var(--color-ink)", color: "var(--color-ivory)" }}>
        <div className="container-page grid gap-8 py-14 md:grid-cols-2 md:items-center md:py-20">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--color-gold)" }}>
              {t("heroKicker")}
            </p>
            <h1 className="text-4xl font-semibold leading-[1.1] md:text-5xl" style={{ color: "var(--color-ivory)" }}>
              {t("heroTitle")}
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed" style={{ color: "rgba(247,243,236,0.78)" }}>
              {t("heroSubtitle")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/katalog" className="btn btn-gold">
                {t("heroCtaCatalog")}
              </Link>
              {settings.tgChannelUrl && (
                <a href={settings.tgChannelUrl} target="_blank" rel="noopener" className="btn btn-outline" style={{ color: "var(--color-ivory)", borderColor: "rgba(247,243,236,0.4)" }}>
                  ✈️ {t("heroCtaChannel")}
                </a>
              )}
            </div>
          </div>
          <div className="hidden md:block">
            <div className="grid grid-cols-2 gap-3">
              {products.slice(0, 2).map((p, i) => (
                <div key={p.slug} className="relative aspect-[3/4] overflow-hidden rounded-[var(--radius-card)]">
                  <ProductImageView
                    fileName={p.images[0]?.fileName ?? null}
                    alt={locale === "ru" ? p.nameRu : p.nameUz}
                    priority={i === 0}
                    sizes="25vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="seam" aria-hidden="true" />
      </section>

      {/* New collection */}
      <section className="container-page py-14">
        <SectionHeading
          title={t("newCollection")}
          subtitle={t("newCollectionSubtitle")}
          action={
            <Link href="/katalog" className="text-sm font-semibold hover:underline" style={{ color: "var(--color-bronze)" }}>
              {t("newCollection")} →
            </Link>
          }
        />
        {products.length > 0 ? (
          <ProductGrid products={products} priorityCount={2} />
        ) : (
          <p className="py-8 text-center text-sm" style={{ color: "var(--color-muted)" }}>
            {t("newCollectionSubtitle")}
          </p>
        )}
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="container-page py-6">
          <SectionHeading title={t("categoriesTitle")} />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/katalog/${c.slug}`}
                className="card flex flex-col items-center justify-center gap-2 p-8 text-center transition-colors hover:border-[var(--color-gold)]"
              >
                <span className="text-3xl" aria-hidden="true">
                  {CATEGORY_ICON[c.slug] ?? "🛍"}
                </span>
                <span className="font-[family-name:var(--font-display)] text-lg">
                  {locale === "ru" ? c.nameRu : c.nameUz}
                </span>
                <span className="text-xs" style={{ color: "var(--color-muted)" }}>
                  {c._count.products} {locale === "ru" ? "товаров" : "ta model"}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Why us */}
      <section className="py-14" style={{ background: "#fff" }}>
        <div className="container-page">
          <SectionHeading title={t("whyTitle")} />
          <div className="grid gap-5 md:grid-cols-4">
            {why.map((k) => (
              <div key={k} className="card p-6">
                <span className="text-2xl" aria-hidden="true">
                  {whyIcon[k]}
                </span>
                <h3 className="mt-3 text-lg">{t(`why.${k}.title`)}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--color-muted)" }}>
                  {t(`why.${k}.text`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-page py-14">
        <SectionHeading title={t("faqTitle")} />
        <div className="mx-auto max-w-3xl">
          <Accordion items={faq} />
        </div>
      </section>
    </>
  );
}
