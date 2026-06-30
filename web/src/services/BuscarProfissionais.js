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

export async function buscarTodosProfissionais() {
    const token = await pegarSessao();
    const resposta = await fetch("/api/buscar/profissionais/todos", {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token.access_token}`
        }
    });
    const resultado = await resposta.json();
    if (!resultado.sucesso) {
        alert('Profissionais não encontrados: ' + resultado.erro);
    }
    return resultado;
}
