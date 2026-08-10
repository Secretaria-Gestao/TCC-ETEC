import { pegarSessao } from "../../../services/pegarSessao"

export async function buscarServicos(profissionalSelecionado) {
    const sessao = await pegarSessao()

    if (!sessao) {
        console.log("sem sessão")
        return false
    }

    console.log("profissional selecionado: "+ profissionalSelecionado)

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
        console.log(resultado.erro)
    }

    return resultado.servicos
    
}