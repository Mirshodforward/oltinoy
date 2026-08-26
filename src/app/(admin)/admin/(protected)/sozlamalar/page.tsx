import { getSettings } from "@/lib/settings";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { PasswordForm } from "@/components/admin/PasswordForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div className="max-w-4xl">
      {/* ───────────────────────── Header ───────────────────────── */}
      <header className="max-w-2xl">
        <h1 className="text-3xl">Sozlamalar</h1>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--fg-muted)" }}>
          Kontakt ma'lumotlari saytning barcha sahifalarida (footer, aloqa, JSON-LD) ishlatiladi.
        </p>
      </header>
      <div className="seam mt-6" aria-hidden="true" />

      <div className="mt-8 space-y-4">
        <SettingsForm values={settings} />
        <PasswordForm />
      </div>
    </div>
  );
}
