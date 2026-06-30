import { supabase } from '../../../services/SupabaseConfig.js';
import { pegarSessao } from '../../../services/pegarSessao.js';
import { buscarProfissionalPorEmail } from '../../../services/BuscarProfissionais.js';

export async function cadastrarColaborador(email, senha, nome_profissional, cargo, telefone_profissional, nivel_acesso) {
    const token = await pegarSessao();
    if (!token) {
        console.log(token);
        return;
    }

    const resposta = await fetch("/api/cadastro/profissional", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token.access_token}`
        },
        body: JSON.stringify({
            email: email,
            senha: senha,
            nome_profissional: nome_profissional,
            telefone_profissional: telefone_profissional,
            cargo: cargo,
            nivel_acesso: nivel_acesso
        })
    });

    const resultado = await resposta.json();

    if (!resultado.sucesso) {
        alert("Erro ao cadastrar: " + resultado.erro);
        return resultado;
    }

    // Busca o colaborador recém-criado
    const respostaInfos = await buscarProfissionalPorEmail(email);

    if (!respostaInfos.sucesso) {
        console.log(respostaInfos);
        return respostaInfos;
    }

    const email_gerente = token.user.email;
    console.log("Email do gerente:", email_gerente);

    // Busca o gerente
    const busca_gerente = await buscarProfissionalPorEmail(email_gerente);

    console.log(busca_gerente);

    if (!busca_gerente.sucesso) {
        alert("Gerente não encontrado.");
        return busca_gerente;
    }

    const salao_gerente = busca_gerente.profissional.salao_associado;

    console.log("Salão:", salao_gerente);

    const respostaVinculo = await vincularProfissionalAoSalao(
        respostaInfos.profissional.id_profissional,
        salao_gerente
    );

    console.log(respostaVinculo);

    return resultado;
}

export async function vincularProfissionalAoSalao(id_profissional, id_salao) {
    const token = await pegarSessao();
    const resposta = await fetch("/api/vincular/profissional", {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token.access_token}`
        },
        body: JSON.stringify({ id_profissional: id_profissional, id_salao: id_salao })
    });

    const resultado = await resposta.json();
    if (!resultado.sucesso) {
        alert('Erro ao vincular: ' + resultado.erro);
    }
    return resultado;
}

export async function buscarAgendamentosCliente(id_cliente) {
    const token = await pegarSessao();
    const resposta = await fetch(`/api/agendamentos/cliente/${id_cliente}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token.access_token}`
        }
    });

    const resultado = await resposta.json();
    if (!resultado.sucesso) {
        alert('Erro ao buscar agendamentos: ' + resultado.erro);
    }
    return resultado;
}
