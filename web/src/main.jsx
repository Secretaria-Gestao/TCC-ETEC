import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './global.css'
import './fonts.css'
import App from './App.jsx'

// Cache das consultas do React Query. É compartilhado pelo app inteiro: por exemplo, o perfil do
// usuário (useMeuPerfil) é buscado uma vez e reaproveitado pela barra lateral e pelas configurações.
const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
