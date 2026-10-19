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