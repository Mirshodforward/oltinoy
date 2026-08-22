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
  // Fraunces ships no Cyrillic, so every Russian heading used to land on Arial.
  // "Oltinoy Cyr Display" (Playfair Display, declared in globals.css with a
  // Cyrillic unicode-range) picks those glyphs up instead.
  fallback: ["Oltinoy Cyr Display", "Georgia", "Times New Roman", "serif"],
  // The auto-generated metric fallback is Arial-based and would win over the
  // Cyrillic face for exactly the glyphs it is meant to cover.
  adjustFontFallback: false,
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
  fallback: ["Oltinoy Cyr Body", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Arial", "sans-serif"],
  adjustFontFallback: false,
});
