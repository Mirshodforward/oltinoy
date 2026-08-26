"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { AlertCircle, CheckCircle, Minus, Plus, Telegram } from "@/components/ui/icons";
import { track } from "@/lib/analytics/client";

type Props = {
  productId: number;
  sizes: string[];
  minOrderQty: number;
  channelUrl?: string;
};

type FieldErrors = Partial<Record<"size" | "quantity" | "name" | "phone", string>>;

/**
 * Inline validation message, tied to its control through `aria-describedby`.
 * It is an alert as well: a failed submit is otherwise completely silent for a
 * screen reader, since nothing about the page visibly moves.
 */
function FieldError({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} role="alert" className="field-error">
      <AlertCircle size={14} />
      {children}
    </p>
  );
}

/**
 * The conversion surface. A reseller reaches it after scrolling a product page
 * on a mid-range Android phone, so every control is a real button at 44px, the
 * quantity is a stepper rather than a fiddly number spinner, and the errors sit
 * next to the field that caused them instead of at the top of the form.
 */
export function BookingForm({ productId, sizes, minOrderQty, channelUrl }: Props) {
  const t = useTranslations("booking");
  const formId = useId();

  const [size, setSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(minOrderQty);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [tgUsername, setTgUsername] = useState("");
  const [note, setNote] = useState("");
  const [website, setWebsite] = useState(""); // honeypot

  const [errors, setErrors] = useState<FieldErrors>({});
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const sizeGroupRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  // On success the whole form is replaced by the confirmation, so focus would
  // otherwise fall to <body>. Moving it onto the card also makes the
  // announcement reliable — a live region inserted with its content is not.
  useEffect(() => {
    if (state === "success") successRef.current?.focus();
  }, [state]);

  function validate(): FieldErrors {
    const e: FieldErrors = {};
    if (!size) e.size = t("validation.size");
    if (!quantity || quantity < minOrderQty) e.quantity = t("validation.quantity");
    if (!name.trim()) e.name = t("validation.name");
    const digits = phone.replace(/\D/g, "");
    const national = digits.startsWith("998") ? digits.slice(3) : digits;
    if (national.length !== 9) e.phone = t("validation.phone");
    setErrors(e);
    return e;
  }

  /** Sends focus to the first control the buyer still has to fix. */
  function focusFirstError(e: FieldErrors) {
    if (e.size) {
      sizeGroupRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
      return;
    }
    const field = e.quantity ? "qty" : e.name ? "name" : e.phone ? "phone" : null;
    if (field) document.getElementById(`${formId}-${field}`)?.focus();
  }

  /** Stepper — clamps at the minimum order so the field can never go invalid. */
  function step(delta: number) {
    setQuantity((q) => Math.max(minOrderQty, (Number.isFinite(q) ? q : minOrderQty) + delta));
    setErrors((e) => ({ ...e, quantity: undefined }));
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const invalid = validate();
    if (Object.keys(invalid).length > 0) {
      focusFirstError(invalid);
      return;
    }
    setState("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, size, quantity, customerName: name, phone, tgUsername, note, website }),
      });
      if (res.status === 429) {
        setState("error");
        setErrorMsg(t("errorRateLimit"));
        return;
      }
      if (!res.ok) {
        setState("error");
        setErrorMsg(t("errorGeneric"));
        return;
      }
      setState("success");
      // The auto-captured click only says the button was pressed; this says the
      // booking actually went through, which is the number the shop cares about.
      track("bron_yuborildi", { productId, size, quantity });
    } catch {
      setState("error");
      setErrorMsg(t("errorGeneric"));
    }
  }

  if (state === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        className="card p-6 text-center md:p-8"
        role="alert"
        style={{ borderColor: "color-mix(in srgb, var(--color-sage) 40%, var(--line))" }}
      >
        <div className="seam-strong absolute inset-x-0 top-0" aria-hidden="true" />
        <span
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
          style={{
            background: "color-mix(in srgb, var(--color-sage) 14%, transparent)",
            color: "var(--color-sage)",
          }}
        >
          <CheckCircle size={30} />
        </span>
        <h2 className="mt-5 text-2xl">{t("successTitle")}</h2>
        <p className="mx-auto mt-2.5 max-w-sm text-sm leading-relaxed" style={{ color: "var(--fg-muted)" }}>
          {t("successText")}
        </p>
        {channelUrl && (
          <a href={channelUrl} target="_blank" rel="noopener" className="btn btn-outline mt-6">
            <Telegram size={17} />
            {t("successChannel")}
          </a>
        )}
      </div>
    );
  }

  const submitting = state === "submitting";

  return (
    <form onSubmit={onSubmit} className="card" noValidate aria-labelledby={`${formId}-title`}>
      {/* The stitch line that opens every Oltinoy surface. */}
      <div className="seam-strong" aria-hidden="true" />

      <div className="panel-cream relative overflow-hidden border-b px-5 py-6 md:px-7">
        <div className="arc pointer-events-none absolute -right-10 -top-14 w-44 opacity-70" aria-hidden="true" />
        <h2 id={`${formId}-title`} className="relative text-2xl">
          {t("title")}
        </h2>
        <p className="relative mt-2 max-w-sm text-sm leading-relaxed" style={{ color: "var(--fg-muted)" }}>
          {t("subtitle")}
        </p>
      </div>

      {/* Honeypot — visually hidden, off-screen, not tab-focusable */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={`${formId}-website`}>Website</label>
        <input
          id={`${formId}-website`}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div className="space-y-5 px-5 py-6 md:px-7">
        <fieldset aria-describedby={errors.size ? `${formId}-size-error` : undefined}>
          <legend className="field-label">
            {t("size")}{" "}
            <span aria-hidden="true" style={{ color: "var(--accent-text)" }}>
              *
            </span>
          </legend>
          <div ref={sizeGroupRef} className="flex flex-wrap gap-2">
            {sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setSize(s);
                  setErrors((e) => ({ ...e, size: undefined }));
                }}
                aria-pressed={size === s}
                className="chip"
              >
                {s}
              </button>
            ))}
          </div>
          {errors.size && <FieldError id={`${formId}-size-error`}>{errors.size}</FieldError>}
        </fieldset>

        <div>
          <label className="field-label" htmlFor={`${formId}-qty`}>
            {t("quantity")}
          </label>
          <div
            className="inline-flex items-center rounded-full border"
            style={{
              borderColor: errors.quantity ? "var(--color-danger)" : "var(--line)",
              background: "var(--surface)",
            }}
          >
            <button
              type="button"
              onClick={() => step(-1)}
              disabled={quantity <= minOrderQty}
              aria-label={`${t("quantity")} −1`}
              className="btn-icon disabled:pointer-events-none disabled:opacity-35"
            >
              <Minus size={18} />
            </button>
            <input
              id={`${formId}-qty`}
              type="number"
              inputMode="numeric"
              min={minOrderQty}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value || "0", 10))}
              aria-invalid={errors.quantity ? true : undefined}
              aria-describedby={errors.quantity ? `${formId}-qty-error` : undefined}
              className="h-11 w-14 border-0 bg-transparent text-center text-base font-semibold tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <button
              type="button"
              onClick={() => step(1)}
              aria-label={`${t("quantity")} +1`}
              className="btn-icon"
            >
              <Plus size={18} />
            </button>
          </div>
          {errors.quantity && <FieldError id={`${formId}-qty-error`}>{errors.quantity}</FieldError>}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor={`${formId}-name`}>
              {t("name")}{" "}
              <span aria-hidden="true" style={{ color: "var(--accent-text)" }}>
                *
              </span>
            </label>
            <input
              id={`${formId}-name`}
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors((err) => ({ ...err, name: undefined }));
              }}
              placeholder={t("namePlaceholder")}
              aria-required="true"
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? `${formId}-name-error` : undefined}
              className="field-input"
            />
            {errors.name && <FieldError id={`${formId}-name-error`}>{errors.name}</FieldError>}
          </div>

          <div>
            <label className="field-label" htmlFor={`${formId}-phone`}>
              {t("phone")}{" "}
              <span aria-hidden="true" style={{ color: "var(--accent-text)" }}>
                *
              </span>
            </label>
            <input
              id={`${formId}-phone`}
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setErrors((err) => ({ ...err, phone: undefined }));
              }}
              placeholder={t("phonePlaceholder")}
              aria-required="true"
              aria-invalid={errors.phone ? true : undefined}
              aria-describedby={errors.phone ? `${formId}-phone-error` : undefined}
              className="field-input"
            />
            {errors.phone && <FieldError id={`${formId}-phone-error`}>{errors.phone}</FieldError>}
          </div>
        </div>

        <div>
          <label className="field-label" htmlFor={`${formId}-tg`}>
            {t("tgUsername")}
          </label>
          <input
            id={`${formId}-tg`}
            type="text"
            value={tgUsername}
            onChange={(e) => setTgUsername(e.target.value)}
            placeholder={t("tgPlaceholder")}
            className="field-input"
          />
        </div>

        <div>
          <label className="field-label" htmlFor={`${formId}-note`}>
            {t("note")}
          </label>
          <textarea
            id={`${formId}-note`}
            rows={2}
            maxLength={300}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t("notePlaceholder")}
            className="field-input resize-none"
          />
        </div>

        <div className="border-t pt-5" style={{ borderColor: "var(--line)" }}>
          {state === "error" && (
            <p
              role="alert"
              className="mb-4 flex items-start gap-2 rounded-md px-3.5 py-3 text-sm font-medium"
              style={{
                background: "color-mix(in srgb, var(--color-danger) 8%, var(--surface))",
                color: "var(--color-danger)",
              }}
            >
              <AlertCircle size={17} className="mt-px shrink-0" />
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            aria-busy={submitting}
            className="btn btn-gold btn-lg btn-block"
          >
            <Telegram size={18} />
            <span aria-live="polite">{submitting ? t("submitting") : t("submit")}</span>
          </button>

          <p className="field-hint text-center">{t("privacy")}</p>
        </div>
      </div>
    </form>
  );
}
