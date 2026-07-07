"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Logo } from "@/components/ui/Logo";
import { loginAction, type LoginState } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn btn-primary w-full">
      {pending ? "Kirilmoqda…" : "Kirish"}
    </button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState<LoginState, FormData>(loginAction, {});

  return (
    <form action={formAction} className="card w-full max-w-sm p-6">
      <Logo height={48} className="mb-4" />
      <h1 className="text-2xl font-semibold">Admin panel</h1>
      <p className="mt-1 text-sm" style={{ color: "var(--color-muted)" }}>
        Oltinoy Collection boshqaruvi
      </p>

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
          <input id="password" name="password" type="password" autoComplete="current-password" required className="field-input" />
        </div>

        {state.error && (
          <p className="rounded-md px-3 py-2 text-sm" style={{ background: "#fef2f2", color: "#b91c1c" }} role="alert">
            {state.error}
          </p>
        )}

        <SubmitButton />
      </div>
    </form>
  );
}
