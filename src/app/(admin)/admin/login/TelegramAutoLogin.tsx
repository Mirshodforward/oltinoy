"use client";

import { useEffect, useState } from "react";
import { telegramLoginAction } from "./actions";

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData?: string;
        ready?: () => void;
        expand?: () => void;
      };
    };
  }
}

/** Auto-sign-in when opened as Telegram Mini App by a listed admin. */
export function TelegramAutoLogin() {
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let intervalId: ReturnType<typeof setInterval> | undefined;
    let started = false;

    async function attemptLogin(): Promise<boolean> {
      const initData = window.Telegram?.WebApp?.initData;
      if (!initData) return false;

      window.Telegram?.WebApp?.ready?.();
      window.Telegram?.WebApp?.expand?.();

      if (!started) {
        started = true;
        setPending(true);
      }

      const state = await telegramLoginAction(initData);
      if (cancelled) return true;

      if (state.error) {
        setPending(false);
        setFailed(true);
        return true;
      }
      return true;
    }

    void attemptLogin().then((done) => {
      if (done || cancelled) return;
      intervalId = setInterval(() => {
        void attemptLogin().then((ok) => {
          if (ok && intervalId) clearInterval(intervalId);
        });
      }, 150);
    });

    const timeoutId = setTimeout(() => {
      if (intervalId) clearInterval(intervalId);
      if (!cancelled && !started) setPending(false);
    }, 6000);

    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, []);

  if (pending) {
    return (
      <p className="mt-4 text-center text-sm" style={{ color: "var(--color-muted)" }}>
        Telegram orqali kirilmoqda…
      </p>
    );
  }

  if (failed) {
    return (
      <p className="mt-4 text-center text-xs" style={{ color: "var(--color-muted)" }}>
        Telegram orqali avto-kirish amalga oshmadi. Login va parol bilan kiring.
      </p>
    );
  }

  return null;
}
