"use client";

import { Link, usePathname } from "@/i18n/navigation";

/** Desktop nav link with the signature dashed-gold "seam" under the active item. */
export function ActiveNavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className="relative px-3 py-2 text-sm font-medium transition-opacity hover:opacity-100"
      style={{ color: "var(--color-ivory)", opacity: active ? 1 : 0.75 }}
    >
      {label}
      {active && (
        <span
          className="seam-active absolute inset-x-3 bottom-1 block"
          aria-hidden="true"
        />
      )}
    </Link>
  );
}
