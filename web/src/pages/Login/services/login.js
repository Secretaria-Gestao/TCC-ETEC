import { pegarMeuPerfil } from '../../../services/pegarMeuPerfil.js';
import { pegarSessao } from '../../../services/pegarSessao.js';
import { supabase } from '../../../services/SupabaseConfig.js';
import { cadastrarCliente } from '../../Cadastro/services/CadastroCliente.js';
import { useNotificacaoStore } from '@/Notificacao/notificacaoStore.js';

// Para onde cada tipo de usuário vai depois do login.
// Os tipos são os mesmos da BarraLateral: "cliente", "admin", "gerente" ou "profissional".
export const rotasPorTipo = {
    cliente: '/agendamento/meus-agendamentos',
    admin: '/admin/agenda',
    gerente: '/admin/agenda',
    profissional: '/colaborador/agenda'
}

// Tradução do nivel_acesso da tabela profissionais
const tiposPorNivel = {
    1: 'admin',
    2: 'gerente',
    3: 'profissional'
}

export async function logar(email, senha) { // Login direto no Supabase Auth
    const mostrarNotificacao = useNotificacaoStore.getState().mostrarNotificacao

    const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: senha
    });

    if (error) {
        mostrarNotificacao({
            titulo: "Erro ao entrar na conta!",
            texto: "Verifique e preencha todos os campos tentando novamente"
        })
        return false
    }
    return true
}

export async function logarComGoogle() { // Login com Google no Supabase Auth
    const mostrarNotificacao = useNotificacaoStore.getState().mostrarNotificacao

    // Depois do Google o usuário volta para /redirecionar, que descobre a rota certa pelo perfil.
    // O Supabase só aceita a URL completa.
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${window.location.origin}/redirecionar`
        }
    });

    if (error) {
        mostrarNotificacao({
            titulo: "Erro ao entrar com o Google!",
            texto: "Tente novamente em alguns instantes"
        })
    }
}

// Tipo de quem está logado e a rota certa para ele.
// Sem login, o tipo é null e o destino é /login.
export async function buscarDestinoDoUsuario() {
    const perfil = await pegarMeuPerfil()

    // Profissional removido pelo administrador continua com login no Auth, mas não pode mais entrar
    if (perfil?.removido) {
        await supabase.auth.signOut()
        useNotificacaoStore.getState().mostrarNotificacao({
            titulo: "Conta desativada!",
            texto: "Esta conta foi removida do salão"
        })
        return { tipo: null, destino: '/login' }
    }

    if (perfil?.id_profissional) {
        const tipo = tiposPorNivel[Number(perfil.nivel_acesso)] ?? 'profissional'
        return { tipo, destino: rotasPorTipo[tipo] }
    }

    if (perfil?.id_cliente) return { tipo: 'cliente', destino: rotasPorTipo.cliente }

    // Logado no Auth mas sem perfil: primeira vez entrando com o Google, cadastra como cliente
    if (await pegarSessao()) {
        if (await cadastrarCliente(null, null, null, true)) {
            return { tipo: 'cliente', destino: rotasPorTipo.cliente }
        }
        await supabase.auth.signOut()
    }

    return { tipo: null, destino: '/login' }
}
