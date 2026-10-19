import { pegarSessao } from "../../../services/pegarSessao"

export async function buscarServicos(profissionalSelecionado) {
    const sessao = await pegarSessao()

    if (!sessao) {
        console.log("sem sessão")
        return false
    }

    const resposta = await fetch("/api/buscar/servicos-agendamento",{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${sessao.access_token}`
        },
        body: JSON.stringify({
            "profissional_selecionado": profissionalSelecionado
        })
    })

    const resultado = await resposta.json()

    if (!resultado.sucesso) {
        return []
    }

    return resultado.servicos
    
}