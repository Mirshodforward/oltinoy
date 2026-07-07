import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Admin is always Uzbek and never localized; skip next-intl rewriting there.
  // Auth is enforced separately in the (admin) layout via Auth.js.
  if (pathname.startsWith("/admin") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  return intlMiddleware(req);
}

export const config = {
  // Match all pathnames except static assets, _next internals and uploads.
  matcher: ["/((?!_next|uploads|.*\\..*).*)"],
};
