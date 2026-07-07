import type { Metadata } from "next";
import type { ReactNode } from "react";
import { fraunces, manrope } from "../fonts";

export const metadata: Metadata = {
  title: "Admin — Oltinoy Collection",
  robots: { index: false, follow: false },
};

// Admin is always Uzbek and outside the i18n tree; it renders its own shell.
export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uz" className={`${fraunces.variable} ${manrope.variable}`}>
      <body style={{ background: "var(--color-ivory)", color: "var(--color-ink)" }}>{children}</body>
    </html>
  );
}
