import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function LocaleNotFound() {
  const t = await getTranslations("notFound");
  return (
    <div className="container-page flex flex-col items-center justify-center py-24 text-center">
      <span className="price text-6xl font-semibold" style={{ color: "var(--color-gold)" }}>
        404
      </span>
      <div className="seam my-5 w-24" aria-hidden="true" />
      <h1 className="text-2xl font-semibold">{t("title")}</h1>
      <p className="mt-2 max-w-md text-sm" style={{ color: "var(--color-muted)" }}>
        {t("text")}
      </p>
      <Link href="/" className="btn btn-gold mt-6">
        {t("cta")}
      </Link>
    </div>
  );
}
