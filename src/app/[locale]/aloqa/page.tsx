import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { getSettings } from "@/lib/settings";
import { displayPhone } from "@/lib/format";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd, localBusinessSchema } from "@/components/seo/JsonLd";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return pageMetadata({ locale, path: "/aloqa", title: t("metaTitle"), description: t("metaDescription") });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, tp, settings] = await Promise.all([getTranslations("contact"), getTranslations("product"), getSettings()]);
  const address = locale === "ru" ? settings.addressRu : settings.addressUz;
  const phoneRaw = settings.phone.replace(/\s/g, "");

  const rows = [
    { icon: "📍", label: t("address"), value: address },
    {
      icon: "📞",
      label: t("phone"),
      value: displayPhone(phoneRaw) || settings.phone,
      href: `tel:${phoneRaw}`,
    },
    { icon: "🕐", label: t("hours"), value: t("hoursValue") },
    settings.tgOrderUsername
      ? { icon: "✈️", label: t("orderVia"), value: `@${settings.tgOrderUsername}`, href: `https://t.me/${settings.tgOrderUsername}` }
      : null,
    settings.tgChannelUrl ? { icon: "📣", label: t("channel"), value: settings.tgChannelUrl, href: settings.tgChannelUrl } : null,
  ].filter(Boolean) as { icon: string; label: string; value: string; href?: string }[];

  return (
    <div className="container-page py-8">
      <JsonLd data={localBusinessSchema(settings, locale)} />
      <Breadcrumbs items={[{ name: tp("breadcrumbHome"), href: "/" }, { name: t("title") }]} />
      <h1 className="mt-4 text-3xl font-semibold md:text-4xl">{t("title")}</h1>
      <div className="seam mt-3 w-24" aria-hidden="true" />

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <dl className="space-y-5">
          {rows.map((r) => (
            <div key={r.label} className="flex gap-3">
              <span className="text-xl" aria-hidden="true">
                {r.icon}
              </span>
              <div>
                <dt className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-bronze)" }}>
                  {r.label}
                </dt>
                <dd className="mt-0.5">
                  {r.href ? (
                    <a href={r.href} target={r.href.startsWith("http") ? "_blank" : undefined} rel="noopener" className="hover:text-[var(--color-bronze)]">
                      {r.value}
                    </a>
                  ) : (
                    r.value
                  )}
                </dd>
              </div>
            </div>
          ))}
        </dl>

        {settings.mapUrl && (
          <a
            href={settings.mapUrl}
            target="_blank"
            rel="noopener"
            className="card flex items-center justify-center p-10 text-center transition-colors hover:border-[var(--color-gold)]"
            style={{ background: "var(--color-ivory-deep)" }}
          >
            <span>
              🗺️
              <br />
              <span className="mt-2 inline-block font-semibold">{t("map")}</span>
            </span>
          </a>
        )}
      </div>
    </div>
  );
}
