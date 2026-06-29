import { supabase } from '../../../services/SupabaseConfig.js';

export async function cadastrarCliente(nome, email, senha) {

    // Primeiro cria o usuario no Supabase Auth; depois salva o perfil no backend.
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: senha
    });

    if (error) {
        alert('DEU RUIM CADASTRO');
        alert(error);
    }

    else {
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

        if (resposta.ok) {
            return true
        }

        else {
            alert("Deu erro ao cadastrar")
            console.log(resposta)
        }
    }
}

