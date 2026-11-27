import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  // React reads process.env.NODE_ENV, which does not exist in a browser page.
  define: { "process.env.NODE_ENV": JSON.stringify("production") },
  build: {
    outDir: "dist",
    emptyOutDir: false,
    lib: {
      entry: "src/pagi/standalone.ts",
      formats: ["iife"],
      name: "PagiWidget",
      fileName: () => "pagi-widget.js",
    },
  },
});
