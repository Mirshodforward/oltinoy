"use client";

import { useId, useState } from "react";
import { changePassword } from "@/app/(admin)/admin/(protected)/sozlamalar/actions";
import { AlertCircle, Check, ShieldCheck } from "@/components/ui/icons";

/**
 * Admin password change. Lives beside the contact settings because that is where
 * an owner looks for "my account", and it is the only place in the panel that
 * writes to the credential store.
 */
export function PasswordForm() {
  const uid = useId();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setBusy(true);
    setError("");
    setDone(false);
    const res = await changePassword({ current, next, confirm });
    setBusy(false);
    if (!res.ok) {
      setError(res.error ?? "Xatolik");
      return;
    }
    setCurrent("");
    setNext("");
    setConfirm("");
    setDone(true);
    setTimeout(() => setDone(false), 4000);
  }

  const fields = [
    { key: "current", label: "Joriy parol", value: current, set: setCurrent, autoComplete: "current-password" },
    { key: "next", label: "Yangi parol", value: next, set: setNext, autoComplete: "new-password" },
    { key: "confirm", label: "Yangi parolni takrorlang", value: confirm, set: setConfirm, autoComplete: "new-password" },
  ] as const;

  return (
    <section className="card p-5 md:p-6">
      <h2 className="kicker">
        <ShieldCheck size={14} />
        Kirish paroli
      </h2>
      <p className="mt-2 text-sm" style={{ color: "var(--fg-muted)" }}>
        <code>/admin</code> sahifasiga kirish uchun paroli. Kamida 8 belgi bo&apos;lsin.
      </p>

      {error && (
        <p
          role="alert"
          className="mt-4 flex items-start gap-2.5 rounded-sm border border-danger/35 bg-danger/10 px-4 py-3 text-sm font-semibold text-danger"
        >
          <AlertCircle size={18} className="mt-px flex-none" />
          {error}
        </p>
      )}

      <div className="mt-5 grid gap-5 md:grid-cols-3">
        {fields.map((f) => (
          <div key={f.key}>
            <label className="field-label" htmlFor={`${uid}-${f.key}`}>
              {f.label}
            </label>
            <input
              id={`${uid}-${f.key}`}
              name={f.key}
              type="password"
              autoComplete={f.autoComplete}
              className="field-input"
              value={f.value}
              onChange={(e) => f.set(e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={submit}
          disabled={busy || !current || !next || !confirm}
          className="btn btn-outline"
        >
          {busy ? "O'zgartirilmoqda…" : "Parolni o'zgartirish"}
        </button>
        <span aria-live="polite" className="flex items-center gap-1.5 text-sm font-semibold text-sage">
          {done ? (
            <>
              <Check size={16} />
              Parol yangilandi
            </>
          ) : (
            ""
          )}
        </span>
      </div>
    </section>
  );
}
