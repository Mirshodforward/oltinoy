"use client";

import { useId, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setProductStatus, deleteProduct } from "@/app/(admin)/admin/(protected)/mahsulotlar/actions";
import { Eye, PenLine, Trash } from "@/components/ui/icons";

type Status = "ACTIVE" | "SOLD_OUT" | "HIDDEN";

/**
 * Row-level controls for one product: switch the status inline, open it on the
 * site, edit it, delete it. Icon-only so the whole set fits in a table cell —
 * every button therefore carries an aria-label and a title.
 *
 * `slug` is optional; the "view on site" link only appears when the row knows
 * where the product lives publicly.
 */
export function ProductRowActions({ id, status, slug }: { id: number; status: Status; slug?: string }) {
  const router = useRouter();
  const uid = useId();
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
    <div className="flex items-center gap-1.5" aria-busy={isPending || busy}>
      <label className="sr-only" htmlFor={`${uid}-status`}>
        Holat
      </label>
      <select
        id={`${uid}-status`}
        name="status"
        value={status}
        onChange={(e) => changeStatus(e.target.value as Status)}
        disabled={isPending}
        className="field-input min-h-11 w-auto py-2 text-sm"
      >
        <option value="ACTIVE">Sotuvda</option>
        <option value="SOLD_OUT">Sotilgan</option>
        <option value="HIDDEN">Yashirin</option>
      </select>

      {slug && (
        <Link
          href={`/mahsulot/${slug}`}
          target="_blank"
          aria-label="Saytda ko'rish"
          title="Saytda ko'rish"
          className="btn btn-ghost btn-sm flex-none px-2.5"
        >
          <Eye size={16} />
        </Link>
      )}

      <Link
        href={`/admin/mahsulotlar/${id}`}
        aria-label="Tahrirlash"
        title="Tahrirlash"
        className="btn btn-ghost btn-sm flex-none px-2.5"
      >
        <PenLine size={16} />
      </Link>

      <button
        type="button"
        onClick={onDelete}
        disabled={busy}
        aria-label="O'chirish"
        title="O'chirish"
        className="btn btn-sm flex-none border-danger/40 px-2.5 text-danger transition-colors duration-200 hover:bg-danger hover:text-ivory"
      >
        <Trash size={16} />
      </button>
    </div>
  );
}
