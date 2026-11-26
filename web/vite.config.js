import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  resolve: {
    alias: {
      // Atenção: "@" aponta para src/components (não para src). Ex.: "@/Notificacao" = src/components/Notificacao.
      // O jsconfig.json tem o mesmo caminho, para o editor entender o atalho.
      '@': fileURLToPath(new URL('./src/components', import.meta.url)),
    },
  },

  plugins: [
    react(),
    tailwindcss(),
  ],

  server: {
    // Só vale no npm run dev: encaminha /api para o Flask local. Em produção quem faz isso é o rewrite do vercel.json.
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
    },
  },
})
