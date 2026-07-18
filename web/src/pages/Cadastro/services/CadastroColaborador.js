import { pegarSessao } from '../../../services/pegarSessao.js';
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
                email,
                senha,
                nome_profissional,
                cargo,
                telefone_profissional,
                nivel_acesso
            })
        });

        const resultado = await resposta.json();

        if (!resposta.ok || !resultado.sucesso) {
            notificarErro(
                resultado.erro || "Não foi possível cadastrar o profissional"
            );
            return false;
        }

        return resultado

    } catch (erro) {
        console.error("Erro ao cadastrar colaborador:", erro)
        notificarErro("Não foi possível concluir o cadastro. Tente novamente mais tarde")
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
