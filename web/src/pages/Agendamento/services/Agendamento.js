export async function mandarAgendamento(token, servicos, id_profissional, dia, horario, id_salao, preco) {

    if (!dia || !horario) {
        return {ok: false, erro: "Dia e horário são obrigatórios."}
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
