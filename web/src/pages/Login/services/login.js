import { supabase } from '../../../services/SupabaseConfig.js';
import { useNotificacaoStore } from '@/Notificacao/notificacaoStore.js';

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
    await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${window.location.origin}/agendamento` // Manda pra pagina de agendamento apos o login com google
        }
    });
}

// Descobre para onde mandar o usuário depois do login, pelo cargo dele
export async function descobrirRotaPosLogin() {
    const { data } = await supabase.auth.getSession()
    const id = data.session?.user.id

    if (!id) return '/login'

    // Quem tem linha em "profissionais" é admin/gerente/profissional; quem não tem é cliente
    const { data: prof } = await supabase
        .from('profissionais')
        .select('nivel_acesso')
        .eq('id_profissional', id)
        .maybeSingle() // devolve null (sem erro) se não encontrar

    if (!prof) return '/agendamento/meus-agendamentos'                 // cliente
    if (Number(prof.nivel_acesso) <= 2) return '/admin/agenda'         // admin (1) e gerente (2)
    return '/colaborador/agenda'                                      // profissional (3)
}
