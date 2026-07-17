import { supabase } from '../../../services/SupabaseConfig.js';
import notificarErro from './NotificacaoCadastro.js';

export async function cadastrarGerente(email_profissional, senha, nome_profissional, telefone_profissional, salao_associado) {
    try {
        const email = email_profissional.toLowerCase().trim();
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: senha
        });

        if (error) {
            notificarErro()
            return false
        }

        // Mantem a tabela "Profissionais" sincronizada com o usuario criado no Auth.
        const resposta = await fetch('/api/cadastro/gerente', {
            method: 'post',

            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data.session?.access_token || ''}`
            },

            body: JSON.stringify({
                id_profissional: data.user.id,
                email_profissional: email,
                nome_profissional: nome_profissional,
                salao_associado: salao_associado,
                cargo: "gerente",
                nivel_acesso: "1",
                telefone_profissional: telefone_profissional
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
