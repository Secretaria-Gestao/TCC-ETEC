import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './global.css'
import './fonts.css'
import App from './App.jsx'
import { supabase } from './services/SupabaseConfig.js'

// Cache das consultas do React Query. É compartilhado pelo app inteiro: por exemplo, o perfil do
// usuário (useMeuPerfil) é buscado uma vez e reaproveitado pela barra lateral e pelas configurações.
const queryClient = new QueryClient()

// Quando alguém entra ou sai da conta, o perfil guardado no cache passa a ser de outra pessoa.
// Sem isso a barra lateral podia mostrar o menu do usuário anterior por até 5 minutos.
supabase.auth.onAuthStateChange((evento) => {
  if (evento === 'SIGNED_OUT') queryClient.removeQueries({ queryKey: ["perfil"] })
  if (evento === 'SIGNED_IN' || evento === 'USER_UPDATED') queryClient.invalidateQueries({ queryKey: ["perfil"] })
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
