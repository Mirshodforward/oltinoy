import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/seo";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { PageHeader } from "@/components/ui/PageHeader";
import { Logo } from "@/components/ui/Logo";
import { ArrowRight, PenLine } from "@/components/ui/icons";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return pageMetadata({ locale, path: "/blog", title: t("metaTitle"), description: t("metaDescription") });
}

async function getPosts() {
  try {
    return await db.post.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
    });
  } catch {
    return [];
  }
}

export default async function BlogPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, tp, posts] = await Promise.all([getTranslations("blog"), getTranslations("product"), getPosts()]);

  // The newest post carries the page; everything older falls into the grid.
  const [featured, ...rest] = posts;
  const featuredTitle = featured ? (locale === "ru" ? featured.titleRu : featured.titleUz) : "";
  const featuredExcerpt = featured ? (locale === "ru" ? featured.excerptRu : featured.excerptUz) : null;

  return (
    <>
      <PageHeader
        crumbs={[{ name: tp("breadcrumbHome"), href: "/" }, { name: t("title") }]}
        kicker={t("kicker")}
        title={t("title")}
        intro={t("intro")}
      />

      <section className="container-page section-y">
        {posts.length === 0 ? (
          <div className="card px-6 py-16 text-center">
            <PenLine size={30} className="mx-auto text-gold" />
            <p className="mx-auto mt-4 max-w-md text-base" style={{ color: "var(--fg-muted)" }}>
              {t("empty")}
            </p>
          </div>
        ) : (
          <>
            {/* ─────────────────── Featured — the latest post ─────────────────── */}
            {featured && (
              <article className="group grid gap-8 md:grid-cols-2 md:items-center md:gap-12">
                <Link
                  href={`/blog/${featured.slug}`}
                  tabIndex={-1}
                  aria-hidden="true"
                  className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg bg-cream shadow-md"
                >
                  {featured.coverImage ? (
                    <Image
                      src={featured.coverImage}
                      alt={featuredTitle}
                      fill
                      unoptimized
                      priority
                      sizes="(max-width: 768px) 100vw, 46vw"
                      className="object-cover transition-transform duration-500 ease-[var(--ease-expo)] group-hover:scale-[1.03]"
                    />
                  ) : (
                    // Branded stand-in — the mark on a seam-ruled cream ground.
                    <>
                      <div
                        className="absolute inset-0 opacity-[0.45]"
                        style={{
                          backgroundImage:
                            "repeating-linear-gradient(135deg, var(--color-sand) 0 1px, transparent 1px 14px)",
                        }}
                        aria-hidden="true"
                      />
                      <Logo height={56} className="relative opacity-45" />
                    </>
                  )}
                </Link>

                <div>
                  <span className="kicker">{t("featured")}</span>
                  <h2 className="mt-4 text-3xl md:text-4xl">
                    <Link href={`/blog/${featured.slug}`} className="transition-colors duration-300 hover:text-gold-dk">
                      {featuredTitle}
                    </Link>
                  </h2>
                  {featuredExcerpt && (
                    <p className="mt-4 text-base leading-relaxed" style={{ color: "var(--fg-muted)" }}>
                      {featuredExcerpt}
                    </p>
                  )}
                  {featured.publishedAt && (
                    <time className="kicker mt-5" dateTime={featured.publishedAt.toISOString()}>
                      {formatDate(featured.publishedAt, locale)}
                    </time>
                  )}
                  <Link
                    href={`/blog/${featured.slug}`}
                    className="link-seam mt-6 inline-flex items-center gap-2 py-2 text-sm"
                  >
                    {t("readMore")}
                    <ArrowRight size={17} />
                  </Link>
                </div>
              </article>
            )}

            {/* ───────────────────────── Older posts ───────────────────────── */}
            {rest.length > 0 && (
              <>
                <div className="hairline my-12 md:my-16" />
                <div className="reveal-group grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {rest.map((post) => {
                    const title = locale === "ru" ? post.titleRu : post.titleUz;
                    const excerpt = locale === "ru" ? post.excerptRu : post.excerptUz;
                    return (
                      <article key={post.id} className="card card-lift group flex flex-col p-6">
                        {post.publishedAt && (
                          <time
                            className="text-2xs font-bold uppercase tracking-[0.18em] text-gold-dk"
                            dateTime={post.publishedAt.toISOString()}
                          >
                            {formatDate(post.publishedAt, locale)}
                          </time>
                        )}
                        <h2 className="mt-3 text-xl leading-snug">
                          {/* Stretched hit area — the whole card is the link. */}
                          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
                            {title}
                          </Link>
                        </h2>
                        {excerpt && (
                          <p
                            className="mt-2.5 line-clamp-3 text-sm leading-relaxed"
                            style={{ color: "var(--fg-muted)" }}
                          >
                            {excerpt}
                          </p>
                        )}
                        <span
                          className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold"
                          style={{ color: "var(--accent-text)" }}
                        >
                          {t("readMore")}
                          <ArrowRight
                            size={16}
                            className="transition-transform duration-300 ease-[var(--ease-expo)] group-hover:translate-x-1"
                          />
                        </span>
                      </article>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}
      </section>
    </>
  );
}
