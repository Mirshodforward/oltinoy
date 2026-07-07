"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/admin", label: "Boshqaruv paneli", icon: "📊", exact: true },
  { href: "/admin/mahsulotlar", label: "Mahsulotlar", icon: "🛍" },
  { href: "/admin/bronlar", label: "Bronlar", icon: "📩" },
  { href: "/admin/kategoriyalar", label: "Kategoriyalar", icon: "🗂" },
  { href: "/admin/postlar", label: "Blog postlar", icon: "📝" },
  { href: "/admin/broadcast", label: "Broadcast", icon: "📣" },
  { href: "/admin/sozlamalar", label: "Sozlamalar", icon: "⚙️" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="space-y-1">
      {ITEMS.map((it) => {
        const active = it.exact ? pathname === it.href : pathname.startsWith(it.href);
        return (
          <Link
            key={it.href}
            href={it.href}
            aria-current={active ? "page" : undefined}
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
            style={{
              background: active ? "var(--color-gold)" : "transparent",
              color: active ? "var(--color-ink)" : "var(--color-ivory)",
            }}
          >
            <span aria-hidden="true">{it.icon}</span>
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}
