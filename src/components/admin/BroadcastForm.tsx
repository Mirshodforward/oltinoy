"use client";

import { useId, useState } from "react";
import { getRecipientCount, sendBroadcast, type BroadcastResult } from "@/app/(admin)/admin/(protected)/broadcast/actions";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Close,
  Megaphone,
  Users,
} from "@/components/ui/icons";

type ProductOption = { id: number; nameUz: string };

/** One number from the send report — icon, count, what it counts. */
function Stat({
  icon,
  value,
  label,
  tint,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  tint?: string;
}) {
  return (
    <div className="rounded-sm border p-3" style={{ borderColor: "var(--line)" }}>
      <dt className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "var(--fg-muted)" }}>
        <span style={{ color: tint ?? "var(--fg-subtle)" }}>{icon}</span>
        {label}
      </dt>
      <dd className="price mt-1.5 text-2xl tabular-nums">{value}</dd>
    </div>
  );
}

export function BroadcastForm({ products }: { products: ProductOption[] }) {
  const uid = useId();
  const [text, setText] = useState("");
  const [productId, setProductId] = useState<string>("");
  const [count, setCount] = useState<number | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<BroadcastResult | null>(null);
  const [error, setError] = useState("");

  async function onReview() {
    setError("");
    if (!text.trim()) {
      setError("Xabar matnini kiriting");
      return;
    }
    const c = await getRecipientCount();
    setCount(c);
    setConfirming(true);
  }

  async function onSend() {
    setSending(true);
    setError("");
    const res = await sendBroadcast({ text, productId: productId ? parseInt(productId, 10) : null });
    setSending(false);
    setConfirming(false);
    if (!res.ok) {
      setError(res.error ?? "Xatolik");
      return;
    }
    setResult(res.result ?? null);
    setText("");
    setProductId("");
  }

  /* ───────────────────────── Report ───────────────────────── */
  if (result) {
    return (
      <div className="card max-w-xl p-5 md:p-6">
        <h2 className="kicker">
          <CheckCircle size={14} />
          Broadcast yakunlandi
        </h2>
        <dl className="mt-5 grid grid-cols-2 gap-3">
          <Stat icon={<CheckCircle size={15} />} value={result.sent} label="Yuborildi" tint="var(--color-sage)" />
          <Stat icon={<Close size={15} />} value={result.blocked} label="Bloklangan" tint="var(--color-rose-dk)" />
          <Stat icon={<AlertCircle size={15} />} value={result.failed} label="Xatolik" tint="var(--color-danger)" />
          <Stat icon={<Users size={15} />} value={result.total} label="Jami" tint="var(--color-gold-dk)" />
        </dl>
        <button type="button" onClick={() => setResult(null)} className="btn btn-outline mt-5">
          <Megaphone size={17} />
          Yangi xabar
        </button>
      </div>
    );
  }

  /* ───────────────────────── Confirm ───────────────────────── */
  if (confirming) {
    return (
      <div className="card max-w-xl p-5 md:p-6">
        <h2 className="kicker" style={{ color: "var(--color-rose-dk)" }}>
          <AlertCircle size={14} />
          Tasdiqlash
        </h2>
        <p className="mt-3 text-sm" style={{ color: "var(--fg-muted)" }}>
          Xabar <strong style={{ color: "var(--fg)" }}>{count}</strong> ta aktiv obunachiga yuboriladi. Bu amalni ortga
          qaytarib bo&apos;lmaydi.
        </p>

        <div
          className="panel-cream mt-4 whitespace-pre-line rounded-sm border p-4 text-sm"
          style={{ borderColor: "var(--line)" }}
        >
          {text}
        </div>

        {error && (
          <p role="alert" className="field-error">
            <AlertCircle size={14} className="flex-none" />
            {error}
          </p>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" onClick={onSend} disabled={sending} className="btn btn-gold">
            <Megaphone size={17} />
            {sending ? "Yuborilmoqda…" : `Ha, ${count} kishiga yuborish`}
          </button>
          <button type="button" onClick={() => setConfirming(false)} disabled={sending} className="btn btn-outline">
            Bekor qilish
          </button>
        </div>
      </div>
    );
  }

  /* ───────────────────────── Compose ───────────────────────── */
  return (
    <div className="card max-w-xl p-5 md:p-6">
      <h2 className="kicker">
        <Megaphone size={14} />
        Xabar
      </h2>
      <p className="mt-2 text-sm" style={{ color: "var(--fg-muted)" }}>
        Matn Telegram bot orqali barcha aktiv obunachilarga boradi.
      </p>

      <div className="mt-5 space-y-5">
        <div>
          <label className="field-label" htmlFor={`${uid}-text`}>
            Xabar matni *
          </label>
          <textarea
            id={`${uid}-text`}
            name="text"
            rows={6}
            className="field-input resize-y"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Yangi kolleksiya haqida xabar…"
          />
        </div>

        <div>
          <label className="field-label" htmlFor={`${uid}-productId`}>
            Mahsulot biriktirish (ixtiyoriy)
          </label>
          <select
            id={`${uid}-productId`}
            name="productId"
            className="field-input"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          >
            <option value="">— Yo&apos;q —</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nameUz}
              </option>
            ))}
          </select>
          <p className="field-hint">Tanlansa, xabarga mahsulot rasmi va havolasi qo&apos;shiladi.</p>
        </div>

        {error && (
          <p role="alert" className="field-error">
            <AlertCircle size={14} className="flex-none" />
            {error}
          </p>
        )}

        <button type="button" onClick={onReview} className="btn btn-primary">
          Ko&apos;rib chiqish
          <ArrowRight size={17} />
        </button>
      </div>
    </div>
  );
}
