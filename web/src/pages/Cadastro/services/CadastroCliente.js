import { pegarSessao } from '../../../services/pegarSessao.js';
import { supabase } from '../../../services/SupabaseConfig.js';
import notificarErro from './NotificacaoCadastro.js';

export async function cadastrarCliente(nome, email, senha, comGoogle = false) {
    try {
        // Primeiro cria o usuario no Supabase Auth; depois salva o perfil no backend.

        if (!comGoogle) {
            const { error } = await supabase.auth.signUp({
                email: email,
                password: senha
            });

            if (error) {
                notificarErro()
                console.log(error)
                return false
            }
        }

        const sessao = await pegarSessao()

        if (comGoogle) { // Nome e email vêm da conta do Google
            email = sessao.user.email
            nome = sessao.user.user_metadata.full_name || email.split("@")[0]
        }

        // Mantem a tabela "clientes" sincronizada com o usuario criado no Auth.
        const resposta = await fetch('/api/cadastro/cliente', {
            method: 'post',

            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessao.access_token || ''}`
            },

            body: JSON.stringify({
                id_cliente: sessao.user.id,
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
