import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LogoLockup } from "./Logo";
import { LangSwitcher } from "./LangSwitcher";
import { MobileNav } from "./MobileNav";
import { ActiveNavLink } from "./ActiveNavLink";
import { HeaderShell } from "./HeaderShell";
import { getSettings } from "@/lib/settings";
import { displayPhone } from "@/lib/format";
import { MapPin, Phone, Telegram, Search } from "./icons";

export async function Header() {
  const [t, locale, settings] = await Promise.all([getTranslations("nav"), getLocale(), getSettings()]);

  const items = [
    { href: "/", label: t("home") },
    { href: "/katalog", label: t("catalog") },
    { href: "/blog", label: t("blog") },
    { href: "/biz-haqimizda", label: t("about") },
    { href: "/aloqa", label: t("contact") },
  ];

  const phoneRaw = (settings.phone ?? "").replace(/\s/g, "");
  const address = locale === "ru" ? settings.addressRu : settings.addressUz;
  const orderUrl = settings.tgOrderUsername
    ? `https://t.me/${settings.tgOrderUsername}`
    : settings.tgChannelUrl || "";

  return (
    <HeaderShell
      utility={
        <div className="container-page flex h-9 items-center justify-between gap-6 text-2xs">
          <p className="flex min-w-0 items-center gap-1.5 truncate" style={{ color: "var(--fg-muted)" }}>
            <MapPin size={13} />
            <span className="truncate">{address}</span>
          </p>
          <div className="flex shrink-0 items-center gap-4">
            {phoneRaw && (
              <a
                href={`tel:${phoneRaw}`}
                className="hidden items-center gap-1.5 font-semibold transition-colors hover:text-gold-lt sm:flex"
                style={{ color: "var(--fg-muted)" }}
              >
                <Phone size={13} />
                {displayPhone(phoneRaw) || settings.phone}
              </a>
            )}
            {settings.tgChannelUrl && (
              <a
                href={settings.tgChannelUrl}
                target="_blank"
                rel="noopener"
                className="flex items-center gap-1.5 font-semibold transition-colors hover:text-gold-lt"
                style={{ color: "var(--fg-muted)" }}
              >
                <Telegram size={13} />
                {t("channel")}
              </a>
            )}
          </div>
        </div>
      }
    >
      <div className="container-page flex items-center justify-between gap-4" style={{ height: "var(--header-h)" }}>
        <Link href="/" aria-label="Oltinoy Collection" className="shrink-0">
          <LogoLockup height={40} priority />
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label={t("primary")}>
          {items.map((it) => (
            <ActiveNavLink key={it.href} href={it.href} label={it.label} />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/katalog" className="btn-icon hidden md:inline-flex" aria-label={t("searchCatalog")}>
            <Search size={19} />
          </Link>

          <div className="hidden md:block">
            <LangSwitcher />
          </div>

          {orderUrl && (
            <a href={orderUrl} target="_blank" rel="noopener" className="btn btn-gold btn-sm hidden xl:inline-flex">
              <Telegram size={15} />
              {t("order")}
            </a>
          )}

          <MobileNav
            items={items}
            menuLabel={t("menu")}
            closeLabel={t("close")}
            phone={phoneRaw}
            phoneDisplay={displayPhone(phoneRaw) || settings.phone}
            address={address}
            orderUrl={orderUrl}
            orderLabel={t("order")}
          />
        </div>
      </div>
    </HeaderShell>
  );
}
