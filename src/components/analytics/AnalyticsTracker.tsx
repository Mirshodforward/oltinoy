"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { flush, track, trackClick, trackPageview } from "@/lib/analytics/client";

/** Interactive things worth a row in the report, in priority order. */
const CLICKABLE = "[data-track],button,a[href],[role='button'],summary";

/**
 * Derives the label the dashboard will group by. An explicit `data-track` always
 * wins; otherwise we fall back to what a person would call the control — its
 * accessible name, then its visible text.
 */
function labelFor(el: HTMLElement): string {
  const explicit = el.getAttribute("data-track");
  if (explicit) return explicit.slice(0, 60);

  const aria = el.getAttribute("aria-label") ?? el.getAttribute("title");
  if (aria) return aria.trim().slice(0, 60);

  const text = (el.innerText || el.textContent || "").replace(/\s+/g, " ").trim();
  if (text) return text.slice(0, 60);

  const link = el.closest("a")?.getAttribute("href");
  if (link) return link.slice(0, 60);

  return el.tagName.toLowerCase();
}

function productIdFor(el: HTMLElement): number | null {
  const holder = el.closest<HTMLElement>("[data-product-id]");
  if (!holder) return null;
  const id = Number(holder.dataset.productId);
  return Number.isFinite(id) && id > 0 ? id : null;
}

/**
 * Site-wide tracker: one pageview per route change, every meaningful click, and
 * a single "read to the end" signal per page. Mounted once in the locale layout.
 *
 * Click capture is delegated from the document, so nothing in the storefront has
 * to be instrumented — adding `data-track="…"` to an element only overrides the
 * label it would otherwise be given.
 */
export function AnalyticsTracker() {
  const pathname = usePathname();
  const deepRead = useRef(false);

  // ── Pageviews ────────────────────────────────────────────────────────────
  useEffect(() => {
    deepRead.current = false;
    // Let the route settle so document.title belongs to the new page.
    const id = window.setTimeout(() => trackPageview(pathname, document.title), 120);
    return () => window.clearTimeout(id);
  }, [pathname]);

  // ── Clicks, scroll depth, flush-on-hide ──────────────────────────────────
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const el = target?.closest<HTMLElement>(CLICKABLE);
      if (!el || el.hasAttribute("data-track-ignore")) return;

      const meta: Record<string, string> = { el: el.tagName.toLowerCase() };
      const href = el.getAttribute("href");
      if (href) {
        meta.href = href.slice(0, 200);
        if (/^https?:\/\//i.test(href) && !href.startsWith(window.location.origin)) {
          meta.outbound = new URL(href).hostname;
        }
      }
      trackClick(labelFor(el), window.location.pathname, productIdFor(el), meta);
    };

    const onScroll = () => {
      if (deepRead.current) return;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable < 400) return; // short pages are not a reading signal
      if ((window.scrollY + window.innerHeight) / doc.scrollHeight >= 0.9) {
        deepRead.current = true;
        track("oxirigacha_o'qildi");
      }
    };

    const onHide = () => {
      if (document.visibilityState === "hidden") flush(true);
    };

    document.addEventListener("click", onClick, { capture: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", () => flush(true));

    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onHide);
      flush(true);
    };
  }, []);

  return null;
}
