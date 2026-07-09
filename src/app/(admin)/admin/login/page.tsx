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
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <LoginForm />
          <TelegramAutoLogin />
        </div>
      </div>
    </>
  );
}
