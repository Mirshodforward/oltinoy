import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/seo";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

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

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ name: tp("breadcrumbHome"), href: "/" }, { name: t("title") }]} />
      <h1 className="mt-4 text-3xl font-semibold md:text-4xl">{t("title")}</h1>
      <div className="seam mt-3 w-24" aria-hidden="true" />

      {posts.length === 0 ? (
        <p className="mt-10 text-sm" style={{ color: "var(--color-muted)" }}>
          {t("empty")}
        </p>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            const title = locale === "ru" ? post.titleRu : post.titleUz;
            const excerpt = locale === "ru" ? post.excerptRu : post.excerptUz;
            return (
              <article key={post.id} className="card p-5">
                {post.publishedAt && (
                  <time className="text-xs" style={{ color: "var(--color-bronze)" }} dateTime={post.publishedAt.toISOString()}>
                    {formatDate(post.publishedAt, locale)}
                  </time>
                )}
                <h2 className="mt-2 text-xl leading-snug">
                  <Link href={`/blog/${post.slug}`} className="hover:text-[var(--color-bronze)]">
                    {title}
                  </Link>
                </h2>
                {excerpt && (
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--color-muted)" }}>
                    {excerpt}
                  </p>
                )}
                <Link href={`/blog/${post.slug}`} className="mt-3 inline-block text-sm font-semibold" style={{ color: "var(--color-bronze)" }}>
                  {t("readMore")} →
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
