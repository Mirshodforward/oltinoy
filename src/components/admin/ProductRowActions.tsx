"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setProductStatus, deleteProduct } from "@/app/(admin)/admin/(protected)/mahsulotlar/actions";

type Status = "ACTIVE" | "SOLD_OUT" | "HIDDEN";

export function ProductRowActions({ id, status }: { id: number; status: Status }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);

  function changeStatus(next: Status) {
    startTransition(async () => {
      await setProductStatus(id, next);
      router.refresh();
    });
  }

  async function onDelete() {
    if (!confirm("Mahsulotni o'chirasizmi? Bu amalni ortga qaytarib bo'lmaydi.")) return;
    setBusy(true);
    try {
      await deleteProduct(id);
    } catch {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      <select
        value={status}
        onChange={(e) => changeStatus(e.target.value as Status)}
        disabled={isPending}
        className="rounded border px-2 py-1 text-xs"
        style={{ borderColor: "var(--color-line)" }}
        aria-label="Holat"
      >
        <option value="ACTIVE">Sotuvda</option>
        <option value="SOLD_OUT">Sotilgan</option>
        <option value="HIDDEN">Yashirin</option>
      </select>
      <button type="button" onClick={onDelete} disabled={busy} className="rounded border px-2 py-1 text-xs" style={{ color: "#b91c1c", borderColor: "var(--color-line)" }}>
        {busy ? "…" : "🗑"}
      </button>
    </div>
  );
}
