"use client";

import { useId, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { changeBookingStatus, saveAdminNote } from "@/app/(admin)/admin/(protected)/bronlar/actions";
import { Check, Phone, Telegram } from "@/components/ui/icons";

type Status = "NEW" | "CONFIRMED" | "CONTACTED" | "CANCELLED" | "COMPLETED";

const STATUS_LABEL: Record<Status, string> = {
  NEW: "Yangi",
  CONFIRMED: "Tasdiqlangan",
  CONTACTED: "Bog'lanilgan",
  CANCELLED: "Bekor",
  COMPLETED: "Yakunlangan",
};

/**
 * The status tint stays inside the brand temperature — gold for a fresh
 * booking, sage for a confirmed one, clay for "we called", danger for a
 * cancellation, mocha once it is closed.
 */
const STATUS_TINT: Record<Status, string> = {
  NEW: "var(--color-gold-dk)",
  CONFIRMED: "var(--color-sage)",
  CONTACTED: "var(--color-rose-dk)",
  CANCELLED: "var(--color-danger)",
  COMPLETED: "var(--color-mocha)",
};

/**
 * The working end of a booking row: change the status, reach the customer,
 * leave an internal note. The note still persists on blur — the check button
 * is there because a thumb on a phone never blurs a field on purpose.
 *
 * `phone` and `tgUsername` are optional: pass them where the row does not
 * already show the customer's contacts elsewhere in the layout.
 */
export function BookingRow({
  id,
  status,
  adminNote,
  phone,
  tgUsername,
}: {
  id: number;
  status: Status;
  adminNote: string | null;
  phone?: string;
  tgUsername?: string | null;
}) {
  const router = useRouter();
  const uid = useId();
  const [isPending, startTransition] = useTransition();
  const [note, setNote] = useState(adminNote ?? "");
  const [savedNote, setSavedNote] = useState(false);

  function change(next: Status) {
    startTransition(async () => {
      await changeBookingStatus(id, next);
      router.refresh();
    });
  }

  function persistNote() {
    startTransition(async () => {
      await saveAdminNote(id, note);
      setSavedNote(true);
      setTimeout(() => setSavedNote(false), 1500);
    });
  }

  return (
    <div className="flex flex-col gap-2" aria-busy={isPending}>
      <label className="sr-only" htmlFor={`${uid}-status`}>
        Bron holati
      </label>
      <select
        id={`${uid}-status`}
        name="status"
        value={status}
        onChange={(e) => change(e.target.value as Status)}
        disabled={isPending}
        className="field-input min-h-11 py-2 text-sm font-semibold"
        style={{ color: STATUS_TINT[status] }}
      >
        {(Object.keys(STATUS_LABEL) as Status[]).map((s) => (
          <option key={s} value={s}>
            {STATUS_LABEL[s]}
          </option>
        ))}
      </select>

      {(phone || tgUsername) && (
        <div className="flex flex-wrap gap-1.5">
          {phone && (
            <a href={`tel:${phone}`} className="btn btn-ghost btn-sm">
              <Phone size={15} />
              Qo&apos;ng&apos;iroq
            </a>
          )}
          {tgUsername && (
            <a
              href={`https://t.me/${tgUsername}`}
              target="_blank"
              rel="noopener"
              className="btn btn-ghost btn-sm"
              style={{ color: "var(--color-gold-dk)" }}
            >
              <Telegram size={15} />@{tgUsername}
            </a>
          )}
        </div>
      )}

      <div>
        <label className="sr-only" htmlFor={`${uid}-note`}>
          Ichki izoh
        </label>
        <div className="flex items-center gap-1.5">
          <input
            id={`${uid}-note`}
            name="adminNote"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onBlur={persistNote}
            placeholder="Izoh…"
            className="field-input min-h-11 py-2 text-sm"
          />
          <button
            type="button"
            onClick={persistNote}
            disabled={isPending}
            aria-label="Izohni saqlash"
            className="btn btn-ghost btn-sm flex-none px-2.5"
          >
            <Check size={16} />
          </button>
        </div>
        <p
          aria-live="polite"
          className="field-hint flex min-h-4 items-center gap-1"
          style={{ color: savedNote ? "var(--color-sage)" : undefined }}
        >
          {savedNote ? (
            <>
              <Check size={13} />
              Saqlandi
            </>
          ) : (
            ""
          )}
        </p>
      </div>
    </div>
  );
}
