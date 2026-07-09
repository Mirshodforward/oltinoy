import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { env } from "@/lib/env";
import { isAdminTelegramUser } from "@/lib/admin-telegram";
import { validateTelegramWebAppInitData } from "@/lib/telegram-webapp";

const credsSchema = z.object({ username: z.string().min(1), password: z.string().min(1) });

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: env.AUTH_SECRET,
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  pages: { signIn: "/admin/login" },
  cookies: {
    sessionToken: {
      options: { httpOnly: true, sameSite: "lax", path: "/", secure: env.NODE_ENV === "production" },
    },
  },
  providers: [
    Credentials({
      id: "credentials",
      credentials: { username: {}, password: {} },
      authorize: async (creds) => {
        const parsed = credsSchema.safeParse(creds);
        if (!parsed.success) return null;
        const user = await db.adminUser.findUnique({ where: { username: parsed.data.username } });
        if (!user) return null;
        const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
        if (!ok) return null;
        return { id: String(user.id), name: user.username };
      },
    }),
    Credentials({
      id: "telegram",
      credentials: { initData: {} },
      authorize: async (creds) => {
        const initData = String(creds?.initData ?? "");
        const tgUser = validateTelegramWebAppInitData(initData, env.BOT_TOKEN);
        if (!tgUser || !isAdminTelegramUser(tgUser.userId)) return null;

        const user = await db.adminUser.findUnique({ where: { username: env.ADMIN_USERNAME } });
        if (!user) return null;
        return { id: String(user.id), name: user.username };
      },
    }),
  ],
  callbacks: {
    authorized: ({ auth }) => !!auth?.user,
  },
});
