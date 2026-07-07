"use client";

import { useEffect } from "react";

/** Fire-and-forget view counter so the product page stays fully static (§7.1). */
export function ViewBeacon({ slug }: { slug: string }) {
  useEffect(() => {
    const key = `viewed:${slug}`;
    // Debounce within a session so a reload doesn't double-count.
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    try {
      const body = JSON.stringify({ slug });
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/view", new Blob([body], { type: "application/json" }));
      } else {
        fetch("/api/view", { method: "POST", body, keepalive: true, headers: { "Content-Type": "application/json" } });
      }
    } catch {
      // best-effort only
    }
  }, [slug]);

  return null;
}
