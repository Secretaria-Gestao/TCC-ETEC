import { pegarSessao } from "../../../services/pegarSessao"
import { useNotificacaoStore } from "@/Notificacao"

export async function buscarServicos() {
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
        return null
    }

    try {
        const resposta = await fetch("/api/buscar/servicos-fornecidos", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessao.access_token}`
            }
        })

        const resultado = await resposta.json()

        // resposta.ok verifica o status HTTP e resultado.sucesso verifica a
        // resposta criada pelo nosso próprio back-end.
        if (!resposta.ok || !resultado.sucesso) {
            mostrarNotificacao({
                titulo: "Falha ao carregar os serviços",
                texto: resultado.erro || "Tente novamente"
            })
            return null
        }

        return resultado

    } catch (erro) {
        console.error("Erro ao buscar serviços:", erro)
        mostrarNotificacao({
            titulo: "Falha ao carregar os serviços",
            texto: "Não foi possível se comunicar com o servidor"
        })
        return null
    }
}
