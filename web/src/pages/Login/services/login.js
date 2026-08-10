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
