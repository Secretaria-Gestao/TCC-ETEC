import { supabase } from '../../../services/SupabaseConfig.js';
import notificarErro from './NotificacaoCadastro.js';

export async function cadastrarGerente(
    email_profissional, password,
    nome_profissional, telefone_profissional,
    nome_salao, categoria, endereco
) {
    try {
        const email = email_profissional.toLowerCase().trim();

        let sessao = null

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (!error) {
            sessao = data.session
        } else {
            const { data, error } = await supabase.auth.signUp({
                email,
                password
            })

            if (error) {
                notificarErro()
                return false
            }

            sessao = data.session
        }

        if (!sessao) {
            notificarErro("Nao foi possivel obter a sessao da conta")
            return false
        }

        // Mantem a tabela "Profissionais" sincronizada com o usuario criado no Auth.
        const resposta = await fetch('/api/cadastro/gerente', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessao.access_token}`
            },

            body: JSON.stringify({
                nome_profissional,
                telefone_profissional,
                nome_salao,
                categoria,
                endereco
            })
        })

        if (!resposta.ok) {
            notificarErro()
            return false
        }

        return true

    } catch (erro) {
        console.error("Erro ao cadastrar gerente:", erro)
        notificarErro("Não foi possível concluir o cadastro. Tente novamente mais tarde")
        return false
    }
}
