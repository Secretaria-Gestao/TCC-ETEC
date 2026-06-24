import { supabase } from './SupabaseConfig.js';

export async function cadastrar(nome, email, senha) {

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
        const resposta = await fetch('/cadastroUser', {
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
            window.location.replace('/agendamento');
        }

        else {
            alert("Deu erro ao cadastrar")
            console.log(resposta)
        }
    }
}

export async function logar(email, senha) {
    // Login direto no Supabase Auth; em caso de sucesso o usuario segue para agendar.

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: senha
    });

    if (error) {
        alert('DEU RUIM LOGIN');
        console.log(error)
    }
    
    else {
        alert('FOII LOGIN');
        // window.location.replace('/agendamento');
    }
}

