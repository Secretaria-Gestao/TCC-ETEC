import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuracao do Vite para desenvolvimento.
export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      '/api/cadastro/cliente': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
      '/api/cadastro/gerente': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
      '/api/cadastro/salao': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },

    },
  },
})
