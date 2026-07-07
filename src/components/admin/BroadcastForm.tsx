"use client";

import { useState } from "react";
import { getRecipientCount, sendBroadcast, type BroadcastResult } from "@/app/(admin)/admin/(protected)/broadcast/actions";

type ProductOption = { id: number; nameUz: string };

export function BroadcastForm({ products }: { products: ProductOption[] }) {
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

  if (result) {
    return (
      <div className="card max-w-lg p-5">
        <h2 className="text-lg font-semibold">Broadcast yakunlandi</h2>
        <ul className="mt-3 space-y-1 text-sm">
          <li>✅ Yuborildi: {result.sent}</li>
          <li>🚫 Bloklangan (o'chirildi): {result.blocked}</li>
          <li>⚠️ Xatolik: {result.failed}</li>
          <li>— Jami: {result.total}</li>
        </ul>
        <button type="button" onClick={() => setResult(null)} className="btn btn-outline mt-4">
          Yangi xabar
        </button>
      </div>
    );
  }

  if (confirming) {
    return (
      <div className="card max-w-lg p-5">
        <h2 className="text-lg font-semibold">Tasdiqlash</h2>
        <p className="mt-2 text-sm" style={{ color: "var(--color-muted)" }}>
          Xabar <strong>{count}</strong> ta aktiv obunachiga yuboriladi. Bu amalni ortga qaytarib bo'lmaydi.
        </p>
        <div className="mt-3 whitespace-pre-line rounded-md border p-3 text-sm" style={{ borderColor: "var(--color-line)" }}>
          {text}
        </div>
        {error && <p className="mt-2 text-sm" style={{ color: "#b91c1c" }}>{error}</p>}
        <div className="mt-4 flex gap-3">
          <button type="button" onClick={onSend} disabled={sending} className="btn btn-gold">
            {sending ? "Yuborilmoqda…" : `Ha, ${count} kishiga yuborish`}
          </button>
          <button type="button" onClick={() => setConfirming(false)} disabled={sending} className="btn btn-outline">
            Bekor qilish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg space-y-4">
      <div>
        <label className="field-label">Xabar matni *</label>
        <textarea rows={5} className="field-input resize-none" value={text} onChange={(e) => setText(e.target.value)} placeholder="Yangi kolleksiya haqida xabar…" />
      </div>
      <div>
        <label className="field-label">Mahsulot biriktirish (ixtiyoriy — rasm + havola qo'shiladi)</label>
        <select className="field-input" value={productId} onChange={(e) => setProductId(e.target.value)}>
          <option value="">— Yo'q —</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>{p.nameUz}</option>
          ))}
        </select>
      </div>
      {error && <p className="text-sm" style={{ color: "#b91c1c" }}>{error}</p>}
      <button type="button" onClick={onReview} className="btn btn-primary">
        Ko'rib chiqish →
      </button>
    </div>
  );
}
