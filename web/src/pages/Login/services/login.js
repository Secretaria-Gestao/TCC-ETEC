import { supabase } from '../../../services/SupabaseConfig.js';

export async function logar(email, senha) {
    // Login direto no Supabase Auth; em caso de sucesso o usuario segue para agendar.

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: senha
    });

    if (error) {
        alert('DEU RUIM LOGIN');
        console.log(error)
        return false
    }
    return true
}
