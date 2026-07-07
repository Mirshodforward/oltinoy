"use client";

import { useState, useEffect } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { LangSwitcher } from "./LangSwitcher";

type NavItem = { href: string; label: string };

export function MobileNav({ items, menuLabel, closeLabel }: { items: NavItem[]; menuLabel: string; closeLabel: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock scroll while open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={menuLabel}
        aria-expanded={open}
        className="flex h-11 w-11 items-center justify-center rounded-full"
        style={{ color: "var(--color-ivory)" }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50" style={{ background: "var(--color-ink)" }}>
          <div className="container-page flex h-16 items-center justify-between">
            <span className="text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--color-ivory)" }}>
              {menuLabel}
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={closeLabel}
              className="flex h-11 w-11 items-center justify-center rounded-full"
              style={{ color: "var(--color-ivory)" }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="6" y1="18" x2="18" y2="6" />
              </svg>
            </button>
          </div>
          <nav className="container-page mt-6 flex flex-col gap-1">
            {items.map((it) => (
              <Link
                key={it.href}
                href={it.href}
                className="border-b py-4 text-xl font-medium"
                style={{ color: "var(--color-ivory)", borderColor: "rgba(247,243,236,0.12)" }}
              >
                {it.label}
              </Link>
            ))}
            <div className="mt-6">
              <LangSwitcher light />
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
