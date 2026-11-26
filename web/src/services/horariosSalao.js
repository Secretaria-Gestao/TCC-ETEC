import { supabase } from './SupabaseConfig.js'

// Pega o token da sessão atual
async function pegarToken() {
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token
}

// Lê os horários de um salão (devolve [] se ainda não configurou)
export async function buscarHorarios(idSalao) {
  const token = await pegarToken()
  const resposta = await fetch(`/api/salao/${idSalao}/horarios`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  const resultado = await resposta.json()
  if (!resultado.sucesso) throw new Error(resultado.erro)
  return resultado.horarios
}

// Salva os 7 dias de uma vez
export async function salvarHorarios(horarios) {
  const token = await pegarToken()
  const resposta = await fetch('/api/editar/salao-horarios', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ horarios })
  })
  return await resposta.json() // { sucesso, erro? }
}