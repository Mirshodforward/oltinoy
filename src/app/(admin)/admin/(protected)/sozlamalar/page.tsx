import { getSettings } from "@/lib/settings";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSettings();
  return (
    <div>
      <h1 className="text-2xl font-semibold">Sozlamalar</h1>
      <div className="seam mt-3 w-24" aria-hidden="true" />
      <p className="mt-3 text-sm" style={{ color: "var(--color-muted)" }}>
        Kontakt ma'lumotlari saytning barcha sahifalarida (footer, aloqa, JSON-LD) ishlatiladi.
      </p>
      <div className="mt-6">
        <SettingsForm values={settings} />
      </div>
    </div>
  );
}
