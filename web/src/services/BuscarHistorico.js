import { supabase } from "./SupabaseConfig.js";

// Busca os atendimentos concluídos do cliente logado.
// Agora LANÇA erro (em vez de devolver []), para a tela diferenciar "erro" de "vazio".
export async function buscarHistorico() {
    // Renova o token antes de chamar a API (evita 401 por token expirado)
    const { data } = await supabase.auth.refreshSession()

    // O nome certo é "session" (antes estava "sessao")
    if (!data.session) throw new Error('Sessão expirada. Faça login novamente.')

    const id_cliente = data.session.user.id // o id vem de user.id
    const token = data.session.access_token

    // URL igual à rota do Flask: /api/agendamentos/cliente/<id>/historico
    const resposta = await fetch(`/api/agendamentos/cliente/${id_cliente}/historico`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })

    const resultado = await resposta.json()

    if (!resultado.sucesso) {
        throw new Error(resultado.erro || 'Erro ao buscar histórico')
    }

    return resultado.historico
}