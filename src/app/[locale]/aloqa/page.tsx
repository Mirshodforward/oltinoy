import type { Metadata } from "next";
import type { ComponentType } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { getSettings } from "@/lib/settings";
import { displayPhone } from "@/lib/format";
import { PageHeader } from "@/components/ui/PageHeader";
import { JsonLd, localBusinessSchema } from "@/components/seo/JsonLd";
import {
  ArrowUpRight,
  Clock,
  MapIcon,
  MapPin,
  Megaphone,
  Phone,
  Storefront,
  Telegram,
  type IconProps,
} from "@/components/ui/icons";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return pageMetadata({ locale, path: "/aloqa", title: t("metaTitle"), description: t("metaDescription") });
}

/** One way to reach the workshop. `href` turns the row into a tappable card. */
type Method = {
  key: string;
  Icon: ComponentType<IconProps>;
  label: string;
  value: string;
  href?: string;
  badge?: string;
};

export default async function ContactPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, tp, settings] = await Promise.all([getTranslations("contact"), getTranslations("product"), getSettings()]);
  const address = locale === "ru" ? settings.addressRu : settings.addressUz;
  const phoneRaw = settings.phone.replace(/\s/g, "");

  // Telegram leads — it is where these buyers actually are, so it goes first
  // and carries the "fastest reply" badge.
  const methods: Method[] = [
    ...(settings.tgOrderUsername
      ? [
          {
            key: "order",
            Icon: Telegram,
            label: t("orderVia"),
            value: `@${settings.tgOrderUsername}`,
            href: `https://t.me/${settings.tgOrderUsername}`,
            badge: t("fastest"),
          },
        ]
      : []),
    {
      key: "phone",
      Icon: Phone,
      label: t("phone"),
      value: displayPhone(phoneRaw) || settings.phone,
      href: `tel:${phoneRaw}`,
    },
    { key: "address", Icon: MapPin, label: t("address"), value: address },
    { key: "hours", Icon: Clock, label: t("hours"), value: t("hoursValue") },
    ...(settings.tgChannelUrl
      ? [
          {
            key: "channel",
            Icon: Megaphone,
            label: t("channel"),
            value: settings.tgChannelUrl.replace(/^https?:\/\//, ""),
            href: settings.tgChannelUrl,
          },
        ]
      : []),
  ];

  return (
    <>
      <JsonLd data={localBusinessSchema(settings, locale)} />

      <PageHeader
        crumbs={[{ name: tp("breadcrumbHome"), href: "/" }, { name: t("title") }]}
        kicker={t("kicker")}
        title={t("title")}
        intro={t("intro")}
      />

      <div className="container-page section-y grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
        {/* ─────────────────── Ways to reach us ─────────────────── */}
        <ul className="reveal-group grid content-start gap-3">
          {methods.map(({ key, Icon, label, value, href, badge }) => {
            const external = href?.startsWith("http");
            const body = (
              <>
                <span
                  className="flex h-11 w-11 flex-none items-center justify-center rounded-full border"
                  style={{ borderColor: "var(--line)", color: "var(--color-gold-dk)" }}
                >
                  <Icon size={21} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span
                      className="text-2xs font-bold uppercase tracking-[0.16em]"
                      style={{ color: "var(--fg-subtle)" }}
                    >
                      {label}
                    </span>
                    {badge && <span className="badge badge-soft">{badge}</span>}
                  </span>
                  <span className="mt-1 block break-words text-lg leading-snug">{value}</span>
                </span>
                {href && (
                  <ArrowUpRight
                    size={19}
                    className="mt-1 flex-none transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                    style={{ color: "var(--color-gold-dk)" }}
                  />
                )}
              </>
            );

            return (
              <li key={key}>
                {href ? (
                  <a
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener" : undefined}
                    className="card card-lift group flex items-start gap-4 p-5"
                  >
                    {body}
                  </a>
                ) : (
                  <div className="card flex items-start gap-4 p-5">{body}</div>
                )}
              </li>
            );
          })}
        </ul>

        {/* ─────────────────── Map + shop invitation ─────────────────── */}
        <div className="flex flex-col gap-5">
          {settings.mapUrl && (
            <a
              href={settings.mapUrl}
              target="_blank"
              rel="noopener"
              className="card card-lift group relative flex min-h-[15rem] flex-1 flex-col justify-end overflow-hidden p-6 md:p-8"
            >
              <div className="arc pointer-events-none absolute -right-20 -top-28 w-80 opacity-70" aria-hidden="true" />
              <MapIcon size={30} style={{ color: "var(--color-gold-dk)" }} />
              <span className="display mt-5 flex items-center gap-2 text-xl">
                {t("map")}
                <ArrowUpRight
                  size={19}
                  className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                  style={{ color: "var(--color-gold-dk)" }}
                />
              </span>
              <span className="mt-1.5 text-sm" style={{ color: "var(--fg-muted)" }}>
                {t("mapHint")}
              </span>
            </a>
          )}

          {/* Without a configured map URL this panel is the whole column, so it
             grows to fill the row instead of leaving it half empty. */}
          <div
            className={`panel-cream relative flex flex-col overflow-hidden rounded-md border p-6 md:p-8 ${
              settings.mapUrl ? "" : "flex-1 justify-center"
            }`}
            style={{ borderColor: "var(--line)" }}
          >
            {!settings.mapUrl && (
              <div className="arc pointer-events-none absolute -right-24 -top-24 w-72 opacity-70" aria-hidden="true" />
            )}
            <Storefront size={30} className="relative" style={{ color: "var(--color-gold-dk)" }} />
            <h2 className="relative mt-5 text-2xl">{t("visitTitle")}</h2>
            <div className="seam relative mt-4 w-16" aria-hidden="true" />
            <p className="relative mt-4 text-sm leading-relaxed" style={{ color: "var(--fg-muted)" }}>
              {t("visitText")}
            </p>
            <p className="relative mt-5 flex items-start gap-2.5 text-sm font-semibold">
              <MapPin size={17} className="mt-0.5 flex-none" style={{ color: "var(--color-gold-dk)" }} />
              {address}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
