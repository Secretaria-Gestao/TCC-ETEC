import { pegarSessao } from "./pegarSessao"
import { useNotificacaoStore } from "@/Notificacao"

export async function buscarSalao() {
    const mostrarNotificacao = useNotificacaoStore.getState().mostrarNotificacao
    const sessao = await pegarSessao()

    // O token da sessão é enviado para o back-end descobrir o usuário e o salão.
    if (!sessao || !sessao.access_token) {
        mostrarNotificacao({
            titulo: "Erro ao continuar na página",
            texto: "Sua sessão expirou, faça login novamente",
            mostrarBotao: true,
            textoBotao: "Voltar",
            funcaoBotao: () => (window.location.href = "/")
        })

        return
    }

    const resposta = await fetch("/api/buscar/salao", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${sessao.access_token}`
        }
    })

    const dadosSalao = await resposta.json()

    if (!dadosSalao.sucesso) return
    
    return dadosSalao.salao
}
