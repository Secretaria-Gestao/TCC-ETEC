import { supabase } from '../../../services/SupabaseConfig.js';
import { pegarSessao } from '../../../services/pegarSessao.js';
import { useNotificacaoStore } from '@/Notificacao/notificacaoStore.js';

// Para onde cada tipo de usuário vai depois do login
const rotasPorTipo = {
    cliente: '/agendamento',
    colaborador: '/colaborador/agenda',
    gerente: '/admin/agenda',
    administrador: '/admin/agenda'
}

async function chamarBack(rota) {
    const sessao = await pegarSessao()
    if (!sessao) return null

    const resposta = await fetch(rota, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${sessao.access_token}`
        }
    })

    const dados = await resposta.json()
    return { ok: resposta.ok && dados.sucesso, dados }
}

export async function logar(email, senha) { // Login com email e senha
    const mostrarNotificacao = useNotificacaoStore.getState().mostrarNotificacao

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: senha
    });

    if (error) {
        mostrarNotificacao({
            titulo: "Erro ao entrar na conta!",
            texto: "Verifique e preencha todos os campos tentando novamente"
        })
        return null
    }
    return data.user
}

export async function logarComGoogle() { // Login com Google
    await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${window.location.origin}/redirecionar`
        }
    });
}

async function buscarTipoUsuario() { // sem parâmetro: o back descobre quem é pelo token
    const resultado = await chamarBack('/api/login/tipo')
    return resultado?.ok ? resultado.dados.tipo : null
}

export async function buscarTipoDoUsuarioLogado() {
    return buscarTipoUsuario()
}

export async function buscarDestinoDoUsuario() { // Rota certa para quem está logado
    const mostrarNotificacao = useNotificacaoStore.getState().mostrarNotificacao

    const resultado = await chamarBack('/api/login/google')
    if (!resultado) return '/login'

    if (!resultado.ok) {
        mostrarNotificacao({
            titulo: "Erro ao finalizar cadastro!",
            texto: "Não foi possível criar sua conta, tente novamente"
        })
        await supabase.auth.signOut()
        return '/login'
    }

    return rotasPorTipo[resultado.dados.tipo]
}