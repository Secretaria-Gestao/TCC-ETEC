import { pegarMeuPerfil } from '../../../services/pegarMeuPerfil.js';
import { pegarSessao } from '../../../services/pegarSessao.js';
import { supabase } from '../../../services/SupabaseConfig.js';
import { cadastrarCliente } from '../../Cadastro/services/CadastroCliente.js';
import { useNotificacaoStore } from '@/Notificacao/notificacaoStore.js';

// Para onde cada tipo de usuário vai depois do login
const rotasPorTipo = {
    cliente: '/agendamento',
    colaborador: '/colaborador/agenda',
    gerente: '/admin/agenda',
    administrador: '/admin/agenda'
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
    const mostrarNotificacao = useNotificacaoStore.getState().mostrarNotificacao

    // O Supabase só aceita a URL completa; depois do Google o usuário volta para /redirecionar
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

// Tradução do nivel_acesso da tabela profissionais
const tiposPorNivel = {
    1: 'administrador',
    2: 'gerente',
    3: 'colaborador'
}

// Tipo de quem está logado e a rota certa para ele. Sem login, tipo é null e o destino é /login
export async function buscarDestinoDoUsuario() {
    const perfil = await pegarMeuPerfil()

    if (perfil?.id_profissional) {
        const tipo = tiposPorNivel[perfil.nivel_acesso]
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