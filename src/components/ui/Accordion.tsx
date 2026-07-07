"use client";

import { useState } from "react";

/** Lightweight accessible FAQ accordion. Content is server-rendered in the DOM. */
export function Accordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y" style={{ borderColor: "var(--color-line)" }}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="border-b" style={{ borderColor: "var(--color-line)" }}>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 py-4 text-left"
              >
                <span className="font-[family-name:var(--font-body)] text-base font-semibold">{item.q}</span>
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-lg transition-transform"
                  style={{
                    color: "var(--color-gold)",
                    transform: isOpen ? "rotate(45deg)" : "none",
                  }}
                  aria-hidden="true"
                >
                  +
                </span>
              </button>
            </h3>
            <div className={isOpen ? "pb-4 pr-10" : "sr-only"}>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-muted)" }}>
                {item.a}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
