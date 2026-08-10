import { pegarSessao } from "../../../services/pegarSessao.js"

export async function buscarSaloes() {
    try {
        const token = await pegarSessao()

        if (!token) {
            return false
        }

        const resposta = await fetch("/api/buscar/saloes", {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token.access_token}`
            }
        })

        const resultado = await resposta.json()

        if (!resultado.sucesso) {
            console.log(resultado.erro)
            return false
        }

        return resultado.saloes

    } catch (erro) {
        console.log("Erro ao buscar salões:", erro)
        return false
    }

}
