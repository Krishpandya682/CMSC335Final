import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// vite.config.js
import allowedHostsPlugin from "vite-plugin-allowed-hosts";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    allowedHostsPlugin({
      hosts: "all",
    }),
  ],
});
