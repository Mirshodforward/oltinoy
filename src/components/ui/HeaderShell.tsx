"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * Sticky header chrome. Below 12px of scroll the header sits flush on the page
 * with the ink utility bar showing; past that the utility bar collapses to zero
 * height and the main bar picks up a blurred, elevated surface — so the brand
 * stays present without eating vertical space while browsing the catalogue.
 */
export function HeaderShell({ utility, children }: { utility: ReactNode; children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header data-scrolled={scrolled || undefined} className="sticky top-0 z-50 group/hdr">
      {/* Collapsing to height:0 hides the bar visually but leaves its phone and
         Telegram links in the tab order — `inert` and `visibility` are what
         actually take them out, and they must agree with `aria-hidden`. */}
      <div
        className="on-dark overflow-hidden bg-ink transition-[height,opacity] duration-300 ease-[var(--ease-expo)]"
        style={{
          height: scrolled ? 0 : 36,
          opacity: scrolled ? 0 : 1,
          visibility: scrolled ? "hidden" : "visible",
        }}
        aria-hidden={scrolled}
        inert={scrolled || undefined}
      >
        {utility}
      </div>

      <div
        className="border-b transition-[background-color,box-shadow,border-color] duration-300"
        style={{
          background: scrolled ? "color-mix(in srgb, var(--color-ivory) 88%, transparent)" : "var(--color-ivory)",
          backdropFilter: scrolled ? "blur(14px) saturate(1.4)" : undefined,
          WebkitBackdropFilter: scrolled ? "blur(14px) saturate(1.4)" : undefined,
          borderColor: scrolled ? "var(--color-sand)" : "transparent",
          boxShadow: scrolled ? "var(--shadow-sm)" : "none",
        }}
      >
        {children}
      </div>

      {/* The signature seam pins the header to the page. */}
      <div className="seam" aria-hidden="true" />
    </header>
  );
}
