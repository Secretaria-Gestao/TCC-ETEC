import { pegarSessao } from "../../../services/pegarSessao"
import { useNotificacaoStore } from "@/Notificacao"

// Estas funções fazem a ponte entre a página "Meus agendamentos" e as rotas protegidas do Flask.
export async function buscarAgendamentosCliente() {
    const mostrarNotificacao = useNotificacaoStore.getState().mostrarNotificacao
    const sessao = await pegarSessao()

    if (!sessao || !sessao.access_token) {
        mostrarNotificacao({
            titulo: "Erro ao continuar na página",
            texto: "Sua sessão expirou, faça login novamente",
            mostrarBotao: true,
            textoBotao: "Voltar",
            funcaoBotao: () => window.location.href = "/"
        })
        return []
    }

    try {
        // A API identifica o cliente pelo token, então não é preciso mandar o id.
        const resposta = await fetch("/api/agendamentos/cliente", {
            method: "GET",
            headers: { "Authorization": `Bearer ${sessao.access_token}` }
        })

        const resultado = await resposta.json()

        if (!resposta.ok || !resultado.sucesso) {
            mostrarNotificacao({
                titulo: "Falha ao buscar agendamentos",
                texto: resultado.erro || "Tente novamente"
            })
            return []
        }

        return resultado.agendamentos || []

    } catch (erro) {
        console.error("Erro ao buscar agendamentos:", erro)
        mostrarNotificacao({
            titulo: "Falha ao buscar agendamentos",
            texto: "Não foi possível se comunicar com o servidor"
        })
        return []
    }
}

export async function cancelarAgendamento(id_agendamento) {
    const mostrarNotificacao = useNotificacaoStore.getState().mostrarNotificacao
    const sessao = await pegarSessao()

    if (!sessao || !sessao.access_token) {
        mostrarNotificacao({
            titulo: "Erro ao continuar na página",
            texto: "Sua sessão expirou, faça login novamente",
            mostrarBotao: true,
            textoBotao: "Voltar",
            funcaoBotao: () => window.location.href = "/"
        })
        return false
    }

    try {
        const resposta = await fetch("/api/agendamentos/cancelar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessao.access_token}`
            },
            body: JSON.stringify({ id_agendamento })
        })

        const resultado = await resposta.json()

        if (!resposta.ok || !resultado.sucesso) {
            mostrarNotificacao({
                titulo: "Falha ao cancelar agendamento",
                texto: resultado.erro || "Tente novamente"
            })
            return false
        }

        mostrarNotificacao({
            titulo: "Agendamento cancelado!",
            texto: "O horário foi cancelado com sucesso"
        })

        return true

    } catch (erro) {
        console.error("Erro ao cancelar agendamento:", erro)
        mostrarNotificacao({
            titulo: "Falha ao cancelar agendamento",
            texto: "Não foi possível se comunicar com o servidor"
        })
        return false
    }
}
