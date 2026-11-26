import { supabase } from './SupabaseConfig.js'

// Salva o acordo de um profissional; devolve { sucesso, erro? }
export async function salvarAcordo(id_profissional, tipo_pagamento, valor_comissao) {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token

  const resposta = await fetch('/api/profissionais/acordo-financeiro', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ id_profissional, tipo_pagamento, valor_comissao })
  })
  return await resposta.json()
}