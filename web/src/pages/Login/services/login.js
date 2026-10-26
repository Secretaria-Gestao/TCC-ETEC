import { supabase } from '../../../services/SupabaseConfig.js';
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
    await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${window.location.origin}/redirecionar`
        }
    });
}

// Tradução do nivel_acesso da tabela profissionais
const tiposPorNivel = {
    1: 'administrador',
    2: 'gerente',
    3: 'colaborador'
}

async function buscarTipoUsuario(idUsuario) { // Procura o usuário nas duas tabelas
    const [cliente, profissional] = await Promise.all([
        supabase.from('clientes').select('id_cliente').eq('id_cliente', idUsuario).maybeSingle(),
        supabase.from('profissionais').select('id_profissional, nivel_acesso').eq('id_profissional', idUsuario).maybeSingle()
    ])

    if (cliente.data) return 'cliente'
    if (profissional.data) return tiposPorNivel[profissional.data.nivel_acesso] ?? 'colaborador'
    return null
}

export async function buscarTipoDoUsuarioLogado() { // Tipo de quem está logado, ou null
    const { data } = await supabase.auth.getUser()
    if (!data.user) return null
    return buscarTipoUsuario(data.user.id)
}

export async function buscarDestinoDoUsuario() { // Rota certa para quem está logado
    const mostrarNotificacao = useNotificacaoStore.getState().mostrarNotificacao

    const { data } = await supabase.auth.getUser()
    const usuario = data.user

    if (!usuario) return '/login'

    let tipo = await buscarTipoUsuario(usuario.id)

    if (!tipo) { // Primeira vez entrando com o Google: cadastra como cliente
        const { error } = await supabase.from('clientes').insert({
            id: usuario.id,
            nome: usuario.user_metadata.full_name,
            email: usuario.email
        })

        if (error) {
            mostrarNotificacao({
                titulo: "Erro ao finalizar cadastro!",
                texto: "Não foi possível criar sua conta, tente novamente"
            })
            await supabase.auth.signOut()
            return '/login'
        }

        tipo = 'cliente'
    }

    return rotasPorTipo[tipo]
}