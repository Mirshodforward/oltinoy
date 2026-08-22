"use client";

import { Link, usePathname } from "@/i18n/navigation";

/** Desktop nav link. The active item carries the signature dashed-gold seam. */
export function ActiveNavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      data-active={active || undefined}
      className="group relative px-3.5 py-2.5 text-sm font-medium text-mocha transition-colors hover:text-ink data-[active]:text-ink"
    >
      {label}
      <span
        className="seam-strong absolute inset-x-3.5 bottom-1 origin-right scale-x-0 transition-transform duration-300 ease-[var(--ease-expo)] group-hover:origin-left group-hover:scale-x-100 group-data-[active]:origin-left group-data-[active]:scale-x-100"
        aria-hidden="true"
      />
    </Link>
  );
}
