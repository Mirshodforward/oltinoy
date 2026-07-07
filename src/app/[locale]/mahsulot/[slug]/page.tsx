import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
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

export const revalidate = 3600;
const BOOKING_ANCHOR = "bron";

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

  return (
    <div className="container-page py-6 pb-24 md:pb-12">
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

      <Breadcrumbs
        items={[
          { name: t("breadcrumbHome"), href: "/" },
          { name: t("breadcrumbCatalog"), href: "/katalog" },
          { name: categoryName, href: `/katalog/${product.category.slug}` },
          { name },
        ]}
      />

      <div className="mt-6 grid gap-8 md:grid-cols-2">
        {/* Gallery */}
        <div>
          <Gallery images={galleryImages} name={name} />
        </div>

        {/* Details */}
        <div>
          <h1 className="text-2xl font-semibold md:text-3xl">{name}</h1>
          {product.sku && (
            <p className="mt-1 text-xs" style={{ color: "var(--color-muted)" }}>
              {t("sku")}: {product.sku}
            </p>
          )}

          <div className="mt-4">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-bronze)" }}>
              {t("wholesalePrice")}
            </span>
            <div className="mt-1 flex items-baseline gap-3">
              <span className="price text-3xl font-semibold" style={{ color: "var(--color-ink)" }}>
                {formatPrice(product.price, locale)}
              </span>
              {product.oldPrice && (
                <span className="text-lg line-through" style={{ color: "var(--color-muted)" }}>
                  {formatPrice(product.oldPrice, locale)}
                </span>
              )}
            </div>
          </div>

          <div className="seam mt-5 w-full" aria-hidden="true" />

          <dl className="mt-5 space-y-3 text-sm">
            {material && (
              <div className="flex gap-2">
                <dt className="w-28 shrink-0 font-semibold">{t("material")}:</dt>
                <dd style={{ color: "var(--color-muted)" }}>{material}</dd>
              </div>
            )}
            <div className="flex gap-2">
              <dt className="w-28 shrink-0 font-semibold">{t("sizes")}:</dt>
              <dd className="flex flex-wrap gap-1.5">
                {product.sizes.map((s) => (
                  <span key={s} className="rounded-full border px-2.5 py-0.5 text-xs" style={{ borderColor: "var(--color-line)" }}>
                    {s}
                  </span>
                ))}
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-28 shrink-0 font-semibold">{t("inStock")}:</dt>
              <dd style={{ color: sold ? "#b91c1c" : "var(--color-sage)" }}>{sold ? t("soldOut") : t("inStock")}</dd>
            </div>
          </dl>

          {product.minOrderQty > 1 && (
            <p className="mt-3 text-xs" style={{ color: "var(--color-muted)" }}>
              {t("minOrder", { qty: product.minOrderQty })}
            </p>
          )}

          {description && (
            <p className="mt-5 whitespace-pre-line text-sm leading-relaxed" style={{ color: "var(--color-ink-soft)" }}>
              {description}
            </p>
          )}

          {orderUsername && (
            <a href={`https://t.me/${orderUsername}`} target="_blank" rel="noopener" className="btn btn-outline mt-5 w-full">
              ✈️ {t("writeTelegram")}
            </a>
          )}
        </div>
      </div>

      {/* Booking form */}
      {!sold && (
        <div id={BOOKING_ANCHOR} className="mt-10 max-w-xl scroll-mt-20">
          <BookingForm
            productId={product.id}
            sizes={product.sizes}
            minOrderQty={product.minOrderQty}
            channelUrl={settings.tgChannelUrl}
          />
        </div>
      )}

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-14">
          <SectionHeading title={t("relatedTitle")} />
          <ProductGrid products={related} />
        </section>
      )}

      {!sold && <StickyBookingBar price={formatPrice(product.price, locale)} targetId={BOOKING_ANCHOR} />}
    </div>
  );
}
