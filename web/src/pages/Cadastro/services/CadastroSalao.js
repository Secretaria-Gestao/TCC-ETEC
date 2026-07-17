import notificarErro from './NotificacaoCadastro.js';

export async function cadastrarSalao(nome_salao, categoria_salao, endereco_salao) {
    try {
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
            notificarErro("Não foi possível cadastrar o salão")
            return false
        }

        const dados = await resposta.json()
        return dados.id_salao
        
    } catch (erro) {
        console.error("Erro ao cadastrar salão:", erro)
        notificarErro("Não foi possível cadastrar o salão. Tente novamente mais tarde")
        return false
    }
}
