import { supabase } from './SupabaseConfig.js'

function intervaloDoMes(mes) {
  const inicio = new Date(mes.getFullYear(), mes.getMonth(), 1)
  const fim = new Date(mes.getFullYear(), mes.getMonth() + 1, 1)
  return `inicio=${encodeURIComponent(inicio.toISOString())}&fim=${encodeURIComponent(fim.toISOString())}`
}

async function chamar(rota, mes) {
  const { data } = await supabase.auth.getSession()
  if (!data.session) throw new Error('Sessão expirada')

  const resposta = await fetch(`${rota}?${intervaloDoMes(mes)}`, {
    headers: { Authorization: `Bearer ${data.session.access_token}` },
  })
  const resultado = await resposta.json()
  if (!resultado.sucesso) {
    const erro = new Error(resultado.erro || 'Erro na requisição')
    erro.status = resposta.status
    throw erro
  }
  return resultado
}

export const buscarAcertos = (mes) => chamar('/api/financeiro/acertos', mes)
export const buscarMinhaRenda = (mes) => chamar('/api/financeiro/minha-renda', mes)