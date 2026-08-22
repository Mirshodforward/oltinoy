import type { Metadata } from "next";
import type { ReactNode } from "react";
import { fraunces, manrope } from "../fonts";

export const metadata: Metadata = {
  title: "Admin — Oltinoy Collection",
  robots: { index: false, follow: false },
};

// Admin is always Uzbek and outside the i18n tree; it renders its own shell.
// Ground and text come from the design tokens, so the panel keeps the same
// ivory/espresso temperature as the storefront.
export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uz" className={`${fraunces.variable} ${manrope.variable}`}>
      <body className="bg-ivory text-ink">{children}</body>
    </html>
  );
}
