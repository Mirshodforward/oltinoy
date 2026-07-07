import localFont from "next/font/local";

/** Display serif — high-contrast, characterful. Used for headings + prices. */
export const fraunces = localFont({
  src: [
    { path: "./fonts/fraunces-latin.woff2", weight: "300 700", style: "normal" },
    { path: "./fonts/fraunces-latin-ext.woff2", weight: "300 700", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
  preload: true, // preload the display face (Latin subset) — it drives the LCP heading/price
  fallback: ["Georgia", "Times New Roman", "serif"],
});

/** Body grotesk — clean, legible, wide language coverage. */
export const manrope = localFont({
  src: [
    { path: "./fonts/manrope-latin.woff2", weight: "300 800", style: "normal" },
    { path: "./fonts/manrope-latin-ext.woff2", weight: "300 800", style: "normal" },
  ],
  variable: "--font-body",
  display: "swap",
  preload: false,
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "Arial", "sans-serif"],
});
