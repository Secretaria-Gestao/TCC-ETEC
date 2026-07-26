import { pegarSessao } from "../../../services/pegarSessao";
import { useNotificacaoStore } from "@/Notificacao";

export async function criarServico(data) {
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
        const resposta = await fetch("/api/criar/servico-fornecido", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessao.access_token}`
            },

            body: JSON.stringify({
                "nome_servico": data.nome_servico,
                "preco_servico": data.preco_servico,
                "duracao": data.duracao,
                // A lista vazia permite criar o serviço e associar alguém depois.
                "profissionais_associados": data.profissionais_associados || []
            })
        })

        const resultado = await resposta.json()

        if (!resposta.ok || !resultado.sucesso) {
            mostrarNotificacao({
                titulo: "Falha ao criar serviço",
                texto: resultado.erro || "Cheque os campos e tente novamente"
            })
            return false
        }

        mostrarNotificacao({
            titulo: "Serviço criado!",
            texto: "O serviço foi adicionado ao salão"
        })

        return true

    } catch (erro) {
        console.error("Erro ao criar serviço:", erro)
        mostrarNotificacao({
            titulo: "Falha ao criar serviço",
            texto: "Não foi possível se comunicar com o servidor"
        })
        return false
    }
}

export async function editarServico(data) {
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
        const resposta = await fetch("/api/editar/servico-fornecido", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessao.access_token}`
            },
            body: JSON.stringify({
                "id_servico": data.id_servico,
                "nome_servico": data.nome_servico,
                "preco_servico": data.preco_servico,
                "duracao": data.duracao,
                // False desativa o serviço; não significa que ele foi removido.
                "em_funcionamento": data.em_funcionamento,
                "profissionais_associados": data.profissionais_associados || []
            })
        })

        const resultado = await resposta.json()

        if (!resposta.ok || !resultado.sucesso) {
            mostrarNotificacao({
                titulo: "Falha ao editar serviço",
                texto: resultado.erro || "Cheque os campos e tente novamente"
            })
            return false
        }

        mostrarNotificacao({
            titulo: data.em_funcionamento ? "Serviço atualizado!" : "Serviço desativado!",
            texto: data.em_funcionamento
                ? "As alterações foram salvas"
                : "O serviço continua cadastrado, mas não está em funcionamento"
        })

        return true

    } catch (erro) {
        console.error("Erro ao editar serviço:", erro)
        mostrarNotificacao({
            titulo: "Falha ao editar serviço",
            texto: "Não foi possível se comunicar com o servidor"
        })
        return false
    }
}

export async function deletarServicos(ids_servicos) {
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
        const resposta = await fetch("/api/deletar/servico-fornecido", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessao.access_token}`
            },

            body: JSON.stringify({
                // A tela permite selecionar e remover mais de um serviço.
                ids_servicos
            })
        })

        const resultado = await resposta.json()

        if (!resposta.ok || !resultado.sucesso) {
            mostrarNotificacao({
                titulo: "Falha ao remover serviço",
                texto: resultado.erro || "Tente novamente"
            })
            return false
        }

        mostrarNotificacao({
            titulo: "Serviço removido!",
            texto: ids_servicos.length > 1
                ? "Os serviços selecionados foram removidos"
                : "O serviço selecionado foi removido"
        })

        return true

    } catch (erro) {
        console.error("Erro ao remover serviço:", erro)
        mostrarNotificacao({
            titulo: "Falha ao remover serviço",
            texto: "Não foi possível se comunicar com o servidor"
        })
        return false
    }
}
