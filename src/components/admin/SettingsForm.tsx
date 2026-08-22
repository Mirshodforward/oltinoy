"use client";

import { useId, useState, type ReactElement } from "react";
import { useRouter } from "next/navigation";
import { saveSettings } from "@/app/(admin)/admin/(protected)/sozlamalar/actions";
import { AlertCircle, Check, MapPin, Phone, Telegram, type IconProps } from "@/components/ui/icons";

type Field = {
  key: string;
  label: string;
  placeholder?: string;
  hint?: string;
  type?: string;
  inputMode?: "text" | "url" | "tel" | "decimal";
  /** Long values (addresses, map links) take the full width of the card. */
  wide?: boolean;
};

/**
 * The nine settings read as three jobs, not one list: how a reseller phones or
 * finds the workshop, where the Telegram funnel points, and what the map and
 * JSON-LD coordinates say. Each group is one card.
 */
const GROUPS: { kicker: string; hint: string; icon: (p: IconProps) => ReactElement; fields: Field[] }[] = [
  {
    kicker: "Aloqa",
    hint: "Footer, aloqa sahifasi va JSON-LD shu ma'lumotlarni oladi.",
    icon: Phone,
    fields: [
      { key: "phone", label: "Telefon", placeholder: "+998 97 423 81 41", type: "tel" },
      { key: "addressUz", label: "Manzil (UZ)", wide: true },
      { key: "addressRu", label: "Manzil (RU)", wide: true },
    ],
  },
  {
    kicker: "Telegram va ijtimoiy tarmoqlar",
    hint: "Kanal havolasi va buyurtma uchun username — saytdagi barcha CTA tugmalari shu yerdan.",
    icon: Telegram,
    fields: [
      { key: "tgChannelUrl", label: "Telegram kanal URL", placeholder: "https://t.me/oltinoy_collection", inputMode: "url" },
      { key: "tgOrderUsername", label: "Telegram buyurtma username", placeholder: "oltinoy_shopping" },
      { key: "instagramUrl", label: "Instagram URL", inputMode: "url", wide: true },
    ],
  },
  {
    kicker: "Xarita",
    hint: "Koordinatalar do'kon sahifasidagi xarita va lokal SEO uchun ishlatiladi.",
    icon: MapPin,
    fields: [
      { key: "mapUrl", label: "Xarita havolasi (Google/Yandex)", inputMode: "url", wide: true },
      { key: "geoLat", label: "Geo kenglik (lat)", placeholder: "41.2995", inputMode: "decimal" },
      { key: "geoLng", label: "Geo uzunlik (lng)", placeholder: "69.2401", inputMode: "decimal" },
    ],
  },
];

const FIELDS: Field[] = GROUPS.flatMap((g) => g.fields);

export function SettingsForm({ values }: { values: Record<string, string> }) {
  const router = useRouter();
  const uid = useId();
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
    <div className="max-w-3xl space-y-4">
      {error && (
        <p
          role="alert"
          className="flex items-start gap-2.5 rounded-sm border border-danger/35 bg-danger/10 px-4 py-3 text-sm font-semibold text-danger"
        >
          <AlertCircle size={18} className="mt-px flex-none" />
          {error}
        </p>
      )}

      {GROUPS.map((g) => {
        const Icon = g.icon;
        return (
          <section key={g.kicker} className="card p-5 md:p-6">
            <h2 className="kicker">
              <Icon size={14} />
              {g.kicker}
            </h2>
            <p className="mt-2 text-sm" style={{ color: "var(--fg-muted)" }}>
              {g.hint}
            </p>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {g.fields.map((f) => (
                <div key={f.key} className={f.wide ? "md:col-span-2" : undefined}>
                  <label className="field-label" htmlFor={`${uid}-${f.key}`}>
                    {f.label}
                  </label>
                  <input
                    id={`${uid}-${f.key}`}
                    name={f.key}
                    type={f.type ?? "text"}
                    inputMode={f.inputMode}
                    className="field-input"
                    value={state[f.key]}
                    placeholder={f.placeholder}
                    onChange={(e) => setState((s) => ({ ...s, [f.key]: e.target.value }))}
                  />
                  {f.hint && <p className="field-hint">{f.hint}</p>}
                </div>
              ))}
            </div>
          </section>
        );
      })}

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={submit} disabled={busy} className="btn btn-primary">
          {busy ? "Saqlanmoqda…" : "Saqlash"}
        </button>
        <span aria-live="polite" className="flex items-center gap-1.5 text-sm font-semibold text-sage">
          {saved ? (
            <>
              <Check size={16} />
              Saqlandi
            </>
          ) : (
            ""
          )}
        </span>
      </div>
    </div>
  );
}
