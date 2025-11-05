import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// Vite config — dev da CORSni chetlab o‘tish uchun proxy
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const CRM = env.VITE_CRM_URL || "http://localhost:3000";
  const AI = env.VITE_AI_PROXY || env.VITE_AI_URL || "http://213.148.21.100:9000";

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: CRM,
          changeOrigin: true,
        },
        // Devda AI’ga ham relative /ai orqali proxy qilamiz
        "/ai": {
          target: AI,
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/ai/, ""),
        },
      },
    },
  };
});
