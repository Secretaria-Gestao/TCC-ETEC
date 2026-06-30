import { supabase } from '../../../services/SupabaseConfig.js';

export async function cadastrarGerente(email_profissional, senha, nome_profissional, telefone_profissional, salao_associado) {
    const email = email_profissional.toLowerCase().trim();
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: senha
    });

    if (error) {
        alert('Deu erro ao cadastrar o gerente');
        alert(error);
    }

    else {
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
            const erro =  await resposta.json()
            alert(erro)
            return false
        }

        return true
    }
}

