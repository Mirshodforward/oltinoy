import { redirect } from "next/navigation";
import Script from "next/script";
import { auth } from "@/auth";
import { LoginForm } from "./LoginForm";
import { TelegramAutoLogin } from "./TelegramAutoLogin";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/admin");

  return (
    <>
      <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />

      {/* Cream ground with the golden-moon arc cropped by the viewport. */}
      <div className="panel-cream relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
        <div className="arc pointer-events-none absolute -left-40 -top-52 w-[34rem] opacity-70" aria-hidden="true" />
        <div className="arc pointer-events-none absolute -bottom-56 -right-44 w-[38rem] opacity-45" aria-hidden="true" />

        <div className="relative w-full max-w-sm">
          <LoginForm />
          <TelegramAutoLogin />
          <p className="mt-6 text-center text-xs" style={{ color: "var(--fg-subtle)" }}>
            Bu sahifa faqat administratorlar uchun.
          </p>
        </div>
      </div>
    </>
  );
}
