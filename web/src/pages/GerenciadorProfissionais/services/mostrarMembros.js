import { pegarSessao } from "../../../services/pegarSessao"

export async function mostrarMembros() {
    // Esta função centraliza as duas consultas necessárias para montar a página de membros.
    const sessao = await pegarSessao()

    if (!sessao || !sessao.access_token) {
        console.error("Sessão ausente ao buscar os membros")
        return null
    }

    const agora = new Date()


    const inicioMes = new Date(
        agora.getFullYear(),
        agora.getMonth(),
        1
    )

    const inicioProximoMes = new Date(
        agora.getFullYear(),
        agora.getMonth() + 1,
        1
    )

    // O resumo considera somente o mês atual; o fim é exclusivo para não misturar meses.
    const argumentos = new URLSearchParams({
        inicio: inicioMes.toISOString(),
        fim: inicioProximoMes.toISOString()
    })

    try {
        // A API identifica o salão pelo token e devolve apenas os profissionais daquele salão.
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
            return []
        }

        // A segunda chamada busca somente os agendamentos usados no destaque mensal.
        const respostaAgendamentos = await fetch(`/api/agendamentos/salao?${argumentos.toString()}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessao.access_token}`
            }
        })

        const resultadoAgendamentos = await respostaAgendamentos.json()

        if (!respostaAgendamentos.ok || !resultadoAgendamentos.sucesso) {
            console.error("Erro ao buscar agendamentos:", resultadoAgendamentos.erro)
            return []
        }

        // O componente pai espera os membros na posição 0 e a agenda na posição 1.
        return [resultadoMembros.membros, resultadoAgendamentos.agendamentos]

    } catch (erro) {
        console.error("Erro ao buscar membros:", erro)
        return []
    }


}
