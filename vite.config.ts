import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ⬇⬇ CRM localhost (Next.js) IP manzilini kiriting
const CRM = "http://192.168.10.35:3000";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: CRM,
        changeOrigin: true,
      },
    },
  },
});