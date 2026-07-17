import { supabase } from '../../../services/SupabaseConfig.js';
import notificarErro from './NotificacaoCadastro.js';

export async function cadastrarCliente(nome, email, senha) {
    try {
        // Primeiro cria o usuario no Supabase Auth; depois salva o perfil no backend.
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: senha
        });

        if (error) {
            notificarErro()
            return false
        }

        // Mantem a tabela "clientes" sincronizada com o usuario criado no Auth.
        const resposta = await fetch('/api/cadastro/cliente', {
            method: 'post',

            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data.session?.access_token || ''}`
            },

            body: JSON.stringify({
                id_cliente: data.user.id,
                nome_cliente: nome,
                email_cliente: email
            })
        })

        if (!resposta.ok) {
            notificarErro()
            return false
        }

        return true
    } catch (erro) {
        console.error("Erro ao cadastrar cliente:", erro)
        notificarErro("Não foi possível concluir o cadastro. Tente novamente mais tarde")
        return false
    }
}
