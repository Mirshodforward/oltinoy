"use client";

import { useState, useEffect, useRef } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { useDialog } from "./useDialog";
import { LangSwitcher } from "./LangSwitcher";
import { Logo } from "./Logo";
import { Menu, Close, ArrowUpRight, Phone, MapPin, Telegram } from "./icons";

type NavItem = { href: string; label: string };

/**
 * Full-screen drawer. Items rise in sequence on open so the panel reads as one
 * deliberate motion rather than a page swap, and the contact block sits at the
 * bottom because on a phone "call / write on Telegram" *is* the primary action.
 */
export function MobileNav({
  items,
  menuLabel,
  closeLabel,
  phone,
  phoneDisplay,
  address,
  orderUrl,
  orderLabel,
}: {
  items: NavItem[];
  menuLabel: string;
  closeLabel: string;
  phone: string;
  phoneDisplay: string;
  address: string;
  orderUrl: string;
  orderLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close on route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useDialog({ open, panelRef, triggerRef, onClose: () => setOpen(false) });

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label={menuLabel}
        aria-expanded={open}
        className="btn-icon"
      >
        <Menu size={22} />
      </button>

      {open && (
        <div
          ref={panelRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-label={menuLabel}
          className="on-dark fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-ink outline-none"
        >
          <div className="container-page flex shrink-0 items-center justify-between" style={{ height: "var(--header-h)" }}>
            <Logo height={36} />
            <button type="button" onClick={() => setOpen(false)} aria-label={closeLabel} className="btn-icon">
              <Close size={24} />
            </button>
          </div>

          <div className="seam" aria-hidden="true" />

          <nav className="container-page flex flex-1 flex-col pt-4" aria-label={menuLabel}>
            {items.map((it, i) => {
              const active = it.href === "/" ? pathname === "/" : pathname.startsWith(it.href);
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  aria-current={active ? "page" : undefined}
                  className="group flex items-center justify-between border-b py-4 font-[family-name:var(--font-display)] text-3xl transition-colors"
                  style={{
                    color: active ? "var(--color-gold-lt)" : "var(--fg)",
                    borderColor: "var(--line)",
                    animation: `rise .5s var(--ease-expo) both`,
                    animationDelay: `${60 + i * 45}ms`,
                  }}
                >
                  {it.label}
                  <ArrowUpRight
                    size={22}
                    className="opacity-0 transition-opacity group-hover:opacity-60"
                    style={{ color: "var(--color-gold-lt)" }}
                  />
                </Link>
              );
            })}

            <div
              className="mt-auto flex flex-col gap-4 py-8"
              style={{ animation: "rise .5s var(--ease-expo) both", animationDelay: `${60 + items.length * 45}ms` }}
            >
              {orderUrl && (
                <a href={orderUrl} target="_blank" rel="noopener" className="btn btn-gold btn-lg btn-block">
                  <Telegram size={18} />
                  {orderLabel}
                </a>
              )}

              <ul className="space-y-2.5 text-sm" style={{ color: "var(--fg-muted)" }}>
                {phone && (
                  <li>
                    <a href={`tel:${phone}`} className="flex items-center gap-2.5">
                      <Phone size={16} style={{ color: "var(--color-gold-lt)" }} />
                      {phoneDisplay}
                    </a>
                  </li>
                )}
                <li className="flex items-start gap-2.5">
                  <MapPin size={16} className="mt-0.5 shrink-0" style={{ color: "var(--color-gold-lt)" }} />
                  <span>{address}</span>
                </li>
              </ul>

              <LangSwitcher />
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
