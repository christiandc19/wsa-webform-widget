import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },

  build: {
    lib: {
      entry: "src/widget.jsx",
      name: "WebSmartAssistantForm",

      // Final JS output name
      fileName: () => "webform-widget.js",

      formats: ["iife"],
    },

    rollupOptions: {
      output: {
        /*
          Force the CSS bundle name so uploads stay consistent
          with chatbot-widget.css and survey-widget.css
        */
        assetFileNames: (assetInfo) => {
          const assetName = assetInfo.name || "";

          if (assetName.endsWith(".css")) {
            return "webform-widget.css";
          }

          return "assets/[name]-[hash][extname]";
        },
      },
    },
  },
});