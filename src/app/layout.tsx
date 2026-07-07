import type { ReactNode } from "react";
import "./globals.css";

// The root layout is intentionally minimal: locale-specific <html>/<body> is
// rendered by [locale]/layout.tsx, and the admin group renders its own shell.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
