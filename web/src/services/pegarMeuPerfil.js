import { pegarSessao } from './pegarSessao.js'
// Essa função busca os dados do profissional ou admin que está logado.
// Ela usa o token da sessão ativa para o back-end identificar quem está pedindo
// e retornar os dados corretos da tabela profissionais (nome, cargo, salao_associado, etc).
// É essencial para o admin descobrir o id_salao e buscar todos os agendamentos do salão.
export async function pegarMeuPerfil() {
    const sessao = await pegarSessao()
    // Se não há sessão ativa, retorna null — o componente que chamar essa função
    // deve tratar esse caso e redirecionar para o login.
    if (!sessao) return null

    try {
        const resposta = await fetch('/api/perfil/meu-perfil', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${sessao.access_token}` }
        })

        const resultado = await resposta.json()

        if (!resultado.sucesso) {
            console.error('Erro ao buscar perfil:', resultado.erro)
            return null
        }

        // Retorna o objeto com todos os campos da tabela profissionais.
        return resultado.perfil

    } catch (erro) {
        console.error('Erro na requisição do perfil:', erro)
        return null
    }
}