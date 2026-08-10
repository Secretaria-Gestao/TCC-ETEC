export async function buscarSalao(email) {
    const resposta = await fetch("/api/buscar/salao", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({email_profissional: email})
    })

    const dadosSalao = await resposta.json()

    if (!dadosSalao.sucesso) {
        return
    }

    return dadosSalao.salao
}
