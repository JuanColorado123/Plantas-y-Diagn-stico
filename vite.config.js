import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/trefle-api': {  // Cambia el prefijo para evitar conflictos
        target: 'https://trefle.io/api/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/trefle-api/, ''),
        secure: false
      }
    }
  }
});