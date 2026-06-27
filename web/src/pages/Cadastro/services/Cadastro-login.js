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

export async function cadastrarSalao(nome_salao, categoria_salao, endereco_salao,) {
    const resposta = await fetch('/api/cadastro/salao', {
        method: 'post',

        headers: {
            'Content-type': 'application/json'
        },

        body: JSON.stringify({
            nome_salao: nome_salao,
            categoria_salao: categoria_salao,
            endereco_salao: endereco_salao,
        })
    })

    if (!resposta.ok) {
        alert("Deu erro ao cadastrar o salão")
        alert(resposta)
    }

    else {
        const dados = await resposta.json()
        return dados.id_salao
    }
}

export async function cadastrarGerente(email_profissional, senha, nome_profissional, telefone_profissional, salao_associado) {
    const { data, error } = await supabase.auth.signUp({
        email: email_profissional,
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
                email_profissional: email_profissional,
                nome_profissional: nome_profissional,
                salao_associado: salao_associado,
                cargo: "gerente",
                telefone_profissional: telefone_profissional
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
        return "deu bom"
    }

}
