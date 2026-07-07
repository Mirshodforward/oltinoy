"use client";

import { useState, useId } from "react";
import { useTranslations } from "next-intl";

type Props = {
  productId: number;
  sizes: string[];
  minOrderQty: number;
  channelUrl?: string;
};

type FieldErrors = Partial<Record<"size" | "quantity" | "name" | "phone", string>>;

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

  function validate(): boolean {
    const e: FieldErrors = {};
    if (!size) e.size = t("validation.size");
    if (!quantity || quantity < minOrderQty) e.quantity = t("validation.quantity");
    if (!name.trim()) e.name = t("validation.name");
    const digits = phone.replace(/\D/g, "");
    const national = digits.startsWith("998") ? digits.slice(3) : digits;
    if (national.length !== 9) e.phone = t("validation.phone");
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
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
    } catch {
      setState("error");
      setErrorMsg(t("errorGeneric"));
    }
  }

  if (state === "success") {
    return (
      <div className="card p-6 text-center" style={{ borderColor: "var(--color-sage)" }}>
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full" style={{ background: "var(--color-sage)", color: "#fff" }}>
          ✓
        </div>
        <h3 className="text-xl" style={{ color: "var(--color-sage)" }}>
          {t("successTitle")}
        </h3>
        <p className="mt-2 text-sm" style={{ color: "var(--color-muted)" }}>
          {t("successText")}
        </p>
        {channelUrl && (
          <a href={channelUrl} target="_blank" rel="noopener" className="btn btn-outline mt-4">
            ✈️ {t("successChannel")}
          </a>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card p-5" noValidate aria-labelledby={`${formId}-title`}>
      <h2 id={`${formId}-title`} className="text-xl">
        {t("title")}
      </h2>
      <p className="mt-1 text-sm" style={{ color: "var(--color-muted)" }}>
        {t("subtitle")}
      </p>

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

      <div className="mt-4 space-y-4">
        <fieldset>
          <legend className="field-label">
            {t("size")} <span style={{ color: "var(--color-gold)" }}>*</span>
          </legend>
          <div className="flex flex-wrap gap-1.5">
            {sizes.map((s) => {
              const active = size === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setSize(s);
                    setErrors((e) => ({ ...e, size: undefined }));
                  }}
                  aria-pressed={active}
                  className="min-w-[44px] rounded-full border px-3 py-2 text-sm font-medium transition-colors"
                  style={{
                    borderColor: active ? "var(--color-gold)" : "var(--color-line)",
                    background: active ? "var(--color-gold)" : "#fff",
                  }}
                >
                  {s}
                </button>
              );
            })}
          </div>
          {errors.size && <p className="mt-1 text-xs" style={{ color: "#b91c1c" }}>{errors.size}</p>}
        </fieldset>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="field-label" htmlFor={`${formId}-qty`}>
              {t("quantity")}
            </label>
            <input
              id={`${formId}-qty`}
              type="number"
              inputMode="numeric"
              min={minOrderQty}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value || "0", 10))}
              className="field-input"
            />
            {errors.quantity && <p className="mt-1 text-xs" style={{ color: "#b91c1c" }}>{errors.quantity}</p>}
          </div>
          <div>
            <label className="field-label" htmlFor={`${formId}-name`}>
              {t("name")} <span style={{ color: "var(--color-gold)" }}>*</span>
            </label>
            <input
              id={`${formId}-name`}
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("namePlaceholder")}
              className="field-input"
            />
            {errors.name && <p className="mt-1 text-xs" style={{ color: "#b91c1c" }}>{errors.name}</p>}
          </div>
        </div>

        <div>
          <label className="field-label" htmlFor={`${formId}-phone`}>
            {t("phone")} <span style={{ color: "var(--color-gold)" }}>*</span>
          </label>
          <input
            id={`${formId}-phone`}
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t("phonePlaceholder")}
            className="field-input"
          />
          {errors.phone && <p className="mt-1 text-xs" style={{ color: "#b91c1c" }}>{errors.phone}</p>}
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

        {state === "error" && (
          <p className="rounded-md px-3 py-2 text-sm" style={{ background: "#fef2f2", color: "#b91c1c" }} role="alert">
            {errorMsg}
          </p>
        )}

        <button type="submit" disabled={state === "submitting"} className="btn btn-gold w-full text-base">
          {state === "submitting" ? t("submitting") : t("submit")}
        </button>
      </div>
    </form>
  );
}
