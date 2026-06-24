import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuração do Vite para desenvolvimento.
export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      '/cadastroUser': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },

      // Quando você tiver outras rotas Flask, pode colocar aqui também:
      // '/login': {
      //   target: 'http://127.0.0.1:5000',
      //   changeOrigin: true,
      // },
    },
  },
})