"use server";

import { headers } from "next/headers";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { rateLimit, clientIp } from "@/lib/ratelimit";

export type LoginState = { error?: string };

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const hdrs = await headers();
  const ip = clientIp(hdrs);
  const rl = rateLimit(`login:${ip}`, 5, 15 * 60 * 1000);
  if (!rl.ok) {
    return { error: "Juda ko'p urinish. Iltimos, birozdan so'ng qayta urinib ko'ring." };
  }

  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");

  try {
    await signIn("credentials", { username, password, redirectTo: "/admin" });
    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Login yoki parol noto'g'ri." };
    }
    // signIn throws a redirect on success — rethrow so Next handles it.
    throw error;
  }
}

export async function telegramLoginAction(initData: string): Promise<LoginState> {
  const hdrs = await headers();
  const ip = clientIp(hdrs);
  const rl = rateLimit(`login:tg:${ip}`, 10, 15 * 60 * 1000);
  if (!rl.ok) {
    return { error: "Juda ko'p urinish. Iltimos, birozdan so'ng qayta urinib ko'ring." };
  }

  if (!initData.trim()) {
    return { error: "Telegram ma'lumotlari topilmadi." };
  }

  try {
    await signIn("telegram", { initData, redirectTo: "/admin" });
    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Telegram orqali kirish mumkin emas." };
    }
    throw error;
  }
}
