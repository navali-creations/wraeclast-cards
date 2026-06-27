import fs from "node:fs";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

function preloadCdnPlugin(): Plugin {
  return {
    name: "preload-cdn",
    transformIndexHtml() {
      const poe1CardsPackage = JSON.parse(
        fs.readFileSync(
          "node_modules/@navali/poe1-divination-cards/package.json",
          "utf-8",
        ),
      );
      const base = `https://cdn.jsdelivr.net/npm/@navali/poe1-divination-cards@${poe1CardsPackage.version}`;
      return [
        {
          tag: "link",
          attrs: {
            rel: "preload",
            as: "fetch",
            href: `${base}/data/cards.json`,
            crossorigin: "",
          },
          injectTo: "head",
        },
        {
          tag: "link",
          attrs: {
            rel: "preload",
            as: "image",
            href: `${base}/data/Divination_card_frame.png`,
          },
          injectTo: "head",
        },
      ];
    },
  };
}

export default defineConfig({
  plugins: [tailwindcss(), react(), tanstackRouter(), preloadCdnPlugin()],
});
