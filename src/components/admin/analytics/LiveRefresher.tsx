"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Keeps the "hozir saytda" figure honest by re-running the page's server
 * queries on a slow interval — and only while the tab is actually being looked
 * at, so a forgotten admin tab is not a standing load on the database.
 */
export function LiveRefresher({ everyMs = 60_000 }: { everyMs?: number }) {
  const router = useRouter();

  useEffect(() => {
    const id = setInterval(() => {
      if (document.visibilityState === "visible") router.refresh();
    }, everyMs);
    return () => clearInterval(id);
  }, [router, everyMs]);

  return null;
}
