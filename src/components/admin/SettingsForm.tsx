"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveSettings } from "@/app/(admin)/admin/(protected)/sozlamalar/actions";

const FIELDS: { key: string; label: string; placeholder?: string }[] = [
  { key: "phone", label: "Telefon", placeholder: "+998 97 423 81 41" },
  { key: "addressUz", label: "Manzil (UZ)" },
  { key: "addressRu", label: "Manzil (RU)" },
  { key: "tgChannelUrl", label: "Telegram kanal URL", placeholder: "https://t.me/oltinoy_collection" },
  { key: "tgOrderUsername", label: "Telegram buyurtma username", placeholder: "oltinoy_shopping" },
  { key: "instagramUrl", label: "Instagram URL" },
  { key: "mapUrl", label: "Xarita havolasi (Google/Yandex)" },
  { key: "geoLat", label: "Geo kenglik (lat)" },
  { key: "geoLng", label: "Geo uzunlik (lng)" },
];

export function SettingsForm({ values }: { values: Record<string, string> }) {
  const router = useRouter();
  const [state, setState] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const f of FIELDS) init[f.key] = values[f.key] ?? "";
    return init;
  });
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setBusy(true);
    setError("");
    setSaved(false);
    const res = await saveSettings(state);
    setBusy(false);
    if (!res.ok) {
      setError(res.error ?? "Xatolik");
      return;
    }
    setSaved(true);
    router.refresh();
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-2xl space-y-4">
      {FIELDS.map((f) => (
        <div key={f.key}>
          <label className="field-label">{f.label}</label>
          <input
            className="field-input"
            value={state[f.key]}
            placeholder={f.placeholder}
            onChange={(e) => setState((s) => ({ ...s, [f.key]: e.target.value }))}
          />
        </div>
      ))}
      {error && <p className="text-sm" style={{ color: "#b91c1c" }}>{error}</p>}
      <div className="flex items-center gap-3">
        <button type="button" onClick={submit} disabled={busy} className="btn btn-primary">
          {busy ? "Saqlanmoqda…" : "Saqlash"}
        </button>
        {saved && <span className="text-sm" style={{ color: "var(--color-sage)" }}>✓ Saqlandi</span>}
      </div>
    </div>
  );
}
