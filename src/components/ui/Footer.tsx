import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Logo } from "./Logo";
import { LangSwitcher } from "./LangSwitcher";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { displayPhone } from "@/lib/format";

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
  const phone = settings.phone ?? "";
  const address = locale === "ru" ? settings.addressRu : settings.addressUz;

  return (
    <footer style={{ background: "var(--color-ink)", color: "var(--color-ivory)" }}>
      <div className="seam" aria-hidden="true" />
      <div className="container-page grid gap-10 py-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo height={52} />
          <p className="mt-4 max-w-xs text-sm leading-relaxed" style={{ color: "rgba(247,243,236,0.7)" }}>
            {t("footer.about")}
          </p>
        </div>

        <nav aria-label={t("footer.categories")}>
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-gold)" }}>
            {t("footer.categories")}
          </h2>
          <ul className="space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/katalog/${c.slug}`}
                  className="transition-opacity hover:opacity-100"
                  style={{ color: "rgba(247,243,236,0.8)" }}
                >
                  {locale === "ru" ? c.nameRu : c.nameUz}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={t("footer.pages")}>
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-gold)" }}>
            {t("footer.pages")}
          </h2>
          <ul className="space-y-2 text-sm">
            {[
              { href: "/katalog", label: t("nav.catalog") },
              { href: "/blog", label: t("nav.blog") },
              { href: "/biz-haqimizda", label: t("nav.about") },
              { href: "/aloqa", label: t("nav.contact") },
            ].map((it) => (
              <li key={it.href}>
                <Link href={it.href} className="hover:opacity-100" style={{ color: "rgba(247,243,236,0.8)" }}>
                  {it.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-gold)" }}>
            {t("footer.contact")}
          </h2>
          <ul className="space-y-2 text-sm" style={{ color: "rgba(247,243,236,0.8)" }}>
            <li>{address}</li>
            {phone && (
              <li>
                <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:opacity-100">
                  {displayPhone(phone.replace(/\s/g, "")) || phone}
                </a>
              </li>
            )}
            {settings.tgChannelUrl && (
              <li>
                <a href={settings.tgChannelUrl} target="_blank" rel="noopener" className="hover:opacity-100">
                  {t("contact.channel")}
                </a>
              </li>
            )}
          </ul>
          <div className="mt-5">
            <LangSwitcher light />
          </div>
        </div>
      </div>

      <div className="container-page flex flex-col gap-2 border-t py-5 text-xs md:flex-row md:items-center md:justify-between" style={{ borderColor: "rgba(247,243,236,0.12)", color: "rgba(247,243,236,0.6)" }}>
        <span>© {new Date().getFullYear()} Oltinoy Collection. {t("footer.rights")}</span>
        <span>{t("footer.madeWith")}</span>
      </div>
    </footer>
  );
}
