import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";
import components from "unplugin-vue-components/vite";
import autoImport from "unplugin-auto-import/vite";
import { VarletImportResolver } from "@varlet/import-resolver";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    components({
      resolvers: [VarletImportResolver()],
    }),
    autoImport({
      resolvers: [VarletImportResolver({ autoImport: true })],
    }),
    VitePWA({
      registerType: "prompt",
      includeAssets: ["vite.svg", "icon-192x192.png", "icon-512x512.png"],
      manifest: {
        name: "减肥助手",
        short_name: "减肥助手",
        description: "AI减肥助手",
        theme_color: "#f9fafb",
        background_color: "#f9fafb",
        display: "standalone",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable any",
          },
          {
            src: "/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable any",
          },
        ],
      },
      workbox: {
        skipWaiting: false,
        clientsClaim: false,
      },
    }),
  ],
  css: {
    preprocessorOptions: {
      less: {
        additionalData: `@import "@/assets/css/theme.less";`,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
});
