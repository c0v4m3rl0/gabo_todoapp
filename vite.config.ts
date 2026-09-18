import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
plugins: [
react(),

VitePWA({
  registerType: "autoUpdate",

  includeAssets: [
    "favicon.ico",
  ],

  manifest: {
    name: "Mi Todo App",
    short_name: "Todo App",
    description:
      "Aplicación de tareas PWA",
    theme_color: "#4f46e5",
    background_color: "#f8fafc",
    display: "standalone",
    start_url: "/",
    scope: "/",

    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },

  workbox: {
    globPatterns: [
      "**/*.{js,css,html,ico,png,svg}",
    ],
  },
}),

],
});