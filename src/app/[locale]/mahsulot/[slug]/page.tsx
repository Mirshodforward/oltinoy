import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { pageMetadata, localeUrl, SITE_URL } from "@/lib/seo";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { formatPrice, productAltFallback } from "@/lib/format";
import { absoluteImageUrl } from "@/lib/images";
import { productCardSelect } from "@/lib/queries";
import { Gallery } from "@/components/catalog/Gallery";
import { ViewBeacon } from "@/components/catalog/ViewBeacon";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { BookingForm } from "@/components/booking/BookingForm";
import { StickyBookingBar } from "@/components/booking/StickyBookingBar";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JsonLd, productSchema, breadcrumbSchema } from "@/components/seo/JsonLd";
import {
  ArrowRight,
  Package,
  Scissors,
  ShieldCheck,
  Telegram,
  Truck,
  categoryIcon,
} from "@/components/ui/icons";

export const revalidate = 3600;
const BOOKING_ANCHOR = "bron";

/** The three things a reseller checks before she asks the price. */
const TRUST = [
  ["workshop", Scissors],
  ["delivery", Truck],
  ["quality", ShieldCheck],
] as const;

async function getProduct(slug: string) {
  try {
    return await db.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
      },
    });
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const products = await db.product.findMany({
      where: { status: { in: ["ACTIVE", "SOLD_OUT"] } },
      select: { slug: true },
    });
    return products.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getProduct(slug);
  if (!product || product.status === "HIDDEN") return {};
  const name = locale === "ru" ? product.nameRu : product.nameUz;
  const title = `${name} — optom ${formatPrice(product.price, locale)} | Oltinoy Collection`;
  const descBase =
    locale === "ru"
      ? `${name} оптом ${formatPrice(product.price, "ru")}. Из собственного швейного цеха, размеры ${product.sizes.join(", ")}. Забронируйте — оператор свяжется.`
      : `${name} optom ${formatPrice(product.price, "uz")}. O'z tikuv seximizdan, ${product.sizes.join(", ")} razmerlar. Bron qiling — operator bog'lanadi.`;
  const first = product.images[0];
  const images = first
    ? [{ url: absoluteImageUrl(SITE_URL, first.fileName, "lg", "jpg"), width: 1280, height: 1707, alt: name }]
    : undefined;
  return pageMetadata({
    locale,
    path: `/mahsulot/${slug}`,
    title: title.slice(0, 70),
    description: descBase.slice(0, 160),
    images,
    type: "website",
  });
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const product = await getProduct(slug);
  if (!product || product.status === "HIDDEN") notFound();

  const [t, settings] = await Promise.all([getTranslations("product"), getSettings()]);
  const name = locale === "ru" ? product.nameRu : product.nameUz;
  const description = locale === "ru" ? product.descriptionRu : product.descriptionUz;
  const material = locale === "ru" ? product.materialRu : product.materialUz;
  const categoryName = locale === "ru" ? product.category.nameRu : product.category.nameUz;
  const sold = product.status === "SOLD_OUT";
  const orderUsername = settings.tgOrderUsername;

  const altFallback = productAltFallback(name, categoryName);
  const galleryImages = product.images.map((img) => ({
    fileName: img.fileName,
    alt: (locale === "ru" ? img.altRu : img.altUz) || altFallback,
  }));

  const discounted = product.oldPrice !== null && product.oldPrice > product.price;
  // The saving is the argument in optom — spell it out rather than making her do the sum.
  const savedPct = discounted ? Math.max(1, Math.round((1 - product.price / product.oldPrice!) * 100)) : 0;
  const CategoryIcon = categoryIcon(product.category.slug);

  // Related — same category, exclude current.
  const related = await db.product
    .findMany({
      where: { categoryId: product.categoryId, status: { in: ["ACTIVE", "SOLD_OUT"] }, NOT: { id: product.id } },
      orderBy: { createdAt: "desc" },
      take: 4,
      select: productCardSelect,
    })
    .catch(() => []);

  const productUrl = localeUrl(locale, `/mahsulot/${slug}`);
  const imageUrls = product.images.map((img) => absoluteImageUrl(SITE_URL, img.fileName, "lg", "jpg"));

  // The mobile booking bar floats over whatever ends the page — leave it room.
  const bottomPad = sold ? "pb-16" : "pb-28";
  const label = "text-2xs font-bold uppercase tracking-[0.14em]";

  return (
    <>
      <ViewBeacon slug={slug} />
      <JsonLd
        data={productSchema({
          name,
          description: description || `${name} — ${categoryName}`,
          sku: product.sku,
          material,
          price: product.price,
          availability: product.status,
          images: imageUrls,
          url: productUrl,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: t("breadcrumbHome"), url: localeUrl(locale, "/") },
          { name: t("breadcrumbCatalog"), url: localeUrl(locale, "/katalog") },
          { name: categoryName, url: localeUrl(locale, `/katalog/${product.category.slug}`) },
          { name, url: productUrl },
        ])}
      />

      {/* A slim cream strip instead of a masthead — on a product page the H1
          belongs beside the price, not above the fold on its own. */}
      <div className="panel-cream border-b" style={{ borderColor: "var(--line)" }}>
        <div className="container-page py-4">
          <Breadcrumbs
            items={[
              { name: t("breadcrumbHome"), href: "/" },
              { name: t("breadcrumbCatalog"), href: "/katalog" },
              { name: categoryName, href: `/katalog/${product.category.slug}` },
              { name },
            ]}
          />
        </div>
      </div>

      <div className={`container-page pt-8 md:pt-12 md:pb-20 ${related.length > 0 ? "pb-16" : bottomPad}`}>
        <div className="grid items-start gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14">
          {/* The gallery is the shorter column, so it is the one that sticks —
             the photo stays in view while the buyer works down the form. */}
          <div className="mx-auto w-full max-w-md sm:max-w-lg lg:sticky lg:top-28 lg:max-w-none">
            <Gallery images={galleryImages} name={name} />
          </div>

          <div>
            <Link
              href={`/katalog/${product.category.slug}`}
              className="kicker -my-2.5 inline-flex min-h-[44px] items-center transition-colors hover:text-ink"
            >
              <CategoryIcon size={14} />
              {categoryName}
            </Link>

            <h1 className="mt-4 text-3xl md:text-4xl">{name}</h1>

            {product.sku && (
              <p className="mt-2.5 text-xs" style={{ color: "var(--fg-subtle)" }}>
                {t("sku")} · <span className="tabular-nums">{product.sku}</span>
              </p>
            )}

            <div className="mt-7">
              <span className="kicker">{t("wholesalePrice")}</span>
              <div className="mt-2.5 flex flex-wrap items-baseline gap-x-3 gap-y-2">
                <span className="price text-4xl">{formatPrice(product.price, locale)}</span>
                {discounted && <span className="price-old text-base">{formatPrice(product.oldPrice!, locale)}</span>}
                {discounted && <span className="badge badge-sale self-center">-{savedPct}%</span>}
              </div>
            </div>

            <div className="seam mt-7" aria-hidden="true" />

            <dl className="mt-1 text-sm">
              {material && (
                <div className="flex gap-4 border-b py-3.5" style={{ borderColor: "var(--line)" }}>
                  <dt className={`${label} w-24 shrink-0`} style={{ color: "var(--fg-subtle)" }}>
                    {t("material")}
                  </dt>
                  <dd>{material}</dd>
                </div>
              )}
              {product.sizes.length > 0 && (
                <div className="flex gap-4 border-b py-3.5" style={{ borderColor: "var(--line)" }}>
                  <dt className={`${label} w-24 shrink-0 pt-1`} style={{ color: "var(--fg-subtle)" }}>
                    {t("sizes")}
                  </dt>
                  <dd className="flex flex-wrap gap-1.5">
                    {product.sizes.map((s) => (
                      <span key={s} className="chip chip-static">
                        {s}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
              <div className="flex gap-4 border-b py-3.5" style={{ borderColor: "var(--line)" }}>
                <dt className={`${label} w-24 shrink-0`} style={{ color: "var(--fg-subtle)" }}>
                  {t("availability")}
                </dt>
                <dd className="flex items-center gap-2 font-semibold">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: sold ? "var(--color-danger)" : "var(--color-sage)" }}
                    aria-hidden="true"
                  />
                  <span style={{ color: sold ? "var(--color-danger)" : "var(--color-sage)" }}>
                    {sold ? t("soldOut") : t("inStock")}
                  </span>
                </dd>
              </div>
            </dl>

            {product.minOrderQty > 1 && (
              <p className="mt-4 flex items-center gap-2 text-xs" style={{ color: "var(--fg-muted)" }}>
                <Package size={15} style={{ color: "var(--color-gold-dk)" }} />
                {t("minOrder", { qty: product.minOrderQty })}
              </p>
            )}

            {description && (
              <div className="mt-7">
                <h2 className={`${label} font-body`} style={{ color: "var(--fg-subtle)" }}>
                  {t("details")}
                </h2>
                <p className="mt-2.5 whitespace-pre-line text-sm leading-relaxed" style={{ color: "var(--fg-muted)" }}>
                  {description}
                </p>
              </div>
            )}

            <ul className="mt-7 grid grid-cols-3 border-y" style={{ borderColor: "var(--line)" }}>
              {TRUST.map(([k, Icon], i) => (
                <li
                  key={k}
                  className={`flex flex-col items-center gap-2 px-2 py-4 text-center ${i > 0 ? "border-l" : ""}`}
                  style={{ borderColor: "var(--line)" }}
                >
                  <Icon size={20} style={{ color: "var(--color-gold-dk)" }} />
                  <span className="text-2xs font-semibold leading-snug" style={{ color: "var(--fg-muted)" }}>
                    {t(`trust.${k}`)}
                  </span>
                </li>
              ))}
            </ul>

            {!sold && (
              <a href={`#${BOOKING_ANCHOR}`} className="btn btn-gold btn-block btn-lg mt-7">
                {t("bookNow")}
                <ArrowRight size={18} />
              </a>
            )}

            {orderUsername && (
              <a
                href={`https://t.me/${orderUsername}`}
                target="_blank"
                rel="noopener"
                className={`btn btn-outline btn-block ${sold ? "mt-7" : "mt-3"}`}
              >
                <Telegram size={18} />
                {t("writeTelegram")}
              </a>
            )}
            {/* Booking sits in the same column as the price. Stranded below the
               gallery it left half the row empty and read as a separate page. */}
            {!sold && (
              <div id={BOOKING_ANCHOR} className="mt-12 scroll-mt-28">
                <BookingForm
                  productId={product.id}
                  sizes={product.sizes}
                  minOrderQty={product.minOrderQty}
                  channelUrl={settings.tgChannelUrl}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related — the page closes on the cream panel, as every other page does. */}
      {related.length > 0 && (
        <section
          className={`panel-cream border-t section-y ${sold ? "" : "pb-28"} md:pb-[var(--section-y)]`}
          style={{ borderColor: "var(--line)" }}
        >
          <div className="container-page">
            <SectionHeading kicker={categoryName} title={t("relatedTitle")} subtitle={t("relatedSubtitle")} />
            <ProductGrid products={related} />
          </div>
        </section>
      )}

      {!sold && <StickyBookingBar price={formatPrice(product.price, locale)} targetId={BOOKING_ANCHOR} />}
    </>
  );
}
