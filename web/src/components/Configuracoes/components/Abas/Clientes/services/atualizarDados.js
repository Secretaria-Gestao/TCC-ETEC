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

    const { error: erroLogin } = await supabase.auth.signInWithPassword({
        email: sessao.user.email,
        password: senhaAtual
    })

    const { error } = await supabase.auth.updateUser({ password: novaSenha })

    if (erroLogin || error) {

        console.log(erroLogin)
        console.log(error)


        mostrarNotificacao({
            titulo: "Falha ao atualizar a senha",
            texto: "Verifique os campos e tente novamente"
        })

        return false
    }

    mostrarNotificacao({
        titulo: "Senha Atualizada"
    })

    return true

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

    const { error } = await supabase.auth.refreshSession({ refresh_token: sessao.refresh_token })

    if (!error) {
        mostrarNotificacao({
            titulo: "Email atualizado"
        })

        return true
    }
}

export async function mudarNome(novoNome) {
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

    const resposta = await fetch("/api/editar/nome", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${sessao.access_token}`
        },

        body: JSON.stringify({ novoNome })
    })

    const resultado = await resposta.json()

    if (!resultado.sucesso) {
        mostrarNotificacao({
            titulo: "Falha na atualização do nome",
            texto: "Tente novamente"
        })
        return false
    }


    mostrarNotificacao({
        titulo: "Nome atualizado"
    })

    return true

}
