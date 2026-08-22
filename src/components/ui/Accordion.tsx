"use client";

import { useState } from "react";
import { Plus } from "./icons";

/**
 * FAQ accordion. A collapsed answer stays rendered — the page ships FAQPage
 * JSON-LD and the visible copy has to match it — but `inert` takes it out of
 * the accessibility tree so a screen reader is not read every answer at once,
 * while crawlers still see the full text.
 */
export function Accordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y" style={{ borderColor: "var(--line)" }}>
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `faq-panel-${i}`;
        return (
          <div key={i} className="border-b" style={{ borderColor: "var(--line)" }}>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="group flex w-full items-center justify-between gap-5 py-5 text-left transition-colors hover:text-gold-dk"
              >
                <span className="font-[family-name:var(--font-body)] text-base font-semibold md:text-lg">
                  {item.q}
                </span>
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ease-[var(--ease-expo)]"
                  style={{
                    color: isOpen ? "var(--color-ink)" : "var(--color-gold-dk)",
                    borderColor: isOpen ? "var(--color-gold)" : "var(--line)",
                    background: isOpen ? "var(--color-gold)" : "transparent",
                    transform: isOpen ? "rotate(135deg)" : "none",
                  }}
                  aria-hidden="true"
                >
                  <Plus size={16} />
                </span>
              </button>
            </h3>
            <div
              className={isOpen ? "grid grid-rows-[1fr] pb-6 pr-12" : "grid grid-rows-[0fr] overflow-hidden"}
              style={{ transition: "grid-template-rows .35s var(--ease-expo)" }}
            >
              <div className="overflow-hidden" id={panelId} inert={!isOpen || undefined}>
                <p className="text-base leading-relaxed" style={{ color: "var(--fg-muted)" }}>
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
