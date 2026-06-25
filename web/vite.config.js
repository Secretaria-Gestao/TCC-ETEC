import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuracao do Vite para desenvolvimento.
export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      '/api/cadastro/cliente': {
        target: 'https://secretaria-gestao-api.vercel.app',
        changeOrigin: true,
      },
      '/api/cadastro/gerente': {
        target: 'https://secretaria-gestao-api.vercel.app',
        changeOrigin: true,
      },
      '/api/cadastro/salao': {
        target: 'https://secretaria-gestao-api.vercel.app',
        changeOrigin: true,
      },

    },
  },
})
