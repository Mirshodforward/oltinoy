import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMetadata, localeUrl, SITE_URL } from "@/lib/seo";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { renderMarkdown } from "@/lib/markdown";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd, articleSchema } from "@/components/seo/JsonLd";

export const revalidate = 3600;

async function getPost(slug: string) {
  try {
    return await db.post.findFirst({ where: { slug, isPublished: true } });
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const posts = await db.post.findMany({ where: { isPublished: true }, select: { slug: true } });
    return posts.map((p) => ({ slug: p.slug }));
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
  const post = await getPost(slug);
  if (!post) return {};
  const title = locale === "ru" ? post.titleRu : post.titleUz;
  const excerpt = (locale === "ru" ? post.excerptRu : post.excerptUz) || title;
  return pageMetadata({
    locale,
    path: `/blog/${slug}`,
    title: `${title} | Oltinoy Collection`.slice(0, 70),
    description: excerpt.slice(0, 160),
    type: "article",
    images: post.coverImage ? [{ url: `${SITE_URL}${post.coverImage}`, alt: title }] : undefined,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const post = await getPost(slug);
  if (!post) notFound();

  const [t, tb] = await Promise.all([getTranslations("product"), getTranslations("blog")]);
  const title = locale === "ru" ? post.titleRu : post.titleUz;
  const excerpt = (locale === "ru" ? post.excerptRu : post.excerptUz) || title;
  const content = locale === "ru" ? post.contentRu : post.contentUz;
  const html = renderMarkdown(content);

  return (
    <div className="container-page py-8">
      <JsonLd
        data={articleSchema({
          headline: title,
          description: excerpt,
          image: post.coverImage ? `${SITE_URL}${post.coverImage}` : null,
          datePublished: (post.publishedAt ?? post.createdAt).toISOString(),
          url: localeUrl(locale, `/blog/${slug}`),
          locale,
        })}
      />
      <Breadcrumbs items={[{ name: t("breadcrumbHome"), href: "/" }, { name: tb("title"), href: "/blog" }, { name: title }]} />

      <article className="mx-auto mt-6 max-w-2xl">
        {post.publishedAt && (
          <time className="text-xs" style={{ color: "var(--color-bronze)" }} dateTime={post.publishedAt.toISOString()}>
            {tb("publishedOn")}: {formatDate(post.publishedAt, locale)}
          </time>
        )}
        <h1 className="mt-2 text-3xl font-semibold leading-tight md:text-4xl">{title}</h1>
        <div className="seam mt-4 w-24" aria-hidden="true" />
        <div
          className="prose-oltinoy mt-6 space-y-4 text-[0.975rem] leading-relaxed"
          style={{ color: "var(--color-ink-soft)" }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>
    </div>
  );
}
