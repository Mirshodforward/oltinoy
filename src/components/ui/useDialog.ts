"use client";

import { useEffect, useRef, type RefObject } from "react";

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/**
 * Modal plumbing shared by the nav drawer and the mobile filter sheet: lock the
 * page behind the overlay, close on Escape, keep Tab inside the panel, and hand
 * focus back to whatever opened it. Without the trap, Tab walks straight out of
 * a full-screen overlay into the page still sitting behind it.
 *
 * `onClose` is read through a ref so an inline arrow at the call site does not
 * re-run the effect (and re-steal focus) on every render.
 */
export function useDialog({
  open,
  panelRef,
  triggerRef,
  onClose,
  lockScroll = true,
}: {
  open: boolean;
  panelRef: RefObject<HTMLElement | null>;
  triggerRef?: RefObject<HTMLElement | null>;
  onClose: () => void;
  lockScroll?: boolean;
}) {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    const restoreTo = (triggerRef?.current ?? document.activeElement) as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;

    if (lockScroll) document.body.style.overflow = "hidden";
    panel?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.stopPropagation();
        closeRef.current();
        return;
      }
      if (e.key !== "Tab" || !panel) return;

      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null,
      );
      if (items.length === 0) {
        e.preventDefault();
        panel.focus();
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && (active === first || active === panel)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      if (lockScroll) document.body.style.overflow = prevOverflow;
      restoreTo?.focus?.();
    };
  }, [open, panelRef, triggerRef, lockScroll]);
}
