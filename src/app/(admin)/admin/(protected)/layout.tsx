import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { AdminNav, AdminSectionTitle } from "@/components/admin/AdminNav";
import { LogoLockup } from "@/components/ui/Logo";
import { LogOut, Users } from "@/components/ui/icons";
import { logoutAction } from "./actions";

/**
 * Admin chrome. Desktop gets a fixed espresso sidebar with its own scroll — the
 * brand lockup, a seam, the sections, and the signed-in block pinned to the
 * bottom. Phones drop the sidebar for a compact dark bar plus a scrolling rail
 * of the same sections. The workspace itself stays on the ivory page ground.
 */
export default async function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const userName = session.user.name ?? "";

  return (
    <div className="min-h-screen md:pl-64">
      {/* ───────────────────────── Sidebar (md+) ───────────────────────── */}
      <aside className="on-dark fixed inset-y-0 left-0 z-40 hidden w-64 flex-col overflow-y-auto bg-ink md:flex">
        <div className="px-5 pb-5 pt-6">
          <Link href="/admin" aria-label="Boshqaruv paneli" className="inline-block">
            <LogoLockup height={36} />
          </Link>
          <p
            className="mt-4 text-2xs font-bold uppercase tracking-[0.3em]"
            style={{ color: "var(--accent-text)" }}
          >
            admin
          </p>
        </div>

        <div className="seam" aria-hidden="true" />

        <div className="flex-1 p-3">
          <AdminNav />
        </div>

        <div className="seam" aria-hidden="true" />

        <div className="p-5">
          <p className="truncate text-sm font-semibold">{userName}</p>
          <form action={logoutAction} className="mt-3">
            <button type="submit" className="btn btn-outline btn-sm btn-block">
              <LogOut size={16} />
              Chiqish
            </button>
          </form>
        </div>
      </aside>

      {/* ──────────────── Compact bar + nav rail (phones) ──────────────── */}
      <div className="on-dark sticky top-0 z-30 bg-ink md:hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-2.5">
          <Link href="/admin" aria-label="Boshqaruv paneli" className="flex items-center gap-2.5">
            <LogoLockup height={30} />
            <span
              className="text-2xs font-bold uppercase tracking-[0.3em]"
              style={{ color: "var(--accent-text)" }}
            >
              admin
            </span>
          </Link>
          <form action={logoutAction}>
            <button type="submit" className="btn btn-ghost btn-sm min-h-11">
              <LogOut size={16} />
              Chiqish
            </button>
          </form>
        </div>

        <div className="seam" aria-hidden="true" />

        <div className="px-4 py-2.5">
          <AdminNav variant="rail" />
        </div>
      </div>

      {/* ───────────────────────── Page top bar ───────────────────────── */}
      <header
        className="sticky top-0 z-20 hidden border-b bg-ivory/85 backdrop-blur md:block"
        style={{ borderColor: "var(--line)" }}
      >
        <div className="flex h-16 items-center justify-between gap-4 px-8">
          <AdminSectionTitle />
          {userName && (
            <span
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold"
              style={{ borderColor: "var(--line)", color: "var(--fg-muted)" }}
            >
              <Users size={15} />
              {userName}
            </span>
          )}
        </div>
      </header>

      <main className="px-4 py-6 md:px-8 md:py-10">{children}</main>
    </div>
  );
}
