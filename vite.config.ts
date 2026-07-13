import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    tanstackRouter({ autoCodeSplitting: true }),
    react(),
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
