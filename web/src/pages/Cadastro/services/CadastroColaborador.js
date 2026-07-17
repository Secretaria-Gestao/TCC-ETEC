import { pegarSessao } from '../../../services/pegarSessao.js';
import { buscarProfissionalPorEmail } from '../../../services/BuscarProfissionais.js';
import notificarErro from './NotificacaoCadastro.js';

export async function cadastrarColaborador(email, senha, nome_profissional, cargo, telefone_profissional, nivel_acesso) {
    try {
        const token = await pegarSessao();
        
        if (!token) {
            notificarErro("Sua sessão expirou. Entre novamente para continuar")
            return false;
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

        if (!resposta.ok || !resultado.sucesso) {
            notificarErro()
            return false;
        }

        // Busca o colaborador recém-criado
        const respostaInfos = await buscarProfissionalPorEmail(email);

        if (!respostaInfos.sucesso) {
            notificarErro("O colaborador foi criado, mas não foi possível consultar seus dados")
            return false;
        }

        const email_gerente = token.user.email;

        // Busca o gerente
        const busca_gerente = await buscarProfissionalPorEmail(email_gerente);

        if (!busca_gerente.sucesso) {
            notificarErro("Não foi possível localizar o gerente responsável")
            return false;
        }

        const salao_gerente = busca_gerente.profissional.salao_associado;

        const respostaVinculo = await vincularProfissionalAoSalao(
            respostaInfos.profissional.id_profissional,
            salao_gerente
        );

        if (!respostaVinculo?.sucesso) {
            return false
        }

        return resultado;

    } catch (erro) {
        console.error("Erro ao cadastrar colaborador:", erro)
        notificarErro("Não foi possível concluir o cadastro. Tente novamente mais tarde")
        return false
    }
}

export async function vincularProfissionalAoSalao(id_profissional, id_salao) {
    try {
        const token = await pegarSessao();

        if (!token) {
            notificarErro("Sua sessão expirou. Entre novamente para continuar")
            return false
        }

        const resposta = await fetch("/api/vincular/profissional", {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.access_token}`
            },
            body: JSON.stringify({ id_profissional: id_profissional, id_salao: id_salao })
        });

        const resultado = await resposta.json();

        if (!resposta.ok || !resultado.sucesso) {
            notificarErro("O colaborador foi criado, mas não foi possível vinculá-lo ao salão")
            return false
        }

        return resultado;

    } catch (erro) {
        console.error("Erro ao vincular colaborador ao salão:", erro)
        notificarErro("Não foi possível vincular o colaborador ao salão")
        return false
    }
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
