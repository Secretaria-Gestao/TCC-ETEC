import { supabase } from "./SupabaseConfig.js";

export async function buscarHistorico() {
    const {data} = await supabase.auth.refreshSession()
    if (!data.sessao) return []

    const id_cliente = data.sessao.user.id
    const token = data.sessao.access_token

    try {
        const resposta = await fetch(`/api/agendamentos/historico/${sessao.id_usuario}`, {headers: {'Authorization': `Bearer ${token}`} }            
        )
        const resultado = await resposta.json()
        if (!resultado.sucesso) {
            console.error('Erro ao buscar historico:', resultado.erro)
            return []
        }
        return resultado.historico
    }
    catch (erro) {
        console.error('Erro na requisição do historico:', erro)
        return []
    }
}
