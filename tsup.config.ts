import { defineConfig } from "tsup";

// Compiles the standalone grammY bot process (PM2 "oltinoy-bot").
// Path aliases (@/*) are resolved by esbuild via tsconfig; runtime deps
// (@prisma/client, grammy, sharp, …) stay external and load from node_modules.
export default defineConfig({
  entry: ["src/bot/index.ts"],
  format: ["cjs"],
  outDir: "dist/bot",
  target: "node22",
  platform: "node",
  sourcemap: true,
  clean: true,
  tsconfig: "tsconfig.json",
  skipNodeModulesBundle: true,
});
