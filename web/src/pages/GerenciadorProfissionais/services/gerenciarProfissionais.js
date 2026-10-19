import { pegarSessao } from "../../../services/pegarSessao"
import { useNotificacaoStore } from "@/Notificacao"

// Estas funções fazem a ponte entre o painel de edição e as rotas protegidas do Flask.
export async function editarProfissional(data) {
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
        const resposta = await fetch("/api/editar/profissional", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessao.access_token}`
            },
            body: JSON.stringify({
                id_profissional: data.id_profissional,
                nome_profissional: data.nome_profissional,
                email_profissional: data.email_profissional,
                cargo: data.cargo,
                nivel_acesso: data.nivel_acesso,
                status: data.status
            })
        })

        const resultado = await resposta.json()

        if (!resposta.ok || !resultado.sucesso) {
            mostrarNotificacao({
                titulo: "Falha ao editar profissional",
                texto: resultado.erro || "Cheque os campos e tente novamente"
            })
            return false
        }

        mostrarNotificacao({
            titulo: "Profissional atualizado!",
            texto: "As alterações foram salvas"
        })

        return true

    } catch (erro) {
        console.error("Erro ao editar profissional:", erro)
        mostrarNotificacao({
            titulo: "Falha ao editar profissional",
            texto: "Não foi possível se comunicar com o servidor"
        })
        return false
    }
}

export async function removerProfissional(id_profissional) {
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
        const resposta = await fetch("/api/deletar/profissional", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessao.access_token}`
            },
            body: JSON.stringify({ id_profissional })
        })

        const resultado = await resposta.json()

        if (!resposta.ok || !resultado.sucesso) {
            mostrarNotificacao({
                titulo: "Falha ao remover profissional",
                texto: resultado.erro || "Tente novamente"
            })
            return false
        }

        mostrarNotificacao({
            titulo: "Profissional removido!",
            texto: "O profissional foi removido do salão"
        })

        return true

    } catch (erro) {
        console.error("Erro ao remover profissional:", erro)
        mostrarNotificacao({
            titulo: "Falha ao remover profissional",
            texto: "Não foi possível se comunicar com o servidor"
        })
        return false
    }
}
