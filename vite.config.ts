import { copyFile } from "node:fs/promises";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

function appShell() {
  let outputDirectory = "";

  return {
    name: "app-shell",
    apply: "build" as const,
    configResolved(config: { root: string; build: { outDir: string } }) {
      outputDirectory = path.resolve(config.root, config.build.outDir);
    },
    async closeBundle() {
      await copyFile(
        path.join(outputDirectory, "index.html"),
        path.join(outputDirectory, "_app-shell.html"),
      );
    },
  };
}

export default defineConfig({
  plugins: [
    tailwindcss(),
    tanstackRouter({ autoCodeSplitting: true }),
    react(),
    appShell(),
  ],
  build: {
    rollupOptions: {
      output: {
        // Keep font files grouped under assets/fonts while retaining Vite's
        // content hash used by the immutable /assets/* cache policy.
        assetFileNames: (assetInfo) => {
          const name = assetInfo.names?.[0] ?? "";
          return /\.(woff2?|ttf|otf|eot)$/.test(name)
            ? "assets/fonts/[name]-[hash][extname]"
            : "assets/[name]-[hash][extname]";
        },
      },
    },
  },
});
