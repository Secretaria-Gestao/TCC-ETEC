import { supabase } from "../../../../../../services/SupabaseConfig";

import { useNotificacaoStore } from "@/Notificacao";
import { pegarSessao } from "../../../../../../services/pegarSessao";

export async function mudarSenha(senhaAtual, novaSenha) {
    const mostrarNotificacao = useNotificacaoStore.getState().mostrarNotificacao
    const sessao = await pegarSessao()

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

    const resposta = await fetch("/api/editar/senha", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${sessao.access_token}`
        },

        body: JSON.stringify({ senhaAtual, novaSenha })
    })

    const resultado = await resposta.json()

    if (!resultado.sucesso) {
        mostrarNotificacao({
            titulo: "Falha na atualização da senha",
            texto: "Cheque os campos e tente novamente"
        })
        return
    }

    mostrarNotificacao({
        titulo: "Senha Atualizada"
    })

}

export async function mudarEmail(novoEmail) {
    const mostrarNotificacao = useNotificacaoStore.getState().mostrarNotificacao
    const sessao = await pegarSessao()

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

    const resposta = await fetch("/api/editar/email", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${sessao.access_token}`
        },

        body: JSON.stringify({ novoEmail })
    })

    const resultado = await resposta.json()

    if (!resultado.sucesso) {
        mostrarNotificacao({
            titulo: "Falha na atualização do email",
            texto: "Cheque os campos e tente novamente"
        })
        return false
    }

    mostrarNotificacao({
        titulo: "Email atualizado"
    })

    return true
}