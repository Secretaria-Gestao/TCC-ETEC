export async function mandarAgendamento(token, servicos, id_profissional, dia, horario, id_salao, preco) {

    const data_hora = `${dia}T${horario}`;

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
