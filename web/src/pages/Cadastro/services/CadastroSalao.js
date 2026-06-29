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
