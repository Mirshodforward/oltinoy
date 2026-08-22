import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { pageMetadata, localeUrl, SITE_URL } from "@/lib/seo";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { renderMarkdown } from "@/lib/markdown";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd, articleSchema } from "@/components/seo/JsonLd";
import { ArrowLeft } from "@/components/ui/icons";

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
  const lede = locale === "ru" ? post.excerptRu : post.excerptUz;
  const excerpt = lede || title;
  const content = locale === "ru" ? post.contentRu : post.contentUz;
  const html = renderMarkdown(content);

  return (
    <>
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

      {/* The same slim cream strip every other inner page opens on — an article
          that starts straight on ivory reads as if its masthead went missing. */}
      <div className="panel-cream border-b" style={{ borderColor: "var(--line)" }}>
        <div className="container-page py-4">
          <Breadcrumbs
            items={[
              { name: t("breadcrumbHome"), href: "/" },
              { name: tb("title"), href: "/blog" },
              { name: title },
            ]}
          />
        </div>
      </div>

      <article className="container-prose py-10 md:py-16">
        {post.publishedAt && (
          <time className="kicker mt-7" dateTime={post.publishedAt.toISOString()}>
            {formatDate(post.publishedAt, locale)}
          </time>
        )}

        <h1 className="mt-4 text-4xl md:text-5xl">{title}</h1>

        {lede && (
          <p className="mt-5 text-lg leading-relaxed" style={{ color: "var(--fg-muted)" }}>
            {lede}
          </p>
        )}

        <div className="seam mt-8 w-20" aria-hidden="true" />

        {/* Cover images are plain public paths, not product variants — no loader. */}
        {post.coverImage && (
          <Image
            src={post.coverImage}
            alt={title}
            width={1200}
            height={630}
            unoptimized
            priority
            className="mt-10 w-full rounded-lg object-cover"
          />
        )}

        <div className="prose-oltinoy mt-10" dangerouslySetInnerHTML={{ __html: html }} />

        {/* ───────────────────────── Back ───────────────────────── */}
        <div className="hairline mt-14" />
        <Link href="/blog" className="link-seam mt-8 inline-flex items-center gap-2 py-2 text-sm">
          <ArrowLeft size={17} />
          {tb("backToBlog")}
        </Link>
      </article>
    </>
  );
}
