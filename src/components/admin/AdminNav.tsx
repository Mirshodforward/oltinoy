"use client";

import type { ReactElement } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Dashboard,
  Bag,
  Inbox,
  Folder,
  PenLine,
  Megaphone,
  Settings,
  TrendingUp,
  type IconProps,
} from "@/components/ui/icons";

type Item = {
  href: string;
  label: string;
  icon: (p: IconProps) => ReactElement;
  exact?: boolean;
};

const ITEMS: Item[] = [
  { href: "/admin", label: "Boshqaruv paneli", icon: Dashboard, exact: true },
  { href: "/admin/mahsulotlar", label: "Mahsulotlar", icon: Bag },
  { href: "/admin/bronlar", label: "Bronlar", icon: Inbox },
  { href: "/admin/analitika", label: "Analitika", icon: TrendingUp },
  { href: "/admin/kategoriyalar", label: "Kategoriyalar", icon: Folder },
  { href: "/admin/postlar", label: "Blog postlar", icon: PenLine },
  { href: "/admin/broadcast", label: "Broadcast", icon: Megaphone },
  { href: "/admin/sozlamalar", label: "Sozlamalar", icon: Settings },
];

/** The dashboard matches exactly; every other section owns its subtree. */
function isActive(pathname: string, item: Item) {
  return item.exact ? pathname === item.href : pathname.startsWith(item.href);
}

/**
 * Admin sections. Both variants live on the ink chrome: a stacked column in the
 * desktop sidebar, a horizontal snap rail under the compact bar on phones. Both
 * call sites wrap this in `.on-dark`, so the inactive items just read the
 * contextual tokens — muted foreground, brightening to full `--fg` on hover over
 * a 10% wash. The active section carries the gold, so the current place is
 * readable at a glance.
 */
export function AdminNav({ variant = "sidebar" }: { variant?: "sidebar" | "rail" }) {
  const pathname = usePathname();
  const rail = variant === "rail";

  return (
    <nav aria-label="Boshqaruv bo'limlari" className={rail ? "rail no-scrollbar" : "flex flex-col gap-0.5"}>
      {ITEMS.map((it) => {
        const active = isActive(pathname, it);
        const Icon = it.icon;
        return (
          <Link
            key={it.href}
            href={it.href}
            aria-current={active ? "page" : undefined}
            className={[
              "flex min-h-11 items-center gap-2.5 rounded-md px-3.5 text-sm font-semibold transition-colors duration-200",
              rail ? "whitespace-nowrap py-2" : "py-2.5",
              active
                ? "bg-gold text-ink"
                : "hover:[--nav-fg:var(--fg)] hover:bg-[color-mix(in_srgb,var(--fg)_10%,transparent)]",
            ].join(" ")}
            /* hover flips --nav-fg, which the inline colour below reads */
            style={active ? undefined : { color: "var(--nav-fg, var(--fg-muted))" }}
          >
            <Icon size={18} />
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}

/**
 * The active section, echoed in the page top bar — on phones the sidebar is
 * gone, so this is what tells you where you are while a long table scrolls.
 */
export function AdminSectionTitle() {
  const pathname = usePathname();
  const current = ITEMS.find((it) => isActive(pathname, it)) ?? ITEMS[0];
  const Icon = current.icon;

  return (
    <span className="flex min-w-0 items-center gap-2.5">
      <Icon size={17} style={{ color: "var(--color-gold-dk)" }} />
      <span className="truncate text-sm font-semibold">{current.label}</span>
    </span>
  );
}
