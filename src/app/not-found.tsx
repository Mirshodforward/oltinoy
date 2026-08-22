import Link from "next/link";
import { fraunces, manrope } from "./fonts";

/**
 * Root fallback for pathnames outside the [locale] tree. It renders its own
 * document shell (no locale layout sits above it) and has no translations, so
 * the copy stays hardcoded in uz (mirroring the `notFound.*` messages) while
 * the styling comes from the shared design system. The font variables are set
 * here by hand because there is no locale <html> above this page.
 */
export default function RootNotFound() {
  return (
    <html lang="uz" className={`${fraunces.variable} ${manrope.variable}`}>
      <body>
        <section className="relative overflow-hidden">
          <div
            className="arc pointer-events-none absolute left-1/2 top-6 w-[24rem] -translate-x-1/2 opacity-60 md:top-10 md:w-[38rem]"
            aria-hidden="true"
          />

          <div className="container-page relative flex flex-col items-center py-24 text-center md:py-32">
            {/* eslint-disable-next-line @next/next/no-img-element -- raw html/body shell outside the [locale] tree */}
            <img src="/oltinoy_logo.png" alt="Oltinoy Collection" width={64} height={63} />

            <span className="kicker kicker-center mt-8">Xatolik 404</span>
            <span className="price mt-6 block text-6xl leading-none md:text-[8.5rem]" style={{ color: "var(--color-gold)" }}>
              404
            </span>
            <div className="seam mt-8 w-24" aria-hidden="true" />

            <h1 className="mt-8 text-3xl md:text-4xl">Sahifa topilmadi</h1>
            <p className="mt-4 max-w-md text-base leading-relaxed" style={{ color: "var(--fg-muted)" }}>
              Kechirasiz, siz qidirgan sahifa mavjud emas.
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link href="/" className="btn btn-primary btn-lg">
                Bosh sahifaga qaytish
              </Link>
              <Link href="/katalog" className="btn btn-outline btn-lg">
                Katalogga o&apos;tish
              </Link>
            </div>
          </div>
        </section>
      </body>
    </html>
  );
}
