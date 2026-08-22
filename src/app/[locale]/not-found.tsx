import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "@/components/ui/icons";

export default async function LocaleNotFound() {
  const t = await getTranslations("notFound");

  return (
    <section className="relative overflow-hidden">
      {/* The golden moon, cropped — the only ornament this page needs. */}
      <div
        className="arc pointer-events-none absolute left-1/2 top-6 w-[24rem] -translate-x-1/2 opacity-60 md:top-10 md:w-[38rem]"
        aria-hidden="true"
      />

      <div className="container-page relative flex flex-col items-center py-24 text-center md:py-32">
        <span className="kicker kicker-center">{t("kicker")}</span>

        <span className="price mt-6 block text-6xl leading-none md:text-[8.5rem]" style={{ color: "var(--color-gold)" }}>
          404
        </span>
        <div className="seam mt-8 w-24" aria-hidden="true" />

        <h1 className="mt-8 text-3xl md:text-4xl">{t("title")}</h1>
        <p className="mt-4 max-w-md text-base leading-relaxed" style={{ color: "var(--fg-muted)" }}>
          {t("text")}
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary btn-lg">
            {t("cta")}
            <ArrowRight size={18} />
          </Link>
          <Link href="/katalog" className="btn btn-outline btn-lg">
            {t("ctaCatalog")}
          </Link>
        </div>
      </div>
    </section>
  );
}
