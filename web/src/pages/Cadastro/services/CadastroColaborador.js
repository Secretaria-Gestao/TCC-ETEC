import { supabase } from '../../../services/SupabaseConfig.js';

function getToken() {
    const tokenRaw = localStorage.getItem('sb-qtgubbbrntnltrpyywqx-auth-token'); 
    const token = JSON.parse(tokenRaw);
    return token?.access_token || '';
}

const API_URL = 'http://127.0.0.1:5000';

export async function cadastrarColaborador({ email, senha, nome_profissional, cargo, telefone_profissional }) {
    const resposta = await fetch(`${API_URL}/api/cadastrar/profissional`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ email, senha, nome_profissional, cargo, telefone_profissional })
    });

    const resultado = await resposta.json();
    if (!resultado.sucesso) {
        alert('Erro ao cadastrar: ' + resultado.erro);
    }
    return resultado;
}

export async function buscarProfissionalPorEmail(email) {
    const resposta = await fetch(`${API_URL}/api/profissionais`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${getToken()}`,
            'X-Email': email
        }
    });
    const resultado = await resposta.json();
    if (!resultado.sucesso) {
        alert('Profissional não encontrado: ' + resultado.erro);
    }
    return resultado;
}

export async function vincularProfissionalAoSalao(id_profissional, id_salao) {
    const resposta = await fetch(`${API_URL}/api/vincular/profissional`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ id_profissional, id_salao })
    });

    const resultado = await resposta.json();
    if (!resultado.sucesso) {
        alert('Erro ao vincular: ' + resultado.erro);
    }
    return resultado;
}

export async function buscarAgendamentosCliente(id_cliente) {
    const resposta = await fetch(`${API_URL}/api/agendamentos/cliente/${id_cliente}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${getToken()}`
        }
    });

    const resultado = await resposta.json();
    if (!resultado.sucesso) {
        alert('Erro ao buscar agendamentos: ' + resultado.erro);
    }
    return resultado;
}