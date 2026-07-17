export async function buscarSalao(email) {
    const resposta = await fetch("/api/buscar/salao", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({email_profissional: email})
    })

    const infos_salao = await resposta.json()

    if (!infos_salao.sucesso) {
        return
    }

    return infos_salao.salao
}
