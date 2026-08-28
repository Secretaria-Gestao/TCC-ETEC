import { pegarSessao } from "../../../services/pegarSessao"

export async function mostrarMembros() {
    const sessao = await pegarSessao()

    if (!sessao || !sessao.access_token) {
        console.error("Sessão ausente ao buscar os membros")
        return null
    }

    try {
        const respostaMembros = await fetch("/api/mostrar/membros", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessao.access_token}`
            }
        })

        const resultadoMembros = await respostaMembros.json()

        if (!respostaMembros.ok || !resultadoMembros.sucesso) {
            console.error("Erro ao buscar membros:", resultadoMembros.erro)
            return null
        }

        const respostaAgendamentos = await fetch("/api/agendamentos/salao", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessao.access_token}`
            }
        })

        const resultadoAgendamentos = await respostaAgendamentos.json()

        if (!respostaAgendamentos.ok || !resultadoAgendamentos.sucesso) {
            console.error("Erro ao buscar membros:", resultadoAgendamentos.erro)
            return null
        }

        return [resultadoMembros.membros, resultadoAgendamentos.agendamentos]

    } catch (erro) {
        console.error("Erro ao buscar membros:", erro)
        return null
    }

    
}
