import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Logo } from "./Logo";
import { LangSwitcher } from "./LangSwitcher";
import { MobileNav } from "./MobileNav";
import { ActiveNavLink } from "./ActiveNavLink";

export async function Header() {
  const t = await getTranslations("nav");
  const items = [
    { href: "/", label: t("home") },
    { href: "/katalog", label: t("catalog") },
    { href: "/blog", label: t("blog") },
    { href: "/biz-haqimizda", label: t("about") },
    { href: "/aloqa", label: t("contact") },
  ];

  return (
    <header style={{ background: "var(--color-ink)" }}>
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center" aria-label="Oltinoy Collection">
          <Logo height={44} />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Asosiy navigatsiya">
          {items.map((it) => (
            <ActiveNavLink key={it.href} href={it.href} label={it.label} />
          ))}
        </nav>

        <div className="hidden md:block">
          <LangSwitcher light />
        </div>

        <MobileNav items={items} menuLabel={t("menu")} closeLabel={t("close")} />
      </div>
    </header>
  );
}
