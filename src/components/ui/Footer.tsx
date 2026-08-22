import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LogoLockup } from "./Logo";
import { LangSwitcher } from "./LangSwitcher";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { displayPhone } from "@/lib/format";
import { MapPin, Phone, Clock, Telegram, Instagram, ArrowRight, Moon } from "./icons";

async function getCategories() {
  try {
    return await db.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
  } catch {
    return [];
  }
}

export async function Footer() {
  const [t, locale, settings, categories] = await Promise.all([
    getTranslations(),
    getLocale(),
    getSettings(),
    getCategories(),
  ]);

  const phoneRaw = (settings.phone ?? "").replace(/\s/g, "");
  const address = locale === "ru" ? settings.addressRu : settings.addressUz;
  const orderUrl = settings.tgOrderUsername ? `https://t.me/${settings.tgOrderUsername}` : "";

  const pages = [
    { href: "/katalog", label: t("nav.catalog") },
    { href: "/blog", label: t("nav.blog") },
    { href: "/biz-haqimizda", label: t("nav.about") },
    { href: "/aloqa", label: t("nav.contact") },
  ];

  return (
    <footer className="on-dark relative overflow-hidden bg-ink">
      {/* Brand ornament — the golden moon, oversized and mostly cropped. */}
      <div
        className="arc pointer-events-none absolute -right-24 -top-32 hidden w-[26rem] md:block"
        aria-hidden="true"
      />

      {/* Closing call to action */}
      <div className="container-page relative border-b py-12 md:py-16" style={{ borderColor: "var(--line)" }}>
        <div className="flex flex-col items-start gap-7 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <span className="kicker">
              <Moon size={13} />
              {t("brand.tagline")}
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl">{t("footer.ctaTitle")}</h2>
            <p className="mt-3 text-base" style={{ color: "var(--fg-muted)" }}>
              {t("footer.ctaText")}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link href="/katalog" className="btn btn-gold btn-lg">
              {t("nav.catalog")}
              <ArrowRight size={17} />
            </Link>
            {orderUrl && (
              <a href={orderUrl} target="_blank" rel="noopener" className="btn btn-outline btn-lg">
                <Telegram size={17} />
                {t("nav.order")}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Directory */}
      <div className="container-page grid gap-10 py-12 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-4">
          <LogoLockup height={44} />
          <p className="mt-5 max-w-xs text-sm leading-relaxed" style={{ color: "var(--fg-muted)" }}>
            {t("footer.about")}
          </p>
          {(settings.tgChannelUrl || settings.instagramUrl) && (
            <div className="mt-6 flex items-center gap-2">
              {settings.tgChannelUrl && (
                <a
                  href={settings.tgChannelUrl}
                  target="_blank"
                  rel="noopener"
                  aria-label={t("contact.channel")}
                  className="btn-icon border"
                  style={{ borderColor: "var(--line)" }}
                >
                  <Telegram size={18} />
                </a>
              )}
              {settings.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener"
                  aria-label="Instagram"
                  className="btn-icon border"
                  style={{ borderColor: "var(--line)" }}
                >
                  <Instagram size={18} />
                </a>
              )}
            </div>
          )}
        </div>

        <nav className="md:col-span-3" aria-label={t("footer.categories")}>
          <h2 className="kicker mb-4">{t("footer.categories")}</h2>
          <ul className="space-y-2.5 text-sm">
            {categories.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/katalog/${c.slug}`}
                  className="transition-colors hover:text-gold-lt"
                  style={{ color: "var(--fg-muted)" }}
                >
                  {locale === "ru" ? c.nameRu : c.nameUz}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="md:col-span-2" aria-label={t("footer.pages")}>
          <h2 className="kicker mb-4">{t("footer.pages")}</h2>
          <ul className="space-y-2.5 text-sm">
            {pages.map((it) => (
              <li key={it.href}>
                <Link href={it.href} className="transition-colors hover:text-gold-lt" style={{ color: "var(--fg-muted)" }}>
                  {it.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3">
          <h2 className="kicker mb-4">{t("footer.contact")}</h2>
          <ul className="space-y-3.5 text-sm" style={{ color: "var(--fg-muted)" }}>
            <li className="flex gap-2.5">
              <MapPin size={16} className="mt-0.5 shrink-0" style={{ color: "var(--color-gold-lt)" }} />
              <span>{address}</span>
            </li>
            {phoneRaw && (
              <li className="flex gap-2.5">
                <Phone size={16} className="mt-0.5 shrink-0" style={{ color: "var(--color-gold-lt)" }} />
                <a href={`tel:${phoneRaw}`} className="transition-colors hover:text-gold-lt">
                  {displayPhone(phoneRaw) || settings.phone}
                </a>
              </li>
            )}
            <li className="flex gap-2.5">
              <Clock size={16} className="mt-0.5 shrink-0" style={{ color: "var(--color-gold-lt)" }} />
              <span>{t("contact.hoursValue")}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="seam" aria-hidden="true" />

      <div
        className="container-page flex flex-col gap-4 py-6 text-xs md:flex-row md:items-center md:justify-between"
        style={{ color: "var(--fg-subtle)" }}
      >
        <span>
          © {new Date().getFullYear()} Oltinoy Collection. {t("footer.rights")}
        </span>
        <div className="flex items-center gap-5">
          <span className="hidden sm:inline">{t("footer.madeWith")}</span>
          <LangSwitcher />
        </div>
      </div>
    </footer>
  );
}
