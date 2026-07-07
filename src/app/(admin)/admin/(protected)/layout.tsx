import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { Logo } from "@/components/ui/Logo";
import { logoutAction } from "./actions";

export default async function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col justify-between p-4 md:flex" style={{ background: "var(--color-ink)" }}>
        <div>
          <Link href="/admin" className="mb-6 flex items-center gap-2 px-3">
            <Logo height={34} />
            <span className="text-xs uppercase tracking-wider" style={{ color: "rgba(247,243,236,0.6)" }}>
              admin
            </span>
          </Link>
          <AdminNav />
        </div>
        <div className="px-3">
          <p className="mb-2 text-xs" style={{ color: "rgba(247,243,236,0.6)" }}>
            {session.user.name}
          </p>
          <form action={logoutAction}>
            <button type="submit" className="text-sm font-medium hover:underline" style={{ color: "rgba(247,243,236,0.8)" }}>
              Chiqish →
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between p-3 md:hidden" style={{ background: "var(--color-ink)" }}>
          <div className="flex items-center gap-2">
            <Logo height={28} />
            <span className="text-xs uppercase tracking-wider" style={{ color: "rgba(247,243,236,0.6)" }}>
              admin
            </span>
          </div>
          <form action={logoutAction}>
            <button type="submit" className="text-sm" style={{ color: "var(--color-ivory)" }}>
              Chiqish
            </button>
          </form>
        </header>
        <div className="md:hidden" style={{ background: "var(--color-ink)" }}>
          <div className="overflow-x-auto px-2 pb-2">
            <AdminNav />
          </div>
        </div>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
