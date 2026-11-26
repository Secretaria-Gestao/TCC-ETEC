import { supabase } from "../../../../../../services/SupabaseConfig";

import { useNotificacaoStore } from "@/Notificacao";
import { pegarSessao } from "../../../../../../services/pegarSessao";

// Funções que a tela de Configurações chama para alterar os dados do usuário logado.
// Todas começam igual: pegam a sessão e, se ela expirou, avisam e devolvem null.
// Retorno: true = deu certo, false = o servidor recusou (a notificação de erro já foi mostrada)
// e null = sessão expirada. Quem chama costuma só testar "if (resposta)".
// O token da sessão vai no cabeçalho Authorization: é por ele que o back-end sabe de quem é a conta.

// Diferente das outras, a senha não passa pelo nosso back-end: quem troca é o próprio Supabase Auth.
// Antes disso pedimos um novo login com a senha atual, para provar que é a própria pessoa e não alguém
// que só encontrou o computador com a sessão aberta.
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

    if (erroLogin) {
        mostrarNotificacao({
            titulo: "Senha atual incorreta",
            texto: "Verifique a senha atual e tente novamente"
        })

        return false
    }

    const { error } = await supabase.auth.updateUser({ password: novaSenha })

    if (error) {
        console.log(error.code, error.message)

        mostrarNotificacao({
            titulo: "Falha ao atualizar a senha",
            texto: error.code === "same_password"
                ? "A nova senha deve ser diferente da atual"
                : "Verifique os campos e tente novamente"
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

    // O email já mudou no Auth, então renovamos a sessão para o token novo vir com o email atualizado.
    // Se a renovação falhar, o email foi trocado do mesmo jeito: devolvemos true e pedimos um novo login.
    const { error } = await supabase.auth.refreshSession()

    if (error) {
        mostrarNotificacao({
            titulo: "Email atualizado",
            texto: "Faça login novamente para ver a mudança"
        })

        return true
    }

    mostrarNotificacao({
        titulo: "Email atualizado"
    })

    return true
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

export async function mudarTelefone(novoTelefone) {
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

    const resposta = await fetch("/api/editar/telefone", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${sessao.access_token}`
        },

        body: JSON.stringify({ novoTelefone })
    })

    const resultado = await resposta.json()

    if (!resultado.sucesso) {
        mostrarNotificacao({
            titulo: "Falha na atualização do telefone",
            texto: resultado.erro ?? "Tente novamente"
        })
        return false
    }

    mostrarNotificacao({
        titulo: "Telefone atualizado"
    })

    return true
}

export async function mudarFoto(novaFoto) {
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

    // Arquivo vai como multipart (FormData), não como JSON. Por isso aqui não definimos o Content-Type:
    // o navegador coloca sozinho, junto com o "boundary" que separa as partes do envio.
    const form = new FormData()

    form.append("foto", novaFoto)

    const resposta = await fetch("/api/editar/foto", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${sessao.access_token}`
        },

        body: form
    })

    const resultado = await resposta.json()

    if (!resultado.sucesso) {
        mostrarNotificacao({
            titulo: "Falha na atualização da foto",
            texto: resultado.erro ?? "Tente novamente"
        })
        return false
    }

    mostrarNotificacao({
        titulo: "Foto atualizada"
    })

    return true
}

export async function mudarSalao(nomeSalao, enderecoSalao) {
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

    const resposta = await fetch("/api/editar/salao", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${sessao.access_token}`
        },

        body: JSON.stringify({ nomeSalao, enderecoSalao })
    })

    const resultado = await resposta.json()

    if (!resultado.sucesso) {
        mostrarNotificacao({
            titulo: "Falha na atualização do salão",
            texto: resultado.erro ?? "Tente novamente"
        })
        return false
    }

    mostrarNotificacao({
        titulo: "Salão atualizado"
    })

    return true
}

// As duas exclusões abaixo não mostram notificação de sucesso: a conta já foi bloqueada no servidor,
// então quem chama (Seguranca.jsx) faz o signOut e leva a pessoa para fora da tela em seguida.
// Para excluirSalao, a confirmação é a senha (conta com email) ou o nome do salão (conta Google);
// o componente manda um dos dois e deixa o outro vazio.
export async function excluirSalao(senha, nomeSalao) {
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

    const resposta = await fetch("/api/deletar/salao", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${sessao.access_token}`
        },

        body: JSON.stringify({ senha, nomeSalao })
    })

    const resultado = await resposta.json()

    if (!resultado.sucesso) {
        mostrarNotificacao({
            titulo: "Falha ao excluir o salão",
            texto: resultado.erro ?? "Tente novamente"
        })
        return false
    }

    return true
}

export async function excluirConta() {
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

    const resposta = await fetch("/api/deletar/conta", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${sessao.access_token}`
        }
    })

    const resultado = await resposta.json()

    if (!resultado.sucesso) {
        mostrarNotificacao({
            titulo: "Falha ao excluir a conta",
            texto: "Tente novamente"
        })
        return false
    }

    return true
}
