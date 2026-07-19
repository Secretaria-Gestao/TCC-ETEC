import { pegarSessao } from "./pegarSessao.js";

export async function buscarProfissionalPorEmail(email) {
    const token = await pegarSessao();
    const resposta = await fetch("/api/buscar/profissionais/email", {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token.access_token}`,
            'X-Email': email
        }
    });
    const resultado = await resposta.json();
    if (!resultado.sucesso) {
        alert('Profissional não encontrado: ' + resultado.erro);
    }
    return resultado;
}

export async function buscarTodosProfissionais(id_salao) {
    if (!id_salao) {
        return false;
    }

    try {
        const token = await pegarSessao();

        if (!token) {
            return false;
        }

        const resposta = await fetch("/api/buscar/profissionais/todos", {
            method: 'POST',
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${token.access_token}`
            },
            body: JSON.stringify({
                id_salao: id_salao
            })
        });
        const resultado = await resposta.json();

        if (!resultado.sucesso) {
            console.log(resultado.erro);
            return false;
        }

        return resultado;

    } catch (erro) {
        console.log("Erro ao buscar profissionais:", erro);
        return false;
    }
}
