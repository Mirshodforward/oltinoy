"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { changeBookingStatus, saveAdminNote } from "@/app/(admin)/admin/(protected)/bronlar/actions";

type Status = "NEW" | "CONFIRMED" | "CONTACTED" | "CANCELLED" | "COMPLETED";

const STATUS_LABEL: Record<Status, string> = {
  NEW: "Yangi",
  CONFIRMED: "Tasdiqlangan",
  CONTACTED: "Bog'lanilgan",
  CANCELLED: "Bekor",
  COMPLETED: "Yakunlangan",
};

const STATUS_COLOR: Record<Status, string> = {
  NEW: "#b45309",
  CONFIRMED: "#2e5e4e",
  CONTACTED: "#1d4ed8",
  CANCELLED: "#b91c1c",
  COMPLETED: "#6b7280",
};

export function BookingRow({
  id,
  status,
  adminNote,
}: {
  id: number;
  status: Status;
  adminNote: string | null;
}) {
  const router = useRouter();
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
    <div className="flex flex-col gap-2">
      <select
        value={status}
        onChange={(e) => change(e.target.value as Status)}
        disabled={isPending}
        className="rounded border px-2 py-1 text-xs font-semibold"
        style={{ borderColor: "var(--color-line)", color: STATUS_COLOR[status] }}
        aria-label="Bron holati"
      >
        {(Object.keys(STATUS_LABEL) as Status[]).map((s) => (
          <option key={s} value={s}>
            {STATUS_LABEL[s]}
          </option>
        ))}
      </select>
      <div className="flex items-center gap-1">
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onBlur={persistNote}
          placeholder="Izoh…"
          className="w-full rounded border px-2 py-1 text-xs"
          style={{ borderColor: "var(--color-line)" }}
        />
        {savedNote && <span className="text-xs" style={{ color: "var(--color-sage)" }}>✓</span>}
      </div>
    </div>
  );
}
