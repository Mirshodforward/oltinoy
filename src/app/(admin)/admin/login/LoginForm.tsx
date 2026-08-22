"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { LogoLockup } from "@/components/ui/Logo";
import { AlertCircle } from "@/components/ui/icons";
import { loginAction, type LoginState } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn btn-primary btn-block">
      {pending ? "Kirilmoqda…" : "Kirish"}
    </button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState<LoginState, FormData>(loginAction, {});

  return (
    <form action={formAction} className="card w-full max-w-sm p-6 md:p-8" style={{ boxShadow: "var(--shadow-md)" }}>
      <LogoLockup height={40} />

      <h1 className="mt-6 text-2xl">Admin panel</h1>
      <p className="mt-2 text-sm" style={{ color: "var(--fg-muted)" }}>
        Oltinoy Collection boshqaruvi
      </p>
      <div className="seam mt-6 w-16" aria-hidden="true" />

      <div className="mt-6 space-y-4">
        <div>
          <label className="field-label" htmlFor="username">
            Login
          </label>
          <input id="username" name="username" type="text" autoComplete="username" required className="field-input" />
        </div>
        <div>
          <label className="field-label" htmlFor="password">
            Parol
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="field-input"
          />
        </div>

        {state.error && (
          <p className="field-error" role="alert">
            <AlertCircle size={15} className="shrink-0" />
            {state.error}
          </p>
        )}

        <SubmitButton />
      </div>
    </form>
  );
}
