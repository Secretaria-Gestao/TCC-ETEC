import { pegarSessao } from "../../../services/pegarSessao";

export async function mandarAgendamento(servicos, id_profissional, dia, horario, id_salao, preco) {

    const mostrarNotificacao = useNotificacaoStore.getState().mostrarNotificacao
    const sessao = await pegarSessao()

    // O token da sessão é enviado para o back-end descobrir o usuário e o salão.
    if (!sessao || !sessao.access_token) {
        mostrarNotificacao({
            titulo: "Erro ao continuar na página",
            texto: "Sua sessão expirou, faça login novamente",
            mostrarBotao: true,
            textoBotao: "Voltar",
            funcaoBotao: () => (window.location.href = "/")
        })

        return
    }

    if (!dia || !horario) {
        return { ok: false, erro: "Dia e horário são obrigatórios." }
    }

    const data_hora = new Date(`${dia}T${horario}`).toISOString();

    const resposta = await fetch('/api/agendando', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },

        body: JSON.stringify({
            servicos,
            id_profissional,
            id_salao,
            data_hora,
            preco
        })

    })

    return resposta
}
